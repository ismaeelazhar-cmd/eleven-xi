/* daily.js — Draft XI Sport Wordle
   Word length 5–7, adapts grid, all words accepted as guesses.
   Exposes: window.startDailyChallenge()
*/
(function (W) {
  "use strict";

  /* ── Sport word bank (5–7 letters) ─────────────────────────────── */
  var WORDS = [
    /* 5-letter */
    "COACH","PITCH","SQUAD","DRAFT","DERBY","BOOTS","SCORE","SAVES",
    "BENCH","CROWD","GLOVE","PRESS","SPEED","SKILL","SPACE","STYLE",
    "TITLE","YOUTH","ZONES","STRIP","TEMPO","SURGE","POWER","PIVOT",
    "FLANK","FLAIR","FINAL","EXTRA","ELITE","DEBUT","CROSS","CROWN",
    "CREST","DEPTH","DUMMY","DRILL","DRIVE","SCOUT","RONDO","ROUND",
    "SLIDE","SHAPE","SHIRT","SHORT","STAND","STAMP","STEEL","SWING",
    "TABLE","TALLY","THIRD","TOUCH","TRACK","TRADE","TRIAL","TRICK",
    "TURNS","VENUE","WINGS","FLICK","FLOAT","FRONT","GUARD","HEADS",
    "KICKS","LINES","LOANS","LUNGE","MARKS","MATCH","PHASE","SHOOT",
    "ONION","VAULT","WALLS","SMART","ULTRA",
    /* 6-letter */
    "TACKLE","CORNER","GOALIE","KEEPER","WINGER","HEADER","DRIBBL",
    "YELLOW","REFEREE","ASSIST","SEASON","TROPHY","LEAGUE","STRIKE",
    "DEFEND","ATTACK","BOOTCAMP","SPRINT","AERIAL","VOLLEY","NUTMEG",
    "FINISH","OFFSID","PENALT","FREEKICK","REPLAY","LINEUP","ROSTER",
    "TIERCE","RIBBON","SCOUTS","PLAYER","KILLER","MARKER","ANCHOR",
    "AGILITY","DIRECT","SIGNAL","OPTION","SWITCH","WINNER","JERSEY",
    "MASCOT","MEDICS","PUNDIT","TIPOFF","BUZZER","CREASE","WICKET",
    "STUMPS","INNING","UMPIRE","JOCKEY","PADDLE","SADDLE","RACKET",
    "PODIUM","SPRINT","HURDLE","DISCUS","HAMMER","JAVELIN","MEDLEY",
    /* 7-letter */
    "CAPTAIN","MANAGER","FORWARD","DEFENCE","OFFSIDE","PENALTY",
    "DRIBBLE","FREEKICK","WEMBLEY","STADIUM","FIXTURE","BOOKING",
    "OFFENCE","STRIKER","PLAYOFF","CIRCUIT","TIMEOUT","BLITZ","CHARITY",
    "CENTURY","INNINGS","FIELDER","OUTPOST","MIDFIELD","ANCHORS",
    "SHOOTER","REBOUND","DUNKING","FREETHROW","PIVOTING","HEADERS",
    "COUNTER","ZONAL","SWEEPER","SHUTTLE","SMASHES","SERVICE",
    "VOLLEYS","DEUCE","BREAKPOINT","DOUBLES","SINGLES","RANKING",
    "GRANDSLAM","WILDCARD","SEEDINGS","CHAMPION","KNOCKOUT","RELEGATION"
  ];

  /* Deduplicate and enforce 5–7 chars, letters only */
  var seen = {};
  WORDS = WORDS.filter(function (w) {
    w = w.toUpperCase();
    if (seen[w] || !/^[A-Z]{5,7}$/.test(w)) return false;
    seen[w] = true; return true;
  }).map(function (w) { return w.toUpperCase(); });

  /* Bucket by length */
  var BY_LEN = { 5: [], 6: [], 7: [] };
  WORDS.forEach(function (w) { if (BY_LEN[w.length]) BY_LEN[w.length].push(w); });

  /* ── Daily pick ─────────────────────────────────────────────────── */
  /* "Day" resets at 12:00 BST = 11:00 UTC.
     Shift UTC back by 11h so the boundary falls at the right moment. */
  function wordleDay() {
    var utcMs = Date.now() - 11 * 60 * 60 * 1000;
    var d = new Date(utcMs);
    return {
      str: d.getUTCFullYear() + "-" + (d.getUTCMonth() + 1) + "-" + d.getUTCDate(),
      idx: Math.floor(utcMs / 86400000)
    };
  }
  function djb2(s) {
    var h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return Math.abs(h);
  }
  function dailyWord() {
    var day = wordleDay();
    /* Alternate: 5 → 6 → 5 → 6 … */
    var len = day.idx % 2 === 0 ? 5 : 6;
    var pool = BY_LEN[len];
    if (!pool || !pool.length) { pool = BY_LEN[5]; len = 5; }
    return pool[djb2(day.str) % pool.length];
  }
  function todayStr() { return wordleDay().str; }

  /* ── State ──────────────────────────────────────────────────────── */
  var KEY = "gaffer_wordle_v4";
  var S = {
    answer: "", len: 5,
    guesses: [], done: false, won: false, current: ""
  };
  var MAX_ROWS; /* = S.len + 1 */

  function saveS() {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        day: todayStr(), guesses: S.guesses, done: S.done, won: S.won
      }));
      if (S.done) localStorage.setItem("wcxi_daily_ts", String(Date.now()));
    } catch (e) {}
  }
  function loadS() {
    try {
      var raw = localStorage.getItem(KEY); if (!raw) return;
      var o = JSON.parse(raw);
      if (o.day !== todayStr()) return;
      S.guesses = (o.guesses || []).filter(function (g) { return g.length === S.len; });
      S.done = !!o.done; S.won = !!o.won;
    } catch (e) {}
  }

  /* ── Comparison ─────────────────────────────────────────────────── */
  function evaluate(guess, answer) {
    var n = answer.length;
    var result = [], ansArr = answer.split(""), used = [];
    for (var i = 0; i < n; i++) { result.push("miss"); used.push(false); }
    for (var i = 0; i < n; i++) {
      if (guess[i] === answer[i]) { result[i] = "hit"; used[i] = true; }
    }
    for (var j = 0; j < n; j++) {
      if (result[j] === "hit") continue;
      for (var k = 0; k < n; k++) {
        if (!used[k] && guess[j] === ansArr[k]) {
          result[j] = "close"; used[k] = true; break;
        }
      }
    }
    return result;
  }

  /* ── Emoji share ─────────────────────────────────────────────────── */
  function emojiGrid() {
    return S.guesses.map(function (g) {
      return evaluate(g, S.answer).map(function (s) {
        return s === "hit" ? "🟩" : s === "close" ? "🟨" : "⬜";
      }).join("");
    }).join("\n");
  }
  function shareText() {
    var res = S.won ? S.guesses.length + "/" + MAX_ROWS : "X/" + MAX_ROWS;
    return "Draft XI Sport Wordle · " + todayStr() + "\n" + res + "\n\n" + emojiGrid() + "\n\ndraft-11.com";
  }

  /* ── Render ─────────────────────────────────────────────────────── */
  function render() {
    var v = document.getElementById("dailyBody"); if (!v) return;
    var n = S.len;

    var gridRows = "";
    for (var row = 0; row < MAX_ROWS; row++) {
      var isActive   = !S.done && row === S.guesses.length;
      var isComplete = row < S.guesses.length;
      var states = isComplete ? evaluate(S.guesses[row], S.answer) : null;
      gridRows += '<div class="wl-row' + (isActive ? " wl-active" : "") + '" id="wl-row-' + row + '">';
      for (var col = 0; col < n; col++) {
        var letter = "";
        var cls = "wl-tile";
        if (isComplete) {
          letter = S.guesses[row][col];
          cls += " revealed " + states[col] + " wl-delay-" + col;
        } else if (isActive) {
          letter = S.current[col] || "";
          cls += letter ? " filled" : "";
        }
        gridRows += '<div class="' + cls + '" id="wl-t-' + row + '-' + col + '">' + letter + '</div>';
      }
      gridRows += '</div>';
    }

    var status = "";
    if (S.done) {
      if (S.won) {
        var lines = ["First try genius!", "Incredible!", "Impressive!", "Great work!", "Nicely done.", "Phew — just!", "So close!"];
        status = '<div class="wl-toast wl-win" id="wlStatus">' +
          (lines[S.guesses.length - 1] || "Got it!") +
          ' The word was <strong>' + S.answer + '</strong></div>';
      } else {
        status = '<div class="wl-toast wl-loss" id="wlStatus">The word was <strong>' + S.answer + '</strong></div>';
      }
    }

    var actions = "";
    if (S.done) {
      actions = '<div class="wl-actions">' +
        '<button class="btn-primary wl-share" id="wlShare">📋 Share result</button>' +
        '<p class="wl-tomorrow">🕛 New word at midnight</p>' +
      '</div>';
    }

    var inputEl = !S.done
      ? '<input id="wlInput" class="wl-hidden-input" type="text" autocomplete="off" autocorrect="off" autocapitalize="characters" spellcheck="false" maxlength="' + n + '" inputmode="text" aria-label="Type your guess" />'
      : "";

    v.innerHTML =
      '<div class="wl-wrap">' +
        '<div class="wl-head">' +
          '<div class="wl-tag">⚽ Daily Sport Wordle</div>' +
          '<h2 class="wl-title">Guess the sport word</h2>' +
          '<p class="wl-sub">' + n + ' letters · ' + MAX_ROWS + ' tries · green = correct</p>' +
        '</div>' +
        '<div id="wlMsg" class="wl-msg"></div>' +
        status +
        inputEl +
        '<div class="wl-grid wl-grid-' + n + '" id="wlGrid">' + gridRows + '</div>' +
        actions +
      '</div>';

    wireInput();

    var shareBtn = document.getElementById("wlShare");
    if (shareBtn) {
      shareBtn.addEventListener("click", function () {
        var txt = shareText();
        try { if (navigator.share) { navigator.share({ text: txt }); return; } } catch (e) {}
        if (navigator.clipboard) {
          navigator.clipboard.writeText(txt).then(function () {
            shareBtn.textContent = "✅ Copied!";
            setTimeout(function () { shareBtn.textContent = "📋 Share result"; }, 2200);
          });
        }
      });
    }
  }

  /* ── Input / key handling ───────────────────────────────────────── */
  function wireInput() {
    var inp = document.getElementById("wlInput"); if (!inp) return;
    setTimeout(function () { inp.focus(); }, 80);

    var grid = document.getElementById("wlGrid");
    if (grid) grid.addEventListener("click", function () { inp.focus(); });

    inp.addEventListener("keydown", function (e) {
      if (S.done) return;
      var k = e.key;
      if (k === "Backspace") {
        e.preventDefault();
        S.current = S.current.slice(0, -1);
        updateActiveTiles();
      } else if (k === "Enter") {
        e.preventDefault();
        submitGuess();
      } else if (/^[a-zA-Z]$/.test(k) && S.current.length < S.len) {
        e.preventDefault();
        S.current += k.toUpperCase();
        updateActiveTiles();
      }
      inp.value = "";
    });

    inp.addEventListener("input", function () {
      if (S.done) { inp.value = ""; return; }
      var val = inp.value.replace(/[^a-zA-Z]/g, "").toUpperCase();
      inp.value = "";
      for (var i = 0; i < val.length && S.current.length < S.len; i++) {
        S.current += val[i];
      }
      updateActiveTiles();
    });
  }

  function updateActiveTiles() {
    var row = S.guesses.length;
    for (var col = 0; col < S.len; col++) {
      var tile = document.getElementById("wl-t-" + row + "-" + col);
      if (!tile) continue;
      var ch = S.current[col] || "";
      tile.textContent = ch;
      tile.className = "wl-tile" + (ch ? " filled" : "");
    }
  }

  function showMsg(txt, dur) {
    var el = document.getElementById("wlMsg"); if (!el) return;
    el.textContent = txt; el.style.opacity = "1";
    setTimeout(function () { el.style.opacity = "0"; }, dur || 1800);
  }

  function shakeRow(row) {
    var el = document.getElementById("wl-row-" + row); if (!el) return;
    el.classList.add("wl-shake");
    setTimeout(function () { el.classList.remove("wl-shake"); }, 600);
  }

  function submitGuess() {
    if (S.current.length < S.len) {
      showMsg("Need " + S.len + " letters");
      shakeRow(S.guesses.length);
      return;
    }
    /* All words accepted — no word list check */
    var guess = S.current;
    S.guesses.push(guess);
    S.current = "";
    var won = (guess === S.answer);
    if (won || S.guesses.length >= MAX_ROWS) { S.done = true; S.won = won; }
    saveS();
    flipRow(S.guesses.length - 1, guess, function () { render(); });
  }

  function flipRow(rowIdx, guess, cb) {
    var states = evaluate(guess, S.answer);
    var delay = 0;
    for (var col = 0; col < S.len; col++) {
      (function (c) {
        var tile = document.getElementById("wl-t-" + rowIdx + "-" + c);
        if (!tile) return;
        setTimeout(function () {
          tile.classList.add("flipping");
          setTimeout(function () {
            tile.classList.add("revealed", states[c]);
            tile.classList.remove("flipping", "filled");
          }, 200);
        }, delay);
      })(col);
      delay += 100;
    }
    setTimeout(cb, delay + 220);
  }

  /* Physical keyboard — re-focus hidden input */
  function onKeyDown(e) {
    var view = document.getElementById("dailyView");
    if (!view || view.style.display === "none") return;
    var inp = document.getElementById("wlInput");
    if (!inp) return;
    if (document.activeElement !== inp) inp.focus();
  }

  /* ── Public entry point ─────────────────────────────────────────── */
  W.startDailyChallenge = function () {
    S.answer  = dailyWord();
    S.len     = S.answer.length;
    MAX_ROWS  = S.len + 1;
    S.guesses = []; S.done = false; S.won = false; S.current = "";
    loadS();

    ["homeView","setupView","draftView","resultsView","mpView","leagueView",
     "boardView","rwView","dvcView","euroView","challengeView","dailyView"
    ].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.style.display = (id === "dailyView") ? "" : "none";
    });

    document.body.setAttribute("data-view", "daily");
    Array.prototype.forEach.call(document.querySelectorAll("#bottomNav .bnav-pill"), function (b) {
      b.classList.toggle("active", b.id === "bnavDaily");
    });

    render();
    document.removeEventListener("keydown", onKeyDown);
    document.addEventListener("keydown", onKeyDown);
  };

}(window));
