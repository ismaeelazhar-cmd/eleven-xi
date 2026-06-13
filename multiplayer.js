/* multiplayer.js — Offline multiplayer draft & tournament
 * Supports 2-8 players, round-robin draft (11 picks each),
 * formation lock, manager spin, global player lock,
 * group stage + knockout tournament sim.
 */
(function (W) {
  "use strict";

  /* ── Self-contained constants (mirrors game.js, no coupling) ── */
  var MP_LINE_OF = {
    GK:"GK", CB:"DEF", RB:"DEF", LB:"DEF", RWB:"DEF", LWB:"DEF",
    CDM:"MID", CM:"MID", CAM:"MID", LM:"MID", RM:"MID",
    LW:"FWD", RW:"FWD", ST:"FWD"
  };

  var MP_FORMATIONS = {
    "4-3-3":   { lines:[["LB","CB","CB","RB"],["CM","CDM","CM"],["LW","ST","RW"]] },
    "4-4-2":   { lines:[["LB","CB","CB","RB"],["LM","CM","CM","RM"],["ST","ST"]] },
    "4-2-3-1": { lines:[["LB","CB","CB","RB"],["CDM","CDM"],["LM","CAM","RM"],["ST"]] },
    "3-5-2":   { lines:[["CB","CB","CB"],["LM","CM","CDM","CM","RM"],["ST","ST"]] },
    "3-4-1-2": { lines:[["CB","CB","CB"],["LM","CM","CM","RM"],["CAM"],["ST","ST"]] },
    "3-4-3":   { lines:[["CB","CB","CB"],["LM","CM","CM","RM"],["LW","ST","RW"]] },
    "5-3-2":   { lines:[["LWB","CB","CB","CB","RWB"],["CM","CDM","CM"],["ST","ST"]] },
    "4-5-1":   { lines:[["LB","CB","CB","RB"],["LM","CM","CDM","CM","RM"],["ST"]] },
    "5-4-1":   { lines:[["LWB","CB","CB","CB","RWB"],["LM","CM","CM","RM"],["ST"]] },
    "4-1-4-1": { lines:[["LB","CB","CB","RB"],["CDM"],["LM","CM","CM","RM"],["ST"]] },
    "4-3-2-1": { lines:[["LB","CB","CB","RB"],["CM","CDM","CM"],["CAM","CAM"],["ST"]] },
    "4-4-1-1": { lines:[["LB","CB","CB","RB"],["LM","CM","CM","RM"],["CAM"],["ST"]] }
  };

  var MP_MANAGERS = [
    { id:"none",      emoji:"🎽", name:"No manager",    atk:0,  def:0,  ko:0, desc:"No bonus — just the XI." },
    { id:"attack",    emoji:"⚔️",  name:"Total Football", atk:4,  def:-2, ko:0, desc:"+4 attack, −2 defence — all-out attack." },
    { id:"defence",   emoji:"🛡️",  name:"Catenaccio",     atk:-2, def:4,  ko:0, desc:"+4 defence, −2 attack — shut up shop." },
    { id:"press",     emoji:"🔥", name:"Gegenpress",     atk:2,  def:2,  ko:0, desc:"+2 attack & defence — relentless intensity." },
    { id:"cup",       emoji:"🏆", name:"Cup Specialist", atk:0,  def:0,  ko:6, desc:"+6 in knockouts — a tournament master." },
    { id:"motivator", emoji:"🗣️",  name:"The Motivator",  atk:2,  def:2,  ko:2, desc:"+2 overall and +2 in knockouts." },
    { id:"counter",   emoji:"⚡", name:"Counter-Attack", atk:3,  def:1,  ko:0, desc:"+3 attack, +1 defence — lethal on the break." }
  ];

  var MP_MANAGERS_DB = [
    {n:"Rinus Michels",s:"attack"},{n:"Johan Cruyff",s:"attack"},{n:"Joachim Löw",s:"attack"},
    {n:"Roberto Martínez",s:"attack"},{n:"Mário Zagallo",s:"attack"},
    {n:"Helenio Herrera",s:"defence"},{n:"Giovanni Trapattoni",s:"defence"},{n:"Diego Simeone",s:"defence"},
    {n:"Fabio Capello",s:"defence"},{n:"Antonio Conte",s:"defence"},
    {n:"Marcelo Bielsa",s:"press"},{n:"Jürgen Klopp",s:"press"},{n:"Pep Guardiola",s:"press"},
    {n:"Arrigo Sacchi",s:"press"},{n:"Valeriy Lobanovskyi",s:"press"},
    {n:"José Mourinho",s:"cup"},{n:"Carlo Ancelotti",s:"cup"},{n:"Didier Deschamps",s:"cup"},
    {n:"Lionel Scaloni",s:"cup"},{n:"Zinedine Zidane",s:"cup"},
    {n:"Sir Alex Ferguson",s:"motivator"},{n:"Vicente del Bosque",s:"motivator"},
    {n:"Luiz Felipe Scolari",s:"motivator"},{n:"Bora Milutinović",s:"motivator"},{n:"Otto Rehhagel",s:"motivator"},
    {n:"Claudio Ranieri",s:"counter"},{n:"Roberto Di Matteo",s:"counter"},
    {n:"Sven-Göran Eriksson",s:"counter"},{n:"Guus Hiddink",s:"counter"}
  ];

  var MP_MODE_DATA = {
    wc:           { label:"World Cup",            get: function(){ return window.WORLD_CUP_DATA; } },
    cl:           { label:"Champions League",    get: function(){ return window.CL_DATA; } },
    pl:           { label:"Premier League",       get: function(){ return window.PL_DATA; } },
    championship: { label:"Championship",         get: function(){ return window.CHAMPIONSHIP_DATA; } },
    euro:         { label:"Euros",                get: function(){ return window.EURO_DATA; } },
    laliga:       { label:"La Liga",              get: function(){ return window.LALIGA_DATA; } },
    seriea:       { label:"Serie A",              get: function(){ return window.SERIEA_DATA; } },
    bundesliga:   { label:"Bundesliga",           get: function(){ return window.BUNDESLIGA_DATA; } }
  };

  /* ── League-specific manager pools ── */
  var MP_MANAGERS_DB_LALIGA = [
    {n:"Pep Guardiola",s:"press"},{n:"Johan Cruyff",s:"attack"},{n:"Vicente del Bosque",s:"motivator"},
    {n:"Luis Aragonés",s:"motivator"},{n:"Marcelo Bielsa",s:"press"},{n:"Diego Simeone",s:"defence"},
    {n:"Zinedine Zidane",s:"cup"},{n:"Carlo Ancelotti",s:"cup"},{n:"José Mourinho",s:"cup"},
    {n:"Juanma Lillo",s:"attack"},{n:"Rafa Benítez",s:"defence"},{n:"Quique Setién",s:"press"},
    {n:"Ernesto Valverde",s:"counter"},{n:"Míchel",s:"attack"},{n:"Míchel Salgado",s:"counter"},
    // Abroad wildcards
    {n:"Jürgen Klopp",s:"press"},{n:"Antonio Conte",s:"defence"},{n:"Arsène Wenger",s:"attack"},
    {n:"Fabio Capello",s:"defence"},{n:"José Villalonga",s:"motivator"}
  ];

  var MP_MANAGERS_DB_SERIEA = [
    {n:"Arrigo Sacchi",s:"press"},{n:"Fabio Capello",s:"defence"},{n:"Giovanni Trapattoni",s:"defence"},
    {n:"Antonio Conte",s:"defence"},{n:"Carlo Ancelotti",s:"cup"},{n:"José Mourinho",s:"cup"},
    {n:"Claudio Ranieri",s:"counter"},{n:"Luciano Spalletti",s:"press"},{n:"Simone Inzaghi",s:"counter"},
    {n:"Gian Piero Gasperini",s:"press"},{n:"Massimiliano Allegri",s:"defence"},{n:"Roberto Mancini",s:"motivator"},
    {n:"Helenio Herrera",s:"defence"},{n:"Nereo Rocco",s:"defence"},{n:"Alberto Zaccheroni",s:"counter"},
    // Abroad wildcards
    {n:"Pep Guardiola",s:"press"},{n:"Marcelo Bielsa",s:"press"},{n:"Diego Simeone",s:"defence"},
    {n:"Rinus Michels",s:"attack"},{n:"Sven-Göran Eriksson",s:"counter"}
  ];

  var MP_MANAGERS_DB_BUNDESLIGA = [
    {n:"Jupp Heynckes",s:"press"},{n:"Ottmar Hitzfeld",s:"cup"},{n:"Udo Lattek",s:"attack"},
    {n:"Erich Ribbeck",s:"defence"},{n:"Franz Beckenbauer",s:"motivator"},{n:"Pep Guardiola",s:"press"},
    {n:"Jürgen Klopp",s:"press"},{n:"Hans-Dieter Flick",s:"press"},{n:"Thomas Tuchel",s:"counter"},
    {n:"Roger Schmidt",s:"press"},{n:"Niko Kovač",s:"defence"},{n:"Friedhelm Funkel",s:"defence"},
    {n:"Peter Bosz",s:"attack"},{n:"Matthias Sammer",s:"motivator"},{n:"Christoph Daum",s:"attack"},
    // Abroad wildcards
    {n:"José Mourinho",s:"cup"},{n:"Carlo Ancelotti",s:"cup"},{n:"Diego Simeone",s:"defence"},
    {n:"Arsène Wenger",s:"attack"},{n:"Louis van Gaal",s:"press"}
  ];

  var MP_MANAGERS_DB_CHAMPIONSHIP = [
    {n:"Neil Warnock",s:"defence"},{n:"Tony Mowbray",s:"motivator"},{n:"Simon Jordan",s:"counter"},
    {n:"Chris Coleman",s:"counter"},{n:"Mick McCarthy",s:"defence"},{n:"Nigel Clough",s:"motivator"},
    {n:"Steve Bruce",s:"counter"},{n:"Billy Davies",s:"attack"},{n:"Mick Mills",s:"counter"},
    {n:"Stuart Pearce",s:"motivator"},{n:"Brian Laws",s:"counter"},{n:"Gary Megson",s:"counter"},
    {n:"Simon Grayson",s:"motivator"},{n:"Robbie Fowler",s:"attack"},{n:"Paul Lambert",s:"defence"},
    // Abroad wildcards
    {n:"Marcelo Bielsa",s:"press"},{n:"José Mourinho",s:"cup"},{n:"Claudio Ranieri",s:"counter"},
    {n:"Carlos Corberán",s:"press"},{n:"Slaviša Jokanović",s:"counter"}
  ];

  var MP_MANAGERS_DB_PL = [
    {n:"Sir Alex Ferguson",s:"motivator"},{n:"Arsène Wenger",s:"attack"},{n:"José Mourinho",s:"cup"},
    {n:"Pep Guardiola",s:"press"},{n:"Jürgen Klopp",s:"press"},{n:"Carlo Ancelotti",s:"cup"},
    {n:"Claudio Ranieri",s:"counter"},{n:"Rafael Benítez",s:"defence"},{n:"Howard Wilkinson",s:"defence"},
    {n:"Brian Clough",s:"motivator"},{n:"Kenny Dalglish",s:"motivator"},{n:"Harry Redknapp",s:"counter"},
    {n:"George Graham",s:"defence"},{n:"Bobby Robson",s:"attack"},{n:"Ron Greenwood",s:"attack"},
    // Abroad wildcards
    {n:"Diego Simeone",s:"defence"},{n:"Marcelo Bielsa",s:"press"},{n:"Antonio Conte",s:"defence"},
    {n:"Arrigo Sacchi",s:"press"},{n:"Giovanni Trapattoni",s:"defence"}
  ];

  var MP_MANAGERS_DB_LIGUE1 = [
    {n:"Arsène Wenger",s:"attack"},{n:"Gérard Houllier",s:"motivator"},{n:"Guy Roux",s:"counter"},
    {n:"Luis Fernandez",s:"press"},{n:"Jean Tigana",s:"press"},{n:"Didier Deschamps",s:"motivator"},
    {n:"Bruno Genesio",s:"attack"},{n:"Rudi Garcia",s:"counter"},{n:"Laurent Blanc",s:"defence"},
    {n:"Christophe Galtier",s:"defence"},{n:"Niko Kovac",s:"counter"},{n:"Claude Puel",s:"defence"},
    {n:"Pedro Martins",s:"motivator"},{n:"Patrick Vieira",s:"attack"},{n:"Philippe Montanier",s:"counter"},
    // Abroad wildcards
    {n:"Marcelo Bielsa",s:"press"},{n:"Pep Guardiola",s:"press"},{n:"José Mourinho",s:"cup"},
    {n:"Carlo Ancelotti",s:"cup"},{n:"Diego Simeone",s:"defence"}
  ];

  function getMgrDbForMode(mode) {
    if (mode === "laliga")       return MP_MANAGERS_DB_LALIGA;
    if (mode === "seriea")       return MP_MANAGERS_DB_SERIEA;
    if (mode === "bundesliga")   return MP_MANAGERS_DB_BUNDESLIGA;
    if (mode === "championship") return MP_MANAGERS_DB_CHAMPIONSHIP;
    if (mode === "pl")           return MP_MANAGERS_DB_PL;
    if (mode === "ligue1")       return MP_MANAGERS_DB_LIGUE1;
    return MP_MANAGERS_DB; // wc, cl, euro
  }

  /* ── State ── */
  var st = {
    phase: "idle",        // idle | setup | player_setup | handoff_setup | draft | tournament
    mpMode: "wc",
    numPlayers: 2,
    tournamentFormat: "auto",
    players: [],
    setupIdx: 0,
    handoffFrom: 0,
    cur: 0,
    lockedNames: {},
    usedFormations: {},
    currentSpin: null,
    mgrSpinResult: null,
    pendingPick: null,
    pendingHandoff: null, // {from, to, lastPick} — show pass screen after picking
    simData: null,        // pre-computed tournament data
    simStep: -1,          // which match to reveal next
    revealIdx: -1,        // squad reveal step: -1=not started, 0..N=showing squad N, >=numPlayers=done
    // ── online session ──
    online: false,        // true when playing over the network
    netRole: null,        // "host" | "guest"
    netCode: null,        // shareable game code (host)
    hostStatus: null,     // loading | waiting | connected | error
    hostMsg: null,
    joinCode: "",
    joinStatus: null,     // idle | loading | joining | connected
    joinError: null,
    _netOnData: null,     // per-mode network message handler
    _hostPoolKey: "wc",   // host's chosen pool for Duels
    _guestPoolDataKey: null, _guestPoolNational: true, _guestPoolLabel: "World Cup"
  };
  W._mpSt = st;

  /* ── Formation slot helpers ── */
  var MP_POS_FULL = {
    GK:"Goalkeeper", CB:"Centre Back", RB:"Right Back", LB:"Left Back",
    RWB:"Right Wing-Back", LWB:"Left Wing-Back", CDM:"Defensive Mid",
    CM:"Central Mid", CAM:"Attacking Mid", RM:"Right Mid", LM:"Left Mid",
    RW:"Right Wing", LW:"Left Wing", ST:"Striker"
  };

  function getSlots(formation){
    var f = MP_FORMATIONS[formation];
    if(!f) return ["GK","RB","CB","CB","LB","CM","CDM","CM","RW","ST","LW"];
    return ["GK"].concat(f.lines.reduce(function(a,l){ return a.concat(l); },[]));
  }

  function slotCompat(gp){
    var m = {
      GK:["GK"],
      CB:["CB"], RB:["RB","RWB"], LB:["LB","LWB"],
      RWB:["RWB","RB"], LWB:["LWB","LB"],
      CDM:["CDM","CM"], CM:["CM","CDM","CAM"],
      CAM:["CAM","CM","ST"],
      RM:["RM","RW","CM"], LM:["LM","LW","CM"],
      RW:["RW","RM","ST"], LW:["LW","LM","ST"],
      ST:["ST","LW","RW","CAM"]
    };
    return m[gp]||[gp];
  }

  function openSlotCounts(player){
    var slots = getSlots(player.formation);
    var counts = {};
    slots.forEach(function(s){ counts[s]=(counts[s]||0)+1; });
    player.picks.forEach(function(pk){
      var s = pk.slot||pk.gp||pk.p;
      if(s && counts.hasOwnProperty(s)) counts[s]--;
    });
    return counts;
  }

  function eligibleSlots(squadPlayer, draftPlayer){
    var gp = squadPlayer.gp||squadPlayer.p||"MID";
    var compat = slotCompat(gp);
    var counts = openSlotCounts(draftPlayer);
    return compat.filter(function(s){ return (counts[s]||0)>0; });
  }

  /* ── DOM helpers ── */
  function eid(id){ return document.getElementById(id); }
  function mk(tag, cls, html){
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function esc(s){
    return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }
  function styleById(sid){
    for (var i=0;i<MP_MANAGERS.length;i++) if(MP_MANAGERS[i].id===sid) return MP_MANAGERS[i];
    return MP_MANAGERS[0];
  }
  function getData(){ return (MP_MODE_DATA[st.mpMode]||MP_MODE_DATA.wc).get() || {}; }

  /* ── Root element ── */
  var root;
  function render(){ if(root) _render(); }

  /* ── Init ── */
  function init(){
    root = eid("mpView");
    if (!root) return;
    var btn = eid("homeMP");
    if (btn) btn.addEventListener("click", openMultiplayer);
    /* Expose for Euro card — opens MP pre-set to a specific pool */
    W.openMultiplayerWithMode = function(mode) {
      if (mode && MP_MODE_DATA[mode]) st.mpMode = mode;
      openMultiplayer();
    };
    var lbtn = eid("homeLeague");
    if (lbtn) lbtn.addEventListener("click", function(){
      ["homeView","setupView","draftView","resultsView","boardView"].forEach(function(id){
        var v = eid(id); if(v) v.style.display = "none";
      });
      if (typeof window.initLeagueMode === "function") window.initLeagueMode();
    });
  }

  function openMultiplayer(){
    ["homeView","setupView","draftView","resultsView","boardView"].forEach(function(id){
      var v = eid(id); if(v) v.style.display = "none";
    });
    root.style.display = "";
    st.phase = "mp_connect";
    _render();
  }

  function goHome(){
    root.style.display = "none";
    var h = eid("homeView"); if(h) h.style.display = "";
    st.phase = "idle";
    // Drop any live online session when leaving Multiplayer entirely.
    if (window.ElxiNet && window.ElxiNet.isOnline()) window.ElxiNet.close();
    st.online = false; st.netRole = null;
  }

  /* ════════════════════════════════════════════════════
     RENDER DISPATCHER
  ════════════════════════════════════════════════════ */
  function _render(){
    root.innerHTML = "";

    /* Draft phase has its own fixed home button; skip the generic one */
    if(st.phase !== "draft"){
      var back = mk("button","mp-back","← Home");
      back.addEventListener("click", goHome);
      root.appendChild(back);
    }

    switch(st.phase){
      case "mp_connect":      renderConnectChoice();break;
      case "mp_lobby":        renderLobby();        break;
      case "mp_host":         renderHostWait();     break;
      case "mp_join":         renderJoin();         break;
      case "mp_guestwait":    renderGuestWaitMode();break;
      case "mp_modeselect":   renderMpModeSelect(); break;
      case "mp_hostsettings": renderHostSettings(); break;
      case "setup":           renderSetup();        break;
      case "player_setup":    renderPlayerSetup();  break;
      case "handoff_setup":   renderHandoffSetup(); break;
      case "draft":           renderDraft();        break;
      case "tournament":      renderTournament();   break;
    }
  }

  /* ════════════════════════════════════════════════════
     PHASE -1 — ONLINE vs OFFLINE, then the online lobby
  ════════════════════════════════════════════════════ */
  function renderConnectChoice(){
    var wrap = mk("div","mp-wrap");
    wrap.innerHTML = '<h2 class="mp-title">Multiplayer</h2><p class="mp-sub">Play on one device, or connect with a friend anywhere.</p>';
    var grid = mk("div","mp-modeselect");

    var off = mk("button","mp-ms-card m-local");
    off.innerHTML = '<span class="mp-ms-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 21h8M12 18v3"/></svg></span>'+
      '<span class="mp-ms-name">Local</span><span class="mp-ms-hint">Pass-and-play on this one device — no internet needed.</span>';
    off.addEventListener("click", function(){ st.online=false; st.netRole=null; st.phase="mp_modeselect"; _render(); });
    grid.appendChild(off);

    var on = mk("button","mp-ms-card m-online");
    on.innerHTML = '<span class="mp-ms-badge">New</span>'+
      '<span class="mp-ms-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9S14.5 18.5 12 21M12 3C9.5 5.5 8.2 8.7 8.2 12S9.5 18.5 12 21"/></svg></span>'+
      '<span class="mp-ms-name">Online</span><span class="mp-ms-hint">Create a game and share a code, or join a friend’s game.</span>';
    on.addEventListener("click", function(){ st.phase="mp_lobby"; _render(); });
    grid.appendChild(on);

    wrap.appendChild(grid);

    /* MP-3: Session history */
    var hist = _loadMpHistory();
    if(hist.length > 0){
      var histSec = mk("div","mp-history-sec");
      histSec.innerHTML = '<div class="mp-label">Recent Sessions</div>';
      hist.slice(0,5).forEach(function(entry){
        var row = mk("div","mp-hist-row");
        var d = entry.ts ? new Date(entry.ts) : null;
        var dateStr = d ? (d.getDate()+"/"+(d.getMonth()+1)+"/"+(d.getFullYear()+"").slice(-2)) : "";
        var playersStr = (entry.players||[]).map(function(p){ return esc(p.name)+" ("+p.avg+")"; }).join(", ");
        row.innerHTML = '<span class="mp-hist-winner">'+esc(entry.winner)+'</span>'+
          '<span class="mp-hist-players">'+playersStr+'</span>'+
          (dateStr?'<span class="mp-hist-date">'+dateStr+'</span>':'');
        histSec.appendChild(row);
      });
      wrap.appendChild(histSec);
    }

    root.appendChild(wrap);
  }

  function renderLobby(){
    var wrap = mk("div","mp-wrap");
    wrap.innerHTML = '<h2 class="mp-title">Play Online</h2><p class="mp-sub">One of you creates the game; the other joins with the code.</p>';
    var grid = mk("div","mp-modeselect");

    var create = mk("button","mp-ms-card m-create");
    create.innerHTML = '<span class="mp-ms-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></span>'+
      '<span class="mp-ms-name">Create Game</span><span class="mp-ms-hint">Generate a code and wait for your friend to join.</span>';
    create.addEventListener("click", startHost);
    grid.appendChild(create);

    var join = mk("button","mp-ms-card m-join");
    join.innerHTML = '<span class="mp-ms-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="M10 17l5-5-5-5M15 12H3"/></svg></span>'+
      '<span class="mp-ms-name">Join Game</span><span class="mp-ms-hint">Enter the code your friend shares with you.</span>';
    join.addEventListener("click", function(){ st.phase="mp_join"; st.joinError=null; _render(); });
    grid.appendChild(join);

    wrap.appendChild(grid);

    var back = mk("button","mp-ghost-btn","← Back");
    back.addEventListener("click", function(){ st.phase="mp_connect"; _render(); });
    wrap.appendChild(back);

    root.appendChild(wrap);
  }

  /* ── Host: create game, show code, wait ── */
  function startHost(){
    st.online = true; st.netRole = "host"; st.hostStatus = "loading"; st.hostMsg = null;
    st.phase = "mp_host"; _render();
    bindNetForLobby();
    window.ElxiNet.host().then(function(code){
      st.netCode = code;
      if (st.phase === "mp_host") _render();   // show the code once the broker assigns it
    }).catch(function(){ /* onStatus reports the error */ });
  }

  function renderHostWait(){
    var wrap = mk("div","mp-wrap mp-lobby");
    wrap.innerHTML = '<h2 class="mp-title">Your Game</h2>';

    var status = st.hostStatus || "loading";
    if (status === "error"){
      wrap.appendChild(mk("p","mp-sub mp-net-err", esc(st.hostMsg || "Something went wrong.")));
      var retry = mk("button","mp-start-btn","Try again");
      retry.addEventListener("click", startHost);
      wrap.appendChild(retry);
      var b = mk("button","mp-ghost-btn","← Back"); b.addEventListener("click", leaveLobby);
      wrap.appendChild(b);
      root.appendChild(wrap); return;
    }

    if (status === "connected"){
      wrap.appendChild(mk("p","mp-sub","Your friend's in. You're the host — pick the game for both of you."));
      var go = mk("button","mp-start-btn","Choose the game →");
      go.addEventListener("click", function(){ st.phase="mp_modeselect"; _render(); });
      wrap.appendChild(go);
      root.appendChild(wrap); return;
    }

    // loading / waiting
    var card = mk("div","mp-code-card");
    if (st.netCode){
      card.innerHTML = '<div class="mp-code-label">Share this code</div>'+
        '<div class="mp-code" id="mpCodeVal">'+esc(st.netCode)+'</div>';
      var copy = mk("button","mp-copy-btn","Copy code");
      copy.addEventListener("click", function(){
        try{ navigator.clipboard.writeText(st.netCode); }catch(e){}
        copy.textContent = "Copied ✓";
        setTimeout(function(){ copy.textContent="Copy code"; }, 1600);
      });
      card.appendChild(copy);
    } else {
      card.innerHTML = '<div class="mp-code-label">Creating your game…</div><div class="mp-code mp-code-dim">····</div>';
    }
    wrap.appendChild(card);

    var wait = mk("div","mp-wait");
    wait.innerHTML = '<span class="mp-spinner"></span><span>Waiting for your friend to join…</span>';
    wrap.appendChild(wait);

    var cancel = mk("button","mp-ghost-btn","Cancel");
    cancel.addEventListener("click", leaveLobby);
    wrap.appendChild(cancel);

    root.appendChild(wrap);
  }

  /* ── Guest: enter code, connect ── */
  function renderJoin(){
    var wrap = mk("div","mp-wrap mp-lobby");
    wrap.innerHTML = '<h2 class="mp-title">Join a Game</h2><p class="mp-sub">Type the code your friend gave you.</p>';

    var status = st.joinStatus || "idle";
    var inputRow = mk("div","mp-join-row");
    var input = mk("input","mp-code-input");
    input.setAttribute("type","text");
    input.setAttribute("maxlength","4");
    input.setAttribute("autocapitalize","characters");
    input.setAttribute("autocomplete","off");
    input.setAttribute("placeholder","CODE");
    input.value = st.joinCode || "";
    input.addEventListener("input", function(){
      input.value = input.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,4);
      st.joinCode = input.value;
    });
    input.addEventListener("keydown", function(e){ if(e.key==="Enter") doJoin(); });
    inputRow.appendChild(input);
    wrap.appendChild(inputRow);

    if (status === "joining" || status === "loading"){
      var w = mk("div","mp-wait"); w.innerHTML = '<span class="mp-spinner"></span><span>Connecting…</span>';
      wrap.appendChild(w);
    } else if (status === "connected"){
      // Host drives the game choice — hand off to the waiting screen.
      st.phase = "mp_guestwait"; _render(); return;
    } else {
      var connect = mk("button","mp-start-btn","Connect →");
      connect.addEventListener("click", doJoin);
      wrap.appendChild(connect);
    }

    if (st.joinError) wrap.appendChild(mk("p","mp-net-err", esc(st.joinError)));

    var back = mk("button","mp-ghost-btn","← Back");
    back.addEventListener("click", leaveLobby);
    wrap.appendChild(back);

    root.appendChild(wrap);
    setTimeout(function(){ if(input && status==="idle") input.focus(); }, 30);
  }

  function doJoin(){
    var code = (st.joinCode || "").trim();
    if (code.length !== 4){ st.joinError = "Enter the 4-character code."; _render(); return; }
    st.online = true; st.netRole = "guest"; st.joinStatus = "loading"; st.joinError = null;
    _render();
    bindNetForLobby();
    window.ElxiNet.join(code).then(function(){
      // onStatus -> connected handles render
    }).catch(function(){ /* onStatus reports the error */ });
  }

  function leaveLobby(){
    if (window.ElxiNet) window.ElxiNet.close();
    st.online = false; st.netRole = null;
    st.hostStatus = null; st.joinStatus = null; st.netCode = null;
    st.phase = "mp_lobby"; _render();
  }

  /* ── Lobby-phase net wiring (status + disconnect) ── */
  function bindNetForLobby(){
    var Net = window.ElxiNet; if(!Net) return;
    Net.onStatus = function(state, info){
      if (st.netRole === "host"){
        if (state === "waiting" || state === "loading") { st.hostStatus = state; if (info && info.code) st.netCode = info.code; }
        else if (state === "connected") st.hostStatus = "connected";
        else if (state === "error"){ st.hostStatus = "error"; st.hostMsg = (info&&info.message)||"Something went wrong."; }
      } else if (st.netRole === "guest"){
        if (state === "loading" || state === "joining") st.joinStatus = state;
        else if (state === "connected"){
          st.joinStatus = "connected";
          // Arm the host-choice listener the instant we connect, so an early
          // mp_start from the host is never dropped between renders.
          armGuestModeWait();
        }
        else if (state === "error"){ st.joinStatus = "idle"; st.joinError = (info&&info.message)||"Couldn't connect."; }
      }
      // Only re-render if we're still inside a lobby screen.
      if (st.phase === "mp_host" || st.phase === "mp_join" || st.phase === "mp_guestwait") _render();
    };
    Net.onPeerLeave = function(){
      if (typeof window.flToast === "function") window.flToast("Your friend disconnected.");
      // Return to the lobby so a new game can be formed.
      st.online = false; st.netRole = null; st.hostStatus = null; st.joinStatus = null;
      st.phase = "mp_lobby";
      if (root && root.style.display !== "none") _render();
    };
    // Game-message handling is attached per-mode when a synced game starts.
    Net.onData = function(msg){ if (typeof st._netOnData === "function") st._netOnData(msg); };
  }

  /* ════════════════════════════════════════════════════
     GUEST: wait for the host to choose the game
     The host is in full control of the mode pick. The guest
     sits on a waiting screen until an {t:"mp_start"} arrives,
     then drops into the same game.
  ════════════════════════════════════════════════════ */
  function armGuestModeWait(){
    st._netOnData = function(msg){
      if (!msg || !msg.t) return;
      if (msg.t === "mp_start"){
        st._netOnData = null;            // the per-mode handler takes over from here
        st.phase = "idle";
        if (msg.poolKey && window.RW_POOLS){
          /* Apply the host's chosen pool before entering Duels */
          var RW_POOLS = window.RW_POOLS;
          for (var pi=0; pi<RW_POOLS.length; pi++){
            if (RW_POOLS[pi].key === msg.poolKey){
              var pool = RW_POOLS[pi];
              if (window[pool.dataKey]) {
                st._guestPoolKey = pool.key;
                st._guestPoolDataKey = pool.dataKey;
                st._guestPoolNational = pool.national;
                st._guestPoolLabel = pool.label;
              }
              break;
            }
          }
        }
        if (window.startDuelsOnline){
          window.startDuelsOnline("guest");
        }
      }
    };
  }

  function renderGuestWaitMode(){
    // Keep the listener armed even across re-renders.
    armGuestModeWait();
    var wrap = mk("div","mp-wrap mp-lobby");
    wrap.innerHTML = '<h2 class="mp-title">You\'re in!</h2>'+
      '<p class="mp-sub">The host is choosing the game. Hang tight — it\'ll start automatically.</p>';
    wrap.appendChild(mk("div","mp-online-tag", "Online · code " + esc(st.netCode || (window.ElxiNet&&window.ElxiNet.code) || "")));
    var wait = mk("div","mp-wait");
    wait.innerHTML = '<span class="mp-spinner"></span><span>Waiting for the host…</span>';
    wrap.appendChild(wait);
    var back = mk("button","mp-ghost-btn","← Leave game");
    back.addEventListener("click", function(){ if(window.ElxiNet) window.ElxiNet.close(); st.online=false; st.netRole=null; st.phase="mp_connect"; _render(); });
    wrap.appendChild(back);
    root.appendChild(wrap);
  }

  /* ════════════════════════════════════════════════════
     HOST SETTINGS — pick pool before Duels starts
  ════════════════════════════════════════════════════ */
  function renderHostSettings(){
    var RW_POOLS = window.RW_POOLS || [
      { key:"wc",         label:"World Cup",      hint:"93 nations · 1950–2026",  dataKey:"WORLD_CUP_DATA",   national:true  },
      { key:"euro",       label:"Euros",          hint:"Euros 1980–2024",         dataKey:"EURO_DATA",        national:true  },
      { key:"pl",         label:"Premier League", hint:"PL clubs · 1992–2025",    dataKey:"PL_DATA",          national:false },
      { key:"laliga",     label:"La Liga",        hint:"La Liga · 1987–2024",     dataKey:"LALIGA_DATA",      national:false },
      { key:"seriea",     label:"Serie A",        hint:"Serie A · 1987–2024",     dataKey:"SERIEA_DATA",      national:false },
      { key:"bundesliga", label:"Bundesliga",     hint:"Bundesliga · 1990–2024",  dataKey:"BUNDESLIGA_DATA",  national:false }
    ];
    var selected = st._hostPoolKey || "wc";
    var wrap = mk("div","mp-wrap");
    wrap.innerHTML = '<h2 class="mp-title">Game Settings</h2>'+
      '<p class="mp-sub">You\'re the host — pick the squad pool for Duels. Your opponent is waiting.</p>';
    wrap.appendChild(mk("div","mp-online-tag","Online · code " + esc(st.netCode || (window.ElxiNet&&window.ElxiNet.code) || "")));

    var grid = mk("div","rw-pool-grid");
    RW_POOLS.forEach(function(pool){
      var ok = window[pool.dataKey] && Object.keys(window[pool.dataKey]).length > 0;
      var btn = mk("button","rw-pool-card"+(ok?"":" rw-pool-disabled")+(pool.key===selected?" rw-pool-selected":""));
      btn.innerHTML = '<span class="rw-pool-name">'+esc(pool.label)+'</span><span class="rw-pool-hint">'+esc(pool.hint)+'</span>';
      if (ok) btn.addEventListener("click", function(){
        selected = pool.key; st._hostPoolKey = pool.key;
        wrap.querySelectorAll(".rw-pool-card").forEach(function(b){ b.classList.remove("rw-pool-selected"); });
        btn.classList.add("rw-pool-selected");
      });
      grid.appendChild(btn);
    });
    wrap.appendChild(grid);

    var startBtn = mk("button","mp-start-btn","Start Duels →");
    startBtn.style.marginTop = "20px";
    startBtn.addEventListener("click", function(){
      var poolKey = st._hostPoolKey || "wc";
      if (window.ElxiNet) window.ElxiNet.send({ t:"mp_start", mode:"duels", poolKey:poolKey });
      /* Apply pool to our own RW state before entering */
      var chosenPool = null;
      for (var pi=0;pi<RW_POOLS.length;pi++){ if(RW_POOLS[pi].key===poolKey){ chosenPool=RW_POOLS[pi]; break; } }
      if (chosenPool && window[chosenPool.dataKey]){
        st._guestPoolKey = chosenPool.key;
        st._guestPoolDataKey = chosenPool.dataKey;
        st._guestPoolNational = chosenPool.national;
        st._guestPoolLabel = chosenPool.label;
      }
      st.phase = "idle";
      if (window.startDuelsOnline) window.startDuelsOnline("host");
    });
    wrap.appendChild(startBtn);

    var back = mk("button","mp-ghost-btn","← Back");
    back.style.marginTop = "10px";
    back.addEventListener("click", function(){ st.phase = "mp_modeselect"; _render(); });
    wrap.appendChild(back);
    root.appendChild(wrap);
  }

  /* ════════════════════════════════════════════════════
     PHASE 0 — MULTIPLAYER MODE SELECT (Tournament vs Duels)
     Online: host-only. The chosen mode is broadcast to the
     guest via {t:"mp_start"} so both drop into it together.
  ════════════════════════════════════════════════════ */
  function renderMpModeSelect(){
    var wrap = mk("div","mp-wrap");
    var sub = st.online ? "You're connected — pick a head-to-head game." : "Choose how you and your mates want to play.";
    wrap.innerHTML = '<h2 class="mp-title">Multiplayer</h2><p class="mp-sub">'+sub+'</p>';
    if (st.online){
      wrap.appendChild(mk("div","mp-online-tag", "Online · code " + esc(st.netCode || (window.ElxiNet&&window.ElxiNet.code) || "")));
    }
    var grid = mk("div","mp-modeselect");

    var t = mk("button","mp-ms-card m-mp");
    t.innerHTML = '<span class="mp-ms-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h12v3a6 6 0 0 1-12 0z"/><path d="M6 5H4a2 2 0 0 0 0 4h2M18 5h2a2 2 0 0 1 0 4h-2"/><path d="M9 19h6M10 15v4M14 15v4"/></svg></span>'+
      '<span class="mp-ms-name">Draft Tournament</span><span class="mp-ms-hint">2–8 players each draft an all-time XI, then a knockout bracket decides the champion.</span>';
    if (st.online){
      // Online draft (shared live pool sync) isn't built yet — be honest and steer to the local flow.
      t.classList.add("mp-ms-soon");
      t.addEventListener("click", function(){
        if (typeof window.flToast === "function")
          window.flToast("Draft Tournament is local-only for now — try Duels online, or switch to Local.");
      });
    } else {
      t.addEventListener("click", function(){ st.phase = "setup"; _render(); });
    }
    grid.appendChild(t);

    var r = mk("button","mp-ms-card m-rw");
    r.innerHTML = '<span class="mp-ms-badge">'+(st.online?"Online":"Head to head")+'</span>'+
      '<span class="mp-ms-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 3l6 6-3 3-6-6z"/><path d="M11.5 6L3 14.5 6 18l8.5-8.5"/><path d="M3 21l3-1M16 13l5 5-2 2-5-5"/></svg></span>'+
      '<span class="mp-ms-name">Duels</span><span class="mp-ms-hint">'+
      (st.online ? "Each of you builds blind on your own device, then the reveal decides it slot by slot."
                 : "Two managers build blind — ratings hidden — then a position-by-position reveal decides each slot.")+'</span>';
    r.addEventListener("click", function(){
      if (st.online && window.startDuelsOnline){
        st.phase = "mp_hostsettings"; _render();
      }
      else if (window.startDuels){ st.phase = "idle"; window.startDuels(); }
    });
    grid.appendChild(r);

    wrap.appendChild(grid);

    if (st.online){
      var back = mk("button","mp-ghost-btn","← Leave game");
      back.addEventListener("click", function(){ if(window.ElxiNet) window.ElxiNet.close(); st.online=false; st.netRole=null; st.phase="mp_connect"; _render(); });
      wrap.appendChild(back);
    }

    root.appendChild(wrap);
  }

  /* ════════════════════════════════════════════════════
     PHASE 1 — LOBBY SETUP
  ════════════════════════════════════════════════════ */
  function renderSetup(){
    var wrap = mk("div","mp-wrap");
    wrap.innerHTML = '<h2 class="mp-title">Multiplayer Draft</h2><p class="mp-sub">Build your XI, one pick at a time. Beat your mates in the tournament.</p>';

    /* ── Number of players ── */
    var numWrap = mk("div","mp-section");
    numWrap.innerHTML = '<div class="mp-label">Players</div>';
    var numRow = mk("div","mp-btn-row");
    [2,3,4,5,6,7,8].forEach(function(n){
      var b = mk("button","mp-pill-btn" + (n===st.numPlayers?" active":""), n);
      b.addEventListener("click",function(){ st.numPlayers=n; _render(); });
      numRow.appendChild(b);
    });
    numWrap.appendChild(numRow);
    wrap.appendChild(numWrap);

    /* ── Player names ── */
    var namesWrap = mk("div","mp-section");
    namesWrap.innerHTML = '<div class="mp-label">Names</div>';
    var namesGrid = mk("div","mp-names-grid");
    for (var i=0;i<st.numPlayers;i++){
      var currentName = (st.players[i]&&st.players[i].name) ? st.players[i].name : "";
      var inp = mk("input","mp-name-inp");
      inp.type="text"; inp.placeholder="Player "+(i+1); inp.maxLength=20; inp.value=currentName;
      inp.dataset.idx=i;
      inp.addEventListener("input",function(e){
        var idx=+e.target.dataset.idx;
        if(!st.players[idx]) st.players[idx]={name:"",formation:"",manager:null,picks:[]};
        st.players[idx].name=e.target.value.trim();
      });
      namesGrid.appendChild(inp);
    }
    namesWrap.appendChild(namesGrid);
    wrap.appendChild(namesWrap);

    /* ── Player pool (mode) ── */
    var modeWrap = mk("div","mp-section");
    modeWrap.innerHTML = '<div class="mp-label">Player pool</div>';
    var modeGrid = mk("div","mp-mode-grid");
    Object.keys(MP_MODE_DATA).forEach(function(k){
      var b = mk("button","mp-mode-btn"+(k===st.mpMode?" active":""), MP_MODE_DATA[k].label);
      b.addEventListener("click",function(){ st.mpMode=k; _render(); });
      modeGrid.appendChild(b);
    });
    modeWrap.appendChild(modeGrid);
    wrap.appendChild(modeWrap);

    /* ── Tournament format ── */
    var fmtWrap = mk("div","mp-section");
    fmtWrap.innerHTML = '<div class="mp-label">Tournament format</div>';
    var fmtRow = mk("div","mp-btn-row");
    var n = st.numPlayers;
    var autoLabel = n===2 ? "Head-to-head" : n<=5 ? "Group → Final" : "Group → KO";
    var fmtOpts = [
      { val:"auto",  label:"Auto ("+autoLabel+")" },
      { val:"h2h",   label:"Head-to-head" },
      { val:"group", label:"Group → Final" },
      { val:"full",  label:"Group → Semis → Final" }
    ];
    fmtOpts.forEach(function(opt){
      var b = mk("button","mp-pill-btn"+(opt.val===st.tournamentFormat?" active":""), opt.label);
      b.addEventListener("click",function(){ st.tournamentFormat=opt.val; _render(); });
      fmtRow.appendChild(b);
    });
    fmtWrap.appendChild(fmtRow);
    wrap.appendChild(fmtWrap);

    /* ── Summary line ── */
    var fmtDesc  = st.tournamentFormat==="auto" ? autoLabel :
                   st.tournamentFormat==="h2h"  ? "Head-to-head" :
                   st.tournamentFormat==="group" ? "Group stage → Final" : "Group → Semis → Final";
    var infoEl = mk("div","mp-fmt-info","3 rerolls per player &nbsp;·&nbsp; "+fmtDesc+" &nbsp;·&nbsp; Round-robin draft · 11 picks each");
    wrap.appendChild(infoEl);

    /* ── Start ── */
    var startBtn = mk("button","mp-start-btn","Start →");
    startBtn.addEventListener("click", beginSetup);
    wrap.appendChild(startBtn);

    root.appendChild(wrap);
  }

  /* Lazy-load per-pool history files so multiplayer has full multi-season data */
  var POOL_LAZY = {
    pl:         { src:"./data_pl_history.js?v=71",     key:"PL_DATA" },
    laliga:     { src:"./data_laliga_history.js?v=71", key:"LALIGA_DATA" },
    seriea:     { src:"./data_seriea_history.js?v=71", key:"SERIEA_DATA" },
    bundesliga: { src:"./data_bundesliga_history.js?v=71", key:"BUNDESLIGA_DATA" }
  };
  function ensurePoolData(mode, cb){
    var lazy = POOL_LAZY[mode];
    if (!lazy || !window.lazyLoad){ cb(); return; }
    var data = window[lazy.key];
    /* check if we have more than just the current season */
    var years = data ? Object.keys(data) : [];
    var firstClub = years[0] && data[years[0]] ? data[years[0]].years : {};
    var hasHistory = Object.keys(firstClub).length > 1;
    if (hasHistory){ cb(); return; }
    window.lazyLoad(lazy.src, lazy.key, cb);
  }

  function beginSetup(){
    /* Collect names from inputs */
    var inputs = root.querySelectorAll(".mp-name-inp");
    var players = [];
    for (var i=0;i<st.numPlayers;i++){
      var raw = inputs[i] ? inputs[i].value.trim() : "";
      players.push({ name: raw||("Player "+(i+1)), formation:"", manager:null, mgrSpun:false, picks:[], rerollsUsed:0 });
    }
    /* Lazy-load full squad data before entering setup */
    ensurePoolData(st.mpMode, function(){
      st.players = players;
      st.setupIdx = 0;
      st.handoffFrom = 0;
      st.usedFormations = {};
      st.lockedNames = {};
      st.currentSpin = null;
      st.pendingPick = null;
      st.pendingHandoff = null;
      st.simData = null;
      st.simStep = -1;
      st.revealIdx = -1;
      st._histSaved = false;
      st.cur = 0;
      st.mgrSpinResult = null;
      st.phase = "player_setup";
      _render();
    });
  }

  /* ════════════════════════════════════════════════════
     PHASE 2 — PER-PLAYER SETUP (formation + manager)
  ════════════════════════════════════════════════════ */
  function renderPlayerSetup(){
    var p = st.players[st.setupIdx];
    /* Pre-load saved manager if player hasn't chosen yet */
    if(!p.manager){
      try{
        var saved=JSON.parse(localStorage.getItem("wcxi_manager")||"{}");
        if(saved.id && saved.id!=="none"){
          var found=MP_MANAGERS.filter(function(m){ return m.id===saved.id; })[0];
          if(found) p.manager={id:found.id,emoji:found.emoji,name:saved.name||found.name,atk:found.atk,def:found.def,ko:found.ko,desc:found.desc};
        }
      }catch(e){}
    }
    var wrap = mk("div","mp-wrap");
    wrap.innerHTML = '<h2 class="mp-title">'+esc(p.name)+'</h2>' +
      '<p class="mp-sub">Choose your formation and manager before the draft starts.</p>';

    /* ── Formation ── */
    var fSec = mk("div","mp-section");
    fSec.innerHTML = '<div class="mp-label">Formation</div>';

    /* Pitch preview — updates live when formation changes */
    var pitchPreviewWrap = mk("div","setup-pitch-wrap mp-setup-pitch-wrap");
    var pitchPreviewTitle = mk("div","pitch-title");
    pitchPreviewTitle.id = "mpSetupPitchTitle";
    pitchPreviewTitle.textContent = p.formation || "Choose a formation";
    var pitchPreviewEl = mk("div");
    pitchPreviewEl.id = "mpSetupPitch";
    if(p.formation) pitchPreviewEl.innerHTML = buildWCPitch(p);
    pitchPreviewWrap.appendChild(pitchPreviewTitle);
    pitchPreviewWrap.appendChild(pitchPreviewEl);
    fSec.appendChild(pitchPreviewWrap);

    var fGrid = mk("div","mp-formation-grid");
    Object.keys(MP_FORMATIONS).forEach(function(f){
      var isMine = p.formation === f;
      var cls = "mp-f-btn" + (isMine?" selected":"");
      var b = mk("button", cls);
      b.innerHTML = '<span class="mp-f-name">'+f+'</span>';
      b.addEventListener("click",function(){
        p.formation = f;
        /* Update pitch preview inline without full re-render */
        var pt=eid("mpSetupPitchTitle"); if(pt) pt.textContent=f;
        var pe=eid("mpSetupPitch"); if(pe) pe.innerHTML=buildWCPitch(p);
        fGrid.querySelectorAll(".mp-f-btn").forEach(function(x){ x.classList.remove("selected"); });
        b.classList.add("selected");
        /* Still need re-render to enable Confirm button */
        _render();
      });
      fGrid.appendChild(b);
    });
    fSec.appendChild(fGrid);
    wrap.appendChild(fSec);

    /* ── Manager ── */
    var mSec = mk("div","mp-section");
    mSec.innerHTML = '<div class="mp-label">Manager</div>';

    /* Style selector */
    var styleRow = mk("div","mp-mgr-style-row");
    MP_MANAGERS.forEach(function(m){
      var active = p.manager && p.manager.id===m.id;
      var b = mk("button","mp-mgr-style-btn"+(active?" active":""), m.emoji+"<span>"+esc(m.name)+"</span>");
      b.title = m.desc;
      b.addEventListener("click",function(){
        p.manager = { id:m.id, emoji:m.emoji, name:m.name, atk:m.atk, def:m.def, ko:m.ko, desc:m.desc };
        st.mgrSpinResult = null;
        try{ localStorage.setItem("wcxi_manager", JSON.stringify({id:m.id,name:""})); }catch(e){}
        _render();
      });
      styleRow.appendChild(b);
    });
    mSec.appendChild(styleRow);

    /* Spin reel */
    var spinWrap = mk("div","mp-mgr-spin-wrap");
    var reelEl = mk("div","mp-mgr-reel");
    reelEl.id = "mpMgrReel";
    var stripEl = mk("div","mp-mgr-strip");
    stripEl.id = "mpMgrStrip";
    reelEl.appendChild(stripEl);
    spinWrap.appendChild(reelEl);
    var spinBtn = mk("button","mp-spin-btn"+(p.mgrSpun?" disabled":""),p.mgrSpun?"Manager appointed":"Spin for manager");
    spinBtn.id = "mpMgrSpinBtn";
    if(p.mgrSpun) spinBtn.disabled = true;
    spinWrap.appendChild(spinBtn);
    mSec.appendChild(spinWrap);

    if (p.manager) {
      var mDesc = mk("div","mp-mgr-chosen",
        p.manager.emoji+" <strong>"+esc(p.manager.name)+"</strong> — "+esc(p.manager.desc||""));
      mSec.appendChild(mDesc);
    }

    wrap.appendChild(mSec);

    /* ── Confirm ── */
    var canConfirm = p.formation && p.manager;
    var confirmBtn = mk("button","mp-confirm-btn"+(canConfirm?"":" disabled"), "Confirm →");
    if (canConfirm) {
      confirmBtn.addEventListener("click", confirmPlayerSetup);
    } else {
      confirmBtn.disabled = true;
      confirmBtn.title = "Choose a formation and manager first";
    }
    wrap.appendChild(confirmBtn);

    root.appendChild(wrap);

    /* Wire up manager reel after DOM insert */
    initMgrStrip(eid("mpMgrStrip"), p);
    eid("mpMgrSpinBtn").addEventListener("click", function(){
      doMgrSpin(eid("mpMgrStrip"), eid("mpMgrSpinBtn"), p);
    });
  }

  function initMgrStrip(stripEl, player){
    if(!stripEl) return;
    /* If this player already spun, lock the reel on the result */
    if(player && player.mgrSpun && player.manager){
      var s = styleById(player.manager.id);
      stripEl.innerHTML = '<div class="mp-mgr-item highlight">'+s.emoji+' <span>'+esc(player.manager.name)+'</span></div>';
      stripEl.style.transform = "translateY(0)";
      stripEl.style.transition = "none";
      return;
    }
    var db = getMgrDbForMode(st.mpMode);
    var items = [];
    for (var i=0;i<24;i++){
      var m = db[i%db.length];
      var s = styleById(m.s);
      items.push('<div class="mp-mgr-item">'+s.emoji+' <span>'+esc(m.n)+'</span></div>');
    }
    stripEl.innerHTML = items.join("");
    stripEl.style.transform = "translateY(0)";
    stripEl.style.transition = "none";
  }

  var _mgrSpinning = false;
  function doMgrSpin(stripEl, spinBtn, player){
    if (_mgrSpinning) return;
    _mgrSpinning = true;
    spinBtn.disabled = true;

    var db = getMgrDbForMode(st.mpMode);
    var BLUR = 12, IH = 48;
    var picked = db[Math.floor(Math.random()*db.length)];
    var style = styleById(picked.s);

    var items = [];
    for (var i=0;i<BLUR;i++){
      var m = db[i%db.length];
      var ms = styleById(m.s);
      items.push('<div class="mp-mgr-item">'+ms.emoji+' <span>'+esc(m.n)+'</span></div>');
    }
    items.push('<div class="mp-mgr-item highlight">'+style.emoji+' <span>'+esc(picked.n)+'</span></div>');
    stripEl.innerHTML = items.join("");
    stripEl.style.transition = "none";
    stripEl.style.transform = "translateY(0)";

    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        stripEl.style.transition = "transform 500ms cubic-bezier(0.25,0.1,0.15,1)";
        stripEl.style.transform = "translateY(-"+(BLUR*IH)+"px)";
        setTimeout(function(){
          _mgrSpinning = false;
          player.manager = { id:picked.s, emoji:style.emoji, name:picked.n, atk:style.atk, def:style.def, ko:style.ko, desc:style.desc };
          player.mgrSpun = true;   /* lock — max 1 spin per person */
          try{ localStorage.setItem("wcxi_manager", JSON.stringify({id:picked.s, name:picked.n})); }catch(e){}
          _render();
        }, 560);
      });
    });
  }

  function confirmPlayerSetup(){
    var nextIdx = st.setupIdx + 1;
    if (nextIdx >= st.numPlayers){
      /* All players set up — go straight to draft */
      st.cur = 0;
      st.phase = "draft";
      _render();
    } else {
      st.phase = "handoff_setup";
      _render();
    }
  }

  /* ════════════════════════════════════════════════════
     PHASE 2b — HANDOFF between setup players
  ════════════════════════════════════════════════════ */
  function renderHandoffSetup(){
    var donePlayer = st.players[st.setupIdx];
    var nextPlayer = st.players[st.setupIdx+1];
    var wrap = mk("div","mp-handoff-wrap");
    wrap.innerHTML =
      '<div class="mp-handoff-card">'+
        '<div class="mp-handoff-done">✓ '+esc(donePlayer.name)+' is set up</div>'+
        '<div class="mp-handoff-formation">'+esc(donePlayer.formation)+' · '+
          (donePlayer.manager?donePlayer.manager.emoji+" "+esc(donePlayer.manager.name):"No manager")+
        '</div>'+
        '<div class="mp-handoff-arrow">↓</div>'+
        '<div class="mp-handoff-next">Pass to</div>'+
        '<div class="mp-handoff-name">'+esc(nextPlayer.name)+'</div>'+
        '<button class="mp-handoff-btn" id="mpHandoffSetupGo">I\'m ready →</button>'+
      '</div>';
    root.appendChild(wrap);
    eid("mpHandoffSetupGo").addEventListener("click", function(){
      st.setupIdx++;
      st.mgrSpinResult = null;
      st.phase = "player_setup";
      _render();
    });
  }

  /* ════════════════════════════════════════════════════
     PHASE 3 — ROUND-ROBIN DRAFT
  ════════════════════════════════════════════════════ */
  var _draftSpinning = false;

  function renderDraft(){
    /* ── Pass screen: show after a pick so player can manually hand over ── */
    if (st.pendingHandoff) {
      var fromP = st.players[st.pendingHandoff.from];
      var toP   = st.players[st.pendingHandoff.to];
      var lp    = st.pendingHandoff.lastPick;

      var pw = mk("div","mp-wrap");
      var passScreen = mk("div","mp-pass-screen");
      /* Updated pitch */
      var pitchDiv = mk("div","draft-pitch-wrap");
      pitchDiv.style.width = "260px";
      pitchDiv.innerHTML = buildWCPitch(fromP);
      passScreen.appendChild(pitchDiv);
      /* Confirmation */
      var msg = mk("div","mp-pass-picked");
      msg.innerHTML = '✓ <strong>'+esc(lp?lp.n:"Player")+'</strong> added as '+
        (lp?'<strong>'+esc(lp.slot||lp.gp||lp.p)+'</strong>':'a pick')+
        ' ('+fromP.picks.length+'/11)';
      passScreen.appendChild(msg);
      /* Pass button */
      var passBtn = mk("button","mp-start-btn mp-pass-btn","Pass to "+esc(toP.name)+" →");
      passBtn.addEventListener("click", function(){
        st.cur = st.pendingHandoff.to;
        st.pendingHandoff = null;
        _render();
      });
      passScreen.appendChild(passBtn);
      pw.appendChild(passScreen);
      root.appendChild(pw);
      return;
    }

    var p = st.players[st.cur];
    var pickNum = p.picks.length + 1;
    var draftRound = Math.min.apply(null, st.players.map(function(pl){return pl.picks.length;})) + 1;

    /* ── Home button (fixed top-left like WC/CL) ── */
    var homeBtn = mk("button","draft-corner-home","← Home");
    homeBtn.addEventListener("click", goHome);
    root.appendChild(homeBtn);

    var wrap = mk("div","draft-layout");

    /* ══ LEFT COLUMN: pitch + machine ══ */
    var draftLeft = mk("div","draft-left");

    /* Pitch header */
    var pitchHeader = mk("div","draft-pitch-header");
    var rerollsRemaining = Math.max(0, 3 - (p.rerollsUsed||0));
    pitchHeader.innerHTML =
      '<div class="draft-team">'+esc(p.name)+'</div>'+
      '<div class="draft-meta">'+
        'Pick <strong>'+pickNum+'</strong>/11 · Round '+draftRound+' · '+
        esc(p.formation)+' · '+(p.manager?p.manager.emoji+' '+esc(p.manager.name):'No manager')+
        ' · <span class="mp-reroll-badge'+(rerollsRemaining===0?' mp-reroll-empty':'')+'">'+rerollsRemaining+'/3 rerolls</span>'+
      '</div>';
    draftLeft.appendChild(pitchHeader);

    /* Pitch */
    var pitchWrapLeft = mk("div","draft-pitch-wrap");
    pitchWrapLeft.id = "mpPitchWrap";
    pitchWrapLeft.innerHTML = buildWCPitch(p);
    draftLeft.appendChild(pitchWrapLeft);

    /* ── Spin machine (WC-style .machine) ── */
    var machine = mk("div","machine");
    var reels = mk("div","reels");

    var cBox = mk("div","reel-box");
    cBox.innerHTML = '<div class="reel-label">Club / Nation</div>';
    var cReel = mk("div","reel"); var cStrip = mk("div","reel-strip"); cStrip.id="mpCS";
    cReel.appendChild(cStrip); cBox.appendChild(cReel); reels.appendChild(cBox);

    var yBox = mk("div","reel-box");
    yBox.innerHTML = '<div class="reel-label">Year</div>';
    var yReel = mk("div","reel"); var yStrip = mk("div","reel-strip"); yStrip.id="mpYS";
    yReel.appendChild(yStrip); yBox.appendChild(yReel); reels.appendChild(yBox);

    machine.appendChild(reels);
    var controls = mk("div","controls");
    var spinBtn = mk("button","spin","SPIN");
    spinBtn.id = "mpDraftSpin";
    controls.appendChild(spinBtn);
    machine.appendChild(controls);
    draftLeft.appendChild(machine);

    /* ── Squad panel (hidden until spin lands) ── */
    var squadPanel = mk("section","squad mp-squad-panel");
    squadPanel.id = "mpSquadPanel";
    squadPanel.style.display = "none";
    draftLeft.appendChild(squadPanel);

    wrap.appendChild(draftLeft);

    /* ══ RIGHT COLUMN: XI list ══ */
    var draftRight = mk("div","draft-right");

    var xiSec = mk("section","xi");
    xiSec.innerHTML =
      '<div class="xi-head"><h2>'+esc(p.name)+'\'s XI</h2>'+
        '<div><span class="count" id="mpXiCount">'+p.picks.length+'/11</span>'+
        ' <span class="formation">· '+esc(p.formation)+'</span></div>'+
      '</div>';
    var xiList = mk("div","xi-list"); xiList.id="mpXiList";
    xiSec.appendChild(xiList);

    /* Auto-fill button when 9+ slots filled */
    if(p.picks.length >= 9 && p.picks.length < 11){
      var remaining = 11 - p.picks.length;
      var afBtn = mk("button","btn-ghost mp-autofill-btn",
        "Auto-fill remaining " + remaining + " slot" + (remaining===1?"":"s") + " →");
      afBtn.addEventListener("click",function(){
        mpAutoFill(p);
      });
      xiSec.appendChild(afBtn);
    }

    draftRight.appendChild(xiSec);
    wrap.appendChild(draftRight);

    root.appendChild(wrap);

    /* Render XI list */
    renderMPXiList(p, eid("mpXiList"));

    /* Wire up strips and spin */
    initDraftStrips(eid("mpCS"), eid("mpYS"), st.currentSpin);

    eid("mpDraftSpin").addEventListener("click", function(){
      st.pendingPick = null;
      doSpinDraft(eid("mpCS"), eid("mpYS"), eid("mpDraftSpin"), eid("mpSquadPanel"), p);
    });

    if (st.currentSpin){
      updateSpinBtn(eid("mpDraftSpin"));
      showSquadPanel(eid("mpSquadPanel"), st.currentSpin, p);
    } else {
      updateSpinBtn(eid("mpDraftSpin"));
    }
  }

  /* Build WC-style XI list grouped by line */
  function renderMPXiList(player, el){
    if(!el) return;
    var f = MP_FORMATIONS[player.formation]; if(!f) return;
    var bySlot = {};
    (player.picks||[]).forEach(function(pk){
      var s = pk.slot||pk.gp||pk.p||"MID";
      if(!bySlot[s]) bySlot[s] = [];
      bySlot[s].push(pk);
    });
    function pop(s){ var a=bySlot[s]; return a&&a.length?a.shift():null; }

    var allLines = [["GK"]].concat(f.lines);
    var lineNames = ["Goalkeeper","Defence","Midfield","Attack"];
    /* For formations with more than 4 line groups */
    while(lineNames.length < allLines.length) lineNames.push("Attack");

    var html = "";
    allLines.forEach(function(row, li){
      html += '<div class="line-label">'+(lineNames[li]||"")+'</div>';
      row.forEach(function(slot){
        var lc = MP_LINE_OF[slot]||"MID";
        var pk = pop(slot);
        if(pk){
          html += '<div class="xi-row"><span class="pos '+lc+'">'+slot+'</span>'+
            '<span class="info"><span class="pn">'+esc(pk.n)+'</span>'+
            '<span class="meta">'+esc(pk.country||"")+(pk.year?' &middot; '+pk.year:'')+'</span></span></div>';
        } else {
          html += '<div class="xi-row empty"><span class="pos '+lc+'">'+slot+'</span>'+
            '<span class="info"><span class="pn slot-empty">'+slot+' — empty</span></span></div>';
        }
      });
    });
    el.innerHTML = html;
  }

  /* Reel item HTML — no flag emoji (flags are kept only in World Cup mode) */
  function cItemHTML(c){
    return '<div class="reel-item reel-item-noflag"><span class="name">'+esc(c)+'</span></div>';
  }
  function yItemHTML(y){ return '<div class="reel-item"><span class="year">'+y+'</span></div>'; }

  function initDraftStrips(cStrip, yStrip, currentSpin){
    /* If there's already a spin result, show it locked on the strips */
    if(currentSpin){
      cStrip.innerHTML = cItemHTML(currentSpin.country);
      yStrip.innerHTML = yItemHTML(currentSpin.year);
      cStrip.style.cssText = "transform:translateY(0);transition:none";
      yStrip.style.cssText = "transform:translateY(0);transition:none";
      return;
    }
    /* No spin yet — show placeholder idle items */
    var DATA = getData();
    var countries = Object.keys(DATA);
    var BLUR = 10;
    var citems = [], yitems = [];
    for (var i=0;i<BLUR*2+1;i++){
      var c = countries[i%Math.max(countries.length,1)];
      citems.push(cItemHTML(c));
      yitems.push(yItemHTML(2024-((i*2)%30)));
    }
    cStrip.innerHTML = citems.join(""); cStrip.style.cssText = "transform:translateY(0);transition:none";
    yStrip.innerHTML = yitems.join(""); yStrip.style.cssText = "transform:translateY(0);transition:none";
  }

  function ratingTierClass(r){ if(!r) return ""; return r>=90?" r-gold":r>=85?" r-elite":r>=80?" r-great":r>=75?" r-good":r>=70?" r-amber":r>=60?" r-orange":" r-red"; }

  /* ── MP-2: Auto-fill remaining slots ─────────────────────────────── */
  function mpAutoFillSlotCompat(gp){
    var m = {
      GK:["GK"], CB:["CB"], RB:["RB","RWB"], LB:["LB","LWB"],
      RWB:["RWB","RB"], LWB:["LWB","LB"],
      CDM:["CDM","CM"], CM:["CM","CDM","CAM"], CAM:["CAM","CM","ST"],
      RM:["RM","RW","CM"], LM:["LM","LW","CM"],
      RW:["RW","RM","ST"], LW:["LW","LM","ST"], ST:["ST","LW","RW","CAM"],
      /* broad position fallbacks */
      DEF:["CB","RB","LB","RWB","LWB"],
      MID:["CM","CDM","CAM","LM","RM"],
      FWD:["ST","LW","RW"]
    };
    return m[gp] || [gp];
  }

  function mpAutoFill(player){
    var DATA = getData();
    var pool = [];
    Object.keys(DATA).forEach(function(country){
      var entry = DATA[country];
      if(!entry || !entry.years) return;
      Object.keys(entry.years).forEach(function(yr){
        (entry.years[yr] || []).forEach(function(pl){
          if((pl.r||0) >= 75 && !st.lockedNames.hasOwnProperty(pl.n)){
            pool.push({ n:pl.n, p:pl.p||"MID", r:pl.r||75,
                        gp:pl.gp||pl.p||"MID", country:country, year:yr });
          }
        });
      });
    });
    /* Shuffle for variety */
    for(var i=pool.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=pool[i]; pool[i]=pool[j]; pool[j]=t; }

    var openCounts = openSlotCounts(player);
    Object.keys(openCounts).forEach(function(slot){
      var remaining = openCounts[slot];
      if(remaining <= 0) return;
      for(var i=0; i<remaining; i++){
        var candidates = pool.filter(function(pl){
          return mpAutoFillSlotCompat(pl.gp).indexOf(slot) !== -1;
        }).sort(function(a,b){ return (b.r||0)-(a.r||0); });
        if(!candidates.length) continue;
        var pick = candidates[0];
        pool = pool.filter(function(pl){ return pl.n !== pick.n; });
        st.lockedNames[pick.n] = st.cur;
        player.picks.push({ n:pick.n, p:pick.p, r:pick.r, gp:pick.gp,
                             slot:slot, country:pick.country, year:pick.year });
        openCounts[slot]--;
      }
    });

    st.currentSpin = null;
    st.pendingPick = null;
    advanceDraft();
  }

  /* ── MP-3: Cross-session win history ─────────────────────────────── */
  var MP_HISTORY_KEY = "wcxi_mp_history";

  function _saveMpHistory(championName){
    var entry = {
      ts: new Date().toISOString(),
      winner: championName,
      players: st.players.map(function(p){
        var avg = p.picks.length ? Math.round(p.picks.reduce(function(s,pk){return s+(pk.r||0);},0)/p.picks.length) : 0;
        return { name: p.name, avg: avg };
      })
    };
    var hist = [];
    try{ hist = JSON.parse(localStorage.getItem(MP_HISTORY_KEY)||"[]"); }catch(e){}
    if(!Array.isArray(hist)) hist = [];
    hist.unshift(entry);
    if(hist.length > 10) hist = hist.slice(0,10);
    try{ localStorage.setItem(MP_HISTORY_KEY, JSON.stringify(hist)); }catch(e){}
  }

  function _loadMpHistory(){
    try{ return JSON.parse(localStorage.getItem(MP_HISTORY_KEY)||"[]"); }catch(e){ return []; }
  }

  /* Returns rerolls remaining for the current player.
     First spin (no current result) is always free.
     Each respin costs 1 from the player's 3-reroll budget. */
  function rerollsLeft(){
    if(!st.currentSpin) return -1; /* free spin — not a reroll */
    var p = st.players[st.cur];
    return Math.max(0, 3 - (p ? p.rerollsUsed||0 : 0));
  }

  function updateSpinBtn(spinBtn){
    var left = rerollsLeft();
    if(left===0){
      spinBtn.disabled = true;
      spinBtn.textContent = "No rerolls left — pick!";
    } else if(left===-1){
      spinBtn.disabled = false;
      spinBtn.textContent = "SPIN";
    } else {
      spinBtn.disabled = false;
      spinBtn.textContent = "RESPIN ("+left+" left)";
    }
  }

  function doSpinDraft(cStrip, yStrip, spinBtn, squadPanel, player){
    if (_draftSpinning) return;
    var isRespin = !!st.currentSpin;
    if(isRespin && rerollsLeft()===0) return; /* Reroll limit reached */
    var DATA = getData();
    var countries = Object.keys(DATA);
    if (!countries.length) return;

    if(isRespin){ player.rerollsUsed = (player.rerollsUsed||0) + 1; }
    _draftSpinning = true;
    spinBtn.disabled = true;
    spinBtn.textContent = "SPINNING…";
    squadPanel.style.display = "none";
    st.currentSpin = null;

    /* Pick a random country+year with at least 11 players */
    var tries=0, pC, pY, pS;
    do {
      pC = countries[Math.floor(Math.random()*countries.length)];
      var ys = Object.keys(DATA[pC].years);
      pY = ys[Math.floor(Math.random()*ys.length)];
      pS = DATA[pC].years[pY];
      tries++;
    } while(tries<80 && (!pS || pS.length < 11));

    var BLUR=12, IH=56;
    var citems=[], yitems=[];
    for (var i=0;i<BLUR;i++){
      citems.push(cItemHTML(countries[i%countries.length]));
      yitems.push(yItemHTML(2024-i*2));
    }
    citems.push(cItemHTML(pC));
    yitems.push(yItemHTML(pY));

    cStrip.innerHTML = citems.join("");
    yStrip.innerHTML = yitems.join("");
    cStrip.style.cssText = "transform:translateY(0);transition:none";
    yStrip.style.cssText = "transform:translateY(0);transition:none";

    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        var ease = "cubic-bezier(0.12,0.05,0.05,1)"; /* sharper decel = snap feel */
        var dur = 520;
        /* Use actual item height after render if available */
        var renderedIH = (cStrip.firstElementChild && cStrip.firstElementChild.offsetHeight) || IH;
        cStrip.style.transition = "transform "+dur+"ms "+ease;
        cStrip.style.transform = "translateY(-"+(BLUR*renderedIH)+"px)";
        yStrip.style.transition = "transform "+(dur+50)+"ms "+ease;
        yStrip.style.transform = "translateY(-"+(BLUR*renderedIH)+"px)";

        /* Snap both strips to just the landed item after animation */
        function finishSpin(){
          cStrip.style.transition = "none";
          cStrip.style.transform = "translateY(0)";
          cStrip.innerHTML = cItemHTML(pC);
          yStrip.style.transition = "none";
          yStrip.style.transform = "translateY(0)";
          yStrip.innerHTML = yItemHTML(pY);
          /* Settle flash */
          var cReel = cStrip.parentElement, yReel = yStrip.parentElement;
          if(cReel){ cReel.classList.add("reel--settled"); setTimeout(function(){ cReel.classList.remove("reel--settled"); }, 950); }
          if(yReel){ yReel.classList.add("reel--settled"); setTimeout(function(){ yReel.classList.remove("reel--settled"); }, 950); }
          _draftSpinning = false;
          st.currentSpin = { country:pC, year:pY, squad:pS };
          updateSpinBtn(spinBtn);
          showSquadPanel(squadPanel, st.currentSpin, player);
        }
        setTimeout(finishSpin, dur + 80);
      });
    });
  }

  function showSquadPanel(panel, spin, player){
    var DATA = getData();

    /* Sort: GK → DEF → MID → FWD, then by rating desc within each line */
    var lineOrder = {GK:0,DEF:1,MID:2,FWD:3};
    var sorted = spin.squad.slice().sort(function(a,b){
      var la = lineOrder[MP_LINE_OF[a.gp||a.p]]||2;
      var lb = lineOrder[MP_LINE_OF[b.gp||b.p]]||2;
      return la!==lb ? la-lb : (b.r||0)-(a.r||0);
    });

    var rerollsRem = Math.max(0, 3 - (player.rerollsUsed||0));
    var html =
      '<div class="squad-card"><div class="squad-head"><h2>'+esc(spin.country)+' &middot; '+spin.year+'</h2>'+
        (rerollsRem > 0
          ? '<button class="squad-respin-btn" id="mpSqRespin">Respin ('+rerollsRem+' left)</button>'
          : '<span class="squad-respin-empty">No respins left</span>'
        )+'</div>'+
      '<div class="sub">Tap a player to place them</div>';

    /* ── Position chooser (shows when a player has been tapped) ── */
    if(st.pendingPick && st.pendingPick.spin === spin){
      var pp = st.pendingPick.squadPlayer;
      var eligible = eligibleSlots(pp, player);
      html += '<div class="mp-chooser">'+
        '<span class="mp-chooser-q">Where does <strong>'+esc(pp.n)+'</strong> play?</span>'+
        '<div class="mp-chooser-btns">';
      eligible.forEach(function(slot){
        var lineCls = MP_LINE_OF[slot]||"MID";
        html += '<button class="mp-choose-pos pos '+lineCls+'" data-slot="'+slot+'">'+
          (MP_POS_FULL[slot]||slot)+' <span>('+slot+')</span></button>';
      });
      html += '</div>'+
        '<button class="mp-chooser-cancel">Cancel</button>'+
        '</div>';
    }

    /* ── Player cards grouped by GK / DEF / MID / FWD ── */
    var lineLabels = {GK:"Goalkeeper",DEF:"Defenders",MID:"Midfielders",FWD:"Attackers"};
    var groups = {GK:[],DEF:[],MID:[],FWD:[]};
    sorted.forEach(function(pl){
      var line = MP_LINE_OF[pl.gp||pl.p]||"MID";
      (groups[line]||groups.MID).push(pl);
    });
    html += '<div class="players mp-players-grid">';
    ["GK","DEF","MID","FWD"].forEach(function(line){
      var grp = groups[line];
      if(!grp.length) return;
      html += '<div class="squad-group-label '+line+'">'+lineLabels[line]+'</div>';
      grp.forEach(function(pl){
        var locked = st.lockedNames.hasOwnProperty(pl.n);
        var pos = pl.gp||pl.p||"MID";
        var lineCls = MP_LINE_OF[pos]||"MID";
        var lockedByIdx = locked ? st.lockedNames[pl.n] : -1;
        var lockedByName = (lockedByIdx>=0&&st.players[lockedByIdx]) ? st.players[lockedByIdx].name : "";
        var noSlot = !locked && eligibleSlots(pl, player).length===0;
        var isPending = st.pendingPick && st.pendingPick.spin===spin && st.pendingPick.squadPlayer.n===pl.n;
        var cls = "player"+
          (locked?" taken":"")+
          (noSlot?" noslot":"")+
          (isPending?" mp-player-pending":"");
        html +=
          '<div class="'+cls+'" data-pl-n="'+esc(pl.n)+'">'+
            '<span class="pos '+lineCls+'">'+esc(pos)+'</span>'+
            '<span class="pname">'+esc(pl.n)+'</span>'+
            (locked
              ? '<span class="mp-locked-badge">'+esc(lockedByName||"✓")+'</span>'
              : noSlot
                ? '<span class="slot-tag">no slot</span>'
                : '<span class="mp-r-badge'+ratingTierClass(pl.r)+'">'+pl.r+'</span>'
            )+
          '</div>';
      });
    });
    html += '</div></div>';

    /* Count draftable players before rendering */
    var draftableCount = 0;
    sorted.forEach(function(pl){
      if(!st.lockedNames.hasOwnProperty(pl.n) && eligibleSlots(pl, player).length > 0) draftableCount++;
    });

    /* Free respin: no eligible players at all → auto spin again */
    if(draftableCount === 0 && !st.pendingPick){
      var freeHtml = html +
        '<div class="mp-free-respin">No positions fit — <strong>Free Respin!</strong></div></div>';
      panel.innerHTML = freeHtml;
      panel.style.display = "";
      /* Trigger a free spin after a short delay so player sees the message */
      setTimeout(function(){
        st.currentSpin = null;
        panel.style.display = "none";
        var spinBtn2 = eid("mpDraftSpin");
        var cS = eid("mpCS"), yS = eid("mpYS");
        if(spinBtn2 && cS && yS){
          initDraftStrips(cS, yS, null);
          doSpinDraft(cS, yS, spinBtn2, panel, player);
        }
      }, 1800);
      return;
    }

    panel.innerHTML = html;
    panel.style.display = "";

    /* Respin button — costs 1 reroll, triggers new spin */
    var mpRespin = panel.querySelector("#mpSqRespin");
    if (mpRespin) mpRespin.onclick = function(){
      if ((player.rerollsUsed||0) >= 3) return;
      player.rerollsUsed = (player.rerollsUsed||0) + 1;
      st.currentSpin = null;
      st.pendingPick = null;
      panel.style.display = "none";
      var spinBtn = eid("mpDraftSpin");
      var cStrip = eid("mpCS"), yStrip = eid("mpYS");
      if(spinBtn && cStrip && yStrip){
        initDraftStrips(cStrip, yStrip, null);
        doSpinDraft(cStrip, yStrip, spinBtn, panel, player);
      }
    };

    /* Position chooser button handlers */
    if(st.pendingPick && st.pendingPick.spin===spin){
      panel.querySelectorAll(".mp-choose-pos").forEach(function(btn){
        btn.addEventListener("click",function(){
          var slot = btn.getAttribute("data-slot");
          var pp = st.pendingPick;
          st.pendingPick = null;
          draftPlayer(pp.squadPlayer, pp.spin, player, slot);
        });
      });
      var cancelBtn = panel.querySelector(".mp-chooser-cancel");
      if(cancelBtn) cancelBtn.addEventListener("click",function(){
        st.pendingPick = null;
        showSquadPanel(panel, spin, player);
      });
    }

    /* Player tap → always show chooser so user explicitly confirms placement */
    panel.querySelectorAll(".player:not(.taken):not(.noslot)").forEach(function(el){
      el.addEventListener("click",function(){
        var name = el.getAttribute("data-pl-n");
        var pl = spin.squad.filter(function(p){ return p.n===name; })[0];
        if(!pl) return;
        var slots = eligibleSlots(pl, player);
        if(!slots.length) return;
        st.pendingPick = { squadPlayer:pl, spin:spin };
        var pitchWrap = eid("mpPitchWrap");
        if(pitchWrap) pitchWrap.innerHTML = buildWCPitch(player);
        showSquadPanel(panel, spin, player);
      });
    });
  }

  function draftPlayer(pl, spin, player, slot){
    if (st.lockedNames.hasOwnProperty(pl.n)) return;
    var pos = pl.gp || pl.p || "MID";
    /* Use explicit slot if provided, otherwise fall back to player position */
    var assignedSlot = slot || pos;
    player.picks.push({
      n:pl.n, p:pl.p||"MID", r:pl.r||75,
      gp: pos, slot: assignedSlot,
      country: spin.country, year: spin.year
    });
    st.lockedNames[pl.n] = st.cur;
    advanceDraft();
  }

  function advanceDraft(){
    var allDone = st.players.every(function(p){ return p.picks.length >= 11; });
    if (allDone){ st.phase = "tournament"; _render(); return; }

    /* Find next player who still needs picks */
    var next = (st.cur + 1) % st.numPlayers;
    var loops = 0;
    while (st.players[next].picks.length >= 11 && loops < st.numPlayers){
      next = (next+1) % st.numPlayers;
      loops++;
    }
    var lastPick = st.players[st.cur].picks[st.players[st.cur].picks.length-1];
    /* Show pass screen — user must manually hand to next player */
    st.pendingHandoff = { from: st.cur, to: next, lastPick: lastPick };
    st.currentSpin = null;
    st.pendingPick = null;
    _render(); /* stays in "draft" phase — renderDraft handles pendingHandoff */
  }

  /* renderHandoffDraft removed — pass handled inline in renderDraft */

  /* ════════════════════════════════════════════════════
     FORMATION PITCH (replaces old buildMiniPitch)
  ════════════════════════════════════════════════════ */
  /* WC-style pitch using .pitch / .pdot CSS — same look as single-player mode */
  function buildWCPitch(player){
    var f = MP_FORMATIONS[player.formation];
    if(!f) return "";
    var bySlot = {};
    (player.picks||[]).forEach(function(pk){
      var s = pk.slot||pk.gp||pk.p||"MID";
      if(!bySlot[s]) bySlot[s] = [];
      bySlot[s].push(pk);
    });
    function pop(slot){ var a = bySlot[slot]; return a&&a.length ? a.shift() : null; }
    var rows = f.lines.slice().reverse().concat([["GK"]]);
    var html = '<div class="pitch">';
    rows.forEach(function(row){
      html += '<div class="pitch-row">';
      row.forEach(function(slot){
        var lineCls = MP_LINE_OF[slot]||"MID";
        var pk = pop(slot);
        if(pk){
          var sn = pk.n.split(" ").pop();
          html += '<div class="pdot filled '+lineCls+'">'+
            '<span class="dot-pos">'+slot+'</span>'+
            '<span class="dot-name">'+esc(sn)+'</span>'+
            '</div>';
        } else {
          html += '<div class="pdot '+lineCls+'"><span class="dot-pos">'+slot+'</span></div>';
        }
      });
      html += '</div>';
    });
    return html + '</div>';
  }

  function buildPitch(player){
    var f = MP_FORMATIONS[player.formation];
    if(!f) return "";

    /* Assign picks to their explicit slots, handling duplicate slot names */
    var pickPool = {};
    player.picks.forEach(function(pk){
      var s = pk.slot||pk.gp||pk.p||"MID";
      if(!pickPool[s]) pickPool[s] = [];
      pickPool[s].push(pk);
    });

    /* Clone so we can shift() without mutating */
    var pool = {};
    Object.keys(pickPool).forEach(function(k){ pool[k] = pickPool[k].slice(); });

    /* Rows: FWD at top → GK at bottom (attack-to-defence visually) */
    var rows = f.lines.slice().reverse().concat([["GK"]]);

    var h = '<div class="mp-pitch-visual">';
    rows.forEach(function(row){
      h += '<div class="mp-pv-row">';
      row.forEach(function(slot){
        var arr = pool[slot]||[];
        var pk = arr.length ? arr.shift() : null;
        var lineCls = MP_LINE_OF[slot]||"MID";
        h += '<div class="mp-pv-slot mp-pv-'+lineCls+(pk?" mp-pv-filled":"")+'">'+
          '<span class="mp-pv-pos">'+slot+'</span>';
        if(pk){
          var surname = pk.n.split(" ").pop();
          h += '<span class="mp-pv-name">'+esc(surname)+'</span>';
          h += '<span class="mp-pv-rat">'+pk.r+'</span>';
        }
        h += '</div>';
      });
      h += '</div>';
    });
    h += '</div>';
    return h;
  }

  /* ════════════════════════════════════════════════════
     PHASE 4 — TOURNAMENT (step-by-step simulation)
  ════════════════════════════════════════════════════ */
  function renderTournament(){
    if (!st.simData) _buildSimData();
    var sd = st.simData;
    var gTotal = sd.groupMatches.length;
    var kTotal = sd.knockouts.length;
    /* simStep: -1=pregame, 0..gTotal-1=reveal group match N, gTotal=standings,
       gTotal+1..gTotal+kTotal=reveal KO match N, gTotal+kTotal+1=champion */
    var maxStep = gTotal + kTotal + 1;

    var wrap = mk("div","mp-wrap mp-tourn-wrap");

    /* ── PRE-GAME: show team lineups ── */
    if (st.simStep < 0) {
      wrap.innerHTML = '<h2 class="mp-title">⚽ Tournament</h2>';
      var prevSec = mk("div","mp-section mp-team-lineups");
      prevSec.innerHTML = '<div class="mp-label">The Teams</div>';
      st.players.forEach(function(p){
        var avg = p.picks.length ? Math.round(p.picks.reduce(function(s,pk){return s+(pk.r||0);},0)/p.picks.length) : 0;
        var d = mk("div","mp-team-strip");
        d.innerHTML =
          '<div class="mp-ts-left">'+
            '<div class="mp-ts-name">'+esc(p.name)+'</div>'+
            '<div class="mp-ts-meta">'+esc(p.formation)+(p.manager?' · '+p.manager.emoji+' '+esc(p.manager.name):'')+'</div>'+
          '</div>'+
          '<div class="mp-ts-avg">'+avg+'<span>avg</span></div>';
        prevSec.appendChild(d);
      });
      wrap.appendChild(prevSec);
      var beginBtn = mk("button","mp-start-btn mp-begin-btn","🎬 Begin Simulation");
      beginBtn.addEventListener("click",function(){ st.simStep=0; _render(); });
      wrap.appendChild(beginBtn);
      root.appendChild(wrap); return;
    }

    /* ── CURRENT MATCH FEATURE CARD ── */
    var isGroupStep = st.simStep > 0 && st.simStep <= gTotal;
    var isKOStep = st.simStep > gTotal && st.simStep <= gTotal + kTotal;
    var currentMatch = null;
    if (isGroupStep) currentMatch = sd.groupMatches[st.simStep - 1];
    else if (isKOStep) currentMatch = sd.knockouts[st.simStep - gTotal - 1];

    if (currentMatch) {
      wrap.appendChild(buildMatchFeature(currentMatch, isKOStep));
    }

    /* ── PAST GROUP MATCHES (collapsed mini-cards) ── */
    var pastGroupCount = isGroupStep ? st.simStep - 1 : (st.simStep >= gTotal ? gTotal : 0);
    if (pastGroupCount > 0) {
      var gSec = mk("div","mp-section");
      gSec.innerHTML = '<div class="mp-label">Group Stage</div>';
      sd.groupMatches.slice(0, pastGroupCount).forEach(function(m){
        gSec.appendChild(buildMatchMini(m.nameA, m.nameB, m.goalsA, m.goalsB, false));
      });
      wrap.appendChild(gSec);
    }

    /* ── STANDINGS ── */
    if (st.simStep >= gTotal) {
      var advCount = sd.format==="h2h"?0: sd.format==="group_final"?2:4;
      var stSec = mk("div","mp-section");
      stSec.innerHTML = '<div class="mp-label">Standings</div>';
      var th = '<table class="mp-table"><thead><tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr></thead><tbody>';
      sd.standings.forEach(function(row,i){
        th += '<tr class="'+(i<advCount?"mp-row-adv":"")+'">'+
          '<td>'+(i+1)+(i<advCount?' <span class="mp-adv-dot">●</span>':'')+'</td><td><strong>'+esc(row.name)+'</strong></td>'+
          '<td>'+row.played+'</td><td>'+row.w+'</td><td>'+row.d+'</td><td>'+row.l+'</td>'+
          '<td>'+row.gf+'</td><td>'+row.ga+'</td><td>'+(row.gf-row.ga>0?"+":"")+(row.gf-row.ga)+'</td>'+
          '<td><b>'+row.pts+'</b></td></tr>';
      });
      stSec.innerHTML += th + '</tbody></table>';
      if (advCount > 0) stSec.innerHTML += '<div class="mp-adv-note"><span class="mp-adv-dot">●</span> Advance to knockouts</div>';
      wrap.appendChild(stSec);
    }

    /* ── PAST KO MATCHES (collapsed) ── */
    var pastKO = isKOStep ? st.simStep - gTotal - 1 : (st.simStep > gTotal ? kTotal : 0);
    if (pastKO > 0 && kTotal > 0) {
      var curStage = null, koSec = null;
      sd.knockouts.slice(0, pastKO).forEach(function(ko){
        if (ko.stage !== curStage) {
          curStage = ko.stage; koSec = mk("div","mp-section");
          koSec.innerHTML = '<div class="mp-label">'+esc(ko.stage)+'</div>';
          wrap.appendChild(koSec);
        }
        koSec.appendChild(buildMatchMini(ko.nameA, ko.nameB, ko.result.a, ko.result.b, ko.result.pens, ko.result.winner));
      });
    }

    /* ── CHAMPION banner ── */
    if (st.simStep >= maxStep) {
      if(!st._histSaved){ st._histSaved = true; _saveMpHistory(sd.champion); }
      var banner = mk("div","mp-champion mp-champion-full");
      banner.innerHTML =
        '<div class="mp-champ-confetti">🎊</div>'+
        '<span class="mp-champ-trophy">🏆</span>'+
        '<span class="mp-champ-name">'+esc(sd.champion)+'</span>'+
        '<span class="mp-champ-sub">Champion!</span>';
      wrap.appendChild(banner);

      /* Squad reveal carousel */
      if(st.revealIdx < 0){
        var revCta = mk("div","mp-section mp-reveal-cta");
        var revBtn = mk("button","mp-start-btn","👀 Reveal All Squads");
        revBtn.addEventListener("click",function(){ st.revealIdx = 0; _render(); });
        var skipRevBtn = mk("button","btn-ghost","Skip →");
        skipRevBtn.addEventListener("click",function(){ st.revealIdx = st.numPlayers; _render(); });
        revCta.appendChild(revBtn);
        revCta.appendChild(skipRevBtn);
        wrap.appendChild(revCta);
      } else if(st.revealIdx < st.numPlayers){
        var rp = st.players[st.revealIdx];
        var rpAvg = rp.picks.length ? Math.round(rp.picks.reduce(function(s,pk){return s+(pk.r||0);},0)/rp.picks.length) : 0;
        var sqSec = mk("div","mp-section mp-squad-reveal");
        var isChamp = rp.name === sd.champion;
        sqSec.innerHTML = '<div class="mp-label">'+(isChamp?'🏆 ':'')+esc(rp.name)+'\'s Squad</div>'+
          '<div class="mp-rev-meta">'+esc(rp.formation)+' · '+(rp.manager?rp.manager.emoji+' '+esc(rp.manager.name):'')+' · Avg '+rpAvg+'</div>';
        var pitchWrap = mk("div","mp-rev-pitch");
        pitchWrap.innerHTML = buildWCPitch(rp);
        sqSec.appendChild(pitchWrap);
        var revList = mk("ul","mp-tc-ul");
        rp.picks.forEach(function(pk){
          var li = mk("li","mp-tc-player");
          li.innerHTML = '<span class="mp-tc-pos">'+esc(pk.slot||pk.gp||pk.p)+'</span>'+
            '<span class="mp-tc-pname">'+esc(pk.n)+'</span>'+
            '<span class="mp-tc-club">'+esc(pk.country)+' '+pk.year+'</span>'+
            '<span class="mp-tc-r mp-r-badge'+ratingTierClass(pk.r)+'">'+pk.r+'</span>';
          revList.appendChild(li);
        });
        sqSec.appendChild(revList);
        var isLast = st.revealIdx === st.numPlayers - 1;
        var nextRevBtn = mk("button","mp-start-btn", isLast ? "Final Standings →" : "Next Squad →");
        nextRevBtn.addEventListener("click",function(){ st.revealIdx++; _render(); });
        sqSec.appendChild(nextRevBtn);
        wrap.appendChild(sqSec);
      } else {
        var summSec = mk("div","mp-section");
        summSec.innerHTML = '<div class="mp-label">All Teams</div>';
        st.players.forEach(function(p){
          var avg = p.picks.length ? Math.round(p.picks.reduce(function(s,pk){return s+(pk.r||0);},0)/p.picks.length):0;
          var card = mk("div","mp-team-card");
          var isC = p.name===sd.champion;
          card.innerHTML = '<div class="mp-tc-head"><span class="mp-tc-name">'+(isC?'🏆 ':'')+esc(p.name)+'</span>'+
            '<span class="mp-tc-info">'+esc(p.formation)+' · '+(p.manager?p.manager.emoji+" "+esc(p.manager.name):"")+'</span>'+
            '<span class="mp-tc-avg">Avg '+avg+'</span></div>';
          var ul = mk("ul","mp-tc-ul");
          p.picks.forEach(function(pk){
            var li = mk("li","mp-tc-player");
            li.innerHTML = '<span class="mp-tc-pos">'+esc(pk.slot||pk.gp||pk.p)+'</span>'+
              '<span class="mp-tc-pname">'+esc(pk.n)+'</span>'+
              '<span class="mp-tc-club">'+esc(pk.country)+' '+pk.year+'</span>'+
              '<span class="mp-tc-r mp-r-badge'+ratingTierClass(pk.r)+'">'+pk.r+'</span>';
            ul.appendChild(li);
          });
          card.appendChild(ul);
          summSec.appendChild(card);
        });
        wrap.appendChild(summSec);
        var again = mk("button","mp-start-btn","← Back to Home");
        again.addEventListener("click", goHome);
        wrap.appendChild(again);
      }
    }

    /* ── Navigation ── */
    if (st.simStep < maxStep) {
      var navDiv = mk("div","mp-sim-nav");
      var label = st.simStep < gTotal ? "Next Match →" :
                  st.simStep === gTotal ? (kTotal>0 ? "⚡ Knockouts →" : "🏆 See Champion →") :
                  st.simStep < gTotal+kTotal ? "Next Match →" : "🏆 See Champion →";
      var nextBtn = mk("button","mp-start-btn",label);
      nextBtn.addEventListener("click",function(){ st.simStep++; _render(); });
      navDiv.appendChild(nextBtn);
      if (st.simStep < maxStep - 1) {
        var skipBtn = mk("button","btn-ghost","Skip to End →");
        skipBtn.addEventListener("click",function(){ st.simStep=maxStep; _render(); });
        navDiv.appendChild(skipBtn);
      }
      wrap.appendChild(navDiv);
    }

    root.appendChild(wrap);
  }

  /* Build a featured match card with goal events timeline */
  function buildMatchFeature(m, isKO){
    var nameA = m.nameA, nameB = m.nameB;
    var goalsA = m.goalsA != null ? m.goalsA : m.result ? m.result.a : 0;
    var goalsB = m.goalsB != null ? m.goalsB : m.result ? m.result.b : 0;
    var evA = m.evA||[], evB = m.evB||[];
    var pens = m.result && m.result.pens;
    var winner = m.result ? m.result.winner : (goalsA>goalsB?nameA:goalsB>goalsA?nameB:null);

    var card = mk("div","mp-feat-match");
    /* Stage badge */
    var stage = isKO ? (m.stage||"Knockout") : "Group Stage";
    card.innerHTML = '<div class="mp-feat-stage">'+esc(stage)+'</div>';

    /* Scoreboard */
    var sb = mk("div","mp-feat-scoreboard");
    sb.innerHTML =
      '<div class="mp-feat-team'+(winner===nameA?' mp-feat-winner':'')+'">'+
        '<div class="mp-feat-tname">'+esc(nameA)+'</div>'+
      '</div>'+
      '<div class="mp-feat-scores">'+
        '<span class="mp-feat-g'+(goalsA>goalsB?" mp-feat-g-win":"")+'">'+goalsA+'</span>'+
        '<span class="mp-feat-sep">–</span>'+
        '<span class="mp-feat-g'+(goalsB>goalsA?" mp-feat-g-win":"")+'">'+goalsB+'</span>'+
        (pens?'<div class="mp-feat-pens">Penalties</div>':'')+
      '</div>'+
      '<div class="mp-feat-team mp-feat-team-r'+(winner===nameB?' mp-feat-winner':'')+'">'+
        '<div class="mp-feat-tname">'+esc(nameB)+'</div>'+
      '</div>';
    card.appendChild(sb);

    /* Goal events timeline */
    if (evA.length || evB.length) {
      var timeline = mk("div","mp-feat-timeline");
      /* Merge and sort */
      var allEv = evA.map(function(e){return {side:"A",n:e.n,min:e.min};})
        .concat(evB.map(function(e){return {side:"B",n:e.n,min:e.min};}));
      allEv.sort(function(a,b){return a.min-b.min;});
      allEv.forEach(function(ev){
        var row = mk("div","mp-ev-row mp-ev-"+ev.side);
        if (ev.side==="A"){
          row.innerHTML = '<span class="mp-ev-name">'+esc(ev.n)+'</span><span class="mp-ev-icon">⚽</span><span class="mp-ev-min">'+ev.min+'\'</span>';
        } else {
          row.innerHTML = '<span class="mp-ev-min">'+ev.min+'\'</span><span class="mp-ev-icon">⚽</span><span class="mp-ev-name">'+esc(ev.n)+'</span>';
        }
        timeline.appendChild(row);
      });
      card.appendChild(timeline);
    } else if (goalsA===0 && goalsB===0) {
      var nil = mk("div","mp-feat-nil"); nil.textContent = "Clean sheet both ends"; card.appendChild(nil);
    }

    /* Full time label */
    var ft = mk("div","mp-feat-ft"); ft.textContent = pens ? "AET • Decided on Penalties" : "Full Time"; card.appendChild(ft);
    return card;
  }

  /* Compact past match row */
  function buildMatchMini(nameA, nameB, gA, gB, pens, winner){
    var mc = mk("div","mp-sim-match");
    var winA = winner ? winner===nameA : gA>gB;
    var winB = winner ? winner===nameB : gB>gA;
    mc.innerHTML =
      '<span class="mp-sim-ta'+(winA?" win":"")+'">'+esc(nameA)+'</span>'+
      '<span class="mp-sim-score">'+gA+' – '+gB+(pens?' <em>(P)</em>':'')+'</span>'+
      '<span class="mp-sim-tb'+(winB?" win":"")+'">'+esc(nameB)+'</span>';
    return mc;
  }

  /* Pre-compute all tournament results once */
  function _buildSimData(){
    var n = st.players.length;
    var format;
    if(st.tournamentFormat==="h2h")        format="h2h";
    else if(st.tournamentFormat==="group") format="group_final";
    else if(st.tournamentFormat==="full")  format="group_semis";
    else format = n===2?"h2h":n<=5?"group_final":"group_semis";

    var gs = runGroupStage();
    var sorted = gs.standings.slice().sort(function(a,b){
      return b.pts-a.pts || (b.gf-b.ga)-(a.gf-a.ga) || b.gf-a.gf;
    });

    var knockouts = [], champion;
    if (format==="h2h"){
      var agg={};
      st.players.forEach(function(p){ agg[p.name]={gf:0,ga:0}; });
      gs.matches.forEach(function(m){
        agg[m.nameA].gf+=m.goalsA; agg[m.nameA].ga+=m.goalsB;
        agg[m.nameB].gf+=m.goalsB; agg[m.nameB].ga+=m.goalsA;
      });
      var p1=sorted[0],p2=sorted[1];
      champion = agg[p1.name].gf>agg[p2.name].gf ? p1.name :
                 agg[p2.name].gf>agg[p1.name].gf ? p2.name :
                 (Math.random()<0.5?p1.name:p2.name);
    } else if (format==="group_final"){
      var fin=simKO(sorted[0],sorted[1]);
      knockouts.push({stage:"🏆 Final",nameA:sorted[0].name,nameB:sorted[1].name,result:fin,evA:fin.evA,evB:fin.evB});
      champion=fin.winner;
    } else {
      /* Need at least 4 players for semis; if fewer, fall back to a direct final */
      if (sorted.length < 4) {
        var fin2=simKO(sorted[0],sorted[1]);
        knockouts.push({stage:"🏆 Final",nameA:sorted[0].name,nameB:sorted[1].name,result:fin2,evA:fin2.evA,evB:fin2.evB});
        champion=fin2.winner;
      } else {
        var sf1=simKO(sorted[0],sorted[3]);
        var sf2=simKO(sorted[1],sorted[2]);
        knockouts.push({stage:"Semi-Final",nameA:sorted[0].name,nameB:sorted[3].name,result:sf1,evA:sf1.evA,evB:sf1.evB});
        knockouts.push({stage:"Semi-Final",nameA:sorted[1].name,nameB:sorted[2].name,result:sf2,evA:sf2.evA,evB:sf2.evB});
        var finA=sf1.winner===sorted[0].name?sorted[0]:sorted[3];
        var finB=sf2.winner===sorted[1].name?sorted[1]:sorted[2];
        var finM=simKO(finA,finB);
        knockouts.push({stage:"🏆 Final",nameA:finA.name,nameB:finB.name,result:finM,evA:finM.evA,evB:finM.evB});
        champion=finM.winner;
      }
    }
    st.simData = {format:format, groupMatches:gs.matches, standings:sorted, knockouts:knockouts, champion:champion};
    st.simStep = -1;
  }

  /* ── Group stage engine ── */
  function runGroupStage(){
    var n = st.players.length;
    var standings = st.players.map(function(p){
      return { name:p.name, player:p, played:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 };
    });
    var matches = [];
    for (var i=0;i<n;i++){
      for (var j=i+1;j<n;j++){
        var r1 = simMatch(st.players[i], st.players[j], false);
        updateRow(standings,i,j,r1.a,r1.b);
        matches.push({nameA:st.players[i].name, nameB:st.players[j].name, goalsA:r1.a, goalsB:r1.b, evA:r1.evA, evB:r1.evB});
        var r2 = simMatch(st.players[j], st.players[i], false);
        updateRow(standings,j,i,r2.a,r2.b);
        matches.push({nameA:st.players[j].name, nameB:st.players[i].name, goalsA:r2.a, goalsB:r2.b, evA:r2.evA, evB:r2.evB});
      }
    }
    return { standings:standings, matches:matches };
  }

  function updateRow(rows, iA, iB, gA, gB){
    rows[iA].played++; rows[iB].played++;
    rows[iA].gf+=gA; rows[iA].ga+=gB;
    rows[iB].gf+=gB; rows[iB].ga+=gA;
    if (gA>gB){ rows[iA].w++; rows[iA].pts+=3; rows[iB].l++; }
    else if (gB>gA){ rows[iB].w++; rows[iB].pts+=3; rows[iA].l++; }
    else { rows[iA].d++; rows[iA].pts++; rows[iB].d++; rows[iB].pts++; }
  }

  function simKO(rowA, rowB){
    var res = simMatch(rowA.player, rowB.player, true);
    var winner;
    if (res.a>res.b) winner=rowA.name;
    else if (res.b>res.a) winner=rowB.name;
    else { winner = Math.random()<0.5 ? rowA.name : rowB.name; return {a:res.a,b:res.b,pens:true,winner:winner,evA:res.evA,evB:res.evB}; }
    return {a:res.a, b:res.b, pens:false, winner:winner, evA:res.evA, evB:res.evB};
  }

  function simMatch(pA, pB, isKO){
    var ra = teamStr(pA, isKO), rb = teamStr(pB, isKO);
    var diff = (ra-rb)/60;
    var goalsA = poisson(Math.max(0.3, 1.3+diff));
    var goalsB = poisson(Math.max(0.3, 1.3-diff));
    var evA = genGoalEvents(pA.picks||[], goalsA);
    var evB = genGoalEvents(pB.picks||[], goalsB);
    return { a: goalsA, b: goalsB, evA: evA, evB: evB };
  }

  function genGoalEvents(picks, count){
    var pool = picks.filter(function(pk){
      var l = MP_LINE_OF[pk.slot||pk.gp||pk.p]||"MID";
      return l==="FWD"||l==="MID";
    });
    if(!pool.length) pool = picks.slice();
    if(!pool.length) {
      var ev=[];
      for(var i=0;i<count;i++) ev.push({n:"Own Goal",min:Math.floor(Math.random()*90)+1});
      return ev;
    }
    var used={}, events=[];
    for(var i=0;i<count;i++){
      var total=0; pool.forEach(function(pk){total+=(pk.r||75);});
      var r=Math.random()*total,cum=0,scorer=pool[0];
      for(var j=0;j<pool.length;j++){ cum+=(pool[j].r||75); if(r<=cum){scorer=pool[j];break;} }
      var min,tries=0;
      do{min=Math.floor(Math.random()*89)+1;tries++;}while(used[min]&&tries<30);
      used[min]=true;
      events.push({n:scorer.n,min:min});
    }
    events.sort(function(a,b){return a.min-b.min;});
    return events;
  }

  function teamStr(p, isKO){
    if (!p.picks||!p.picks.length) return 70;
    var sum=0; p.picks.forEach(function(pk){ sum+=(pk.r||75); });
    var avg = sum/p.picks.length;
    var mgr = p.manager||{atk:0,def:0,ko:0};
    var bonus = isKO ? (mgr.atk+mgr.def+(mgr.ko||0))/3 : (mgr.atk+mgr.def)/2;
    return avg+bonus;
  }

  function poisson(l){
    var L=Math.exp(-l),k=0,p=1; do{k++;p*=Math.random();}while(p>L); return k-1;
  }

  /* ── Match card ── */
  function matchCard(nameA, nameB, result){
    var card = mk("div","mp-match-card");
    var pen = result.pens ? ' <span class="mp-pens">(pens)</span>' : '';
    card.innerHTML =
      '<span class="mp-mc-a'+(result.winner===nameA?" win":"")+'">'+esc(nameA)+'</span>'+
      '<span class="mp-mc-score">'+result.a+' – '+result.b+pen+'</span>'+
      '<span class="mp-mc-b'+(result.winner===nameB?" win":"")+'">'+esc(nameB)+'</span>';
    return card;
  }

  /* ── Boot ── */
  if (document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})(window);
