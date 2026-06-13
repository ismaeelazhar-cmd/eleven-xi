/* ratingswar.js — Eleven XI · "Duels" mode.
 * Two players build an XI BLIND (ratings never rendered during build),
 * then a head-to-head position-by-position reveal decides each slot.
 * Self-contained; wired from the home card via window.startDuels(). */
(function (W) {
  "use strict";

  var LINE_OF = { GK:"GK", CB:"DEF",RB:"DEF",LB:"DEF",RWB:"DEF",LWB:"DEF",
    CDM:"MID",CM:"MID",CAM:"MID",RM:"MID",LM:"MID", RW:"FWD",LW:"FWD",ST:"FWD" };
  /* Formation Draft: slot indices 0=GK,1=RB,2=CB,3=CB,4=LB,5=CDM,6=CM,7=CM,8=RW,9=ST,10=LW */
  var RW_FORMATIONS = [
    { name:"4-3-3",   style:"Attacking",  bonusIdx:[8,9,10],  hint:"RW · ST · LW" },
    { name:"5-3-2",   style:"Defensive",  bonusIdx:[1,2,3,4], hint:"RB · CB · CB · LB" },
    { name:"4-2-3-1", style:"Possession", bonusIdx:[5,6,7],   hint:"CDM · CM · CM" },
    { name:"4-4-2",   style:"Balanced",   bonusIdx:[2,3,6,9], hint:"CB · CB · CM · ST" },
    { name:"3-5-2",   style:"Wide",       bonusIdx:[1,4,6,9], hint:"RB · LB · CM · ST" },
    { name:"4-1-4-1", style:"Counter",    bonusIdx:[5,8,9,10],hint:"CDM · RW · ST · LW" }
  ];
  /* fixed shared XI so both squads compare slot-for-slot */
  var SLOTS = [
    {k:"GK",  line:"GK"},
    {k:"RB",  line:"DEF"}, {k:"CB", line:"DEF"}, {k:"CB",  line:"DEF"}, {k:"LB", line:"DEF"},
    {k:"CDM", line:"MID"}, {k:"CM", line:"MID"}, {k:"CM",  line:"MID"},
    {k:"RW",  line:"FWD"}, {k:"ST", line:"FWD"}, {k:"LW",  line:"FWD"}
  ];
  var POOL = null, RW = null;

  function esc(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function rnd(a){ return a[Math.floor(Math.random()*a.length)]; }
  function shortName(n){ var p=String(n).split(" "); return p.length>1?p[p.length-1]:n; }
  function ratingTierClass(r){ if(!r) return ""; return r>=90?" r-gold":r>=85?" r-elite":r>=80?" r-great":r>=75?" r-good":r>=70?" r-amber":r>=60?" r-orange":" r-red"; }

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

  /* ── Feature definitions (house rule toggles — posBan, bestOf3, asyncOnline removed) ── */
  var DUEL_FEATURES = [
    { key:"xfactor",       label:"X-Factor Slot",        desc:"One random position is secretly chosen as the X-Factor. Winning that slot counts double." },
    { key:"captain",       label:"Captain",               desc:"Each player designates one position as Captain before building. Winning your Captain's slot earns +2 bonus points." },
    { key:"steal",         label:"Steal Power-Up",        desc:"Once per match, after the reveal starts, you may steal your opponent's highest-rated revealed player into your XI." },
    { key:"blindSwap",     label:"Blind Swap",            desc:"After locking your XI, you have 30 seconds to secretly swap any two positions before the reveal begins." },
    { key:"wildcard",      label:"Wildcard Spin",         desc:"Each player gets one bonus spin from the entire global pool — any nation, any era, any position." },
    { key:"sharedPool",    label:"Draft from Shared Pool",desc:"Both players draft from the same displayed pool in alternating pick order. No duplicate players." },
    { key:"formationDraft",label:"Formation Draft",       desc:"Before the reveal, each player secretly picks a formation. Your formation sets which positions get a tactical bonus." }
  ];

  var DEFAULT_FEATURES = { xfactor:false, captain:false, steal:false, blindSwap:false, wildcard:false, sharedPool:false, formationDraft:false };

  /* ── D-1: Feature presets ────────────────────────────────────────── */
  var DUEL_PRESETS = [
    { id:"quick",    label:"Quick",    desc:"Just the essentials",
      f:{ captain:true, xfactor:false, steal:false, blindSwap:false, wildcard:false, sharedPool:false, formationDraft:false } },
    { id:"standard", label:"Standard", desc:"Balanced house rules",
      f:{ captain:true, xfactor:true, steal:false, blindSwap:false, wildcard:true, sharedPool:true, formationDraft:false } },
    { id:"full",     label:"Full Rules", desc:"All features on",
      f:{ captain:true, xfactor:true, steal:true, blindSwap:true, wildcard:true, sharedPool:true, formationDraft:true } }
  ];
  function activePresetId(){
    for(var i=0;i<DUEL_PRESETS.length;i++){
      var p=DUEL_PRESETS[i]; var match=true;
      for(var k in DEFAULT_FEATURES){ if((!!RW.features[k]) !== (!!p.f[k])){ match=false; break; } }
      if(match) return p.id;
    }
    return null;
  }

  /* ── D-3: Bo3 series persistence ────────────────────────────────── */
  var DUEL_SERIES_KEY = "wcxi_duel_series";
  var DUEL_SERIES_TTL = 4 * 60 * 60 * 1000; // 4 hours
  function _saveDuelSeries(){
    if(!RW || !RW.features || !RW.features.bestOf3 || RW.numPlayers !== 2) return;
    var state = { ts: Date.now(), features: Object.assign({}, RW.features),
      numPlayers: RW.numPlayers,
      players: RW.players.map(function(p){ return { name: p.name }; }),
      matchResults: (RW.matchResults||[]).slice(),
      seriesMatch: RW.seriesMatch||0,
      captains: (RW.captains||[]).slice(),
      bannedSlots: (RW.bannedSlots||[]).slice() };
    try{ localStorage.setItem(DUEL_SERIES_KEY, JSON.stringify(state)); }catch(e){}
  }
  function _loadDuelSeries(){
    try{
      var s = JSON.parse(localStorage.getItem(DUEL_SERIES_KEY)||"null");
      if(!s) return null;
      if(Date.now() - (s.ts||0) > DUEL_SERIES_TTL){ localStorage.removeItem(DUEL_SERIES_KEY); return null; }
      return s;
    }catch(e){ return null; }
  }
  function _clearDuelSeries(){ try{ localStorage.removeItem(DUEL_SERIES_KEY); }catch(e){} }

  /* ── D-4: Duel result history ────────────────────────────────────── */
  var DUEL_HISTORY_KEY = "wcxi_duel_history";
  function _saveDuelHistory(entry){
    var hist = [];
    try{ hist = JSON.parse(localStorage.getItem(DUEL_HISTORY_KEY)||"[]"); }catch(e){}
    if(!Array.isArray(hist)) hist = [];
    hist.unshift(entry);
    if(hist.length > 5) hist = hist.slice(0,5);
    try{ localStorage.setItem(DUEL_HISTORY_KEY, JSON.stringify(hist)); }catch(e){}
  }
  function _loadDuelHistory(){
    try{ return JSON.parse(localStorage.getItem(DUEL_HISTORY_KEY)||"[]"); }catch(e){ return []; }
  }

  W.startDuels = function(){
    /* Intercept async challenge URL */
    if (checkAndLoadAsyncChallenge()){ hideOthers(); view().style.display=""; if(W.scrollTo) W.scrollTo(0,0); render(); return; }
    RW = {
      phase:"intro", cur:0, revealStep:-1,
      numPlayers:2, curA:0, curB:1,
      matches:[], matchIdx:0, matchResults:[],
      currentSpin:null, pendingRWPick:null, _spinning:false,
      features: Object.assign({}, DEFAULT_FEATURES),
      xfactorSlot: null,
      captains: [],
      bannedSlots: [],
      swapDone: [],
      seriesWins: [],
      seriesMatch: 0,
      seriesMode: "1",   /* "1" = single match, "bo3" = best of 3 */
      poolKey: "wc",     /* chosen on intro page, shared by all players */
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
    /* Apply pool chosen in the multiplayer lobby (host settings screen) */
    var mpSt = W._mpSt; // reference to multiplayer state object
    if (mpSt && mpSt._guestPoolDataKey && W[mpSt._guestPoolDataKey]){
      RW_POOLS.forEach(function(p){ if(p.dataKey===mpSt._guestPoolDataKey){
        var chosenPool = p;
        /* will be applied below after RW is initialized */
        W._pendingOnlinePool = chosenPool;
      }});
    }
    RW = {
      online:true, role:role, myIdx:myIdx, oppIdx:oppIdx,
      phase:"onintro", cur:myIdx, revealStep:-1,
      myLocked:false, oppPicks:null, oppName:null, rematchMe:false, rematchOpp:false,
      currentSpin:null, pendingRWPick:null, _spinning:false,
      features: Object.assign({}, DEFAULT_FEATURES),
      players:[ {name:"Host", picks:newPicks(), rerollsUsed:0}, {name:"Guest", picks:newPicks(), rerollsUsed:0} ]
    };
    if (W._pendingOnlinePool){
      var op = W._pendingOnlinePool;
      RW.poolDataCur = W[op.dataKey] || {};
      RW.poolNationalCur = op.national;
      RW.poolLabelCur = op.label;
      RW._asyncPoolKey = op.key;
      W._pendingOnlinePool = null;
    }
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
    if (RW.phase === "intro")        return renderIntro(v);
    if (RW.phase === "onintro")      return renderOnlineIntro(v);
    if (RW.phase === "posban")       return renderPosBan(v);
    if (RW.phase === "captain")      return renderCaptain(v);
    if (RW.phase === "poolselect")   return renderPoolSelect(v);
    if (RW.phase === "build")        return renderBuild(v);
    if (RW.phase === "onbuild")      return renderBuild(v);
    if (RW.phase === "blindswap")    return renderBlindSwap(v);
    if (RW.phase === "formation")    return renderFormationDraft(v);
    if (RW.phase === "sharedpick")   return renderSharedPick(v);
    if (RW.phase === "asyncshare")   return renderAsyncShare(v);
    if (RW.phase === "asyncaccept")  return renderAsyncAccept(v);
    if (RW.phase === "waitopp")      return renderWaitOpp(v);
    if (RW.phase === "handoff")      return renderHandoff(v);
    if (RW.phase === "reveal")       return renderReveal(v);
    if (RW.phase === "matchnext")    return renderMatchNext(v);
    if (RW.phase === "tournresult")  return renderTournResult(v);
    if (RW.phase === "result")       return renderResult(v);
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

    /* D-1: Preset buttons */
    var activePreset = activePresetId();
    var presetsHTML = "<div class='rw-presets'>";
    DUEL_PRESETS.forEach(function(p){
      presetsHTML += "<button class='rw-preset-btn"+(activePreset===p.id?" rw-preset-active":"")+"' data-preset='"+p.id+"'>"+
        "<span class='rw-preset-label'>"+esc(p.label)+"</span>"+
        "<span class='rw-preset-desc'>"+esc(p.desc)+"</span>"+
        "</button>";
    });
    presetsHTML += "</div>";

    var featHTML = "<div class='rw-features'>"+presetsHTML+"<div class='rw-feat-title'>House rules <span class='rw-feat-sub'>all off by default</span></div>";
    DUEL_FEATURES.forEach(function(f){
      var on = RW.features[f.key];
      featHTML += "<div class='rw-feat-row' data-fkey='"+f.key+"'>"+
        "<span class='rw-feat-label'>"+esc(f.label)+"</span>"+
        "<span class='rw-feat-info' data-tip='"+esc(f.desc)+"' tabindex='0' role='button' aria-label='Info about "+esc(f.label)+"'>ⓘ<span class='rw-tip'>"+esc(f.desc)+"</span></span>"+
        "<button class='rw-feat-toggle"+(on?" rw-feat-on":"")+"' data-fkey='"+f.key+"' aria-pressed='"+(on?"true":"false")+"' aria-label='"+esc(f.label)+(on?" on":" off")+"'>"+
          "<span class='rw-feat-knob'></span>"+
        "</button>"+
      "</div>";
    });
    featHTML += "</div>";

    /* D-3: Series resume banner */
    var savedSeries = _loadDuelSeries();
    var resumeHTML = "";
    if(savedSeries && savedSeries.numPlayers === 2){
      var sw0 = 0, sw1 = 0;
      (savedSeries.matchResults||[]).forEach(function(r){
        if((r.score[0]||0) > (r.score[1]||0)) sw0++; else if((r.score[1]||0) > (r.score[0]||0)) sw1++; else { sw0+=0.5; sw1+=0.5; }
      });
      var p0 = (savedSeries.players[0]||{}).name||"Player 1";
      var p1 = (savedSeries.players[1]||{}).name||"Player 2";
      resumeHTML = "<div class='rw-resume-banner'>"+
        "<div class='rw-resume-label'>Series in progress</div>"+
        "<div class='rw-resume-score'>"+esc(p0)+" "+sw0+" – "+sw1+" "+esc(p1)+"</div>"+
        "<div class='rw-resume-hint'>Match "+(savedSeries.matchResults.length+1)+" of 3</div>"+
        "<div class='rw-resume-btns'>"+
          "<button class='fl-btn rw-resume-btn' id='rwResumeSeries'>Resume →</button>"+
          "<button class='btn-ghost rw-discard-btn' id='rwDiscardSeries'>Discard</button>"+
        "</div>"+
      "</div>";
    }

    /* D-4: History */
    var hist = _loadDuelHistory();
    var histHTML = "";
    if(hist.length > 0){
      histHTML = "<div class='rw-duel-history'><div class='rw-hist-head'>Recent Duels</div>";
      hist.forEach(function(e){
        var d = e.ts ? new Date(e.ts) : null;
        var ds = d ? (d.getDate()+"/"+(d.getMonth()+1)+"/"+(d.getFullYear()+"").slice(-2)) : "";
        histHTML += "<div class='rw-hist-row'>"+
          "<span class='rw-hist-winner'>"+esc(e.winner||"—")+"</span>"+
          "<span class='rw-hist-vs'>vs "+esc(e.loser||"—")+"</span>"+
          "<span class='rw-hist-score'>"+esc(e.score||"")+"</span>"+
          (ds?"<span class='rw-hist-date'>"+ds+"</span>":"")+
        "</div>";
      });
      histHTML += "</div>";
    }

    /* ── Pool selection HTML ── */
    var poolHTML = "<div class='rw-section'><div class='rw-section-label'>Player Pool</div><div class='rw-pool-grid rw-pool-grid-sm'>";
    RW_POOLS.forEach(function(pool){
      var ok = W[pool.dataKey] && Object.keys(W[pool.dataKey]).length > 0;
      poolHTML += '<button class="rw-pool-card'+(ok?"":" rw-pool-disabled")+(pool.key===(RW.poolKey||"wc")?" rw-pool-selected":"")+(ok?"":" rw-pool-disabled")+'" data-rwpool-intro="'+pool.key+'">'+
        '<span class="rw-pool-name">'+esc(pool.label)+'</span>'+
        '<span class="rw-pool-hint">'+esc(pool.hint)+'</span>'+
      '</button>';
    });
    poolHTML += "</div></div>";

    /* ── Series / format HTML ── */
    var seriesMode = RW.seriesMode || "1";
    var seriesHTML = "<div class='rw-section'><div class='rw-section-label'>Format</div>"+
      "<div class='rw-pc-btns'>"+
        '<button class="rw-pc-btn'+(seriesMode==="1"?" rw-pc-active":"")+'" data-series="1">1 Match</button>'+
        '<button class="rw-pc-btn'+(seriesMode==="bo3"?" rw-pc-active":"")+'" data-series="bo3">Best of 3</button>'+
      "</div></div>";

    v.innerHTML =
      "<div class='wrap'><button class='back' id='rwBack'>← Home</button>"+
      "<div class='rw-hero'><div class='rw-kicker'>Multiplayer</div>"+
      "<h2 class='rw-title'><span class='rw-accent'>Duels</span></h2>"+
      "<p class='rw-sub'>Managers build an XI <strong>blind</strong> — no ratings shown. "+
      "Then it's head-to-head: position by position, higher-rated player wins the slot.</p>"+
      resumeHTML+
      "<div class='rw-section'><div class='rw-section-label'>Players</div>"+
        "<div class='rw-pc-btns'>"+
          '<button class="rw-pc-btn'+(n===2?' rw-pc-active':'')+'" data-pc="2">2</button>'+
          '<button class="rw-pc-btn'+(n===3?' rw-pc-active':'')+'" data-pc="3">3</button>'+
          '<button class="rw-pc-btn'+(n===4?' rw-pc-active':'')+'" data-pc="4">4</button>'+
        "</div>"+
        "<span class='rw-pc-hint'>"+esc(formatHint)+"</span>"+
      "</div>"+
      "<div class='rw-names' id='rwNamesWrap'>"+nameFields+"</div>"+
      poolHTML+
      seriesHTML+
      featHTML+
      "<button class='fl-btn rw-start' id='rwStart'>"+esc(RW.players[0]?RW.players[0].name:defaultName(0))+" — build your XI →</button>"+
      "<button class='rw-rules-link' id='rwHowToPlay'>How to play</button>"+
      histHTML+
      "</div></div>";
    document.getElementById("rwBack").onclick = goHome;
    document.getElementById("rwHowToPlay").onclick = showRWRules;

    /* Player count buttons */
    v.querySelectorAll("[data-pc]").forEach(function(btn){
      btn.addEventListener("click", function(){
        var pc = parseInt(btn.getAttribute("data-pc"),10);
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

    /* Pool selection */
    v.querySelectorAll("[data-rwpool-intro]").forEach(function(btn){
      btn.addEventListener("click", function(){
        if(btn.classList.contains("rw-pool-disabled")) return;
        var key = btn.getAttribute("data-rwpool-intro");
        RW.poolKey = key;
        v.querySelectorAll("[data-rwpool-intro]").forEach(function(b){ b.classList.remove("rw-pool-selected"); });
        btn.classList.add("rw-pool-selected");
      });
    });

    /* Series format buttons */
    v.querySelectorAll("[data-series]").forEach(function(btn){
      btn.addEventListener("click", function(){
        RW.seriesMode = btn.getAttribute("data-series");
        v.querySelectorAll("[data-series]").forEach(function(b){ b.classList.remove("rw-pc-active"); });
        btn.classList.add("rw-pc-active");
      });
    });

    /* Feature toggles */
    v.querySelectorAll(".rw-feat-toggle").forEach(function(btn){
      btn.addEventListener("click", function(){
        var fk = btn.getAttribute("data-fkey");
        RW.features[fk] = !RW.features[fk];
        btn.classList.toggle("rw-feat-on", RW.features[fk]);
        btn.setAttribute("aria-pressed", RW.features[fk] ? "true" : "false");
        btn.setAttribute("aria-label", btn.closest(".rw-feat-row").querySelector(".rw-feat-label").textContent + (RW.features[fk] ? " on" : " off"));
      });
    });
    v.querySelectorAll(".rw-feat-info").forEach(function(el){
      el.addEventListener("mouseenter", function(){ el.classList.add("rw-tip-show"); });
      el.addEventListener("mouseleave", function(){ el.classList.remove("rw-tip-show"); });
      el.addEventListener("focus",      function(){ el.classList.add("rw-tip-show"); });
      el.addEventListener("blur",       function(){ el.classList.remove("rw-tip-show"); });
      el.addEventListener("click",      function(){ el.classList.toggle("rw-tip-show"); });
    });
    document.addEventListener("click", function handler(e){
      if (!e.target.closest(".rw-feat-info")){ v.querySelectorAll(".rw-tip-show").forEach(function(el){ el.classList.remove("rw-tip-show"); }); }
    }, { capture:true, once:false });

    /* Start: apply pool from intro selection, skip individual pool select */
    document.getElementById("rwStart").onclick = function(){
      for (var i=0; i<n; i++){
        var inp = document.getElementById("rwN"+i);
        if(RW.players[i]) RW.players[i].name = inp ? (inp.value.trim()||defaultName(i)) : defaultName(i);
      }
      /* Apply selected pool globally */
      var chosenKey = RW.poolKey || "wc";
      var pool = null;
      for(var pi=0;pi<RW_POOLS.length;pi++){ if(RW_POOLS[pi].key===chosenKey){ pool=RW_POOLS[pi]; break; } }
      if(pool){
        RW.poolDataCur = W[pool.dataKey] || {};
        RW.poolNationalCur = pool.national;
        RW.poolLabelCur = pool.label;
        RW._asyncPoolKey = pool.key;
      }
      _clearDuelSeries();
      initFeatures();
      RW.cur = 0;
      /* bestOf3 now driven by seriesMode */
      if(RW.seriesMode === "bo3"){ RW.features.bestOf3 = true; RW.seriesWins=[0,0]; RW.seriesMatch=0; }
      else { RW.features.bestOf3 = false; }
      if (RW.features.captain){ RW.phase = "captain"; }
      else if (RW.features.sharedPool && !RW.online){
        RW.sharedPool = generateSharedPool(RW.poolDataCur);
        RW.sharedPicked = {}; RW.sharedPickTurn = 0; RW.sharedPendingPick = null;
        RW.phase = "sharedpick";
      } else { RW.phase = "build"; }
      render();
    };

    /* D-1: Preset buttons */
    v.querySelectorAll(".rw-preset-btn").forEach(function(btn){
      btn.addEventListener("click",function(){
        var pid = btn.getAttribute("data-preset");
        var preset = DUEL_PRESETS.filter(function(p){ return p.id===pid; })[0];
        if(!preset) return;
        RW.features = Object.assign({}, preset.f);
        render();
      });
    });

    /* D-3: Resume/Discard series buttons */
    var resumeBtn = document.getElementById("rwResumeSeries");
    if(resumeBtn) resumeBtn.addEventListener("click",function(){
      var s = _loadDuelSeries();
      if(!s) return;
      RW.features = Object.assign({}, DEFAULT_FEATURES, s.features||{});
      RW.numPlayers = 2;
      RW.players = (s.players||[]).map(function(p,i){ return { name:p.name||defaultName(i), picks:newPicks(), rerollsUsed:0 }; });
      RW.matchResults = (s.matchResults||[]).slice();
      RW.seriesMatch = s.seriesMatch||0;
      RW.captains = (s.captains||[]).slice();
      RW.bannedSlots = (s.bannedSlots||[]).slice();
      RW.seriesWins = [0,0];
      RW.xfactorSlot = RW.features.xfactor ? Math.floor(Math.random()*SLOTS.length) : null;
      RW.swapDone = RW.players.map(function(){ return false; });
      RW.captainPassing = false; RW.blindSwapPassing = false;
      RW.swapSel = null; RW._swapTimerInterval = null; RW.swapTimeLeft = 30;
      RW.sharedPool = null; RW.sharedPicked = {}; RW.sharedPickTurn = 0; RW.sharedPendingPick = null;
      RW.formations = RW.players.map(function(){ return null; }); RW.formationPassing = false;
      RW.stealUsed = RW.players.map(function(){ return false; });
      RW.wildcardUsed = false; RW._savedToBoard = false;
      RW.currentSpin = null; RW.pendingRWPick = null; RW._spinning = false;
      RW.cur = 0;
      RW.phase = "build";
      render();
    });
    var discardBtn = document.getElementById("rwDiscardSeries");
    if(discardBtn) discardBtn.addEventListener("click",function(){ _clearDuelSeries(); render(); });
  }

  /* ── Initialise enabled features when a match starts ── */
  function initFeatures(){
    var f = RW.features;
    RW.xfactorSlot = f.xfactor ? Math.floor(Math.random() * SLOTS.length) : null;
    RW.captains = RW.players.map(function(){ return null; });
    RW.bannedSlots = RW.players.map(function(){ return null; }); /* kept for compat even though posBan removed */
    RW.swapDone = RW.players.map(function(){ return false; });
    RW.posBanPassing = false;
    RW.captainPassing = false;
    RW.blindSwapPassing = false;
    RW.swapSel = null;
    RW._swapTimerInterval = null;
    RW.swapTimeLeft = 30;
    RW.sharedPool = null;
    RW.sharedPicked = {};
    RW.sharedPickTurn = 0;
    RW.sharedPendingPick = null;
    RW.formations = RW.players.map(function(){ return null; });
    RW.formationPassing = false;
    RW.stealUsed = RW.players.map(function(){ return false; });
    if (f.bestOf3 && RW.numPlayers === 2){
      RW.seriesWins = [0, 0]; RW.seriesMatch = 0;
    }
  }

  /* ── Available data pools for Duels ── */
  var RW_POOLS = W.RW_POOLS = [
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
        "<div class='rw-prog-row'><button class='rw-rules-link rw-rules-inline' id='rwHTP2'>How to play</button></div>"+
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
        RW._asyncPoolKey = pool.key;
        RW.currentSpin = null; RW.pendingRWPick = null;
        if (RW.features.sharedPool && !RW.online){
          RW.sharedPool = generateSharedPool(RW.poolDataCur);
          RW.sharedPicked = {}; RW.sharedPickTurn = 0; RW.sharedPendingPick = null;
          RW.phase = "sharedpick";
        } else {
          RW.phase = "build";
        }
        render();
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

    /* Weighted random: bigger nations (more years) are more likely */
    var weights = [], totalW = 0;
    countries.forEach(function(c){ var w = Object.keys(DATA[c].years||{}).length||1; weights.push(w); totalW+=w; });
    var tries=0, pC, pY, pS;
    do {
      var rnd = Math.random()*totalW, cum = 0, idx = 0;
      for (var wi=0; wi<weights.length; wi++){ cum+=weights[wi]; if(rnd<=cum){ idx=wi; break; } }
      pC = countries[idx];
      var ys = Object.keys(DATA[pC].years || {});
      pY = ys[Math.floor(Math.random()*ys.length)];
      pS = (DATA[pC].years||{})[pY];
      tries++;
    } while (tries<80 && (!pS || pS.length < 5));
    if (!pS || !pS.length){ RW._spinning=false; spinBtn.disabled=false; spinBtn.textContent="SPIN"; return; }

    var BLUR=10;
    var ci=[], yi=[];
    for (var i=0; i<BLUR; i++){
      ci.push(rwCItemHTML(countries[i%countries.length]));
      yi.push(rwYItemHTML(2024-i*2));
    }
    ci.push(rwCItemHTML(pC)); yi.push(rwYItemHTML(pY));
    cStrip.innerHTML = ci.join(""); yStrip.innerHTML = yi.join("");
    cStrip.style.cssText = "transform:translateY(0);transition:none";
    yStrip.style.cssText = "transform:translateY(0);transition:none";
    /* Measure actual item height after insertion */
    void cStrip.offsetHeight;
    var IH = (cStrip.firstElementChild && cStrip.firstElementChild.offsetHeight) || 96;
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        var ease = "cubic-bezier(0.25,0.1,0.15,1)", dur = 420;
        cStrip.style.transition = "transform "+dur+"ms "+ease;
        cStrip.style.transform  = "translateY(-"+(BLUR*IH)+"px)";
        yStrip.style.transition = "transform "+(dur+40)+"ms "+ease;
        yStrip.style.transform  = "translateY(-"+(BLUR*IH)+"px)";
        setTimeout(function(){
          /* Snap to single-item strip at translateY(0) without visible jump */
          cStrip.style.transition = "none";
          yStrip.style.transition = "none";
          cStrip.innerHTML = rwCItemHTML(pC);
          yStrip.innerHTML = rwYItemHTML(pY);
          cStrip.style.transform = "translateY(0)";
          yStrip.style.transform = "translateY(0)";
          RW._spinning = false;
          RW.currentSpin = { country:pC, year:pY, squad:pS };
          /* Update spin button */
          var left = Math.max(0, 3-(P.rerollsUsed||0));
          spinBtn.disabled = (left===0);
          spinBtn.textContent = left===0 ? "No rerolls left — pick!" : "RESPIN ("+left+" left)";
          /* Auto-respin if no players are draftable */
          var allBlocked = pS.every(function(pl){ return rwEligibleSlots(pl, P).length===0; });
          if (allBlocked && left>0){
            setTimeout(function(){ doRWSpin(cStrip, yStrip, spinBtn, squadPanel, P); }, 400);
          } else {
            showRWSquadPanel(squadPanel, RW.currentSpin, P);
          }
        }, dur+80);
      });
    });
  }

  function buildWildcardPool(){
    var combined = {};
    [W.WORLD_CUP_DATA, W.EURO_DATA, W.PL_DATA, W.LALIGA_DATA, W.SERIEA_DATA, W.BUNDESLIGA_DATA].forEach(function(d){
      if (!d) return;
      Object.keys(d).forEach(function(team){
        if (!combined[team]) combined[team] = { years: {} };
        var ys = (d[team] && d[team].years) || {};
        Object.keys(ys).forEach(function(y){
          if (!combined[team].years[y]) combined[team].years[y] = ys[y];
        });
      });
    });
    return combined;
  }

  function doWildcardSpin(cStrip, yStrip, spinBtn, squadPanel, P){
    if (RW._spinning || P.wildcardUsed) return;
    var DATA = buildWildcardPool();
    var countries = Object.keys(DATA);
    if (!countries.length) return;

    P.wildcardUsed = true;
    RW._spinning = true;
    spinBtn.disabled = true;
    var wcBtn = document.getElementById("rwWildcard");
    if (wcBtn) wcBtn.style.display = "none";
    squadPanel.style.display = "none";
    RW.currentSpin = null; RW.pendingRWPick = null;

    var tries=0, pC, pY, pS;
    do {
      pC = countries[Math.floor(Math.random()*countries.length)];
      var ys = Object.keys(DATA[pC].years || {});
      pY = ys[Math.floor(Math.random()*ys.length)];
      pS = (DATA[pC].years||{})[pY];
      tries++;
    } while (tries<120 && (!pS || pS.length < 5));
    if (!pS || !pS.length){ P.wildcardUsed=false; RW._spinning=false; spinBtn.disabled=false; if(wcBtn) wcBtn.style.display=""; return; }

    var BLUR=10, ci=[], yi=[];
    for (var i=0; i<BLUR; i++){
      ci.push(rwCItemHTML(countries[i%countries.length]));
      yi.push(rwYItemHTML(2024-i*2));
    }
    ci.push(rwCItemHTML(pC)); yi.push(rwYItemHTML(pY));
    cStrip.innerHTML = ci.join(""); yStrip.innerHTML = yi.join("");
    cStrip.style.cssText = "transform:translateY(0);transition:none";
    yStrip.style.cssText = "transform:translateY(0);transition:none";
    void cStrip.offsetHeight;
    var IH = (cStrip.firstElementChild && cStrip.firstElementChild.offsetHeight) || 96;
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        var ease = "cubic-bezier(0.25,0.1,0.15,1)", dur = 420;
        cStrip.style.transition = "transform "+dur+"ms "+ease;
        cStrip.style.transform  = "translateY(-"+(BLUR*IH)+"px)";
        yStrip.style.transition = "transform "+(dur+40)+"ms "+ease;
        yStrip.style.transform  = "translateY(-"+(BLUR*IH)+"px)";
        setTimeout(function(){
          cStrip.style.transition = "none";
          yStrip.style.transition = "none";
          cStrip.innerHTML = rwCItemHTML(pC);
          yStrip.innerHTML = rwYItemHTML(pY);
          cStrip.style.transform = "translateY(0)";
          yStrip.style.transform = "translateY(0)";
          RW._spinning = false;
          RW.currentSpin = { country:pC, year:pY, squad:pS };
          spinBtn.textContent = "No rerolls — pick!"; spinBtn.disabled = true;
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

    var rerollsLeft = Math.max(0, 3-(P.rerollsUsed||0));
    var html = '<div class="squad-card"><div class="squad-head"><h2>'+esc(spin.country)+' &middot; '+spin.year+'</h2>'+
      (rerollsLeft > 0
        ? '<button class="squad-respin-btn" id="rwSqRespin">Respin ('+rerollsLeft+' left)</button>'
        : '<span class="squad-respin-empty">No respins left</span>'
      )+'</div>'+
      '<div class="sub">'+(RW.poolNationalCur?"Nation":"Club")+' · Pick a player</div>';

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

    /* Squad list */
    html += '<div class="players mp-players-grid">';
    sorted.forEach(function(pl){
      var pos = pl.gp||pl.p||"MID", line = LINE_OF[pos]||"MID";
      var noSlot = rwEligibleSlots(pl, P).length===0;
      var isPending = RW.pendingRWPick && RW.pendingRWPick._n===pl.n && RW.pendingRWPick._pos===pos;
      var r = pl.r||75;
      var rCls = r>=88?"mp-r-badge r-gold":r>=84?"mp-r-badge r-elite":r>=80?"mp-r-badge r-great":r>=77?"mp-r-badge r-good":"mp-r-badge r-amber";
      html += '<div class="player'+(noSlot?" noslot":"")+(isPending?" mp-player-pending":"")+'" data-rwn="'+esc(pl.n)+'" data-rwpos="'+esc(pos)+'">'+
        '<span class="pos '+line+'">'+esc(pos)+'</span>'+
        '<span class="pname">'+esc(pl.n)+'</span>'+
        (noSlot ? '<span class="slot-tag">no slot</span>' : '<span class="'+rCls+'">'+r+'</span>')+
      '</div>';
    });
    html += '</div></div>';

    panel.innerHTML = html;
    panel.style.display = "";

    /* Respin button */
    var rwRespin = panel.querySelector("#rwSqRespin");
    if(rwRespin) rwRespin.onclick = function(){
      if((P.rerollsUsed||0) >= 3) return;
      P.rerollsUsed = (P.rerollsUsed||0) + 1;
      RW.currentSpin = null; RW.pendingRWPick = null;
      panel.style.display = "none";
      var spinBtn2 = document.getElementById("rwSpinBtn");
      var cS = document.getElementById("rwCS"), yS = document.getElementById("rwYS");
      if(spinBtn2 && cS && yS){
        initRWStrips(cS, yS, null);
        doRWSpin(cS, yS, spinBtn2, panel, P);
      }
    };

    /* Wire up position chooser buttons */
    if (RW.pendingRWPick){
      panel.querySelectorAll("[data-rwidx]").forEach(function(btn){
        btn.addEventListener("click", function(){
          var idx = parseInt(btn.getAttribute("data-rwidx"),10);
          var pp = RW.pendingRWPick;
          P.picks[idx] = { n:pp.n, r:pp.r||75, gp:SLOTS[idx].k.trim(), club:spin.country, year:spin.year };
          RW.pendingRWPick = null; RW.currentSpin = null;
          /* Refresh pitch without full re-render */
          var pw = document.getElementById("rwPitchWrap");
          if(pw) pw.innerHTML = buildRWPitch(P);
          var xiList = document.getElementById("rwXiList");
          if(xiList){
            var newHtml = "";
            SLOTS.forEach(function(slot,i){
              var pk2=P.picks[i], l=slot.line, k=slot.k.trim();
              if(pk2) newHtml += '<div class="xi-row"><span class="pos '+l+'">'+esc(k)+'</span><span class="info"><span class="pn">'+esc(pk2.n)+'</span><span class="meta">'+esc(pk2.club||"")+(pk2.year?' &middot; '+pk2.year:'')+'</span></span></div>';
              else newHtml += '<div class="xi-row empty"><span class="pos '+l+'">'+esc(k)+'</span><span class="info"><span class="pn slot-empty">'+esc(k)+' — empty</span></span></div>';
            });
            xiList.innerHTML = newHtml;
          }
          var countEl = document.querySelector(".draft-right .count");
          if(countEl) countEl.textContent = P.picks.filter(Boolean).length+"/11";
          var lockBtn = document.getElementById("rwLock");
          if(lockBtn) lockBtn.disabled = P.picks.filter(Boolean).length < 11;
          panel.style.display = "none";
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

  /* ---------- build (blind): WC-style layout — pitch + wheel left, XI list right ---------- */
  function renderBuild(v){
    var P = RW.players[RW.cur];
    var filled = P.picks.filter(Boolean).length;
    var rerollsLeft = Math.max(0, 3-(P.rerollsUsed||0));
    var isRespin = !!RW.currentSpin;
    var lockLabel = RW.online ? "Lock XI — send to "+esc(RW.players[RW.oppIdx].name)
                  : RW.cur < RW.numPlayers-1 ? "Lock XI — pass to "+esc(RW.players[RW.cur+1].name)+" →"
                  : RW.numPlayers>2 ? "Lock XI — start matches" : "Lock XI — reveal";

    /* Home button + draft-layout wrapper */
    v.innerHTML =
      "<button class='draft-corner-home' id='rwBack'>← Home</button>"+
      "<div class='draft-layout rw-draft-layout'>"+
        /* LEFT */
        "<div class='draft-left'>"+
          "<div class='draft-pitch-header'>"+
            "<div class='draft-team'>"+esc(P.name)+"</div>"+
            "<div class='draft-meta'>Pick <strong>"+filled+"</strong>/11 · "+esc(RW.poolLabelCur||"World Cup")+
              " · <span class='rw-reroll-badge"+(rerollsLeft===0?" rw-reroll-empty":"")+"'>"+rerollsLeft+"/3 rerolls</span></div>"+
          "</div>"+
          "<div class='draft-pitch-wrap rw-pitch-wrap' id='rwPitchWrap'>"+buildRWPitch(P)+"</div>"+
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
              (RW.features.wildcard && !P.wildcardUsed && !isRespin ?
                "<button class='rw-wildcard-btn' id='rwWildcard'>Wildcard Spin</button>" : "")+
            "</div>"+
          "</div>"+
          "<section class='squad' id='rwSquadPanel' style='display:none;'></section>"+
        "</div>"+
        /* RIGHT */
        "<div class='draft-right'>"+
          renderRWXiListHTML(P)+
          "<div class='xi-actions'>"+
            "<button class='btn-primary rw-lock-btn' id='rwLock' "+(filled<11?"disabled":"")+">"+lockLabel+"</button>"+
          "</div>"+
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

    var wcBtn = document.getElementById("rwWildcard");
    if (wcBtn) wcBtn.addEventListener("click", function(){
      doWildcardSpin(document.getElementById("rwCS"), document.getElementById("rwYS"),
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
        RW.matches = buildMatchSchedule(RW.numPlayers);
        RW.matchIdx = 0;
        RW.curA = RW.matches[0].a; RW.curB = RW.matches[0].b;
        if (RW.features.blindSwap){
          RW.cur = 0; RW.swapDone = RW.players.map(function(){ return false; });
          RW.swapSel = null; RW.swapTimeLeft = 30; RW.blindSwapPassing = false;
          RW.phase = "blindswap";
        } else {
          goToReveal();
        }
      }
      render();
    };
  }

  /* Build a formation pitch for Duels (fixed 4-3-3 slots) */
  function buildRWPitch(P){
    /* SLOTS: GK / RB CB CB LB / CDM CM CM / RW ST LW */
    var rows = [
      [{idx:0,  k:"GK",  line:"GK" }],
      [{idx:1,  k:"RB",  line:"DEF"},{idx:2,k:"CB",line:"DEF"},{idx:3,k:"CB",line:"DEF"},{idx:4,k:"LB",line:"DEF"}],
      [{idx:5,  k:"CDM", line:"MID"},{idx:6,k:"CM",line:"MID"},{idx:7,k:"CM",line:"MID"}],
      [{idx:8,  k:"RW",  line:"FWD"},{idx:9,k:"ST",line:"FWD"},{idx:10,k:"LW",line:"FWD"}]
    ];
    var html = "<div class='pitch rw-pitch'>";
    rows.forEach(function(row){
      html += "<div class='pitch-row'>";
      row.forEach(function(s){
        var pk = P.picks[s.idx];
        html += "<div class='pdot "+(pk?"filled ":"")+s.line+"'>"+
            "<span class='dot-postag'>"+esc(s.k)+"</span>"+
            (pk ? "<span class='dot-name'>"+esc(shortRWName(pk.n))+"</span>" : "")+
        "</div>";
      });
      html += "</div>";
    });
    html += "</div>";
    return html;
  }
  function shortRWName(n){ var p=String(n||"").split(" "); return p.length>1?p[p.length-1]:n; }

  /* ---------- shared pool draft: both players draft from same pool, alternating picks ---------- */
  function generateSharedPool(data){
    var keys = Object.keys(data);
    var shuffledKeys = keys.slice().sort(function(){ return Math.random()-0.5; });
    var teams = shuffledKeys.slice(0, Math.min(20, shuffledKeys.length));
    var seen = {}, pool = [];
    teams.forEach(function(team){
      var ys = Object.keys((data[team]&&data[team].years)||{});
      if (!ys.length) return;
      var yr = ys[Math.floor(Math.random()*ys.length)];
      var squad = ((data[team].years||{})[yr])||[];
      squad.forEach(function(pl){
        if (!pl||!pl.n||seen[pl.n]) return;
        if ((pl.r||0) < 70) return;
        seen[pl.n] = true;
        pool.push({n:pl.n, r:pl.r||75, gp:pl.gp||pl.p||"MID", club:team, year:yr});
      });
    });
    for (var i=pool.length-1; i>0; i--){
      var j=Math.floor(Math.random()*(i+1)); var t=pool[i]; pool[i]=pool[j]; pool[j]=t;
    }
    return pool;
  }

  function renderSharedPick(v){
    var turn = RW.sharedPickTurn||0;
    var P = RW.players[turn];
    var totalFilled = RW.players.reduce(function(a,p){ return a+p.picks.filter(Boolean).length; },0);
    var allDone = RW.players.every(function(p){ return p.picks.filter(Boolean).length>=11; });

    if (allDone){
      RW.matches = buildMatchSchedule(RW.numPlayers);
      RW.matchIdx = 0; RW.curA = RW.matches[0].a; RW.curB = RW.matches[0].b;
      if (RW.features.blindSwap){
        RW.cur=0; RW.swapDone=RW.players.map(function(){return false;});
        RW.swapSel=null; RW.swapTimeLeft=30; RW.blindSwapPassing=false; RW.phase="blindswap";
      } else { goToReveal(); }
      render(); return;
    }

    var pending = RW.sharedPendingPick;
    var pickNum = totalFilled+1;

    /* Pool list */
    var poolHTML = "";
    (RW.sharedPool||[]).forEach(function(pl, pi){
      if (RW.sharedPicked[pl.n]!==undefined) return;
      var slots = rwEligibleSlots(pl, P);
      var noSlot = !slots.length;
      var isPending = pending && pending.n===pl.n;
      poolHTML += "<div class='rw-sp-player"+(noSlot?" noslot":"")+(isPending?" rw-sp-pending":"")+"' data-pi='"+pi+"' data-pname='"+esc(pl.n)+"' data-ppos='"+esc(pl.gp)+"'>"+
        "<span class='pos "+(LINE_OF[pl.gp]||"MID")+"'>"+esc(pl.gp)+"</span>"+
        "<span class='rw-sp-name'>"+esc(pl.n)+"</span>"+
        "<span class='rw-sp-club'>"+esc(pl.club||"")+(pl.year?" · "+pl.year:"")+"</span>"+
        (noSlot?"<span class='slot-tag'>no slot</span>":"")+
      "</div>";
    });
    if (!poolHTML) poolHTML = "<p class='rw-sp-empty'>No available players left.</p>";

    /* Team XI columns */
    var xiHTML = "<div class='rw-sp-teams'>";
    RW.players.forEach(function(p,pi){
      xiHTML += "<div class='rw-sp-team"+(pi===turn?" active":"")+"'>"+
        "<div class='rw-sp-team-name'>"+esc(p.name)+" "+p.picks.filter(Boolean).length+"/11</div>";
      SLOTS.forEach(function(slot,si){
        var pk = p.picks[si];
        xiHTML += "<div class='rw-sp-slot"+(pk?"":" empty")+"'>"+
          "<span class='pos "+slot.line+"'>"+esc(slot.k.trim())+"</span>"+
          "<span class='rw-sp-slot-name'>"+(pk?esc(shortName(pk.n)):"—")+"</span>"+
        "</div>";
      });
      xiHTML += "</div>";
    });
    xiHTML += "</div>";

    /* Slot chooser (if a player was tapped) */
    var chooserHTML = "";
    if (pending){
      var eligs = rwEligibleSlots(pending, P);
      chooserHTML = "<div class='rw-sp-chooser'>"+
        "<span class='rw-sp-chooser-q'>Where does <strong>"+esc(pending.n)+"</strong> play?</span>"+
        "<div class='mp-chooser-btns'>";
      eligs.forEach(function(idx){
        chooserHTML += "<button class='mp-choose-pos pos "+SLOTS[idx].line+"' data-rwsidx='"+idx+"'>"+esc(SLOTS[idx].k.trim())+"</button>";
      });
      chooserHTML += "</div><button class='btn-ghost rw-sp-cancel'>Cancel</button></div>";
    }

    v.innerHTML = "<div class='wrap'><button class='back' id='rwBack'>← Quit</button>"+
      "<div class='rw-build-head'>"+
        "<div class='rw-turn'>Pick "+pickNum+" — "+esc(P.name)+"'s turn <span class='rw-blind'>● ratings hidden</span></div>"+
        "<div class='rw-prog-row'>"+
          RW.players.map(function(p,pi){
            return "<span class='"+(pi===turn?"rw-sp-turn":"rw-sp-wait")+"'>"+esc(p.name)+" "+p.picks.filter(Boolean).length+"/11</span>";
          }).join("<span class='rw-sp-sep'> · </span>")+
        "</div>"+
      "</div>"+
      chooserHTML+
      xiHTML+
      "<div class='rw-sp-pool'>"+
        "<div class='rw-sp-pool-head'>Available — pick one</div>"+
        "<div class='rw-sp-pool-list' id='rwSPList'>"+poolHTML+"</div>"+
      "</div></div>";

    document.getElementById("rwBack").onclick = function(){ if(confirm("Quit Duels?")) goHome(); };

    if (pending){
      v.querySelectorAll("[data-rwsidx]").forEach(function(btn){
        btn.addEventListener("click", function(){
          var idx = parseInt(btn.getAttribute("data-rwsidx"),10);
          P.picks[idx] = {n:pending.n, r:pending.r||75, gp:SLOTS[idx].k.trim(), club:pending.club||"", year:pending.year||""};
          RW.sharedPicked[pending.n] = turn;
          RW.sharedPendingPick = null;
          /* Advance to next player who still needs picks */
          var nextTurn = (turn+1) % RW.numPlayers, tries=0;
          while (RW.players[nextTurn].picks.filter(Boolean).length>=11 && tries<RW.numPlayers){
            nextTurn=(nextTurn+1)%RW.numPlayers; tries++;
          }
          RW.sharedPickTurn = nextTurn;
          render();
        });
      });
      var cancel = v.querySelector(".rw-sp-cancel");
      if (cancel) cancel.addEventListener("click", function(){ RW.sharedPendingPick=null; render(); });
    } else {
      v.querySelectorAll(".rw-sp-player:not(.noslot)").forEach(function(el){
        el.addEventListener("click", function(){
          var pname=el.getAttribute("data-pname"), ppos=el.getAttribute("data-ppos");
          var pl=(RW.sharedPool||[]).filter(function(p){ return p.n===pname&&p.gp===ppos; })[0];
          if(!pl) return;
          RW.sharedPendingPick=pl; render();
        });
      });
    }
  }

  /* ---------- async online mode ---------- */
  function findPoolDataKey(poolKey){
    for(var i=0;i<RW_POOLS.length;i++) if(RW_POOLS[i].key===poolKey) return RW_POOLS[i].dataKey;
    return "WORLD_CUP_DATA";
  }

  function checkAndLoadAsyncChallenge(){
    var hash = W.location && W.location.hash;
    if (!hash || hash.indexOf("#async=") !== 0) return false;
    try {
      var d = JSON.parse(atob(hash.slice(7)));
      if (!d || !Array.isArray(d.p1p)) return false;
      buildPool();
      var p1picks = d.p1p.map(function(p){ return p ? {n:p.n||"",r:p.r||75,gp:p.gp||"",club:p.club||"",year:p.year||""} : null; });
      while(p1picks.length<11) p1picks.push(null);
      var poolKey = d.pool && d.pool.key ? d.pool.key : "wc";
      var poolDataKey = findPoolDataKey(poolKey);
      RW = {
        phase:"asyncaccept", cur:1, numPlayers:2, curA:0, curB:1,
        matches:[], matchIdx:0, matchResults:[],
        revealStep:-1, currentSpin:null, pendingRWPick:null, _spinning:false, _t:null,
        features: Object.assign({}, DEFAULT_FEATURES, d.feat||{}),
        xfactorSlot: d.xfs!=null ? d.xfs : null,
        captains: [d.caps?d.caps[0]:null, null],
        bannedSlots: [d.bans?d.bans[0]:null, null],
        formations: [d.forms?d.forms[0]:null, null], formationPassing:false,
        stealUsed:[false,false],
        posBanPassing:false, captainPassing:false, blindSwapPassing:false,
        swapSel:null, swapTimeLeft:30, _swapTimerInterval:null, swapDone:[false,false],
        sharedPool:null, sharedPicked:{}, sharedPickTurn:1, sharedPendingPick:null,
        poolDataCur: W[poolDataKey]||{},
        poolNationalCur: d.pool ? !!d.pool.national : true,
        poolLabelCur: d.pool ? (d.pool.label||"") : "World Cup",
        _asyncPoolKey: poolKey,
        players:[
          {name:String(d.p1n||"Player 1").slice(0,14), picks:p1picks, rerollsUsed:0, wildcardUsed:false},
          {name:"Player 2",         picks:newPicks(), rerollsUsed:0, wildcardUsed:false}
        ]
      };
      if (W.history && W.history.replaceState)
        W.history.replaceState(null, "", W.location.pathname + W.location.search);
      return true;
    } catch(e){ return false; }
  }

  function renderAsyncShare(v){
    var url = RW._asyncShareURL || "";
    v.innerHTML =
      "<div class='wrap'><div class='rw-handoff'>"+
        "<h2 class='rw-title'>Challenge created!</h2>"+
        "<p class='rw-sub'>Share this link with your opponent. They open it, build their XI, and the reveal starts automatically.</p>"+
        "<div class='rw-async-url' id='rwAsyncURL'>"+esc(url)+"</div>"+
        "<div class='rw-async-btns'>"+
          "<button class='fl-btn' id='rwAsyncCopy'>Copy link</button>"+
          "<button class='btn-ghost' id='rwAsyncHome'>← Home</button>"+
        "</div>"+
      "</div></div>";
    document.getElementById("rwAsyncCopy").onclick = function(){
      if (navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(url).then(function(){
          if(typeof W.flToast==="function") W.flToast("Link copied!");
        });
      } else {
        var el = document.getElementById("rwAsyncURL");
        var sel = document.createRange(); sel.selectNode(el);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(sel);
        document.execCommand("copy");
        s.removeAllRanges();
        if(typeof W.flToast==="function") W.flToast("Link copied!");
      }
    };
    document.getElementById("rwAsyncHome").onclick = goHome;
  }

  function renderAsyncAccept(v){
    var P1 = RW.players[0];
    /* If captain enabled, P2 still needs to pick captain before building */
    v.innerHTML =
      "<div class='wrap'><div class='rw-handoff'>"+
        "<div class='rw-kicker'>Async Challenge</div>"+
        "<h2 class='rw-title'>"+esc(P1.name)+" has challenged you!</h2>"+
        "<p class='rw-sub'>Build your XI blind — ratings stay hidden until you lock. Once you lock, the reveal starts automatically.</p>"+
        "<button class='fl-btn rw-start' id='rwAccept'>Accept &amp; build my XI →</button>"+
        "<button class='btn-ghost' id='rwDecline' style='margin-top:var(--sp-3)'>Decline</button>"+
      "</div></div>";
    document.getElementById("rwAccept").onclick = function(){
      RW.cur = 1;
      /* Route to captain pick for P2 if enabled (P2 hasn't picked yet) */
      if (RW.features.captain){ RW.phase = "captain"; RW.captainPassing = false; }
      else { RW.phase = (RW.poolDataCur && Object.keys(RW.poolDataCur).length > 0) ? "build" : "poolselect"; }
      render();
    };
    document.getElementById("rwDecline").onclick = goHome;
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
    document.getElementById("rwGo").onclick = function(){
      /* Pool is set globally on the intro page — skip poolselect if already chosen */
      RW.phase = (RW.poolDataCur && Object.keys(RW.poolDataCur).length > 0) ? "build" : "poolselect";
      render();
    };
  }

  /* ---------- position ban (before build, each player secretly bans one slot) ---------- */
  function renderPosBan(v){
    var P = RW.players[RW.cur];
    if (RW.posBanPassing){
      v.innerHTML =
        "<div class='wrap'><div class='rw-handoff'>"+
          "<h2 class='rw-title'>Pass the device</h2>"+
          "<p class='rw-sub'><strong>"+esc(P.name)+"</strong>, it's your turn to secretly ban a position.</p>"+
          "<button class='fl-btn rw-start' id='rwGo'>I'm "+esc(P.name)+" — pick my ban →</button>"+
        "</div></div>";
      document.getElementById("rwGo").onclick = function(){ RW.posBanPassing = false; render(); };
      return;
    }
    var html = "<div class='wrap'><div class='rw-phase-screen'>"+
      "<h2 class='rw-title'>Position Ban</h2>"+
      "<p class='rw-phase-sub'><strong>"+esc(P.name)+"</strong> — secretly ban one slot. That position counts as 0 for you at the reveal.</p>"+
      "<div class='rw-slot-grid'>";
    SLOTS.forEach(function(s, i){
      var sel = RW.bannedSlots[RW.cur] === i;
      html += "<button class='rw-slot-pick"+(sel?" rw-slot-selected":"")+"' data-si='"+i+"'>"+esc(s.k.trim())+"</button>";
    });
    html += "</div>"+
      "<button class='fl-btn rw-start' id='rwPBConfirm' "+(RW.bannedSlots[RW.cur]===null?"disabled":"")+">"+
        (RW.cur < RW.numPlayers-1 ? "Confirm — pass to "+esc(RW.players[RW.cur+1].name)+" →" : "Confirm →")+
      "</button></div></div>";
    v.innerHTML = html;
    v.querySelectorAll(".rw-slot-pick").forEach(function(btn){
      btn.addEventListener("click", function(){
        RW.bannedSlots[RW.cur] = parseInt(btn.getAttribute("data-si"), 10);
        var c = document.getElementById("rwPBConfirm"); if(c) c.disabled = false;
        v.querySelectorAll(".rw-slot-pick").forEach(function(b){ b.classList.remove("rw-slot-selected"); });
        btn.classList.add("rw-slot-selected");
      });
    });
    document.getElementById("rwPBConfirm").onclick = function(){
      if (RW.bannedSlots[RW.cur] === null) return;
      if (RW.cur < RW.numPlayers - 1){ RW.cur++; RW.posBanPassing = true; }
      else {
        RW.cur = 0; RW.posBanPassing = false;
        if (RW.features.captain){ RW.phase = "captain"; RW.captainPassing = false; }
        else { RW.phase = (RW.poolDataCur && Object.keys(RW.poolDataCur).length > 0) ? "build" : "poolselect"; }
      }
      render();
    };
  }

  /* ---------- captain pick (before build, each player designates one position) ---------- */
  function renderCaptain(v){
    var P = RW.players[RW.cur];
    if (RW.captainPassing){
      v.innerHTML =
        "<div class='wrap'><div class='rw-handoff'>"+
          "<h2 class='rw-title'>Pass the device</h2>"+
          "<p class='rw-sub'><strong>"+esc(P.name)+"</strong>, it's your turn to secretly choose your Captain position.</p>"+
          "<button class='fl-btn rw-start' id='rwGo'>I'm "+esc(P.name)+" — pick my Captain →</button>"+
        "</div></div>";
      document.getElementById("rwGo").onclick = function(){ RW.captainPassing = false; render(); };
      return;
    }
    var html = "<div class='wrap'><div class='rw-phase-screen'>"+
      "<h2 class='rw-title'>Captain</h2>"+
      "<p class='rw-phase-sub'><strong>"+esc(P.name)+"</strong> — secretly pick your Captain slot. Win that position and earn +2 bonus points.</p>"+
      "<div class='rw-slot-grid'>";
    SLOTS.forEach(function(s, i){
      var banned = RW.features.posBan && RW.bannedSlots[RW.cur] === i;
      var sel = RW.captains[RW.cur] === i;
      html += "<button class='rw-slot-pick"+(banned?" rw-slot-disabled":"")+(sel?" rw-slot-selected":"")+"' data-si='"+i+"'"+(banned?" disabled":"")+">"+
        esc(s.k.trim())+(banned?" <span class='rw-ban-chip'>banned</span>":"")+
      "</button>";
    });
    html += "</div>"+
      "<button class='fl-btn rw-start' id='rwCapConfirm' "+(RW.captains[RW.cur]===null?"disabled":"")+">"+
        (RW.cur < RW.numPlayers-1 ? "Confirm — pass to "+esc(RW.players[RW.cur+1].name)+" →" : "Confirm →")+
      "</button></div></div>";
    v.innerHTML = html;
    v.querySelectorAll(".rw-slot-pick:not([disabled])").forEach(function(btn){
      btn.addEventListener("click", function(){
        RW.captains[RW.cur] = parseInt(btn.getAttribute("data-si"), 10);
        var c = document.getElementById("rwCapConfirm"); if(c) c.disabled = false;
        v.querySelectorAll(".rw-slot-pick").forEach(function(b){ b.classList.remove("rw-slot-selected"); });
        btn.classList.add("rw-slot-selected");
      });
    });
    document.getElementById("rwCapConfirm").onclick = function(){
      if (RW.captains[RW.cur] === null) return;
      if (RW.cur < RW.numPlayers - 1){ RW.cur++; RW.captainPassing = true; }
      else {
        RW.cur = 0; RW.captainPassing = false;
        RW.phase = (RW.poolDataCur && Object.keys(RW.poolDataCur).length > 0) ? "build" : "poolselect";
      }
      render();
    };
  }

  /* ---------- blind swap (after all players lock, 30s to secretly swap 2 slots) ---------- */
  function renderBlindSwap(v){
    if (RW._swapTimerInterval){ clearInterval(RW._swapTimerInterval); RW._swapTimerInterval = null; }
    var P = RW.players[RW.cur];

    function finishSwap(){
      if (RW._swapTimerInterval){ clearInterval(RW._swapTimerInterval); RW._swapTimerInterval = null; }
      RW.swapDone[RW.cur] = true;
      if (RW.cur < RW.numPlayers - 1){
        RW.cur++; RW.blindSwapPassing = true; RW.swapSel = null; RW.swapTimeLeft = 30;
      } else {
        goToReveal();
      }
      render();
    }

    if (RW.blindSwapPassing){
      v.innerHTML =
        "<div class='wrap'><div class='rw-handoff'>"+
          "<h2 class='rw-title'>Pass the device</h2>"+
          "<p class='rw-sub'><strong>"+esc(P.name)+"</strong>, you have 30 seconds to secretly swap two positions in your XI.</p>"+
          "<button class='fl-btn rw-start' id='rwGo'>I'm "+esc(P.name)+" — do my swap →</button>"+
        "</div></div>";
      document.getElementById("rwGo").onclick = function(){
        RW.blindSwapPassing = false; RW.swapSel = null; render();
      };
      return;
    }

    if (!RW.swapTimeLeft || RW.swapTimeLeft <= 0) RW.swapTimeLeft = 30;
    var timeLeft = RW.swapTimeLeft;

    var html = "<div class='wrap'><div class='rw-phase-screen'>"+
      "<div class='rw-swap-header'>"+
        "<h2 class='rw-title'>Blind Swap</h2>"+
        "<div class='rw-swap-timer"+(timeLeft<=10?" rw-timer-urgent":"")+"' id='rwSwapTimer'>"+timeLeft+"s</div>"+
      "</div>"+
      "<p class='rw-phase-sub'><strong>"+esc(P.name)+"</strong> — select two slots to swap them. Confirm when done, or skip.</p>"+
      "<div class='rw-slot-grid rw-swap-grid'>";
    P.picks.forEach(function(pick, i){
      var sel = RW.swapSel === i ? " rw-slot-selected" : "";
      html += "<button class='rw-slot-pick"+sel+"' data-si='"+i+"'>"+
        "<span class='rw-swap-pos'>"+esc(SLOTS[i].k.trim())+"</span>"+
        "<span class='rw-swap-player'>"+(pick ? esc(shortName(pick.n)) : "—")+"</span>"+
      "</button>";
    });
    html += "</div>"+
      "<div class='rw-swap-actions'>"+
        "<button class='fl-btn rw-start' id='rwSwapSkip'>Skip →</button>"+
      "</div></div></div>";
    v.innerHTML = html;

    RW._swapTimerInterval = setInterval(function(){
      RW.swapTimeLeft--;
      var el = document.getElementById("rwSwapTimer");
      if (el){
        el.textContent = RW.swapTimeLeft+"s";
        if (RW.swapTimeLeft <= 10) el.classList.add("rw-timer-urgent");
      }
      if (RW.swapTimeLeft <= 0) finishSwap();
    }, 1000);

    v.querySelectorAll(".rw-slot-pick").forEach(function(btn){
      btn.addEventListener("click", function(){
        var idx = parseInt(btn.getAttribute("data-si"), 10);
        if (RW.swapSel === null){
          RW.swapSel = idx;
          v.querySelectorAll(".rw-slot-pick").forEach(function(b){ b.classList.remove("rw-slot-selected"); });
          btn.classList.add("rw-slot-selected");
        } else if (RW.swapSel === idx){
          RW.swapSel = null;
          btn.classList.remove("rw-slot-selected");
        } else {
          var a = RW.swapSel, b = idx;
          var tmp = P.picks[a]; P.picks[a] = P.picks[b]; P.picks[b] = tmp;
          RW.swapSel = null;
          finishSwap();
        }
      });
    });

    document.getElementById("rwSwapSkip").onclick = finishSwap;
  }

  /* ---------- formation draft (before reveal, each player secretly picks a formation) ---------- */
  function renderFormationDraft(v){
    var P = RW.players[RW.cur];
    if (RW.formationPassing){
      v.innerHTML =
        "<div class='wrap'><div class='rw-handoff'>"+
          "<h2 class='rw-title'>Pass the device</h2>"+
          "<p class='rw-sub'><strong>"+esc(P.name)+"</strong>, secretly pick your formation. Your chosen style gives tactical bonuses at the reveal.</p>"+
          "<button class='fl-btn rw-start' id='rwGo'>I'm "+esc(P.name)+" — pick my formation →</button>"+
        "</div></div>";
      document.getElementById("rwGo").onclick = function(){ RW.formationPassing = false; render(); };
      return;
    }
    var html = "<div class='wrap'><div class='rw-phase-screen'>"+
      "<h2 class='rw-title'>Formation Draft</h2>"+
      "<p class='rw-phase-sub'><strong>"+esc(P.name)+"</strong> — secretly pick your formation. You earn +1 point for each bonus position you win.</p>"+
      "<div class='rw-form-grid'>";
    RW_FORMATIONS.forEach(function(f, fi){
      var sel = RW.formations[RW.cur] === fi;
      html += "<button class='rw-form-card"+(sel?" rw-slot-selected":"")+"' data-fi='"+fi+"'>"+
        "<span class='rw-form-name'>"+esc(f.name)+"</span>"+
        "<span class='rw-form-style'>"+esc(f.style)+"</span>"+
        "<span class='rw-form-hint'>+1: "+esc(f.hint)+"</span>"+
      "</button>";
    });
    html += "</div>"+
      "<button class='fl-btn rw-start' id='rwFormConfirm' "+(RW.formations[RW.cur]===null?"disabled":"")+">"+
        (RW.cur < RW.numPlayers-1 ? "Confirm — pass to "+esc(RW.players[RW.cur+1].name)+" →" : "Confirm — start reveal →")+
      "</button></div></div>";
    v.innerHTML = html;
    v.querySelectorAll(".rw-form-card").forEach(function(btn){
      btn.addEventListener("click", function(){
        RW.formations[RW.cur] = parseInt(btn.getAttribute("data-fi"), 10);
        var c = document.getElementById("rwFormConfirm"); if(c) c.disabled = false;
        v.querySelectorAll(".rw-form-card").forEach(function(b){ b.classList.remove("rw-slot-selected"); });
        btn.classList.add("rw-slot-selected");
      });
    });
    document.getElementById("rwFormConfirm").onclick = function(){
      if (RW.formations[RW.cur] === null) return;
      if (RW.cur < RW.numPlayers - 1){ RW.cur++; RW.formationPassing = true; }
      else { RW.phase = "reveal"; RW.revealStep = -1; computeResult(); }
      render();
    };
  }

  /* routes to formation draft (if on) then reveal */
  function goToReveal(){
    if (RW.features.formationDraft){
      RW.cur = 0; RW.formationPassing = false; RW.formations = RW.players.map(function(){ return null; });
      RW.phase = "formation";
    } else {
      RW.phase = "reveal"; RW.revealStep = -1; computeResult();
    }
  }

  /* ---------- result computation ---------- */
  function computeResult(){
    var idxA = RW.curA!=null ? RW.curA : 0;
    var idxB = RW.curB!=null ? RW.curB : 1;
    var s1=0, s2=0, rows=[];
    var f = RW.features;
    SLOTS.forEach(function(s,i){
      var a=RW.players[idxA].picks[i], b=RW.players[idxB].picks[i];
      /* Position Ban: treat banned slot as missing pick */
      var aBanned = f.posBan && RW.bannedSlots[idxA] === i;
      var bBanned = f.posBan && RW.bannedSlots[idxB] === i;
      var ra = (a && !aBanned) ? a.r : 0;
      var rb = (b && !bBanned) ? b.r : 0;
      var win = ra>rb ? 1 : (rb>ra ? 2 : 0);
      var isXF = f.xfactor && RW.xfactorSlot === i;
      var capA = f.captain && RW.captains[idxA] === i;
      var capB = f.captain && RW.captains[idxB] === i;
      var formA = f.formationDraft && RW.formations[idxA]!=null && (RW_FORMATIONS[RW.formations[idxA]].bonusIdx.indexOf(i)!==-1);
      var formB = f.formationDraft && RW.formations[idxB]!=null && (RW_FORMATIONS[RW.formations[idxB]].bonusIdx.indexOf(i)!==-1);
      var pts = isXF ? 2 : 1;
      if(win===1){ s1 += pts; if(capA) s1 += 2; if(formA) s1 += 1; }
      else if(win===2){ s2 += pts; if(capB) s2 += 2; if(formB) s2 += 1; }
      rows.push({slot:s.k.trim(), line:s.line, a:a, b:b, win:win, xfactor:isXF, capA:capA, capB:capB, aBanned:aBanned, bBanned:bBanned, pts:pts, formA:formA, formB:formB});
    });
    RW.rows = rows; RW.score=[s1,s2];
  }

  /* ---------- reveal: slot by slot, ratings count up ---------- */
  function renderReveal(v){
    var step = RW.revealStep;
    var shown = RW.rows.slice(0, Math.max(0, step+1));
    var s1=0,s2=0;
    shown.forEach(function(r){
      var p = r.pts || 1;
      if(r.win===1){ s1+=p; if(r.capA) s1+=2; if(r.formA) s1+=1; }
      else if(r.win===2){ s2+=p; if(r.capB) s2+=2; if(r.formB) s2+=1; }
    });
    var done = step >= RW.rows.length-1;
    var cards = shown.slice().reverse().map(function(r){
      var aw = r.win===1, bw = r.win===2;
      var badges = "";
      if(r.xfactor) badges += "<span class='rw-badge xf'>×2</span>";
      if(r.capA)    badges += "<span class='rw-badge cap-a'>C</span>";
      if(r.capB)    badges += "<span class='rw-badge cap-b'>C</span>";
      if(r.formA)   badges += "<span class='rw-badge form-a'>+1</span>";
      if(r.formB)   badges += "<span class='rw-badge form-b'>+1</span>";
      var aName = r.aBanned ? "<span class='rw-ban'>banned</span>" : esc(shortName(r.a?r.a.n:"—"));
      var bName = r.bBanned ? "<span class='rw-ban'>banned</span>" : esc(shortName(r.b?r.b.n:"—"));
      var aRat  = r.aBanned ? "—" : (r.a?r.a.r:"–");
      var bRat  = r.bBanned ? "—" : (r.b?r.b.r:"–");
      return "<div class='rw-rev-row "+(r.win===0?"draw":"")+(r.xfactor?" xfactor-row":"")+"'>"+
        "<div class='rw-rev-side "+(aw?"win":"")+"'>"+
          "<span class='rw-rev-name'>"+aName+"</span>"+
          "<span class='rw-rev-rating"+(r.a&&!r.aBanned?ratingTierClass(r.a.r):"")+"'>"+aRat+"</span></div>"+
        "<div class='rw-rev-mid'>"+badges+"<span class='pos "+r.line+"'>"+esc(r.slot)+"</span>"+
          (aw?"<span class='rw-rev-arrow l'>◀</span>":bw?"<span class='rw-rev-arrow r'>▶</span>":"<span class='rw-rev-eq'>=</span>")+"</div>"+
        "<div class='rw-rev-side right "+(bw?"win":"")+"'>"+
          "<span class='rw-rev-rating"+(r.b&&!r.bBanned?ratingTierClass(r.b.r):"")+"'>"+bRat+"</span>"+
          "<span class='rw-rev-name'>"+bName+"</span></div>"+
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
      /* Steal Power-Up buttons */
      (function(){
        if (!RW.features.steal || shown.length===0) return "";
        var idxA2 = RW.curA!=null?RW.curA:0, idxB2 = RW.curB!=null?RW.curB:1;
        var stealHTML = "";
        /* Find best revealed pick per player */
        function bestRevealedOf(rows, pickKey){
          var best=null;
          rows.forEach(function(r){ var p=r[pickKey]; if(p&&!best||(p&&best&&p.r>best.r)){best=p;} });
          return best;
        }
        var bestB = bestRevealedOf(shown, "b"); /* best of player B = steal target for player A */
        var bestA = bestRevealedOf(shown, "a"); /* best of player A = steal target for player B */
        if (!RW.stealUsed[idxA2] && bestB)
          stealHTML += "<button class='rw-steal-btn' id='rwStealA'>Steal "+esc(shortName(bestB.n))+" ("+bestB.r+")</button>";
        if (!RW.stealUsed[idxB2] && bestA)
          stealHTML += "<button class='rw-steal-btn' id='rwStealB'>Steal "+esc(shortName(bestA.n))+" ("+bestA.r+")</button>";
        return stealHTML ? "<div class='rw-steal-row'>"+stealHTML+"</div>" : "";
      }())+
      "<div class='reveal-bar'>"+(done
        ? "<button class='fl-btn rw-lock' id='rwToResult'>See the verdict →</button>"
        : "<button class='btn-ghost' id='rwSkip'>Skip</button>")+"</div>"+
      "</div>";
    var sk=document.getElementById("rwSkip");
    if(sk) sk.onclick=function(){ clearTimeout(RW._t); RW.revealStep=RW.rows.length-1; renderReveal(v); };
    var tr=document.getElementById("rwToResult");
    if(tr) tr.onclick=function(){ RW.phase="result"; if(W.scrollTo)W.scrollTo(0,0); render(); };

    /* Steal button handlers */
    function doSteal(thisPIdx, oppPIdx, oppPickKey){
      var rows2 = RW.rows.slice(0, Math.max(0, RW.revealStep+1));
      var best=null, bestSlotIdx=-1;
      rows2.forEach(function(r,ri){ var p=r[oppPickKey]; if(p&&(!best||p.r>best.r)){best=p;bestSlotIdx=ri;} });
      if(!best) return;
      clearTimeout(RW._t);
      /* Replace the same slot in the stealing player's picks */
      RW.players[thisPIdx].picks[bestSlotIdx] = {n:best.n, r:best.r, gp:best.gp||SLOTS[bestSlotIdx].k.trim(), club:best.club||"", year:best.year||""};
      RW.stealUsed[thisPIdx] = true;
      RW.revealStep = RW.rows.length-1;
      computeResult();
      renderReveal(v);
    }
    var sa=document.getElementById("rwStealA");
    if(sa) sa.onclick=function(){ doSteal(RW.curA!=null?RW.curA:0, RW.curB!=null?RW.curB:1, "b"); };
    var sb=document.getElementById("rwStealB");
    if(sb) sb.onclick=function(){ doSteal(RW.curB!=null?RW.curB:1, RW.curA!=null?RW.curA:0, "a"); };

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

    /* ── Best of 3 series state ── */
    var isBo3 = RW.features.bestOf3 && RW.numPlayers === 2 && !isTourn && !RW.online;
    var sw = [0, 0]; /* series wins for idxA / idxB */
    if (isBo3){
      RW.matchResults.forEach(function(r){
        var w = matchWinner(r);
        if (w===idxA) sw[0]+=1; else if(w===idxB) sw[1]+=1; else { sw[0]+=0.5; sw[1]+=0.5; }
      });
      if (s1>s2) sw[0]+=1; else if(s2>s1) sw[1]+=1; else { sw[0]+=0.5; sw[1]+=0.5; }
    }
    var totalPlayed = RW.matchResults.length + 1;
    var seriesDone = !isBo3 || sw[0]>=2 || sw[1]>=2 || totalPlayed>=3;
    var seriesWinnerIdx = seriesDone && isBo3 ? (sw[0]>sw[1]?idxA:sw[1]>sw[0]?idxB:-1) : -1;

    var title;
    if (isBo3 && seriesDone && seriesWinnerIdx>=0)
      title = esc(RW.players[seriesWinnerIdx].name)+" wins the series";
    else if (isBo3 && seriesDone && seriesWinnerIdx===-1)
      title = "Series tied";
    else if (winnerIdx === -1) title = matchLabel ? matchLabel+" — draw" : "It's a stalemate";
    else if (RW.online) title = (winnerIdx===RW.myIdx ? "You win the duel" : esc(RW.players[winnerIdx].name)+" wins the duel");
    else title = esc(RW.players[winnerIdx].name)+(isTourn ? " wins "+(matchLabel||"the match") : (isBo3 && !seriesDone ? " wins match "+totalPlayed : " wins the duel"));

    var emoji = (seriesWinnerIdx>=0 || (winnerIdx>=0 && !isBo3)) ? "🏆" : "";
    var best = RW.rows.slice().filter(function(r){return r.a&&r.b;}).sort(function(x,y){
      return (Math.max(y.a.r,y.b.r)) - (Math.max(x.a.r,x.b.r)); })[0];
    var nextMatch = isTourn ? RW.matches[RW.matchIdx+1] : null;
    var nextLabel = nextMatch ? (nextMatch.label || "Match "+(RW.matchIdx+2)) : "";
    var rematchLabel = RW.online ? (RW.rematchMe ? "Waiting for rematch…" : "Rematch") : "Rematch";
    var btns;
    if (isTourn){
      btns = "<button class='fl-btn' id='rwNext'>"+esc(nextLabel ? nextLabel+" →" : "See standings →")+"</button>"+
             "<button class='btn-ghost' id='rwHome'>Home</button>";
    } else if (isBo3 && !seriesDone){
      btns = "<button class='fl-btn' id='rwSeriesNext'>Match "+(totalPlayed+1)+" →</button>"+
             "<button class='btn-ghost' id='rwHome'>Home</button>";
    } else {
      btns = "<button class='fl-btn' id='rwAgain' "+(RW.online&&RW.rematchMe?"disabled":"")+">"+rematchLabel+"</button>"+
             "<button class='btn-ghost' id='rwHome'>Home</button>";
    }
    var seriesBar = isBo3 ? "<div class='rw-series-bar'>"+
      "<span>"+esc(RW.players[idxA].name)+" "+sw[0]+"</span>"+
      "<span class='rw-series-sep'>series</span>"+
      "<span>"+sw[1]+" "+esc(RW.players[idxB].name)+"</span>"+
    "</div>" : "";
    v.innerHTML =
      "<div class='wrap'>"+
      "<div class='rw-result-card'>"+
        (matchLabel ? "<div class='rw-result-matchlabel'>"+esc(matchLabel)+"</div>" : "")+
        (isBo3 && !seriesDone ? "<div class='rw-result-matchlabel'>Match "+totalPlayed+" of 3</div>" : "")+
        "<div class='rw-result-emoji'>"+emoji+"</div>"+
        "<div class='rw-result-score'>"+s1+" <span>–</span> "+s2+"</div>"+
        "<h2 class='rw-title'>"+title+"</h2>"+
        seriesBar+
        "<p class='rw-sub'>"+nm(idxA)+" "+s1+" · "+nm(idxB)+" "+s2+
          (best?" &middot; star slot: "+esc(best.slot)+" ("+esc(shortName(best[best.a.r>=best.b.r?'a':'b'].n))+" "+Math.max(best.a.r,best.b.r)+")":"")+"</p>"+
        "<div class='rw-result-btns'>"+btns+"</div>"+
      "</div></div>";
    var nxt=document.getElementById("rwNext");
    if(nxt) nxt.onclick = function(){ advanceMatch(); };
    var snxt=document.getElementById("rwSeriesNext");
    if(snxt) snxt.onclick = function(){ rwSeriesNextMatch(); };
    var ag=document.getElementById("rwAgain");
    if(ag) ag.onclick = function(){
      if (RW.online){
        RW.rematchMe = true; rwSend({ t:"rw_rematch" });
        if (typeof W.flToast === "function") W.flToast("Rematch requested…");
        maybeRematch(); render();
      } else { W.startDuels(); }
    };
    document.getElementById("rwHome").onclick = goHome;
    /* Post to shared leaderboard for completed single matches + completed Bo3 series */
    var isCompletedDuel = !isTourn && ((!isBo3 && winnerIdx >= 0) || (isBo3 && seriesDone && seriesWinnerIdx >= 0));
    if (isCompletedDuel && !RW._savedToBoard && typeof W.WCXI_addScore === "function") {
      RW._savedToBoard = true;
      var boardWinnerIdx = isBo3 && seriesDone ? seriesWinnerIdx : winnerIdx;
      var boardLoserIdx  = boardWinnerIdx === idxA ? idxB : idxA;
      var winPicks = RW.players[boardWinnerIdx].picks.filter(Boolean);
      var winAvg   = winPicks.length ? Math.round(winPicks.reduce(function(s,p){ return s+(p.r||75); },0)/winPicks.length) : 75;
      var boardScore = winAvg * 10;
      var loserName = RW.players[boardLoserIdx].name;
      var seriesInfo = isBo3 ? " (Bo3 " + sw[0] + "-" + sw[1] + ")" : " " + s1 + "-" + s2;
      W.WCXI_addScore({
        name: RW.players[boardWinnerIdx].name,
        score: boardScore,
        result: "Won vs " + loserName + seriesInfo,
        mode: "duels",
        ts: Date.now()
      });
      /* D-4: Save to local duel history */
      _saveDuelHistory({
        ts: Date.now(),
        winner: RW.players[boardWinnerIdx].name,
        loser: loserName,
        score: isBo3 ? (sw[0]+"-"+sw[1]) : (s1+"-"+s2),
        isBo3: isBo3
      });
      /* D-3: Series complete — clear saved series */
      if(isBo3 && seriesDone) _clearDuelSeries();
    }
    if ((seriesWinnerIdx>=0 || (winnerIdx>=0 && !isBo3)) && typeof W.triggerConfetti === "function") W.triggerConfetti();
  }

  function rwSeriesNextMatch(){
    /* Save this match result then reset picks, keeping feature state */
    RW.matchResults.push({a:RW.curA, b:RW.curB, score:[RW.score[0],RW.score[1]]});
    RW.seriesMatch = (RW.seriesMatch||0) + 1;
    _saveDuelSeries(); /* D-3: persist series state between matches */
    RW.players.forEach(function(p){ p.picks = newPicks(); p.rerollsUsed = 0; p.wildcardUsed = false; });
    RW.currentSpin = null; RW.pendingRWPick = null; RW._spinning = false;
    RW.swapSel = null; RW.swapTimeLeft = 30; RW.blindSwapPassing = false;
    if (RW._swapTimerInterval){ clearInterval(RW._swapTimerInterval); RW._swapTimerInterval = null; }
    RW.sharedPool = null; RW.sharedPicked = {}; RW.sharedPickTurn = 0; RW.sharedPendingPick = null;
    RW.formations = RW.players.map(function(){ return null; }); RW.formationPassing = false;
    RW.stealUsed = RW.players.map(function(){ return false; });
    /* Don't re-run posban/captain — those are set for the whole series */
    RW.cur = 0;
    /* Pool already set globally on intro — skip poolselect */
    RW.phase = (RW.poolDataCur && Object.keys(RW.poolDataCur).length > 0) ? "build" : "poolselect";
    render();
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
  /* Auto-intercept async challenge links on page load */
  window.addEventListener("load", function(){
    if (window.location.hash.indexOf("#async=") === 0) W.startDuels();
  });
})(window);
