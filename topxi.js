/* topxi.js — Top XI: Budget Cap Challenge.
 * Build the best XI you can from the full World Cup player pool within a
 * fixed rating budget — every player's rating is also their "cost", so
 * picking a 97-rated legend eats far more budget than a squad of solid
 * 78s. Forces the star-vs-depth trade-off the original "Top XI" spec asked
 * for, using only data that actually exists in this app (player ratings) —
 * challenge types like "Under-23" or "left-footed" would need age/foot
 * data this app doesn't have, so this pass ships the one challenge type
 * that's honestly buildable from what's already loaded, rather than
 * faking a filter with fabricated data.
 *
 * Self-contained IIFE, same shape as the other new modes this session. */
(function (W) {
  "use strict";

  var ALL_VIEWS = ["homeView","setupView","draftView","resultsView","mpView","leagueView","boardView","rwView","dvcView","euroView","dailyView","challengeView","f501View","rrView","gridView","mineView","tenView"];
  var STATS_KEY = "topxi_stats_v1";
  var BUDGET = 850;
  var FORMATION = { GK: 1, DEF: 4, MID: 3, FWD: 3 }; // simple broad-position slot counts, 11 total

  var ICO = {
    replay: '<svg class="rescue-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/></svg>'
  };

  function esc(s) { return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  function loadStats() { try { return JSON.parse(localStorage.getItem(STATS_KEY) || "{}"); } catch (e) { return {}; } }
  function saveStats(s) { try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch (e) {} }
  function recordResult(totalRating) {
    var s = loadStats();
    s.best = Math.max(s.best || 0, totalRating);
    s.attempts = (s.attempts || 0) + 1;
    saveStats(s);
    return s;
  }

  /* Flat pool of every World Cup player, deduped by name (keep highest
     rating if the same name appears in multiple squads/years). */
  var poolCache = null;
  function pool() {
    if (poolCache) return poolCache;
    var DATA = W.WORLD_CUP_DATA || {};
    var byName = {};
    Object.keys(DATA).forEach(function (country) {
      var years = DATA[country].years || {};
      Object.keys(years).forEach(function (y) {
        years[y].forEach(function (pl) {
          if (!byName[pl.n] || (pl.r || 0) > byName[pl.n].r) byName[pl.n] = { n: pl.n, p: pl.p, r: pl.r || 75, country: country, year: y };
        });
      });
    });
    poolCache = Object.keys(byName).map(function (n) { return byName[n]; }).sort(function (a, b) { return (b.r || 0) - (a.r || 0); });
    return poolCache;
  }

  /* ---- State ----
     Solo: build one squad. Pass & Play: two players build SEPARATE squads
     from the SAME shared budget/pool/formation, alternating single picks
     snake-draft-style (once a player's picked, they're off the board for
     BOTH sides, same as a real draft) — whoever finishes first still waits
     for the other, then totals are compared for a winner. */
  var ST = null;
  var pendingMode = "solo";

  function newState(mode, playerNames) {
    mode = mode || "solo";
    var names = playerNames || (mode === "passplay" ? ["Player 1", "Player 2"] : ["You"]);
    return {
      phase: "play",
      mode: mode,
      players: names.map(function (n) { return { name: n, squad: [], budgetLeft: BUDGET }; }),
      turnIdx: 0,
      winnerIdx: null,
      outcome: null
    };
  }

  function isMultiplayer() { return ST.players.length > 1; }
  function activePlayer() { return ST.players[ST.turnIdx]; }
  function allPicked() { return ST.players.reduce(function (s, p) { return s.concat(p.squad); }, []); }
  function advanceTurn() { ST.turnIdx = (ST.turnIdx + 1) % ST.players.length; }

  /* ---- Online 1v1 ----
     The player pool is entirely derived from static World Cup data
     already loaded on both devices, so — unlike Fill the Grid/Minefield
     — there's no board/grid to generate and broadcast; both sides
     already agree on the full candidate pool before the match even
     starts. Online here only needs to sync WHO picked WHAT and in what
     order, so every pick is broadcast and replayed via the same
     pickPlayer() logic on the peer's device. Removal is disabled in
     online (see removePlayer) to avoid an undo-after-broadcast desync. */
  var ONL = null;
  var myIdx = 0;

  function onlineReset() {
    ONL = { role: null, status: "idle", code: null, joinCode: "", joinError: null, myName: "You", oppName: "Opponent" };
  }

  function bindNetForTopXI() {
    var Net = W.ElxiNet;
    if (!Net) return;
    Net.onStatus = function (state, info) {
      if (!ONL) return;
      if (ONL.role === "host") {
        if (state === "waiting" || state === "loading") { ONL.status = state; if (info && info.code) ONL.code = info.code; }
        else if (state === "connected") { ONL.status = "connected"; }
        else if (state === "error") { ONL.status = "error"; ONL.errMsg = (info && info.message) || "Something went wrong."; }
      } else if (ONL.role === "guest") {
        if (state === "loading" || state === "joining") ONL.status = state;
        else if (state === "connected") { ONL.status = "connected"; }
        else if (state === "error") { ONL.status = "idle"; ONL.joinError = (info && info.message) || "Couldn't connect."; }
      }
      renderOnlineFlow();
    };
    Net.onPeerLeave = function () {
      if (W.flToast) W.flToast("Your opponent disconnected.");
      if (ST && ST.phase === "play") { ST.phase = "result"; ST.winnerIdx = myIdx; render(); }
      else { ST = null; onlineReset(); renderModeSelect(); }
    };
    Net.onData = function (msg) { handleOnlineMessage(msg); };
  }

  function handleOnlineMessage(msg) {
    if (!msg || !msg.t) return;
    if (msg.t === "tx_name" && ONL) {
      ONL.oppName = msg.name || "Opponent";
      if (ST) { ST.players[1 - myIdx].name = ONL.oppName; render(); }
      return;
    }
    if (msg.t === "tx_start") {
      myIdx = 1;
      ST = newState("online", [ONL.oppName, ONL.myName]);
      render();
      return;
    }
    if (msg.t === "tx_pick") {
      if (!ST) return;
      pickPlayer(msg.name, true);
      return;
    }
  }

  function slotCounts(p) {
    var c = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
    p.squad.forEach(function (pl) { c[pl.p] = (c[pl.p] || 0) + 1; });
    return c;
  }
  function openSlots(p, pos) { return (FORMATION[pos] || 0) - (slotCounts(p)[pos] || 0); }
  function totalRating(p) { return p.squad.reduce(function (s, pl) { return s + pl.r; }, 0); }

  function pickPlayer(name, fromRemote) {
    if (!ST || ST.phase !== "play") return;
    if (ST.mode === "online" && !fromRemote && ST.turnIdx !== myIdx) return; // not your turn
    var p = activePlayer();
    if (p.squad.length >= 11) return;
    var pl = pool().filter(function (x) { return x.n === name; })[0];
    if (!pl) return;
    if (allPicked().some(function (x) { return x.n === pl.n; })) return; // already picked (either side)
    if (openSlots(p, pl.p) <= 0) return; // no slot left for their position
    if (pl.r > p.budgetLeft) return; // can't afford
    if (ST.mode === "online" && !fromRemote && W.ElxiNet) W.ElxiNet.send({ t: "tx_pick", name: name });
    p.squad.push(pl);
    p.budgetLeft -= pl.r;
    if (p.squad.length === 11) {
      if (isMultiplayer()) {
        if (ST.players.every(function (x) { return x.squad.length === 11; })) { endGame(); return; }
        advanceTurn();
        // skip any player who's already finished
        while (activePlayer().squad.length === 11) advanceTurn();
      } else {
        endGame();
        return;
      }
    } else if (isMultiplayer()) {
      advanceTurn();
      while (activePlayer().squad.length === 11) advanceTurn();
    }
    render();
  }

  function removePlayer(name) {
    /* Not available in online — undo-after-broadcast would desync the two
       peers' pool-exclusion state, so this pass keeps online picks final
       (same "no take-backs" simplification real snake drafts often use). */
    if (!ST || ST.mode === "online") return;
    var p = activePlayer();
    var idx = p.squad.findIndex(function (x) { return x.n === name; });
    if (idx === -1) return;
    p.budgetLeft += p.squad[idx].r;
    p.squad.splice(idx, 1);
    render();
  }

  function endGame() {
    ST.phase = "result";
    if (isMultiplayer()) {
      var totals = ST.players.map(totalRating);
      if (totals[0] === totals[1]) ST.winnerIdx = null;
      else ST.winnerIdx = totals[0] > totals[1] ? 0 : 1;
    } else {
      ST.statLine = recordResult(totalRating(ST.players[0]));
    }
    render();
  }

  /* ---- Rendering ---- */
  function root() { return document.getElementById("topxiBody"); }

  function render() {
    var el = root();
    if (!el || !ST) return;
    if (ST.phase === "play") el.innerHTML = playHTML();
    else if (ST.phase === "result") el.innerHTML = resultHTML();
    wire();
  }

  function modeSelectHTML() {
    return '<div class="fb501-setup squad-card">' +
      '<div class="squad-head"><h2>Top XI — Budget Cap</h2></div>' +
      '<div class="sub">How do you want to play?</div>' +
      '<div class="fb501-mode-select">' +
        '<button class="fb501-mode-btn" data-mode="solo"><span class="fb501-mode-btn-name">Solo</span><span class="fb501-mode-btn-desc">Build the best XI you can within budget.</span></button>' +
        '<button class="fb501-mode-btn" data-mode="passplay"><span class="fb501-mode-btn-name">Pass &amp; Play</span><span class="fb501-mode-btn-desc">Two players, one device — snake-draft your own XIs, highest total wins.</span></button>' +
        '<button class="fb501-mode-btn" data-mode="online"><span class="fb501-mode-btn-name">Online 1v1</span><span class="fb501-mode-btn-desc">Head-to-head with a friend, anywhere — share a code.</span></button>' +
      '</div>' +
    '</div>';
  }

  function introHTML() {
    var stats = loadStats();
    var statLine = stats.best ? (stats.attempts + " attempts · best total " + stats.best) : "";
    return '<div class="fb501-setup squad-card">' +
      '<div class="squad-head"><h2>Top XI — Budget Cap</h2></div>' +
      '<div class="sub">Build the best XI you can with a ' + BUDGET + '-point rating budget. Every player\'s rating is their cost — balance stars against squad depth.</div>' +
      (statLine ? '<div class="fl-mode-stat" style="margin-bottom:10px;">' + esc(statLine) + '</div>' : '') +
      '<button class="btn-primary" id="topxiStart" style="width:100%">Start building →</button>' +
    '</div>';
  }

  function playHTML() {
    var multi = isMultiplayer();
    /* Online: always show MY OWN squad/budget (not whoever's turn it is) —
       the local player needs to see their own progress while waiting,
       not stare at the opponent's screen. Pass & Play still shows
       whoever's turn it is, since that IS the person looking at the
       screen right now. */
    var p = (ST.mode === "online") ? ST.players[myIdx] : activePlayer();
    var counts = slotCounts(p);
    var slotsHTML = ["GK", "DEF", "MID", "FWD"].map(function (pos) {
      return '<span class="fl-mode-stat">' + pos + ' ' + counts[pos] + '/' + FORMATION[pos] + '</span>';
    }).join(" ");
    var squadHTML = p.squad.map(function (pl) {
      return '<div class="player">' +
        '<span class="pos ' + pl.p + '">' + pl.p + '</span>' +
        '<div class="player-body"><span class="pname">' + esc(pl.n) + '</span><span class="player-era">' + esc(pl.country) + ' · ' + esc(pl.year) + ' · ' + pl.r + '</span></div>' +
        (ST.mode !== "online" ? '<button class="rescue-ico topxi-remove" data-name="' + esc(pl.n) + '" style="background:none;border:none;cursor:pointer;color:var(--warning);">✕</button>' : '') +
      '</div>';
    }).join("");
    var myTurn = ST.mode !== "online" || ST.turnIdx === myIdx;
    var taken = allPicked();
    var candidates = pool().filter(function (pl) {
      return !taken.some(function (s) { return s.n === pl.n; }) && openSlots(p, pl.p) > 0 && pl.r <= p.budgetLeft;
    }).slice(0, 30);
    var candHTML = candidates.map(function (pl) {
      return '<div class="player" data-pick="' + esc(pl.n) + '">' +
        '<span class="pos ' + pl.p + '">' + pl.p + '</span>' +
        '<div class="player-body"><span class="pname">' + esc(pl.n) + '</span><span class="player-era">' + esc(pl.country) + ' · ' + esc(pl.year) + '</span></div>' +
        '<span class="fl-mode-stat">' + pl.r + '</span>' +
      '</div>';
    }).join("");
    /* If budget/slots leave nobody affordable, this isn't a dead end — the
       player can always remove a pick to free budget — but that recovery
       path needs to be explained, not left to be discovered by accident
       (the same "never leave a silent dead end" principle behind the
       draft soft-lock fix earlier this session). */
    var stuck = candidates.length === 0 && p.squad.length < 11;
    var headTitle = ST.mode === "online" ? ('Budget left: ' + p.budgetLeft) : multi ? (esc(p.name) + "'s turn — Budget left: " + p.budgetLeft) : ('Budget left: ' + p.budgetLeft);
    return '<div class="fb501-play squad-card">' +
      '<div class="squad-head"><h2>' + headTitle + '</h2></div>' +
      (multi ? '<div class="sub">' + ST.players.map(function (x) { return esc(x.name) + ': ' + x.squad.length + '/11'; }).join(' · ') + '</div>' : '') +
      (ST.mode === "online" && !myTurn ? '<div class="sub" style="color:var(--warning)">Waiting for your opponent\'s pick…</div>' : '') +
      '<div class="sub">' + slotsHTML + '</div>' +
      (squadHTML ? '<div class="fb501-history">' + squadHTML + '</div>' : '') +
      (stuck ? '<div class="sub" style="color:var(--warning)">Nobody affordable fits your remaining slots — remove a player above (✕) to free up budget and try a cheaper combination.</div>' : '') +
      '<div class="squad-search-wrap"><input class="squad-search" id="topxiSearch" type="text" placeholder="Search affordable players…" autocomplete="off" /></div>' +
      '<div class="fb501-history" id="topxiCandList">' + candHTML + '</div>' +
      '<button class="btn-ghost fb501-quit">Quit to menu</button>' +
    '</div>';
  }

  function resultHTML() {
    var multi = isMultiplayer();
    if (multi) {
      var totals = ST.players.map(totalRating);
      var title = ST.winnerIdx === null ? "It's a tie!" : (esc(ST.players[ST.winnerIdx].name) + " wins!");
      var squadsHTML = ST.players.map(function (p, i) {
        var sq = p.squad.map(function (pl) {
          return '<div class="player"><span class="pos ' + pl.p + '">' + pl.p + '</span><div class="player-body"><span class="pname">' + esc(pl.n) + '</span></div><span class="fl-mode-stat">' + pl.r + '</span></div>';
        }).join("");
        return '<div class="sub" style="margin-top:8px;font-weight:700;">' + esc(p.name) + ' — total ' + totals[i] + '</div><div class="fb501-history" style="max-height:150px;">' + sq + '</div>';
      }).join("");
      return '<div class="nopicks-popup fb501-result-popup"><div class="nopicks-popup-inner" style="max-width:340px;">' +
        '<div class="nopicks-icon">' + (ST.winnerIdx === null ? "🤝" : "🏆") + '</div>' +
        '<div class="nopicks-title">' + title + '</div>' +
        squadsHTML +
        '<div class="nopicks-actions">' +
          (ST.mode !== "online" ? '<button class="nopicks-btn nopicks-respin" id="topxiRematch">' + ICO.replay + ' Build again</button>' : '') +
          '<button class="nopicks-btn nopicks-auto" id="topxiBackToMenu">Menu</button>' +
        '</div>' +
      '</div></div>';
    }
    var total = totalRating(ST.players[0]);
    var squadHTML = ST.players[0].squad.map(function (p) {
      return '<div class="player"><span class="pos ' + p.p + '">' + p.p + '</span><div class="player-body"><span class="pname">' + esc(p.n) + '</span></div><span class="fl-mode-stat">' + p.r + '</span></div>';
    }).join("");
    return '<div class="nopicks-popup fb501-result-popup"><div class="nopicks-popup-inner" style="max-width:340px;">' +
      '<div class="nopicks-icon">🏆</div>' +
      '<div class="nopicks-title">XI complete!</div>' +
      '<div class="nopicks-sub">Total rating: ' + total + (ST.statLine ? (' · Best: ' + ST.statLine.best) : '') + '</div>' +
      '<div class="fb501-history" style="max-height:220px;">' + squadHTML + '</div>' +
      '<div class="nopicks-actions">' +
        '<button class="nopicks-btn nopicks-respin" id="topxiRematch">' + ICO.replay + ' Build again</button>' +
        '<button class="nopicks-btn nopicks-auto" id="topxiBackToMenu">Menu</button>' +
      '</div>' +
    '</div></div>';
  }

  function wire() {
    var el = root();
    if (!el) return;
    Array.prototype.forEach.call(el.querySelectorAll(".fb501-mode-btn"), function (b) {
      b.addEventListener("click", function () {
        var m = b.getAttribute("data-mode");
        if (m === "online") { renderOnlineSetup(); return; }
        pendingMode = m;
        ST = newState(m);
        render();
      });
    });
    var start = el.querySelector("#topxiStart");
    if (start) start.addEventListener("click", function () { ST = newState(pendingMode); render(); });
    Array.prototype.forEach.call(el.querySelectorAll("[data-pick]"), function (row) {
      row.addEventListener("click", function () { pickPlayer(row.getAttribute("data-pick"), false); });
    });
    Array.prototype.forEach.call(el.querySelectorAll(".topxi-remove"), function (btn) {
      btn.addEventListener("click", function (e) { e.stopPropagation(); removePlayer(btn.getAttribute("data-name")); });
    });
    var search = el.querySelector("#topxiSearch");
    if (search) {
      search.addEventListener("input", function () {
        var q = search.value.toLowerCase().trim();
        Array.prototype.forEach.call(el.querySelectorAll("#topxiCandList .player"), function (row) {
          var name = (row.getAttribute("data-pick") || "").toLowerCase();
          row.style.display = (!q || name.indexOf(q) !== -1) ? "" : "none";
        });
      });
    }
    var quit = el.querySelector(".fb501-quit");
    if (quit) quit.addEventListener("click", function () { ST = null; renderModeSelect(); });
    var rematch = el.querySelector("#topxiRematch");
    if (rematch) rematch.addEventListener("click", function () { ST = newState(ST.mode, ST.players.map(function (p) { return p.name; })); render(); });
    var back = el.querySelector("#topxiBackToMenu");
    if (back) back.addEventListener("click", function () { ST = null; renderModeSelect(); });
  }

  function renderModeSelect() {
    var el = root();
    if (!el) return;
    pendingMode = "solo";
    el.innerHTML = modeSelectHTML();
    wire();
  }

  /* ---- Online lobby, same host/join markup as football501.js/A4. ---- */
  function renderOnlineSetup() {
    onlineReset();
    renderOnlineFlow();
  }

  function renderOnlineFlow() {
    var el = root();
    if (!el || !ONL) return;
    var html;
    if (!ONL.role) html = onlineChoiceHTML();
    else if (ONL.role === "host") html = onlineHostHTML();
    else html = onlineJoinHTML();
    el.innerHTML = html;
    wireOnlineFlow();
  }

  function onlineChoiceHTML() {
    return '<div class="fb501-setup squad-card">' +
      '<div class="squad-head"><h2>Online 1v1</h2></div>' +
      '<div class="sub">One of you creates the game; the other joins with the code.</div>' +
      '<div class="fb501-mode-select">' +
        '<button class="fb501-mode-btn" id="topxiOnlCreate"><span class="fb501-mode-btn-name">Create game</span><span class="fb501-mode-btn-desc">Generate a code and wait for your opponent.</span></button>' +
        '<button class="fb501-mode-btn" id="topxiOnlJoin"><span class="fb501-mode-btn-name">Join game</span><span class="fb501-mode-btn-desc">Enter the code your opponent shares with you.</span></button>' +
      '</div>' +
      '<button class="btn-ghost fb501-quit" id="topxiOnlineBack" style="margin-top:14px">← Back</button>' +
    '</div>';
  }

  function onlineHostHTML() {
    var status = ONL.status;
    if (status === "connected") {
      return '<div class="fb501-setup squad-card">' +
        '<div class="squad-head"><h2>Opponent connected!</h2></div>' +
        '<div class="sub">Snake-draft from the same pool — highest total wins.</div>' +
        '<button class="btn-primary" id="topxiHostGo" style="width:100%;margin-top:10px">Start draft →</button>' +
      '</div>';
    }
    if (status === "error") {
      return '<div class="fb501-setup squad-card">' +
        '<div class="squad-head"><h2>Online 1v1</h2></div>' +
        '<div class="sub mp-net-err">' + esc(ONL.errMsg || "Something went wrong.") + '</div>' +
        '<button class="btn-primary" id="topxiOnlRetryHost" style="width:100%;margin-top:10px">Try again</button>' +
        '<button class="btn-ghost fb501-quit" id="topxiOnlineBack">← Back</button>' +
      '</div>';
    }
    return '<div class="fb501-setup squad-card">' +
      '<div class="squad-head"><h2>Your game</h2></div>' +
      (ONL.code
        ? '<div class="mp-code-card"><div class="mp-code-label">Share this code</div><div class="mp-code">' + esc(ONL.code) + '</div></div>'
        : '<div class="mp-code-card"><div class="mp-code-label">Creating your game…</div><div class="mp-code mp-code-dim">····</div></div>') +
      '<div class="mp-wait"><span class="mp-spinner"></span><span>Waiting for your opponent to join…</span></div>' +
      '<button class="btn-ghost fb501-quit" id="topxiOnlineBack">Cancel</button>' +
    '</div>';
  }

  function onlineJoinHTML() {
    var status = ONL.status;
    if (status === "connected") {
      return '<div class="fb501-setup squad-card">' +
        '<div class="squad-head"><h2>Connected!</h2></div>' +
        '<div class="sub">Waiting for the host to start the draft…</div>' +
        '<div class="mp-wait"><span class="mp-spinner"></span></div>' +
      '</div>';
    }
    var connecting = status === "loading" || status === "joining";
    return '<div class="fb501-setup squad-card">' +
      '<div class="squad-head"><h2>Join a game</h2></div>' +
      '<div class="sub">Type the code your opponent gave you.</div>' +
      '<input class="mp-code-input" id="topxiJoinCode" type="text" maxlength="4" autocapitalize="characters" autocomplete="off" placeholder="CODE" value="' + esc(ONL.joinCode || "") + '" />' +
      (connecting ? '<div class="mp-wait"><span class="mp-spinner"></span><span>Connecting…</span></div>' :
        '<button class="btn-primary" id="topxiDoJoin" style="width:100%;margin-top:10px">Connect →</button>') +
      (ONL.joinError ? '<div class="mp-net-err">' + esc(ONL.joinError) + '</div>' : '') +
      '<button class="btn-ghost fb501-quit" id="topxiOnlineBack">← Back</button>' +
    '</div>';
  }

  function wireOnlineFlow() {
    var el = root();
    if (!el) return;
    var back = el.querySelector("#topxiOnlineBack");
    if (back) back.addEventListener("click", function () {
      if (W.ElxiNet) W.ElxiNet.close();
      onlineReset();
      renderModeSelect();
    });
    var create = el.querySelector("#topxiOnlCreate");
    if (create) create.addEventListener("click", onlineStartHost);
    var retry = el.querySelector("#topxiOnlRetryHost");
    if (retry) retry.addEventListener("click", onlineStartHost);
    var join = el.querySelector("#topxiOnlJoin");
    if (join) join.addEventListener("click", function () { ONL.role = "guest"; ONL.status = "idle"; ONL.joinError = null; renderOnlineFlow(); });
    var codeInput = el.querySelector("#topxiJoinCode");
    if (codeInput) {
      codeInput.addEventListener("input", function () {
        codeInput.value = codeInput.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
        ONL.joinCode = codeInput.value;
      });
      codeInput.addEventListener("keydown", function (e) { if (e.key === "Enter") onlineDoJoin(); });
      setTimeout(function () { codeInput.focus(); }, 30);
    }
    var doJoinBtn = el.querySelector("#topxiDoJoin");
    if (doJoinBtn) doJoinBtn.addEventListener("click", onlineDoJoin);
    var hostGo = el.querySelector("#topxiHostGo");
    if (hostGo) hostGo.addEventListener("click", function () {
      myIdx = 0;
      if (W.ElxiNet) W.ElxiNet.send({ t: "tx_start" });
      ST = newState("online", [ONL.myName, ONL.oppName]);
      render();
    });
  }

  function onlineStartHost() {
    ONL.role = "host"; ONL.status = "loading"; ONL.errMsg = null;
    renderOnlineFlow();
    bindNetForTopXI();
    if (!W.ElxiNet) return;
    W.ElxiNet.host().then(function (code) {
      ONL.code = code;
      if (ONL.role === "host") renderOnlineFlow();
    }).catch(function () {});
  }

  function onlineDoJoin() {
    var code = (ONL.joinCode || "").trim();
    if (code.length !== 4) { ONL.joinError = "Enter the 4-character code."; renderOnlineFlow(); return; }
    ONL.status = "loading"; ONL.joinError = null;
    renderOnlineFlow();
    bindNetForTopXI();
    if (!W.ElxiNet) return;
    W.ElxiNet.join(code).then(function () {}).catch(function () {});
  }

  /* ---- Entry point ---- */
  W.startTopXI = function () {
    ALL_VIEWS.forEach(function (id) { var v = document.getElementById(id); if (v) v.style.display = "none"; });
    var outer = document.getElementById("topxiView");
    if (!outer || !root()) return;
    outer.style.display = "";
    if (W.scrollTo) W.scrollTo(0, 0);
    ST = null;
    ONL = null;
    renderModeSelect();
  };

  function init() {
    var back = document.getElementById("topxiBack");
    if (back) back.addEventListener("click", function () { if (W.flGoHome) W.flGoHome(); });
    var homeBtn = document.getElementById("homeTopXI");
    if (homeBtn) homeBtn.addEventListener("click", function () { W.startTopXI(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

})(window);
