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

  /* Universal "go home" — hides every known view, shows homeView.
     Each module's own goHome handles cleanup; this covers the logo tap
     from any screen without needing per-module hooks. */
  W.flGoHome = function () {
    var ALL = ["setupView","draftView","resultsView","mpView","leagueView","boardView","rwView","dvcView","euroView"];
    ALL.forEach(function (id) { var el = document.getElementById(id); if (el) el.style.display = "none"; });
    var home = document.getElementById("homeView");
    if (home) home.style.display = "";
    if (W.scrollTo) W.scrollTo(0, 0);
    // Let online transport close cleanly if it was active
    try { if (W.ElxiNet && W.ElxiNet.isOnline && W.ElxiNet.isOnline()) W.ElxiNet.close(); } catch (e) {}
  };

  document.addEventListener("DOMContentLoaded", function () {
    // Share game link button
    var shareBtn = document.getElementById("homeShare");
    if (shareBtn) {
      shareBtn.addEventListener("click", function () {
        var url = "https://ismaeelazhar-cmd.github.io/eleven-xi/";
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(function () {
            W.flToast("Link copied — send it to a friend!");
          }, function () { window.prompt("Copy the link:", url); });
        } else { window.prompt("Copy the link:", url); }
      });
    }

    // Draft vs Computer home card button
    var dvcBtn = document.getElementById("homeDVC");
    if (dvcBtn) {
      dvcBtn.addEventListener("click", function () {
        if (typeof window.startDraftVsComputer === "function") window.startDraftVsComputer();
      });
    }

    /* Euro home card — wired in game.js alongside homeWC/homeCL via setMode("euro") */

    // Home card stats — populate best scores and DVC record from localStorage
    (function updateHomeCards() {
      try {
        var board = JSON.parse(localStorage.getItem("wcxi_leaderboard_v1") || "[]");
        var bestByMode = {};
        board.forEach(function (e) {
          if (!bestByMode[e.mode] || e.score > bestByMode[e.mode].score) bestByMode[e.mode] = e;
        });
        var hasAny = board.length > 0;

        // Hide "Start here" badge once user has played any mode
        var newBadge = document.getElementById("wcNewBadge");
        if (newBadge) newBadge.style.display = hasAny ? "none" : "";

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
      } catch (e) {}
    })();

    // How To Play overlay
    (function () {
      var HTP_KEY = "wcxi_seen_howto";
      var overlay = document.getElementById("howToPlay");
      var slides, dots, prevBtn, nextBtn, closeBtn;
      var step = 0;

      function openHTP() {
        if (!overlay) return;
        step = 0;
        slides = overlay.querySelectorAll(".htp-slide");
        dots   = overlay.querySelectorAll(".htp-dot");
        prevBtn = document.getElementById("htpPrev");
        nextBtn = document.getElementById("htpNext");
        closeBtn = document.getElementById("htpClose");
        syncSlide();
        overlay.hidden = false;
        if (nextBtn) nextBtn.focus();
      }

      function closeHTP() {
        if (overlay) overlay.hidden = true;
        try { localStorage.setItem(HTP_KEY, "1"); } catch (e) {}
      }

      function syncSlide() {
        slides.forEach(function (s, i) { s.classList.toggle("active", i === step); });
        dots.forEach(function (d, i) { d.classList.toggle("active", i === step); });
        if (prevBtn) prevBtn.hidden = (step === 0);
        var last = step === slides.length - 1;
        if (nextBtn) { nextBtn.textContent = last ? "Got it ✔" : "Next →"; }
      }

      if (overlay) {
        overlay.addEventListener("click", function (e) { if (e.target === overlay) closeHTP(); });
        document.addEventListener("keydown", function (e) {
          if (overlay.hidden) return;
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

      // Auto-show for new users (no prior visits, no leaderboard entries)
      try {
        var seen = localStorage.getItem(HTP_KEY);
        var hasScores = (JSON.parse(localStorage.getItem("wcxi_leaderboard_v1") || "[]")).length > 0;
        if (!seen && !hasScores) setTimeout(openHTP, 600);
      } catch (e) {}

      W.openHowToPlay = openHTP;
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
  function esc(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

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
    var dots=document.querySelectorAll('.pitch .pdot.filled');
    dots.forEach(function(d){ push(d.querySelector('.dot-pos'),d.querySelector('.dot-name'),null); });
    return out;
  }
  function hasContext(){ return !!document.querySelector('.pitch .pdot.filled, .xi-list .xi-row:not(.empty), #rwView .rw-slot.filled, .mp-tc-row'); }

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
