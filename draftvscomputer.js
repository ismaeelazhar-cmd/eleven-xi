/* draftvscomputer.js — Draft vs Computer mode
 * Player and CPU alternate picks from a shared pool of players.
 * CPU is smart-ish: fills needed positions, prefers high-rated players,
 * adds slight randomness so it doesn't feel robotic. */
window.startDraftVsComputer = (function (W) {
  "use strict";

  var LINE_OF = {
    GK:"GK",
    CB:"DEF", RB:"DEF", LB:"DEF", RWB:"DEF", LWB:"DEF", DEF:"DEF",
    CDM:"MID", CM:"MID", CAM:"MID", RM:"MID", LM:"MID", MID:"MID",
    RW:"FWD", LW:"FWD", ST:"FWD", CF:"FWD", FWD:"FWD"
  };

  var DVC_FORMATIONS = {
    "4-3-3":   { slots:["GK","RB","CB","CB","LB","CM","CDM","CM","RW","ST","LW"] },
    "4-4-2":   { slots:["GK","RB","CB","CB","LB","RM","CM","CM","LM","ST","ST"] },
    "4-2-3-1": { slots:["GK","RB","CB","CB","LB","CDM","CDM","CAM","RM","LM","ST"] },
    "3-5-2":   { slots:["GK","CB","CB","CB","RM","CM","CDM","CM","LM","ST","ST"] }
  };

  var CPU_NAMES = ["The Machine", "AutoXI", "CPU Manager", "Iron Bot", "The Algorithm"];

  var DVC_RECORD_KEY = "wcxi_dvc_record";

  function esc(s) { return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
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
  var DVC = {};

  function lineOf(pos){ return LINE_OF[(pos||"").trim()] || "MID"; }

  /* Build the shared draft pool from all available data */
  function buildPool() {
    var combined = {};
    var sources = [W.WORLD_CUP_DATA, W.EURO_DATA, W.PL_DATA, W.LALIGA_DATA, W.SERIEA_DATA, W.BUNDESLIGA_DATA];
    sources.forEach(function(d){
      if (!d) return;
      Object.keys(d).forEach(function(team){
        var ys = (d[team] && d[team].years) ? d[team].years : {};
        Object.keys(ys).forEach(function(y){
          var key = team+"|"+y;
          if (!combined[key]) combined[key] = { team:team, year:y, squad:(ys[y]||[]) };
        });
      });
    });
    var keys = Object.keys(combined);
    if (!keys.length) return [];

    /* Pick 12 random team-years to form the pool */
    shuffle(keys);
    var chosen = keys.slice(0, 12);
    var players = [], seen = {};
    chosen.forEach(function(k){
      var entry = combined[k];
      /* Sort by rating desc, take top 11 */
      var sq = (entry.squad||[]).slice().sort(function(a,b){ return (b.r||70)-(a.r||70); }).slice(0,11);
      sq.forEach(function(p){
        if (!p.n) return;
        if (seen[p.n]) return; /* deduplicate by name */
        seen[p.n] = true;
        var pos = p.gp||p.p||"CM";
        var line = lineOf(pos);
        if ((p.r||0) < 68) return; /* quality floor */
        players.push({ n:p.n, r:p.r||75, pos:pos, line:line, team:entry.team, year:entry.year });
      });
    });

    /* Ensure position balance: need at least 4 GK, 10 DEF, 10 MID, 8 FWD */
    var counts = {GK:0,DEF:0,MID:0,FWD:0};
    players.forEach(function(p){ counts[p.line]++; });

    /* If GKs are missing, try to pull more from other team-years */
    if (counts.GK < 4) {
      var remaining = keys.slice(12);
      shuffle(remaining);
      remaining.some(function(k){
        var entry = combined[k];
        var sq = entry.squad||[];
        sq.forEach(function(p){
          if (p.n && !seen[p.n] && lineOf(p.gp||p.p||"CM")==="GK" && counts.GK<4) {
            seen[p.n]=true; counts.GK++;
            players.push({n:p.n,r:p.r||75,pos:p.gp||p.p||"GK",line:"GK",team:entry.team,year:entry.year});
          }
        });
        return counts.GK >= 4;
      });
    }

    return shuffle(players);
  }

  /* CPU pick: fills most-needed line, prefers high rated, has some randomness */
  function cpuPick(pool) {
    var needs = {GK:0,DEF:0,MID:0,FWD:0};
    var slots = DVC_FORMATIONS[DVC.formation].slots;
    slots.forEach(function(s){ needs[lineOf(s)]++; });
    DVC.cpuPicks.forEach(function(p){ if(p) needs[p.line]--; });

    /* Score each available player */
    var scored = pool.map(function(p){
      var n = Math.max(0, needs[p.line]||0);
      var urgency = n >= 3 ? 30 : n >= 2 ? 20 : n >= 1 ? 10 : -20; /* penalise if line full */
      var score = urgency + (p.r||75) + (Math.random()*18 - 4);
      return { p:p, score:score };
    });
    scored.sort(function(a,b){ return b.score-a.score; });

    /* Pick from top 3 for variety */
    var topN = Math.min(3, scored.length);
    return scored[Math.floor(Math.random()*topN)].p;
  }

  /* Find the best slot for a picked player (first unfilled slot matching line) */
  function bestSlot(picks, line, formation) {
    var slots = DVC_FORMATIONS[formation].slots;
    var slotCounts = {GK:0,DEF:0,MID:0,FWD:0};
    picks.forEach(function(p){ if(p) slotCounts[p.line]++; });
    var lineSlots = slots.filter(function(s){ return lineOf(s)===line; });
    var needed = lineSlots.length - slotCounts[line];
    return needed > 0 ? lineSlots[slotCounts[line]] : null;
  }

  /* Compute team object for engine */
  function buildTeam(picks, name, isUser) {
    var players = picks.filter(Boolean);
    if (!players.length) return { name:name, rating:75, atk:75, def:75, isUser:isUser, players:[] };
    var fwd = players.filter(function(p){ return p.line==="FWD"||p.line==="MID"; });
    var def = players.filter(function(p){ return p.line==="DEF"||p.line==="GK"; });
    var avg = function(arr){ return arr.length ? arr.reduce(function(s,p){ return s+(p.r||75); },0)/arr.length : 75; };
    var atk = avg(fwd), def2 = avg(def), overall = avg(players);
    return {
      name: name, rating: overall, atk: atk, def: def2, isUser: isUser,
      players: players.map(function(p){ return {n:p.n,r:p.r,p:p.line}; })
    };
  }

  /* Render the pitch for a team's XI */
  function pitchHTML(picks, formation) {
    var slots = DVC_FORMATIONS[formation].slots;
    var filled = [];
    /* Map picks back to slots */
    var byLine = {GK:[],DEF:[],MID:[],FWD:[]};
    picks.filter(Boolean).forEach(function(p){ byLine[p.line].push(p); });
    slots.forEach(function(s){ var l=lineOf(s); var p=byLine[l].shift()||null; filled.push({slot:s,line:l,player:p}); });

    /* Group into lines (GK row, then formation rows) */
    var lineMap = {GK:[],DEF:[],MID:[],FWD:[]};
    filled.forEach(function(f){ lineMap[f.line].push(f); });

    var rows = [lineMap.FWD, lineMap.MID, lineMap.DEF, lineMap.GK];
    var html = '<div class="pitch dvc-pitch">';
    rows.forEach(function(row){
      if (!row.length) return;
      html += '<div class="pitch-row">';
      row.forEach(function(f){
        var tier = f.player ? (" r-tier-"+f.line.toLowerCase()) : "";
        html += '<div class="pdot'+(f.player?" filled "+f.line:(" "+f.line))+tier+'">'+
          '<span class="dot-pos">'+esc(f.slot)+'</span>'+
          (f.player ? '<span class="dot-name">'+esc(f.player.n.split(" ").pop())+'</span>' : '')+
        '</div>';
      });
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  /* Render current draft state */
  function render() {
    var el = document.getElementById("dvcView");
    if (!el) return;
    if (DVC.phase === "setup") { el.innerHTML = renderSetup(); wireSetup(); return; }
    if (DVC.phase === "draft") { el.innerHTML = renderDraft(); wireDraft(); return; }
    if (DVC.phase === "result") { el.innerHTML = renderResult(); wireResult(); return; }
  }

  function renderSetup() {
    var html = '<button class="back" id="dvcBack">← Home</button>';
    html += '<div class="setup"><h2 class="rw-title">Draft vs Computer</h2>';
    html += '<p class="rw-sub" style="margin-bottom:var(--sp-5)">Build an XI by alternating picks with the computer from a shared pool. You go first. Best squad wins.</p>';
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
    html += '<div class="seg-desc" id="dvcDiffDesc">'+(DVC.difficulty==="easy"?"CPU picks with lower priority — easier to outbuild.":DVC.difficulty==="hard"?"CPU always takes the best available player — tough competition.":"CPU plays sensibly but isn't perfect.")+'</div>';
    html += '<div class="dvc-record" id="dvcRecord">'+renderRecordHtml(DVC.difficulty)+'</div>';
    html += '</div>';
    html += '<button class="start-btn" id="dvcStart">Start Draft →</button></div>';
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

    var startBtn = document.getElementById("dvcStart");
    if (startBtn) startBtn.onclick = function(){
      DVC.pool = buildPool();
      if (DVC.pool.length < 22) {
        if (W.flToast) W.flToast("Not enough data loaded — try again in a moment.");
        return;
      }
      DVC.playerPicks = [];
      DVC.cpuPicks = [];
      DVC.turn = 0; /* 0 = player, 1 = cpu */
      DVC.round = 1;
      DVC.phase = "draft";
      DVC.cpuName = rnd(CPU_NAMES);
      DVC.lastCpuPick = null;
      render();
    };
  }

  function renderDraft() {
    var totalPicks = DVC.playerPicks.length + DVC.cpuPicks.length;
    var isPlayerTurn = DVC.turn === 0;
    var roundLabel = "Round " + DVC.round + " of 11";

    var html = '<button class="back" id="dvcBack">← Home</button>';
    html += '<div class="dvc-draft-wrap">';

    /* Header */
    html += '<div class="dvc-draft-header">';
    html += '<div class="dvc-draft-progress">';
    html += '<span class="dvc-round-badge">'+esc(roundLabel)+'</span>';
    html += '<div class="dvc-progress-bar"><div class="dvc-progress-fill" style="width:'+Math.round(totalPicks/22*100)+'%"></div></div>';
    html += '</div>';
    if (isPlayerTurn) {
      html += '<div class="dvc-turn-banner dvc-your-turn">Your pick — choose a player</div>';
    } else {
      html += '<div class="dvc-turn-banner dvc-cpu-turn">'+esc(DVC.cpuName)+' is thinking…</div>';
    }
    if (DVC.lastCpuPick) {
      html += '<div class="dvc-last-cpu-pick">'+esc(DVC.cpuName)+' picked: <strong>'+esc(DVC.lastCpuPick.n)+'</strong> ('+esc(DVC.lastCpuPick.pos)+', '+DVC.lastCpuPick.r+')</div>';
    }
    html += '</div>';

    /* Two-column layout: pool on left, both XIs on right */
    html += '<div class="dvc-main">';

    /* Pool */
    html += '<div class="dvc-pool-col"><h3 class="dvc-col-title">Available Players</h3>';
    html += '<div class="dvc-pool-grid" id="dvcPool">';
    var byLine = {GK:[],DEF:[],MID:[],FWD:[]};
    DVC.pool.forEach(function(p){ byLine[p.line].push(p); });
    ["GK","DEF","MID","FWD"].forEach(function(line){
      if (!byLine[line].length) return;
      var lineLabels = {GK:"Goalkeeper",DEF:"Defenders",MID:"Midfielders",FWD:"Forwards"};
      html += '<div class="dvc-pool-line-label">'+lineLabels[line]+'</div>';
      byLine[line].forEach(function(p){
        var tierCls = W.game && W.game.ratingTierClass ? W.game.ratingTierClass(p.r) : "";
        html += '<button class="dvc-player-card'+(isPlayerTurn?"":" disabled")+'" data-n="'+esc(p.n)+'"'+(isPlayerTurn?'':" disabled")+'>';
        html += '<span class="dvc-pos pos '+line+'">'+esc(p.pos)+'</span>';
        html += '<span class="dvc-name">'+esc(p.n)+'</span>';
        html += '<span class="dvc-meta">'+esc(p.team)+' \''+String(p.year).slice(-2)+'</span>';
        if (W.dvcShowRatings !== false) {
          html += '<span class="mp-r-badge'+ratingTierClass(p.r)+'">'+p.r+'</span>';
        }
        html += '</button>';
      });
    });
    html += '</div></div>';

    /* XIs */
    html += '<div class="dvc-xi-col">';

    /* Player XI */
    html += '<div class="dvc-xi-panel"><h3 class="dvc-col-title">Your XI <span class="count">'+DVC.playerPicks.length+'/11</span></h3>';
    html += '<div class="dvc-xi-list">';
    DVC.playerPicks.forEach(function(p){
      html += '<div class="dvc-xi-row"><span class="pos '+p.line+'">'+esc(p.pos)+'</span><span class="dvc-xi-name">'+esc(p.n)+'</span><span class="mp-r-badge'+ratingTierClass(p.r)+'">'+p.r+'</span></div>';
    });
    if (DVC.playerPicks.length < 11) {
      var slots = DVC_FORMATIONS[DVC.formation].slots;
      var byL = {GK:0,DEF:0,MID:0,FWD:0};
      DVC.playerPicks.forEach(function(p){ byL[p.line]++; });
      var remaining = slots.filter(function(s){ var l=lineOf(s); if(byL[l]>0){byL[l]--;return false;}return true; });
      remaining.forEach(function(s){
        html += '<div class="dvc-xi-row empty"><span class="pos '+lineOf(s)+'">'+esc(s)+'</span><span class="dvc-xi-name dvc-empty-slot">empty</span></div>';
      });
    }
    html += '</div></div>';

    /* CPU XI */
    html += '<div class="dvc-xi-panel dvc-cpu-xi"><h3 class="dvc-col-title dvc-cpu-label">'+esc(DVC.cpuName)+' <span class="count">'+DVC.cpuPicks.length+'/11</span></h3>';
    html += '<div class="dvc-xi-list">';
    DVC.cpuPicks.forEach(function(p){
      html += '<div class="dvc-xi-row"><span class="pos '+p.line+'">'+esc(p.pos)+'</span><span class="dvc-xi-name">'+esc(p.n)+'</span></div>';
    });
    for (var i=DVC.cpuPicks.length; i<11; i++){
      html += '<div class="dvc-xi-row empty"><span class="pos MID">—</span><span class="dvc-xi-name dvc-empty-slot">…</span></div>';
    }
    html += '</div></div>';

    html += '</div>'; /* dvc-xi-col */
    html += '</div>'; /* dvc-main */
    html += '</div>'; /* dvc-draft-wrap */
    return html;
  }

  function ratingTierClass(r){
    if(!r) return "";
    return r>=90?" r-gold":r>=85?" r-elite":r>=80?" r-great":r>=75?" r-good":r>=70?" r-amber":r>=60?" r-orange":" r-red";
  }

  function wireDraft() {
    var back = document.getElementById("dvcBack");
    if (back) back.onclick = function(){ W.flGoHome(); };

    /* Player pick handlers */
    document.querySelectorAll(".dvc-player-card:not(.disabled)").forEach(function(btn){
      btn.onclick = function(){
        var name = btn.getAttribute("data-n");
        var picked = DVC.pool.filter(function(p){ return p.n===name; })[0];
        if (!picked) return;
        doPlayerPick(picked);
      };
    });
  }

  function doPlayerPick(player) {
    if (W.sfx) W.sfx.pick();
    /* Remove from pool */
    DVC.pool = DVC.pool.filter(function(p){ return p.n!==player.n; });
    DVC.playerPicks.push(player);
    DVC.lastCpuPick = null;

    /* Check if player is done */
    if (DVC.playerPicks.length === 11) {
      /* If CPU still needs picks, do them now before going to result */
      doCpuRemainingPicks();
      return;
    }

    /* Switch to CPU turn */
    DVC.turn = 1;
    DVC.round = Math.floor((DVC.playerPicks.length + DVC.cpuPicks.length) / 2) + 1;
    render();
    /* CPU pick after short delay */
    setTimeout(doCpuTurn, 900);
  }

  function doCpuTurn() {
    if (!DVC.pool.length) { goToResult(); return; }
    var pick = cpuPick(DVC.pool);
    DVC.pool = DVC.pool.filter(function(p){ return p.n!==pick.n; });
    DVC.cpuPicks.push(pick);
    DVC.lastCpuPick = pick;

    if (DVC.cpuPicks.length === 11) {
      /* CPU done, player might still need picks */
      if (DVC.playerPicks.length === 11) { setTimeout(goToResult, 600); }
      else { DVC.turn = 0; DVC.round++; render(); }
      return;
    }

    /* Back to player */
    DVC.turn = 0;
    DVC.round = Math.floor((DVC.playerPicks.length + DVC.cpuPicks.length) / 2) + 1;
    render();
  }

  function doCpuRemainingPicks() {
    var needed = 11 - DVC.cpuPicks.length;
    for (var i=0; i<needed && DVC.pool.length; i++) {
      var pick = cpuPick(DVC.pool);
      DVC.pool = DVC.pool.filter(function(p){ return p.n!==pick.n; });
      DVC.cpuPicks.push(pick);
    }
    goToResult();
  }

  function goToResult() {
    DVC.phase = "result";
    /* Simulate the match */
    var diffTax = DVC.difficulty==="easy" ? -4 : DVC.difficulty==="hard" ? 4 : 0;
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
    /* Record W/L/D */
    var rec = loadDvcRecord();
    var diff = DVC.difficulty;
    if (DVC.matchResult) {
      if (DVC.matchResult.winner === "A") rec[diff].w++;
      else if (DVC.matchResult.winner === "B") rec[diff].l++;
      else rec[diff].d++;
      saveDvcRecord(rec);
    }
    DVC.savedRecord = rec;
    /* Post to shared leaderboard */
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
        W.WCXI_addScore({ name: "Your XI", score: pts, result: outcomeLabel + " · " + diffLabel + " · " + scoreStr, mode: "dvc", ts: Date.now() });
      }
    }
    render();
    if (W.sfx && DVC.matchResult && DVC.matchResult.winner==="A") W.sfx.win();
    if (W.triggerConfetti && DVC.matchResult && DVC.matchResult.winner==="A") {
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
    var score = res ? res.a+"-"+res.b+(res.pens?"("+res.pens[0]+"-"+res.pens[1]+" pens)":"") : "—";
    var playerAvg = avgRating(DVC.playerPicks);
    var cpuAvg = avgRating(DVC.cpuPicks);

    var html = '<div class="dvc-result-wrap">';

    /* Verdict banner */
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

    /* Both pitches */
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

    html += '</div>'; /* dvc-result-pitches */

    /* Goal events */
    if (res && res.eventsA && res.eventsA.length) {
      html += '<div class="dvc-goals"><span class="dvc-goals-label">Your goals:</span> ';
      html += res.eventsA.map(function(e){ return esc(e.scorer)+(e.assist?" ("+esc(e.assist)+")":""); }).join(", ");
      html += '</div>';
    }

    html += '<div class="dvc-result-cta">';
    html += '<button class="btn-primary" id="dvcPlayAgain">Draft Again</button>';
    html += '<button class="btn-ghost" id="dvcHome">← Home</button>';
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
      DVC.pool = [];
      render();
    };
    var home = document.getElementById("dvcHome");
    if (home) home.onclick = function(){ W.flGoHome(); };
  }

  /* Public entry point */
  return function() {
    var el = document.getElementById("dvcView");
    if (!el) return;

    /* Hide all other views */
    ["homeView","setupView","draftView","resultsView","mpView","leagueView","boardView","rwView"].forEach(function(id){
      var v = document.getElementById(id); if (v) v.style.display = "none";
    });
    el.style.display = "";
    if (W.scrollTo) W.scrollTo(0,0);

    /* Init state */
    DVC = {
      phase: "setup",
      formation: "4-3-3",
      difficulty: "medium",
      pool: [],
      playerPicks: [],
      cpuPicks: [],
      turn: 0,
      round: 1,
      cpuName: rnd(CPU_NAMES),
      lastCpuPick: null,
      matchResult: null,
      playerTeam: null,
      cpuTeam: null
    };
    render();
  };
})(window);
