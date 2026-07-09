/* football501.js — Football 501 (M1: solo practice, client-only, no backend).
 * Darts-501 scoring on football stats: start at 501, each correct name in the
 * active category subtracts that player's stat value, first to exactly 0 wins,
 * going below 0 is a bust (score reverts, guess doesn't count).
 *
 * Self-contained IIFE, same shape as draftvscomputer.js: window.startFootball501()
 * is the public entry point; the home-card click handler is wired here too,
 * mirroring how multiplayer.js self-wires its own "homeLeague" button. */
(function (W) {
  "use strict";

  var ALL_VIEWS = ["homeView","setupView","draftView","resultsView","mpView","leagueView","boardView","rwView","dvcView","euroView","dailyView","challengeView"];
  var TIMED_SECONDS = 60;
  var STATS_KEY = "fb501_stats_v1";
  /* Real 501 darts: the maximum possible single-visit score is 180 (three
     treble-20s) — no legal dart throw is ever worth more. A guess whose
     real stat value exceeds this isn't a reduced throw, it's an illegal
     one: score doesn't move, the go is used up. This is what forces
     players toward small, precise finishing numbers — the actual
     checkout tension the format is built on. */
  var MAX_THROW = 180;

  /* Small inline-SVG icons for action buttons — replaces the 🔁/🚩 emoji
     used as functional button-label icons, matching the icon language
     used for the same rescue-action pattern in game.js/draftvscomputer.js/multiplayer.js. */
  var ICO = {
    replay: '<svg class="rescue-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/></svg>',
    flag:   '<svg class="rescue-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><path d="M5 21V4"/><path d="M5 4h13l-3 4 3 4H5"/></svg>'
  };

  function esc(s) { return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  /* Normalize a name for matching: lowercase, strip diacritics/punctuation,
     collapse whitespace. Lets "Şükrü"/"sukru" or "N'Golo Kante"/"ngolo kante"
     both match without needing an exact-character guess. */
  function normalize(s) {
    return String(s || "")
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function loadStats() {
    try { return JSON.parse(localStorage.getItem(STATS_KEY) || "{}"); } catch (e) { return {}; }
  }
  function saveStats(s) {
    try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch (e) {}
  }
  function recordResult(catKey, won, guessCount) {
    var stats = loadStats();
    var s = stats[catKey] || { wins: 0, attempts: 0, bestGuesses: null };
    s.attempts++;
    if (won) {
      s.wins++;
      if (s.bestGuesses == null || guessCount < s.bestGuesses) s.bestGuesses = guessCount;
    }
    stats[catKey] = s;
    saveStats(stats);
    return s;
  }

  function categories() {
    var reg = W.FB501_CATEGORIES || [];
    return reg.map(function (c) {
      var data = !c.locked && W.FB501_DATA && W.FB501_DATA[c.key];
      return {
        key: c.key,
        locked: !!c.locked || !data,
        label: (data && data.label) || c.label || c.key,
        unit: (data && data.unit) || c.unit || "",
        rows: (data && data.rows) || [],
        asOf: (data && data.asOf) || null,
        source: (data && data.source) || null
      };
    });
  }

  /* ---- State ---- */
  var ST = null;

  function newState(cat, variant) {
    return {
      phase: "play",
      category: cat,
      variant: variant,               // "classic" | "timed"
      score: 501,
      used: {},
      history: [],                    // { name, v, resultScore, bust }
      timerEnd: variant === "timed" ? (Date.now() + TIMED_SECONDS * 1000) : null,
      timerId: null,
      outcome: null                   // "won" | "timeout" | null
    };
  }

  function findMatch(raw, rows, used) {
    var q = normalize(raw);
    if (!q) return null;
    for (var i = 0; i < rows.length; i++) {
      if (used[rows[i].n]) continue;
      if (normalize(rows[i].n) === q) return rows[i];
    }
    return null;
  }

  function submitGuess(raw) {
    if (!ST || ST.phase !== "play") return;
    var row = findMatch(raw, ST.category.rows, ST.used);
    if (!row) { flash("miss"); return; }
    if (row.v > MAX_THROW) {
      /* Illegal throw, not a bust — no real dart visit is ever worth more
         than 180, so this guess could never have been "thrown" at all.
         Distinct from a bust (score-would-go-negative): here the score
         genuinely can't move. Also NOT marked used, same reasoning as
         busts below — a name that's currently too big to throw might
         still be the right answer once the score is lower. */
      ST.history.unshift({ name: row.n, v: row.v, resultScore: ST.score, over: true });
      render();
      flash("bust");
      return;
    }
    var next = ST.score - row.v;
    if (next < 0) {
      /* Bust — the player didn't actually score with this name (their
         score was too low for it to fit), so it must NOT be marked as
         "used": that would permanently lock out a valid answer after one
         unlucky guess and could make a category unsolvable if too few
         names remain. Leave it guessable again once the score is lower. */
      ST.history.unshift({ name: row.n, v: row.v, resultScore: ST.score, bust: true });
      /* render() rebuilds the DOM, so flash the (new) score dial AFTER
         rendering — flashing first would animate a node that's about to
         be destroyed and the animation would never actually play. */
      render();
      flash("bust");
      return;
    }
    ST.used[row.n] = true;
    ST.score = next;
    ST.history.unshift({ name: row.n, v: row.v, resultScore: next, bust: false });
    if (next === 0) {
      endGame("won");
      return;
    }
    render();
    flash("correct");
  }

  function endGame(outcome) {
    ST.phase = "result";
    ST.outcome = outcome;
    stopTimer();
    var won = outcome === "won";
    var guesses = ST.history.filter(function (h) { return !h.bust; }).length;
    ST.statLine = recordResult(ST.category.key, won, guesses);
    render();
  }

  function stopTimer() {
    if (ST && ST.timerId) { clearInterval(ST.timerId); ST.timerId = null; }
  }
  function startTimer() {
    stopTimer();
    if (!ST || ST.variant !== "timed") return;
    ST.timerId = setInterval(function () {
      if (!ST) return;
      var remain = ST.timerEnd - Date.now();
      if (remain <= 0) { endGame("timeout"); return; }
      var badge = document.getElementById("fb501Timer");
      if (badge) badge.textContent = Math.ceil(remain / 1000) + "s";
    }, 250);
  }

  var flashTimer = null;
  function flash(kind) {
    var el = document.getElementById("fb501Score");
    if (!el) return;
    var cls = kind === "bust" ? "fb501-flash-bust" : kind === "correct" ? "fb501-flash-correct" : "fb501-flash-miss";
    el.classList.remove("fb501-flash-miss", "fb501-flash-bust", "fb501-flash-correct");
    void el.offsetWidth;
    el.classList.add(cls);
    clearTimeout(flashTimer);
    flashTimer = setTimeout(function () { el.classList.remove("fb501-flash-miss", "fb501-flash-bust", "fb501-flash-correct"); }, 420);
  }

  /* ---- Rendering ---- */
  /* f501View is the outer section (holds the persistent back button);
     f501Body is where render() swaps content — never touch f501View's
     innerHTML directly or the back button gets wiped. */
  function root() { return document.getElementById("f501Body"); }

  function render() {
    var el = root();
    if (!el || !ST) return;
    if (ST.phase === "play") el.innerHTML = playHTML();
    else if (ST.phase === "result") el.innerHTML = resultHTML();
    wire();
    if (ST.phase === "play" && ST.variant === "timed") startTimer();
  }

  function categoryPickHTML() {
    var stats = loadStats();
    var cats = categories();
    var cards = cats.map(function (c) {
      var s = stats[c.key];
      var statLine = s ? (s.wins + "/" + s.attempts + " won" + (s.bestGuesses != null ? " · best " + s.bestGuesses : "")) : "";
      return '<button class="h2-mode fb501-cat' + (c.locked ? " fb501-cat-locked" : "") + '" data-cat="' + esc(c.key) + '"' + (c.locked ? " disabled" : "") + '>' +
        '<span class="h2-mode-ico fb501-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.2"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/></svg></span>' +
        '<span class="h2-mode-body"><span class="h2-mode-name">' + esc(c.label) + '</span>' +
        '<span class="h2-mode-desc">' + (c.locked ? "Coming soon" : "Race to zero · " + esc(c.unit)) + '</span>' +
        (statLine ? '<span class="fl-mode-stat">' + esc(statLine) + '</span>' : '') +
        '</span></button>';
    }).join("");
    return '<div class="fb501-setup squad-card">' +
      '<div class="squad-head"><h2>Football 501</h2></div>' +
      '<div class="sub">Pick a category. Start on 501, subtract each correct answer, land exactly on zero to win.</div>' +
      '<div class="fb501-variant-row">' +
        '<button class="btn-primary fb501-variant-btn active" data-variant="classic">Classic</button>' +
        '<button class="btn-ghost fb501-variant-btn" data-variant="timed">Timed (' + TIMED_SECONDS + 's)</button>' +
      '</div>' +
      '<button class="btn-ghost fb501-surprise-btn" id="fb501Surprise">🎲 Surprise me</button>' +
      '<div class="fb501-cat-list">' + cards + '</div>' +
    '</div>';
  }

  /* Picks a random unlocked category and jumps straight into play with it,
     using whichever variant (Classic/Timed) is currently selected. */
  function surpriseCategory() {
    var el = root();
    var unlocked = categories().filter(function (c) { return !c.locked; });
    if (!unlocked.length) return;
    var cat = unlocked[Math.floor(Math.random() * unlocked.length)];
    var variantBtn = el && el.querySelector(".fb501-variant-btn.active");
    var variant = variantBtn ? variantBtn.getAttribute("data-variant") : "classic";
    ST = newState(cat, variant);
    render();
  }

  function playHTML() {
    var c = ST.category;
    var historyHTML = ST.history.slice(0, 8).map(function (h) {
      var cls = h.over ? "fb501-hist-over" : h.bust ? "fb501-hist-bust" : "";
      var tag = h.over ? "OVER" : h.bust ? "BUST" : ("−" + h.v);
      var posCls = h.over ? "MID" : h.bust ? "FWD" : "DEF";
      var sub = h.over ? ('Their ' + esc(c.unit) + ' (' + h.v + ') is over ' + MAX_THROW + ' — no dart visit is worth that much, no go.') : "";
      return '<div class="player fb501-hist-row' + (cls ? " " + cls : "") + '">' +
        '<span class="pos ' + posCls + '">' + tag + '</span>' +
        '<div class="player-body"><span class="pname">' + esc(h.name) + '</span>' +
          (sub ? '<span class="player-flavour">' + sub + '</span>' : '') +
        '</div>' +
      '</div>';
    }).join("");
    return '<div class="fb501-play squad-card">' +
      '<div class="squad-head"><h2>' + esc(c.label) + '</h2>' +
        (ST.variant === "timed" ? '<span class="fb501-timer" id="fb501Timer">' + TIMED_SECONDS + 's</span>' : '') +
      '</div>' +
      '<div class="fb501-score-dial" id="fb501Score">' + ST.score + '</div>' +
      '<div class="sub">Name a ' + esc(c.label.toLowerCase()) + ' entry to subtract their ' + esc(c.unit) + '. Exact zero wins — over ' + MAX_THROW + ' or below zero is no good, just like a real 501 visit.</div>' +
      '<div class="squad-search-wrap"><input class="squad-search" id="fb501Input" type="text" placeholder="Type a name…" autocomplete="off" /></div>' +
      '<div class="fb501-history">' + historyHTML + '</div>' +
      '<button class="btn-ghost fb501-quit">Quit to categories</button>' +
      (c.asOf ? '<div class="fb501-asof">Stats accurate as of ' + esc(c.asOf) + '</div>' : '') +
    '</div>';
  }

  function resultHTML() {
    var won = ST.outcome === "won";
    var guesses = ST.history.filter(function (h) { return !h.bust; }).length;
    return '<div class="nopicks-popup fb501-result-popup">' +
      '<div class="nopicks-popup-inner">' +
        '<div class="nopicks-icon">' + (won ? "🏆" : "⏰") + '</div>' +
        '<div class="nopicks-title">' + (won ? "Checked out!" : "Time's up") + '</div>' +
        '<div class="nopicks-sub">' + (won ? ("Finished in " + guesses + " guess" + (guesses === 1 ? "" : "es") + ".") : ("Left on " + ST.score + " — so close.")) + '</div>' +
        '<div class="nopicks-actions">' +
          '<button class="nopicks-btn nopicks-respin" id="fb501Rematch">' + ICO.replay + ' Play again</button>' +
          '<button class="nopicks-btn nopicks-auto" id="fb501BackToCats">Choose category</button>' +
        '</div>' +
        '<button class="fb501-report-link" id="fb501ReportStat">' + ICO.flag + ' Spot a wrong stat?</button>' +
      '</div>' +
    '</div>';
  }

  function wire() {
    var el = root();
    if (!el) return;
    Array.prototype.forEach.call(el.querySelectorAll(".fb501-cat:not(.fb501-cat-locked)"), function (b) {
      b.addEventListener("click", function () {
        var key = b.getAttribute("data-cat");
        var cat = categories().filter(function (c) { return c.key === key; })[0];
        if (!cat || cat.locked) return;
        var variantBtn = el.querySelector(".fb501-variant-btn.active");
        var variant = variantBtn ? variantBtn.getAttribute("data-variant") : "classic";
        ST = newState(cat, variant);
        render();
      });
    });
    var surpriseBtn = el.querySelector("#fb501Surprise");
    if (surpriseBtn) surpriseBtn.addEventListener("click", surpriseCategory);
    Array.prototype.forEach.call(el.querySelectorAll(".fb501-variant-btn"), function (b) {
      b.addEventListener("click", function () {
        Array.prototype.forEach.call(el.querySelectorAll(".fb501-variant-btn"), function (o) {
          o.classList.remove("active", "btn-primary"); o.classList.add("btn-ghost");
        });
        b.classList.remove("btn-ghost"); b.classList.add("active", "btn-primary");
      });
    });
    var input = el.querySelector("#fb501Input");
    if (input) {
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { submitGuess(input.value); input.value = ""; }
      });
      setTimeout(function () { input.focus(); }, 30);
    }
    var quit = el.querySelector(".fb501-quit");
    if (quit) quit.addEventListener("click", function () { stopTimer(); ST = null; renderCategoryPick(); });
    var rematch = el.querySelector("#fb501Rematch");
    if (rematch) rematch.addEventListener("click", function () {
      var cat = ST.category, variant = ST.variant;
      ST = newState(cat, variant);
      render();
    });
    var back = el.querySelector("#fb501BackToCats");
    if (back) back.addEventListener("click", function () { ST = null; renderCategoryPick(); });
    var reportBtn = el.querySelector("#fb501ReportStat");
    if (reportBtn) reportBtn.addEventListener("click", function () { reportStatIssue(); });
  }

  /* No backend yet (M1) — store reports locally so they're not lost, and
     surface a clear channel for the player. This is the interim "report a
     problem" path called for in the plan's B6 data accuracy pipeline; once
     stats.js/Firestore lands (M2+) this should write to a shared
     "dataReports" collection instead of localStorage. */
  function reportStatIssue() {
    if (!ST || !ST.category) return;
    var note = window.prompt("Which name/stat looked wrong? (optional: add a note)", "");
    if (note == null) return; // cancelled
    var report = {
      category: ST.category.key,
      asOf: ST.category.asOf || null,
      note: note,
      recentGuesses: ST.history.slice(0, 5).map(function (h) { return h.name + " (" + h.v + (h.bust ? ", busted" : "") + ")"; }),
      at: new Date().toISOString()
    };
    try {
      var log = JSON.parse(localStorage.getItem("fb501_reports") || "[]");
      log.push(report);
      localStorage.setItem("fb501_reports", JSON.stringify(log));
    } catch (e) {}
    if (W.flToast) W.flToast("Thanks — flagged for review.");
    else window.alert("Thanks — flagged for review.");
  }

  function renderCategoryPick() {
    var el = root();
    if (!el) return;
    el.innerHTML = categoryPickHTML();
    wire();
  }

  /* ---- Entry point ---- */
  function goHome() {
    stopTimer(); ST = null;
    var outer = document.getElementById("f501View"); if (outer) outer.style.display = "none";
    var home = document.getElementById("homeView"); if (home) home.style.display = "";
  }

  W.startFootball501 = function () {
    ALL_VIEWS.forEach(function (id) { var v = document.getElementById(id); if (v) v.style.display = "none"; });
    var outer = document.getElementById("f501View");
    if (!outer || !root()) return;
    outer.style.display = "";
    if (W.scrollTo) W.scrollTo(0, 0);
    ST = null;
    renderCategoryPick();
  };

  function init() {
    var back = document.getElementById("f501Back");
    if (back) back.addEventListener("click", function () { if (W.flGoHome) W.flGoHome(); else goHome(); });
    var homeBtn = document.getElementById("homeF501");
    if (homeBtn) homeBtn.addEventListener("click", function () { W.startFootball501(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

})(window);
