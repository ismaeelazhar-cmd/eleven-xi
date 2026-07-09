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

  var ALL_VIEWS = ["homeView","setupView","draftView","resultsView","mpView","leagueView","boardView","rwView","dvcView","euroView","dailyView","challengeView","f501View","rrView","gridView","mineView"];
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

  /* ---- State ---- */
  var ST = null;

  function newState() {
    return {
      phase: "play",
      squad: [], // { n, p, r, country, year }
      budgetLeft: BUDGET,
      outcome: null
    };
  }

  function slotCounts() {
    var c = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
    ST.squad.forEach(function (p) { c[p.p] = (c[p.p] || 0) + 1; });
    return c;
  }
  function openSlots(pos) { return (FORMATION[pos] || 0) - (slotCounts()[pos] || 0); }
  function totalRating() { return ST.squad.reduce(function (s, p) { return s + p.r; }, 0); }

  function pickPlayer(name) {
    if (!ST || ST.phase !== "play") return;
    if (ST.squad.length >= 11) return;
    var pl = pool().filter(function (p) { return p.n === name; })[0];
    if (!pl) return;
    if (ST.squad.some(function (p) { return p.n === pl.n; })) return; // already picked
    if (openSlots(pl.p) <= 0) return; // no slot left for their position
    if (pl.r > ST.budgetLeft) return; // can't afford
    ST.squad.push(pl);
    ST.budgetLeft -= pl.r;
    if (ST.squad.length === 11) { endGame(); return; }
    render();
  }

  function removePlayer(name) {
    var idx = ST.squad.findIndex(function (p) { return p.n === name; });
    if (idx === -1) return;
    ST.budgetLeft += ST.squad[idx].r;
    ST.squad.splice(idx, 1);
    render();
  }

  function endGame() {
    ST.phase = "result";
    ST.statLine = recordResult(totalRating());
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
    var counts = slotCounts();
    var slotsHTML = ["GK", "DEF", "MID", "FWD"].map(function (pos) {
      return '<span class="fl-mode-stat">' + pos + ' ' + counts[pos] + '/' + FORMATION[pos] + '</span>';
    }).join(" ");
    var squadHTML = ST.squad.map(function (p) {
      return '<div class="player">' +
        '<span class="pos ' + p.p + '">' + p.p + '</span>' +
        '<div class="player-body"><span class="pname">' + esc(p.n) + '</span><span class="player-era">' + esc(p.country) + ' · ' + esc(p.year) + ' · ' + p.r + '</span></div>' +
        '<button class="rescue-ico topxi-remove" data-name="' + esc(p.n) + '" style="background:none;border:none;cursor:pointer;color:var(--warning);">✕</button>' +
      '</div>';
    }).join("");
    var candidates = pool().filter(function (p) {
      return !ST.squad.some(function (s) { return s.n === p.n; }) && openSlots(p.p) > 0 && p.r <= ST.budgetLeft;
    }).slice(0, 30);
    var candHTML = candidates.map(function (p) {
      return '<div class="player" data-pick="' + esc(p.n) + '">' +
        '<span class="pos ' + p.p + '">' + p.p + '</span>' +
        '<div class="player-body"><span class="pname">' + esc(p.n) + '</span><span class="player-era">' + esc(p.country) + ' · ' + esc(p.year) + '</span></div>' +
        '<span class="fl-mode-stat">' + p.r + '</span>' +
      '</div>';
    }).join("");
    /* If budget/slots leave nobody affordable, this isn't a dead end — the
       player can always remove a pick to free budget — but that recovery
       path needs to be explained, not left to be discovered by accident
       (the same "never leave a silent dead end" principle behind the
       draft soft-lock fix earlier this session). */
    var stuck = candidates.length === 0 && ST.squad.length < 11;
    return '<div class="fb501-play squad-card">' +
      '<div class="squad-head"><h2>Budget left: ' + ST.budgetLeft + '</h2></div>' +
      '<div class="sub">' + slotsHTML + '</div>' +
      (squadHTML ? '<div class="fb501-history">' + squadHTML + '</div>' : '') +
      (stuck ? '<div class="sub" style="color:var(--warning)">Nobody affordable fits your remaining slots — remove a player above (✕) to free up budget and try a cheaper combination.</div>' : '') +
      '<div class="squad-search-wrap"><input class="squad-search" id="topxiSearch" type="text" placeholder="Search affordable players…" autocomplete="off" /></div>' +
      '<div class="fb501-history" id="topxiCandList">' + candHTML + '</div>' +
      '<button class="btn-ghost fb501-quit">Quit to menu</button>' +
    '</div>';
  }

  function resultHTML() {
    var total = totalRating();
    var squadHTML = ST.squad.map(function (p) {
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
    var start = el.querySelector("#topxiStart");
    if (start) start.addEventListener("click", function () { ST = newState(); render(); });
    Array.prototype.forEach.call(el.querySelectorAll("[data-pick]"), function (row) {
      row.addEventListener("click", function () { pickPlayer(row.getAttribute("data-pick")); });
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
    if (quit) quit.addEventListener("click", function () { ST = null; renderIntro(); });
    var rematch = el.querySelector("#topxiRematch");
    if (rematch) rematch.addEventListener("click", function () { ST = newState(); render(); });
    var back = el.querySelector("#topxiBackToMenu");
    if (back) back.addEventListener("click", function () { ST = null; renderIntro(); });
  }

  function renderIntro() {
    var el = root();
    if (!el) return;
    el.innerHTML = introHTML();
    wire();
  }

  /* ---- Entry point ---- */
  W.startTopXI = function () {
    ALL_VIEWS.forEach(function (id) { var v = document.getElementById(id); if (v) v.style.display = "none"; });
    var outer = document.getElementById("topxiView");
    if (!outer || !root()) return;
    outer.style.display = "";
    if (W.scrollTo) W.scrollTo(0, 0);
    ST = null;
    renderIntro();
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
