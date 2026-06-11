/* ratingswar.js — Eleven XI · "Duels" mode.
 * Two players build an XI BLIND (ratings never rendered during build),
 * then a head-to-head position-by-position reveal decides each slot.
 * Self-contained; wired from the home card via window.startDuels(). */
(function (W) {
  "use strict";

  var LINE_OF = { GK:"GK", CB:"DEF",RB:"DEF",LB:"DEF",RWB:"DEF",LWB:"DEF",
    CDM:"MID",CM:"MID",CAM:"MID",RM:"MID",LM:"MID", RW:"FWD",LW:"FWD",ST:"FWD" };
  /* fixed shared XI so both squads compare slot-for-slot */
  var SLOTS = [
    {k:"GK",  line:"GK"},
    {k:"RB",  line:"DEF"}, {k:"CB", line:"DEF"}, {k:"CB ", line:"DEF"}, {k:"LB", line:"DEF"},
    {k:"CDM", line:"MID"}, {k:"CM", line:"MID"}, {k:"CM ", line:"MID"},
    {k:"RW",  line:"FWD"}, {k:"ST", line:"FWD"}, {k:"LW", line:"FWD"}
  ];
  var POOL = null, RW = null;

  function esc(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function rnd(a){ return a[Math.floor(Math.random()*a.length)]; }
  function shortName(n){ var p=String(n).split(" "); return p.length>1?p[p.length-1]:n; }
  function ratingTierClass(r){ if(!r) return ""; return r>=90?" r-gold":r>=85?" r-elite":r>=80?" r-great":r>=75?" r-good":""; }

  function buildPool(){
    if (POOL) return POOL;
    var byLine = { GK:[], DEF:[], MID:[], FWD:[] }, seen = {};
    function add(p, club, year){
      if (!p || !p.n || !p.gp) return;
      var line = LINE_OF[p.gp]; if (!line) return;
      var key = p.n;
      if (seen[key]) { if ((p.r||0) > seen[key].r) seen[key].r = p.r; return; }
      var o = { n:p.n, r:p.r||75, gp:p.gp, club:club||"", year:year||"" };
      seen[key] = o; byLine[line].push(o);
    }
    var sets = [W.WORLD_CUP_DATA, W.PL_DATA, W.LALIGA_DATA, W.SERIEA_DATA];
    sets.forEach(function(d){ if(!d) return;
      Object.keys(d).forEach(function(team){
        var ys = d[team].years || {};
        Object.keys(ys).forEach(function(y){ (ys[y]||[]).forEach(function(p){ add(p, team, y); }); });
      });
    });
    POOL = byLine; return POOL;
  }

  function view(){
    var v = document.getElementById("rwView");
    if (!v){ v = document.createElement("section"); v.id = "rwView"; document.querySelector(".wrap").appendChild(v); }
    return v;
  }
  function hideOthers(){
    ["homeView","setupView","draftView","resultsView","mpView","leagueView","boardView"].forEach(function(id){
      var e = document.getElementById(id); if (e) e.style.display = "none";
    });
    var f = document.querySelector("footer"); if (f) f.style.display = "none";
  }
  function goHome(){
    clearTimeout(RW && RW._t);
    if (RW && RW.online && W.ElxiNet) { try { W.ElxiNet.close(); } catch(e){} }
    var v = document.getElementById("rwView"); if (v) v.style.display = "none";
    var f = document.querySelector("footer"); if (f) f.style.display = "";
    var h = document.getElementById("homeView"); if (h) h.style.display = "";
    if (W.scrollTo) W.scrollTo(0,0);
  }

  W.startDuels = function(){
    RW = {
      phase:"intro", cur:0, revealStep:-1,
      numPlayers:2, curA:0, curB:1,
      matches:[], matchIdx:0, matchResults:[],
      currentSpin:null, pendingRWPick:null, _spinning:false,
      players:[ {name:"Player 1", picks:newPicks(), rerollsUsed:0}, {name:"Player 2", picks:newPicks(), rerollsUsed:0} ]
    };
    hideOthers(); view().style.display=""; if(W.scrollTo) W.scrollTo(0,0);
    render();
  };
  function newPicks(){ return SLOTS.map(function(){ return null; }); }

  /* ── Match schedule helpers ── */
  function buildMatchSchedule(n){
    if (n===2) return [{a:0,b:1}];
    if (n===3) return [{a:0,b:1,label:"Match 1"},{a:0,b:2,label:"Match 2"},{a:1,b:2,label:"Match 3"}];
    /* 4-player: only semis here; final+3rd added dynamically after semis */
    return [{a:0,b:1,label:"Semi-final 1"},{a:2,b:3,label:"Semi-final 2"}];
  }
  function matchWinner(res){
    /* returns player index of winner, or -1 for draw */
    return res.score[0]>res.score[1] ? res.a : res.score[1]>res.score[0] ? res.b : -1;
  }
  function matchLoser(res){
    var w = matchWinner(res); if (w===-1) return res.b; /* draw: arbitrary */
    return w===res.a ? res.b : res.a;
  }
  function advanceMatch(){
    /* Save current match result */
    RW.matchResults.push({a:RW.curA, b:RW.curB, score:[RW.score[0],RW.score[1]]});
    /* 4-player bracket: after both semis, inject final + 3rd */
    if (RW.numPlayers===4 && RW.matchIdx===1 && RW.matchResults.length===2){
      var w1=matchWinner(RW.matchResults[0]), w2=matchWinner(RW.matchResults[1]);
      var l1=matchLoser(RW.matchResults[0]),  l2=matchLoser(RW.matchResults[1]);
      if (w1===-1){ w1=RW.matchResults[0].a; l1=RW.matchResults[0].b; } /* treat draw as first player wins */
      if (w2===-1){ w2=RW.matchResults[1].a; l2=RW.matchResults[1].b; }
      RW.matches.push({a:l1,b:l2,label:"3rd place play-off"});
      RW.matches.push({a:w1,b:w2,label:"Final"});
    }
    RW.matchIdx++;
    if (RW.matchIdx < RW.matches.length){
      RW.curA = RW.matches[RW.matchIdx].a;
      RW.curB = RW.matches[RW.matchIdx].b;
      RW.phase = "matchnext"; render();
    } else {
      RW.phase = "tournresult"; render();
    }
  }

  /* ════════════════════════════════════════════════════
     ONLINE Duels — each player builds on their own
     device; XIs are exchanged over WebRTC, then both run
     the identical reveal. Host = player 0, guest = player 1
     (canonical, so the reveal matches on both screens).
  ════════════════════════════════════════════════════ */
  W.startDuelsOnline = function(role){
    buildPool();
    var myIdx = role === "host" ? 0 : 1, oppIdx = myIdx === 0 ? 1 : 0;
    RW = {
      online:true, role:role, myIdx:myIdx, oppIdx:oppIdx,
      phase:"onintro", cur:myIdx, revealStep:-1,
      myLocked:false, oppPicks:null, oppName:null, rematchMe:false, rematchOpp:false,
      currentSpin:null, pendingRWPick:null, _spinning:false,
      players:[ {name:"Host", picks:newPicks(), rerollsUsed:0}, {name:"Guest", picks:newPicks(), rerollsUsed:0} ]
    };
    // Default display names until a hello arrives.
    RW.players[myIdx].name = myIdx === 0 ? "Host" : "Guest";
    RW.players[oppIdx].name = oppIdx === 0 ? "Host" : "Guest";
    wireNet();
    hideOthers(); view().style.display=""; if(W.scrollTo) W.scrollTo(0,0);
    render();
  };

  function wireNet(){
    var Net = W.ElxiNet; if(!Net) return;
    Net.onData = function(msg){ rwNet(msg); };
    Net.onPeerLeave = function(){ rwPeerLeft(); };
  }
  function rwSend(o){ if(W.ElxiNet) W.ElxiNet.send(o); }

  function rwNet(msg){
    if(!RW || !RW.online || !msg || !msg.t) return;
    if(msg.t === "rw_hello"){
      RW.players[RW.oppIdx].name = String(msg.name||"").slice(0,14) || RW.players[RW.oppIdx].name;
      // If I locked before my opponent was ready, my XI may have been dropped on
      // their side — re-send it now that they've announced themselves.
      if(RW.myLocked) rwSend({ t:"rw_xi", name:RW.players[RW.myIdx].name, picks:RW.players[RW.myIdx].picks });
      if(RW.phase === "onbuild" || RW.phase === "waitopp" || RW.phase === "onintro") render();
    } else if(msg.t === "rw_xi"){
      RW.oppPicks = sanitizePicks(msg.picks);
      RW.players[RW.oppIdx].picks = RW.oppPicks;
      if(msg.name) RW.players[RW.oppIdx].name = String(msg.name).slice(0,14);
      maybeStartReveal();
    } else if(msg.t === "rw_rematch"){
      RW.rematchOpp = true;
      maybeRematch();
    }
  }
  function sanitizePicks(arr){
    if(!Array.isArray(arr)) return newPicks();
    return SLOTS.map(function(s,i){
      var p = arr[i]; if(!p) return null;
      return { n:String(p.n||"?").slice(0,40), r:Math.max(0,Math.min(99,parseInt(p.r,10)||0)),
               gp:String(p.gp||"").slice(0,6), club:String(p.club||"").slice(0,40), year:String(p.year||"").slice(0,12) };
    });
  }
  function maybeStartReveal(){
    if(RW.myLocked && RW.oppPicks){
      RW.phase = "reveal"; RW.revealStep = -1; computeResult();
      render();
    } else if(RW.myLocked){
      RW.phase = "waitopp"; render();
    }
  }
  function rwPeerLeft(){
    if(!RW || !RW.online) return;
    clearTimeout(RW._t);
    if(typeof W.flToast === "function") W.flToast("Your opponent disconnected.");
    RW.online = false;
    goHome();
  }
  function maybeRematch(){
    if(RW.rematchMe && RW.rematchOpp){
      var role = RW.role;
      RW.rematchMe = RW.rematchOpp = false;
      W.startDuelsOnline(role);
    }
  }

  /* ── Duels rules modal ── */
  function showRWRules(){
    var el = document.getElementById("rwRulesModal");
    if (el) { el.style.display = ""; return; }
    el = document.createElement("div");
    el.id = "rwRulesModal";
    el.className = "rw-rules-overlay";
    el.innerHTML =
      "<div class='rw-rules-card'>"+
        "<button class='rw-rules-close' id='rwRulesClose' aria-label='Close'>✕</button>"+
        "<div class='rw-rules-kicker'>How to play</div>"+
        "<h3 class='rw-rules-title'>Duels</h3>"+
        "<ol class='rw-rules-list'>"+
          "<li><strong>Pick a pool</strong> — each player independently chooses their squad source (World Cup, Euros, Premier League, La Liga, Serie A, or Bundesliga).</li>"+
          "<li><strong>Build blind</strong> — spin a reel to get a nation or club, then pick a player from that squad. Ratings are hidden the entire time. 3 rerolls each.</li>"+
          "<li><strong>Complete your XI</strong> — fill all 11 positions. The screen locks after each pick so the other player can't peek.</li>"+
          "<li><strong>Head-to-head reveal</strong> — position by position, both ratings are revealed. Higher rated player wins the slot.</li>"+
          "<li><strong>Most slots wins.</strong> Best of 11. Ties stay tied.</li>"+
        "</ol>"+
        "<div class='rw-rules-note'>Strategy tip: mix high-ceiling nations with depth. A 94-rated GK beats anything — but you don't know what you're getting until the reveal.</div>"+
        "<button class='fl-btn rw-rules-ok' id='rwRulesOk'>Got it</button>"+
      "</div>";
    document.querySelector(".wrap") ? document.querySelector(".wrap").appendChild(el) : document.body.appendChild(el);
    function close(){ el.style.display = "none"; }
    document.getElementById("rwRulesClose").onclick = close;
    document.getElementById("rwRulesOk").onclick = close;
    el.addEventListener("click", function(e){ if (e.target === el) close(); });
  }

  function render(){
    var v = view();
    if (RW.phase === "intro")      return renderIntro(v);
    if (RW.phase === "onintro")    return renderOnlineIntro(v);
    if (RW.phase === "poolselect") return renderPoolSelect(v);
    if (RW.phase === "build")      return renderBuild(v);
    if (RW.phase === "onbuild")    return renderBuild(v);
    if (RW.phase === "waitopp")    return renderWaitOpp(v);
    if (RW.phase === "handoff")    return renderHandoff(v);
    if (RW.phase === "reveal")     return renderReveal(v);
    if (RW.phase === "matchnext")  return renderMatchNext(v);
    if (RW.phase === "tournresult") return renderTournResult(v);
    if (RW.phase === "result")     return renderResult(v);
  }

  /* ---------- online: name yourself, then build ---------- */
  function renderOnlineIntro(v){
    var me = RW.players[RW.myIdx], opp = RW.players[RW.oppIdx];
    v.innerHTML =
      "<div class='wrap'><button class='back' id='rwBack'>← Home</button>"+
      "<div class='rw-hero'><div class='rw-kicker'>Online · Duels</div>"+
      "<h2 class='rw-title'><span class='rw-accent'>Duels</span></h2>"+
      "<p class='rw-sub'>You're connected. Build your XI <strong>blind</strong> on your own device — "+
      "when you both lock in, the reveal decides it slot by slot.</p>"+
      "<div class='rw-names'>"+
        "<label class='rw-name-field'><span>Your name</span><input id='rwMyName' class='rw-input' maxlength='14' placeholder='"+esc(me.name)+"' value=''></label>"+
        "<div class='rw-vs-badge'>VS</div>"+
        "<div class='rw-name-field'><span>Opponent</span><div class='rw-input rw-input-static' id='rwOppName'>"+esc(opp.name)+"</div></div>"+
      "</div>"+
      "<div class='mp-online-tag'>Connected — code "+esc((W.ElxiNet&&W.ElxiNet.code)||"")+"</div>"+
      "<button class='fl-btn rw-start' id='rwStart'>Build my XI →</button>"+
      "</div></div>";
    document.getElementById("rwBack").onclick = goHome;
    document.getElementById("rwStart").onclick = function(){
      var nm = (document.getElementById("rwMyName").value.trim()) || me.name;
      RW.players[RW.myIdx].name = nm;
      rwSend({ t:"rw_hello", name:nm });
      RW.cur = RW.myIdx; RW.phase = "onbuild"; render();
    };
  }

  /* ---------- online: waiting for the opponent to lock ---------- */
  function renderWaitOpp(v){
    var opp = RW.players[RW.oppIdx];
    v.innerHTML =
      "<div class='wrap'><div class='rw-handoff'>"+
        "<div class='mp-wait' style='justify-content:center'><span class='mp-spinner'></span>"+
        "<span>Waiting for "+esc(opp.name)+" to lock their XI…</span></div>"+
        "<h2 class='rw-title'>XI locked in</h2>"+
        "<p class='rw-sub'>Your team is sealed. The reveal starts the moment your opponent is ready.</p>"+
        "<button class='btn-ghost' id='rwQuit'>Quit</button>"+
      "</div></div>";
    document.getElementById("rwQuit").onclick = function(){ if(confirm("Quit this online war?")) goHome(); };
  }

  /* ---------- intro: name the two players ---------- */
  function defaultName(i){ return "Player "+(i+1); }
  function renderIntro(v){
    var n = RW.numPlayers;
    var nameFields = "";
    for (var i=0; i<n; i++){
      nameFields += "<label class='rw-name-field'><span>"+defaultName(i)+"</span>"+
        "<input id='rwN"+i+"' class='rw-input' maxlength='14' placeholder='"+defaultName(i)+"' value='"+esc(RW.players[i]?RW.players[i].name:defaultName(i))+"'></label>";
      if (i < n-1 && n===2) nameFields += "<div class='rw-vs-badge'>VS</div>";
    }
    var formatHint = n===3 ? "Round robin · 3 matches" : n===4 ? "Bracket · semi-finals + final" : "Head-to-head · 1 match";
    v.innerHTML =
      "<div class='wrap'><button class='back' id='rwBack'>← Home</button>"+
      "<div class='rw-hero'><div class='rw-kicker'>Multiplayer</div>"+
      "<h2 class='rw-title'><span class='rw-accent'>Duels</span></h2>"+
      "<p class='rw-sub'>Managers build an XI <strong>blind</strong> — no ratings shown. "+
      "Then it's head-to-head: position by position, higher-rated player wins the slot.</p>"+
      "<div class='rw-player-count'><span class='rw-pc-label'>Players</span>"+
        "<div class='rw-pc-btns'>"+
          '<button class="rw-pc-btn'+(n===2?' rw-pc-active':'')+'" data-pc="2">2</button>'+
          '<button class="rw-pc-btn'+(n===3?' rw-pc-active':'')+'" data-pc="3">3</button>'+
          '<button class="rw-pc-btn'+(n===4?' rw-pc-active':'')+'" data-pc="4">4</button>'+
        "</div>"+
        "<span class='rw-pc-hint'>"+esc(formatHint)+"</span>"+
      "</div>"+
      "<div class='rw-names' id='rwNamesWrap'>"+nameFields+"</div>"+
      "<button class='fl-btn rw-start' id='rwStart'>"+esc(RW.players[0]?RW.players[0].name:defaultName(0))+" — build your XI →</button>"+
      "<button class='rw-rules-link' id='rwHowToPlay'>How to play</button>"+
      "</div></div>";
    document.getElementById("rwBack").onclick = goHome;
    document.getElementById("rwHowToPlay").onclick = showRWRules;
    v.querySelectorAll(".rw-pc-btn").forEach(function(btn){
      btn.addEventListener("click", function(){
        var pc = parseInt(btn.getAttribute("data-pc"),10);
        /* Rebuild players array to the new count, preserving existing names */
        var newPlayers = [];
        for (var i=0; i<pc; i++){
          var inp = document.getElementById("rwN"+i);
          var nm = inp ? (inp.value.trim()||defaultName(i)) : defaultName(i);
          newPlayers.push({name:nm, picks:newPicks(), rerollsUsed:0});
        }
        RW.numPlayers = pc; RW.players = newPlayers;
        render();
      });
    });
    document.getElementById("rwStart").onclick = function(){
      for (var i=0; i<n; i++){
        var inp = document.getElementById("rwN"+i);
        RW.players[i].name = inp ? (inp.value.trim()||defaultName(i)) : defaultName(i);
      }
      RW.cur = 0; RW.phase = "poolselect"; render();
    };
  }

  /* ── Available data pools for Duels ── */
  var RW_POOLS = [
    { key:"wc",         label:"World Cup",      hint:"93 nations · 1950–2026",  dataKey:"WORLD_CUP_DATA",   national:true  },
    { key:"euro",       label:"Euros",          hint:"Euros 1980–2024",         dataKey:"EURO_DATA",        national:true  },
    { key:"pl",         label:"Premier League", hint:"PL clubs · 1992–2025",    dataKey:"PL_DATA",          national:false },
    { key:"laliga",     label:"La Liga",        hint:"La Liga · 1987–2024",     dataKey:"LALIGA_DATA",      national:false },
    { key:"seriea",     label:"Serie A",        hint:"Serie A · 1987–2024",     dataKey:"SERIEA_DATA",      national:false },
    { key:"bundesliga", label:"Bundesliga",     hint:"Bundesliga · 1990–2024",  dataKey:"BUNDESLIGA_DATA",  national:false }
  ];

  /* ── Pool select: each player picks their data source before spinning ── */
  function renderPoolSelect(v){
    var P = RW.players[RW.cur];
    var html = "<div class='wrap'><button class='back' id='rwBack'>← Quit</button>"+
      "<div class='rw-build-head'>"+
        "<div class='rw-turn'>"+esc(P.name)+" — pick your squad pool</div>"+
        "<div class='rw-prog-row'><span class='rw-blind'>● ratings hidden during build</span><button class='rw-rules-link rw-rules-inline' id='rwHTP2'>How to play</button></div>"+
      "</div>"+
      "<div class='rw-pool-grid'>";
    RW_POOLS.forEach(function(pool){
      var data = W[pool.dataKey];
      var ok = data && Object.keys(data).length > 0;
      html += '<button class="rw-pool-card'+(ok?"":" rw-pool-disabled")+'" data-rwpool="'+pool.key+'">'+
        '<span class="rw-pool-name">'+esc(pool.label)+'</span>'+
        '<span class="rw-pool-hint">'+esc(pool.hint)+'</span>'+
      '</button>';
    });
    html += "</div></div>";
    v.innerHTML = html;
    document.getElementById("rwBack").onclick = function(){ if(confirm("Quit Duels?")) goHome(); };
    var htp2 = document.getElementById("rwHTP2"); if(htp2) htp2.onclick = showRWRules;
    v.querySelectorAll(".rw-pool-card:not(.rw-pool-disabled)").forEach(function(btn){
      btn.addEventListener("click", function(){
        var key = btn.getAttribute("data-rwpool");
        var pool = null;
        for (var i=0;i<RW_POOLS.length;i++){ if(RW_POOLS[i].key===key){ pool=RW_POOLS[i]; break; } }
        if (!pool) return;
        RW.poolDataCur = W[pool.dataKey] || {};
        RW.poolNationalCur = pool.national;
        RW.poolLabelCur = pool.label;
        RW.currentSpin = null; RW.pendingRWPick = null;
        RW.phase = "build"; render();
      });
    });
  }

  /* ── Position eligibility helpers for RW slot assignment ── */
  var RW_SLOT_FILLS = {
    GK:["GK"], CB:["CB"], RB:["RB"], LB:["LB"], RWB:["RB"], LWB:["LB"],
    CDM:["CDM","CM"], CM:["CM","CDM"], CAM:["CM"], RM:["CM"], LM:["CM"],
    RW:["RW","ST"], LW:["LW","ST"], ST:["ST","RW","LW"]
  };
  var RW_BROAD = {GK:["GK"], DEF:["RB","CB","LB"], MID:["CDM","CM"], FWD:["RW","ST","LW"]};
  function rwEligibleSlots(pl, P){
    var pos = pl.gp || pl.p || "";
    var eligible = [];
    var isBroad = RW_BROAD.hasOwnProperty(pos);
    SLOTS.forEach(function(slot, idx){
      if (P.picks[idx]) return;
      var sk = slot.k.trim();
      var ok = isBroad ? (RW_BROAD[pos]||[]).indexOf(sk) !== -1
                       : (RW_SLOT_FILLS[pos]||[pos]).indexOf(sk) !== -1;
      if (ok) eligible.push(idx);
    });
    return eligible;
  }

  /* ── Reel item helpers (same markup as MP draft) ── */
  function rwCItemHTML(c){ return '<div class="reel-item reel-item-noflag"><span class="name">'+esc(c)+'</span></div>'; }
  function rwYItemHTML(y){ return '<div class="reel-item"><span class="year">'+y+'</span></div>'; }

  /* ── Build phase spin animation ── */
  function initRWStrips(cStrip, yStrip, currentSpin){
    if (!cStrip || !yStrip) return;
    if (currentSpin){
      cStrip.innerHTML = rwCItemHTML(currentSpin.country);
      yStrip.innerHTML = rwYItemHTML(currentSpin.year);
      cStrip.style.cssText = "transform:translateY(0);transition:none";
      yStrip.style.cssText = "transform:translateY(0);transition:none";
      return;
    }
    var DATA = RW.poolDataCur || W.WORLD_CUP_DATA || {}; var countries = Object.keys(DATA);
    var BLUR = 10;
    var ci = [], yi = [];
    for (var k=0; k<BLUR*2+1; k++){
      ci.push(rwCItemHTML(countries[k % Math.max(countries.length,1)] || "—"));
      yi.push(rwYItemHTML(2024 - ((k*2)%30)));
    }
    cStrip.innerHTML = ci.join(""); cStrip.style.cssText = "transform:translateY(0);transition:none";
    yStrip.innerHTML = yi.join(""); yStrip.style.cssText = "transform:translateY(0);transition:none";
  }

  function doRWSpin(cStrip, yStrip, spinBtn, squadPanel, P){
    if (RW._spinning) return;
    var isRespin = !!RW.currentSpin;
    if (isRespin && (P.rerollsUsed||0) >= 3) return;
    var DATA = RW.poolDataCur || W.WORLD_CUP_DATA || {};
    var countries = Object.keys(DATA);
    if (!countries.length) return;

    if (isRespin) P.rerollsUsed = (P.rerollsUsed||0) + 1;
    RW._spinning = true;
    spinBtn.disabled = true;
    spinBtn.textContent = "SPINNING…";
    squadPanel.style.display = "none";
    RW.currentSpin = null; RW.pendingRWPick = null;

    var tries=0, pC, pY, pS;
    do {
      pC = countries[Math.floor(Math.random()*countries.length)];
      var ys = Object.keys(DATA[pC].years || {});
      pY = ys[Math.floor(Math.random()*ys.length)];
      pS = (DATA[pC].years||{})[pY];
      tries++;
    } while (tries<80 && (!pS || pS.length < 5));
    if (!pS || !pS.length){ RW._spinning=false; spinBtn.disabled=false; spinBtn.textContent="SPIN"; return; }

    var BLUR=10, IH=56;
    var ci=[], yi=[];
    for (var i=0; i<BLUR; i++){
      ci.push(rwCItemHTML(countries[i%countries.length]));
      yi.push(rwYItemHTML(2024-i*2));
    }
    ci.push(rwCItemHTML(pC)); yi.push(rwYItemHTML(pY));
    cStrip.innerHTML = ci.join(""); yStrip.innerHTML = yi.join("");
    cStrip.style.cssText = "transform:translateY(0);transition:none";
    yStrip.style.cssText = "transform:translateY(0);transition:none";
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        var ease = "cubic-bezier(0.25,0.1,0.15,1)", dur = 420;
        cStrip.style.transition = "transform "+dur+"ms "+ease;
        cStrip.style.transform  = "translateY(-"+(BLUR*IH)+"px)";
        yStrip.style.transition = "transform "+(dur+40)+"ms "+ease;
        yStrip.style.transform  = "translateY(-"+(BLUR*IH)+"px)";
        setTimeout(function(){
          cStrip.style.cssText = "transform:translateY(0);transition:none";
          cStrip.innerHTML = rwCItemHTML(pC);
          yStrip.style.cssText = "transform:translateY(0);transition:none";
          yStrip.innerHTML = rwYItemHTML(pY);
          RW._spinning = false;
          RW.currentSpin = { country:pC, year:pY, squad:pS };
          /* Update spin button */
          var left = Math.max(0, 3-(P.rerollsUsed||0));
          spinBtn.disabled = (left===0);
          spinBtn.textContent = left===0 ? "No rerolls left — pick!" : "RESPIN ("+left+" left)";
          showRWSquadPanel(squadPanel, RW.currentSpin, P);
        }, dur+80);
      });
    });
  }

  function showRWSquadPanel(panel, spin, P){
    var lineOrder = {GK:0,DEF:1,MID:2,FWD:3};
    var sorted = spin.squad.slice().sort(function(a,b){
      var la = lineOrder[LINE_OF[a.gp||a.p]||"MID"]||2;
      var lb = lineOrder[LINE_OF[b.gp||b.p]||"MID"]||2;
      return la!==lb ? la-lb : (b.r||0)-(a.r||0);
    });

    var html = '<div class="mp-sq-head">'+
      '<span class="mp-sq-title">'+esc(spin.country)+' &middot; '+spin.year+'</span>'+
      '<span class="mp-sq-hint">'+(RW.poolNationalCur?"Nation":"Club")+" · Pick a player — ratings hidden"+'</span>'+
    '</div>';

    /* Position chooser if a player has been tapped */
    if (RW.pendingRWPick){
      var pp = RW.pendingRWPick;
      var eligs = rwEligibleSlots(pp, P);
      html += '<div class="mp-chooser">'+
        '<span class="mp-chooser-q">Where does <strong>'+esc(pp.n)+'</strong> play?</span>'+
        '<div class="mp-chooser-btns">';
      eligs.forEach(function(idx){
        var slot = SLOTS[idx];
        html += '<button class="mp-choose-pos pos '+slot.line+'" data-rwidx="'+idx+'">'+
          esc(slot.k.trim())+'</button>';
      });
      html += '</div><button class="mp-chooser-cancel">Cancel</button></div>';
    }

    /* Squad list — no ratings (ratings hidden for blind build) */
    html += '<div class="players mp-players-grid">';
    sorted.forEach(function(pl){
      var pos = pl.gp||pl.p||"MID", line = LINE_OF[pos]||"MID";
      var noSlot = rwEligibleSlots(pl, P).length===0;
      var isPending = RW.pendingRWPick && RW.pendingRWPick._n===pl.n && RW.pendingRWPick._pos===pos;
      html += '<div class="player'+(noSlot?" noslot":"")+(isPending?" mp-player-pending":"")+'" data-rwn="'+esc(pl.n)+'" data-rwpos="'+esc(pos)+'">'+
        '<span class="pos '+line+'">'+esc(pos)+'</span>'+
        '<span class="pname">'+esc(pl.n)+'</span>'+
        (noSlot ? '<span class="slot-tag">no slot</span>' : '')+
      '</div>';
    });
    html += '</div>';

    panel.innerHTML = html;
    panel.style.display = "";

    /* Wire up position chooser buttons */
    if (RW.pendingRWPick){
      panel.querySelectorAll("[data-rwidx]").forEach(function(btn){
        btn.addEventListener("click", function(){
          var idx = parseInt(btn.getAttribute("data-rwidx"),10);
          var pp = RW.pendingRWPick;
          P.picks[idx] = { n:pp.n, r:pp.r||75, gp:SLOTS[idx].k.trim(), club:spin.country, year:spin.year };
          RW.pendingRWPick = null; RW.currentSpin = null;
          render();
        });
      });
      var cancel = panel.querySelector(".mp-chooser-cancel");
      if (cancel) cancel.addEventListener("click", function(){
        RW.pendingRWPick = null;
        showRWSquadPanel(panel, spin, P);
      });
    } else {
      panel.querySelectorAll(".player:not(.noslot)").forEach(function(el){
        el.addEventListener("click", function(){
          var plName = el.getAttribute("data-rwn");
          var plPos  = el.getAttribute("data-rwpos");
          var pl = sorted.filter(function(p){ return p.n===plName && (p.gp||p.p||"")==plPos; })[0];
          if (!pl) return;
          var slots = rwEligibleSlots(pl, P);
          if (!slots.length) return;
          RW.pendingRWPick = { n:pl.n, r:pl.r||75, gp:pl.gp||pl.p||"MID", _n:pl.n, _pos:plPos };
          showRWSquadPanel(panel, spin, P);
        });
      });
    }
  }

  function renderRWXiListHTML(P){
    var html = '<section class="xi"><div class="xi-head"><h2>Your XI</h2>'+
      '<div><span class="count">'+P.picks.filter(Boolean).length+'/11</span></div></div>'+
      '<div class="xi-list" id="rwXiList">';
    SLOTS.forEach(function(slot, i){
      var pk = P.picks[i], line = slot.line, key = slot.k.trim();
      if (pk){
        html += '<div class="xi-row"><span class="pos '+line+'">'+esc(key)+'</span>'+
          '<span class="info"><span class="pn">'+esc(pk.n)+'</span>'+
          '<span class="meta">'+esc(pk.club||"")+(pk.year?' &middot; '+pk.year:'')+'</span></span></div>';
      } else {
        html += '<div class="xi-row empty"><span class="pos '+line+'">'+esc(key)+'</span>'+
          '<span class="info"><span class="pn slot-empty">'+esc(key)+' — empty</span></span></div>';
      }
    });
    html += '</div></section>';
    return html;
  }

  /* ---------- build (blind): spin wheel picks a squad, player picks without seeing ratings ---------- */
  function renderBuild(v){
    var P = RW.players[RW.cur];
    var filled = P.picks.filter(Boolean).length;
    var rerollsLeft = Math.max(0, 3-(P.rerollsUsed||0));
    var isRespin = !!RW.currentSpin;

    v.innerHTML =
      "<div class='wrap'><button class='back' id='rwBack'>← Quit</button>"+
      "<div class='rw-build-head'>"+
        "<div class='rw-turn'>"+esc(P.name)+" — "+esc(RW.poolLabelCur||"World Cup")+" <span class='rw-blind'>● ratings hidden</span></div>"+
        "<div class='rw-prog-row'>"+
          "<span class='rw-prog'><span id='rwCount'>"+filled+"</span>/11</span>"+
          "<span class='rw-reroll-badge"+(rerollsLeft===0?" rw-reroll-empty":"")+"'>"+
            "Rerolls: "+rerollsLeft+"/3"+
          "</span>"+
        "</div>"+
      "</div>"+
      "<div class='machine'>"+
        "<div class='reels'>"+
          "<div class='reel-box'><div class='reel-label'>"+(RW.poolNationalCur?"Nation":"Club")+"</div>"+
            "<div class='reel'><div class='reel-strip' id='rwCS'></div></div></div>"+
          "<div class='reel-box'><div class='reel-label'>Year</div>"+
            "<div class='reel'><div class='reel-strip' id='rwYS'></div></div></div>"+
        "</div>"+
        "<div class='controls'>"+
          "<button class='spin' id='rwSpinBtn'>"+
            (isRespin ? (rerollsLeft>0 ? "RESPIN ("+rerollsLeft+" left)" : "No rerolls — pick!") : "SPIN")+
          "</button>"+
        "</div>"+
      "</div>"+
      "<section class='squad' id='rwSquadPanel' style='display:none;'></section>"+
      renderRWXiListHTML(P)+
      "<div class='xi-actions'>"+
        "<button class='btn-primary rw-lock-btn' id='rwLock' "+(filled<11?"disabled":"")+">"+
          (RW.online ? "Lock XI — send to "+esc(RW.players[RW.oppIdx].name)
                     : (RW.cur < RW.numPlayers-1 ? "Lock XI — pass to "+esc(RW.players[RW.cur+1].name)+" →"
                                                  : (RW.numPlayers>2 ? "Lock XI — start matches" : "Lock XI — reveal")))+
        "</button>"+
      "</div>"+
      "</div>";

    document.getElementById("rwBack").onclick = function(){ if(confirm("Quit Duels?")) goHome(); };

    var spinBtn = document.getElementById("rwSpinBtn");
    if (isRespin) spinBtn.disabled = (rerollsLeft===0);
    initRWStrips(document.getElementById("rwCS"), document.getElementById("rwYS"), RW.currentSpin);

    spinBtn.addEventListener("click", function(){
      doRWSpin(document.getElementById("rwCS"), document.getElementById("rwYS"),
               spinBtn, document.getElementById("rwSquadPanel"), P);
    });

    if (RW.currentSpin){
      showRWSquadPanel(document.getElementById("rwSquadPanel"), RW.currentSpin, P);
    }

    var lock = document.getElementById("rwLock");
    if (lock) lock.onclick = function(){
      if (P.picks.filter(Boolean).length < 11) return;
      RW.currentSpin = null; RW.pendingRWPick = null;
      if (RW.online){
        RW.myLocked = true;
        rwSend({ t:"rw_xi", name:RW.players[RW.myIdx].name, picks:RW.players[RW.myIdx].picks });
        maybeStartReveal();
        return;
      }
      if (RW.cur < RW.numPlayers - 1){
        RW.cur++; RW.phase = "handoff";
      } else {
        /* All players built — schedule matches */
        RW.matches = buildMatchSchedule(RW.numPlayers);
        RW.matchIdx = 0;
        RW.curA = RW.matches[0].a; RW.curB = RW.matches[0].b;
        RW.phase = "reveal"; RW.revealStep = -1; computeResult();
      }
      render();
    };
  }

  /* ---------- handoff (privacy between players) ---------- */
  function renderHandoff(v){
    var cur = RW.players[RW.cur], prev = RW.players[RW.cur-1];
    var built = RW.cur, total = RW.numPlayers;
    v.innerHTML =
      "<div class='wrap'><div class='rw-handoff'>"+
        "<h2 class='rw-title'>Pass the device</h2>"+
        "<div class='rw-handoff-prog'>"+built+"/"+total+" built</div>"+
        "<p class='rw-sub'><strong>"+esc(cur.name)+"</strong>, it's your turn to build — "+
        esc(prev.name)+"'s XI is locked and hidden. Ratings stay secret until the reveal.</p>"+
        "<button class='fl-btn rw-start' id='rwGo'>I'm "+esc(cur.name)+" — build my XI →</button>"+
      "</div></div>";
    document.getElementById("rwGo").onclick = function(){ RW.phase="poolselect"; render(); };
  }

  /* ---------- result computation ---------- */
  function computeResult(){
    var idxA = RW.curA!=null ? RW.curA : 0;
    var idxB = RW.curB!=null ? RW.curB : 1;
    var s1=0, s2=0, rows=[];
    SLOTS.forEach(function(s,i){
      var a=RW.players[idxA].picks[i], b=RW.players[idxB].picks[i];
      var ra=a?a.r:0, rb=b?b.r:0, win = ra>rb?1:(rb>ra?2:0);
      if(win===1) s1++; else if(win===2) s2++;
      rows.push({slot:s.k.trim(), line:s.line, a:a, b:b, win:win});
    });
    RW.rows = rows; RW.score=[s1,s2];
  }

  /* ---------- reveal: slot by slot, ratings count up ---------- */
  function renderReveal(v){
    var step = RW.revealStep;
    var shown = RW.rows.slice(0, Math.max(0, step+1));
    var s1=0,s2=0; shown.forEach(function(r){ if(r.win===1)s1++; else if(r.win===2)s2++; });
    var done = step >= RW.rows.length-1;
    var cards = shown.slice().reverse().map(function(r){
      var aw = r.win===1, bw = r.win===2;
      return "<div class='rw-rev-row "+(r.win===0?"draw":"")+"'>"+
        "<div class='rw-rev-side "+(aw?"win":"")+"'>"+
          "<span class='rw-rev-name'>"+esc(shortName(r.a?r.a.n:"—"))+"</span>"+
          "<span class='rw-rev-rating"+(r.a?ratingTierClass(r.a.r):"")+"'>"+(r.a?r.a.r:"–")+"</span></div>"+
        "<div class='rw-rev-mid'><span class='pos "+r.line+"'>"+esc(r.slot)+"</span>"+
          (aw?"<span class='rw-rev-arrow l'>◀</span>":bw?"<span class='rw-rev-arrow r'>▶</span>":"<span class='rw-rev-eq'>=</span>")+"</div>"+
        "<div class='rw-rev-side right "+(bw?"win":"")+"'>"+
          "<span class='rw-rev-rating"+(r.b?ratingTierClass(r.b.r):"")+"'>"+(r.b?r.b.r:"–")+"</span>"+
          "<span class='rw-rev-name'>"+esc(shortName(r.b?r.b.n:"—"))+"</span></div>"+
        "</div>";
    }).join("");
    v.innerHTML =
      "<div class='wrap'>"+
      "<div class='rw-scorebar'>"+
        (RW.numPlayers>2 && RW.matches[RW.matchIdx] ? "<div class='rw-match-label'>"+esc(RW.matches[RW.matchIdx].label||"Match "+(RW.matchIdx+1))+"</div>" : "")+
        "<div class='rw-team a'><div class='rw-team-name'>"+esc(RW.players[RW.curA!=null?RW.curA:0].name)+"</div><div class='rw-team-score' id='rwS1'>"+s1+"</div></div>"+
        "<div class='rw-scorebar-vs'>"+(done?"FULL TIME":"WAR")+"</div>"+
        "<div class='rw-team b'><div class='rw-team-score' id='rwS2'>"+s2+"</div><div class='rw-team-name'>"+esc(RW.players[RW.curB!=null?RW.curB:1].name)+"</div></div>"+
      "</div>"+
      "<div class='rw-rev-list'>"+cards+"</div>"+
      "<div class='reveal-bar'>"+(done
        ? "<button class='fl-btn rw-lock' id='rwToResult'>See the verdict →</button>"
        : "<button class='btn-ghost' id='rwSkip'>Skip</button>")+"</div>"+
      "</div>";
    var sk=document.getElementById("rwSkip");
    if(sk) sk.onclick=function(){ clearTimeout(RW._t); RW.revealStep=RW.rows.length-1; renderReveal(v); };
    var tr=document.getElementById("rwToResult");
    if(tr) tr.onclick=function(){ RW.phase="result"; if(W.scrollTo)W.scrollTo(0,0); render(); };
    if(!done){ clearTimeout(RW._t); RW._t=setTimeout(function(){ RW.revealStep++; renderReveal(v); }, 900); }
  }

  /* ---------- result ---------- */
  function renderResult(v){
    var idxA = RW.curA!=null ? RW.curA : 0;
    var idxB = RW.curB!=null ? RW.curB : 1;
    var s1=RW.score[0], s2=RW.score[1];
    function nm(i){ return esc(RW.players[i].name) + (RW.online && i===RW.myIdx ? " <span class='rw-you'>(you)</span>" : ""); }
    var winnerIdx = s1>s2?idxA : s2>s1?idxB : -1;
    var isTourn = RW.numPlayers > 2;
    var matchLabel = isTourn && RW.matches[RW.matchIdx] ? RW.matches[RW.matchIdx].label : null;
    var title;
    if (winnerIdx === -1) title = matchLabel ? matchLabel+" — draw" : "It's a stalemate";
    else if (RW.online) title = (winnerIdx===RW.myIdx ? "You win the duel" : esc(RW.players[winnerIdx].name)+" wins the duel");
    else title = esc(RW.players[winnerIdx].name)+(isTourn ? " wins "+(matchLabel||"the match") : " wins the duel");
    var emoji = winnerIdx>=0 ? "🏆" : "";
    var best = RW.rows.slice().filter(function(r){return r.a&&r.b;}).sort(function(x,y){
      return (Math.max(y.a.r,y.b.r)) - (Math.max(x.a.r,x.b.r)); })[0];
    var moreMatches = isTourn && (RW.matchIdx < RW.matches.length - 1 ||
      (RW.numPlayers===4 && RW.matchIdx < 1)); /* 4-player: final/3rd added dynamically */
    var nextMatch = isTourn ? RW.matches[RW.matchIdx+1] : null;
    var nextLabel = nextMatch ? (nextMatch.label || "Match "+(RW.matchIdx+2)) : "";
    var rematchLabel = RW.online ? (RW.rematchMe ? "Waiting for rematch…" : "Rematch") : "Rematch";
    var btns = isTourn
      ? "<button class='fl-btn' id='rwNext'>"+esc(nextLabel ? nextLabel+" →" : "See standings →")+"</button>"+
        "<button class='btn-ghost' id='rwHome'>Home</button>"
      : "<button class='fl-btn' id='rwAgain' "+(RW.online&&RW.rematchMe?"disabled":"")+">"+rematchLabel+"</button>"+
        "<button class='btn-ghost' id='rwHome'>Home</button>";
    v.innerHTML =
      "<div class='wrap'>"+
      "<div class='rw-result-card'>"+
        (matchLabel ? "<div class='rw-result-matchlabel'>"+esc(matchLabel)+"</div>" : "")+
        "<div class='rw-result-emoji'>"+emoji+"</div>"+
        "<div class='rw-result-score'>"+s1+" <span>–</span> "+s2+"</div>"+
        "<h2 class='rw-title'>"+title+"</h2>"+
        "<p class='rw-sub'>"+nm(idxA)+" "+s1+" · "+nm(idxB)+" "+s2+
          (best?" &middot; star slot: "+esc(best.slot)+" ("+esc(shortName(best[best.a.r>=best.b.r?'a':'b'].n))+" "+Math.max(best.a.r,best.b.r)+")":"")+"</p>"+
        "<div class='rw-result-btns'>"+btns+"</div>"+
      "</div></div>";
    var nxt=document.getElementById("rwNext");
    if(nxt) nxt.onclick = function(){ advanceMatch(); };
    var ag=document.getElementById("rwAgain");
    if(ag) ag.onclick = function(){
      if (RW.online){
        RW.rematchMe = true; rwSend({ t:"rw_rematch" });
        if (typeof W.flToast === "function") W.flToast("Rematch requested…");
        maybeRematch(); render();
      } else { W.startDuels(); }
    };
    document.getElementById("rwHome").onclick = goHome;
    if (winnerIdx>=0 && typeof W.triggerConfetti === "function") W.triggerConfetti();
  }

  /* ---------- match-next transition (tournament) ---------- */
  function renderMatchNext(v){
    var m = RW.matches[RW.matchIdx];
    var pA = RW.players[m.a], pB = RW.players[m.b];
    v.innerHTML =
      "<div class='wrap'><div class='rw-handoff'>"+
        "<div class='rw-kicker'>"+esc(m.label||"Next match")+"</div>"+
        "<h2 class='rw-title'>Next up</h2>"+
        "<div class='rw-matchup'>"+
          "<span class='rw-mu-name'>"+esc(pA.name)+"</span>"+
          "<span class='rw-mu-vs'>VS</span>"+
          "<span class='rw-mu-name'>"+esc(pB.name)+"</span>"+
        "</div>"+
        "<button class='fl-btn rw-start' id='rwGoMatch'>Start match →</button>"+
      "</div></div>";
    document.getElementById("rwGoMatch").onclick = function(){
      RW.curA = m.a; RW.curB = m.b;
      RW.phase = "reveal"; RW.revealStep = -1; computeResult(); render();
    };
  }

  /* ---------- tournament final standings ---------- */
  function renderTournResult(v){
    /* Compute standings from matchResults */
    var pts = {}, gd = {}, gf = {};
    RW.players.forEach(function(_,i){ pts[i]=0; gd[i]=0; gf[i]=0; });
    RW.matchResults.forEach(function(r){
      var sa=r.score[0], sb=r.score[1];
      gf[r.a]+=sa; gf[r.b]+=sb; gd[r.a]+=(sa-sb); gd[r.b]+=(sb-sa);
      if(sa>sb){ pts[r.a]+=3; }
      else if(sb>sa){ pts[r.b]+=3; }
      else { pts[r.a]+=1; pts[r.b]+=1; }
    });
    var order = Object.keys(pts).map(Number).sort(function(a,b){
      return pts[b]-pts[a] || gd[b]-gd[a] || gf[b]-gf[a];
    });
    var places = ["1st","2nd","3rd","4th"];
    /* For 4-player bracket, use matchResults to determine final order */
    if (RW.numPlayers===4){
      var finalRes = RW.matchResults[RW.matchResults.length-1]; /* Final */
      var thirdRes = RW.matchResults[RW.matchResults.length-2]; /* 3rd place play-off */
      var first = matchWinner(finalRes);  if(first===-1) first=finalRes.a;
      var second = first===finalRes.a ? finalRes.b : finalRes.a;
      var third = matchWinner(thirdRes);  if(third===-1) third=thirdRes.a;
      var fourth = third===thirdRes.a ? thirdRes.b : thirdRes.a;
      order = [first, second, third, fourth];
    }
    var rows = order.map(function(i, rank){
      return "<div class='rw-tourn-row "+(rank===0?"rw-tourn-winner":"")+"'>"+
        "<span class='rw-tourn-rank'>"+places[rank]+"</span>"+
        "<span class='rw-tourn-name'>"+esc(RW.players[i].name)+"</span>"+
        (RW.numPlayers===3 ? "<span class='rw-tourn-pts'>"+pts[i]+" pts</span><span class='rw-tourn-gd'>"+(gd[i]>0?"+":"")+gd[i]+" GD</span>" : "")+
      "</div>";
    }).join("");
    var champ = RW.players[order[0]].name;
    v.innerHTML =
      "<div class='wrap'>"+
      "<div class='rw-result-card'>"+
        "<div class='rw-result-emoji'>🏆</div>"+
        "<h2 class='rw-title'>"+esc(champ)+"</h2>"+
        "<div class='rw-kicker'>"+(RW.numPlayers===3?"Round Robin Champion":"Tournament Champion")+"</div>"+
        "<div class='rw-tourn-table'>"+rows+"</div>"+
        "<div class='rw-result-btns'>"+
          "<button class='fl-btn' id='rwAgain'>Play again</button>"+
          "<button class='btn-ghost' id='rwHome'>Home</button>"+
        "</div>"+
      "</div></div>";
    document.getElementById("rwAgain").onclick = function(){ W.startDuels(); };
    document.getElementById("rwHome").onclick = goHome;
    if (typeof W.triggerConfetti === "function") W.triggerConfetti();
  }
})(window);
