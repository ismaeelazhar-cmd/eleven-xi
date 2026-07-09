/* transferroulette.js — Transfer Roulette.
 * Spinner lands on Nationality → Position → Decade; name a real World Cup
 * squad player matching all 3 within 10 seconds. Reuses the exact 3-reel
 * spin mechanic from game.js (spinReel()) and validates guesses by live-
 * filtering window.WORLD_CUP_DATA rather than a new player database — no
 * new player data file needed, only data_roulette_pools.js which defines
 * which reel values are eligible.
 *
 * Self-contained IIFE, same shape as football501.js/draftvscomputer.js. */
(function (W) {
  "use strict";

  var ALL_VIEWS = ["homeView","setupView","draftView","resultsView","mpView","leagueView","boardView","rwView","dvcView","euroView","dailyView","challengeView","f501View","gridView"];
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

  /* ---- Combo pool: every nationality/position/decade combo that has at
     least one real answer in WORLD_CUP_DATA, built once and cached. ---- */
  var comboCache = null;
  function buildCombos() {
    if (comboCache) return comboCache;
    var pools = W.ROULETTE_POOLS || { nations: [], positions: [], decades: [] };
    var DATA = W.WORLD_CUP_DATA || {};
    var combos = [];
    pools.nations.forEach(function (nat) {
      var country = DATA[nat];
      if (!country) return;
      pools.positions.forEach(function (pos) {
        pools.decades.forEach(function (dec) {
          var count = 0;
          for (var y in country.years) {
            if (decadeOf(y) !== dec) continue;
            country.years[y].forEach(function (pl) { if (pl.p === pos) count++; });
          }
          if (count > 0) combos.push({ nat: nat, pos: pos, dec: dec, count: count });
        });
      });
    });
    comboCache = combos;
    return combos;
  }

  function findValidPlayer(raw, combo, usedNames) {
    var q = normalize(raw);
    if (!q) return null;
    var country = (W.WORLD_CUP_DATA || {})[combo.nat];
    if (!country) return null;
    for (var y in country.years) {
      if (decadeOf(y) !== combo.dec) continue;
      var players = country.years[y];
      for (var i = 0; i < players.length; i++) {
        var pl = players[i];
        if (pl.p !== combo.pos) continue;
        if (usedNames[pl.n]) continue;
        if (normalize(pl.n) === q) return pl;
      }
    }
    return null;
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
    var combos = buildCombos();
    if (!combos.length) return null;
    return combos[Math.floor(Math.random() * combos.length)];
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
    var natStrip = document.getElementById("rrNatStrip");
    var posStrip = document.getElementById("rrPosStrip");
    var decStrip = document.getElementById("rrDecStrip");
    if (!natStrip || !posStrip || !decStrip) { finishSpin(); return; }
    var pools = W.ROULETTE_POOLS;
    Promise.all([
      spinReel(natStrip, function () { return itemHTML(pools.nations[Math.floor(Math.random() * pools.nations.length)]); }, itemHTML(combo.nat), 900),
      spinReel(posStrip, function () { return itemHTML(pools.positions[Math.floor(Math.random() * pools.positions.length)]); }, itemHTML(combo.pos), 1100),
      spinReel(decStrip, function () { return itemHTML(pools.decades[Math.floor(Math.random() * pools.decades.length)]); }, itemHTML(combo.dec), 1300)
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
    ST.usedNames[pl.n] = true;
    stopRoundTimer();
    if (ST.mode === "solo") {
      p.streak++;
      flash("correct");
      doSpin();
      return;
    }
    p.score++;
    if (p.score >= 5) { endGame("won", ST.turnIdx); return; }
    if (isTurnBased()) advanceTurn();
    flash("correct");
    doSpin();
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
  function flash(kind) {
    var el = document.getElementById("rrPrompt");
    if (!el) return;
    var cls = kind === "correct" ? "rr-flash-correct" : "rr-flash-miss";
    el.classList.remove("rr-flash-correct", "rr-flash-miss");
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
      '</div>' +
    '</div>';
  }

  function reelsHTML(natVal, posVal, decVal) {
    return '<div class="rr-reels">' +
      '<div class="reel rr-reel"><div class="reel-strip" id="rrNatStrip">' + itemHTML(natVal || "?") + '</div></div>' +
      '<div class="reel rr-reel"><div class="reel-strip" id="rrPosStrip">' + itemHTML(posVal || "?") + '</div></div>' +
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
      reelsHTML(c.nat, c.pos, c.dec) +
      '<div class="sub" id="rrPrompt">Name a <strong>' + esc(c.pos) + '</strong> who played for <strong>' + esc(c.nat) + '</strong> in the <strong>' + esc(c.dec) + '</strong>.</div>' +
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
        pendingMode = b.getAttribute("data-mode");
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

  /* ---- Entry point ---- */
  W.startTransferRoulette = function () {
    ALL_VIEWS.forEach(function (id) { var v = document.getElementById(id); if (v) v.style.display = "none"; });
    var outer = document.getElementById("rrView");
    if (!outer || !root()) return;
    outer.style.display = "";
    if (W.scrollTo) W.scrollTo(0, 0);
    ST = null;
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
