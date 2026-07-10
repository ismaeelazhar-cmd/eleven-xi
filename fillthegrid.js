/* fillthegrid.js — Fill the Grid.
 * A 3x3 grid where each cell needs a player satisfying both its row and
 * column criteria (the exact proven format behind "Immaculate Footy" /
 * "Footy Grid" / "Football Tic-Tac-Toe" — confirmed via research before
 * building this). Two axis types to start: Nation × Position (World Cup
 * data) and Club × Era (Champions League data) — both derived LIVE from
 * data already loaded elsewhere in the app, no new player database.
 *
 * Self-contained IIFE, same shape as football501.js/transferroulette.js. */
(function (W) {
  "use strict";

  var ALL_VIEWS = ["homeView","setupView","draftView","resultsView","mpView","leagueView","boardView","rwView","dvcView","euroView","dailyView","challengeView","f501View","rrView","mineView","topxiView","tenView"];
  var STATS_KEY = "grid_stats_v1";

  var ICO = {
    replay: '<svg class="rescue-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/></svg>'
  };

  function esc(s) { return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function normalize(s) {
    return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
  }
  /* Last-name-only guessing fallback — see findValidPlayer() below. */
  function lastName(s) {
    var n = normalize(s);
    var parts = n.split(" ");
    return parts[parts.length - 1];
  }

  function loadStats() { try { return JSON.parse(localStorage.getItem(STATS_KEY) || "{}"); } catch (e) { return {}; } }
  function saveStats(s) { try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch (e) {} }
  function recordResult(gridType, seconds) {
    var s = loadStats();
    var g = s[gridType] || { played: 0, bestSeconds: null };
    g.played++;
    if (g.bestSeconds == null || seconds < g.bestSeconds) g.bestSeconds = seconds;
    s[gridType] = g;
    saveStats(s);
    return g;
  }

  /* ── Grid axis types ──
     "match(rowVal, colVal)" returns a function(player, extra) -> bool that
     checks whether a candidate player satisfies BOTH axes for that cell —
     built once per grid from live data, not stored data. */
  var GRID_TYPES = {
    nation_position: {
      label: "Nation × Position",
      rows: function () { return shuffle(["Brazil", "Argentina", "Germany", "France", "England", "Spain"]).slice(0, 3); },
      cols: function () { return ["GK", "DEF", "MID", "FWD"].filter(function () { return true; }).sort(function () { return Math.random() - 0.5; }).slice(0, 3); },
      /* Every player entry for `nation` across all World Cup years, tagged
         with which cols (positions) they satisfy. */
      candidatesFor: function (nation, pos) {
        var country = (W.WORLD_CUP_DATA || {})[nation];
        if (!country) return [];
        var out = [];
        for (var y in country.years) {
          country.years[y].forEach(function (pl) { if (pl.p === pos) out.push(pl.n); });
        }
        return out;
      }
    },
    club_era: {
      label: "Club × Era",
      rows: function () {
        var clubs = Object.keys(W.CL_DATA || {});
        return shuffle(clubs).slice(0, 3);
      },
      /* Club × Era draws from a thin 8-club starter dataset, so picking
         eras independently of which clubs were chosen frequently produces
         an unsolvable grid (a club with no players in a given decade).
         Instead: derive the eras from whichever 3 clubs were actually
         picked — only choose eras where ALL 3 clubs have players. */
      colsFor: function (rows) {
        var eraCounts = {};
        rows.forEach(function (club) {
          var clubData = (W.CL_DATA || {})[club];
          if (!clubData || !clubData.years) return;
          var erasForThisClub = {};
          for (var y in clubData.years) { erasForThisClub[String(Math.floor(parseInt(y, 10) / 10) * 10) + "s"] = true; }
          Object.keys(erasForThisClub).forEach(function (era) { eraCounts[era] = (eraCounts[era] || 0) + 1; });
        });
        var sharedEras = Object.keys(eraCounts).filter(function (era) { return eraCounts[era] === rows.length; });
        return sharedEras.length >= 3 ? shuffle(sharedEras).slice(0, 3) : null;
      },
      candidatesFor: function (club, era) {
        var clubData = (W.CL_DATA || {})[club];
        if (!clubData || !clubData.years) return [];
        var out = [];
        for (var y in clubData.years) {
          if (String(Math.floor(parseInt(y, 10) / 10) * 10) + "s" !== era) continue;
          clubData.years[y].forEach(function (pl) { out.push(pl.n); });
        }
        return out;
      }
    }
  };

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* Build a real 3x3 grid: pick a row/col combo, retrying if any cell would
     have zero valid answers (guarantees every generated grid is completable). */
  function buildGrid(typeKey) {
    var type = GRID_TYPES[typeKey];
    /* Club × Era draws from a thin 8-club starter dataset (cl_data.js) —
       random row/col picks frequently miss on era coverage, so a much
       higher retry budget is needed than Nation × Position's much
       richer World Cup data pool. This is cheap (pure in-memory lookups,
       no rendering) so a generous budget costs nothing perceptible. */
    for (var attempt = 0; attempt < 80; attempt++) {
      var rows = type.rows();
      var cols = type.colsFor ? type.colsFor(rows) : type.cols();
      if (!cols) continue; // this row combo has no shared eras — try a new row combo
      var cells = [];
      var ok = true;
      for (var r = 0; r < 3; r++) {
        for (var c = 0; c < 3; c++) {
          var candidates = type.candidatesFor(rows[r], cols[c]);
          if (!candidates.length) { ok = false; break; }
          cells.push({ r: r, c: c, candidates: candidates, filled: null });
        }
        if (!ok) break;
      }
      if (ok) return { typeKey: typeKey, label: type.label, rows: rows, cols: cols, cells: cells };
    }
    return null;
  }

  /* ---- Online 1v1 ----
     Reuses net.js/ElxiNet exactly as football501.js's A4 does. Unlike
     Transfer Roulette (independent parallel races), Fill the Grid is
     turn-based on a SHARED grid, so both devices must see the exact
     same grid and stay in lockstep on whose turn it is. Host generates
     the grid and broadcasts the whole thing (rows/cols/cells) so the
     guest never re-generates its own (grid generation isn't
     deterministic — it's retried random sampling). Every guess (correct
     or not) is broadcast as raw text and replayed through the SAME
     submitGuess() logic on the peer's device — since both sides hold
     identical grid + usedNames state, replaying the same guess text
     deterministically produces an identical result on both screens, so
     there's no need to also send the outcome. A `fromRemote` flag on
     submitGuess() stops the replay from re-broadcasting (which would
     ping-pong forever), and local guesses are gated to only be
     accepted when it's actually the local player's turn. */
  var ONL = null;
  var myIdx = 0; // 0 = host, 1 = guest — which players[] index is "me" this device

  function onlineReset() {
    ONL = { role: null, status: "idle", code: null, joinCode: "", joinError: null, myName: "You", oppName: "Opponent" };
  }

  function bindNetForGrid() {
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
      stopTimer();
      if (ST && ST.phase === "play") { ST.phase = "result"; ST.outcome = "forfeit"; ST.winnerIdx = myIdx; render(); }
      else { ST = null; onlineReset(); renderModeSelect(); }
    };
    Net.onData = function (msg) { handleOnlineMessage(msg); };
  }

  function handleOnlineMessage(msg) {
    if (!msg || !msg.t) return;
    if (msg.t === "gr_name" && ONL) {
      ONL.oppName = msg.name || "Opponent";
      if (ST) { ST.players[1 - myIdx].name = ONL.oppName; render(); }
      return;
    }
    if (msg.t === "gr_start") {
      /* Guest receives the host's fully-generated grid and mirrors it
         locally, rather than generating its own (which would produce a
         DIFFERENT grid — generation isn't deterministic). */
      myIdx = 1;
      var names = [ONL.oppName, ONL.myName]; // players[0]=host=opponent here, players[1]=me
      ST = {
        phase: "play", mode: "online", grid: msg.grid, usedNames: {},
        players: names.map(function (n) { return { name: n, filled: 0 }; }),
        turnIdx: 0, filledCount: 0, activeCell: null,
        startTime: Date.now(), elapsedSeconds: 0, timerId: null, outcome: null, winnerIdx: null
      };
      render();
      startTimer();
      return;
    }
    if (msg.t === "gr_guess") {
      if (!ST) return;
      submitGuess(msg.raw, true);
      return;
    }
  }

  /* ---- State ----
     Solo: unchanged, timed race to fill all 9. Pass & Play: TWO players
     share the SAME grid/usedNames pool and alternate turns claiming
     cells — a wrong guess or an already-claimed name just passes the
     turn (no penalty), same "a bad go just ends your go" spirit as
     Football 501/Transfer Roulette's turn-passing. Whoever fills more
     cells by the time the grid is full wins. */
  var ST = null;
  var pendingMode = "solo";

  function newState(typeKey, mode, playerNames) {
    var grid = buildGrid(typeKey);
    if (!grid) return null;
    mode = mode || "solo";
    var names = playerNames || (mode === "passplay" ? ["Player 1", "Player 2"] : ["You"]);
    return {
      phase: "play",
      mode: mode,
      grid: grid,
      usedNames: {},
      players: names.map(function (n) { return { name: n, filled: 0 }; }),
      turnIdx: 0,
      filledCount: 0,
      activeCell: null,
      startTime: Date.now(),
      elapsedSeconds: 0,
      timerId: null,
      outcome: null,
      winnerIdx: null
    };
  }

  function isMultiplayer() { return ST.players.length > 1; }
  function activePlayer() { return ST.players[ST.turnIdx]; }
  function advanceTurn() { ST.turnIdx = (ST.turnIdx + 1) % ST.players.length; }

  function cellAt(r, c) { return ST.grid.cells.filter(function (cell) { return cell.r === r && cell.c === c; })[0]; }

  function findValidPlayer(raw, cell) {
    var q = normalize(raw);
    if (!q) return null;
    for (var i = 0; i < cell.candidates.length; i++) {
      var name = cell.candidates[i];
      if (ST.usedNames[name]) continue;
      if (normalize(name) === q) return name;
    }
    /* Fallback: last-name-only match, but only if unambiguous among
       eligible candidates (see football501.js's findMatch for the same rule). */
    var lastMatches = cell.candidates.filter(function (name) { return !ST.usedNames[name] && lastName(name) === q; });
    return lastMatches.length === 1 ? lastMatches[0] : null;
  }

  function submitGuess(raw, fromRemote) {
    if (!ST || ST.phase !== "play" || !ST.activeCell) return;
    if (ST.mode === "online" && !fromRemote && ST.turnIdx !== myIdx) return; // not your turn
    if (ST.mode === "online" && !fromRemote && W.ElxiNet) W.ElxiNet.send({ t: "gr_guess", raw: raw });
    var cell = ST.activeCell;
    var name = findValidPlayer(raw, cell);
    if (!name) {
      flash("miss");
      if (isMultiplayer()) { ST.activeCell = null; advanceTurn(); render(); }
      return;
    }
    cell.filled = name;
    cell.filledBy = ST.turnIdx;
    ST.usedNames[name] = true;
    ST.filledCount++;
    activePlayer().filled++;
    ST.activeCell = null;
    flash("correct");
    if (ST.filledCount === 9) { endGame(); return; }
    if (isMultiplayer()) advanceTurn();
    render();
  }

  function endGame() {
    ST.phase = "result";
    stopTimer();
    var seconds = Math.floor((Date.now() - ST.startTime) / 1000);
    ST.finalSeconds = seconds;
    if (isMultiplayer()) {
      var a = ST.players[0].filled, b = ST.players[1].filled;
      ST.winnerIdx = a === b ? null : (a > b ? 0 : 1);
    } else {
      ST.statLine = recordResult(ST.grid.typeKey, seconds);
    }
    render();
  }

  function stopTimer() { if (ST && ST.timerId) { clearInterval(ST.timerId); ST.timerId = null; } }
  function startTimer() {
    stopTimer();
    ST.timerId = setInterval(function () {
      if (!ST) return;
      var el = document.getElementById("gridTimer");
      if (el) el.textContent = Math.floor((Date.now() - ST.startTime) / 1000) + "s";
    }, 500);
  }

  var flashTimer = null;
  function flash(kind) {
    var el = document.getElementById("gridPrompt");
    if (!el) return;
    var cls = kind === "correct" ? "rr-flash-correct" : "rr-flash-miss";
    el.classList.remove("rr-flash-correct", "rr-flash-miss");
    void el.offsetWidth;
    el.classList.add(cls);
    clearTimeout(flashTimer);
    flashTimer = setTimeout(function () { el.classList.remove("rr-flash-correct", "rr-flash-miss"); }, 380);
  }

  /* ---- Rendering ---- */
  function root() { return document.getElementById("gridBody"); }

  function render() {
    var el = root();
    if (!el || !ST) return;
    if (ST.phase === "play") el.innerHTML = playHTML();
    else if (ST.phase === "result") el.innerHTML = resultHTML();
    wire();
    if (ST.phase === "play") startTimer();
  }

  function modeSelectHTML() {
    return '<div class="fb501-setup squad-card">' +
      '<div class="squad-head"><h2>Fill the Grid</h2></div>' +
      '<div class="sub">How do you want to play?</div>' +
      '<div class="fb501-mode-select">' +
        '<button class="fb501-mode-btn" data-mode="solo"><span class="fb501-mode-btn-name">Solo</span><span class="fb501-mode-btn-desc">Race the clock to fill the whole grid.</span></button>' +
        '<button class="fb501-mode-btn" data-mode="passplay"><span class="fb501-mode-btn-name">Pass &amp; Play</span><span class="fb501-mode-btn-desc">Two players, one device — take turns claiming cells.</span></button>' +
        '<button class="fb501-mode-btn" data-mode="online"><span class="fb501-mode-btn-name">Online 1v1</span><span class="fb501-mode-btn-desc">Head-to-head with a friend, anywhere — share a code.</span></button>' +
      '</div>' +
    '</div>';
  }

  function typeSelectHTML() {
    var stats = loadStats();
    var multi = pendingMode === "passplay";
    var cards = Object.keys(GRID_TYPES).map(function (key) {
      var type = GRID_TYPES[key];
      var s = stats[key];
      var statLine = (!multi && s) ? (s.played + " played · best " + s.bestSeconds + "s") : "";
      return '<button class="h2-mode fb501-cat" data-type="' + esc(key) + '">' +
        '<span class="h2-mode-ico fb501-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg></span>' +
        '<span class="h2-mode-body"><span class="h2-mode-name">' + esc(type.label) + '</span>' +
        '<span class="h2-mode-desc">3×3 grid · fill every cell</span>' +
        (statLine ? '<span class="fl-mode-stat">' + esc(statLine) + '</span>' : '') +
        '</span></button>';
    }).join("");
    return '<div class="fb501-setup squad-card">' +
      '<div class="squad-head"><h2>Fill the Grid</h2></div>' +
      '<div class="sub">Pick a grid type. Each cell needs a player who fits both its row and column.</div>' +
      '<div class="fb501-cat-list">' + cards + '</div>' +
    '</div>';
  }

  function playHTML() {
    var g = ST.grid;
    var multi = isMultiplayer();
    var scoreLine = multi
      ? ST.players.map(function (p, i) { return esc(p.name) + ': ' + p.filled + (i === ST.turnIdx ? ' (their turn)' : ''); }).join(' · ')
      : '';
    var myTurn = ST.mode !== "online" || ST.turnIdx === myIdx;
    var gridHTML = '<table class="grid-table"><thead><tr><th></th>' +
      g.cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join("") + '</tr></thead><tbody>';
    for (var r = 0; r < 3; r++) {
      gridHTML += '<tr><th>' + esc(g.rows[r]) + '</th>';
      for (var c = 0; c < 3; c++) {
        var cell = cellAt(r, c);
        var isActive = ST.activeCell === cell;
        gridHTML += '<td class="grid-cell' + (cell.filled ? " grid-cell--filled" : "") + (isActive ? " grid-cell--active" : "") + '" data-r="' + r + '" data-c="' + c + '">' +
          (cell.filled ? esc(cell.filled) : (isActive ? "…" : "+")) +
        '</td>';
      }
      gridHTML += '</tr>';
    }
    gridHTML += '</tbody></table>';

    return '<div class="fb501-play squad-card">' +
      '<div class="squad-head"><h2>' + esc(g.label) + '</h2><span class="fb501-timer" id="gridTimer">0s</span></div>' +
      gridHTML +
      '<div class="sub" id="gridPrompt">' + (!myTurn ? "Waiting for your opponent…" : ST.activeCell ? ('Name a player: <strong>' + esc(g.rows[ST.activeCell.r]) + '</strong> × <strong>' + esc(g.cols[ST.activeCell.c]) + '</strong>') : 'Tap an empty cell to fill it.') + '</div>' +
      (myTurn && ST.activeCell ? '<div class="squad-search-wrap"><input class="squad-search" id="gridInput" type="text" placeholder="Type a name…" autocomplete="off" /></div>' : '') +
      '<div class="fl-mode-stat" style="text-align:center;">' + (multi ? scoreLine : (ST.filledCount + '/9 filled')) + '</div>' +
      '<button class="btn-ghost fb501-quit">Quit to menu</button>' +
    '</div>';
  }

  function resultHTML() {
    if (isMultiplayer()) {
      var winner = ST.winnerIdx != null ? ST.players[ST.winnerIdx] : null;
      return '<div class="nopicks-popup fb501-result-popup"><div class="nopicks-popup-inner">' +
        '<div class="nopicks-icon">🏆</div>' +
        '<div class="nopicks-title">' + (winner ? (esc(winner.name) + ' wins!') : "It's a tie!") + '</div>' +
        '<div class="nopicks-sub">' + ST.players.map(function (p) { return esc(p.name) + ': ' + p.filled; }).join(' · ') + '</div>' +
        '<div class="nopicks-actions">' +
          '<button class="nopicks-btn nopicks-respin" id="gridRematch">' + ICO.replay + ' Rematch</button>' +
          '<button class="nopicks-btn nopicks-auto" id="gridBackToMenu">Menu</button>' +
        '</div>' +
      '</div></div>';
    }
    return '<div class="nopicks-popup fb501-result-popup"><div class="nopicks-popup-inner">' +
      '<div class="nopicks-icon">🏆</div>' +
      '<div class="nopicks-title">Grid complete!</div>' +
      '<div class="nopicks-sub">Finished in ' + ST.finalSeconds + 's' + (ST.statLine ? (' · Best: ' + ST.statLine.bestSeconds + 's') : '') + '</div>' +
      '<div class="nopicks-actions">' +
        '<button class="nopicks-btn nopicks-respin" id="gridRematch">' + ICO.replay + ' New grid</button>' +
        '<button class="nopicks-btn nopicks-auto" id="gridBackToMenu">Menu</button>' +
      '</div>' +
    '</div></div>';
  }

  function wire() {
    var el = root();
    if (!el) return;
    Array.prototype.forEach.call(el.querySelectorAll(".fb501-mode-btn"), function (b) {
      b.addEventListener("click", function () {
        var mode = b.getAttribute("data-mode");
        if (mode === "online") { renderOnlineSetup(); return; }
        pendingMode = mode;
        renderTypeSelect();
      });
    });
    Array.prototype.forEach.call(el.querySelectorAll(".fb501-cat"), function (b) {
      b.addEventListener("click", function () {
        var type = b.getAttribute("data-type");
        if (pendingMode === "online") {
          var grid = buildGrid(type);
          if (!grid) { if (W.flToast) W.flToast("Couldn't build a grid for that right now — try again."); return; }
          myIdx = 0;
          if (W.ElxiNet) W.ElxiNet.send({ t: "gr_start", grid: grid });
          ST = {
            phase: "play", mode: "online", grid: grid, usedNames: {},
            players: [ONL.myName, ONL.oppName].map(function (n) { return { name: n, filled: 0 }; }),
            turnIdx: 0, filledCount: 0, activeCell: null,
            startTime: Date.now(), elapsedSeconds: 0, timerId: null, outcome: null, winnerIdx: null
          };
          render();
          startTimer();
          return;
        }
        ST = newState(type, pendingMode);
        if (!ST) {
          if (W.flToast) W.flToast("Couldn't build a grid for that right now — try again.");
          return;
        }
        render();
      });
    });
    Array.prototype.forEach.call(el.querySelectorAll(".grid-cell:not(.grid-cell--filled)"), function (td) {
      td.addEventListener("click", function () {
        if (ST.mode === "online" && ST.turnIdx !== myIdx) return; // not your turn
        var r = parseInt(td.getAttribute("data-r"), 10), c = parseInt(td.getAttribute("data-c"), 10);
        ST.activeCell = cellAt(r, c);
        render();
      });
    });
    var input = el.querySelector("#gridInput");
    if (input) {
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") { submitGuess(input.value); input.value = ""; } });
      setTimeout(function () { input.focus(); }, 30);
    }
    var quit = el.querySelector(".fb501-quit");
    if (quit) quit.addEventListener("click", function () { stopTimer(); ST = null; renderModeSelect(); });
    var rematch = el.querySelector("#gridRematch");
    if (rematch) rematch.addEventListener("click", function () {
      var type = ST.grid.typeKey, mode = ST.mode, names = ST.players.map(function (p) { return p.name; });
      var next = newState(type, mode, names);
      if (!next) { if (W.flToast) W.flToast("Couldn't build a new grid right now — try again."); return; }
      ST = next;
      render();
    });
    var back = el.querySelector("#gridBackToMenu");
    if (back) back.addEventListener("click", function () { ST = null; renderModeSelect(); });
  }

  function renderModeSelect() {
    var el = root();
    if (!el) return;
    el.innerHTML = modeSelectHTML();
    wire();
  }

  function renderTypeSelect() {
    var el = root();
    if (!el) return;
    el.innerHTML = typeSelectHTML();
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
        '<button class="fb501-mode-btn" id="gridOnlCreate"><span class="fb501-mode-btn-name">Create game</span><span class="fb501-mode-btn-desc">Generate a code and wait for your opponent.</span></button>' +
        '<button class="fb501-mode-btn" id="gridOnlJoin"><span class="fb501-mode-btn-name">Join game</span><span class="fb501-mode-btn-desc">Enter the code your opponent shares with you.</span></button>' +
      '</div>' +
      '<button class="btn-ghost fb501-quit" id="gridOnlineBack" style="margin-top:14px">← Back</button>' +
    '</div>';
  }

  function onlineHostHTML() {
    var status = ONL.status;
    if (status === "connected") {
      return '<div class="fb501-setup squad-card">' +
        '<div class="squad-head"><h2>Opponent connected!</h2></div>' +
        '<div class="sub">You\'re the host — pick the grid type for both of you.</div>' +
        '<button class="btn-primary" id="gridHostChooseType" style="width:100%;margin-top:10px">Choose grid →</button>' +
      '</div>';
    }
    if (status === "error") {
      return '<div class="fb501-setup squad-card">' +
        '<div class="squad-head"><h2>Online 1v1</h2></div>' +
        '<div class="sub mp-net-err">' + esc(ONL.errMsg || "Something went wrong.") + '</div>' +
        '<button class="btn-primary" id="gridOnlRetryHost" style="width:100%;margin-top:10px">Try again</button>' +
        '<button class="btn-ghost fb501-quit" id="gridOnlineBack">← Back</button>' +
      '</div>';
    }
    return '<div class="fb501-setup squad-card">' +
      '<div class="squad-head"><h2>Your game</h2></div>' +
      (ONL.code
        ? '<div class="mp-code-card"><div class="mp-code-label">Share this code</div><div class="mp-code">' + esc(ONL.code) + '</div></div>'
        : '<div class="mp-code-card"><div class="mp-code-label">Creating your game…</div><div class="mp-code mp-code-dim">····</div></div>') +
      '<div class="mp-wait"><span class="mp-spinner"></span><span>Waiting for your opponent to join…</span></div>' +
      '<button class="btn-ghost fb501-quit" id="gridOnlineBack">Cancel</button>' +
    '</div>';
  }

  function onlineJoinHTML() {
    var status = ONL.status;
    if (status === "connected") {
      return '<div class="fb501-setup squad-card">' +
        '<div class="squad-head"><h2>Connected!</h2></div>' +
        '<div class="sub">Waiting for the host to pick a grid…</div>' +
        '<div class="mp-wait"><span class="mp-spinner"></span></div>' +
      '</div>';
    }
    var connecting = status === "loading" || status === "joining";
    return '<div class="fb501-setup squad-card">' +
      '<div class="squad-head"><h2>Join a game</h2></div>' +
      '<div class="sub">Type the code your opponent gave you.</div>' +
      '<input class="mp-code-input" id="gridJoinCode" type="text" maxlength="4" autocapitalize="characters" autocomplete="off" placeholder="CODE" value="' + esc(ONL.joinCode || "") + '" />' +
      (connecting ? '<div class="mp-wait"><span class="mp-spinner"></span><span>Connecting…</span></div>' :
        '<button class="btn-primary" id="gridDoJoin" style="width:100%;margin-top:10px">Connect →</button>') +
      (ONL.joinError ? '<div class="mp-net-err">' + esc(ONL.joinError) + '</div>' : '') +
      '<button class="btn-ghost fb501-quit" id="gridOnlineBack">← Back</button>' +
    '</div>';
  }

  function wireOnlineFlow() {
    var el = root();
    if (!el) return;
    var back = el.querySelector("#gridOnlineBack");
    if (back) back.addEventListener("click", function () {
      if (W.ElxiNet) W.ElxiNet.close();
      onlineReset();
      renderModeSelect();
    });
    var create = el.querySelector("#gridOnlCreate");
    if (create) create.addEventListener("click", onlineStartHost);
    var retry = el.querySelector("#gridOnlRetryHost");
    if (retry) retry.addEventListener("click", onlineStartHost);
    var join = el.querySelector("#gridOnlJoin");
    if (join) join.addEventListener("click", function () { ONL.role = "guest"; ONL.status = "idle"; ONL.joinError = null; renderOnlineFlow(); });
    var codeInput = el.querySelector("#gridJoinCode");
    if (codeInput) {
      codeInput.addEventListener("input", function () {
        codeInput.value = codeInput.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
        ONL.joinCode = codeInput.value;
      });
      codeInput.addEventListener("keydown", function (e) { if (e.key === "Enter") onlineDoJoin(); });
      setTimeout(function () { codeInput.focus(); }, 30);
    }
    var doJoinBtn = el.querySelector("#gridDoJoin");
    if (doJoinBtn) doJoinBtn.addEventListener("click", onlineDoJoin);
    var chooseType = el.querySelector("#gridHostChooseType");
    if (chooseType) chooseType.addEventListener("click", function () { pendingMode = "online"; renderTypeSelect(); });
  }

  function onlineStartHost() {
    ONL.role = "host"; ONL.status = "loading"; ONL.errMsg = null;
    renderOnlineFlow();
    bindNetForGrid();
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
    bindNetForGrid();
    if (!W.ElxiNet) return;
    W.ElxiNet.join(code).then(function () {}).catch(function () {});
  }

  /* ---- Entry point ---- */
  W.startFillTheGrid = function () {
    ALL_VIEWS.forEach(function (id) { var v = document.getElementById(id); if (v) v.style.display = "none"; });
    var outer = document.getElementById("gridView");
    if (!outer || !root()) return;
    outer.style.display = "";
    if (W.scrollTo) W.scrollTo(0, 0);
    ST = null;
    ONL = null;
    pendingMode = "solo";
    renderModeSelect();
  };

  function init() {
    var back = document.getElementById("gridBack");
    if (back) back.addEventListener("click", function () { if (W.flGoHome) W.flGoHome(); });
    var homeBtn = document.getElementById("homeGrid");
    if (homeBtn) homeBtn.addEventListener("click", function () { W.startFillTheGrid(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

})(window);
