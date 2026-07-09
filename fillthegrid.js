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
    return null;
  }

  function submitGuess(raw) {
    if (!ST || ST.phase !== "play" || !ST.activeCell) return;
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
      '<div class="sub" id="gridPrompt">' + (ST.activeCell ? ('Name a player: <strong>' + esc(g.rows[ST.activeCell.r]) + '</strong> × <strong>' + esc(g.cols[ST.activeCell.c]) + '</strong>') : 'Tap an empty cell to fill it.') + '</div>' +
      (ST.activeCell ? '<div class="squad-search-wrap"><input class="squad-search" id="gridInput" type="text" placeholder="Type a name…" autocomplete="off" /></div>' : '') +
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
        if (mode === "online") {
          if (W.flToast) W.flToast("Online 1v1 for Fill the Grid is coming soon — try Pass & Play for now.");
          return;
        }
        pendingMode = mode;
        renderTypeSelect();
      });
    });
    Array.prototype.forEach.call(el.querySelectorAll(".fb501-cat"), function (b) {
      b.addEventListener("click", function () {
        var type = b.getAttribute("data-type");
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

  /* ---- Entry point ---- */
  W.startFillTheGrid = function () {
    ALL_VIEWS.forEach(function (id) { var v = document.getElementById(id); if (v) v.style.display = "none"; });
    var outer = document.getElementById("gridView");
    if (!outer || !root()) return;
    outer.style.display = "";
    if (W.scrollTo) W.scrollTo(0, 0);
    ST = null;
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
