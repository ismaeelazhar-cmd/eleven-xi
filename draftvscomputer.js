/* draftvscomputer.js — Draft vs Computer mode
 * Player and CPU alternate picks using the spin wheel mechanic.
 * Each turn: spin → reveal a squad → pick one player.
 * CPU spins automatically and picks via scoring algorithm. */
window.startDraftVsComputer = (function (W) {
  "use strict";

  var LINE_OF = {
    GK:"GK",
    CB:"DEF", RB:"DEF", LB:"DEF", RWB:"DEF", LWB:"DEF", DEF:"DEF",
    CDM:"MID", CM:"MID", CAM:"MID", RM:"MID", LM:"MID", MID:"MID",
    RW:"FWD", LW:"FWD", ST:"FWD", CF:"FWD", FWD:"FWD"
  };

  /* Lateral order for left-to-right pitch display */
  var LATERAL_ORDER = { LB:0,LWB:0,LM:0,LW:0, CB:1,CDM:1,CM:1,CAM:1,ST:1,CF:1, RB:2,RWB:2,RM:2,RW:2 };
  function lateralSort(a,b){ return (LATERAL_ORDER[a.slot]||1)-(LATERAL_ORDER[b.slot]||1); }

  /* Position group order for squad picker */
  var POS_ORDER = {GK:0,CB:1,RB:1,LB:1,RWB:1,LWB:1,DEF:1,CDM:2,CM:2,RM:2,LM:2,CAM:2,MID:2,RW:3,LW:3,ST:3,CF:3,FWD:3};

  var DVC_FORMATIONS = {
    "4-3-3":   { slots:["GK","RB","CB","CB","LB","CM","CDM","CM","RW","ST","LW"] },
    "4-4-2":   { slots:["GK","RB","CB","CB","LB","RM","CM","CM","LM","ST","ST"] },
    "4-2-3-1": { slots:["GK","RB","CB","CB","LB","CDM","CDM","CAM","RM","LM","ST"] },
    "3-5-2":   { slots:["GK","CB","CB","CB","RM","CM","CDM","CM","LM","ST","ST"] }
  };

  var CPU_NAMES = {
    balanced: ["The Algorithm", "CPU Manager", "Iron Bot", "AutoXI", "The Machine"],
    scorer:   ["The Poacher", "Goal Machine", "Strike Force", "Boot Camp", "The Finisher"],
    defender: ["The Sweeper", "Ironclad", "The Wall", "Catenaccio", "Fort Knox"]
  };

  var DVC_RECORD_KEY = "wcxi_dvc_record";

  function esc(s) { return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function rnd(a) { return a[Math.floor(Math.random()*a.length)]; }
  function shuffle(a) {
    for (var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i];a[i]=a[j];a[j]=t; }
    return a;
  }

  function loadDvcRecord() {
    try {
      var r = JSON.parse(localStorage.getItem(DVC_RECORD_KEY) || "{}");
      return {
        easy:   { w: r.easy   && r.easy.w   || 0, l: r.easy   && r.easy.l   || 0, d: r.easy   && r.easy.d   || 0 },
        medium: { w: r.medium && r.medium.w || 0, l: r.medium && r.medium.l || 0, d: r.medium && r.medium.d || 0 },
        hard:   { w: r.hard   && r.hard.w   || 0, l: r.hard   && r.hard.l   || 0, d: r.hard   && r.hard.d   || 0 }
      };
    } catch(e) {
      return { easy:{w:0,l:0,d:0}, medium:{w:0,l:0,d:0}, hard:{w:0,l:0,d:0} };
    }
  }

  function saveDvcRecord(rec) {
    try { localStorage.setItem(DVC_RECORD_KEY, JSON.stringify(rec)); } catch(e) {}
  }

  function renderRecordHtml(diff) {
    var rec = loadDvcRecord();
    var r = rec[diff] || {w:0,l:0,d:0};
    var total = r.w + r.l + r.d;
    var label = diff.charAt(0).toUpperCase() + diff.slice(1);
    if (!total) return '<span class="dvc-rec-label">'+esc(label)+' record:</span> <span class="dvc-rec-none">No games yet</span>';
    var winPct = Math.round(r.w / total * 100);
    return '<span class="dvc-rec-label">'+esc(label)+' record:</span> <span class="dvc-rec-val">'+r.w+'W&thinsp;'+r.l+'L&thinsp;'+r.d+'D</span><span class="dvc-rec-pct">'+winPct+'%</span>';
  }

  /* State */
  var DVC = { formation:"4-3-3", difficulty:"medium", personality:"balanced", maxRerolls:3, rerollsLeft:3 };

  function lineOf(pos){ return LINE_OF[(pos||"").trim()] || "MID"; }

  function ratingTierClass(r){
    if(!r) return "";
    return r>=90?" r-gold":r>=85?" r-elite":r>=80?" r-great":r>=75?" r-good":r>=70?" r-amber":r>=60?" r-orange":" r-red";
  }

  /* ---- Team pool: all team-years from WC, CL, Euro data ---- */
  function buildTeamPool() {
    var entries = [];
    var seen = {};
    var sources = [W.WORLD_CUP_DATA, W.CL_DATA, W.EURO_DATA];
    sources.forEach(function(d) {
      if (!d) return;
      Object.keys(d).forEach(function(team) {
        var ys = (d[team] && d[team].years) ? d[team].years : {};
        Object.keys(ys).forEach(function(y) {
          var key = team + "|" + y;
          if (seen[key]) return;
          seen[key] = true;
          var squad = (ys[y] || []).filter(function(p){ return p.n && (p.r||0) >= 68; });
          if (squad.length < 5) return;
          entries.push({ team: team, year: y, squad: squad, flag: (d[team] && d[team].flag) || "" });
        });
      });
    });
    return entries;
  }

  /* ---- Spin reel (same mechanic as game.js / multiplayer.js) ---- */
  function dvcSpinReel(stripEl, randomItem, finalHTML, duration) {
    var reelEl = stripEl.parentElement;
    return new Promise(function(resolve) {
      var BLUR = 12, html = "";
      for (var i = 0; i < BLUR; i++) html += randomItem();
      html += finalHTML;
      stripEl.style.transition = "none";
      stripEl.style.transform = "translateY(0)";
      stripEl.innerHTML = html;
      void stripEl.offsetHeight;
      var itemH = (stripEl.firstElementChild && stripEl.firstElementChild.offsetHeight) || 56;
      stripEl.style.transition = "transform " + duration + "ms cubic-bezier(0.12,0.05,0.05,1)";
      stripEl.style.transform = "translateY(" + (-(BLUR * itemH)) + "px)";
      var done = false;
      function finish(e) {
        if (e && e.propertyName && e.propertyName !== "transform") return;
        if (done) return; done = true;
        stripEl.style.transition = "none";
        stripEl.style.transform = "translateY(0)";
        stripEl.innerHTML = finalHTML;
        if (reelEl) {
          reelEl.classList.add("reel--settled");
          setTimeout(function() { reelEl.classList.remove("reel--settled"); }, 950);
        }
        resolve();
      }
      stripEl.addEventListener("transitionend", finish, { once: true });
      setTimeout(function() { finish(null); }, duration + 120);
    });
  }

  function teamItemHTML(team) {
    return '<div class="reel-item"><span class="name">' + esc(team) + '</span></div>';
  }
  function yearItemHTML(y) {
    return '<div class="reel-item"><span class="year">' + y + '</span></div>';
  }
  function comboItemHTML(entry) {
    var stars = "";
    var avg = entry.squad.reduce(function(s,p){ return s+(p.r||75); }, 0) / Math.max(1, entry.squad.length);
    var starCount = avg >= 88 ? 5 : avg >= 83 ? 4 : avg >= 78 ? 3 : avg >= 73 ? 2 : 1;
    for (var i=0; i<starCount; i++) stars += "★";
    return '<div class="reel-item dvc-combo-item">' +
      '<span class="dvc-item-flag">' + esc(entry.flag || "🏳") + '</span>' +
      '<span class="dvc-item-team">' + esc(entry.team) + '</span>' +
      '<span class="dvc-item-year">' + esc(entry.year) + ' <span class="dvc-stars">' + stars + '</span></span>' +
      '</div>';
  }
  function comboRandomHTML(pool) {
    return comboItemHTML(pool[Math.floor(Math.random()*pool.length)]);
  }

  /* ---- Position / slot helpers ---- */

  /* Count open formation slots by line for a set of picks */
  function openSlotsByLine(picks) {
    var slots = DVC_FORMATIONS[DVC.formation].slots;
    var total = {GK:0, DEF:0, MID:0, FWD:0};
    slots.forEach(function(s){ total[lineOf(s)]++; });
    var filled = {GK:0, DEF:0, MID:0, FWD:0};
    picks.forEach(function(p){ if(p) filled[p.line]++; });
    return {
      GK:  total.GK  - filled.GK,
      DEF: total.DEF - filled.DEF,
      MID: total.MID - filled.MID,
      FWD: total.FWD - filled.FWD
    };
  }

  /* For renderDraft: annotate squad players with taken/noSlot status */
  function annotateSquad(squad, playerPicks, cpuPicks) {
    var takenNames = {};
    playerPicks.forEach(function(p){ takenNames[p.n] = true; });
    cpuPicks.forEach(function(p){ if(p) takenNames[p.n] = true; });
    var open = openSlotsByLine(playerPicks);
    return squad.map(function(p) {
      var pos = p.gp || p.p || "MID";
      var l = lineOf(pos);
      var taken = !!takenNames[p.n];
      var noSlot = !taken && (open[l] || 0) <= 0;
      return { p: p, pos: pos, line: l, taken: taken, noSlot: noSlot };
    });
  }

  /* ---- CPU picking from a squad ---- */
  var PERSONALITY_BIAS = {
    scorer:   { FWD: 25, MID: 8,  DEF: -12, GK: 0 },
    defender: { FWD: -12, MID: 5, DEF: 25,  GK: 15 },
    balanced: { FWD: 0,  MID: 0,  DEF: 0,   GK: 0 }
  };

  function cpuPickFromSquad(squad) {
    var takenNames = {};
    DVC.playerPicks.forEach(function(p){ takenNames[p.n] = true; });
    DVC.cpuPicks.forEach(function(p){ if(p) takenNames[p.n] = true; });

    var open = openSlotsByLine(DVC.cpuPicks);
    var bias = PERSONALITY_BIAS[DVC.personality] || PERSONALITY_BIAS.balanced;
    var spread = DVC.difficulty === "hard" ? 6 : DVC.difficulty === "easy" ? 28 : 18;

    /* Prefer players that fill a needed slot */
    var available = squad.filter(function(p) {
      if (takenNames[p.n]) return false;
      var l = lineOf(p.gp || p.p || "MID");
      return (open[l] || 0) > 0;
    });

    /* Fallback: any untaken player — CPU will accept the positional imbalance */
    if (!available.length) {
      available = squad.filter(function(p){ return !takenNames[p.n]; });
    }
    if (!available.length) return null;

    var scored = available.map(function(p) {
      var l = lineOf(p.gp || p.p || "MID");
      var n = Math.max(0, open[l] || 0);
      var urgency = n >= 3 ? 30 : n >= 2 ? 20 : n >= 1 ? 10 : -20;
      var score = urgency + (bias[l] || 0) + (p.r || 75) + (Math.random() * spread - spread / 4);
      return { p: p, score: score };
    });
    scored.sort(function(a, b){ return b.score - a.score; });

    var topN = DVC.difficulty === "hard" ? 1 : DVC.difficulty === "easy" ? Math.min(5, scored.length) : Math.min(3, scored.length);
    var winner = scored[Math.floor(Math.random() * topN)];
    return winner ? winner.p : null;
  }

  /* ---- Team builders for engine ---- */
  function buildTeam(picks, name, isUser) {
    var players = picks.filter(Boolean);
    if (!players.length) return { name:name, rating:75, atk:75, def:75, isUser:isUser, players:[] };
    var fwd = players.filter(function(p){ return p.line==="FWD"||p.line==="MID"; });
    var def = players.filter(function(p){ return p.line==="DEF"||p.line==="GK"; });
    var avg = function(arr){ return arr.length ? arr.reduce(function(s,p){ return s+(p.r||75); },0)/arr.length : 75; };
    return {
      name: name, rating: avg(players), atk: avg(fwd), def: avg(def), isUser: isUser,
      players: players.map(function(p){ return {n:p.n,r:p.r,p:p.line}; })
    };
  }

  /* ---- Pitch diagram ---- */
  function pitchHTML(picks, formation) {
    var slots = DVC_FORMATIONS[formation].slots;
    var byLine = {GK:[],DEF:[],MID:[],FWD:[]};
    picks.filter(Boolean).forEach(function(p){ byLine[p.line].push(p); });
    var filled = [];
    slots.forEach(function(s){ var l=lineOf(s); var p=byLine[l].shift()||null; filled.push({slot:s,line:l,player:p}); });
    var lineMap = {GK:[],DEF:[],MID:[],FWD:[]};
    filled.forEach(function(f){ lineMap[f.line].push(f); });
    /* Sort each row left-to-right */
    Object.keys(lineMap).forEach(function(k){ lineMap[k].sort(lateralSort); });
    var rows = [lineMap.FWD, lineMap.MID, lineMap.DEF, lineMap.GK];
    var html = '<div class="pitch dvc-pitch">';
    rows.forEach(function(row){
      if (!row.length) return;
      html += '<div class="pitch-row">';
      row.forEach(function(f){
        if (f.player) {
          html += '<div class="pdot filled '+f.line+'">' +
            '<span class="dot-init">'+(f.player.r||'?')+'</span>' +
            '<span class="dot-name">'+esc(f.player.n.split(" ").pop())+'</span>' +
          '</div>';
        } else {
          html += '<div class="pdot '+f.line+'"><span class="dot-pos">'+esc(f.slot)+'</span></div>';
        }
      });
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  /* ---- Main render dispatcher ---- */
  function render() {
    var el = document.getElementById("dvcView");
    if (!el) return;
    if (DVC.phase === "setup") { el.innerHTML = renderSetup(); wireSetup(); return; }
    if (DVC.phase === "draft") { el.innerHTML = renderDraft(); wireDraft(); return; }
    if (DVC.phase === "result") { el.innerHTML = renderResult(); wireResult(); return; }
  }

  /* ---- Setup screen (unchanged) ---- */
  function renderSetup() {
    var html = '<button class="back" id="dvcBack">&#8592; Home</button>';
    html += '<div class="setup"><h2 class="rw-title">Draft vs Computer</h2>';
    html += '<p class="rw-sub" style="margin-bottom:var(--sp-5)">Spin to reveal a squad, pick a player — alternate with the CPU until you each have 11. Best side wins.</p>';
    html += '<div class="setup-row setup-row-col"><span class="setup-label">Your formation</span>';
    html += '<div class="formation-options" id="dvcFormBar">';
    Object.keys(DVC_FORMATIONS).forEach(function(f){
      html += '<button class="formation-opt'+(DVC.formation===f?" active":"")+'" data-f="'+f+'">'+esc(f)+'</button>';
    });
    html += '</div></div>';
    html += '<div class="setup-row setup-row-col"><span class="setup-label">Difficulty</span>';
    html += '<div class="diff-row" id="dvcDiffBar">';
    [{id:"easy",label:"Easy"},{id:"medium",label:"Medium"},{id:"hard",label:"Hard"}].forEach(function(d){
      html += '<button class="diff-opt'+(DVC.difficulty===d.id?" active":"")+'" data-d="'+d.id+'">'+esc(d.label)+'</button>';
    });
    html += '</div>';
    html += '<div class="seg-desc" id="dvcDiffDesc">'+(DVC.difficulty==="easy"?"CPU picks with lower priority — easier to outbuild.":DVC.difficulty==="hard"?"CPU always takes the best available player — tough competition.":"CPU plays sensibly but isn\'t perfect.")+'</div>';
    html += '<div class="dvc-record" id="dvcRecord">'+renderRecordHtml(DVC.difficulty)+'</div>';
    html += '</div>';
    html += '<div class="setup-row setup-row-col"><span class="setup-label">Rerolls per spin</span>';
    html += '<div class="diff-row" id="dvcRerollBar">';
    [{id:1,label:"1 — Decisive"},{id:3,label:"3 — Balanced"},{id:5,label:"5 — Flexible"}].forEach(function(r){
      html += '<button class="diff-opt'+(DVC.maxRerolls===r.id?" active":"")+'" data-r="'+r.id+'">'+esc(r.label)+'</button>';
    });
    html += '</div></div>';
    html += '<div class="setup-row setup-row-col"><span class="setup-label">CPU Style</span>';
    html += '<div class="diff-row" id="dvcPersonBar">';
    [{id:"balanced",label:"Balanced",desc:"No obvious weakness — CPU builds a complete side."},{id:"scorer",label:"The Scorer",desc:"CPU hunts strikers — expect a high-scoring game."},{id:"defender",label:"The Defender",desc:"CPU prioritises defence — it will be a battle to break down."}].forEach(function(p){
      html += '<button class="diff-opt'+(DVC.personality===p.id?" active":"")+'" data-p="'+p.id+'" title="'+esc(p.desc)+'">'+esc(p.label)+'</button>';
    });
    html += '</div>';
    html += '<div class="seg-desc" id="dvcPersonDesc">'+(DVC.personality==="scorer"?"CPU hunts strikers — expect a high-scoring game.":DVC.personality==="defender"?"CPU prioritises defence — it will be a battle to break down.":"No obvious weakness — CPU builds a complete side.")+'</div>';
    html += '</div>';
    html += '<button class="start-btn" id="dvcStart">Start Draft &#8594;</button></div>';
    return html;
  }

  function wireSetup() {
    var back = document.getElementById("dvcBack");
    if (back) back.onclick = function(){ W.flGoHome(); };

    document.querySelectorAll("#dvcFormBar .formation-opt").forEach(function(btn){
      btn.onclick = function(){
        DVC.formation = btn.getAttribute("data-f");
        document.querySelectorAll("#dvcFormBar .formation-opt").forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
      };
    });

    document.querySelectorAll("#dvcDiffBar .diff-opt").forEach(function(btn){
      btn.onclick = function(){
        DVC.difficulty = btn.getAttribute("data-d");
        document.querySelectorAll("#dvcDiffBar .diff-opt").forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
        var desc = document.getElementById("dvcDiffDesc");
        if (desc) desc.textContent = DVC.difficulty==="easy"?"CPU picks with lower priority — easier to outbuild.":DVC.difficulty==="hard"?"CPU always takes the best available player — tough competition.":"CPU plays sensibly but isn't perfect.";
        var recEl = document.getElementById("dvcRecord");
        if (recEl) recEl.innerHTML = renderRecordHtml(DVC.difficulty);
      };
    });

    document.querySelectorAll("#dvcPersonBar .diff-opt").forEach(function(btn){
      btn.onclick = function(){
        DVC.personality = btn.getAttribute("data-p");
        document.querySelectorAll("#dvcPersonBar .diff-opt").forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
        var desc = document.getElementById("dvcPersonDesc");
        if (desc) desc.textContent = DVC.personality==="scorer"?"CPU hunts strikers — expect a high-scoring game.":DVC.personality==="defender"?"CPU prioritises defence — it will be a battle to break down.":"No obvious weakness — CPU builds a complete side.";
      };
    });

    document.querySelectorAll("#dvcRerollBar .diff-opt").forEach(function(btn){
      btn.onclick = function(){
        DVC.maxRerolls = parseInt(btn.getAttribute("data-r"), 10);
        document.querySelectorAll("#dvcRerollBar .diff-opt").forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
      };
    });

    var startBtn = document.getElementById("dvcStart");
    if (startBtn) startBtn.onclick = function(){
      DVC.teamPool = buildTeamPool();
      if (DVC.teamPool.length < 4) {
        if (W.flToast) W.flToast("Not enough data loaded — try again in a moment.");
        return;
      }
      DVC.playerPicks = [];
      DVC.cpuPicks = [];
      DVC.turn = 0;
      DVC.round = 1;
      DVC.phase = "draft";
      DVC.cpuName = rnd(CPU_NAMES[DVC.personality] || CPU_NAMES.balanced);
      DVC.lastCpuPick = null;
      DVC.spinBusy = false;
      DVC.awaitingPick = false;
      DVC.spinResult = null;
      DVC.rerollsLeft = DVC.maxRerolls;
      render();
    };
  }

  /* ---- Draft screen ---- */
  function renderXIList(picks, title, isCpu) {
    var html = '<h3 class="dvc-col-title">' + esc(title) + ' <span class="count">' + picks.length + '/11</span></h3>';
    html += '<div class="dvc-xi-list">';
    picks.forEach(function(p) {
      html += '<div class="dvc-xi-row">';
      html += '<span class="pos ' + p.line + '">' + esc(p.pos) + '</span>';
      html += '<span class="dvc-xi-name">' + esc(p.n) + '</span>';
      if (!isCpu) {
        html += '<span class="mp-r-badge' + ratingTierClass(p.r) + '">' + p.r + '</span>';
      }
      html += '</div>';
    });
    for (var i = picks.length; i < 11; i++) {
      html += '<div class="dvc-xi-row empty"><span class="pos MID">&#8212;</span><span class="dvc-xi-name dvc-empty-slot">empty</span></div>';
    }
    html += '</div>';
    return html;
  }

  function renderDraft() {
    var isPlayerTurn = DVC.turn === 0;
    var totalPicks = DVC.playerPicks.length + DVC.cpuPicks.length;
    var roundLabel = "Round " + DVC.round + " of 11";

    var html = '<button class="back" id="dvcBack">&#8592; Home</button>';
    html += '<div class="dvc-draft-wrap">';

    /* Progress bar + turn banner */
    html += '<div class="dvc-draft-header">';
    html += '<div class="dvc-draft-progress">';
    html += '<span class="dvc-round-badge" id="dvcRoundBadge">' + esc(roundLabel) + '</span>';
    html += '<div class="dvc-progress-bar"><div class="dvc-progress-fill" id="dvcProgressFill" style="width:' + Math.round(totalPicks / 22 * 100) + '%"></div></div>';
    html += '</div>';
    html += '<div class="dvc-turn-banner ' + (isPlayerTurn ? 'dvc-your-turn' : 'dvc-cpu-turn') + '" id="dvcTurnBanner">';
    html += isPlayerTurn ? 'ON THE CLOCK &mdash; Your turn &mdash; spin.' : esc(DVC.cpuName) + ' is spinning&#8230;';
    html += '</div>';
    if (DVC.lastCpuPick) {
      html += '<div class="dvc-last-cpu-pick" id="dvcLastCpu">' + esc(DVC.cpuName) + ' picked: <strong>' + esc(DVC.lastCpuPick.n) + '</strong> (' + esc(DVC.lastCpuPick.pos) + ', ' + DVC.lastCpuPick.r + ')</div>';
    } else {
      html += '<div class="dvc-last-cpu-pick" id="dvcLastCpu" style="display:none"></div>';
    }
    html += '</div>';

    /* ── Two-column layout: pitches on sides, reel in center ── */
    html += '<div class="dvc-three-col">';

    /* LEFT — CPU pitch */
    html += '<div class="dvc-pitch-col dvc-left-col">';
    html += '<div class="dvc-col-title">' + esc(DVC.cpuName) + ' <span class="count">' + DVC.cpuPicks.length + '/11</span></div>';
    html += '<div id="dvcCpuPitch">' + pitchHTML(DVC.cpuPicks, DVC.formation) + '</div>';
    html += '</div>';

    /* CENTER — reel + squad picker + buttons */
    html += '<div class="dvc-center-col">';
    /* Mini reel */
    html += '<div class="dvc-combo-reel-wrap">';
    html += '<div class="reel dvc-combo-reel" id="dvcCountryReel">';
    html += '<div class="reel-strip" id="dvcCS"><div class="reel-item dvc-combo-item"><span class="dvc-item-team">SPIN THE REEL</span><span class="dvc-item-year">to reveal a squad</span></div></div>';
    html += '</div></div>';
    /* Inline squad picker */
    html += '<div id="dvcSquadPanel" class="dvc-squad-inline" style="display:none"></div>';
    /* Action buttons row */
    html += '<div class="dvc-action-row">';
    html += '<button class="spin dvc-reel-btn" id="dvcSpinBtn"' + (isPlayerTurn ? '' : ' disabled') + '>SPIN THE REEL</button>';
    var rerollsLeft = DVC.rerollsLeft !== undefined ? DVC.rerollsLeft : (DVC.maxRerolls || 3);
    html += '<button class="dvc-reroll-btn" id="dvcRerollBtn" style="display:none"' + (rerollsLeft <= 0 ? ' disabled' : '') + '>Reroll (' + rerollsLeft + ' left)</button>';
    html += '</div>';
    html += '</div>';

    /* RIGHT — Player pitch */
    html += '<div class="dvc-pitch-col dvc-right-col">';
    html += '<div class="dvc-col-title">Your XI <span class="count">' + DVC.playerPicks.length + '/11</span></div>';
    html += '<div id="dvcPlayerPitch">' + pitchHTML(DVC.playerPicks, DVC.formation) + '</div>';
    html += '</div>';

    html += '</div>'; /* dvc-three-col */
    html += '</div>'; /* dvc-draft-wrap */
    return html;
  }

  function wireDraft() {
    var back = document.getElementById("dvcBack");
    if (back) back.onclick = function(){ W.flGoHome(); };

    var spinBtn = document.getElementById("dvcSpinBtn");
    if (spinBtn) spinBtn.addEventListener("click", doDvcSpin);

    var rerollBtn = document.getElementById("dvcRerollBtn");
    if (rerollBtn) rerollBtn.addEventListener("click", function() {
      if (DVC.rerollsLeft <= 0 || DVC.spinBusy) return;
      DVC.rerollsLeft--;
      DVC.spinResult = null;
      DVC.awaitingPick = false;
      var panel = document.getElementById("dvcSquadPanel");
      if (panel) panel.style.display = "none";
      rerollBtn.style.display = "none";
      var spinBtn2 = document.getElementById("dvcSpinBtn");
      if (spinBtn2) { spinBtn2.disabled = false; spinBtn2.style.display = ""; }
      doDvcSpin();
    });

    /* Sync button enabled state after render — belt-and-suspenders */
    updateDraftUI();
  }

  /* ---- Spin mechanics ---- */
  function doDvcSpin() {
    if (DVC.spinBusy || DVC.awaitingPick || DVC.turn !== 0) return;
    if (DVC.playerPicks.length >= 11) return;

    var pool = DVC.teamPool;
    var pick = pool[Math.floor(Math.random() * pool.length)];
    DVC.spinResult = pick;
    DVC.spinBusy = true;

    var cStrip = document.getElementById("dvcCS");
    var spinBtn = document.getElementById("dvcSpinBtn");
    if (!cStrip) { DVC.spinBusy = false; showDvcSquadPicker(); return; }

    if (spinBtn) { spinBtn.disabled = true; spinBtn.textContent = "SPINNING…"; }
    if (window.sfx) window.sfx.spin();

    var p1 = dvcSpinReel(cStrip,
      function(){ return comboRandomHTML(pool); },
      comboItemHTML(pick), 560);

    Promise.all([p1]).then(function() {
      DVC.spinBusy = false;
      DVC.awaitingPick = true;
      if (spinBtn) { spinBtn.disabled = true; spinBtn.textContent = "SPIN THE REEL"; }
      showDvcSquadPicker();
    });
  }

  function showDvcSquadPicker() {
    var panel = document.getElementById("dvcSquadPanel");
    if (!panel || !DVC.spinResult) return;

    var team = DVC.spinResult.team;
    var year = DVC.spinResult.year;
    /* Sort by position group (GK→DEF→MID→FWD) then by rating desc */
    var squad = DVC.spinResult.squad.slice().sort(function(a,b){
      var pa = POS_ORDER[a.gp||a.p||"MID"]||2, pb = POS_ORDER[b.gp||b.p||"MID"]||2;
      return pa !== pb ? pa - pb : (b.r||0)-(a.r||0);
    });
    var annotated = annotateSquad(squad, DVC.playerPicks, DVC.cpuPicks);
    var hasDraftable = annotated.some(function(item){ return !item.taken && !item.noSlot; });

    var html = '<div class="squad-card">';
    html += '<div class="squad-head"><h2>' + esc(team) + ' &middot; ' + year + '</h2>';
    html += '</div>';
    if (!hasDraftable) {
      html += '<div class="sub" style="color:var(--warning)">No pickable players in this squad &#8212; spin again for free.</div>';
    } else {
      html += '<div class="sub">Pick a player for your XI</div>';
    }
    html += '<div class="players">';
    annotated.forEach(function(item) {
      var p = item.p;
      var cls = "player" + (item.taken ? " taken" : "") + (item.noSlot && !item.taken ? " noslot" : "");
      html += '<div class="' + cls + '" data-n="' + esc(p.n) + '">';
      html += '<span class="pos ' + item.line + '">' + esc(item.pos) + '</span>';
      html += '<span class="pname">' + esc(p.n) + '</span>';
      if (item.taken) {
        html += '<span class="slot-tag">taken</span>';
      } else if (item.noSlot) {
        html += '<span class="slot-tag">no slot</span>';
      } else {
        html += '<span class="mp-r-badge' + ratingTierClass(p.r) + '">' + (p.r || '?') + '</span>';
      }
      html += '</div>';
    });
    html += '</div></div>';

    panel.innerHTML = html;
    panel.style.display = "block";

    /* Show reroll button, hide spin button */
    var rerollsLeft = DVC.rerollsLeft !== undefined ? DVC.rerollsLeft : 0;
    var rerollBtn = document.getElementById("dvcRerollBtn");
    var spinBtn = document.getElementById("dvcSpinBtn");
    if (rerollBtn) {
      rerollBtn.style.display = rerollsLeft > 0 ? "" : "none";
      rerollBtn.disabled = rerollsLeft <= 0;
      rerollBtn.textContent = "Reroll (" + rerollsLeft + " left)";
    }
    if (spinBtn) spinBtn.style.display = "none";


    /* Player pick handlers */
    panel.querySelectorAll(".player:not(.taken):not(.noslot)").forEach(function(el) {
      el.addEventListener("click", function() {
        var name = el.getAttribute("data-n");
        var found = null;
        DVC.spinResult.squad.forEach(function(p){ if (p.n === name) found = p; });
        if (!found) return;
        var pos = found.gp || found.p || "MID";
        var l = lineOf(pos);
        panel.style.display = "none";
        DVC.awaitingPick = false;
        DVC.spinResult = null;
        /* Restore spin button visibility */
        var sb = document.getElementById("dvcSpinBtn");
        var rb = document.getElementById("dvcRerollBtn");
        if (sb) sb.style.display = "";
        if (rb) rb.style.display = "none";
        /* Reset rerolls for next turn */
        DVC.rerollsLeft = DVC.maxRerolls || 3;
        doPlayerPickDvc({ n: found.n, r: found.r || 75, pos: pos, line: l });
      });
    });
  }

  function updateDraftUI() {
    var totalPicks = DVC.playerPicks.length + DVC.cpuPicks.length;
    var isPlayerTurn = DVC.turn === 0;
    var roundLabel = "Round " + DVC.round + " of 11";

    var badge = document.getElementById("dvcRoundBadge");
    var fill = document.getElementById("dvcProgressFill");
    var banner = document.getElementById("dvcTurnBanner");
    var lastCpu = document.getElementById("dvcLastCpu");
    var spinBtn = document.getElementById("dvcSpinBtn");

    if (badge) badge.textContent = roundLabel;
    if (fill) fill.style.width = Math.round(totalPicks / 22 * 100) + "%";

    if (banner) {
      if (isPlayerTurn && !DVC.spinBusy && !DVC.awaitingPick) {
        banner.className = "dvc-turn-banner dvc-your-turn";
        banner.innerHTML = "ON THE CLOCK &mdash; Your turn &mdash; spin.";
      } else if (!isPlayerTurn || DVC.spinBusy) {
        banner.className = "dvc-turn-banner dvc-cpu-turn";
        banner.innerHTML = esc(DVC.cpuName) + " is spinning&#8230;";
      }
    }

    if (lastCpu) {
      if (DVC.lastCpuPick) {
        lastCpu.style.display = "";
        lastCpu.innerHTML = esc(DVC.cpuName) + " picked: <strong>" + esc(DVC.lastCpuPick.n) + "</strong> (" + esc(DVC.lastCpuPick.pos) + ", " + DVC.lastCpuPick.r + ")";
      } else {
        lastCpu.style.display = "none";
      }
    }

    if (spinBtn) {
      spinBtn.disabled = !isPlayerTurn || DVC.spinBusy || DVC.awaitingPick || DVC.playerPicks.length >= 11;
      if (!spinBtn.disabled) spinBtn.textContent = "SPIN THE REEL";
    }

    var playerPitch = document.getElementById("dvcPlayerPitch");
    var cpuPitch = document.getElementById("dvcCpuPitch");
    if (playerPitch) playerPitch.innerHTML = pitchHTML(DVC.playerPicks, DVC.formation);
    if (cpuPitch) cpuPitch.innerHTML = pitchHTML(DVC.cpuPicks, DVC.formation);

    /* legacy list IDs kept for compatibility */
    var playerXI = document.getElementById("dvcPlayerXI");
    var cpuXI = document.getElementById("dvcCpuXI");
    if (playerXI) playerXI.innerHTML = renderXIList(DVC.playerPicks, "Your XI", false);
    if (cpuXI) cpuXI.innerHTML = renderXIList(DVC.cpuPicks, DVC.cpuName, true);
  }

  /* ---- Pick handlers ---- */
  function doPlayerPickDvc(player) {
    if (window.sfx) window.sfx.pick();
    DVC.playerPicks.push(player);
    DVC.lastCpuPick = null;

    if (DVC.playerPicks.length >= 11) {
      doCpuRemainingPicks();
      return;
    }

    DVC.turn = 1;
    DVC.round = Math.floor((DVC.playerPicks.length + DVC.cpuPicks.length) / 2) + 1;
    updateDraftUI();
    setTimeout(doCpuSpinTurn, 600);
  }

  /* CPU auto-spins with a fast animation, then picks via algorithm */
  function doCpuSpinTurn() {
    if (DVC.cpuPicks.length >= 11) {
      if (DVC.playerPicks.length >= 11) { setTimeout(goToResult, 400); }
      else { DVC.turn = 0; updateDraftUI(); }
      return;
    }

    var pool = DVC.teamPool;
    var pick = pool[Math.floor(Math.random() * pool.length)];
    DVC.spinBusy = true;
    updateDraftUI();

    var cStrip = document.getElementById("dvcCS");

    /* CPU spin is quicker */
    var p1 = dvcSpinReel(cStrip,
      function(){ return comboRandomHTML(pool); },
      comboItemHTML(pick), 360);

    Promise.all([p1]).then(function() {
      var cpuPlayer = cpuPickFromSquad(pick.squad);
      if (!cpuPlayer) {
        /* No suitable player in this squad — spin again silently */
        DVC.spinBusy = false;
        setTimeout(doCpuSpinTurn, 200);
        return;
      }

      var pos = cpuPlayer.gp || cpuPlayer.p || "MID";
      var l = lineOf(pos);
      DVC.cpuPicks.push({ n: cpuPlayer.n, r: cpuPlayer.r || 75, pos: pos, line: l });
      DVC.lastCpuPick = { n: cpuPlayer.n, r: cpuPlayer.r || 75, pos: pos, line: l };
      DVC.spinBusy = false;

      if (DVC.cpuPicks.length >= 11) {
        if (DVC.playerPicks.length >= 11) { setTimeout(goToResult, 500); }
        else {
          DVC.turn = 0;
          DVC.round = Math.floor((DVC.playerPicks.length + DVC.cpuPicks.length) / 2) + 1;
          updateDraftUI();
        }
        return;
      }

      DVC.turn = 0;
      DVC.round = Math.floor((DVC.playerPicks.length + DVC.cpuPicks.length) / 2) + 1;
      updateDraftUI();
    });
  }

  function doCpuRemainingPicks() {
    var pool = DVC.teamPool;
    var needed = 11 - DVC.cpuPicks.length;
    var tries = 0;
    while (needed > 0 && tries < 400) {
      tries++;
      var pick = pool[Math.floor(Math.random() * pool.length)];
      var cpuPlayer = cpuPickFromSquad(pick.squad);
      if (!cpuPlayer) continue;
      var pos = cpuPlayer.gp || cpuPlayer.p || "MID";
      DVC.cpuPicks.push({ n: cpuPlayer.n, r: cpuPlayer.r || 75, pos: pos, line: lineOf(pos) });
      needed--;
    }
    goToResult();
  }

  /* ---- Result ---- */
  function goToResult() {
    DVC.phase = "result";
    var diffTax = DVC.difficulty === "easy" ? -4 : DVC.difficulty === "hard" ? 4 : 0;
    var playerTeam = buildTeam(DVC.playerPicks, "Your XI", true);
    var cpuTeam = buildTeam(DVC.cpuPicks, DVC.cpuName, false);
    cpuTeam.atk += diffTax; cpuTeam.def += diffTax;
    DVC.matchResult = null;
    try {
      if (W.ENGINE && W.ENGINE.simulateMatch) {
        DVC.matchResult = W.ENGINE.simulateMatch(playerTeam, cpuTeam, false);
      }
    } catch(e){}
    DVC.playerTeam = playerTeam;
    DVC.cpuTeam = cpuTeam;

    var rec = loadDvcRecord();
    var diff = DVC.difficulty;
    if (DVC.matchResult) {
      if (DVC.matchResult.winner === "A") rec[diff].w++;
      else if (DVC.matchResult.winner === "B") rec[diff].l++;
      else rec[diff].d++;
      saveDvcRecord(rec);
    }
    DVC.savedRecord = rec;

    if (DVC.matchResult && typeof W.WCXI_addScore === "function") {
      var diffMult = DVC.difficulty === "hard" ? 4 : DVC.difficulty === "medium" ? 2 : 1;
      var outcome = DVC.matchResult.winner === "A" ? "w" : DVC.matchResult.winner === "B" ? "l" : "d";
      var basePts = outcome === "w" ? 100 : outcome === "d" ? 30 : 0;
      var pts = basePts * diffMult;
      if (pts > 0) {
        var diffLabel = DVC.difficulty.charAt(0).toUpperCase() + DVC.difficulty.slice(1);
        var outcomeLabel = outcome === "w" ? "Win" : "Draw";
        var res = DVC.matchResult;
        var scoreStr = res.a + "-" + res.b + (res.pens ? " (pens " + res.pens[0] + "-" + res.pens[1] + ")" : "");
        W.WCXI_addScore({ name: "Your XI", score: pts, result: outcomeLabel + " \xb7 " + diffLabel + " \xb7 " + scoreStr, mode: "dvc", ts: Date.now() });
      }
    }

    render();
    if (window.sfx && DVC.matchResult && DVC.matchResult.winner === "A") window.sfx.win();
    if (W.triggerConfetti && DVC.matchResult && DVC.matchResult.winner === "A") {
      setTimeout(W.triggerConfetti, 400);
    }
  }

  function avgRating(picks) {
    var ps = picks.filter(Boolean);
    if (!ps.length) return 0;
    return Math.round(ps.reduce(function(s,p){ return s+(p.r||75); },0)/ps.length*10)/10;
  }

  function renderResult() {
    var res = DVC.matchResult;
    var winner = res ? (res.winner==="A" ? "You" : res.winner==="B" ? DVC.cpuName : "Draw") : "—";
    var score = res ? res.a+"-"+res.b+(res.pens?" ("+res.pens[0]+"-"+res.pens[1]+" pens)":"") : "—";
    var playerAvg = avgRating(DVC.playerPicks);
    var cpuAvg = avgRating(DVC.cpuPicks);

    var html = '<div class="dvc-result-wrap">';
    var verdictCls = res ? (res.winner==="A"?"dvc-win":res.winner==="B"?"dvc-loss":"dvc-draw") : "";
    html += '<div class="dvc-verdict '+verdictCls+'">';
    if (res) {
      if (res.winner==="A") html += '<div class="dvc-verdict-title">You Won!</div>';
      else if (res.winner==="B") html += '<div class="dvc-verdict-title">'+esc(DVC.cpuName)+' Won</div>';
      else html += '<div class="dvc-verdict-title">Draw</div>';
      html += '<div class="dvc-verdict-score">'+esc(score)+'</div>';
      var savedRec = DVC.savedRecord || loadDvcRecord();
      var diff = DVC.difficulty;
      var sr = savedRec[diff] || {w:0,l:0,d:0};
      var label = diff.charAt(0).toUpperCase() + diff.slice(1);
      html += '<div class="dvc-verdict-record">'+esc(label)+': '+sr.w+'W&thinsp;'+sr.l+'L&thinsp;'+sr.d+'D</div>';
    }
    html += '</div>';

    html += '<div class="dvc-result-pitches">';
    html += '<div class="dvc-result-xi">';
    html += '<div class="dvc-xi-header"><span class="dvc-xi-title">Your XI</span>';
    html += '<span class="dvc-xi-avg mp-r-badge'+ratingTierClass(Math.round(playerAvg))+'">avg '+playerAvg+'</span></div>';
    html += pitchHTML(DVC.playerPicks, DVC.formation);
    html += '<div class="dvc-xi-list dvc-result-list">';
    DVC.playerPicks.forEach(function(p){
      html += '<div class="dvc-xi-row"><span class="pos '+p.line+'">'+esc(p.pos)+'</span><span class="dvc-xi-name">'+esc(p.n)+'</span><span class="mp-r-badge'+ratingTierClass(p.r)+'">'+p.r+'</span></div>';
    });
    html += '</div></div>';

    html += '<div class="dvc-result-xi">';
    html += '<div class="dvc-xi-header"><span class="dvc-xi-title">'+esc(DVC.cpuName)+'</span>';
    html += '<span class="dvc-xi-avg mp-r-badge'+ratingTierClass(Math.round(cpuAvg))+'">avg '+cpuAvg+'</span></div>';
    html += pitchHTML(DVC.cpuPicks, DVC.formation);
    html += '<div class="dvc-xi-list dvc-result-list">';
    DVC.cpuPicks.forEach(function(p){
      html += '<div class="dvc-xi-row"><span class="pos '+p.line+'">'+esc(p.pos)+'</span><span class="dvc-xi-name">'+esc(p.n)+'</span><span class="mp-r-badge'+ratingTierClass(p.r)+'">'+p.r+'</span></div>';
    });
    html += '</div></div>';
    html += '</div>';

    if (res && res.eventsA && res.eventsA.length) {
      html += '<div class="dvc-goals"><span class="dvc-goals-label">Your goals:</span> ';
      html += res.eventsA.map(function(e){ return esc(e.scorer)+(e.assist?" ("+esc(e.assist)+")":""); }).join(", ");
      html += '</div>';
    }

    html += '<div class="dvc-result-cta">';
    html += '<button class="btn-primary" id="dvcPlayAgain">Draft Again</button>';
    html += '<button class="btn-ghost" id="dvcHome">&#8592; Home</button>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  function wireResult() {
    var again = document.getElementById("dvcPlayAgain");
    if (again) again.onclick = function(){
      DVC.phase = "setup";
      DVC.playerPicks = [];
      DVC.cpuPicks = [];
      DVC.teamPool = [];
      render();
    };
    var home = document.getElementById("dvcHome");
    if (home) home.onclick = function(){ W.flGoHome(); };
  }

  /* ---- Public entry point ---- */
  return function() {
    var el = document.getElementById("dvcView");
    if (!el) return;

    ["homeView","setupView","draftView","resultsView","mpView","leagueView","boardView","rwView"].forEach(function(id){
      var v = document.getElementById(id); if (v) v.style.display = "none";
    });
    el.style.display = "";
    if (W.scrollTo) W.scrollTo(0, 0);

    DVC = {
      phase: "setup",
      formation: "4-3-3",
      difficulty: "medium",
      personality: "balanced",
      maxRerolls: 3,
      rerollsLeft: 3,
      teamPool: [],
      playerPicks: [],
      cpuPicks: [],
      turn: 0,
      round: 1,
      cpuName: rnd(CPU_NAMES.balanced),
      lastCpuPick: null,
      spinBusy: false,
      awaitingPick: false,
      spinResult: null,
      matchResult: null,
      playerTeam: null,
      cpuTeam: null
    };
    render();
  };
})(window);
