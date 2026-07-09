/* minefield.js — Football Minefield.
 * A grid of hidden cells: some are safe (a real answer to the category),
 * some are mines (a plausible but wrong name). Click a cell — safe reveals
 * and lets you continue, a mine ends the run. Survive as many correct
 * reveals as you can.
 *
 * Self-contained IIFE, same shape as football501.js/transferroulette.js/
 * fillthegrid.js. Category data lives in data_minefield_<category>.js
 * files (window.MINEFIELD_DATA[key] = {label, safe[], mine[], boardSize}). */
(function (W) {
  "use strict";

  var ALL_VIEWS = ["homeView","setupView","draftView","resultsView","mpView","leagueView","boardView","rwView","dvcView","euroView","dailyView","challengeView","f501View","rrView","gridView","topxiView","tenView"];
  var STATS_KEY = "minefield_stats_v1";

  var ICO = {
    replay: '<svg class="rescue-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/></svg>'
  };

  function esc(s) { return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  function loadStats() { try { return JSON.parse(localStorage.getItem(STATS_KEY) || "{}"); } catch (e) { return {}; } }
  function saveStats(s) { try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch (e) {} }
  function recordResult(catKey, safeRevealed) {
    var s = loadStats();
    var c = s[catKey] || { runs: 0, bestSafe: 0 };
    c.runs++;
    c.bestSafe = Math.max(c.bestSafe, safeRevealed);
    s[catKey] = c;
    saveStats(s);
    return c;
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function categories() {
    var data = W.MINEFIELD_DATA || {};
    return Object.keys(data).map(function (key) {
      var d = data[key];
      return { key: key, label: d.label, boardSize: d.boardSize || 6, safe: d.safe || [], mine: d.mine || [], asOf: d.asOf, source: d.source };
    });
  }

  /* ---- Board building ---- */
  function buildBoard(cat) {
    var n = cat.boardSize;
    var totalCells = n * n;
    var safePool = shuffle(cat.safe);
    var minePool = shuffle(cat.mine);
    /* Roughly 65/35 safe/mine split, capped by what's actually available
       in the category's curated pool. */
    var safeCount = Math.min(safePool.length, Math.round(totalCells * 0.65));
    var mineCount = Math.min(minePool.length, totalCells - safeCount);
    /* If the mine pool is short, top back up with more safe cells so the
       board is always fully populated rather than showing empty cells. */
    if (safeCount + mineCount < totalCells) safeCount = Math.min(safePool.length, totalCells - mineCount);
    var chosen = safePool.slice(0, safeCount).map(function (n2) { return { name: n2, mine: false }; })
      .concat(minePool.slice(0, mineCount).map(function (n2) { return { name: n2, mine: true }; }));
    chosen = shuffle(chosen).slice(0, totalCells);
    return { n: n, cells: chosen.map(function (c, i) { return { i: i, name: c.name, mine: c.mine, revealed: false }; }) };
  }

  /* ---- State ----
     Solo: unchanged, survive as long as you can. Pass & Play: two players
     share the SAME board and alternate turns — a mine ends the game
     immediately and the OTHER player wins (they didn't step on it), a
     safe reveal passes the turn and play continues. Board-cleared with
     no mine hit is a joint win (both survived). */
  var ST = null;
  var pendingMode = "solo";

  function newState(catKey, mode, playerNames) {
    var cat = categories().filter(function (c) { return c.key === catKey; })[0];
    if (!cat) return null;
    mode = mode || "solo";
    var names = playerNames || (mode === "passplay" ? ["Player 1", "Player 2"] : ["You"]);
    return {
      phase: "play",
      mode: mode,
      category: cat,
      board: buildBoard(cat),
      players: names.map(function (n) { return { name: n, safeRevealed: 0 }; }),
      turnIdx: 0,
      safeRevealed: 0,
      outcome: null, // "mine" | "cleared" | null
      winnerIdx: null
    };
  }

  function isMultiplayer() { return ST.players.length > 1; }
  function activePlayer() { return ST.players[ST.turnIdx]; }
  function advanceTurn() { ST.turnIdx = (ST.turnIdx + 1) % ST.players.length; }

  function clickCell(idx) {
    if (!ST || ST.phase !== "play") return;
    var cell = ST.board.cells[idx];
    if (!cell || cell.revealed) return;
    var actorIdx = ST.turnIdx;
    cell.revealed = true;
    if (cell.mine) {
      ST.outcome = "mine";
      ST.phase = "result";
      if (isMultiplayer()) {
        /* Whoever clicked the mine loses — the OTHER player wins, since
           they're the one who didn't step on it. */
        ST.winnerIdx = ST.players.length - 1 - actorIdx;
      } else {
        ST.statLine = recordResult(ST.category.key, ST.safeRevealed);
      }
      render();
      return;
    }
    ST.safeRevealed++;
    activePlayer().safeRevealed++;
    var allSafeGone = ST.board.cells.every(function (c) { return c.mine || c.revealed; });
    if (allSafeGone) {
      ST.outcome = "cleared";
      ST.phase = "result";
      if (!isMultiplayer()) ST.statLine = recordResult(ST.category.key, ST.safeRevealed);
    } else if (isMultiplayer()) {
      advanceTurn();
    }
    render();
  }

  /* ---- Rendering ---- */
  function root() { return document.getElementById("mineBody"); }

  function render() {
    var el = root();
    if (!el || !ST) return;
    if (ST.phase === "play") el.innerHTML = playHTML();
    else if (ST.phase === "result") el.innerHTML = resultHTML();
    wire();
  }

  function modeSelectHTML() {
    return '<div class="fb501-setup squad-card">' +
      '<div class="squad-head"><h2>Football Minefield</h2></div>' +
      '<div class="sub">How do you want to play?</div>' +
      '<div class="fb501-mode-select">' +
        '<button class="fb501-mode-btn" data-mode="solo"><span class="fb501-mode-btn-name">Solo</span><span class="fb501-mode-btn-desc">Survive as many safe cells as you can.</span></button>' +
        '<button class="fb501-mode-btn" data-mode="passplay"><span class="fb501-mode-btn-name">Pass &amp; Play</span><span class="fb501-mode-btn-desc">Two players, one device — whoever hits a mine loses.</span></button>' +
        '<button class="fb501-mode-btn" data-mode="online"><span class="fb501-mode-btn-name">Online 1v1</span><span class="fb501-mode-btn-desc">Head-to-head with a friend, anywhere — share a code.</span></button>' +
      '</div>' +
    '</div>';
  }

  function categoryPickHTML() {
    var stats = loadStats();
    var multi = pendingMode === "passplay";
    var cats = categories();
    var cards = cats.map(function (c) {
      var s = stats[c.key];
      var statLine = (!multi && s) ? (s.runs + " runs · best " + s.bestSafe + " safe") : "";
      return '<button class="h2-mode fb501-cat" data-cat="' + esc(c.key) + '">' +
        '<span class="h2-mode-ico fb501-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg></span>' +
        '<span class="h2-mode-body"><span class="h2-mode-name">' + esc(c.label) + '</span>' +
        '<span class="h2-mode-desc">' + c.boardSize + '×' + c.boardSize + ' grid · survive the mines</span>' +
        (statLine ? '<span class="fl-mode-stat">' + esc(statLine) + '</span>' : '') +
        '</span></button>';
    }).join("");
    return '<div class="fb501-setup squad-card">' +
      '<div class="squad-head"><h2>Football Minefield</h2></div>' +
      '<div class="sub">Pick a category. Click cells to reveal them — a correct name is safe, a wrong one is a mine.</div>' +
      '<div class="fb501-cat-list">' + cards + '</div>' +
    '</div>';
  }

  function playHTML() {
    var b = ST.board;
    var multi = isMultiplayer();
    var cellsHTML = b.cells.map(function (c) {
      var cls = "mine-cell" + (c.revealed ? (c.mine ? " mine-cell--mine" : " mine-cell--safe") : "");
      return '<div class="' + cls + '" data-i="' + c.i + '">' + (c.revealed ? esc(c.name) : "?") + '</div>';
    }).join("");
    var statusLine = multi
      ? ST.players.map(function (p, i) { return esc(p.name) + ': ' + p.safeRevealed + (i === ST.turnIdx ? ' (their turn)' : ''); }).join(' · ')
      : ('Safe revealed: ' + ST.safeRevealed + ' · Board: ' + b.n + '×' + b.n);
    return '<div class="fb501-play squad-card">' +
      '<div class="squad-head"><h2>' + esc(ST.category.label) + '</h2></div>' +
      '<div class="sub">' + statusLine + '</div>' +
      '<div class="mine-grid" style="grid-template-columns: repeat(' + b.n + ', 1fr);">' + cellsHTML + '</div>' +
      '<button class="btn-ghost fb501-quit">Quit to menu</button>' +
    '</div>';
  }

  function resultHTML() {
    var cleared = ST.outcome === "cleared";
    var multi = isMultiplayer();
    var title, sub;
    if (multi) {
      if (ST.winnerIdx === null) {
        title = "Both survived!";
        sub = ST.players.map(function (p) { return esc(p.name) + ': ' + p.safeRevealed; }).join(' · ');
      } else {
        var winner = ST.players[ST.winnerIdx];
        title = esc(winner.name) + " wins!";
        sub = ST.players.map(function (p) { return esc(p.name) + ': ' + p.safeRevealed; }).join(' · ');
      }
    } else {
      title = cleared ? "Board cleared!" : "Boom.";
      sub = 'Safe revealed: ' + ST.safeRevealed + (ST.statLine ? (' · Best: ' + ST.statLine.bestSafe) : '');
    }
    return '<div class="nopicks-popup fb501-result-popup"><div class="nopicks-popup-inner">' +
      '<div class="nopicks-icon">' + (multi ? (ST.winnerIdx === null ? "🏆" : "🎉") : (cleared ? "🏆" : "💥")) + '</div>' +
      '<div class="nopicks-title">' + title + '</div>' +
      '<div class="nopicks-sub">' + sub + '</div>' +
      '<div class="nopicks-actions">' +
        '<button class="nopicks-btn nopicks-respin" id="mineRematch">' + ICO.replay + ' New board</button>' +
        '<button class="nopicks-btn nopicks-auto" id="mineBackToMenu">Menu</button>' +
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
          if (W.flToast) W.flToast("Online 1v1 for Football Minefield is coming soon — try Pass & Play for now.");
          return;
        }
        pendingMode = m;
        renderCategoryPick();
      });
    });
    Array.prototype.forEach.call(el.querySelectorAll(".fb501-cat"), function (b) {
      b.addEventListener("click", function () {
        var key = b.getAttribute("data-cat");
        var names = pendingMode === "passplay" ? ["Player 1", "Player 2"] : ["You"];
        var next = newState(key, pendingMode, names);
        if (!next) return;
        ST = next;
        render();
      });
    });
    Array.prototype.forEach.call(el.querySelectorAll(".mine-cell:not(.mine-cell--safe):not(.mine-cell--mine)"), function (td) {
      td.addEventListener("click", function () { clickCell(parseInt(td.getAttribute("data-i"), 10)); });
    });
    var quit = el.querySelector(".fb501-quit");
    if (quit) quit.addEventListener("click", function () { ST = null; renderModeSelect(); });
    var rematch = el.querySelector("#mineRematch");
    if (rematch) rematch.addEventListener("click", function () {
      var key = ST.category.key;
      var mode = ST.mode;
      var names = ST.players.map(function (p) { return p.name; });
      var next = newState(key, mode, names);
      if (!next) return;
      ST = next;
      render();
    });
    var back = el.querySelector("#mineBackToMenu");
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
  W.startMinefield = function () {
    ALL_VIEWS.forEach(function (id) { var v = document.getElementById(id); if (v) v.style.display = "none"; });
    var outer = document.getElementById("mineView");
    if (!outer || !root()) return;
    outer.style.display = "";
    if (W.scrollTo) W.scrollTo(0, 0);
    ST = null;
    renderModeSelect();
  };

  function init() {
    var back = document.getElementById("mineBack");
    if (back) back.addEventListener("click", function () { if (W.flGoHome) W.flGoHome(); });
    var homeBtn = document.getElementById("homeMinefield");
    if (homeBtn) homeBtn.addEventListener("click", function () { W.startMinefield(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

})(window);
