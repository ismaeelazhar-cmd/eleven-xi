/* transferroulette.js — Transfer Roulette.
 * Spinner lands on From Club → To Club → Decade; name the real player
 * who made that transfer within 10 seconds. On a correct guess, the
 * real transfer fee is revealed as a payoff. Validates guesses by
 * live-filtering window.TRANSFER_DATA (data_transfers.js) — every combo
 * is derived directly from the transfer list itself (no separate
 * "eligible pools" file needed, unlike the old nationality/position/
 * decade version this replaced).
 *
 * Self-contained IIFE, same shape as football501.js/draftvscomputer.js. */
(function (W) {
  "use strict";

  var ALL_VIEWS = ["homeView","setupView","draftView","resultsView","mpView","leagueView","boardView","rwView","dvcView","euroView","dailyView","challengeView","f501View","gridView","mineView","topxiView","tenView"];
  var ROUND_SECONDS = 10;
  var ITEM_H = 96;
  var STATS_KEY = "roulette_stats_v1";

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

  function decadeOf(year) { return String(Math.floor(parseInt(year, 10) / 10) * 10) + "s"; }

  function loadStats() { try { return JSON.parse(localStorage.getItem(STATS_KEY) || "{}"); } catch (e) { return {}; } }
  function saveStats(s) { try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch (e) {} }
  function recordSoloResult(streak) {
    var s = loadStats();
    s.bestStreak = Math.max(s.bestStreak || 0, streak);
    s.gamesPlayed = (s.gamesPlayed || 0) + 1;
    saveStats(s);
    return s;
  }

  /* ---- Combo pool: every {from, to, decade} triple that has at least
     one real transfer in TRANSFER_DATA, built once and cached. Unlike
     the old nationality/position/decade version, there's no separate
     "eligible pools" file — every combo is derived directly from the
     transfer list itself. ---- */
  var comboCache = null;
  function buildCombos() {
    if (comboCache) return comboCache;
    var DATA = W.TRANSFER_DATA || [];
    var map = {};
    DATA.forEach(function (t) {
      var dec = decadeOf(t.year);
      var key = t.from + "|" + t.to + "|" + dec;
      (map[key] = map[key] || []).push(t);
    });
    var list = Object.keys(map).map(function (key) {
      var parts = key.split("|");
      return { from: parts[0], to: parts[1], dec: parts[2] };
    });
    comboCache = { list: list, map: map };
    return comboCache;
  }

  function findValidPlayer(raw, combo, usedNames) {
    var q = normalize(raw);
    if (!q) return null;
    var key = combo.from + "|" + combo.to + "|" + combo.dec;
    var candidates = (buildCombos().map[key] || []).filter(function (t) { return !usedNames[t.player]; });
    for (var i = 0; i < candidates.length; i++) {
      if (normalize(candidates[i].player) === q) return candidates[i];
    }
    /* Fallback: last-name-only match, but only if unambiguous among DISTINCT
       eligible candidates — dedupe by full name first, since (rarely) the
       same player could appear twice in the data across different
       transfers, which shouldn't count as "two different people" ambiguity. */
    var lastMatches = candidates.filter(function (t) { return lastName(t.player) === q; });
    var distinctNames = {};
    lastMatches.forEach(function (t) { distinctNames[t.player] = t; });
    var distinct = Object.keys(distinctNames).map(function (n) { return distinctNames[n]; });
    return distinct.length === 1 ? distinct[0] : null;
  }

  /* ---- Online 1v1 ----
     Reuses net.js/ElxiNet exactly as football501.js's A4 does — same
     host/join 4-char code broker. Unlike Pass & Play, online is
     SIMULTANEOUS and each side spins its OWN independent combo (no
     shared-combo sync needed) — it's a pure race to 5 correct, each
     side racing their own reels at their own pace, broadcasting only
     their running score so both screens show live progress. Simpler
     and more robust than trying to keep two peers' spin animations in
     lockstep over the network. */
  var ONL = null;

  function onlineReset() {
    ONL = { role: null, status: "idle", code: null, joinCode: "", joinError: null, myName: "You", oppName: "Opponent" };
  }

  function bindNetForRR() {
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
      stopRoundTimer();
      if (ST && ST.phase === "play") { ST.phase = "result"; ST.outcome = "forfeit"; ST.winnerIdx = 0; render(); }
      else { ST = null; onlineReset(); renderModeSelect(); }
    };
    Net.onData = function (msg) { handleOnlineMessage(msg); };
  }

  function handleOnlineMessage(msg) {
    if (!msg || !msg.t) return;
    if (msg.t === "rr_name" && ONL) {
      ONL.oppName = msg.name || "Opponent";
      if (ST) { ST.players[1].name = ONL.oppName; render(); }
      return;
    }
    if (msg.t === "rr_start") {
      /* Guest receives the go-ahead from the host and starts its own
         independent race locally. */
      ST = newState("online", [ONL.myName, ONL.oppName]);
      doSpin();
      return;
    }
    if (msg.t === "rr_score") {
      if (!ST || !isMultiplayer()) return;
      ST.players[1].score = msg.score;
      render();
      return;
    }
    if (msg.t === "rr_matchOver") {
      if (!ST) return;
      endGame("won", 1); // opponent (index 1) won
      return;
    }
  }

  /* ---- State: same players[]-array shape as football501.js, proven for
     solo + pass-and-play (turnIdx stays 0 for solo, alternates for
     pass-and-play). ---- */
  var ST = null;
  var pendingMode = "solo";

  function newState(mode, playerNames) {
    mode = mode || "solo";
    var names = playerNames || (mode === "passplay" ? ["Player 1", "Player 2"] : ["You"]);
    return {
      phase: "play",
      mode: mode,
      players: names.map(function (n) { return { name: n, streak: 0, score: 0 }; }),
      turnIdx: 0,
      usedNames: {},
      combo: null,
      roundEnd: null,
      timerId: null,
      outcome: null,   // "over" (solo) | "won" (pass-and-play, someone hit target) | null
      winnerIdx: null
    };
  }

  function isMultiplayer() { return ST.players.length > 1; }
  function isTurnBased() { return ST.mode === "passplay"; }
  function advanceTurn() { ST.turnIdx = (ST.turnIdx + 1) % ST.players.length; }
  function activePlayer() { return ST.players[ST.turnIdx]; }

  /* ---- Spin ---- */
  function nextCombo() {
    var list = buildCombos().list;
    if (!list.length) return null;
    return list[Math.floor(Math.random() * list.length)];
  }

  function spinReel(stripEl, randomItem, finalHTML, duration) {
    var reelEl = stripEl.parentElement;
    return new Promise(function (resolve) {
      var BLUR = 18, html = "";
      for (var i = 0; i < BLUR; i++) html += randomItem();
      html += finalHTML;
      stripEl.style.transition = "none"; stripEl.style.transform = "translateY(0)";
      stripEl.innerHTML = html; void stripEl.offsetHeight;
      var itemH = (stripEl.firstElementChild && stripEl.firstElementChild.offsetHeight) || ITEM_H;
      stripEl.style.transition = "transform " + duration + "ms cubic-bezier(0.12,0.05,0.05,1)";
      stripEl.style.transform = "translateY(" + (-(BLUR * itemH)) + "px)";
      var done = false;
      function finish(e) {
        if (e && e.propertyName && e.propertyName !== "transform") return;
        if (done) return; done = true;
        stripEl.style.transition = "none";
        stripEl.style.transform = "translateY(0)";
        stripEl.innerHTML = finalHTML;
        if (reelEl) { reelEl.classList.add("reel--settled"); setTimeout(function () { reelEl.classList.remove("reel--settled"); }, 950); }
        resolve();
      }
      stripEl.addEventListener("transitionend", finish, { once: true });
      setTimeout(function () { finish(null); }, duration + 120);
    });
  }

  function itemHTML(text) { return '<div class="reel-item"><span class="name">' + esc(text) + '</span></div>'; }

  function doSpin() {
    var combo = nextCombo();
    if (!combo) return;
    ST.combo = combo;
    ST.phase = "spinning";
    render();
    var fromStrip = document.getElementById("rrFromStrip");
    var toStrip = document.getElementById("rrToStrip");
    var decStrip = document.getElementById("rrDecStrip");
    if (!fromStrip || !toStrip || !decStrip) { finishSpin(); return; }
    var DATA = W.TRANSFER_DATA || [];
    var decades = ["2000s", "2010s", "2020s"];
    Promise.all([
      spinReel(fromStrip, function () { return itemHTML((DATA[Math.floor(Math.random() * DATA.length)] || {}).from || "?"); }, itemHTML(combo.from), 900),
      spinReel(toStrip, function () { return itemHTML((DATA[Math.floor(Math.random() * DATA.length)] || {}).to || "?"); }, itemHTML(combo.to), 1100),
      spinReel(decStrip, function () { return itemHTML(decades[Math.floor(Math.random() * decades.length)]); }, itemHTML(combo.dec), 1300)
    ]).then(finishSpin);
  }

  function finishSpin() {
    if (!ST) return;
    ST.phase = "play";
    ST.roundEnd = Date.now() + ROUND_SECONDS * 1000;
    render();
    startRoundTimer();
  }

  function startRoundTimer() {
    stopRoundTimer();
    ST.timerId = setInterval(function () {
      if (!ST) return;
      var remain = ST.roundEnd - Date.now();
      if (remain <= 0) { roundTimeout(); return; }
      var badge = document.getElementById("rrTimer");
      if (badge) badge.textContent = Math.ceil(remain / 1000) + "s";
    }, 200);
  }
  function stopRoundTimer() { if (ST && ST.timerId) { clearInterval(ST.timerId); ST.timerId = null; } }

  function roundTimeout() {
    stopRoundTimer();
    if (ST.mode === "solo") { endSolo(); return; }
    /* Pass & Play: a timeout just ends this player's go — pass the turn
       and spin fresh for the next player, same shape as darts passing a
       missed visit rather than ending the whole match. */
    if (isTurnBased()) advanceTurn();
    doSpin();
  }

  function submitGuess(raw) {
    if (!ST || ST.phase !== "play") return;
    var p = activePlayer();
    var pl = findValidPlayer(raw, ST.combo, ST.usedNames);
    if (!pl) { flash("miss"); return; }
    ST.usedNames[pl.player] = true;
    var feeMsg = "Correct! " + pl.player + " — " + pl.feeLabel + ", " + pl.year;
    stopRoundTimer();
    flash("correct", feeMsg);
    /* Small delay before the next spin so the fee-reveal payoff is
       actually readable — without it, render() would wipe #rrPrompt in
       the same synchronous tick before the browser ever paints it. */
    if (ST.mode === "solo") {
      p.streak++;
      setTimeout(function () { if (ST) doSpin(); }, 900);
      return;
    }
    p.score++;
    if (ST.mode === "online" && W.ElxiNet) W.ElxiNet.send({ t: "rr_score", score: p.score });
    if (p.score >= 5) {
      if (ST.mode === "online" && W.ElxiNet) W.ElxiNet.send({ t: "rr_matchOver" });
      setTimeout(function () { if (ST) endGame("won", ST.turnIdx); }, 900);
      return;
    }
    if (isTurnBased()) advanceTurn();
    setTimeout(function () { if (ST) doSpin(); }, 900);
  }

  function endSolo() {
    ST.phase = "result";
    ST.outcome = "over";
    var streak = ST.players[0].streak;
    ST.statLine = recordSoloResult(streak);
    render();
  }

  function endGame(outcome, winnerIdx) {
    ST.phase = "result";
    ST.outcome = outcome;
    ST.winnerIdx = winnerIdx != null ? winnerIdx : null;
    stopRoundTimer();
    render();
  }

  var flashTimer = null;
  function flash(kind, msg) {
    var el = document.getElementById("rrPrompt");
    if (!el) return;
    var cls = kind === "correct" ? "rr-flash-correct" : "rr-flash-miss";
    el.classList.remove("rr-flash-correct", "rr-flash-miss");
    if (kind === "correct" && msg) el.textContent = msg;
    void el.offsetWidth;
    el.classList.add(cls);
    clearTimeout(flashTimer);
    flashTimer = setTimeout(function () { el.classList.remove("rr-flash-correct", "rr-flash-miss"); }, 380);
  }

  /* ---- Rendering ---- */
  function root() { return document.getElementById("rrBody"); }

  function render() {
    var el = root();
    if (!el || !ST) return;
    if (ST.phase === "spinning") el.innerHTML = spinningHTML();
    else if (ST.phase === "play") el.innerHTML = playHTML();
    else if (ST.phase === "result") el.innerHTML = resultHTML();
    wire();
  }

  function modeSelectHTML() {
    return '<div class="fb501-setup squad-card">' +
      '<div class="squad-head"><h2>Transfer Roulette</h2></div>' +
      '<div class="sub">How do you want to play?</div>' +
      '<div class="fb501-mode-select">' +
        '<button class="fb501-mode-btn" data-mode="solo"><span class="fb501-mode-btn-name">Solo streak</span><span class="fb501-mode-btn-desc">Keep spinning — one wrong answer or timeout ends your run.</span></button>' +
        '<button class="fb501-mode-btn" data-mode="passplay"><span class="fb501-mode-btn-name">Pass &amp; Play</span><span class="fb501-mode-btn-desc">Two players, one device — first to 5 points wins.</span></button>' +
        '<button class="fb501-mode-btn" data-mode="online"><span class="fb501-mode-btn-name">Online 1v1</span><span class="fb501-mode-btn-desc">Head-to-head with a friend, anywhere — share a code.</span></button>' +
      '</div>' +
    '</div>';
  }

  function reelsHTML(fromVal, toVal, decVal) {
    return '<div class="rr-reels">' +
      '<div class="reel rr-reel"><div class="reel-strip" id="rrFromStrip">' + itemHTML(fromVal || "?") + '</div></div>' +
      '<div class="reel rr-reel"><div class="reel-strip" id="rrToStrip">' + itemHTML(toVal || "?") + '</div></div>' +
      '<div class="reel rr-reel"><div class="reel-strip" id="rrDecStrip">' + itemHTML(decVal || "?") + '</div></div>' +
    '</div>';
  }

  function spinningHTML() {
    return '<div class="fb501-play squad-card">' +
      '<div class="squad-head"><h2>Transfer Roulette</h2></div>' +
      reelsHTML() +
      '<div class="sub">Spinning…</div>' +
    '</div>';
  }

  function playHTML() {
    var c = ST.combo;
    var scoreLine = isMultiplayer()
      ? ST.players.map(function (p, i) { return esc(p.name) + ': ' + p.score + (isTurnBased() && i === ST.turnIdx ? ' (throwing)' : ''); }).join(' · ')
      : ('Streak: ' + ST.players[0].streak);
    return '<div class="fb501-play squad-card">' +
      '<div class="squad-head"><h2>Transfer Roulette</h2><span class="fb501-timer" id="rrTimer">' + ROUND_SECONDS + 's</span></div>' +
      reelsHTML(c.from, c.to, c.dec) +
      '<div class="sub" id="rrPrompt">Name the player who moved from <strong>' + esc(c.from) + '</strong> to <strong>' + esc(c.to) + '</strong> in the <strong>' + esc(c.dec) + '</strong>.</div>' +
      '<div class="fl-mode-stat" style="text-align:center;margin-bottom:8px;">' + scoreLine + '</div>' +
      '<div class="squad-search-wrap"><input class="squad-search" id="rrInput" type="text" placeholder="Type a name…" autocomplete="off" /></div>' +
      '<button class="btn-ghost fb501-quit">Quit to menu</button>' +
    '</div>';
  }

  function resultHTML() {
    if (isMultiplayer()) {
      var winner = ST.winnerIdx != null ? ST.players[ST.winnerIdx] : null;
      return '<div class="nopicks-popup fb501-result-popup"><div class="nopicks-popup-inner">' +
        '<div class="nopicks-icon">🏆</div>' +
        '<div class="nopicks-title">' + (winner ? esc(winner.name) + ' wins!' : 'Match over') + '</div>' +
        '<div class="nopicks-sub">First to 5 correct.</div>' +
        '<div class="nopicks-actions">' +
          '<button class="nopicks-btn nopicks-respin" id="rrRematch">' + ICO.replay + ' Rematch</button>' +
          '<button class="nopicks-btn nopicks-auto" id="rrBackToMenu">Menu</button>' +
        '</div>' +
      '</div></div>';
    }
    var streak = ST.players[0].streak;
    return '<div class="nopicks-popup fb501-result-popup"><div class="nopicks-popup-inner">' +
      '<div class="nopicks-icon">⏰</div>' +
      '<div class="nopicks-title">Run over</div>' +
      '<div class="nopicks-sub">Streak: ' + streak + (ST.statLine ? (' · Best: ' + ST.statLine.bestStreak) : '') + '</div>' +
      '<div class="nopicks-actions">' +
        '<button class="nopicks-btn nopicks-respin" id="rrRematch">' + ICO.replay + ' Play again</button>' +
        '<button class="nopicks-btn nopicks-auto" id="rrBackToMenu">Menu</button>' +
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
        ST = newState(pendingMode);
        doSpin();
      });
    });
    var input = el.querySelector("#rrInput");
    if (input) {
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") { submitGuess(input.value); input.value = ""; } });
      setTimeout(function () { input.focus(); }, 30);
    }
    var quit = el.querySelector(".fb501-quit");
    if (quit) quit.addEventListener("click", function () { stopRoundTimer(); ST = null; renderModeSelect(); });
    var rematch = el.querySelector("#rrRematch");
    if (rematch) rematch.addEventListener("click", function () {
      var mode = ST.mode, names = ST.players.map(function (p) { return p.name; });
      ST = newState(mode, names);
      doSpin();
    });
    var back = el.querySelector("#rrBackToMenu");
    if (back) back.addEventListener("click", function () { ST = null; renderModeSelect(); });
  }

  function renderModeSelect() {
    var el = root();
    if (!el) return;
    el.innerHTML = modeSelectHTML();
    wire();
  }

  /* ---- Online lobby (host/join code UI), reused verbatim from
     football501.js's A4 pattern — same markup classes, same flow. ---- */
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
        '<button class="fb501-mode-btn" id="rrOnlCreate"><span class="fb501-mode-btn-name">Create game</span><span class="fb501-mode-btn-desc">Generate a code and wait for your opponent.</span></button>' +
        '<button class="fb501-mode-btn" id="rrOnlJoin"><span class="fb501-mode-btn-name">Join game</span><span class="fb501-mode-btn-desc">Enter the code your opponent shares with you.</span></button>' +
      '</div>' +
      '<button class="btn-ghost fb501-quit" id="rrOnlineBack" style="margin-top:14px">← Back</button>' +
    '</div>';
  }

  function onlineHostHTML() {
    var status = ONL.status;
    if (status === "connected") {
      return '<div class="fb501-setup squad-card">' +
        '<div class="squad-head"><h2>Opponent connected!</h2></div>' +
        '<div class="sub">Race to 5 correct — your reels, their reels, same finish line.</div>' +
        '<button class="btn-primary" id="rrHostGo" style="width:100%;margin-top:10px">Start racing →</button>' +
      '</div>';
    }
    if (status === "error") {
      return '<div class="fb501-setup squad-card">' +
        '<div class="squad-head"><h2>Online 1v1</h2></div>' +
        '<div class="sub mp-net-err">' + esc(ONL.errMsg || "Something went wrong.") + '</div>' +
        '<button class="btn-primary" id="rrOnlRetryHost" style="width:100%;margin-top:10px">Try again</button>' +
        '<button class="btn-ghost fb501-quit" id="rrOnlineBack">← Back</button>' +
      '</div>';
    }
    return '<div class="fb501-setup squad-card">' +
      '<div class="squad-head"><h2>Your game</h2></div>' +
      (ONL.code
        ? '<div class="mp-code-card"><div class="mp-code-label">Share this code</div><div class="mp-code">' + esc(ONL.code) + '</div></div>'
        : '<div class="mp-code-card"><div class="mp-code-label">Creating your game…</div><div class="mp-code mp-code-dim">····</div></div>') +
      '<div class="mp-wait"><span class="mp-spinner"></span><span>Waiting for your opponent to join…</span></div>' +
      '<button class="btn-ghost fb501-quit" id="rrOnlineBack">Cancel</button>' +
    '</div>';
  }

  function onlineJoinHTML() {
    var status = ONL.status;
    if (status === "connected") {
      return '<div class="fb501-setup squad-card">' +
        '<div class="squad-head"><h2>Connected!</h2></div>' +
        '<div class="sub">Waiting for the host to start the race…</div>' +
        '<div class="mp-wait"><span class="mp-spinner"></span></div>' +
      '</div>';
    }
    var connecting = status === "loading" || status === "joining";
    return '<div class="fb501-setup squad-card">' +
      '<div class="squad-head"><h2>Join a game</h2></div>' +
      '<div class="sub">Type the code your opponent gave you.</div>' +
      '<input class="mp-code-input" id="rrJoinCode" type="text" maxlength="4" autocapitalize="characters" autocomplete="off" placeholder="CODE" value="' + esc(ONL.joinCode || "") + '" />' +
      (connecting ? '<div class="mp-wait"><span class="mp-spinner"></span><span>Connecting…</span></div>' :
        '<button class="btn-primary" id="rrDoJoin" style="width:100%;margin-top:10px">Connect →</button>') +
      (ONL.joinError ? '<div class="mp-net-err">' + esc(ONL.joinError) + '</div>' : '') +
      '<button class="btn-ghost fb501-quit" id="rrOnlineBack">← Back</button>' +
    '</div>';
  }

  function wireOnlineFlow() {
    var el = root();
    if (!el) return;
    var back = el.querySelector("#rrOnlineBack");
    if (back) back.addEventListener("click", function () {
      if (W.ElxiNet) W.ElxiNet.close();
      onlineReset();
      renderModeSelect();
    });
    var create = el.querySelector("#rrOnlCreate");
    if (create) create.addEventListener("click", onlineStartHost);
    var retry = el.querySelector("#rrOnlRetryHost");
    if (retry) retry.addEventListener("click", onlineStartHost);
    var join = el.querySelector("#rrOnlJoin");
    if (join) join.addEventListener("click", function () { ONL.role = "guest"; ONL.status = "idle"; ONL.joinError = null; renderOnlineFlow(); });
    var codeInput = el.querySelector("#rrJoinCode");
    if (codeInput) {
      codeInput.addEventListener("input", function () {
        codeInput.value = codeInput.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
        ONL.joinCode = codeInput.value;
      });
      codeInput.addEventListener("keydown", function (e) { if (e.key === "Enter") onlineDoJoin(); });
      setTimeout(function () { codeInput.focus(); }, 30);
    }
    var doJoinBtn = el.querySelector("#rrDoJoin");
    if (doJoinBtn) doJoinBtn.addEventListener("click", onlineDoJoin);
    var hostGo = el.querySelector("#rrHostGo");
    if (hostGo) hostGo.addEventListener("click", function () {
      if (W.ElxiNet) W.ElxiNet.send({ t: "rr_start" });
      ST = newState("online", [ONL.myName, ONL.oppName]);
      doSpin();
    });
  }

  function onlineStartHost() {
    ONL.role = "host"; ONL.status = "loading"; ONL.errMsg = null;
    renderOnlineFlow();
    bindNetForRR();
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
    bindNetForRR();
    if (!W.ElxiNet) return;
    W.ElxiNet.join(code).then(function () {}).catch(function () {});
  }

  /* ---- Entry point ---- */
  W.startTransferRoulette = function () {
    ALL_VIEWS.forEach(function (id) { var v = document.getElementById(id); if (v) v.style.display = "none"; });
    var outer = document.getElementById("rrView");
    if (!outer || !root()) return;
    outer.style.display = "";
    if (W.scrollTo) W.scrollTo(0, 0);
    ST = null;
    ONL = null;
    renderModeSelect();
  };

  function init() {
    var back = document.getElementById("rrBack");
    if (back) back.addEventListener("click", function () { if (W.flGoHome) W.flGoHome(); });
    var homeBtn = document.getElementById("homeRoulette");
    if (homeBtn) homeBtn.addEventListener("click", function () { W.startTransferRoulette(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

})(window);
