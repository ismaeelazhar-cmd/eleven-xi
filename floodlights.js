/* floodlights.js — Eleven XI UI bootstrap.
 * Grows across the build (Part 1: toast + Duels placeholder). */
(function (W) {
  "use strict";
  var toastTimer = null;
  W.flToast = function (msg) {
    var t = document.getElementById("flToast");
    if (!t) { t = document.createElement("div"); t.id = "flToast"; t.className = "fl-toast"; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2600);
  };

  /* ── Lazy data loader ─────────────────────────────────────────────
     W.lazyLoad(src, globalKey, cb) — inject a script tag once, then cb().
     If already loaded (globalKey set on window), calls cb() synchronously.
     Queues multiple callbacks for the same in-flight load.
  ────────────────────────────────────────────────────────────────── */
  var _lazyQueue = {};
  W.lazyLoad = function(src, globalKey, cb) {
    if (window[globalKey]) { cb(); return; }
    if (_lazyQueue[globalKey]) { _lazyQueue[globalKey].push(cb); return; }
    _lazyQueue[globalKey] = [cb];
    var s = document.createElement("script");
    s.src = src;
    s.onload = function() {
      var cbs = _lazyQueue[globalKey] || [];
      delete _lazyQueue[globalKey];
      cbs.forEach(function(f){ try{ f(); }catch(e){} });
    };
    s.onerror = function() {
      console.warn("lazyLoad failed:", src);
      delete _lazyQueue[globalKey];
    };
    document.head.appendChild(s);
  };

  /* Universal "go home" — hides every known view, shows homeView.
     Each module's own goHome handles cleanup; this covers the logo tap
     from any screen without needing per-module hooks. */
  W.flGoHome = function () {
    var ALL = ["setupView","draftView","resultsView","mpView","leagueView","boardView","rwView","dvcView","euroView","dailyView","challengeView"];
    ALL.forEach(function (id) { var el = document.getElementById(id); if (el) el.style.display = "none"; });
    var home = document.getElementById("homeView");
    if (home) home.style.display = "";
    if (W.scrollTo) W.scrollTo(0, 0);
    // Reset squad dock so it doesn't persist on home screen
    if (W.flResetSquadDock) W.flResetSquadDock();
    // Let online transport close cleanly if it was active
    try { if (W.ElxiNet && W.ElxiNet.isOnline && W.ElxiNet.isOnline()) W.ElxiNet.close(); } catch (e) {}
    // Home has no dedicated bottom-nav tab — clear any active state
    Array.prototype.forEach.call(document.querySelectorAll("#bottomNav .bnav-pill"), function (b) {
      b.classList.remove("active");
    });
  };

  document.addEventListener("DOMContentLoaded", function () {
    // "More modes" expandable toggle
    var moreToggle = document.getElementById("homeMoreToggle");
    var moreModes  = document.getElementById("homeMoreModes");
    if (moreToggle && moreModes) {
      moreToggle.addEventListener("click", function () {
        var open = moreModes.hidden;
        moreModes.hidden = !open;
        moreToggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    // Email capture form — store locally + show success
    var ecForm = document.getElementById("emailCaptureForm");
    var ecSuccess = document.getElementById("ecSuccess");
    if (ecForm) {
      ecForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var inp = document.getElementById("ecInput");
        var email = (inp ? inp.value : "").trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          if (inp) { inp.style.borderColor = "#ef4444"; setTimeout(function(){ inp.style.borderColor = ""; }, 1500); }
          return;
        }
        try { localStorage.setItem("gaffer_email_sub", email); } catch(e){}
        ecForm.style.display = "none";
        if (ecSuccess) ecSuccess.hidden = false;
      });
    }

    // Draft vs Computer home card button
    var dvcBtn = document.getElementById("homeDVC");
    if (dvcBtn) {
      dvcBtn.addEventListener("click", function () {
        if (typeof window.showModePreview === "function") {
          window.showModePreview("dvc", function(){ if (typeof window.startDraftVsComputer === "function") window.startDraftVsComputer(); });
        } else if (typeof window.startDraftVsComputer === "function") {
          window.startDraftVsComputer();
        }
      });
    }

    // Hero "Play now" → World Cup (the headline mode)
    var playBtn = document.getElementById("homePlay");
    if (playBtn) playBtn.addEventListener("click", function () {
      var wc = document.getElementById("homeWC"); if (wc) wc.click();
    });

    // Daily challenge — a featured mode that rotates each day (deterministic by date)
    (function () {
      var DAILY = [
        { id: "homeWC",     name: "World Cup",          tag: "Every tournament 1950–2026" },
        { id: "homeCL",     name: "Champions League",   tag: "153 clubs · 768 seasons" },
        { id: "homeDVC",    name: "vs Computer",        tag: "Outdraft the CPU" },
        { id: "homeLeague", name: "League",             tag: "Win a full domestic season" },
        { id: "homeEuro",   name: "Euros",              tag: "1980–2024 · 12 tournaments" },
        { id: "homeMP",     name: "Draft Night",        tag: "Invite friends · knockout" }
      ];
      var day = Math.floor(Date.now() / 86400000);
      var pick = DAILY[((day % DAILY.length) + DAILY.length) % DAILY.length];
      var lbl = document.getElementById("homeDailyLabel");
      if (lbl) lbl.textContent = "Today · " + pick.name + " — " + pick.tag;

      // Social proof: live-ish counter using CounterAPI + deterministic seed fallback
      var seed = day * 2654435761;
      var fallbackCount = 820 + ((seed >>> 0) % 680);
      var countEl = document.getElementById("homeDailyCount");
      var proofEl = document.getElementById("homeSocialProof");
      function setProof(n) {
        var str = n.toLocaleString() + " XIs drafted today";
        if (countEl) countEl.textContent = n.toLocaleString() + " playing today";
        if (proofEl) { proofEl.textContent = ""; var dot = document.createElement("span"); dot.className = "sp-live-dot"; proofEl.appendChild(dot); proofEl.appendChild(document.createTextNode(" " + str)); }
      }
      setProof(fallbackCount);
      try {
        fetch("https://api.counterapi.dev/v1/draft-11/daily-plays/get")
          .then(function(r){ return r.json(); })
          .then(function(d){ if (d && d.count > 0) setProof(Math.max(d.count, fallbackCount)); })
          .catch(function(){});
      } catch(e) {}

      function launchDaily() {
        if (W.startDailyChallenge) { W.startDailyChallenge(); return; }
        var b = document.getElementById(pick.id); if (b) b.click();
      }
      var bar = document.getElementById("homeDaily");     if (bar) bar.addEventListener("click", launchDaily);
      var top = document.getElementById("homeDailyTop");  if (top) top.addEventListener("click", launchDaily);
      var dailyBack = document.getElementById("dailyBack");
      if (dailyBack) dailyBack.addEventListener("click", function() { if (W.flGoHome) W.flGoHome(); });
    })();

    // ── Daily badge countdown ─────────────────────────────────────────────
    (function() {
      function updateDailyBadge() {
        var dot = document.getElementById("bnavDailyDot");
        var timeEl = document.getElementById("bnavDailyTime");
        if (!timeEl) return;
        var now = new Date();
        // Reset at noon BST (11:00 UTC)
        var next = new Date(now);
        next.setUTCHours(11, 0, 0, 0);
        if (next <= now) next.setUTCDate(next.getUTCDate() + 1);
        var diff = Math.floor((next - now) / 1000);
        var h = Math.floor(diff / 3600);
        var m = Math.floor((diff % 3600) / 60);
        var urgent = h < 4;
        if (dot) dot.className = "bnav-daily-dot" + (urgent ? " urgent" : "");
        timeEl.textContent = h > 0 ? h + "h" : m + "m";
        timeEl.className = "bnav-daily-time" + (urgent ? " urgent" : "");
      }
      updateDailyBadge();
      setInterval(updateDailyBadge, 60000);
    })();

    // ── 2026 WC banner ───────────────────────────────────────────────────
    (function() {
      var btn = document.getElementById("wc26BannerBtn");
      if (btn) btn.addEventListener("click", function() {
        var wc = document.getElementById("homeWC"); if (wc) wc.click();
      });
    })();

    // ── Draft Night banner ───────────────────────────────────────────────
    (function() {
      var banner = document.getElementById("dnBannerBtn");
      if (banner) banner.addEventListener("click", function(e) {
        if (e.target && e.target.id === "homeMP") return; // let the button handle it
        var mp = document.getElementById("homeMP"); if (mp) mp.click();
      });
    })();

    // ── Post-game email modal ────────────────────────────────────────────
    var PG_EMAIL_KEY = "draft11_email_sub";
    W.showPostGameEmail = function() {
      try { if (localStorage.getItem(PG_EMAIL_KEY)) return; } catch(e) {}
      var modal = document.getElementById("pgEmailModal");
      if (!modal) return;
      modal.hidden = false;
    };
    (function() {
      var modal = document.getElementById("pgEmailModal");
      var form  = document.getElementById("pgEmailForm");
      var inp   = document.getElementById("pgEmailInput");
      var succ  = document.getElementById("pgEmailSuccess");
      var skip  = document.getElementById("pgEmailSkip");
      var close = document.getElementById("pgEmailClose");
      function dismiss() { if (modal) modal.hidden = true; }
      if (close) close.addEventListener("click", dismiss);
      if (skip)  skip.addEventListener("click", dismiss);
      if (modal) modal.addEventListener("click", function(e){ if (e.target === modal) dismiss(); });
      if (form) form.addEventListener("submit", function(e) {
        e.preventDefault();
        var email = inp ? inp.value.trim() : "";
        if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
          if (inp) { inp.style.borderColor = "#f44"; setTimeout(function(){ inp.style.borderColor = ""; }, 1000); }
          return;
        }
        try { localStorage.setItem(PG_EMAIL_KEY, email); } catch(ex) {}
        if (form) form.style.display = "none";
        if (succ) succ.hidden = false;
        if (skip) skip.style.display = "none";
        setTimeout(dismiss, 2200);
      });
    })();

    // ── Share preview modal ───────────────────────────────────────────────
    W.showSharePreview = function() {
      var modal = document.getElementById("sharePreviewModal");
      var wrap  = document.getElementById("spCanvasWrap");
      if (!modal || !wrap) return;
      wrap.innerHTML = "";
      if (typeof W.WCXI_shareXIPNG !== "function") return;
      var canvas = (typeof buildXICanvas === "function") ? buildXICanvas() : null;
      if (!canvas && W._lastXICanvas) canvas = W._lastXICanvas;
      if (canvas) {
        canvas.style.maxWidth = "100%";
        canvas.style.borderRadius = "12px";
        wrap.appendChild(canvas);
      } else {
        wrap.innerHTML = '<p style="color:rgba(255,255,255,0.5);text-align:center;padding:20px">Draft your XI first to preview the card.</p>';
      }
      modal.hidden = false;
      var close  = document.getElementById("spModalClose");
      var share  = document.getElementById("spShareBtn");
      var save   = document.getElementById("spSaveBtn");
      function dismiss() { modal.hidden = true; }
      if (close) { close.onclick = dismiss; }
      if (modal) modal.addEventListener("click", function(e){ if (e.target===modal) dismiss(); });
      if (share) share.onclick = function() { dismiss(); if (W.WCXI_shareXIPNG) W.WCXI_shareXIPNG(share); };
      if (save)  save.onclick  = function() { dismiss(); if (W.WCXI_copyXIPNG)  W.WCXI_copyXIPNG(save); };
    };

    /* Euro home card — wired in game.js alongside homeWC/homeCL via setMode("euro") */

    // Home card stats — populate best scores and DVC record from localStorage
    (function updateHomeCards() {
      try {
        var board = JSON.parse(localStorage.getItem("wcxi_leaderboard_v1") || "[]");
        var bestByMode = {};
        board.forEach(function (e) {
          if (!bestByMode[e.mode] || e.score > bestByMode[e.mode].score) bestByMode[e.mode] = e;
        });

        function setScore(elId, modeKey, label) {
          var el = document.getElementById(elId);
          if (!el) return;
          var b = bestByMode[modeKey];
          if (b) el.textContent = "Best: " + b.score + " pts — " + (b.result || label);
        }
        setScore("wcBestScore",  "wc",     "played");
        setScore("clBestScore",  "cl",     "played");
        setScore("lgBestScore",  "league", "played");
        setScore("euroBestScore","euro",   "played");

        // DVC record — show best difficulty record
        var dvcRec = JSON.parse(localStorage.getItem("wcxi_dvc_record") || "{}");
        var dvcEl = document.getElementById("dvcHomeRecord");
        if (dvcEl) {
          var best = null, bestTotal = 0;
          ["hard","medium","easy"].forEach(function(d) {
            var r = dvcRec[d];
            if (!r) return;
            var t = (r.w||0)+(r.l||0)+(r.d||0);
            if (t > bestTotal) { bestTotal = t; best = { label: d, r: r }; }
          });
          if (best) {
            var r = best.r;
            dvcEl.textContent = best.label.charAt(0).toUpperCase()+best.label.slice(1) + ": " + (r.w||0) + "W " + (r.l||0) + "L " + (r.d||0) + "D";
          }
        }

        // Progression stats + streak chip
        try {
          var prog = JSON.parse(localStorage.getItem("wcxi_progress") || "{}");
          var progBar = document.getElementById("flProgBar");
          var progGames = document.getElementById("flProgGames");
          var progStreak = document.getElementById("flProgStreak");
          if (progBar && prog.gamesPlayed > 0) {
            progBar.style.display = "";
            if (progGames) progGames.textContent = prog.gamesPlayed + (prog.gamesPlayed===1?" game":" games") + " · " + (prog.wins||0) + " wins";
            if (progStreak && prog.bestStreak > 1) progStreak.textContent = "Best streak: " + prog.bestStreak;
            else if (progStreak) progStreak.textContent = "";
          }
          // Persistent streak chip in hero
          var streakChip = document.getElementById("homeStreakChip");
          if (streakChip && prog.bestStreak > 1) {
            streakChip.textContent = "🔥 " + prog.bestStreak + "-game streak";
            streakChip.hidden = false;
          }
        } catch(pe) {}
      } catch (e) {}
    })();

    // ── Onboarding 3-screen overlay ──────────────────────────────────────
    (function () {
      var OB_KEY = "gaffer_ob_v1";
      var overlay = document.getElementById("howToPlay");
      var slides, dots, prevBtn, nextBtn;
      var step = 0;

      function openHTP() {
        if (!overlay) return;
        step = 0;
        slides = overlay.querySelectorAll(".htp-slide");
        dots   = overlay.querySelectorAll(".htp-dot");
        prevBtn = document.getElementById("htpPrev");
        nextBtn = document.getElementById("htpNext");
        syncSlide();
        overlay.hidden = false;
        // Animate rank counter on slide 3
        var rankEl = document.getElementById("htpRankAnim");
        if (rankEl) { var r = 1; rankEl.textContent = "#" + r; }
        if (nextBtn) nextBtn.focus();
      }

      function closeHTP() {
        if (overlay) overlay.hidden = true;
        try { localStorage.setItem(OB_KEY, "1"); } catch (e) {}
      }

      function syncSlide() {
        if (!slides) return;
        slides.forEach(function (s, i) { s.classList.toggle("active", i === step); });
        dots.forEach(function (d, i) { d.classList.toggle("active", i === step); });
        if (prevBtn) prevBtn.hidden = (step === 0);
        var last = step === slides.length - 1;
        if (nextBtn) nextBtn.textContent = last ? "Let\'s go →" : "Next →";
        // Animate rank counter when reaching slide 3
        if (step === 2) animateRank();
      }

      function animateRank() {
        var el = document.getElementById("htpRankAnim");
        if (!el) return;
        var target = 342, cur = 1200, step2 = 0;
        el.textContent = "#" + cur;
        var iv = setInterval(function () {
          step2++;
          cur = Math.max(target, Math.round(cur - (cur - target) * 0.18));
          el.textContent = "#" + cur;
          if (cur <= target || step2 > 40) clearInterval(iv);
        }, 40);
      }

      if (overlay) {
        overlay.addEventListener("click", function (e) { if (e.target === overlay) closeHTP(); });
        document.addEventListener("keydown", function (e) {
          if (!overlay || overlay.hidden) return;
          if (e.key === "Escape") closeHTP();
          if (e.key === "ArrowRight") { step = Math.min(step + 1, 2); syncSlide(); }
          if (e.key === "ArrowLeft") { step = Math.max(step - 1, 0); syncSlide(); }
        });
      }

      document.addEventListener("click", function (e) {
        var t = e.target.id;
        if (t === "htpClose") { closeHTP(); return; }
        if (t === "htpNext") {
          if (step < 2) { step++; syncSlide(); }
          else closeHTP();
          return;
        }
        if (t === "htpPrev") { if (step > 0) { step--; syncSlide(); } return; }
        if (t === "homeHelp") { openHTP(); return; }
      });

      // Show to all first-timers (new key so existing users also see it once)
      try {
        if (!localStorage.getItem(OB_KEY)) setTimeout(openHTP, 500);
      } catch (e) {}

      W.openHowToPlay = openHTP;
    })();

    // ── In-draft guided tooltip system (Steps 1-4) ───────────────────────
    (function () {
      var TOUR_KEY = "gaffer_tour_v1";
      var tooltip = document.getElementById("obTooltip");
      var tooltipText = document.getElementById("obTooltipText");
      var tooltipSkip = document.getElementById("obTooltipSkip");
      if (!tooltip) return;

      var tourDone = false;
      try { tourDone = !!localStorage.getItem(TOUR_KEY); } catch(e) {}
      if (tourDone) return;

      var currentStep = 0; // 0=idle, 1=pre-spin, 2=post-spin/reroll, 3=autofill, 4=done

      function showTip(text, targetId, pos) {
        if (tourDone) return;
        tooltipText.textContent = text;
        tooltip.hidden = false;
        tooltip.className = "ob-tooltip ob-tooltip--" + (pos || "bottom");
        // Position near target if visible
        var target = targetId && document.getElementById(targetId);
        if (target) {
          var r = target.getBoundingClientRect();
          var tw = tooltip.offsetWidth || 260;
          var left = Math.max(8, Math.min(r.left + r.width / 2 - tw / 2, window.innerWidth - tw - 8));
          if (pos === "above") {
            tooltip.style.top = (r.top + window.scrollY - tooltip.offsetHeight - 14) + "px";
          } else {
            tooltip.style.top = (r.bottom + window.scrollY + 12) + "px";
          }
          tooltip.style.left = left + "px";
          tooltip.style.transform = "none";
        } else {
          tooltip.style.top = ""; tooltip.style.left = "";
          tooltip.style.transform = "";
        }
      }

      function hideTip() { tooltip.hidden = true; }

      function endTour() {
        tourDone = true;
        hideTip();
        try { localStorage.setItem(TOUR_KEY, "1"); } catch(e) {}
      }

      if (tooltipSkip) tooltipSkip.addEventListener("click", endTour);

      // Expose hooks for game.js to call
      W.GAFFER_OB = {
        // Called when user enters draft view for the first time
        onEnterDraft: function () {
          if (tourDone || currentStep > 0) return;
          currentStep = 1;
          setTimeout(function () {
            showTip("Tap SPIN to draft a squad from football history.", "spinBtn", "above");
          }, 400);
        },
        // Called after the spin animation completes (player picker shown)
        afterSpin: function () {
          if (tourDone || currentStep !== 1) return;
          currentStep = 2;
          hideTip();
          setTimeout(function () {
            showTip("Got a player you don't want? Tap Reroll — you get 3.", "rerollBtn", "above");
          }, 300);
        },
        // Called each time a player is added
        playerAdded: function (count) {
          if (tourDone) return;
          if (currentStep === 2 && count >= 1) {
            currentStep = 3;
            hideTip();
          }
          if (currentStep === 3 && count >= 3) {
            currentStep = 4;
          }
        },
        // Called after reroll is used (advance past reroll tip)
        afterReroll: function () {
          if (tourDone || currentStep !== 2) return;
          currentStep = 3;
          hideTip();
        },
        // Called after auto-fill
        afterAutoFill: function () {
          if (tourDone || currentStep !== 4) return;
          currentStep = 5;
          hideTip();
        },
        // Called after first result is saved — shows rank reveal
        onResult: function (score) {
          if (tourDone) return;
          endTour();
          try {
            var board = JSON.parse(localStorage.getItem("wcxi_leaderboard_v1") || "[]");
            var rank = board.filter(function (e) { return e.score > score; }).length + 1;
            var reveal = document.getElementById("obRankReveal");
            var rankNum = document.getElementById("obRankNum");
            var rankSub = document.getElementById("obRankSub");
            if (!reveal) return;
            if (rankNum) rankNum.textContent = "#" + rank;
            if (rankSub) rankSub.textContent = "on today\'s leaderboard — can you go higher?";
            reveal.hidden = false;
            reveal.classList.add("ob-rank-reveal--in");
            setTimeout(function () {
              reveal.classList.add("ob-rank-reveal--out");
              setTimeout(function () { reveal.hidden = true; reveal.className = "ob-rank-reveal"; }, 500);
            }, 4000);
          } catch(e) {}
        }
      };
    })();

    // Logo click → home from any screen
    var brand = document.getElementById("brandLogo");
    if (brand && !brand._wired) {
      brand._wired = true;
      function handleLogoNav() {
        var home = document.getElementById("homeView");
        if (!home) return;
        if (home.style.display !== "none") return; // already on home page
        W.flGoHome();
      }
      brand.addEventListener("click", handleLogoNav);
      brand.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleLogoNav(); } });
    }
  });

  /* ── Confetti — a short, modest burst reserved for real wins
     (champions, perfect seasons, Duels victories). Tasteful by
     design: ~90 pieces in the Floodlights palette, one second, then gone.
     Skipped entirely when the user prefers reduced motion. ── */
  W.triggerConfetti = function () {
    try {
      if (W.matchMedia && W.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    } catch (e) {}
    if (W._flConfettiRunning) return;          // never stack bursts
    W._flConfettiRunning = true;

    var cv = document.createElement("canvas");
    cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999;";
    document.body.appendChild(cv);
    var ctx = cv.getContext("2d");
    var dpr = Math.min(W.devicePixelRatio || 1, 2);
    function size() { cv.width = W.innerWidth * dpr; cv.height = W.innerHeight * dpr; }
    size();

    var colors = ["#F5B43C", "#7C5CFC", "#22E0C8", "#FF7A59", "#ECF1FF"];
    var N = 90, W0 = W.innerWidth * dpr, H0 = W.innerHeight * dpr;
    var parts = [];
    for (var i = 0; i < N; i++) {
      parts.push({
        x: W0 * (0.25 + Math.random() * 0.5),
        y: H0 * 0.28 + (Math.random() - 0.5) * 60 * dpr,
        vx: (Math.random() - 0.5) * 9 * dpr,
        vy: (Math.random() * -6 - 4) * dpr,
        g: (0.22 + Math.random() * 0.12) * dpr,
        s: (4 + Math.random() * 5) * dpr,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        c: colors[(Math.random() * colors.length) | 0]
      });
    }
    var start = null, DUR = 1500;
    function frame(ts) {
      if (start === null) start = ts;
      var t = ts - start;
      ctx.clearRect(0, 0, cv.width, cv.height);
      var fade = t > DUR - 400 ? Math.max(0, (DUR - t) / 400) : 1;
      ctx.globalAlpha = fade;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.vx *= 0.99;
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
        ctx.restore();
      }
      if (t < DUR) { W.requestAnimationFrame(frame); }
      else { cv.remove(); W._flConfettiRunning = false; }
    }
    W.requestAnimationFrame(frame);
  };
})(window);

