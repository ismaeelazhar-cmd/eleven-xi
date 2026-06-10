/* league.js — League Mode
 * Spin to draft an XI from real squads in a chosen league.
 * Simulate a full season. Every game is played — no early exit.
 */
(function(W){
  "use strict";

  /* ── State ── */
  var LS = {
    league:null, teamName:"My XI",
    formation:"4-3-3", manager:null, mgrBonus:{attack:0,defend:0},
    mgrName:"",        /* named manager (from spin) */
    xi:[], currentSpin:null, pendingPick:null, spinning:false,
    showRatings:true,
    table:[], userResults:[]
  };

  /* ── Manager pref helpers (shared with WC / CL / MP modes) ── */
  function saveMgrPref(){
    try{ localStorage.setItem("wcxi_manager",JSON.stringify({id:(LS.manager&&LS.manager.id)||"none",name:LS.mgrName})); }catch(e){}
  }
  function loadMgrPref(){
    try{
      var raw=localStorage.getItem("wcxi_manager"); if(!raw) return;
      var o=JSON.parse(raw);
      if(o.id && o.id!=="none"){
        var MGRS = W.WCXI_MANAGERS||[];
        for(var i=0;i<MGRS.length;i++){
          if(MGRS[i].id===o.id){ LS.manager=MGRS[i]; break; }
        }
        LS.mgrName = o.name||"";
      }
    }catch(e){}
  }

  /* ── Leagues ── */
  var LEAGUES = {
    laliga:     { label:"La Liga",    flag:"🇪🇸", games:38, getData:function(){ return W.LALIGA_DATA; } },
    seriea:     { label:"Serie A",    flag:"🇮🇹", games:38, getData:function(){ return W.SERIEA_DATA; } },
    bundesliga: { label:"Bundesliga", flag:"🇩🇪", games:34, getData:function(){ return W.BUNDESLIGA_DATA; } },
    ligue1:     { label:"Ligue 1",    flag:"🇫🇷", games:38, getData:function(){ return W.LIGUE1_DATA; } }
  };

  /* ── Formations ── */
  var FORMATIONS = ["4-3-3","4-4-2","4-2-3-1","3-5-2","5-3-2","3-4-3"];

  var FM_SLOTS = {
    "4-3-3":   ["GK","RB","CB","CB","LB","CM","CDM","CM","RW","ST","LW"],
    "4-4-2":   ["GK","RB","CB","CB","LB","RM","CM","CM","LM","ST","ST"],
    "4-2-3-1": ["GK","RB","CB","CB","LB","CDM","CDM","CAM","RW","CAM","ST"],
    "3-5-2":   ["GK","CB","CB","CB","RWB","CM","CDM","CM","LWB","ST","ST"],
    "5-3-2":   ["GK","RWB","CB","CB","CB","LWB","CM","CM","CM","ST","ST"],
    "3-4-3":   ["GK","CB","CB","CB","CM","CM","CM","CM","RW","ST","LW"]
  };

  /* Pitch rows per formation — displayed FWD-first (top), reversed to GK (bottom) */
  var FM_ROWS = {
    "4-3-3":   [["GK"],["LB","CB","CB","RB"],["CM","CDM","CM"],["LW","ST","RW"]],
    "4-4-2":   [["GK"],["LB","CB","CB","RB"],["LM","CM","CM","RM"],["ST","ST"]],
    "4-2-3-1": [["GK"],["LB","CB","CB","RB"],["CDM","CDM"],["CAM","CAM"],["ST"]],
    "3-5-2":   [["GK"],["CB","CB","CB"],["LWB","CM","CDM","CM","RWB"],["ST","ST"]],
    "5-3-2":   [["GK"],["LWB","CB","CB","CB","RWB"],["CM","CM","CM"],["ST","ST"]],
    "3-4-3":   [["GK"],["CB","CB","CB"],["CM","CM","CM","CM"],["LW","ST","RW"]]
  };

  var LINE_OF = {
    GK:"GK", CB:"DEF", RB:"DEF", LB:"DEF", RWB:"DEF", LWB:"DEF",
    CDM:"MID", CM:"MID", CAM:"MID", RM:"MID", LM:"MID",
    LW:"FWD", RW:"FWD", ST:"FWD"
  };

  var COMPAT = {
    "GK":  ["GK"],
    "CB":  ["CB","CDM"],  "RB":["RB","RWB","CB"],  "LB":["LB","LWB","CB"],
    "RWB": ["RWB","RB"],  "LWB":["LWB","LB"],
    "CDM": ["CDM","CM","CB"],  "CM":["CM","CDM","CAM","RM","LM"],
    "CAM": ["CAM","CM","RW","LW"],
    "RM":  ["RM","RW","CM"],   "LM":["LM","LW","CM"],
    "RW":  ["RW","RM","CAM","ST"],  "LW":["LW","LM","CAM","ST"],
    "ST":  ["ST","LW","RW","CAM"]
  };

  var MGR_STYLES = [
    { id:"attack",    emoji:"⚔️",  name:"Attack",    desc:"+4 atk — all-out attack" },
    { id:"defence",   emoji:"🛡️",  name:"Defence",   desc:"+4 def — shut up shop" },
    { id:"press",     emoji:"🔥",  name:"Gegenpress", desc:"+3 atk +3 def — intensity" },
    { id:"counter",   emoji:"⚡",  name:"Counter",   desc:"+2 atk +4 def — lethal breaks" },
    { id:"motivator", emoji:"🗣️",  name:"Motivator", desc:"+2 atk +2 def — all-round" },
    { id:"balanced",  emoji:"⚖️",  name:"Balanced",  desc:"+2 atk +2 def — steady" }
  ];

  var MGR_BONUS = {
    attack:{attack:4,defend:0}, defence:{attack:0,defend:4},
    press:{attack:3,defend:3},  counter:{attack:2,defend:4},
    motivator:{attack:2,defend:2}, balanced:{attack:2,defend:2}
  };

  /* ── DOM helpers ── */
  function lgView(){ return document.getElementById("leagueView"); }
  function eid(id){ return document.getElementById(id); }
  function esc(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function slotsFor(f){ return (FM_SLOTS[f]||FM_SLOTS["4-3-3"]).slice(); }
  function shortName(n){ var p=n.split(" "); return p.length>1?p[p.length-1]:n; }
  function seasonLabel(yr){
    var y = parseInt(yr, 10);
    var suffix = ("0" + y).slice(-2);   /* last 2 digits of end year, e.g. 2025→"25", 2000→"00" */
    return (y - 1) + "/" + suffix;      /* e.g. "2024/25", "1999/00" */
  }

  /* ── Slot helpers ── */
  function openSlotCounts(){
    var slots = slotsFor(LS.formation), counts={};
    slots.forEach(function(s){ counts[s]=(counts[s]||0)+1; });
    LS.xi.forEach(function(pk){ if(pk&&pk.slot&&counts.hasOwnProperty(pk.slot)) counts[pk.slot]--; });
    return counts;
  }
  function eligibleSlots(pl){
    var gp=pl.gp||pl.p||"MID", compat=COMPAT[gp]||[gp], counts=openSlotCounts();
    return compat.filter(function(s){ return (counts[s]||0)>0; });
  }

  /* ── Poisson / sim ── */
  function poisson(lam){
    lam=Math.max(0.05,lam);
    var L=Math.exp(-lam),k=0,p=1;
    do{ k++; p*=Math.random(); }while(p>L);
    return k-1;
  }
  function simMatch(homeStr, awayStr, mgrAtk){
    var ha=(homeStr+(mgrAtk||0))/14+0.25, aa=awayStr/15-0.05;
    return { h:poisson(ha), a:poisson(Math.max(0.1,aa)) };
  }

  /* ── Spin pool ── */
  function getPool(){
    var data=LEAGUES[LS.league].getData(); if(!data) return [];
    var pool=[];
    Object.keys(data).forEach(function(club){
      Object.keys(data[club].years).forEach(function(yr){
        var sq=data[club].years[yr];
        if(sq&&sq.length>=11) pool.push({club:club,year:yr,squad:sq});
      });
    });
    return pool;
  }

  /* ════════════════════════════════════════
     PUBLIC ENTRY
  ════════════════════════════════════════ */
  W.initLeagueMode = function(){
    var v=lgView(); if(!v) return;
    LS.league=null; LS.teamName="My XI";
    LS.formation="4-3-3"; LS.manager=null; LS.mgrBonus={attack:0,defend:0};
    LS.xi=[]; LS.currentSpin=null; LS.pendingPick=null; LS.spinning=false;
    LS.table=[]; LS.userResults=[];
    document.getElementById("homeView").style.display="none";
    v.style.display="";
    renderLeaguePicker();
  };

  function goHome(){
    lgView().style.display="none";
    document.getElementById("homeView").style.display="";
  }

  /* ════════════════════════════════════════
     STEP 1 — Pick league
  ════════════════════════════════════════ */
  function renderLeaguePicker(){
    var v=lgView();
    var html="<button class='back' id='lgBackHome'>← Home</button>"+
      "<h2 class='lg-title'>⚽ League Mode</h2>"+
      "<p class='lg-sub'>Spin to build an XI from real squads — then simulate a full season.</p>"+
      "<div class='lg-card-grid'>";
    Object.keys(LEAGUES).forEach(function(k){
      var lc=LEAGUES[k];
      html+="<button class='lg-card' data-league='"+k+"'>"+
        "<span class='lg-flag'>"+lc.flag+"</span>"+
        "<span class='lg-name'>"+lc.label+"</span>"+
        "<span class='lg-games'>"+lc.games+" games</span>"+
        "</button>";
    });
    html+="</div>";
    v.innerHTML=html;
    eid("lgBackHome").addEventListener("click",goHome);
    v.querySelectorAll(".lg-card").forEach(function(btn){
      btn.addEventListener("click",function(){
        LS.league=btn.dataset.league;
        renderSetup();
      });
    });
  }

  /* ════════════════════════════════════════
     STEP 2 — Setup
  ════════════════════════════════════════ */
  function renderSetup(){
    _doSetupWire();
  }
  /* ── NEW renderSetup body (replaces placeholder above) ── */
  function _doSetupWire(){
    var v=lgView(), lc=LEAGUES[LS.league];
    var MGRS = W.WCXI_MANAGERS || [];
    var MGRS_DB = W.WCXI_MANAGERS_DB || [];
    var curMgr = LS.manager || MGRS[0] || {id:"none",emoji:"\u{1F455}",name:"No manager",atk:0,def:0,ko:0,desc:""};
    var mgrSpinDone = !!LS.mgrName;

    v.innerHTML=
      "<button class='back' id='lgBackLeague'>← Leagues</button>"+
      "<div class='setup'>"+
        "<h2 class='lg-title' style='margin-top:.3rem'>"+lc.flag+" "+lc.label+"</h2>"+
        /* Team name */
        "<div class='setup-row'>"+
          "<label class='setup-label' for='lgTeamName'>Team name</label>"+
          "<input class='team-name-input' id='lgTeamName' maxlength='24' placeholder='Name your side…' value='"+esc(LS.teamName)+"' autocomplete='off' />"+
        "</div>"+
        /* Manager */
        "<div class='setup-row setup-row-col'>"+
          "<span class='setup-label'>Manager</span>"+
          "<div class='manager-options' id='lgMgrStyles'></div>"+
          "<div class='mgr-wheel'>"+
            "<div class='reel mgr-reel'><div class='reel-strip' id='lgMgrStrip'></div></div>"+
            "<button class='btn-accent' id='lgMgrSpin'"+(mgrSpinDone?" disabled":"")+">"+(mgrSpinDone?"Manager appointed":"Spin manager")+"</button>"+
          "</div>"+
          "<div class='manager-desc' id='lgMgrDesc'></div>"+
        "</div>"+
        /* Pitch preview */
        "<div class='setup-pitch-wrap'>"+
          "<div class='pitch-title' id='lgPitchTitle'>"+esc(LS.formation)+"</div>"+
          "<div id='lgSetupPitch'></div>"+
        "</div>"+
        /* Formation */
        "<div class='setup-row setup-row-col'>"+
          "<span class='setup-label'>Formation</span>"+
          "<div class='formation-options' id='lgFmBar'></div>"+
        "</div>"+
        /* Ratings */
        "<div class='setup-row setup-row-col'>"+
          "<span class='setup-label'>Player ratings</span>"+
          "<div class='toggle2' id='lgRatingsToggle'>"+
            "<button class='tg-opt"+(LS.showRatings?" active":"")+"' data-rat='show'><span class='tg-emoji'>👁️</span><span class='tg-text'>Show ratings</span></button>"+
            "<button class='tg-opt"+(LS.showRatings?"":" active")+"' data-rat='hide'><span class='tg-emoji'>🙈</span><span class='tg-text'>Hide ratings</span></button>"+
          "</div>"+
        "</div>"+
        "<button class='start-btn' id='lgGoDraft'>Draft your XI →</button>"+
      "</div>";

    eid("lgBackLeague").addEventListener("click",renderLeaguePicker);

    /* ── Manager styles ── */
    var styleBox=eid("lgMgrStyles");
    MGRS.forEach(function(m){
      var b=document.createElement("button");
      b.className="manager-opt"+(curMgr.id===m.id?" active":"");
      b.setAttribute("data-style",m.id);
      b.title=m.desc;
      b.innerHTML="<span class='mgr-emoji'>"+m.emoji+"</span><span class='mgr-name'>"+m.name+"</span>";
      b.addEventListener("click",function(){
        LS.manager=m; LS.mgrName=""; LS.mgrBonus={attack:m.atk||0,defend:m.def||0};
        curMgr=m; mgrSpinDone=false;
        styleBox.querySelectorAll(".manager-opt").forEach(function(x){ x.classList.remove("active"); });
        b.classList.add("active");
        saveMgrPref(); refreshMgrStrip(); refreshMgrDesc(); refreshSetupPitch();
      });
      styleBox.appendChild(b);
    });

    /* Manager reel helpers */
    function mgrItemHTML(name, styleId){
      var s=MGRS.filter(function(m){ return m.id===styleId; })[0]||MGRS[0];
      return '<div class="reel-item mgr-item"><span class="mgr-name-big">'+esc(name)+'</span>'+
             '<span class="mgr-style-tag">'+s.emoji+' '+s.name+'</span></div>';
    }
    function refreshMgrStrip(){
      var strip=eid("lgMgrStrip"); if(!strip) return;
      var m=LS.manager||MGRS[0];
      if(LS.mgrName){
        strip.innerHTML=mgrItemHTML(LS.mgrName,m.id);
      } else if(!m||m.id==="none"){
        strip.innerHTML='<div class="reel-item mgr-item"><span class="mgr-name-big">No manager</span>'+
          '<span class="mgr-style-tag">pick a style or spin</span></div>';
      } else {
        strip.innerHTML='<div class="reel-item mgr-item"><span class="mgr-name-big">'+m.emoji+' '+m.name+
          '</span><span class="mgr-style-tag">tactical style</span></div>';
      }
    }
    function refreshMgrDesc(){
      var d=eid("lgMgrDesc"); if(!d) return;
      var m=LS.manager||MGRS[0];
      d.textContent=(!m||m.id==="none")
        ? "Pick a tactical style above, or spin for a famous manager."
        : m.emoji+" "+m.name+" — "+m.desc;
    }
    refreshMgrStrip(); refreshMgrDesc();

    /* Manager spin — max 1 spin */
    var mgrSpinBtn=eid("lgMgrSpin"), _lgMgrSpin=false;
    if(mgrSpinBtn&&!mgrSpinDone){
      mgrSpinBtn.addEventListener("click",function(){
        if(_lgMgrSpin||mgrSpinDone) return;
        _lgMgrSpin=true; mgrSpinBtn.disabled=true;
        var db=MGRS_DB, pick=db[Math.floor(Math.random()*db.length)];
        var BLUR=14, IH=48;
        var strip=eid("lgMgrStrip"); if(!strip){ _lgMgrSpin=false; return; }
        var items=[];
        for(var i=0;i<BLUR;i++){
          var d2=db[i%db.length];
          var s2=MGRS.filter(function(x){ return x.id===d2.s; })[0]||MGRS[0];
          items.push('<div class="reel-item mgr-item"><span class="mgr-name-big">'+esc(d2.n)+'</span>'+
            '<span class="mgr-style-tag">'+s2.emoji+' '+s2.name+'</span></div>');
        }
        var ps=MGRS.filter(function(x){ return x.id===pick.s; })[0]||MGRS[0];
        strip.innerHTML=items.join("");
        strip.style.transform="translateY(0)"; strip.style.transition="none";
        requestAnimationFrame(function(){ requestAnimationFrame(function(){
          strip.style.transition="transform 500ms cubic-bezier(0.25,0.1,0.15,1)";
          strip.style.transform="translateY(-"+(BLUR*IH)+"px)";
          setTimeout(function(){
            strip.style.transition="none"; strip.style.transform="translateY(0)";
            strip.innerHTML='<div class="reel-item mgr-item"><span class="mgr-name-big">'+esc(pick.n)+'</span>'+
              '<span class="mgr-style-tag">'+ps.emoji+' '+ps.name+'</span></div>';
            LS.manager=ps; LS.mgrName=pick.n; curMgr=ps; mgrSpinDone=true;
            LS.mgrBonus={attack:ps.atk||0,defend:ps.def||0};
            mgrSpinBtn.textContent="Manager appointed"; mgrSpinBtn.disabled=true;
            styleBox.querySelectorAll(".manager-opt").forEach(function(b2){
              b2.classList.toggle("active", b2.getAttribute("data-style")===pick.s);
            });
            saveMgrPref(); refreshMgrDesc(); refreshSetupPitch();
            _lgMgrSpin=false;
          }, 560);
        }); });
      });
    }

    /* ── Formation bar ── */
    var fmBar=eid("lgFmBar");
    FORMATIONS.forEach(function(f){
      var b=document.createElement("button");
      b.className="formation-opt"+(f===LS.formation?" active":"");
      b.setAttribute("data-formation",f);
      b.textContent=f;
      b.addEventListener("click",function(){
        LS.formation=f;
        fmBar.querySelectorAll(".formation-opt").forEach(function(x){ x.classList.remove("active"); });
        b.classList.add("active");
        var pt=eid("lgPitchTitle"); if(pt) pt.textContent=f;
        refreshSetupPitch();
      });
      fmBar.appendChild(b);
    });

    /* Pitch preview */
    function refreshSetupPitch(){
      var w=eid("lgSetupPitch"); if(w) w.innerHTML=buildPitch();
    }
    refreshSetupPitch();

    /* Ratings toggle */
    var ratToggle=eid("lgRatingsToggle");
    if(ratToggle) ratToggle.querySelectorAll(".tg-opt").forEach(function(b){
      b.addEventListener("click",function(){
        LS.showRatings=(b.getAttribute("data-rat")==="show");
        ratToggle.querySelectorAll(".tg-opt").forEach(function(x){ x.classList.remove("active"); });
        b.classList.add("active");
      });
    });

    /* Team name */
    var tnInp=eid("lgTeamName");
    if(tnInp) tnInp.addEventListener("input",function(){ LS.teamName=tnInp.value||"My XI"; });

    /* Go draft */
    eid("lgGoDraft").addEventListener("click",function(){
      LS.teamName=(eid("lgTeamName").value.trim()||"My XI");
      if(!LS.manager){
        var def=MGRS.filter(function(m){ return m.id==="motivator"; })[0]||MGRS[0];
        LS.manager=def; LS.mgrBonus={attack:def.atk||0,defend:def.def||0};
      }
      renderDraftScreen();
    });
  }

  /* ════════════════════════════════════════
     STEP 3 — Spin & Draft
  ════════════════════════════════════════ */
  var _lgSpinning=false;
  var LG_IH=56;

  function renderDraftScreen(){
    LS.xi=[]; LS.currentSpin=null; LS.pendingPick=null; _lgSpinning=false;
    var v=lgView(), lc=LEAGUES[LS.league];

    v.innerHTML=
      "<div class='lg-draft-page'>"+
        "<div class='lg-draft-hd'>"+
          "<button class='back' id='lgBackSetup'>← Setup</button>"+
          "<div class='lg-draft-info'>"+
            "<div class='lg-draft-team'>"+esc(LS.teamName)+"</div>"+
            "<div class='lg-draft-meta'>"+esc(LS.formation)+
              (LS.manager?" &middot; "+LS.manager.emoji+" "+LS.manager.name:"")+
              " &middot; <span id='lgPickCount'>0</span>/11</div>"+
          "</div>"+
        "</div>"+

        "<div class='lg-draft-cols'>"+

          "<div class='lg-draft-pitch-col'>"+
            "<div class='lg-pitch-label'>"+esc(LS.formation)+"</div>"+
            "<div id='lgPitchWrap'></div>"+
            "<div class='lg-pitch-btns'>"+
              "<button class='btn-accent' id='lgAutoFill'>Auto-fill XI</button>"+
              "<button class='btn-primary' id='lgSimulate' disabled>Simulate Season →</button>"+
            "</div>"+
          "</div>"+

          "<div class='lg-draft-spin-col'>"+
            "<div class='lg-machine'>"+
              "<div class='lg-spin-reels'>"+
                "<div class='lg-spin-reel-box'>"+
                  "<div class='lg-spin-label'>Club</div>"+
                  "<div class='mp-reel'><div class='mp-reel-strip' id='lgClubStrip'></div></div>"+
                "</div>"+
                "<div class='lg-spin-reel-box'>"+
                  "<div class='lg-spin-label'>Season</div>"+
                  "<div class='mp-reel'><div class='mp-reel-strip' id='lgYearStrip'></div></div>"+
                "</div>"+
              "</div>"+
              "<button class='mp-spin-btn big' id='lgSpinBtn'>SPIN</button>"+
            "</div>"+
            "<div id='lgSquadPanel' style='display:none'></div>"+
          "</div>"+

        "</div>"+
      "</div>";

    eid("lgBackSetup").addEventListener("click",renderSetup);
    initLgStrips(null);
    updatePitch();
    eid("lgSpinBtn").addEventListener("click",function(){ LS.pendingPick=null; doLgSpin(); });
    eid("lgAutoFill").addEventListener("click",autoFillXI);
    eid("lgSimulate").addEventListener("click",function(){
      if(LS.xi.filter(Boolean).length>=11) simulateSeason();
    });
  }

  function initLgStrips(currentSpin){
    var cStrip=eid("lgClubStrip"), yStrip=eid("lgYearStrip");
    if(!cStrip||!yStrip) return;
    if(currentSpin){
      cStrip.innerHTML='<div class="mp-reel-item landed"><span>'+esc(currentSpin.club)+'</span></div>';
      yStrip.innerHTML='<div class="mp-reel-item landed"><span>'+esc(seasonLabel(currentSpin.year))+'</span></div>';
      cStrip.style.cssText="transform:translateY(0);transition:none";
      yStrip.style.cssText="transform:translateY(0);transition:none";
      return;
    }
    var pool=getPool(), ci=[], yi=[];
    for(var i=0;i<20;i++){
      var e=pool[i%Math.max(pool.length,1)];
      ci.push('<div class="mp-reel-item"><span>'+esc(e.club)+'</span></div>');
      yi.push('<div class="mp-reel-item"><span>'+esc(seasonLabel(e.year))+'</span></div>');
    }
    cStrip.innerHTML=ci.join(""); cStrip.style.cssText="transform:translateY(0);transition:none";
    yStrip.innerHTML=yi.join(""); yStrip.style.cssText="transform:translateY(0);transition:none";
  }

  function doLgSpin(){
    if(_lgSpinning) return;
    var cStrip=eid("lgClubStrip"),yStrip=eid("lgYearStrip"),spinBtn=eid("lgSpinBtn");
    if(!cStrip) return;
    _lgSpinning=true; spinBtn.disabled=true; spinBtn.textContent="SPINNING…";
    eid("lgSquadPanel").style.display="none"; LS.currentSpin=null;

    var pool=getPool(); if(!pool.length){ _lgSpinning=false; return; }

    /* Try to pick a squad that has players fitting open slots */
    var pick, tries=0;
    do {
      pick=pool[Math.floor(Math.random()*pool.length)];
      var hasEligible=pick.squad.some(function(pl){
        return eligibleSlots(pl).length>0 && !LS.xi.some(function(x){ return x&&x.n===pl.n; });
      });
      tries++;
    } while(!hasEligible && tries<60);

    var BLUR=10, ci=[], yi=[];
    for(var i=0;i<BLUR;i++){
      var e=pool[i%pool.length];
      ci.push('<div class="mp-reel-item"><span>'+esc(e.club)+'</span></div>');
      yi.push('<div class="mp-reel-item"><span>'+esc(seasonLabel(e.year))+'</span></div>');
    }
    cStrip.innerHTML=ci.join(""); yStrip.innerHTML=yi.join("");
    cStrip.style.cssText="transform:translateY(0);transition:none";
    yStrip.style.cssText="transform:translateY(0);transition:none";

    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        var ease="cubic-bezier(0.25,0.1,0.15,1)", dur=420;
        cStrip.style.transition="transform "+dur+"ms "+ease;
        cStrip.style.transform="translateY(-"+(BLUR*LG_IH)+"px)";
        yStrip.style.transition="transform "+(dur+40)+"ms "+ease;
        yStrip.style.transform="translateY(-"+(BLUR*LG_IH)+"px)";

        setTimeout(function(){
          /* Snap to result — max 1 spin: button stays disabled until pick/skip */
          cStrip.style.transition="none"; cStrip.style.transform="translateY(0)";
          cStrip.innerHTML='<div class="mp-reel-item landed"><span>'+esc(pick.club)+'</span></div>';
          yStrip.style.transition="none"; yStrip.style.transform="translateY(0)";
          yStrip.innerHTML='<div class="mp-reel-item landed"><span>'+esc(seasonLabel(pick.year))+'</span></div>';
          _lgSpinning=false; spinBtn.disabled=true; spinBtn.textContent="Pick a player";
          LS.currentSpin=pick;
          showLgSquadPanel(pick);
        }, dur+80);
      });
    });
  }

  function showLgSquadPanel(spin){
    var panel=eid("lgSquadPanel"); if(!panel) return;
    var lineOrd={GK:0,DEF:1,MID:2,FWD:3};
    var sorted=spin.squad.slice().sort(function(a,b){
      var la=lineOrd[LINE_OF[a.gp||a.p]]||2, lb=lineOrd[LINE_OF[b.gp||b.p]]||2;
      return la!==lb?la-lb:(b.r||0)-(a.r||0);
    });

    var html='<div class="mp-sq-head">'+
      '<span class="mp-sq-title">'+esc(spin.club)+'</span>'+
      '<span class="mp-sq-hint">'+seasonLabel(spin.year)+'</span>'+
      '</div>';

    /* Position chooser */
    if(LS.pendingPick&&LS.pendingPick.spin===spin){
      var pp=LS.pendingPick.player, slots=eligibleSlots(pp);
      html+='<div class="mp-chooser">'+
        '<span class="mp-chooser-q">Where does <strong>'+esc(pp.n)+'</strong> play?</span>'+
        '<div class="mp-chooser-btns">';
      slots.forEach(function(slot){
        var lc=LINE_OF[slot]||"MID";
        html+='<button class="mp-choose-pos pos '+lc+'" data-slot="'+slot+'">'+slot+'</button>';
      });
      html+='</div><button class="mp-chooser-cancel">Cancel</button></div>';
    }

    html+='<div class="players mp-players-grid">';
    sorted.forEach(function(pl){
      var picked=LS.xi.some(function(x){ return x&&x.n===pl.n; });
      var slots=eligibleSlots(pl), noSlot=!picked&&!slots.length;
      var isPending=LS.pendingPick&&LS.pendingPick.spin===spin&&LS.pendingPick.player.n===pl.n;
      var pos=pl.gp||pl.p||"MID", lc=LINE_OF[pos]||"MID";
      var cls="player"+(picked?" taken":"")+(noSlot?" noslot":"")+(isPending?" mp-player-pending":"");
      html+='<div class="'+cls+'" data-pn="'+esc(pl.n)+'">'+
        '<span class="pos '+lc+'">'+esc(pos)+'</span>'+
        '<span class="pname">'+esc(pl.n)+'</span>'+
        (picked?'<span class="mp-locked-badge">✓</span>':
         noSlot?'<span class="slot-tag">no slot</span>':
         '<span class="mp-r-badge">'+pl.r+'</span>')+
        '</div>';
    });
    html+='</div>'+
      '<button class="lg-skip-btn" id="lgSkipSquad">Skip this squad →</button>';

    panel.innerHTML=html; panel.style.display="";

    /* Chooser handlers */
    if(LS.pendingPick&&LS.pendingPick.spin===spin){
      panel.querySelectorAll(".mp-choose-pos").forEach(function(btn){
        btn.addEventListener("click",function(){
          var slot=btn.getAttribute("data-slot"), pp=LS.pendingPick;
          LS.pendingPick=null; draftPlayer(pp.player,pp.spin,slot);
        });
      });
      var cancel=panel.querySelector(".mp-chooser-cancel");
      if(cancel) cancel.addEventListener("click",function(){
        LS.pendingPick=null; showLgSquadPanel(spin);
      });
    }

    /* Player tap */
    panel.querySelectorAll(".player:not(.taken):not(.noslot)").forEach(function(el){
      el.addEventListener("click",function(){
        var name=el.getAttribute("data-pn");
        var pl=spin.squad.filter(function(p){ return p.n===name; })[0];
        if(!pl) return;
        var slots=eligibleSlots(pl);
        if(!slots.length) return;
        if(slots.length===1){ LS.pendingPick=null; draftPlayer(pl,spin,slots[0]); }
        else { LS.pendingPick={player:pl,spin:spin}; updatePitch(); showLgSquadPanel(spin); }
      });
    });

    /* Skip squad — re-enable SPIN without drafting */
    var skipBtn=eid("lgSkipSquad");
    if(skipBtn) skipBtn.addEventListener("click",function(){
      LS.pendingPick=null; panel.style.display="none";
      var sb=eid("lgSpinBtn"); if(sb){ sb.disabled=false; sb.textContent="SPIN"; }
    });
  }

  function draftPlayer(pl, spin, slot){
    if(LS.xi.some(function(x){ return x&&x.n===pl.n; })) return;
    LS.xi.push({n:pl.n,p:pl.p||"MID",r:pl.r||75,gp:pl.gp||pl.p||"MID",slot:slot,club:spin.club,year:spin.year});
    updatePitch();
    var cnt=eid("lgPickCount"); if(cnt) cnt.textContent=LS.xi.length;
    if(LS.xi.length>=11){
      var sim=eid("lgSimulate"); if(sim) sim.disabled=false;
      var sb=eid("lgSpinBtn"); if(sb){ sb.disabled=true; sb.textContent="XI Complete ✓"; }
      var panel=eid("lgSquadPanel"); if(panel) panel.style.display="none";
    } else {
      /* Re-enable SPIN for the next pick */
      var sb2=eid("lgSpinBtn"); if(sb2){ sb2.disabled=false; sb2.textContent="SPIN"; }
      var panel2=eid("lgSquadPanel"); if(panel2) panel2.style.display="none";
    }
  }

  function updatePitch(){
    var wrap=eid("lgPitchWrap"); if(!wrap) return;
    wrap.innerHTML=buildPitch();
  }

  function buildPitch(){
    var rows=(FM_ROWS[LS.formation]||FM_ROWS["4-3-3"]).slice().reverse(); /* FWD→top */
    /* Map picks to slot pools */
    var pool={};
    LS.xi.forEach(function(pk){
      if(!pk) return;
      var s=pk.slot||pk.gp||pk.p||"MID";
      if(!pool[s]) pool[s]=[];
      pool[s].push(pk);
    });
    var draw={};
    Object.keys(pool).forEach(function(k){ draw[k]=pool[k].slice(); });

    var h='<div class="mp-pitch-visual">';
    rows.forEach(function(row){
      h+='<div class="mp-pv-row">';
      row.forEach(function(slot){
        var arr=draw[slot]||[], pk=arr.length?arr.shift():null;
        var lc=LINE_OF[slot]||"MID";
        h+='<div class="mp-pv-slot mp-pv-'+lc+(pk?" mp-pv-filled":"")+'">'+
          '<span class="mp-pv-pos">'+slot+'</span>';
        if(pk) h+='<span class="mp-pv-name">'+esc(shortName(pk.n))+'</span>'+
                   '<span class="mp-pv-rat">'+pk.r+'</span>';
        h+='</div>';
      });
      h+='</div>';
    });
    return h+'</div>';
  }

  function autoFillXI(){
    var data=LEAGUES[LS.league].getData(); if(!data) return;
    var pickedNames=LS.xi.map(function(x){ return x&&x.n; });
    /* Collect best players from all squads */
    var all=[];
    Object.keys(data).forEach(function(club){
      /* Use most recent season only per club to avoid duplicates */
      var years=Object.keys(data[club].years).sort(function(a,b){ return b-a; });
      var yr=years[0]; if(!yr) return;
      (data[club].years[yr]||[]).forEach(function(pl){
        if(pickedNames.indexOf(pl.n)===-1)
          all.push({n:pl.n,p:pl.p,gp:pl.gp,r:pl.r||75,slot:null,club:club,year:yr});
      });
    });
    all.sort(function(a,b){ return (b.r||75)-(a.r||75); });

    var counts=openSlotCounts();
    var open=[];
    Object.keys(counts).forEach(function(s){ for(var i=0;i<counts[s];i++) open.push(s); });

    open.forEach(function(slot){
      var compat=COMPAT[slot]||[slot];
      var used=LS.xi.map(function(x){ return x&&x.n; });
      var best=all.filter(function(pl){
        return compat.indexOf(pl.gp||pl.p||"MID")!==-1 && used.indexOf(pl.n)===-1;
      })[0];
      if(best) LS.xi.push({n:best.n,p:best.p,gp:best.gp,r:best.r,slot:slot,club:best.club,year:best.year});
    });

    updatePitch();
    var cnt=eid("lgPickCount"); if(cnt) cnt.textContent=LS.xi.filter(Boolean).length;
    if(LS.xi.filter(Boolean).length>=11){
      var sim=eid("lgSimulate"); if(sim) sim.disabled=false;
      var sb=eid("lgSpinBtn"); if(sb){ sb.disabled=true; sb.textContent="XI Complete ✓"; }
      var panel=eid("lgSquadPanel"); if(panel) panel.style.display="none";
    }
  }

  /* ════════════════════════════════════════
     STEP 4 — Simulate season
  ════════════════════════════════════════ */
  function simulateSeason(){
    var lc=LEAGUES[LS.league];
    var strengths=(W.LEAGUE_TEAM_STRENGTHS&&W.LEAGUE_TEAM_STRENGTHS[LS.league])||[];
    var teams=strengths.map(function(t){ return {name:t.n,str:t.s}; });

    var xiRatings=LS.xi.filter(Boolean).map(function(p){ return p.r||75; });
    var userStr=xiRatings.length
      ? Math.round(xiRatings.reduce(function(a,b){ return a+b; },0)/xiRatings.length)
      : 78;
    userStr+=(LS.mgrBonus.attack||0);

    teams.push({name:LS.teamName,str:userStr});
    var userIdx=teams.length-1, n=teams.length;

    LS.table=teams.map(function(t){ return {name:t.name,P:0,W:0,D:0,L:0,GF:0,GA:0,GD:0,Pts:0}; });
    LS.userResults=[];

    for(var i=0;i<n;i++){
      for(var j=0;j<n;j++){
        if(i===j) continue;
        var isUH=(i===userIdx), isUA=(j===userIdx);
        var mAtk=isUH?(LS.mgrBonus.attack||0):0;
        var res=simMatch(teams[i].str,teams[j].str,mAtk);
        LS.table[i].P++; LS.table[i].GF+=res.h; LS.table[i].GA+=res.a; LS.table[i].GD+=res.h-res.a;
        LS.table[j].P++; LS.table[j].GF+=res.a; LS.table[j].GA+=res.h; LS.table[j].GD+=res.a-res.h;
        if(res.h>res.a){ LS.table[i].W++; LS.table[i].Pts+=3; LS.table[j].L++; }
        else if(res.h<res.a){ LS.table[j].W++; LS.table[j].Pts+=3; LS.table[i].L++; }
        else { LS.table[i].D++; LS.table[i].Pts++; LS.table[j].D++; LS.table[j].Pts++; }
        if(isUH) LS.userResults.push({home:true, opp:teams[j].name,gf:res.h,ga:res.a});
        else if(isUA) LS.userResults.push({home:false,opp:teams[i].name,gf:res.a,ga:res.h});
      }
    }

    LS.table.sort(function(a,b){
      if(b.Pts!==a.Pts) return b.Pts-a.Pts;
      if(b.GD!==a.GD)  return b.GD-a.GD;
      return b.GF-a.GF;
    });
    renderResults();
  }

  /* ════════════════════════════════════════
     STEP 5 — Results
  ════════════════════════════════════════ */
  function renderResults(){
    var v=lgView(), lc=LEAGUES[LS.league];
    var W2=0,D=0,L=0,GF=0,GA=0;
    LS.userResults.forEach(function(r){
      GF+=r.gf; GA+=r.ga;
      if(r.gf>r.ga) W2++; else if(r.gf===r.ga) D++; else L++;
    });

    var pos=1;
    LS.table.forEach(function(row,i){ if(row.name===LS.teamName) pos=i+1; });

    var total=lc.games;
    var isPerfect=(W2===total&&D===0&&L===0);
    var isChamp=(pos===1), isTop4=(pos<=4), isRel=(pos>LS.table.length-3);

    var titleEmoji=isPerfect?"🏆🎉🎉":isChamp?"🏆":isTop4?"⭐":isRel?"😬":"✅";
    var titleText=isPerfect?"PERFECT SEASON — "+total+"-0-0!":
                  isChamp?lc.label+" Champions!":
                  isTop4?ordinal(pos)+" Place — "+lc.label:
                  isRel?ordinal(pos)+" Place — Relegation Zone":
                  ordinal(pos)+" Place";

    var resHtml="";
    LS.userResults.forEach(function(r,i){
      var wdl=r.gf>r.ga?"W":r.gf===r.ga?"D":"L";
      var cls="lgr-"+wdl.toLowerCase();
      resHtml+="<div class='lg-res-row "+cls+"'>"+
        "<span class='lgr-gw'>GW"+(i+1)+"</span>"+
        "<span class='lgr-venue'>"+(r.home?"H":"A")+"</span>"+
        "<span class='lgr-opp'>"+esc(r.opp)+"</span>"+
        "<span class='lgr-score'>"+r.gf+"–"+r.ga+"</span>"+
        "<span class='lgr-badge "+cls+"'>"+wdl+"</span>"+
        "</div>";
    });

    var tblHtml="<table class='lg-table'>"+
      "<thead><tr><th>#</th><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th>"+
      "<th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr></thead><tbody>";
    LS.table.forEach(function(row,i){
      var isUser=(row.name===LS.teamName);
      tblHtml+="<tr class='"+(isUser?"lg-tbl-user":"")+"'>"+
        "<td>"+(i+1)+"</td><td class='lg-tbl-club'>"+esc(row.name)+"</td>"+
        "<td>"+row.P+"</td><td>"+row.W+"</td><td>"+row.D+"</td><td>"+row.L+"</td>"+
        "<td>"+row.GF+"</td><td>"+row.GA+"</td>"+
        "<td>"+(row.GD>0?"+":"")+row.GD+"</td>"+
        "<td><strong>"+row.Pts+"</strong></td></tr>";
    });
    tblHtml+="</tbody></table>";

    v.innerHTML=
      "<div class='lg-results-page'>"+
        "<div class='lg-res-header'>"+
          "<div class='lg-res-title'>"+titleEmoji+" "+titleText+"</div>"+
          "<div class='lg-res-record'>"+
            "<span class='lgr-club'>"+esc(LS.teamName)+"</span>"+
            " &nbsp;·&nbsp; "+W2+"W "+D+"D "+L+"L"+
            " &nbsp;·&nbsp; "+GF+" scored, "+GA+" conceded"+
          "</div>"+
          "<div class='lg-res-btns'>"+
            "<button class='btn-primary' id='lgPlayAgain'>Play Again</button>"+
            "<button class='btn-ghost' id='lgHomeBtn'>← Home</button>"+
          "</div>"+
        "</div>"+
        "<div class='lg-res-body'>"+
          "<div class='lg-res-col'><h3 class='lg-col-hd'>Your Results</h3>"+
            "<div class='lg-res-list'>"+resHtml+"</div></div>"+
          "<div class='lg-tbl-col'><h3 class='lg-col-hd'>Final Table</h3>"+
            tblHtml+"</div>"+
        "</div>"+
      "</div>";

    eid("lgPlayAgain").addEventListener("click",W.initLeagueMode);
    eid("lgHomeBtn").addEventListener("click",goHome);
    if(isPerfect&&typeof W.triggerConfetti==="function") W.triggerConfetti();
  }

  function ordinal(n){
    var s=["th","st","nd","rd"],v=n%100;
    return n+(s[(v-20)%10]||s[v]||s[0]);
  }

})(window);
