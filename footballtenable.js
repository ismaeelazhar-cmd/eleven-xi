/* footballtenable.js — Football Tenable, based on the real ITV show's
 * verified rules: name as many of a "top 10" list as you can. 5+ correct
 * is required to bank anything; a scaled point tier for 5 through 10;
 * ONE life — the first wrong guess is forgiven, a second ends the round
 * and forfeits everything from it.
 *
 * Categories reuse the ALREADY-VERIFIED Football 501 stat datasets
 * (data_501_*.js — each already went through the B6 sourcing/cross-check
 * pipeline), trimmed to their top 10 rows rather than re-researching new
 * data from scratch.
 *
 * Self-contained IIFE, same shape as the other new modes this session. */
(function (W) {
  "use strict";

  var ALL_VIEWS = ["homeView","setupView","draftView","resultsView","mpView","leagueView","boardView","rwView","dvcView","euroView","dailyView","challengeView","f501View","rrView","gridView","mineView","topxiView"];
  var STATS_KEY = "tenable_stats_v1";
  /* The real show's banking tiers: 5+ correct required, scaling reward
     for going further. Reused verbatim (as in-game points, not £). */
  var BANK_TIERS = { 5: 1000, 6: 2500, 7: 5000, 8: 10000, 9: 15000, 10: 25000 };

  var ICO = {
    replay: '<svg class="rescue-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/></svg>',
    dice:   '<svg class="rescue-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1" fill="currentColor"/><circle cx="16" cy="16" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>'
  };

  function esc(s) { return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function normalize(s) {
    return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
  }

  function loadStats() { try { return JSON.parse(localStorage.getItem(STATS_KEY) || "{}"); } catch (e) { return {}; } }
  function saveStats(s) { try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch (e) {} }
  function recordResult(catKey, banked, correctCount) {
    var s = loadStats();
    var c = s[catKey] || { rounds: 0, totalBanked: 0, bestCorrect: 0 };
    c.rounds++;
    c.totalBanked += banked;
    c.bestCorrect = Math.max(c.bestCorrect, correctCount);
    s[catKey] = c;
    saveStats(s);
    return c;
  }

  /* Derive "top 10" categories from the already-verified F501 datasets —
     no new data authoring, just a top-N slice of data that's already
     been through the B6 sourcing/cross-check pipeline. */
  function categories() {
    var reg = W.FB501_CATEGORIES || [];
    var out = [];
    reg.forEach(function (c) {
      if (c.locked) return;
      var data = W.FB501_DATA && W.FB501_DATA[c.key];
      if (!data || !data.rows || data.rows.length < 10) return;
      var top10 = data.rows.slice().sort(function (a, b) { return b.v - a.v; }).slice(0, 10);
      out.push({ key: c.key, label: data.label, unit: data.unit, rows: top10, asOf: data.asOf });
    });
    return out;
  }

  /* ---- State ----
     Solo: one round, bank as much as you can. Pass & Play: each player
     gets exactly ONE round on the SAME category (same list, so it's a
     fair head-to-head), taking turns — after player 1's round ends
     (banked or eliminated), player 2 plays the identical list fresh;
     whoever banked more wins. */
  var ST = null;
  var pendingMode = "solo";

  function newState(cat, mode, playerNames) {
    mode = mode || "solo";
    var names = playerNames || (mode === "passplay" ? ["Player 1", "Player 2"] : ["You"]);
    return {
      phase: "play",
      mode: mode,
      category: cat,
      players: names.map(function (n) { return { name: n, banked: null, found: 0, done: false }; }),
      turnIdx: 0,
      winnerIdx: null,
      found: [],        // rows found so far, this player's live round
      livesLeft: 1,      // one life — first wrong forgiven
      outcome: null,    // "eliminated" | "banked" | null
      banked: 0
    };
  }

  function isMultiplayer() { return ST.players.length > 1; }
  function activePlayer() { return ST.players[ST.turnIdx]; }

  function tierFor(count) {
    if (count < 5) return 0;
    var best = 0;
    Object.keys(BANK_TIERS).forEach(function (k) { if (count >= parseInt(k, 10)) best = BANK_TIERS[k]; });
    return best;
  }

  function submitGuess(raw) {
    if (!ST || ST.phase !== "play") return;
    var q = normalize(raw);
    if (!q) { flash("miss"); return; }
    var row = ST.category.rows.filter(function (r) { return !ST.found.some(function (f) { return f.n === r.n; }) && normalize(r.n) === q; })[0];
    if (!row) {
      /* Wrong guess (or a name already found) — uses the one life. */
      ST.livesLeft--;
      flash("bust");
      if (ST.livesLeft < 0) { endRound("eliminated"); return; }
      render();
      return;
    }
    ST.found.push(row);
    flash("correct");
    if (ST.found.length === 10) { endRound("banked"); return; }
    render();
  }

  function bankNow() {
    if (!ST || ST.phase !== "play") return;
    if (ST.found.length < 5) return; // can't bank below 5, matches the real show
    endRound("banked");
  }

  function endRound(outcome) {
    ST.outcome = outcome;
    ST.banked = outcome === "banked" ? tierFor(ST.found.length) : 0;
    if (isMultiplayer()) {
      var p = activePlayer();
      p.banked = ST.banked;
      p.found = ST.found.length;
      p.done = true;
      if (ST.players.every(function (x) { return x.done; })) {
        var b = ST.players.map(function (x) { return x.banked; });
        ST.winnerIdx = b[0] === b[1] ? null : (b[0] > b[1] ? 0 : 1);
        ST.phase = "result";
        render();
        return;
      }
      /* Move to the next player's round on the SAME category/list, fresh
         found/lives — this is an interstitial "pass the device" screen,
         not the final result. */
      ST.turnIdx++;
      ST.found = [];
      ST.livesLeft = 1;
      ST.outcome = null;
      ST.phase = "handoff";
      render();
      return;
    }
    ST.phase = "result";
    ST.statLine = recordResult(ST.category.key, ST.banked, ST.found.length);
    render();
  }

  var flashTimer = null;
  function flash(kind) {
    var el = document.getElementById("tenPrompt");
    if (!el) return;
    var cls = kind === "correct" ? "rr-flash-correct" : "rr-flash-miss";
    el.classList.remove("rr-flash-correct", "rr-flash-miss");
    void el.offsetWidth;
    el.classList.add(cls);
    clearTimeout(flashTimer);
    flashTimer = setTimeout(function () { el.classList.remove("rr-flash-correct", "rr-flash-miss"); }, 380);
  }

  /* ---- Rendering ---- */
  function root() { return document.getElementById("tenBody"); }

  function render() {
    var el = root();
    if (!el || !ST) return;
    if (ST.phase === "play") el.innerHTML = playHTML();
    else if (ST.phase === "handoff") el.innerHTML = handoffHTML();
    else if (ST.phase === "result") el.innerHTML = resultHTML();
    wire();
  }

  function modeSelectHTML() {
    return '<div class="fb501-setup squad-card">' +
      '<div class="squad-head"><h2>Football Tenable</h2></div>' +
      '<div class="sub">How do you want to play?</div>' +
      '<div class="fb501-mode-select">' +
        '<button class="fb501-mode-btn" data-mode="solo"><span class="fb501-mode-btn-name">Solo</span><span class="fb501-mode-btn-desc">Bank as many points as you can.</span></button>' +
        '<button class="fb501-mode-btn" data-mode="passplay"><span class="fb501-mode-btn-name">Pass &amp; Play</span><span class="fb501-mode-btn-desc">Two players, one device — same list, higher bank wins.</span></button>' +
        '<button class="fb501-mode-btn" data-mode="online"><span class="fb501-mode-btn-name">Online 1v1</span><span class="fb501-mode-btn-desc">Head-to-head with a friend, anywhere — share a code.</span></button>' +
      '</div>' +
    '</div>';
  }

  function handoffHTML() {
    var p = activePlayer();
    return '<div class="fb501-setup squad-card">' +
      '<div class="squad-head"><h2>Pass the device</h2></div>' +
      '<div class="sub">' + esc(p.name) + ', you\'re up on the same category: <strong>' + esc(ST.category.label) + '</strong>.</div>' +
      '<button class="btn-primary" id="tenHandoffGo" style="width:100%">' + esc(p.name) + ', start your round →</button>' +
    '</div>';
  }

  function categoryPickHTML() {
    var stats = loadStats();
    var cats = categories();
    var cards = cats.map(function (c) {
      var s = stats[c.key];
      var statLine = s ? (s.rounds + " rounds · best " + s.bestCorrect + "/10") : "";
      return '<button class="h2-mode fb501-cat" data-cat="' + esc(c.key) + '">' +
        '<span class="h2-mode-ico fb501-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="10" width="4" height="10"/><rect x="10" y="6" width="4" height="14"/><rect x="17" y="3" width="4" height="17"/></svg></span>' +
        '<span class="h2-mode-body"><span class="h2-mode-name">' + esc(c.label) + '</span>' +
        '<span class="h2-mode-desc">Top 10 · name as many as you can</span>' +
        (statLine ? '<span class="fl-mode-stat">' + esc(statLine) + '</span>' : '') +
        '</span></button>';
    }).join("");
    return '<div class="fb501-setup squad-card">' +
      '<div class="squad-head"><h2>Football Tenable</h2></div>' +
      '<div class="sub">Name as many of the top 10 as you can. 5+ correct banks points; a second wrong answer ends the round with nothing.</div>' +
      '<button class="btn-ghost fb501-surprise-btn" id="tenSurprise">' + ICO.dice + ' Surprise me</button>' +
      '<div class="fb501-cat-list">' + cards + '</div>' +
    '</div>';
  }

  function playHTML() {
    var c = ST.category;
    var foundNames = {}; ST.found.forEach(function (r) { foundNames[r.n] = true; });
    var listHTML = c.rows.map(function (r, i) {
      var isFound = !!foundNames[r.n];
      return '<div class="player' + (isFound ? "" : " tenable-hidden") + '">' +
        '<span class="pos ' + (isFound ? "DEF" : "MID") + '">#' + (i + 1) + '</span>' +
        '<div class="player-body"><span class="pname">' + (isFound ? esc(r.n) : "?????") + '</span>' +
          (isFound ? '<span class="player-era">' + r.v + ' ' + esc(c.unit) + '</span>' : '') +
        '</div>' +
      '</div>';
    }).join("");
    var canBank = ST.found.length >= 5;
    var turnLabel = isMultiplayer() ? (esc(activePlayer().name) + "'s round · ") : "";
    return '<div class="fb501-play squad-card">' +
      '<div class="squad-head"><h2>' + turnLabel + esc(c.label) + '</h2><span class="fb501-timer">' + (ST.livesLeft + 1) + ' ' + (ST.livesLeft + 1 === 1 ? "life" : "lives") + '</span></div>' +
      '<div class="fb501-score-dial" style="font-size:clamp(28px,8vw,40px);">' + ST.found.length + '/10</div>' +
      '<div class="sub" id="tenPrompt">' + (canBank ? "You can bank now, or keep going for more — one more wrong answer ends the round." : "Name 5 correct to unlock banking.") + '</div>' +
      '<div class="fb501-history">' + listHTML + '</div>' +
      '<div class="squad-search-wrap"><input class="squad-search" id="tenInput" type="text" placeholder="Type a name…" autocomplete="off" /></div>' +
      '<div class="fb501-variant-row">' +
        (canBank ? '<button class="btn-primary" id="tenBank" style="flex:1">Bank ' + tierFor(ST.found.length) + ' pts</button>' : '') +
        '<button class="btn-ghost fb501-quit" style="flex:1">Quit</button>' +
      '</div>' +
    '</div>';
  }

  function resultHTML() {
    if (isMultiplayer()) {
      var title = ST.winnerIdx === null ? "It's a tie!" : (esc(ST.players[ST.winnerIdx].name) + " wins!");
      var sub = ST.players.map(function (p) { return esc(p.name) + ': ' + p.banked + ' pts (' + p.found + '/10)'; }).join(' · ');
      return '<div class="nopicks-popup fb501-result-popup"><div class="nopicks-popup-inner">' +
        '<div class="nopicks-icon">' + (ST.winnerIdx === null ? "🤝" : "🏆") + '</div>' +
        '<div class="nopicks-title">' + title + '</div>' +
        '<div class="nopicks-sub">' + sub + '</div>' +
        '<div class="nopicks-actions">' +
          '<button class="nopicks-btn nopicks-respin" id="tenRematch">' + ICO.replay + ' Play again</button>' +
          '<button class="nopicks-btn nopicks-auto" id="tenBackToMenu">Choose category</button>' +
        '</div>' +
      '</div></div>';
    }
    var banked = ST.outcome === "banked";
    return '<div class="nopicks-popup fb501-result-popup"><div class="nopicks-popup-inner">' +
      '<div class="nopicks-icon">' + (banked ? "🏆" : "💥") + '</div>' +
      '<div class="nopicks-title">' + (banked ? ("Banked " + ST.banked + " pts!") : "Eliminated") + '</div>' +
      '<div class="nopicks-sub">' + ST.found.length + '/10 found' + (ST.statLine ? (' · Best: ' + ST.statLine.bestCorrect + '/10') : '') + '</div>' +
      '<div class="nopicks-actions">' +
        '<button class="nopicks-btn nopicks-respin" id="tenRematch">' + ICO.replay + ' Play again</button>' +
        '<button class="nopicks-btn nopicks-auto" id="tenBackToMenu">Choose category</button>' +
      '</div>' +
    '</div></div>';
  }

  function wire() {
    var el = root();
    if (!el) return;
    Array.prototype.forEach.call(el.querySelectorAll(".fb501-mode-btn"), function (b) {
      b.addEventListener("click", function () {
        var m = b.getAttribute("data-mode");
        if (m === "online") {
          if (W.flToast) W.flToast("Online 1v1 for Football Tenable is coming soon — try Pass & Play for now.");
          return;
        }
        pendingMode = m;
        renderCategoryPick();
      });
    });
    Array.prototype.forEach.call(el.querySelectorAll(".fb501-cat"), function (b) {
      b.addEventListener("click", function () {
        var key = b.getAttribute("data-cat");
        var cat = categories().filter(function (c) { return c.key === key; })[0];
        if (!cat) return;
        var names = pendingMode === "passplay" ? ["Player 1", "Player 2"] : ["You"];
        ST = newState(cat, pendingMode, names);
        render();
      });
    });
    var surprise = el.querySelector("#tenSurprise");
    if (surprise) surprise.addEventListener("click", function () {
      var cats = categories();
      if (!cats.length) return;
      var names = pendingMode === "passplay" ? ["Player 1", "Player 2"] : ["You"];
      ST = newState(cats[Math.floor(Math.random() * cats.length)], pendingMode, names);
      render();
    });
    var input = el.querySelector("#tenInput");
    if (input) {
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") { submitGuess(input.value); input.value = ""; } });
      setTimeout(function () { input.focus(); }, 30);
    }
    var bank = el.querySelector("#tenBank");
    if (bank) bank.addEventListener("click", bankNow);
    var quit = el.querySelector(".fb501-quit");
    if (quit) quit.addEventListener("click", function () { ST = null; renderModeSelect(); });
    var handoffGo = el.querySelector("#tenHandoffGo");
    if (handoffGo) handoffGo.addEventListener("click", function () { ST.phase = "play"; render(); });
    var rematch = el.querySelector("#tenRematch");
    if (rematch) rematch.addEventListener("click", function () {
      var cat = ST.category;
      var mode = ST.mode;
      var names = ST.players.map(function (p) { return p.name; });
      ST = newState(cat, mode, names);
      render();
    });
    var back = el.querySelector("#tenBackToMenu");
    if (back) back.addEventListener("click", function () { ST = null; renderModeSelect(); });
  }

  function renderModeSelect() {
    var el = root();
    if (!el) return;
    pendingMode = "solo";
    el.innerHTML = modeSelectHTML();
    wire();
  }

  function renderCategoryPick() {
    var el = root();
    if (!el) return;
    el.innerHTML = categoryPickHTML();
    wire();
  }

  /* ---- Entry point ---- */
  W.startFootballTenable = function () {
    ALL_VIEWS.forEach(function (id) { var v = document.getElementById(id); if (v) v.style.display = "none"; });
    var outer = document.getElementById("tenView");
    if (!outer || !root()) return;
    outer.style.display = "";
    if (W.scrollTo) W.scrollTo(0, 0);
    ST = null;
    renderModeSelect();
  };

  function init() {
    var back = document.getElementById("tenBack");
    if (back) back.addEventListener("click", function () { if (W.flGoHome) W.flGoHome(); });
    var homeBtn = document.getElementById("homeTenable");
    if (homeBtn) homeBtn.addEventListener("click", function () { W.startFootballTenable(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

})(window);