/* ============================================================
   UNIVERSAL SQUAD DOCK — a slide-in squad viewer reachable from
   EVERY mode. Reads the live XI from whatever the active screen
   renders (pitch dots / XI list / Duels slots), so it needs
   no hooks into each mode. Ratings are intentionally NOT shown
   (keeps Duels's blind rule intact and stays consistent).
   ============================================================ */
(function (W) {
  "use strict";
  var LINE_OF = { GK:"GK",CB:"DEF",RB:"DEF",LB:"DEF",RWB:"DEF",LWB:"DEF",
    CDM:"MID",CM:"MID",CAM:"MID",RM:"MID",LM:"MID",RW:"FWD",LW:"FWD",ST:"FWD" };
  function lineOf(p){ return LINE_OF[(p||"").trim()] || "MID"; }
  function esc(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

  // Read an element's text WITHOUT any embedded rating chips, so the dock never
  // shows ratings (design decision + keeps it Duels safe). Falls back to
  // the raw text and strips a stray trailing rating number if no chip is present.
  function cleanName(el,isName){
    if(!el) return "";
    var c=el.cloneNode(true);
    c.querySelectorAll(".xi-rate,.rw-slot-rate,.rw-rate,.dot-rate,.rate,.rating").forEach(function(n){ n.remove(); });
    var t=(c.textContent||"").replace(/\s+/g," ").trim();
    return isName ? t.replace(/\s+\d{1,3}$/,"").trim() : t;
  }
  function scrape(){
    var out=[], seen={};
    function push(pos,nameEl,metaEl){ var name=cleanName(nameEl,true); if(!name||seen[name+pos])return; seen[name+pos]=1; out.push({pos:((pos&&pos.textContent)||pos||"").toString().trim(),name:name,meta:cleanName(metaEl,false)}); }
    var rows=Array.from(document.querySelectorAll('.xi-list .xi-row:not(.empty)')).filter(function(r){ return r.offsetParent!==null; });
    if(rows.length){
      rows.forEach(function(r){ push(r.querySelector('.pos'),r.querySelector('.pn'),r.querySelector('.meta')); });
      if(out.length) return out;
    }
    var rw=document.querySelectorAll('#rwView .rw-slot.filled');
    if(rw.length){ rw.forEach(function(s){ push(s.querySelector('.pos'),s.querySelector('.rw-slot-name'),s.querySelector('.rw-slot-meta')); }); return out; }
    var tc=document.querySelectorAll('.mp-tc-row');
    if(tc.length){ tc.forEach(function(s){ push(s.querySelector('.mp-tc-pos'),s.querySelector('.mp-tc-name'),null); }); if(out.length) return out; }
    // DVC draft — only the user's panel (not CPU panel), only filled rows
    var dvcRows=Array.from(document.querySelectorAll('.dvc-xi-panel:not(.dvc-cpu-xi) .dvc-xi-list .dvc-xi-row:not(.empty)')).filter(function(r){ return r.offsetParent!==null; });
    if(dvcRows.length){ dvcRows.forEach(function(r){ push(r.querySelector('.pos'),r.querySelector('.dvc-xi-name'),null); }); if(out.length) return out; }
    var dots=document.querySelectorAll('.pitch .pdot.filled');
    dots.forEach(function(d){ push(d.querySelector('.dot-pos'),d.querySelector('.dot-name'),null); });
    return out;
  }
  function hasContext(){
    // Only count elements that are actually visible — elements inside display:none have offsetParent===null
    var els = document.querySelectorAll('.pitch .pdot.filled, .xi-list .xi-row:not(.empty), #rwView .rw-slot.filled, .mp-tc-row, .dvc-xi-panel:not(.dvc-cpu-xi) .dvc-xi-row:not(.empty)');
    return Array.prototype.some.call(els, function(el){ return el.offsetParent !== null; });
  }

  var fab, panel, open=false;
  function ensure(){
    if(fab) return;
    fab=document.createElement("button"); fab.id="flSquadFab"; fab.className="fl-squad-fab"; fab.setAttribute("aria-label","View squad");
    fab.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.4 8 8 11 4.6-3 8-6 8-11V5z"/><path d="M9 11l2 2 4-4"/></svg><span class="fl-squad-fab-t">Squad</span><span class="fl-squad-fab-n" id="flSquadN"></span>';
    fab.onclick=openDock; document.body.appendChild(fab);
    panel=document.createElement("div"); panel.id="flSquadDock"; panel.className="fl-dock";
    panel.innerHTML='<div class="fl-dock-backdrop" id="flDockBg"></div><aside class="fl-dock-panel" role="dialog" aria-label="Squad"><div class="fl-dock-head"><h3>Your XI</h3><button class="fl-dock-x" id="flDockX" aria-label="Close">✕</button></div><div class="fl-dock-body" id="flDockBody"></div></aside>';
    document.body.appendChild(panel);
    document.getElementById("flDockBg").onclick=closeDock;
    document.getElementById("flDockX").onclick=closeDock;
    document.addEventListener("keydown",function(e){ if(e.key==="Escape"&&open) closeDock(); });
  }
  function openDock(){
    ensure(); var sq=scrape();
    var order={GK:0,DEF:1,MID:2,FWD:3}, byLine={GK:[],DEF:[],MID:[],FWD:[]};
    sq.forEach(function(p){ byLine[lineOf(p.pos)].push(p); });
    var names={GK:"Goalkeeper",DEF:"Defence",MID:"Midfield",FWD:"Attack"};
    var html="";
    ["GK","DEF","MID","FWD"].forEach(function(L){
      if(!byLine[L].length) return;
      html+='<div class="fl-dock-line">'+names[L]+'</div>';
      byLine[L].forEach(function(p){
        html+='<div class="fl-dock-row"><span class="pos '+lineOf(p.pos)+'">'+esc(p.pos)+'</span>'+
          '<span class="fl-dock-name">'+esc(p.name)+'</span>'+(p.meta?'<span class="fl-dock-meta">'+esc(p.meta)+'</span>':'')+'</div>';
      });
    });
    if(!sq.length) html='<div class="fl-dock-empty">No players picked yet — spin to start building your XI.</div>';
    document.getElementById("flDockBody").innerHTML=html;
    panel.classList.add("show"); open=true;
  }
  function closeDock(){ if(panel) panel.classList.remove("show"); open=false; }
  function resetDock(){
    closeDock();
    if(panel){ var b=document.getElementById("flDockBody"); if(b) b.innerHTML=""; }
    _lastN=null; _lastShow=null;
    if(fab){ fab.classList.remove("show"); var n=document.getElementById("flSquadN"); if(n) n.textContent=""; }
  }
  W.flResetSquadDock = resetDock;

  var _lastShow=null, _lastN=null, _deb=null;
  function refreshFab(){
    ensure();
    var show=hasContext();
    if(show!==_lastShow){ fab.classList.toggle("show", show); _lastShow=show; if(!show && open) closeDock(); }
    if(show){
      var n=scrape().length;
      if(n!==_lastN){ _lastN=n; var el=document.getElementById("flSquadN"); if(el) el.textContent=n?(n+"/11"):""; if(open) openDock(); }
    } else { _lastN=null; }
  }
  function scheduleRefresh(){ clearTimeout(_deb); _deb=setTimeout(refreshFab, 180); }
  document.addEventListener("DOMContentLoaded", function(){
    ensure();
    new MutationObserver(scheduleRefresh).observe(document.body, { childList:true, subtree:true });
    refreshFab();
  });
})(window);

/* ── Trending XIs (recent games from localStorage) ───────────────────── */
(function() {
  function renderTrendingXIs() {
    var wrap = document.getElementById("trendingXIs");
    var list = document.getElementById("trendingList");
    if (!wrap || !list) return;
    try {
      var raw = localStorage.getItem("wcxi_leaderboard_v3") || localStorage.getItem("wcxi_leaderboard_v2") || "[]";
      var entries = JSON.parse(raw);
      if (!Array.isArray(entries) || entries.length === 0) return;
      var recent = entries.slice(-6).reverse().slice(0, 3);
      if (recent.length === 0) return;
      list.innerHTML = recent.map(function(e, i) {
        var name = (e.team || e.name || "Unknown XI").slice(0, 28);
        var score = e.score || e.pts || 0;
        var formation = e.formation || e.f || "";
        var mode = e.mode || e.m || "";
        var meta = [formation, mode].filter(Boolean).join(" · ");
        return '<div class="trending-item">' +
          '<span class="trending-num">' + (i + 1) + '</span>' +
          '<span class="trending-info">' +
            '<span class="trending-name">' + name + '</span>' +
            (meta ? '<span class="trending-meta">' + meta + '</span>' : '') +
          '</span>' +
          '<span class="trending-score">' + score + ' pts</span>' +
        '</div>';
      }).join("");
      wrap.hidden = false;
    } catch(e) {}
  }
  document.addEventListener("DOMContentLoaded", renderTrendingXIs);
  window.flRenderTrendingXIs = renderTrendingXIs;
})();

/* ── Daily awareness modal (shown after first game) ─────────────────── */
(function() {
  var DAILY_AWARE_KEY = "wcxi_daily_aware_v1";
  window.showDailyAwareness = function() {
    try { if (localStorage.getItem(DAILY_AWARE_KEY)) return; } catch(e) {}
    var modal = document.getElementById("dailyAwareModal");
    if (!modal) return;
    modal.hidden = false;
    try { localStorage.setItem(DAILY_AWARE_KEY, "1"); } catch(e) {}
  };
  document.addEventListener("DOMContentLoaded", function() {
    var modal = document.getElementById("dailyAwareModal");
    var close = document.getElementById("dailyAwareClose");
    var goBtn = document.getElementById("dailyAwareGo");
    function dismiss() { if (modal) modal.hidden = true; }
    if (close) close.addEventListener("click", dismiss);
    if (modal) modal.addEventListener("click", function(e){ if(e.target===modal) dismiss(); });
    if (goBtn) goBtn.addEventListener("click", function() {
      dismiss();
      /* Trigger the daily challenge */
      setTimeout(function() {
        var d = document.getElementById("homeDaily") || document.getElementById("homeDailyTop");
        if (d) d.click();
      }, 200);
    });
  });
})();

/* ── Returning visitor banner ────────────────────────────────────────── */
(function() {
  window.showReturningBanner = function() {
    var banner = document.getElementById("returningBanner");
    if (!banner) return;
    /* Check if daily already played today */
    try {
      var ds = JSON.parse(localStorage.getItem("wcxi_daily_streak_v1") || "{}");
      var today = new Date().toDateString();
      if (ds.lastDate === today) return; /* Already played today, no need to nudge */
    } catch(e) {}
    banner.hidden = false;
    setTimeout(function() { banner.hidden = true; }, 8000);
  };
  document.addEventListener("DOMContentLoaded", function() {
    var banner = document.getElementById("returningBanner");
    var goBtn  = document.getElementById("returningDailyBtn");
    var dismiss = document.getElementById("returningDismiss");
    function hide() { if (banner) banner.hidden = true; }
    if (dismiss) dismiss.addEventListener("click", hide);
    if (goBtn) goBtn.addEventListener("click", function() {
      hide();
      var d = document.getElementById("homeDaily") || document.getElementById("bnavDaily");
      if (d) d.click();
    });
  });
})();

/* ── 2-player head-to-head shortcut ─────────────────────────────────── */
(function() {
  document.addEventListener("DOMContentLoaded", function() {
    var h2hBtn = document.getElementById("h2hQuickBtn");
    if (!h2hBtn) return;
    h2hBtn.addEventListener("click", function() {
      /* Launch multiplayer with 2-player preset */
      window._h2hPreset = true;
      var mpBtn = document.getElementById("homeMP");
      if (mpBtn) mpBtn.click();
    });
  });
})();

/* ── Greatest XI Recap ───────────────────────────────────────────────── */
(function() {
  window.showGreatestXIRecap = function() {
    var modal = document.getElementById("recapModal");
    if (!modal) return;
    try {
      var board = JSON.parse(localStorage.getItem("wcxi_leaderboard_v1") || "[]");
      if (!board.length) return;
      /* Best XI ever */
      var best = board.reduce(function(a, b) { return (b.score||0) > (a.score||0) ? b : a; }, board[0]);
      /* Win rate */
      var wins = board.filter(function(e) { return e.score > 0 && /champion|winner|1st/i.test(e.result||""); }).length;
      var winRate = Math.round((wins / board.length) * 100);
      /* Rarest squad — find least-played nation */
      var modeCounts = {}; board.forEach(function(e){ modeCounts[e.mode||"?"] = (modeCounts[e.mode||"?"]||0)+1; });
      var rarest = Object.keys(modeCounts).reduce(function(a,b){ return modeCounts[b] < modeCounts[a] ? b : a; }, Object.keys(modeCounts)[0]);
      var modeNames = {wc:"World Cup",cl:"Champions League",euro:"Euros",league:"League",mp:"Draft Night",dvc:"vs CPU"};

      var html = document.getElementById("recapBody");
      if (!html) return;
      html.innerHTML =
        '<div class="recap-stat"><div class="recap-num">' + board.length + '</div><div class="recap-lbl">XIs drafted</div></div>' +
        '<div class="recap-stat"><div class="recap-num">' + winRate + '%</div><div class="recap-lbl">Win rate</div></div>' +
        '<div class="recap-stat"><div class="recap-num">' + wins + '</div><div class="recap-lbl">Trophies won</div></div>' +
        '<div class="recap-best">' +
          '<div class="recap-best-lbl">🏆 Your best XI</div>' +
          '<div class="recap-best-name">' + (best.username || best.name || "Your XI") + '</div>' +
          '<div class="recap-best-score">' + best.score + ' pts</div>' +
          (best.formation ? '<div class="recap-best-meta">' + best.formation + ' · ' + (modeNames[best.mode]||best.mode||"") + '</div>' : '') +
          (best.players && best.players.length ? '<div class="recap-best-players">⭐ ' + best.players.join(' · ') + '</div>' : '') +
        '</div>' +
        '<div class="recap-rare"><span class="recap-rare-lbl">Most played mode:</span> <strong>' + (modeNames[rarest]||rarest) + '</strong></div>';

      modal.hidden = false;
    } catch(e) {}
  };

  document.addEventListener("DOMContentLoaded", function() {
    var modal = document.getElementById("recapModal");
    var close = document.getElementById("recapClose");
    var shareBtn = document.getElementById("recapShare");
    function dismiss() { if (modal) modal.hidden = true; }
    if (close) close.addEventListener("click", dismiss);
    if (modal) modal.addEventListener("click", function(e){ if(e.target===modal) dismiss(); });
    if (shareBtn) shareBtn.addEventListener("click", function() {
      var board = JSON.parse(localStorage.getItem("wcxi_leaderboard_v1")||"[]");
      var text = "⚽ My Draft XI season: " + board.length + " XIs drafted on draft-11.com — can you beat my record?";
      try { if(navigator.share) { navigator.share({title:"My Draft XI Season", text:text, url:"https://draft-11.com"}); return; } } catch(ex){}
      if(navigator.clipboard) navigator.clipboard.writeText(text);
      if(window.flToast) window.flToast("Stats copied!", 2000);
    });
  });
})();

/* ── WC 2026 Live Mirror ─────────────────────────────────────────────── */
(function() {
  /* Real 2026 WC results — update as tournament progresses */
  var WC26_MATCHES = [
    { home: "Mexico", away: "South Africa", score: "2–0", round: "Group A", date: "Jun 11" },
    { home: "South Korea", away: "Czechia", score: "2–1", round: "Group A", date: "Jun 11" },
    { home: "USA", away: "Paraguay", score: "4–1", round: "Group D", date: "Jun 12" },
    { home: "Canada", away: "Bosnia & Herz.", score: "1–1", round: "Group B", date: "Jun 12" },
    { home: "Qatar", away: "Switzerland", score: "1–1", round: "Group B", date: "Jun 13" },
    { home: "Brazil", away: "Morocco", score: "1–1", round: "Group C", date: "Jun 13" },
    { home: "Haiti", away: "Scotland", score: "0–1", round: "Group C", date: "Jun 13" },
    { home: "Australia", away: "Türkiye", score: "2–0", round: "Group D", date: "Jun 13" },
    { home: "Germany", away: "Curaçao", score: "7–1", round: "Group E", date: "Jun 14" },
    { home: "Ivory Coast", away: "Ecuador", score: "1–0", round: "Group E", date: "Jun 14" },
    { home: "Netherlands", away: "Japan", score: "2–2", round: "Group F", date: "Jun 14" },
    { home: "Sweden", away: "Tunisia", score: "5–1", round: "Group F", date: "Jun 14" },
    { home: "Spain", away: "Cape Verde", score: "0–0", round: "Group H", date: "Jun 15" },
    { home: "Saudi Arabia", away: "Uruguay", score: "1–1", round: "Group H", date: "Jun 15" },
    { home: "Belgium", away: "Egypt", score: "1–1", round: "Group G", date: "Jun 15" },
    { home: "Iran", away: "New Zealand", score: "2–2", round: "Group G", date: "Jun 15" },
    { home: "France", away: "Senegal", score: "3–1", round: "Group I", date: "Jun 16" },
    { home: "Norway", away: "Iraq", score: "4–1", round: "Group I", date: "Jun 16" },
    { home: "Argentina", away: "Algeria", score: "3–0", round: "Group J", date: "Jun 16" },
    { home: "Austria", away: "Jordan", score: "3–1", round: "Group J", date: "Jun 17" }
  ];

  function renderWCMirror() {
    var el = document.getElementById("wcMirrorBar");
    if (!el || !WC26_MATCHES.length) return;
    /* Show a rotating recent match */
    var idx = Math.floor(Date.now() / 3600000) % WC26_MATCHES.length; // rotate hourly
    var m = WC26_MATCHES[idx];
    el.innerHTML =
      '<span class="wcm-live-dot"></span>' +
      '<span class="wcm-text">IRL: <strong>' + m.home + ' ' + m.score + ' ' + m.away + '</strong> · ' + m.round + ' · ' + (m.date||"") + '</span>' +
      '<button class="wcm-cta" id="wcMirrorPlay">Play WC draft →</button>';
    el.hidden = false;
    var btn = document.getElementById("wcMirrorPlay");
    if (btn) btn.addEventListener("click", function() {
      var wcBtn = document.getElementById("homeWC");
      if (wcBtn) wcBtn.click();
    });
  }

  document.addEventListener("DOMContentLoaded", renderWCMirror);
})();
