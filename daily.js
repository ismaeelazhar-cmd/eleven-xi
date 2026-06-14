/* daily.js — Gaffer Football Wordle
   A daily "guess the mystery player" challenge with Wordle-style tile feedback.
   Exposes: window.startDailyChallenge()
*/
(function (W) {
  "use strict";

  /* ── Continent lookup ───────────────────────────────────────────── */
  var CONT = {
    "Germany":"Europe","France":"Europe","Italy":"Europe","Spain":"Europe",
    "England":"Europe","Netherlands":"Europe","Portugal":"Europe","Belgium":"Europe",
    "Croatia":"Europe","Czech Republic":"Europe","Denmark":"Europe","Sweden":"Europe",
    "Norway":"Europe","Switzerland":"Europe","Poland":"Europe","Hungary":"Europe",
    "Yugoslavia":"Europe","Romania":"Europe","Bulgaria":"Europe","Greece":"Europe",
    "Turkey":"Europe","Ukraine":"Europe","Russia":"Europe","Serbia":"Europe",
    "Scotland":"Europe","Wales":"Europe","Austria":"Europe","Slovakia":"Europe",
    "Slovenia":"Europe","Republic of Ireland":"Europe","Ireland":"Europe",
    "Iceland":"Europe","Finland":"Europe","Northern Ireland":"Europe",
    "Brazil":"S. America","Argentina":"S. America","Uruguay":"S. America",
    "Colombia":"S. America","Chile":"S. America","Paraguay":"S. America",
    "Peru":"S. America","Ecuador":"S. America","Bolivia":"S. America","Venezuela":"S. America",
    "Mexico":"N. America","United States":"N. America","Costa Rica":"N. America",
    "Honduras":"N. America","Jamaica":"N. America","Trinidad and Tobago":"N. America",
    "Panama":"N. America","Cuba":"N. America","El Salvador":"N. America",
    "Cameroon":"Africa","Nigeria":"Africa","Ghana":"Africa","Senegal":"Africa",
    "Morocco":"Africa","Egypt":"Africa","Ivory Coast":"Africa","Togo":"Africa",
    "Algeria":"Africa","Tunisia":"Africa","South Africa":"Africa","Mali":"Africa",
    "DR Congo":"Africa","Angola":"Africa","Zambia":"Africa","Zimbabwe":"Africa",
    "Japan":"Asia","South Korea":"Asia","Saudi Arabia":"Asia","Iran":"Asia",
    "China":"Asia","Australia":"Asia","North Korea":"Asia","Kuwait":"Asia",
    "United Arab Emirates":"Asia","Qatar":"Asia","Israel":"Asia","Indonesia":"Asia",
    "Kazakhstan":"Asia","Malaysia":"Asia","New Zealand":"Asia"
  };

  var LINE_OF = {
    GK:"GK",CB:"DEF",RB:"DEF",LB:"DEF",RWB:"DEF",LWB:"DEF",
    CDM:"MID",CM:"MID",CAM:"MID",AM:"MID",RM:"MID",LM:"MID",
    RW:"FWD",LW:"FWD",ST:"FWD",CF:"FWD",SS:"FWD"
  };

  var LINE_ICON = { GK:"🧤", DEF:"🛡️", MID:"⚙️", FWD:"⚡" };

  /* ── Pool building ──────────────────────────────────────────────── */
  function buildPool() {
    var seen = {}, pool = [];
    function addFrom(data) {
      if (!data) return;
      Object.keys(data).forEach(function (country) {
        var yrs = (data[country] && data[country].years) || {};
        Object.keys(yrs).forEach(function (year) {
          (yrs[year] || []).forEach(function (pl) {
            if (!pl || !pl.n || (pl.r || 0) < 80) return;
            var key = pl.n + "|" + country + "|" + year;
            if (seen[key]) return;
            seen[key] = true;
            var pos = pl.gp || pl.p || "CM";
            pool.push({
              n: pl.n, r: pl.r || 80, pos: pos,
              line: LINE_OF[pos] || "MID",
              country: country, year: parseInt(year, 10),
              cont: CONT[country] || "Other"
            });
          });
        });
      });
    }
    addFrom(W.WORLD_CUP_DATA);
    addFrom(W.CL_DATA);
    addFrom(W.EURO_DATA);
    return pool;
  }

  /* ── Daily seed ─────────────────────────────────────────────────── */
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function dailyIdx(pool) {
    var s = todayStr();
    var h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return Math.abs(h) % pool.length;
  }

  /* ── State ──────────────────────────────────────────────────────── */
  var DC_KEY = "gaffer_wordle_v1";
  var MAX_G  = 6;
  var S = { pool: null, answer: null, guesses: [], done: false, won: false };

  function saveS() {
    try {
      localStorage.setItem(DC_KEY, JSON.stringify({
        day: todayStr(),
        guesses: S.guesses.map(function (g) { return g.p.n + "|" + g.p.country + "|" + g.p.year; }),
        done: S.done, won: S.won
      }));
      /* Also mark daily timestamp so results screen CTA knows */
      if (S.done) localStorage.setItem("wcxi_daily_ts", String(Date.now()));
    } catch (e) {}
  }
  function loadS() {
    try {
      var raw = localStorage.getItem(DC_KEY); if (!raw) return;
      var o = JSON.parse(raw); if (o.day !== todayStr()) return;
      o.guesses.forEach(function (key) {
        var pts = key.split("|");
        var pl = S.pool.filter(function (p) {
          return p.n === pts[0] && p.country === pts[1] && String(p.year) === pts[2];
        })[0];
        if (pl) commitGuess(pl, true);
      });
    } catch (e) {}
  }

  /* ── Comparison ─────────────────────────────────────────────────── */
  function compare(g, ans) {
    /* year */
    var yDiff = Math.abs(g.year - ans.year);
    var yState = yDiff === 0 ? "hit" : yDiff <= 4 ? "close" : "miss";
    var yArrow = g.year < ans.year ? " ▲" : g.year > ans.year ? " ▼" : "";
    /* rating */
    var rDiff = Math.abs(g.r - ans.r);
    var rState = rDiff <= 2 ? "hit" : rDiff <= 6 ? "close" : "miss";
    var rArrow = g.r < ans.r ? " ▲" : g.r > ans.r ? " ▼" : "";
    return [
      { key: "line",  label: LINE_ICON[g.line] + " " + g.line,     state: g.line === ans.line ? "hit" : "miss" },
      { key: "nat",   label: g.country,                             state: g.country === ans.country ? "hit" : "miss" },
      { key: "year",  label: String(g.year) + (yState !== "hit" ? yArrow : ""), state: yState },
      { key: "rtg",   label: String(g.r)    + (rState !== "hit" ? rArrow : ""), state: rState },
      { key: "cont",  label: g.cont,                                state: g.cont === ans.cont ? "hit" : "miss" }
    ];
  }

  function commitGuess(pl, silent) {
    var cells = compare(pl, S.answer);
    S.guesses.push({ p: pl, cells: cells });
    var allHit = cells.every(function (c) { return c.state === "hit"; });
    if (allHit) { S.done = true; S.won = true; }
    else if (S.guesses.length >= MAX_G) { S.done = true; S.won = false; }
    if (!silent) { saveS(); render(); }
  }

  /* ── Emoji share grid ───────────────────────────────────────────── */
  function emojiGrid() {
    return S.guesses.map(function (g) {
      return g.cells.map(function (c) {
        return c.state === "hit" ? "🟩" : c.state === "close" ? "🟨" : "⬜";
      }).join("");
    }).join("\n");
  }
  function shareText() {
    var result = S.won ? "✅ " + S.guesses.length + "/" + MAX_G : "❌ " + MAX_G + "/" + MAX_G;
    return "Gaffer Wordle · " + todayStr() + "\n" + result + "\n\n" + emojiGrid() + "\n\ngaffer.app";
  }

  /* ── Escape ─────────────────────────────────────────────────────── */
  function esc(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ── Render ─────────────────────────────────────────────────────── */
  var COL_LABELS = ["LINE", "NATION", "YEAR", "RATING", "CONTINENT"];

  function render() {
    var v = document.getElementById("dailyBody"); if (!v) return;
    var html = '<div class="dc-wrap">';

    /* Header */
    html += '<div class="dc-head">' +
      '<div class="dc-tag">⚽ Daily Wordle</div>' +
      '<h2 class="dc-title">Who is the mystery player?</h2>' +
      '<p class="dc-sub">Guess in ' + MAX_G + ' — clues reveal after each pick</p>' +
      '<div class="dc-legend">' +
        '<span class="dc-leg hit">🟩 Correct</span>' +
        '<span class="dc-leg close">🟨 Close</span>' +
        '<span class="dc-leg miss">⬜ Wrong</span>' +
      '</div>' +
    '</div>';

    /* Grid */
    html += '<div class="dc-grid">';
    /* Column headers */
    html += '<div class="dc-row dc-col-hdr"><div class="dc-name-col"></div>';
    COL_LABELS.forEach(function (l) { html += '<div class="dc-cell dc-hcell">' + l + '</div>'; });
    html += '</div>';

    /* Past guesses */
    S.guesses.forEach(function (g, gi) {
      var allHit = g.cells.every(function (c) { return c.state === "hit"; });
      html += '<div class="dc-row dc-guess-row' + (allHit ? " dc-row-win" : "") + '">';
      html += '<div class="dc-name-col dc-pname">' + esc(g.p.n) + '</div>';
      g.cells.forEach(function (cell) {
        html += '<div class="dc-cell ' + cell.state + '"><span class="dc-val">' + esc(cell.label) + '</span></div>';
      });
      html += '</div>';
    });

    /* Empty rows */
    for (var i = S.guesses.length; i < MAX_G; i++) {
      html += '<div class="dc-row dc-empty-row"><div class="dc-name-col"></div>';
      COL_LABELS.forEach(function () { html += '<div class="dc-cell dc-blank"></div>'; });
      html += '</div>';
    }
    html += '</div>'; /* /dc-grid */

    /* Done state */
    if (S.done) {
      var ans = S.answer;
      if (S.won) {
        html += '<div class="dc-result dc-win">' +
          '<div class="dc-result-title">⚽ Got it in ' + S.guesses.length + '!</div>' +
          '<div class="dc-result-ans">' + esc(ans.n) + ' · ' + esc(ans.country) + ' ' + ans.year + ' · ' + ans.r + ' OVR</div>' +
        '</div>';
      } else {
        html += '<div class="dc-result dc-loss">' +
          '<div class="dc-result-title">Not today — the answer was:</div>' +
          '<div class="dc-result-ans">' + esc(ans.n) + ' · ' + esc(ans.country) + ' ' + ans.year + ' · ' + ans.r + ' OVR · ' + esc(ans.line) + '</div>' +
        '</div>';
      }
      html += '<button class="dc-share-btn btn-primary" id="dcShare">📋 Copy result</button>';
      html += '<p class="dc-tomorrow">🕛 New challenge at midnight</p>';
    } else {
      /* Input area */
      html += '<div class="dc-input-area">' +
        '<div class="dc-guess-status">' + S.guesses.length + ' of ' + MAX_G + ' guesses used</div>' +
        '<div class="dc-search-wrap">' +
          '<input class="dc-search" id="dcSearch" type="text" placeholder="Search player name…" autocomplete="off" spellcheck="false" />' +
        '</div>' +
        '<div class="dc-suggestions" id="dcSugs"></div>' +
      '</div>';
    }

    html += '</div>'; /* /dc-wrap */
    v.innerHTML = html;

    /* Wire events */
    if (!S.done) wireInput();
    var shareBtn = document.getElementById("dcShare");
    if (shareBtn) {
      shareBtn.addEventListener("click", function () {
        var txt = shareText();
        try { if (navigator.share) { navigator.share({ text: txt }); return; } } catch (e) {}
        if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () {
          shareBtn.textContent = "✅ Copied!";
          setTimeout(function () { shareBtn.textContent = "📋 Copy result"; }, 2200);
        });
      });
    }
  }

  /* ── Autocomplete ───────────────────────────────────────────────── */
  function wireInput() {
    var inp  = document.getElementById("dcSearch");
    var sugs = document.getElementById("dcSugs");
    if (!inp || !sugs) return;

    /* Build name → players map for fast lookup */
    var nameMap = {};
    S.pool.forEach(function (pl) {
      var k = pl.n;
      if (!nameMap[k]) nameMap[k] = [];
      nameMap[k].push(pl);
    });

    var alreadyKeys = {};
    S.guesses.forEach(function (g) { alreadyKeys[g.p.n + "|" + g.p.country + "|" + g.p.year] = true; });

    function showSugs() {
      var q = inp.value.toLowerCase().trim();
      sugs.innerHTML = "";
      sugs.style.display = "none";
      if (q.length < 2) return;
      var names = Object.keys(nameMap).filter(function (n) {
        return n.toLowerCase().indexOf(q) !== -1;
      });
      /* Sort: starts-with first */
      names.sort(function (a, b) {
        var as = a.toLowerCase().startsWith(q) ? 0 : 1;
        var bs = b.toLowerCase().startsWith(q) ? 0 : 1;
        return as - bs || a.localeCompare(b);
      });
      var shown = 0;
      names.forEach(function (name) {
        if (shown >= 8) return;
        nameMap[name].forEach(function (pl) {
          if (shown >= 8) return;
          var gKey = pl.n + "|" + pl.country + "|" + pl.year;
          if (alreadyKeys[gKey]) return;
          shown++;
          var div = document.createElement("div");
          div.className = "dc-sug-item";
          div.innerHTML =
            '<span class="dc-sug-name">' + esc(pl.n) + '</span>' +
            '<span class="dc-sug-meta">' + esc(pl.country) + ' · ' + pl.year + ' · ' + pl.r + ' OVR</span>';
          div.addEventListener("mousedown", function (e) {
            e.preventDefault(); /* keep focus */
            inp.value = "";
            sugs.innerHTML = "";
            sugs.style.display = "none";
            alreadyKeys[gKey] = true;
            commitGuess(pl);
          });
          sugs.appendChild(div);
        });
      });
      sugs.style.display = shown ? "block" : "none";
    }

    inp.addEventListener("input", showSugs);
    inp.addEventListener("blur", function () {
      setTimeout(function () { sugs.style.display = "none"; }, 200);
    });
    inp.addEventListener("focus", showSugs);
    setTimeout(function () { inp.focus(); }, 80);
  }

  /* ── Public entry point ─────────────────────────────────────────── */
  W.startDailyChallenge = function () {
    /* Lazy-init pool & answer */
    if (!S.pool) {
      S.pool   = buildPool();
      S.answer = S.pool[dailyIdx(S.pool)];
      loadS();
    }

    /* Show dailyView, hide everything else */
    ["homeView","setupView","draftView","resultsView","mpView","leagueView",
     "boardView","rwView","dvcView","euroView","dailyView"
    ].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.style.display = id === "dailyView" ? "" : "none";
    });

    render();
  };

}(window));
