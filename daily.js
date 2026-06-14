/* daily.js — Gaffer Football Wordle
   Guess the football word of the day in 6 tries.
   Exposes: window.startDailyChallenge()
*/
(function (W) {
  "use strict";

  /* ── Word list — curated football terms (5 letters) ────────────── */
  var WORDS = [
    "AGENT","AHEAD","AWARD","BACKS","BENCH","BENDS","BLOCK","BOOTS",
    "BREAK","BURST","CHAIN","CHIPS","CHECK","CLASS","CLEAN","CLOCK",
    "CLIPS","CLUBS","COACH","CREST","CROSS","CROWD","CROWN","CURLS",
    "CURVE","DEBUT","DEPTH","DERBY","DIVES","DRAFT","DRILL","DRIVE",
    "DUMMY","EARLY","ELITE","EXTRA","FIELD","FINAL","FIRST","FLAIR",
    "FLANK","FLICK","FLOAT","FRONT","GLOVE","GLORY","GROUP","GUARD",
    "HEADS","KICKS","LINES","LOANS","LOFTS","LUNGE","MARKS","MATCH",
    "PHASE","PITCH","PIVOT","POWER","PRESS","PRIDE","QUICK","RONDO",
    "ROUND","SAVES","SCORE","SCOUT","SETUP","SHAPE","SHIRT","SHORT",
    "SKILL","SLIDE","SPACE","SPEED","SPORT","SQUAD","STAMP","STAND",
    "STEEL","STRIP","STYLE","SURGE","SWING","TABLE","TALLY","TEMPO",
    "THIRD","TITLE","TOUCH","TRACK","TRADE","TRAPS","TRIAL","TRICK",
    "TURNS","ULTRA","VENUE","WINGS","YOUTH","ZONES","SMART","PHASE",
    "VAULT","WALLS","PRESS","SHOOT","ONION" /* onion bag! */
  ];
  /* Remove dupes and sort */
  var WORD_SET = {};
  WORDS = WORDS.filter(function (w) {
    if (WORD_SET[w]) return false;
    WORD_SET[w] = true; return true;
  });

  /* ── Daily pick ─────────────────────────────────────────────────── */
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function dailyWord() {
    var s = todayStr(), h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return WORDS[Math.abs(h) % WORDS.length];
  }

  /* ── State ──────────────────────────────────────────────────────── */
  var KEY = "gaffer_wordle_v3";
  var MAX = 6;
  var S = {
    answer: "", guesses: [],   /* array of 5-char strings */
    done: false, won: false,
    current: ""               /* letters typed so far this row */
  };

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
      var o = JSON.parse(raw); if (o.day !== todayStr()) return;
      S.guesses = o.guesses || [];
      S.done = !!o.done; S.won = !!o.won;
    } catch (e) {}
  }

  /* ── Comparison ─────────────────────────────────────────────────── */
  /* returns array of 5 states: "hit" | "close" | "miss" */
  function evaluate(guess, answer) {
    var result = ["miss","miss","miss","miss","miss"];
    var ansArr = answer.split("");
    var used   = [false,false,false,false,false];
    /* Pass 1 — exact */
    for (var i = 0; i < 5; i++) {
      if (guess[i] === answer[i]) { result[i] = "hit"; used[i] = true; }
    }
    /* Pass 2 — present elsewhere */
    for (var j = 0; j < 5; j++) {
      if (result[j] === "hit") continue;
      for (var k = 0; k < 5; k++) {
        if (!used[k] && guess[j] === ansArr[k]) {
          result[j] = "close"; used[k] = true; break;
        }
      }
    }
    return result;
  }

  /* ── Keyboard state ─────────────────────────────────────────────── */
  function keyStates() {
    var map = {};
    S.guesses.forEach(function (g) {
      var states = evaluate(g, S.answer);
      g.split("").forEach(function (ch, i) {
        var s = states[i];
        var prev = map[ch];
        if (!prev || s === "hit" || (s === "close" && prev === "miss")) map[ch] = s;
      });
    });
    return map;
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
    var res = S.won ? S.guesses.length + "/" + MAX : "X/" + MAX;
    return "Gaffer Wordle · " + todayStr() + "\n" + res + "\n\n" + emojiGrid() + "\n\ngaffer.app";
  }

  /* ── Render ─────────────────────────────────────────────────────── */
  function render() {
    var v = document.getElementById("dailyBody"); if (!v) return;

    /* ---- Grid rows ---- */
    var gridRows = "";
    for (var row = 0; row < MAX; row++) {
      var isActive   = !S.done && row === S.guesses.length;
      var isComplete = row < S.guesses.length;
      var states = isComplete ? evaluate(S.guesses[row], S.answer) : null;
      gridRows += '<div class="wl-row' + (isActive ? " wl-active" : "") + '" id="wl-row-' + row + '">';
      for (var col = 0; col < 5; col++) {
        var letter = "";
        var cls = "wl-tile";
        if (isComplete) {
          letter = S.guesses[row][col];
          cls += " revealed " + states[col];
          cls += " wl-delay-" + col;
        } else if (isActive) {
          letter = S.current[col] || "";
          cls += letter ? " filled" : "";
        }
        gridRows += '<div class="' + cls + '" id="wl-t-' + row + '-' + col + '">' + letter + '</div>';
      }
      gridRows += '</div>';
    }

    /* ---- Keyboard ---- */
    var km = keyStates();
    var ROWS = [
      ["Q","W","E","R","T","Y","U","I","O","P"],
      ["A","S","D","F","G","H","J","K","L"],
      ["ENTER","Z","X","C","V","B","N","M","⌫"]
    ];
    var kb = '<div class="wl-kb" id="wlKb">';
    ROWS.forEach(function (row) {
      kb += '<div class="wl-kb-row">';
      row.forEach(function (k) {
        var st = km[k] || "";
        var wide = (k === "ENTER" || k === "⌫") ? " wl-wide" : "";
        kb += '<button class="wl-key' + wide + (st ? " " + st : "") + '" data-key="' + k + '">' + k + '</button>';
      });
      kb += '</div>';
    });
    kb += '</div>';

    /* ---- Status message ---- */
    var status = "";
    if (S.done) {
      if (S.won) {
        var lines = ["First try genius!", "Incredible!", "Impressive!", "Great work!", "Nicely done.", "Phew — just!"];
        status = '<div class="wl-toast wl-win" id="wlStatus">' + (lines[S.guesses.length - 1] || "Got it!") +
          ' The word was <strong>' + S.answer + '</strong></div>';
      } else {
        status = '<div class="wl-toast wl-loss" id="wlStatus">The word was <strong>' + S.answer + '</strong></div>';
      }
    }

    /* ---- Share / next ---- */
    var actions = "";
    if (S.done) {
      actions = '<div class="wl-actions">' +
        '<button class="btn-primary wl-share" id="wlShare">📋 Share result</button>' +
        '<p class="wl-tomorrow">🕛 New word at midnight</p>' +
      '</div>';
    }

    var hint = !S.done ? '<p class="wl-hint">Only football words are valid guesses</p>' : "";

    v.innerHTML =
      '<div class="wl-wrap">' +
        '<div class="wl-head">' +
          '<div class="wl-tag">⚽ Daily Wordle</div>' +
          '<h2 class="wl-title">Guess the football word</h2>' +
          '<p class="wl-sub">6 tries · letters turn green when correct</p>' +
        '</div>' +
        '<div id="wlMsg" class="wl-msg"></div>' +
        status +
        '<div class="wl-grid" id="wlGrid">' + gridRows + '</div>' +
        hint +
        kb +
        actions +
      '</div>';

    wireKeys();

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

  /* ── Key handling ────────────────────────────────────────────────── */
  function wireKeys() {
    var kb = document.getElementById("wlKb"); if (!kb) return;
    Array.prototype.forEach.call(kb.querySelectorAll(".wl-key"), function (btn) {
      btn.addEventListener("click", function () { handleKey(btn.getAttribute("data-key")); });
    });
  }

  function handleKey(k) {
    if (S.done) return;
    if (k === "⌫" || k === "BACKSPACE") {
      S.current = S.current.slice(0, -1);
    } else if (k === "ENTER") {
      submitGuess();
      return;
    } else if (/^[A-Z]$/.test(k) && S.current.length < 5) {
      S.current += k;
    }
    updateActiveTiles();
  }

  function updateActiveTiles() {
    var row = S.guesses.length;
    for (var col = 0; col < 5; col++) {
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
    if (S.current.length < 5) { showMsg("Not enough letters"); shakeRow(S.guesses.length); return; }
    if (!WORD_SET[S.current])  { showMsg("Not in word list"); shakeRow(S.guesses.length); return; }

    var guess  = S.current;
    S.guesses.push(guess);
    S.current = "";

    var won = (guess === S.answer);
    if (won || S.guesses.length >= MAX) { S.done = true; S.won = won; }
    saveS();

    /* Flip tiles then re-render */
    flipRow(S.guesses.length - 1, guess, function () { render(); });
  }

  function flipRow(rowIdx, guess, cb) {
    var states = evaluate(guess, S.answer);
    var delay  = 0;
    for (var col = 0; col < 5; col++) {
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

  /* Physical keyboard */
  function onKeyDown(e) {
    if (document.getElementById("dailyView") &&
        document.getElementById("dailyView").style.display === "none") return;
    var k = e.key.toUpperCase();
    if (k === "BACKSPACE" || k === "ENTER" || /^[A-Z]$/.test(k)) {
      e.preventDefault();
      handleKey(k === "BACKSPACE" ? "⌫" : k);
    }
  }

  /* ── Public entry point ─────────────────────────────────────────── */
  W.startDailyChallenge = function () {
    S.answer  = dailyWord();
    S.guesses = []; S.done = false; S.won = false; S.current = "";
    loadS();

    ["homeView","setupView","draftView","resultsView","mpView","leagueView",
     "boardView","rwView","dvcView","euroView","dailyView"
    ].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.style.display = (id === "dailyView") ? "" : "none";
    });

    render();
    document.removeEventListener("keydown", onKeyDown);
    document.addEventListener("keydown", onKeyDown);
  };

}(window));
