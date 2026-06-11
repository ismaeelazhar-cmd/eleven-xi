/* ratingswar.js — Eleven XI · "Ratings War" mode.
 * Two players build an XI BLIND (ratings never rendered during build),
 * then a head-to-head position-by-position reveal decides each slot.
 * Self-contained; wired from the home card via window.startRatingsWar(). */
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

  W.startRatingsWar = function(){
    buildPool();
    RW = {
      phase:"intro", cur:0, revealStep:-1,
      players:[ {name:"Player 1", picks:newPicks(), rerolls:5}, {name:"Player 2", picks:newPicks(), rerolls:5} ]
    };
    hideOthers(); view().style.display=""; if(W.scrollTo) W.scrollTo(0,0);
    render();
  };
  function newPicks(){ return SLOTS.map(function(){ return null; }); }

  /* ════════════════════════════════════════════════════
     ONLINE Ratings War — each player builds on their own
     device; XIs are exchanged over WebRTC, then both run
     the identical reveal. Host = player 0, guest = player 1
     (canonical, so the reveal matches on both screens).
  ════════════════════════════════════════════════════ */
  W.startRatingsWarOnline = function(role){
    buildPool();
    var myIdx = role === "host" ? 0 : 1, oppIdx = myIdx === 0 ? 1 : 0;
    RW = {
      online:true, role:role, myIdx:myIdx, oppIdx:oppIdx,
      phase:"onintro", cur:myIdx, revealStep:-1,
      myLocked:false, oppPicks:null, oppName:null, rematchMe:false, rematchOpp:false,
      players:[ {name:"Host", picks:newPicks(), rerolls:5}, {name:"Guest", picks:newPicks(), rerolls:5} ]
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
      W.startRatingsWarOnline(role);
    }
  }

  function render(){
    var v = view();
    if (RW.phase === "intro")    return renderIntro(v);
    if (RW.phase === "onintro")  return renderOnlineIntro(v);
    if (RW.phase === "build")    return renderBuild(v);
    if (RW.phase === "onbuild")  return renderBuild(v);
    if (RW.phase === "waitopp")  return renderWaitOpp(v);
    if (RW.phase === "handoff")  return renderHandoff(v);
    if (RW.phase === "reveal")   return renderReveal(v);
    if (RW.phase === "result")   return renderResult(v);
  }

  /* ---------- online: name yourself, then build ---------- */
  function renderOnlineIntro(v){
    var me = RW.players[RW.myIdx], opp = RW.players[RW.oppIdx];
    v.innerHTML =
      "<div class='wrap'><button class='back' id='rwBack'>← Home</button>"+
      "<div class='rw-hero'><div class='rw-kicker'>Online · Ratings War</div>"+
      "<h2 class='rw-title'>Ratings <span class='rw-accent'>War</span></h2>"+
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
  function renderIntro(v){
    v.innerHTML =
      "<div class='wrap'><button class='back' id='rwBack'>← Home</button>"+
      "<div class='rw-hero'><div class='rw-kicker'>Multiplayer</div>"+
      "<h2 class='rw-title'>Ratings <span class='rw-accent'>War</span></h2>"+
      "<p class='rw-sub'>Both managers build an XI <strong>blind</strong> — no ratings shown. "+
      "Then it's a head-to-head: position by position, the higher-rated player wins the slot. Most slots wins.</p>"+
      "<div class='rw-names'>"+
        "<label class='rw-name-field'><span>Player 1</span><input id='rwN1' class='rw-input' maxlength='14' placeholder='Player 1' value='"+esc(RW.players[0].name)+"'></label>"+
        "<div class='rw-vs-badge'>VS</div>"+
        "<label class='rw-name-field'><span>Player 2</span><input id='rwN2' class='rw-input' maxlength='14' placeholder='Player 2' value='"+esc(RW.players[1].name)+"'></label>"+
      "</div>"+
      "<button class='fl-btn rw-start' id='rwStart'>Player 1 — build your XI →</button>"+
      "</div></div>";
    document.getElementById("rwBack").onclick = goHome;
    document.getElementById("rwStart").onclick = function(){
      RW.players[0].name = (document.getElementById("rwN1").value.trim()||"Player 1");
      RW.players[1].name = (document.getElementById("rwN2").value.trim()||"Player 2");
      RW.cur = 0; RW.phase = "build"; render();
    };
  }

  /* ---------- build (blind): fill 11 slots, ratings never shown ---------- */
  function renderBuild(v){
    var P = RW.players[RW.cur];
    var filled = P.picks.filter(Boolean).length;
    var rows = SLOTS.map(function(s, i){
      var pk = P.picks[i];
      var line = s.line;
      return "<div class='rw-slot "+(pk?"filled":"")+"' data-i='"+i+"'>"+
        "<span class='pos "+line+"'>"+esc(s.k.trim())+"</span>"+
        (pk ? "<span class='rw-slot-name'>"+esc(pk.n)+"</span>"+
              "<span class='rw-slot-meta'>"+esc(pk.club)+(pk.year?" · "+pk.year:"")+"</span>"+
              "<button class='rw-respin' data-i='"+i+"' aria-label='Re-spin'>↻</button>"
            : "<span class='rw-slot-name dim'>— tap spin —</span>"+
              "<button class='rw-spin' data-i='"+i+"'>Spin</button>")+
        "</div>";
    }).join("");
    v.innerHTML =
      "<div class='wrap'><button class='back' id='rwBack'>← Quit</button>"+
      "<div class='rw-build-head'>"+
        "<div class='rw-turn'>"+esc(P.name)+" — building <span class='rw-blind'>● ratings hidden</span></div>"+
        "<div class='rw-prog'><span id='rwCount'>"+filled+"</span>/11</div>"+
      "</div>"+
      "<div class='rw-rerolls'>Spins are free — keep re-spinning until you're happy. Pick blind: you can't see ratings.</div>"+
      "<div class='rw-slots'>"+rows+"</div>"+
      "<button class='fl-btn rw-lock' id='rwLock' "+(filled<11?"disabled":"")+">"+
        (RW.online ? "Lock XI — send to "+esc(RW.players[RW.oppIdx].name)
                   : (RW.cur===0 ? "Lock XI — pass to "+esc(RW.players[1].name)+" →" : "Lock XI — reveal"))+"</button>"+
      "</div>";
    document.getElementById("rwBack").onclick = function(){ if(confirm("Quit Ratings War?")) goHome(); };
    v.querySelectorAll(".rw-spin,.rw-respin").forEach(function(b){
      b.onclick = function(){ spinSlot(parseInt(b.getAttribute("data-i"),10)); };
    });
    var lock = document.getElementById("rwLock");
    if (lock) lock.onclick = function(){
      if (P.picks.filter(Boolean).length < 11) return;
      if (RW.online){
        RW.myLocked = true;
        rwSend({ t:"rw_xi", name:RW.players[RW.myIdx].name, picks:RW.players[RW.myIdx].picks });
        maybeStartReveal();   // reveal if opponent already sent, else wait
        return;
      }
      if (RW.cur === 0){ RW.cur = 1; RW.phase = "handoff"; }
      else { RW.phase = "reveal"; RW.revealStep = -1; computeResult(); }
      render();
    };
  }
  function spinSlot(i){
    var P = RW.players[RW.cur], line = SLOTS[i].line, pool = POOL[line] || [];
    var taken = {}; P.picks.forEach(function(pk){ if(pk) taken[pk.n]=1; });
    var pick, tries=0;
    do { pick = rnd(pool); tries++; } while (pick && taken[pick.n] && tries<60);
    P.picks[i] = pick ? { n:pick.n, r:pick.r, gp:pick.gp, club:pick.club, year:pick.year } : null;
    render();
  }

  /* ---------- handoff (privacy between players) ---------- */
  function renderHandoff(v){
    v.innerHTML =
      "<div class='wrap'><div class='rw-handoff'>"+
        "<div class='rw-handoff-ico'>🔄</div>"+
        "<h2 class='rw-title'>Pass the device</h2>"+
        "<p class='rw-sub'><strong>"+esc(RW.players[1].name)+"</strong>, it's your turn to build — "+
        esc(RW.players[0].name)+"'s XI is hidden. Ratings stay secret until the reveal.</p>"+
        "<button class='fl-btn rw-start' id='rwGo'>I'm "+esc(RW.players[1].name)+" — build my XI →</button>"+
      "</div></div>";
    document.getElementById("rwGo").onclick = function(){ RW.phase="build"; render(); };
  }

  /* ---------- result computation ---------- */
  function computeResult(){
    var s1=0, s2=0, rows=[];
    SLOTS.forEach(function(s,i){
      var a=RW.players[0].picks[i], b=RW.players[1].picks[i];
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
          "<span class='rw-rev-rating'>"+(r.a?r.a.r:"–")+"</span></div>"+
        "<div class='rw-rev-mid'><span class='pos "+r.line+"'>"+esc(r.slot)+"</span>"+
          (aw?"<span class='rw-rev-arrow l'>◀</span>":bw?"<span class='rw-rev-arrow r'>▶</span>":"<span class='rw-rev-eq'>=</span>")+"</div>"+
        "<div class='rw-rev-side right "+(bw?"win":"")+"'>"+
          "<span class='rw-rev-rating'>"+(r.b?r.b.r:"–")+"</span>"+
          "<span class='rw-rev-name'>"+esc(shortName(r.b?r.b.n:"—"))+"</span></div>"+
        "</div>";
    }).join("");
    v.innerHTML =
      "<div class='wrap'>"+
      "<div class='rw-scorebar'>"+
        "<div class='rw-team a'><div class='rw-team-name'>"+esc(RW.players[0].name)+"</div><div class='rw-team-score' id='rwS1'>"+s1+"</div></div>"+
        "<div class='rw-scorebar-vs'>"+(done?"FULL TIME":"WAR")+"</div>"+
        "<div class='rw-team b'><div class='rw-team-score' id='rwS2'>"+s2+"</div><div class='rw-team-name'>"+esc(RW.players[1].name)+"</div></div>"+
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
    var s1=RW.score[0], s2=RW.score[1];
    function nm(i){ return esc(RW.players[i].name) + (RW.online && i===RW.myIdx ? " <span class='rw-you'>(you)</span>" : ""); }
    var winnerIdx = s1>s2?0 : s2>s1?1 : -1;
    var title;
    if (winnerIdx === -1) title = "It's a stalemate";
    else if (RW.online) title = (winnerIdx===RW.myIdx ? "You win the war" : esc(RW.players[winnerIdx].name)+" wins the war");
    else title = esc(RW.players[winnerIdx].name)+" wins the war";
    var emoji = winnerIdx>=0 ? "🏆" : "";
    var best = RW.rows.slice().filter(function(r){return r.a&&r.b;}).sort(function(x,y){
      return (Math.max(y.a.r,y.b.r)) - (Math.max(x.a.r,x.b.r)); })[0];
    var rematchLabel = RW.online ? (RW.rematchMe ? "Waiting for rematch…" : "Rematch") : "Rematch";
    v.innerHTML =
      "<div class='wrap'>"+
      "<div class='rw-result-card'>"+
        "<div class='rw-result-emoji'>"+emoji+"</div>"+
        "<div class='rw-result-score'>"+s1+" <span>–</span> "+s2+"</div>"+
        "<h2 class='rw-title'>"+title+"</h2>"+
        "<p class='rw-sub'>"+nm(0)+" "+s1+" · "+nm(1)+" "+s2+
          (best?" &middot; star slot: "+esc(best.slot)+" ("+esc(shortName(best[best.a.r>=best.b.r?'a':'b'].n))+" "+Math.max(best.a.r,best.b.r)+")":"")+"</p>"+
        "<div class='rw-result-btns'>"+
          "<button class='fl-btn' id='rwAgain' "+(RW.online&&RW.rematchMe?"disabled":"")+">"+rematchLabel+"</button>"+
          "<button class='btn-ghost' id='rwHome'>Home</button>"+
        "</div>"+
      "</div></div>";
    document.getElementById("rwAgain").onclick = function(){
      if (RW.online){
        RW.rematchMe = true; rwSend({ t:"rw_rematch" });
        if (typeof W.flToast === "function") W.flToast("Rematch requested…");
        maybeRematch(); render();
      } else {
        W.startRatingsWar();
      }
    };
    document.getElementById("rwHome").onclick = goHome;
    if (winnerIdx>=0 && typeof W.triggerConfetti === "function") W.triggerConfetti();
  }
})(window);
