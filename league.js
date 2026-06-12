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
    pl:         { label:"Premier League", flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", games:38, getData:function(){ return W.PL_DATA; } },
    laliga:     { label:"La Liga",    flag:"🇪🇸", games:38, getData:function(){ return W.LALIGA_DATA; } },
    seriea:     { label:"Serie A",    flag:"🇮🇹", games:38, getData:function(){ return W.SERIEA_DATA; } },
    bundesliga: { label:"Bundesliga", flag:"🇩🇪", games:34, getData:function(){ return W.BUNDESLIGA_DATA; } },
    ligue1:     { label:"Ligue 1",    flag:"🇫🇷", games:34, getData:function(){ return W.LIGUE1_DATA; } }
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
      "<h2 class='lg-title'>League Mode</h2>"+
      "<p class='lg-sub'>Spin to build an XI from real squads — then simulate a full season.</p>"+
      "<div class='lg-card-grid'>";
    Object.keys(LEAGUES).forEach(function(k){
      var lc=LEAGUES[k];
      html+="<button class='lg-card' data-league='"+k+"'>"+
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
        "<h2 class='lg-title' style='margin-top:.3rem'>"+lc.label+"</h2>"+
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
            "<button class='tg-opt"+(LS.showRatings?" active":"")+"' data-rat='show'><span class='tg-text'>Show ratings</span></button>"+
            "<button class='tg-opt"+(LS.showRatings?"":" active")+"' data-rat='hide'><span class='tg-text'>Hide ratings</span></button>"+
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
    function mgrBonusHTML(m){
      if(!m||m.id==="none") return "";
      var p=[];
      if(m.atk>0) p.push('<span class="mgr-bonus mgr-atk-pos">+'+m.atk+' ATK</span>');
      if(m.atk<0) p.push('<span class="mgr-bonus mgr-atk-neg">'+m.atk+' ATK</span>');
      if(m.def>0) p.push('<span class="mgr-bonus mgr-def-pos">+'+m.def+' DEF</span>');
      if(m.def<0) p.push('<span class="mgr-bonus mgr-def-neg">'+m.def+' DEF</span>');
      if(m.ko>0)  p.push('<span class="mgr-bonus mgr-ko-pos">+'+m.ko+' KO</span>');
      return p.length ? '<div class="mgr-bonus-row">'+p.join("")+'</div>' : "";
    }
    function refreshMgrDesc(){
      var d=eid("lgMgrDesc"); if(!d) return;
      var m=LS.manager||MGRS[0];
      if(!m||m.id==="none"){
        d.innerHTML="Pick a tactical style above, or spin for a famous manager.";
      } else {
        d.innerHTML=esc(m.emoji+" "+m.name+" — "+m.desc)+mgrBonusHTML(m);
      }
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
        var def=MGRS.filter(function(m){ return m.id==="none"; })[0]||MGRS[0];
        LS.manager=def; LS.mgrBonus={attack:0,defend:0};
      }
      renderDraftScreen();
    });
  }

  /* ════════════════════════════════════════
     STEP 3 — Spin & Draft (WC-style layout)
  ════════════════════════════════════════ */
  var _lgSpinning=false;
  var LG_IH=56;

  /* Reel item — no flag emoji in League mode (flags are kept only in World Cup mode) */
  function lgClubItemHTML(c){
    return '<div class="reel-item reel-item-noflag"><span class="name">'+esc(c)+'</span></div>';
  }
  function lgYearItemHTML(y){
    return '<div class="reel-item"><span class="year">'+seasonLabel(y)+'</span></div>';
  }

  /* WC-style pitch: .pitch > .pitch-row > .pdot */
  function buildPitch(){
    var rows=(FM_ROWS[LS.formation]||FM_ROWS["4-3-3"]).slice().reverse();
    var pool={};
    LS.xi.forEach(function(pk){
      if(!pk) return;
      var s=pk.slot||pk.gp||pk.p||"MID";
      if(!pool[s]) pool[s]=[];
      pool[s].push(pk);
    });
    var draw={};
    Object.keys(pool).forEach(function(k){ draw[k]=pool[k].slice(); });

    var h='<div class="pitch">';
    rows.forEach(function(row){
      h+='<div class="pitch-row">';
      row.forEach(function(slot){
        var arr=draw[slot]||[], pk=arr.length?arr.shift():null;
        var lc=LINE_OF[slot]||"MID";
        if(pk){
          var sn=shortName(pk.n);
          h+='<div class="pdot filled '+lc+'">'+
            '<span class="dot-pos">'+(LS.showRatings && pk.r ? pk.r : slot)+'</span>'+
            '<span class="dot-name">'+esc(sn)+'</span>'+
            '</div>';
        } else {
          h+='<div class="pdot '+lc+'"><span class="dot-pos">'+slot+'</span></div>';
        }
      });
      h+='</div>';
    });
    return h+'</div>';
  }

  /* XI list grouped by line */
  function renderLgXiList(el){
    if(!el) return;
    var fmRows=FM_ROWS[LS.formation]||FM_ROWS["4-3-3"];
    var bySlot={};
    LS.xi.forEach(function(pk){
      var s=pk.slot||pk.gp||pk.p||"MID";
      if(!bySlot[s]) bySlot[s]=[];
      bySlot[s].push(pk);
    });
    function pop(s){ var a=bySlot[s]; return a&&a.length?a.shift():null; }

    var allLines=[["GK"]].concat(fmRows.slice(1));
    var lineNames=["Goalkeeper","Defence","Midfield","Attack"];
    while(lineNames.length<allLines.length) lineNames.push("Attack");

    var html="";
    allLines.forEach(function(row,li){
      html+='<div class="line-label">'+(lineNames[li]||"")+'</div>';
      row.forEach(function(slot){
        var lc=LINE_OF[slot]||"MID";
        var pk=pop(slot);
        if(pk){
          html+='<div class="xi-row"><span class="pos '+lc+'">'+slot+'</span>'+
            '<span class="info"><span class="pn">'+esc(pk.n)+'</span>'+
            '<span class="meta">'+esc(pk.club||"")+(pk.year?' &middot; '+seasonLabel(pk.year):'')+'</span></span></div>';
        } else {
          html+='<div class="xi-row empty"><span class="pos '+lc+'">'+slot+'</span>'+
            '<span class="info"><span class="pn slot-empty">'+slot+' — empty</span></span></div>';
        }
      });
    });
    el.innerHTML=html;
  }

  /* Position full names for chooser */
  var LG_POS_FULL={
    GK:"Goalkeeper",CB:"Centre Back",RB:"Right Back",LB:"Left Back",
    RWB:"Right Wing-Back",LWB:"Left Wing-Back",CDM:"Defensive Mid",
    CM:"Central Mid",CAM:"Attacking Mid",RM:"Right Mid",LM:"Left Mid",
    RW:"Right Wing",LW:"Left Wing",ST:"Striker"
  };

  function renderDraftScreen(){
    LS.xi=[]; LS.currentSpin=null; LS.pendingPick=null; _lgSpinning=false;
    LS.rerolls=5;   /* reroll budget for the whole draft */
    LS.scoreSaved=false;
    var v=lgView(), lc=LEAGUES[LS.league];

    v.innerHTML=
      "<button class='back' id='lgBackSetup'>← Setup</button>"+
      "<div class='wrap'>"+
        /* WC-style draft-head: team info left, pitch right */
        "<div class='draft-head'>"+
          "<div class='draft-head-info'>"+
            "<div class='draft-team'>"+esc(LS.teamName)+"</div>"+
            "<div class='draft-meta'>"+
              esc(LS.formation)+
              (LS.manager?" &middot; "+LS.manager.emoji+" "+esc(LS.manager.name):"")+
              " &middot; <span id='lgPickCount'>0</span>/11"+
            "</div>"+
          "</div>"+
          "<div class='draft-pitch-wrap' id='lgPitchWrap'></div>"+
        "</div>"+
        /* WC-style machine */
        "<div class='machine' aria-label='Slot machine'>"+
          "<div class='reels'>"+
            "<div class='reel-box'>"+
              "<div class='reel-label'>Club</div>"+
              "<div class='reel'><div class='reel-strip' id='lgCS'></div></div>"+
            "</div>"+
            "<div class='reel-box'>"+
              "<div class='reel-label'>Season</div>"+
              "<div class='reel'><div class='reel-strip' id='lgYS'></div></div>"+
            "</div>"+
          "</div>"+
          "<div class='controls'>"+
            "<button class='spin' id='lgSpinBtn'>SPIN</button>"+
            "<button class='reroll' id='lgReroll' hidden>Reroll (<span id='lgRerollCount'>"+LS.rerolls+"</span>)</button>"+
          "</div>"+
        "</div>"+
        /* Squad panel */
        "<section class='squad' id='lgSquadPanel' style='display:none'></section>"+
        /* XI section */
        "<section class='xi'>"+
          "<div class='xi-head'>"+
            "<h2>Your XI</h2>"+
            "<div><span class='count' id='lgXiCount'>0/11</span>"+
            " <span class='formation'>· "+esc(LS.formation)+"</span></div>"+
          "</div>"+
          "<div class='xi-list' id='lgXiList'></div>"+
          "<div class='xi-actions' style='margin-top:.8rem'>"+
            "<button class='btn-accent' id='lgAutoFill'>Auto-fill XI</button>"+
            "<button class='btn-primary' id='lgSimulate' disabled>Simulate Season →</button>"+
          "</div>"+
        "</section>"+
      "</div>";

    eid("lgBackSetup").addEventListener("click",renderSetup);
    initLgStrips(null);
    updatePitch();
    renderLgXiList(eid("lgXiList"));
    eid("lgSpinBtn").addEventListener("click",function(){ LS.pendingPick=null; doLgSpin(); });
    eid("lgReroll").addEventListener("click",function(){
      if(LS.rerolls<=0 || _lgSpinning) return;
      LS.rerolls--;
      var rc=eid("lgRerollCount"); if(rc) rc.textContent=LS.rerolls;
      LS.pendingPick=null; doLgSpin();
    });
    eid("lgAutoFill").addEventListener("click",autoFillXI);
    eid("lgSimulate").addEventListener("click",function(){
      if(LS.xi.filter(Boolean).length>=11) simulateSeason();
    });
  }

  function initLgStrips(currentSpin){
    var cStrip=eid("lgCS"), yStrip=eid("lgYS");
    if(!cStrip||!yStrip) return;
    if(currentSpin){
      cStrip.innerHTML=lgClubItemHTML(currentSpin.club);
      yStrip.innerHTML=lgYearItemHTML(currentSpin.year);
      cStrip.style.cssText="transform:translateY(0);transition:none";
      yStrip.style.cssText="transform:translateY(0);transition:none";
      return;
    }
    var pool=getPool(), ci=[], yi=[];
    for(var i=0;i<20;i++){
      var e=pool[i%Math.max(pool.length,1)];
      ci.push(lgClubItemHTML(e.club));
      yi.push(lgYearItemHTML(e.year));
    }
    cStrip.innerHTML=ci.join(""); cStrip.style.cssText="transform:translateY(0);transition:none";
    yStrip.innerHTML=yi.join(""); yStrip.style.cssText="transform:translateY(0);transition:none";
  }

  function doLgSpin(){
    if(_lgSpinning) return;
    if(W.sfx) W.sfx.spin();
    var cStrip=eid("lgCS"),yStrip=eid("lgYS"),spinBtn=eid("lgSpinBtn");
    if(!cStrip) return;
    _lgSpinning=true; spinBtn.disabled=true; spinBtn.textContent="SPINNING…";
    var rrBtn=eid("lgReroll"); if(rrBtn) rrBtn.hidden=true;
    eid("lgSquadPanel").style.display="none"; LS.currentSpin=null;

    var pool=getPool(); if(!pool.length){ _lgSpinning=false; return; }

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
      ci.push(lgClubItemHTML(e.club));
      yi.push(lgYearItemHTML(e.year));
    }
    ci.push(lgClubItemHTML(pick.club));
    yi.push(lgYearItemHTML(pick.year));

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
          cStrip.style.transition="none"; cStrip.style.transform="translateY(0)";
          cStrip.innerHTML=lgClubItemHTML(pick.club);
          yStrip.style.transition="none"; yStrip.style.transform="translateY(0)";
          yStrip.innerHTML=lgYearItemHTML(pick.year);
          _lgSpinning=false; spinBtn.disabled=true; spinBtn.textContent="Pick a player";
          LS.currentSpin=pick;
          var rb=eid("lgReroll");
          if(rb){ rb.hidden=(LS.rerolls<=0); var rc=eid("lgRerollCount"); if(rc) rc.textContent=LS.rerolls; }
          showLgSquadPanel(pick);
        }, dur+80);
      });
    });
  }

  function closeLgModal(){
    var panel=eid("lgSquadPanel");
    if(panel){ panel.style.display="none"; panel.className="squad"; }
    LS.pendingPick=null;
    var sb=eid("lgSpinBtn"); if(sb&&LS.xi.length<11){ sb.disabled=false; sb.textContent="SPIN"; }
    var rb=eid("lgReroll"); if(rb) rb.hidden=(LS.rerolls<=0||LS.xi.length>=11);
  }

  /* Scrollable modal squad selector — full names always readable (38-0 style) */
  function showLgSquadPanel(spin){
    var panel=eid("lgSquadPanel"); if(!panel) return;
    var lineOrd={GK:0,DEF:1,MID:2,FWD:3};
    var sorted=spin.squad.slice().sort(function(a,b){
      var la=lineOrd[LINE_OF[a.gp||a.p]]||2, lb=lineOrd[LINE_OF[b.gp||b.p]]||2;
      return la!==lb?la-lb:(b.r||0)-(a.r||0);
    });
    var pp=(LS.pendingPick&&LS.pendingPick.spin===spin)?LS.pendingPick.player:null;

    var html='<div class="lg-modal">';
    html+='<div class="lg-modal-head">'+
      '<div class="lg-modal-title">'+esc(spin.club)+' <span class="lg-modal-yr">'+seasonLabel(spin.year)+'</span></div>'+
      '<button class="lg-modal-close" id="lgModalClose" aria-label="Close">✕</button>'+
      '</div>';

    if(pp){
      var slots=eligibleSlots(pp);
      html+='<div class="lg-modal-chooser"><div class="lg-mc-q">Where does <strong>'+esc(pp.n)+'</strong> play?</div><div class="lg-mc-btns">';
      slots.forEach(function(slot){
        var lc=LINE_OF[slot]||"MID";
        html+='<button class="mp-choose-pos pos '+lc+'" data-slot="'+slot+'">'+(LG_POS_FULL[slot]||slot)+' <span>('+slot+')</span></button>';
      });
      html+='</div><button class="lg-mc-cancel" id="lgMcCancel">Cancel</button></div>';
    } else {
      html+='<div class="lg-modal-hint">Scroll and tap a player to place them</div>';
    }

    html+='<div class="lg-modal-list">';
    sorted.forEach(function(pl){
      var picked=LS.xi.some(function(x){ return x&&x.n===pl.n; });
      var slots=eligibleSlots(pl), noSlot=!picked&&!slots.length;
      var isPending=pp&&pp.n===pl.n;
      var pos=pl.gp||pl.p||"MID", lc=LINE_OF[pos]||"MID";
      var cls="lg-msel-row"+(picked?" taken":"")+(noSlot?" noslot":"")+(isPending?" pending":"");
      html+='<div class="'+cls+'" data-pn="'+esc(pl.n)+'">'+
        '<span class="pos '+lc+'">'+esc(pos)+'</span>'+
        '<span class="lg-msel-name">'+esc(pl.n)+'</span>'+
        (picked?'<span class="lg-msel-tag done">✓ picked</span>':
         noSlot?'<span class="lg-msel-tag">no slot</span>':
         (LS.showRatings?'<span class="lg-msel-rat">'+pl.r+'</span>':''))+
        '</div>';
    });
    html+='</div>';

    html+='<div class="lg-modal-foot">'+
      (LS.rerolls>0?'<button class="btn-ghost lg-modal-reroll" id="lgModalReroll">🎲 Reroll ('+LS.rerolls+')</button>':'')+
      '<button class="btn-ghost" id="lgModalSkip">Skip squad →</button>'+
      '</div>';
    html+='</div>'; /* .lg-modal */

    panel.innerHTML=html;
    panel.className="lg-modal-overlay";
    panel.style.display="";

    /* Chooser handlers */
    if(pp){
      panel.querySelectorAll(".mp-choose-pos").forEach(function(btn){
        btn.addEventListener("click",function(){
          var slot=btn.getAttribute("data-slot"), p=LS.pendingPick;
          LS.pendingPick=null; draftPlayer(p.player,p.spin,slot);
        });
      });
      var cancel=eid("lgMcCancel");
      if(cancel) cancel.addEventListener("click",function(){ LS.pendingPick=null; updatePitch(); showLgSquadPanel(spin); });
    }

    /* Row tap → show chooser */
    panel.querySelectorAll(".lg-msel-row:not(.taken):not(.noslot)").forEach(function(el){
      el.addEventListener("click",function(){
        var name=el.getAttribute("data-pn");
        var pl=spin.squad.filter(function(p){ return p.n===name; })[0];
        if(!pl || !eligibleSlots(pl).length) return;
        LS.pendingPick={player:pl,spin:spin};
        updatePitch();
        showLgSquadPanel(spin);
        var list=panel.querySelector(".lg-modal-list"); if(list) list.scrollTop=0;
      });
    });

    var closeB=eid("lgModalClose"); if(closeB) closeB.addEventListener("click",closeLgModal);
    var skipB=eid("lgModalSkip");   if(skipB) skipB.addEventListener("click",closeLgModal);
    var rrB=eid("lgModalReroll");
    if(rrB) rrB.addEventListener("click",function(){
      if(LS.rerolls<=0||_lgSpinning) return;
      LS.rerolls--; LS.pendingPick=null; closeLgModal(); doLgSpin();
    });
    /* tap backdrop to close */
    panel.addEventListener("click",function(e){ if(e.target===panel) closeLgModal(); });
  }

  function draftPlayer(pl, spin, slot){
    if(LS.xi.some(function(x){ return x&&x.n===pl.n; })) return;
    if(W.sfx) W.sfx.pick();
    LS.xi.push({n:pl.n,p:pl.p||"MID",r:pl.r||75,gp:pl.gp||pl.p||"MID",slot:slot,club:spin.club,year:spin.year});
    updatePitch();
    var cnt=eid("lgPickCount"); if(cnt) cnt.textContent=LS.xi.length;
    var cntXi=eid("lgXiCount"); if(cntXi) cntXi.textContent=LS.xi.length+"/11";
    renderLgXiList(eid("lgXiList"));
    if(LS.xi.length>=11){
      var sim=eid("lgSimulate"); if(sim) sim.disabled=false;
      var sb=eid("lgSpinBtn"); if(sb){ sb.disabled=true; sb.textContent="XI Complete ✓"; }
      var panel=eid("lgSquadPanel"); if(panel) panel.style.display="none";
    } else {
      var sb2=eid("lgSpinBtn"); if(sb2){ sb2.disabled=false; sb2.textContent="SPIN"; }
      var panel2=eid("lgSquadPanel"); if(panel2) panel2.style.display="none";
    }
  }

  function updatePitch(){
    var wrap=eid("lgPitchWrap"); if(!wrap) return;
    wrap.innerHTML=buildPitch();
  }

  function autoFillXI(){
    var data=LEAGUES[LS.league].getData(); if(!data) return;
    var pickedNames=LS.xi.map(function(x){ return x&&x.n; });
    var all=[];
    // Include ALL years per club, not just the latest, for genuine variety
    Object.keys(data).forEach(function(club){
      Object.keys(data[club].years).forEach(function(yr){
        (data[club].years[yr]||[]).forEach(function(pl){
          if(pickedNames.indexOf(pl.n)===-1)
            all.push({n:pl.n,p:pl.p,gp:pl.gp,r:pl.r||75,slot:null,club:club,year:yr});
        });
      });
    });
    // Shuffle fully rather than sorting by rating so picks are spread across eras/clubs
    for(var i=all.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var tmp=all[i]; all[i]=all[j]; all[j]=tmp; }

    var counts=openSlotCounts();
    var open=[];
    Object.keys(counts).forEach(function(s){ for(var i=0;i<counts[s];i++) open.push(s); });

    open.forEach(function(slot){
      var compat=COMPAT[slot]||[slot];
      var used=LS.xi.map(function(x){ return x&&x.n; });
      var pick=all.filter(function(pl){
        return compat.indexOf(pl.gp||pl.p||"MID")!==-1 && used.indexOf(pl.n)===-1;
      })[0];
      if(pick) LS.xi.push({n:pick.n,p:pick.p,gp:pick.gp,r:pick.r,slot:slot,club:pick.club,year:pick.year});
    });

    updatePitch();
    var cnt=eid("lgPickCount"); if(cnt) cnt.textContent=LS.xi.filter(Boolean).length;
    var cntXi=eid("lgXiCount"); if(cntXi) cntXi.textContent=LS.xi.filter(Boolean).length+"/11";
    renderLgXiList(eid("lgXiList"));
    if(LS.xi.filter(Boolean).length>=11){
      var sim=eid("lgSimulate"); if(sim) sim.disabled=false;
      var sb=eid("lgSpinBtn"); if(sb){ sb.disabled=true; sb.textContent="XI Complete ✓"; }
      var panel=eid("lgSquadPanel"); if(panel) panel.style.display="none";
    }
  }

  /* ════════════════════════════════════════
     STEP 4 — Simulate season
  ════════════════════════════════════════ */
  /* Realistic Poisson (~1.4 goals/game avg). Makes a perfect record very rare. */
  function simMatch(homeStr, awayStr){
    var BASE=80;
    var hPow=Math.pow(Math.max(homeStr,40)/BASE, 2.2);
    var aPow=Math.pow(Math.max(awayStr,40)/BASE, 2.2);
    var ha=Math.max(0.25, 1.4*hPow + 0.25); /* home advantage */
    var aa=Math.max(0.25, 1.2*aPow);
    return { h:poisson(ha), a:poisson(aa) };
  }

  function simulateSeason(){
    var lc=LEAGUES[LS.league];
    var strengths=(W.LEAGUE_TEAM_STRENGTHS&&W.LEAGUE_TEAM_STRENGTHS[LS.league])||[];
    /* Season is a double round-robin: total games = 2 × opponents.
       Trim opponents so the user plays exactly lc.games (e.g. 38 → 19 opponents + user = 20 teams). */
    var oppCount=Math.round(lc.games/2);
    var teams=strengths.slice(0,oppCount).map(function(t){ return {name:t.n,str:t.s}; });

    var xiRatings=LS.xi.filter(Boolean).map(function(p){ return p.r||75; });
    var userStr=xiRatings.length
      ? Math.round(xiRatings.reduce(function(a,b){ return a+b; },0)/xiRatings.length)
      : 78;
    /* Cap manager bonus contribution to avoid trivial dominance */
    userStr = Math.min(92, userStr + Math.round((LS.mgrBonus.attack||0)*0.6));

    teams.push({name:LS.teamName,str:userStr});
    var userIdx=teams.length-1, n=teams.length;

    LS.userStr=userStr;          /* mutable — surprise events recompute remaining games from this */
    LS.fixtures=[];              /* per user game: {opp, home, oppStr} */
    LS.eventsLeft=3;             /* max surprise events per season */
    LS.table=teams.map(function(t){ return {name:t.name,P:0,W:0,D:0,L:0,GF:0,GA:0,GD:0,Pts:0,str:t.str}; });
    LS.userResults=[];

    for(var i=0;i<n;i++){
      for(var j=0;j<n;j++){
        if(i===j) continue;
        var res=simMatch(teams[i].str, teams[j].str);
        LS.table[i].P++; LS.table[i].GF+=res.h; LS.table[i].GA+=res.a; LS.table[i].GD+=res.h-res.a;
        LS.table[j].P++; LS.table[j].GF+=res.a; LS.table[j].GA+=res.h; LS.table[j].GD+=res.a-res.h;
        if(res.h>res.a){ LS.table[i].W++; LS.table[i].Pts+=3; LS.table[j].L++; }
        else if(res.h<res.a){ LS.table[j].W++; LS.table[j].Pts+=3; LS.table[i].L++; }
        else { LS.table[i].D++; LS.table[i].Pts++; LS.table[j].D++; LS.table[j].Pts++; }
        if(i===userIdx){ LS.userResults.push({home:true, opp:teams[j].name,gf:res.h,ga:res.a}); LS.fixtures.push({opp:teams[j].name,home:true,oppStr:teams[j].str}); }
        else if(j===userIdx){ LS.userResults.push({home:false,opp:teams[i].name,gf:res.a,ga:res.h}); LS.fixtures.push({opp:teams[i].name,home:false,oppStr:teams[i].str}); }
      }
    }
    for(var si=LS.fixtures.length-1;si>0;si--){
      var sj=Math.floor(Math.random()*(si+1));
      var tf=LS.fixtures[si]; LS.fixtures[si]=LS.fixtures[sj]; LS.fixtures[sj]=tf;
      var tr=LS.userResults[si]; LS.userResults[si]=LS.userResults[sj]; LS.userResults[sj]=tr;
    }

    LS.table.sort(function(a,b){
      if(b.Pts!==a.Pts) return b.Pts-a.Pts;
      if(b.GD!==a.GD)  return b.GD-a.GD;
      return b.GF-a.GF;
    });

    /* Expected position: rank user strength vs all teams */
    var allStr=teams.map(function(t){ return t.str; }).sort(function(a,b){ return b-a; });
    LS.expectedPos=allStr.indexOf(userStr)+1;
    LS.squadRating=userStr;

    /* Build per-player season stats, scorers per match, clean sheets, streak */
    _lgBuildSeasonStats();

    /* Begin game-by-game reveal (WC-style) */
    LS.reveal={ shown:0, stage:"reveal" };
    renderSeasonReveal();
  }

  function _lgLineOf(p){ return LINE_OF[p.slot||p.gp||p.p]||"MID"; }

  /* Generate goalscorers/assists for ONE match using the current XI */
  function _lgGenMatchScorers(m){
    var xi=LS.xi.filter(Boolean);
    function pick(weightFn){
      var tot=0, ws=xi.map(function(p){ var w=weightFn(_lgLineOf(p)); tot+=w; return w; });
      if(tot<=0) return xi[0];
      var r=Math.random()*tot, acc=0;
      for(var i=0;i<xi.length;i++){ acc+=ws[i]; if(r<=acc) return xi[i]; }
      return xi[xi.length-1];
    }
    var goalW  =function(l){ return l==="FWD"?10:l==="MID"?5:l==="DEF"?1.4:0.05; };
    var assistW=function(l){ return l==="MID"?6:l==="FWD"?4:l==="DEF"?2:0.2; };
    m.scorers=[];
    for(var g=0; g<m.gf; g++){
      var sc=pick(goalW), mn=1+Math.floor(Math.random()*90), as=null, tries=0;
      if(Math.random()<0.6){ do{ as=pick(assistW); tries++; }while(as&&as.n===sc.n&&tries<5); if(!(as&&as.n!==sc.n)) as=null; }
      m.scorers.push({ n:sc.n, min:mn, assist:as?as.n:null });
    }
    m.scorers.sort(function(a,b){ return a.min-b.min; });
  }

  /* Tally season player stats + totals from whatever scorers exist on each match */
  function _lgTallyStats(){
    var xi=LS.xi.filter(Boolean);
    LS.playerStats={};
    xi.forEach(function(p){ LS.playerStats[p.n]={ n:p.n, gp:(p.slot||p.gp||p.p), line:_lgLineOf(p), r:p.r||75, club:p.club, year:p.year, G:0, A:0, CS:0 }; });
    var best=0,cur=0,cs=0;
    LS.userResults.forEach(function(m){
      (m.scorers||[]).forEach(function(s){
        if(LS.playerStats[s.n]) LS.playerStats[s.n].G++;
        if(s.assist&&LS.playerStats[s.assist]) LS.playerStats[s.assist].A++;
      });
      if(m.ga===0){ cs++; xi.forEach(function(p){ var l=_lgLineOf(p); if(l==="GK"||l==="DEF") LS.playerStats[p.n].CS++; }); }
      if(m.gf>m.ga){ cur++; if(cur>best) best=cur; } else cur=0;
    });
    LS.totalCleanSheets=cs; LS.longestStreak=best;
  }

  function _lgBuildSeasonStats(){
    LS.userResults.forEach(function(m){ _lgGenMatchScorers(m); });
    _lgTallyStats();
  }

  /* Recompute the user's strength from the current XI + manager (after a swap) */
  function _lgRecomputeUserStr(){
    var rs=LS.xi.filter(Boolean).map(function(p){ return p.r||75; });
    var base=rs.length?Math.round(rs.reduce(function(a,b){ return a+b; },0)/rs.length):78;
    LS.userStr=Math.min(92, base + Math.round((LS.mgrBonus.attack||0)*0.6));
  }

  /* Re-simulate the user's games from startIdx with the (possibly changed) XI/manager */
  function _lgResimFrom(startIdx){
    function row(name){ for(var i=0;i<LS.table.length;i++) if(LS.table[i].name===name) return LS.table[i]; return null; }
    function applyGame(u,o,ug,og,sign){
      if(!u||!o) return;
      u.GF+=sign*ug; u.GA+=sign*og; u.GD+=sign*(ug-og);
      o.GF+=sign*og; o.GA+=sign*ug; o.GD+=sign*(og-ug);
      if(ug>og){ u.W+=sign; u.Pts+=sign*3; o.L+=sign; }
      else if(ug<og){ o.W+=sign; o.Pts+=sign*3; u.L+=sign; }
      else { u.D+=sign; u.Pts+=sign; o.D+=sign; o.Pts+=sign; }
    }
    var uRow=row(LS.teamName);
    for(var k=startIdx;k<LS.userResults.length;k++){
      var fx=LS.fixtures[k]; if(!fx) continue;
      var old=LS.userResults[k], oRow=row(fx.opp);
      applyGame(uRow,oRow,old.gf,old.ga,-1);
      var nr=fx.home?simMatch(LS.userStr,fx.oppStr):simMatch(fx.oppStr,LS.userStr);
      var ug=fx.home?nr.h:nr.a, og=fx.home?nr.a:nr.h;
      applyGame(uRow,oRow,ug,og,1);
      LS.userResults[k]={home:fx.home,opp:fx.opp,gf:ug,ga:og};
      _lgGenMatchScorers(LS.userResults[k]);
    }
    LS.table.sort(function(a,b){ if(b.Pts!==a.Pts) return b.Pts-a.Pts; if(b.GD!==a.GD) return b.GD-a.GD; return b.GF-a.GF; });
    _lgTallyStats();
  }

  /* ════════════════════════════════════════
     STEP 4b — Game-by-game reveal (WC-style)
  ════════════════════════════════════════ */
  var _lgRevealTimer=null;

  function lgMatchCardHTML(r, gw){
    var cls=r.gf>r.ga?"W":r.gf===r.ga?"D":"L";
    var scorers="";
    if(r.scorers&&r.scorers.length){
      scorers="<div class='mscorers'>"+r.scorers.map(function(s){
        return "<span class='goal'>⚽ "+esc(shortName(s.n))+" "+s.min+"'</span>";
      }).join("")+"</div>";
    }
    return "<div class='mcard "+cls+"'>"+
      "<div class='mcard-top'>"+
        "<span class='mround'>GW"+gw+" · "+(r.home?"Home":"Away")+"</span>"+
        "<span class='pill "+cls+"'>"+cls+"</span>"+
      "</div>"+
      "<div class='mscore'>"+
        "<span class='me'>"+esc(LS.teamName)+"</span> "+
        "<b>"+r.gf+"–"+r.ga+"</b> "+
        "<span class='oppname'>"+esc(r.opp)+"</span>"+
      "</div>"+
      scorers+
    "</div>";
  }

  /* Running W-D-L-Pts tally up to a given number of games */
  function lgTallyTo(n){
    var W2=0,D=0,L=0,GF=0,GA=0,Pts=0;
    for(var i=0;i<n&&i<LS.userResults.length;i++){
      var r=LS.userResults[i];
      GF+=r.gf; GA+=r.ga;
      if(r.gf>r.ga){ W2++; Pts+=3; }
      else if(r.gf===r.ga){ D++; Pts++; }
      else L++;
    }
    return {W:W2,D:D,L:L,GF:GF,GA:GA,Pts:Pts};
  }

  function scheduleLgReveal(){
    clearTimeout(_lgRevealTimer);
    var rv=LS.reveal, total=LS.userResults.length;
    if(rv.stage!=="reveal" || rv.shown>=total || rv.event) return;
    var delay=Math.max(150, Math.min(420, Math.round(10000/total)));
    _lgRevealTimer=setTimeout(function(){
      LS.reveal.shown++;
      /* Roll for a surprise event (after a few games, never on the last two) */
      if(LS.eventsLeft>0 && LS.reveal.shown>=4 && LS.reveal.shown<=total-2 && Math.random()<(W.__LG_EVT_TEST?1:0.025)){
        LS.eventsLeft--; LS.reveal.event=_lgMakeEvent();
      }
      renderSeasonReveal();
    }, delay);
  }

  /* Build a random surprise event */
  function _lgMakeEvent(){
    if(LS.manager && LS.manager.id !== "none" && Math.random()<0.4){
      var reasons=["has been SACKED after a poor run","has SShockingly resigned","was sacked by the board","walked out for a rival club"];
      return { type:"manager", reason: reasons[Math.floor(Math.random()*reasons.length)].replace("SS","s") };
    }
    var xi=LS.xi.filter(Boolean);
    var victim=xi[Math.floor(Math.random()*xi.length)];
    var rs=["has suffered a season-ending injury","has been SOLD on deadline day","has left — a release clause was triggered","is out injured for the rest of the run-in"];
    return { type:"player", reason: rs[Math.floor(Math.random()*rs.length)], victim:victim, stage:"announce" };
  }

  function renderSeasonReveal(){
    var v=lgView(), lc=LEAGUES[LS.league], rv=LS.reveal;
    var total=LS.userResults.length;

    if(rv.stage==="reveal"){
      var t=lgTallyTo(rv.shown);
      var done=rv.shown>=total;
      var bar=done
        ? "<div class='reveal-bar'><button class='start-btn' id='lgToResult'>See your result →</button></div>"
        : "<div class='reveal-bar'><span class='reveal-count'>"+rv.shown+" / "+total+" games</span>"+
          "<button class='btn-ghost' id='lgSkipReveal'>Skip</button></div>";

      /* revealed cards, newest first */
      var cards="";
      for(var i=rv.shown-1;i>=0;i--) cards+=lgMatchCardHTML(LS.userResults[i], i+1);

      v.innerHTML=
        "<div class='wrap'>"+
          "<button class='back' id='lgRevealBack'>← Quit season</button>"+
          "<h2 class='lg-title' style='margin-top:.2rem'>"+esc(LS.teamName)+" — "+lc.label+"</h2>"+
          "<div class='stage-badge'>Your season · game by game</div>"+
          "<div class='lg-live-tally'>"+
            "<span class='lt-rec'>"+t.W+"-"+t.D+"-"+t.L+"</span>"+
            "<span class='lt-pts'>"+t.Pts+" pts</span>"+
            "<span class='lt-gd'>"+t.GF+"–"+t.GA+"</span>"+
          "</div>"+
          bar+
          "<div class='journey'>"+cards+"</div>"+
        "</div>";

      eid("lgRevealBack").addEventListener("click",function(){ clearTimeout(_lgRevealTimer); goHome(); });
      var sk=eid("lgSkipReveal");
      if(sk) sk.addEventListener("click",function(){ clearTimeout(_lgRevealTimer); LS.reveal.shown=total; renderSeasonReveal(); });
      var tr=eid("lgToResult");
      if(tr) tr.addEventListener("click",function(){ clearTimeout(_lgRevealTimer); if(window.scrollTo) window.scrollTo(0,0); renderResults(); });

      if(rv.event){ renderLgEventModal(); }
      else if(!done){ scheduleLgReveal(); }
      return;
    }
  }

  /* Simple, background-safe spin (setInterval) that cycles options then settles */
  function _lgSpinReel(stripEl, items, finalIdx, onDone){
    if(!stripEl){ onDone&&onDone(); return; }
    var i=0, ticks=0, totalTicks=18+Math.floor(Math.random()*6);
    var timer=setInterval(function(){
      stripEl.innerHTML=items[i%items.length];
      i++; ticks++;
      if(ticks>=totalTicks){ clearInterval(timer); stripEl.innerHTML=items[finalIdx]; onDone&&onDone(); }
    }, 70);
  }

  function _lgResumeAfterEvent(){
    var ov=document.getElementById("lgEventOverlay"); if(ov) ov.remove();
    LS.reveal.event=null;
    _lgRecomputeUserStr();
    _lgResimFrom(LS.reveal.shown);   /* remaining games reflect the change */
    renderSeasonReveal();
  }

  function _lgEventOverlay(){
    var panel=document.getElementById("lgEventOverlay");
    if(!panel){ panel=document.createElement("div"); panel.id="lgEventOverlay"; (lgView()||document.body).appendChild(panel); }
    panel.className="lg-modal-overlay"; panel.style.display="";
    return panel;
  }

  /* The surprise-event popup (manager replacement OR player replacement) */
  function renderLgEventModal(){
    var panel=_lgEventOverlay();
    var ev=LS.reveal.event, MGRS=W.WCXI_MANAGERS||[], MGRS_DB=W.WCXI_MANAGERS_DB||[];

    if(ev.type==="manager"){
      var prevMgrStyle = (LS.manager && LS.manager.name) || "No style";
      var prevMgrName  = LS.mgrName || (LS.manager && LS.manager.name) || "Your manager";
      var prevAtk = (LS.mgrBonus && LS.mgrBonus.attack) || 0;
      var prevDef = (LS.mgrBonus && LS.mgrBonus.defend) || 0;
      var html="<div class='lg-modal lg-event'>"+
        "<div class='lg-event-title'>Manager out!</div>"+
        "<div class='lg-event-body'><strong>"+esc(prevMgrName)+"</strong> "+esc(ev.reason)+". Spin to appoint a replacement.</div>"+
        "<div class='reel mgr-reel lg-event-reel'><div class='reel-strip' id='lgEvtStrip'></div></div>"+
        "<button class='start-btn' id='lgEvtSpin'>Spin for new manager</button>"+
        "</div>";
      panel.innerHTML=html; panel.className="lg-modal-overlay"; panel.style.display="";
      var strip=eid("lgEvtStrip");
      var pick=MGRS_DB[Math.floor(Math.random()*MGRS_DB.length)];
      function mgrHTML(d){ var s=MGRS.filter(function(m){return m.id===d.s;})[0]||MGRS[0]||{emoji:"",name:""}; return "<div class='reel-item mgr-item'><span class='mgr-name-big'>"+esc(d.n)+"</span><span class='mgr-style-tag'>"+s.name+"</span></div>"; }
      var items=MGRS_DB.slice(0,14).map(mgrHTML); items.push(mgrHTML(pick));
      if(strip) strip.innerHTML=mgrHTML(MGRS_DB[0]);
      eid("lgEvtSpin").addEventListener("click",function(){
        var b=eid("lgEvtSpin"); b.disabled=true; b.textContent="Spinning…";
        _lgSpinReel(strip, items, items.length-1, function(){
          var s=MGRS.filter(function(m){return m.id===pick.s;})[0]||MGRS[0];
          LS.manager=s; LS.mgrName=pick.n; LS.mgrBonus={attack:s.atk||0,defend:s.def||0};
          try{ localStorage.setItem("wcxi_manager",JSON.stringify({id:s.id,name:pick.n})); }catch(e){}
          /* Before/after comparison */
          var newAtk=s.atk||0, newDef=s.def||0;
          function bonusBadge(v){ return '<span class="lge-delta '+(v>0?"pos":v<0?"neg":"neu")+'">'+(v>0?"+":"")+v+'</span>'; }
          var compareHtml=
            "<div class='lge-compare'>"+
              "<div class='lge-before'><div class='lge-cl'>Before</div><div class='lge-cname'>"+esc(prevMgrName)+"</div>"+
                "<div class='lge-cstyle'>"+esc(prevMgrStyle)+"</div>"+
                "<div class='lge-cbonuses'>ATK "+bonusBadge(prevAtk)+" DEF "+bonusBadge(prevDef)+"</div>"+
              "</div>"+
              "<div class='lge-arrow'>→</div>"+
              "<div class='lge-after'><div class='lge-cl'>After</div><div class='lge-cname'>"+esc(pick.n)+"</div>"+
                "<div class='lge-cstyle'>"+esc(s.name)+"</div>"+
                "<div class='lge-cbonuses'>ATK "+bonusBadge(newAtk)+" DEF "+bonusBadge(newDef)+"</div>"+
              "</div>"+
            "</div>";
          b.outerHTML=compareHtml+"<button class='start-btn' id='lgEvtDone'>"+esc(pick.n)+" appointed — continue →</button>";
          eid("lgEvtDone").addEventListener("click",_lgResumeAfterEvent);
        });
      });
      return;
    }

    /* player event */
    if(ev.stage==="announce"){
      var v=ev.victim, pos=v.slot||v.gp||v.p||"MID", lc2=LINE_OF[pos]||"MID";
      panel.innerHTML="<div class='lg-modal lg-event'>"+
        ""+
        "<div class='lg-event-title'>Bad news</div>"+
        "<div class='lg-event-body'><strong>"+esc(v.n)+"</strong> ("+esc(pos)+") "+esc(ev.reason)+". Spin a squad to sign a replacement for the <strong>"+esc(pos)+"</strong> slot.</div>"+
        "<button class='start-btn' id='lgEvtPlayerSpin'>Spin for a replacement</button>"+
        "</div>";
      panel.className="lg-modal-overlay"; panel.style.display="";
      eid("lgEvtPlayerSpin").addEventListener("click",function(){
        ev.stage="pick"; ev.spin=_lgPickReplacementSquad(v.slot||v.gp||v.p||"MID"); renderLgEventModal();
      });
      return;
    }

    if(ev.stage==="pick"){
      var slot=ev.victim.slot||ev.victim.gp||ev.victim.p||"MID";
      var spin=ev.spin, compat=COMPAT[slot]||[slot];
      var elig=spin.squad.filter(function(p){ return compat.indexOf(p.gp||p.p)!==-1 && !LS.xi.some(function(x){return x&&x.n===p.n;}); });
      elig.sort(function(a,b){ return (b.r||0)-(a.r||0); });
      var rows=elig.map(function(p){
        var line=LINE_OF[p.gp||p.p]||"MID";
        return "<div class='lg-msel-row' data-pn='"+esc(p.n)+"'><span class='pos "+line+"'>"+esc(p.gp||p.p)+"</span><span class='lg-msel-name'>"+esc(p.n)+"</span>"+(LS.showRatings?"<span class='lg-msel-rat'>"+(p.r||"")+"</span>":"")+"</div>";
      }).join("");
      panel.innerHTML="<div class='lg-modal'>"+
        "<div class='lg-modal-head'><div class='lg-modal-title'>"+esc(spin.club)+" <span class='lg-modal-yr'>"+seasonLabel(spin.year)+"</span></div></div>"+
        "<div class='lg-modal-hint'>Pick a "+esc(slot)+" to replace <strong>"+esc(ev.victim.n)+"</strong></div>"+
        "<div class='lg-modal-list'>"+(rows||"<div class='lg-modal-hint' style='padding:1rem'>No eligible "+esc(slot)+" here — spin again.</div>")+"</div>"+
        "<div class='lg-modal-foot'><button class='btn-ghost' id='lgEvtRespin'>🎲 Spin another squad</button></div>"+
        "</div>";
      panel.className="lg-modal-overlay"; panel.style.display="";
      panel.querySelectorAll(".lg-msel-row").forEach(function(el){
        el.addEventListener("click",function(){
          var name=el.getAttribute("data-pn"), pl=spin.squad.filter(function(p){return p.n===name;})[0]; if(!pl) return;
          /* swap: remove victim, add replacement in same slot */
          var oldR=ev.victim.r||75, newR=pl.r||75, delta=newR-oldR;
          LS.xi=LS.xi.filter(function(x){ return x&&x.n!==ev.victim.n; });
          LS.xi.push({n:pl.n,p:pl.p||"MID",r:pl.r||75,gp:pl.gp||pl.p||"MID",slot:slot,club:spin.club,year:spin.year});
          /* Show before/after comparison before resuming */
          function rDeltaBadge(d){
            var cls=d>0?"pos":d<0?"neg":"neu";
            return '<span class="lge-delta '+cls+'">'+(d>0?"+":"")+d+'</span>';
          }
          var compareHtml=
            "<div class='lge-compare'>"+
              "<div class='lge-before'><div class='lge-cl'>Out</div>"+
                "<div class='lge-cname'>"+esc(ev.victim.n)+"</div>"+
                "<div class='lge-cstyle'>"+esc(slot)+"</div>"+
                (LS.showRatings?"<div class='lge-cbonuses'>Rating <span class='lge-delta neu'>"+oldR+"</span></div>":"")+
              "</div>"+
              "<div class='lge-arrow'>→</div>"+
              "<div class='lge-after'><div class='lge-cl'>In</div>"+
                "<div class='lge-cname'>"+esc(pl.n)+"</div>"+
                "<div class='lge-cstyle'>"+esc(slot)+"</div>"+
                (LS.showRatings?"<div class='lge-cbonuses'>Rating "+rDeltaBadge(delta)+"</div>":"")+
              "</div>"+
            "</div>";
          panel.innerHTML="<div class='lg-modal lg-event'>"+
            "<div class='lg-event-title'>Transfer done</div>"+
            "<div class='lg-event-body'>"+compareHtml+"</div>"+
            "<button class='start-btn' id='lgEvtDone2'>Continue →</button>"+
            "</div>";
          eid("lgEvtDone2").addEventListener("click",_lgResumeAfterEvent);
        });
      });
      eid("lgEvtRespin").addEventListener("click",function(){ ev.spin=_lgPickReplacementSquad(slot); renderLgEventModal(); });
      return;
    }
  }

  /* Pick a random club-season that has at least one eligible player for the slot */
  function _lgPickReplacementSquad(slot){
    var pool=getPool(), compat=COMPAT[slot]||[slot], pick, tries=0;
    do{
      pick=pool[Math.floor(Math.random()*pool.length)];
      var ok=pick.squad.some(function(p){ return compat.indexOf(p.gp||p.p)!==-1 && !LS.xi.some(function(x){return x&&x.n===p.n;}); });
      tries++;
    }while(!ok && tries<80);
    return pick;
  }

  /* ════════════════════════════════════════
     STEP 5 — Results
  ════════════════════════════════════════ */
  /* 3-letter club code for the Your-XI list */
  function clubCode(c){
    var M={"Manchester United":"MUN","Manchester City":"MCI","Real Madrid":"RMA","Atlético Madrid":"ATM",
      "Real Sociedad":"RSO","Real Betis":"BET","Athletic Bilbao":"ATH","Bayern Munich":"BAY",
      "Borussia Dortmund":"BVB","Bayer Leverkusen":"B04","RB Leipzig":"RBL","Inter Milan":"INT","AC Milan":"MIL",
      "Paris Saint-Germain":"PSG","Sheffield Wed":"SHW","Sheffield Utd":"SHU","Nottm Forest":"NFO"};
    if(M[c]) return M[c];
    return (c||"").replace(/[^A-Za-z]/g,"").slice(0,3).toUpperCase();
  }

  /* Render a shareable season-summary image and share/download it */
  function _lgShareImage(d, btn){
    var CW=1080, CH=1400;
    var c=document.createElement("canvas"); c.width=CW; c.height=CH;
    var x=c.getContext("2d"); if(!x) return;
    var FS="Helvetica, Arial, sans-serif";

    /* Background */
    var g=x.createLinearGradient(0,0,CW,CH);
    g.addColorStop(0,"#0d1f18"); g.addColorStop(0.5,"#0e1628"); g.addColorStop(1,"#080810");
    x.fillStyle=g; x.fillRect(0,0,CW,CH);

    /* Top accent bar */
    var ag=x.createLinearGradient(0,0,CW,0);
    ag.addColorStop(0,"#22c97d"); ag.addColorStop(0.5,"#7C5CFC"); ag.addColorStop(1,"#22E0C8");
    x.fillStyle=ag; x.fillRect(0,0,CW,12);

    x.textAlign="center";

    /* Branding */
    x.fillStyle="#5a6a80"; x.font="700 34px "+FS; x.fillText("ELEVEN XI", CW/2, 96);

    /* Pill */
    var pillColor = d.pill==="CHAMPIONS" ? "#f5b301" : d.pill==="TOP FOUR" ? "#22c97d" :
                    d.pill==="RELEGATED" ? "#FF7A59" : "#7C9FC5";
    x.fillStyle=pillColor; x.font="900 52px "+FS; x.fillText(String(d.pill||"").toUpperCase(), CW/2, 192);

    /* Big position ordinal */
    x.fillStyle="#ffffff"; x.font="900 160px "+FS; x.fillText(ordinal(d.pos), CW/2, 390);
    x.fillStyle="#7a8fa8"; x.font="500 40px "+FS; x.fillText("of "+d.N+" · "+d.league, CW/2, 456);

    /* Team name */
    x.fillStyle="#ffffff"; x.font="800 60px "+FS;
    var tn = d.team.length > 22 ? d.team.slice(0, 21) + "…" : d.team;
    x.fillText(tn, CW/2, 564);

    /* Stats row — W-D-L, POINTS, GD */
    function stat(cx,y,val,label){
      x.fillStyle="#ffffff"; x.font="900 60px "+FS; x.fillText(val,cx,y);
      x.fillStyle="#5a6a80"; x.font="600 26px "+FS; x.fillText(label,cx,y+42);
    }
    var gdStr = (d.gd != null) ? (d.gd > 0 ? "+"+d.gd : String(d.gd)) : "";
    stat(CW*0.22, 670, d.W+"-"+d.D+"-"+d.L, "W-D-L");
    stat(CW*0.5,  670, String(d.pts), "PTS");
    stat(CW*0.78, 670, gdStr, "GD");

    /* Divider */
    x.strokeStyle="rgba(255,255,255,0.10)"; x.lineWidth=1;
    x.beginPath(); x.moveTo(60,740); x.lineTo(CW-60,740); x.stroke();

    /* Squad — 2 columns (FWD→GK order) */
    var xi = d.xi || [];
    var lineColour = { FWD:"#FF7A59", MID:"#22E0C8", DEF:"#7C5CFC", GK:"#F5B43C" };
    var lineOf2 = { FWD:"FWD", MID:"MID", DEF:"DEF", GK:"GK",
      ST:"FWD",LW:"FWD",RW:"FWD",CF:"FWD",
      CAM:"MID",CM:"MID",CDM:"MID",LM:"MID",RM:"MID",
      CB:"DEF",LB:"DEF",RB:"DEF" };
    var leftCol = xi.slice(0, 6), rightCol = xi.slice(6, 11);
    var colX = [96, CW/2 + 36], LH = 52, Y0 = 794;

    [leftCol, rightCol].forEach(function(col, ci){
      col.forEach(function(p, ri){
        var yy = Y0 + ri * LH;
        var slot = p.slot || p.gp || p.p || "MID";
        var line = lineOf2[slot] || "MID";
        var col2 = lineColour[line] || "#7C5CFC";
        /* Position badge */
        x.fillStyle = col2; x.font = "700 26px "+FS;
        x.textAlign = "left"; x.fillText(slot, colX[ci], yy);
        /* Player name */
        x.fillStyle = "#e8edf2"; x.font = "500 32px "+FS;
        var nm = p.n.length > 18 ? p.n.slice(0,17)+"…" : p.n;
        x.fillText(nm, colX[ci] + 108, yy);
      });
    });

    /* Divider below squad */
    var squadBottom = Y0 + Math.ceil(xi.length / 2) * LH + 20;
    if(squadBottom < 1080) squadBottom = 1080;
    x.strokeStyle="rgba(255,255,255,0.10)"; x.lineWidth=1;
    x.beginPath(); x.moveTo(60,squadBottom); x.lineTo(CW-60,squadBottom); x.stroke();

    /* Golden Boot */
    x.textAlign="center";
    var bootY = squadBottom + 70;
    if(d.boot){
      x.fillStyle="#F5B43C"; x.font="700 34px "+FS; x.fillText("Golden Boot", CW/2, bootY);
      x.fillStyle="#ffffff"; x.font="700 44px "+FS; x.fillText(d.boot.n+" — "+d.boot.G+" goals", CW/2, bootY+60);
    }

    /* Footer */
    x.fillStyle="#3a4a5c"; x.font="500 28px "+FS; x.fillText("Build your all-time XI · eleven-xi.com", CW/2, CH-50);

    c.toBlob(function(blob){
      if(!blob) return;
      var fname="eleven-xi-season.png";
      try{
        var file=new File([blob],fname,{type:"image/png"});
        if(navigator.canShare && navigator.canShare({files:[file]})){
          navigator.share({files:[file], title:"My Eleven XI season", text:d.team+" finished "+ordinal(d.pos)+" in the "+d.league}).catch(function(){});
          return;
        }
      }catch(e){}
      var url=URL.createObjectURL(blob), a=document.createElement("a");
      a.href=url; a.download=fname; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function(){ URL.revokeObjectURL(url); }, 2000);
      if(btn){ btn.textContent="Saved!"; setTimeout(function(){ btn.textContent="Share your season"; }, 2000); }
    }, "image/png");
  }

  function renderResults(){
    var v=lgView(), lc=LEAGUES[LS.league];
    var W2=0,D=0,L=0,GF=0,GA=0;
    LS.userResults.forEach(function(r){
      GF+=r.gf; GA+=r.ga;
      if(r.gf>r.ga) W2++; else if(r.gf===r.ga) D++; else L++;
    });

    var N=LS.table.length, pos=1;
    LS.table.forEach(function(row,i){ if(row.name===LS.teamName) pos=i+1; });
    var expPos=LS.expectedPos||Math.ceil(N/2);
    var total=lc.games;
    var isPerfect=(W2===total&&D===0&&L===0);
    var isChamp=(pos===1), isTop4=(pos<=4), isRel=(pos>N-3);
    var posDiff=expPos-pos;                 /* +ve = better than expected */
    var userRow=LS.table.filter(function(r){ return r.name===LS.teamName; })[0]||{Pts:0,GD:0};
    var cs=LS.totalCleanSheets||0, streak=LS.longestStreak||0;

    /* ── Transparent score breakdown ── */
    var breakdown=[
      ["Finished "+ordinal(pos)+" of "+N, (N-pos+1)*40],
      [userRow.Pts+" points", userRow.Pts*8],
      ["Goal difference "+(userRow.GD>0?"+":"")+userRow.GD, userRow.GD*5],
      [W2+" wins", W2*12],
      [cs+" clean sheets", cs*15]
    ];
    if(posDiff>0)  breakdown.push(["Overperformed by "+posDiff+" place"+(posDiff>1?"s":""), posDiff*50]);
    if(isChamp)    breakdown.push(["Champions bonus", 600]);
    else if(isTop4) breakdown.push(["Top-four bonus", 250]);
    if(isPerfect)  breakdown.push(["Perfect season", 3000]);
    var score=breakdown.reduce(function(a,b){ return a+b[1]; },0);
    if(score<0) score=0;

    /* Post to the shared per-mode leaderboard (once) */
    if(!LS.scoreSaved && window.WCXI_addScore){
      LS.scoreSaved=true;
      window.WCXI_addScore({ name:LS.teamName, score:score, result:ordinal(pos)+" of "+N+" · "+lc.label, mode:"league", ts:Date.now() });
    }

    /* ── Placement pill + over/under verdict ── */
    var pill=isChamp?"CHAMPIONS":isTop4?"TOP FOUR":isRel?"RELEGATED":pos<=N/2?"TOP HALF":"LOWER HALF";
    var verdict=posDiff>=2?"OVERPERFORMED":posDiff<=-2?"UNDERPERFORMED":"AS EXPECTED";
    var verdictCls=posDiff>=2?"good":posDiff<=-2?"bad":"neutral";

    /* ── Narrative ── */
    var narrTitle, narrBody;
    if(isPerfect){ narrTitle="IMMORTAL"; }
    else if(isChamp&&posDiff>=4){ narrTitle="AGAINST ALL ODDS"; }
    else if(isChamp){ narrTitle="CHAMPIONS"; }
    else if(posDiff>=4){ narrTitle="NOBODY SAW THAT COMING"; }
    else if(posDiff>=1){ narrTitle="PUNCHED ABOVE THEIR WEIGHT"; }
    else if(posDiff>=-1){ narrTitle="JOB DONE"; }
    else if(isRel){ narrTitle="DOWN AND OUT"; }
    else if(posDiff<=-4){ narrTitle="WHAT WENT WRONG?"; }
    else { narrTitle="BELOW PAR"; }
    narrBody=W2+" wins, "+userRow.Pts+" points, "+ordinal(pos)+". "+
      "Projected to finish "+ordinal(expPos)+" — "+
      (posDiff>=2?"and they smashed it.":posDiff<=-2?"and it never clicked.":"and that's about right.");

    /* ── Player season stats / awards ── */
    var ps=Object.keys(LS.playerStats||{}).map(function(k){ return LS.playerStats[k]; });
    function topBy(fn,filt){ var a=ps.filter(filt||function(){return true;}).slice().sort(function(x,y){ return fn(y)-fn(x); }); return a[0]; }
    var boot=topBy(function(p){return p.G;});
    var play=topBy(function(p){return p.A;});
    var glove=topBy(function(p){return p.CS;}, function(p){return p.line==="GK";});
    var pots=topBy(function(p){return p.G*3+p.A*2+p.CS;});
    var potsFlavour=pots?(pots.line==="FWD"?"was unplayable up top. Different gravy.":
      pots.line==="MID"?"ran the show in the middle of the park. Different gravy.":
      pots.line==="DEF"?"was a rock at the back all season.":
      "was a wall in goal — unbeatable."):"";

    /* ── Your XI (attack first) ── */
    var lineRank={FWD:0,MID:1,DEF:2,GK:3};
    var xiOrdered=LS.xi.filter(Boolean).slice().sort(function(a,b){
      return (lineRank[LINE_OF[a.slot||a.gp||a.p]||"MID"])-(lineRank[LINE_OF[b.slot||b.gp||b.p]||"MID"]);
    });
    var xiHtml=xiOrdered.map(function(p){
      var slot=p.slot||p.gp||p.p, line=LINE_OF[slot]||"MID";
      return "<div class='lgr2-xi-row'>"+
        "<span class='pos "+line+"'>"+esc(slot)+"</span>"+
        "<span class='lgr2-name'>"+esc(p.n)+"</span>"+
        "<span class='lgr2-meta'>"+esc(clubCode(p.club))+" "+esc(String(p.year||""))+"</span>"+
        (LS.showRatings?"<span class='lgr2-rat'>"+(p.r||"")+"</span>":"")+
        "</div>";
    }).join("");

    /* ── Player stats table (sorted by G then A) ── */
    var psSorted=ps.slice().sort(function(a,b){ return (b.G*3+b.A*2+b.CS)-(a.G*3+a.A*2+a.CS); });
    var dot="<span class='lgr2-dot'>·</span>";
    var pTable=psSorted.map(function(p){
      var line=LINE_OF[p.gp]||"MID";
      return "<div class='lgr2-pt-row'>"+
        "<span class='pos "+line+"'>"+esc(p.gp)+"</span>"+
        "<span class='lgr2-pt-name'>"+esc(p.n)+"</span>"+
        "<span class='lgr2-pt-v g'>"+(p.G||dot)+"</span>"+
        "<span class='lgr2-pt-v a'>"+(p.A||dot)+"</span>"+
        "<span class='lgr2-pt-v cs'>"+(p.CS||dot)+"</span>"+
        "</div>";
    }).join("");

    /* ── Score breakdown rows ── */
    var bkHtml=breakdown.map(function(b){
      var neg=b[1]<0;
      return "<div class='lgr2-bk-row'><span class='lgr2-bk-k'>"+esc(b[0])+"</span>"+
        "<span class='lgr2-bk-v"+(neg?" neg":"")+"'>"+(b[1]>=0?"+":"")+b[1]+"</span></div>";
    }).join("");

    /* ── Final table (compact, collapsible) ── */
    var tblHtml="<table class='lg-table'>"+
      "<thead><tr><th>#</th><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th>"+
      "<th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr></thead><tbody>";
    LS.table.forEach(function(row,i){
      var isUser=(row.name===LS.teamName), relZone=i>=N-3;
      tblHtml+="<tr class='"+(isUser?"lg-tbl-user":relZone?"lg-tbl-rel":"")+"'>"+
        "<td>"+(i+1)+"</td><td class='lg-tbl-club'>"+esc(row.name)+"</td>"+
        "<td>"+row.P+"</td><td>"+row.W+"</td><td>"+row.D+"</td><td>"+row.L+"</td>"+
        "<td>"+row.GF+"</td><td>"+row.GA+"</td><td>"+(row.GD>0?"+":"")+row.GD+"</td>"+
        "<td><strong>"+row.Pts+"</strong></td></tr>";
    });
    tblHtml+="</tbody></table>";

    /* ── Position suffix (e.g. "13" + "th") ── */
    var posSuffix = ordinal(pos).replace(String(pos), "");

    /* ── Pill colour class ── */
    var pillCls = isChamp ? "champ" : isTop4 ? "top4" : isRel ? "rel" : "";

    /* ── Mini league table snippet (user ±2, with context rows) ── */
    var userIdx = pos - 1;
    var showFrom = Math.max(0, userIdx - 2);
    var showTo   = Math.min(N - 1, userIdx + 2);
    /* always try to show 5 rows */
    while (showTo - showFrom < 4) {
      if (showFrom > 0) showFrom--;
      else if (showTo < N - 1) showTo++;
      else break;
    }
    var miniTblHtml = "<div class='lgs-mini-tbl'>";
    miniTblHtml += "<div class='lgs-trow lgs-trow-head'>" +
      "<span class='lgs-tp'>#</span><span class='lgs-tn'>CLUB</span>" +
      "<span class='lgs-tv'>W</span><span class='lgs-tv'>D</span><span class='lgs-tv'>L</span>" +
      "<span class='lgs-tv gd'>GD</span><span class='lgs-tv pts'>PTS</span></div>";
    if (showFrom > 0) {
      miniTblHtml += "<div class='lgs-trow-gap'>· · · " + showFrom + " club" + (showFrom > 1 ? "s" : "") + " above</div>";
    }
    for (var ti = showFrom; ti <= showTo; ti++) {
      var tr = LS.table[ti];
      var isUsr = tr.name === LS.teamName;
      var isRelZone = ti >= N - 3;
      var trCls = isUsr ? "user" : isRelZone ? "rel" : "";
      miniTblHtml += "<div class='lgs-trow " + trCls + "'>" +
        "<span class='lgs-tp'>" + (ti + 1) + "</span>" +
        "<span class='lgs-tn'>" + esc(tr.name) + "</span>" +
        "<span class='lgs-tv'>" + tr.W + "</span>" +
        "<span class='lgs-tv'>" + tr.D + "</span>" +
        "<span class='lgs-tv'>" + tr.L + "</span>" +
        "<span class='lgs-tv gd'>" + (tr.GD >= 0 ? "+" : "") + tr.GD + "</span>" +
        "<span class='lgs-tv pts'>" + tr.Pts + "</span>" +
        "</div>";
    }
    if (showTo < N - 1) {
      var below = N - 1 - showTo;
      miniTblHtml += "<div class='lgs-trow-gap'>· · · " + below + " club" + (below > 1 ? "s" : "") + " below</div>";
    }
    miniTblHtml += "</div>";

    /* ── Award card builder ── */
    function lgsAward(cls, icon, label, p, sub) {
      if (!p) return "";
      return "<div class='lgs-award " + cls + "'>" +
        "<div class='lgs-award-h'>" + (icon ? icon + " " : "") + label + "</div>" +
        "<div class='lgs-award-name'>" + esc(p.n) + "</div>" +
        "<div class='lgs-award-sub'>" + sub + "</div></div>";
    }

    /* ── Player stats table (lgs-* classes) ── */
    var dot2 = "<span class='lgs-pt-dot'>·</span>";
    var pTable2 = psSorted.map(function(p) {
      var line = LINE_OF[p.gp] || "MID";
      return "<div class='lgs-pt-row'>" +
        "<span class='pos " + line + "'>" + esc(p.gp) + "</span>" +
        "<span class='lgs-pt-player'>" + esc(p.n) + "</span>" +
        "<span class='lgs-pt-v g'>" + (p.G || dot2) + "</span>" +
        "<span class='lgs-pt-v a'>" + (p.A || dot2) + "</span>" +
        "<span class='lgs-pt-v'>" + (p.CS || dot2) + "</span>" +
        "</div>";
    }).join("");

    /* ── Score breakdown rows (lgs-* classes) ── */
    var bkHtml2 = breakdown.map(function(b) {
      var neg = b[1] < 0;
      return "<div class='lgs-bk-row'><span class='lgs-bk-k'>" + esc(b[0]) + "</span>" +
        "<span class='lgs-bk-v" + (neg ? " neg" : "") + "'>" + (b[1] >= 0 ? "+" : "") + b[1] + "</span></div>";
    }).join("");

    v.innerHTML =
      "<div class='lgs-page'><div class='wrap'>" +

        /* ── Hero ── */
        "<div class='lgs-hero'>" +
          "<div class='lgs-league-label'>" + esc(lc.label) + "</div>" +
          "<div class='lgs-team-name'>" + esc(LS.teamName) + "</div>" +
          "<div class='lgs-big-pos'>" + pos + "<sup class='lgs-pos-sfx'>" + posSuffix + "</sup></div>" +
          "<div class='lgs-hero-sub'>of " + N + " clubs · " + userRow.Pts + " points</div>" +
          "<div class='lgs-pill " + pillCls + "'>" + pill + "</div>" +
        "</div>" +

        /* ── W-D-L Record strip ── */
        "<div class='lgs-strip'>" +
          "<div class='lgs-strip-item'><span class='lgs-sn win'>" + W2 + "</span><span class='lgs-sl'>WINS</span></div>" +
          "<div class='lgs-strip-div'></div>" +
          "<div class='lgs-strip-item'><span class='lgs-sn draw'>" + D + "</span><span class='lgs-sl'>DRAWS</span></div>" +
          "<div class='lgs-strip-div'></div>" +
          "<div class='lgs-strip-item'><span class='lgs-sn loss'>" + L + "</span><span class='lgs-sl'>LOSSES</span></div>" +
          "<div class='lgs-strip-div wide'></div>" +
          "<div class='lgs-strip-item'><span class='lgs-sn'>" + GF + "</span><span class='lgs-sl'>GF</span></div>" +
          "<div class='lgs-strip-div'></div>" +
          "<div class='lgs-strip-item'><span class='lgs-sn'>" + GA + "</span><span class='lgs-sl'>GA</span></div>" +
          "<div class='lgs-strip-div wide'></div>" +
          "<div class='lgs-strip-item'><span class='lgs-sn'>" + ordinal(expPos) + "</span><span class='lgs-sl'>EXPECTED</span></div>" +
          "<div class='lgs-strip-div'></div>" +
          "<div class='lgs-strip-item'><span class='lgs-sn lgs-verdict-n " + verdictCls + "'>" + verdict + "</span><span class='lgs-sl'>VERDICT</span></div>" +
        "</div>" +

        /* ── Narrative ── */
        "<div class='lgs-narr'>" +
          "<div class='lgs-narr-title'>" + narrTitle + "</div>" +
          "<div class='lgs-narr-body'>" + esc(narrBody) + "</div>" +
          (pots ? "<div class='lgs-pots'>" + esc(pots.n) + " " + esc(potsFlavour) + "</div>" : "") +
        "</div>" +

        /* ── Final league table (mini + full) ── */
        "<div class='lgs-sec'>FINAL TABLE</div>" +
        miniTblHtml +
        "<details class='lgs-full-tbl'><summary>View full " + esc(lc.label) + " table</summary>" +
          "<div class='lg-tbl-col'>" + tblHtml + "</div></details>" +

        /* ── Season Awards ── */
        "<div class='lgs-sec'>SEASON AWARDS</div>" +
        "<div class='lgs-awards'>" +
          lgsAward("", "", "GOLDEN BOOT", boot, boot ? boot.G + " goals" : "") +
          lgsAward("", "", "PLAYMAKER", play, play ? play.A + " assists" : "") +
          lgsAward("", "", "GOLDEN GLOVE", glove, glove ? glove.CS + " clean sheets" : "") +
          lgsAward("gold", "", "PLAYER OF THE SEASON", pots, pots ? pots.G + "G · " + pots.A + "A" : "") +
        "</div>" +

        /* ── Player stats ── */
        "<div class='lgs-ptable'>" +
          "<div class='lgs-pt-head'>" +
            "<span class='lgs-pt-pos'></span>" +
            "<span class='lgs-pt-player'>PLAYER</span>" +
            "<span class='lgs-pt-v'>G</span>" +
            "<span class='lgs-pt-v'>A</span>" +
            "<span class='lgs-pt-v'>CS</span>" +
          "</div>" +
          pTable2 +
        "</div>" +

        /* ── More stats ── */
        "<div class='lgs-morestat'>" +
          "<div class='lgs-ms-item'><span class='lgs-msn'>" + cs + "</span><span class='lgs-msl'>CLEAN SHEETS</span></div>" +
          "<div class='lgs-ms-item'><span class='lgs-msn'>" + streak + "</span><span class='lgs-msl'>LONGEST WIN STREAK</span></div>" +
        "</div>" +

        /* ── Share ── */
        "<button class='lgs-share' id='lgShare'>Share your season</button>" +

        /* ── Score breakdown ── */
        "<div class='lgs-sec'>SCORE BREAKDOWN</div>" +
        "<div class='lgs-break'>" + bkHtml2 +
          "<div class='lgs-bk-total'><span>Season score</span><span class='lgs-bk-score'>" + score.toLocaleString() + "</span></div>" +
        "</div>" +

        /* ── Buttons ── */
        "<div class='lgs-btns'>" +
          "<button class='btn-primary' id='lgPlayAgain'>Play Again</button>" +
          "<button class='btn-ghost' id='lgHomeBtn'>Home</button>" +
        "</div>" +

      "</div></div>";

    eid("lgPlayAgain").addEventListener("click",W.initLeagueMode);
    eid("lgHomeBtn").addEventListener("click",goHome);
    var sh=eid("lgShare");
    if(sh) sh.addEventListener("click",function(){
      _lgShareImage({ team:LS.teamName, league:lc.label, pill:pill, pos:pos, N:N,
        W:W2, D:D, L:L, pts:userRow.Pts, score:score, boot:boot,
        gd:userRow.GD, xi:xiOrdered }, sh);
    });
    if((isChamp||isPerfect)&&W.sfx) W.sfx.win();
    if((isChamp||isPerfect)&&typeof W.triggerConfetti==="function") W.triggerConfetti();
  }

  function ordinal(n){
    var s=["th","st","nd","rd"],v=n%100;
    return n+(s[(v-20)%10]||s[v]||s[0]);
  }

})(window);
