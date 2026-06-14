/* World Cup XI — controller: setup → draft (granular positions) → simulate */
(function (W) {
  "use strict";

  var DATA = window.WORLD_CUP_DATA;
  var COUNTRIES = Object.keys(DATA);
  var mode = "wc"; // "wc" | "cl"
  var clFormat = "swiss"; // "swiss" | "league" | "groups"
  var CL_FORMATS = [
    { id: "swiss", name: "New (Swiss)", desc: "36-team league phase, 8 games each, then knockouts." },
    { id: "league", name: "36-team league", desc: "Every club plays each other once — one big table." },
    { id: "groups", name: "Old (groups)", desc: "8 groups of 4, home & away, top 2 into the Round of 16." }
  ];
  var XI_SIZE = 11;
  var ITEM_H = 96;
  var REROLLS = 3;

  // Granular position → broad line (for pitch grouping + scoring) + full label.
  var LINE_OF = {
    GK: "GK", CB: "DEF", RB: "DEF", LB: "DEF", RWB: "DEF", LWB: "DEF",
    CDM: "MID", CM: "MID", CAM: "MID", LM: "MID", RM: "MID",
    LW: "FWD", RW: "FWD", ST: "FWD"
  };
  var POS_FULL = {
    GK: "Goalkeeper", CB: "Centre-back", RB: "Right-back", LB: "Left-back",
    RWB: "Right wing-back", LWB: "Left wing-back", CDM: "Defensive mid",
    CM: "Centre mid", CAM: "Attacking mid", LM: "Left mid", RM: "Right mid",
    LW: "Left wing", RW: "Right wing", ST: "Striker"
  };
  // Which granular positions a player of a given broad role can fill (fallback when
  // a player has no exact position listed).
  var BROAD_ELIG = {
    GK: ["GK"],
    DEF: ["CB", "RB", "LB", "RWB", "LWB"],
    MID: ["CDM", "CM", "CAM", "LM", "RM", "RWB", "LWB"],
    FWD: ["ST", "LW", "RW", "CAM"]
  };
  // For a player's EXACT position, which formation slots they may fill (tight adjacency).
  var SLOT_FILL = {
    GK: ["GK"], CB: ["CB"],
    RB: ["RB", "RWB", "RM"], LB: ["LB", "LWB", "LM"], RWB: ["RWB", "RB", "RM"], LWB: ["LWB", "LB", "LM"],
    CDM: ["CDM", "CM"], CM: ["CM", "CDM", "CAM"], CAM: ["CAM", "CM"],
    RM: ["RM", "RW", "RB"], LM: ["LM", "LW", "LB"], RW: ["RW", "RM"], LW: ["LW", "LM"], ST: ["ST"]
  };
  var PLAYER_POS = window.PLAYER_POSITIONS || {};
  function gpOf(pl) {
    if (pl.gp) return pl.gp.split(",");          // exact position embedded in the squad data
    var g = PLAYER_POS[pl.n];
    return g ? g.split(",") : null;
  }

  // Formations as lines of granular slots, defence → attack (GK implicit).
  // Each line is ordered LEFT → RIGHT, so L* roles render on the left and R* on the right.
  var FORMATIONS = {
    "4-3-3":   { lines: [["LB", "CB", "CB", "RB"], ["CM", "CDM", "CM"], ["LW", "ST", "RW"]] },
    "4-4-2":   { lines: [["LB", "CB", "CB", "RB"], ["LM", "CM", "CM", "RM"], ["ST", "ST"]] },
    "4-2-3-1": { lines: [["LB", "CB", "CB", "RB"], ["CDM", "CDM"], ["LM", "CAM", "RM"], ["ST"]] },
    "3-5-2":   { lines: [["CB", "CB", "CB"], ["LM", "CM", "CDM", "CM", "RM"], ["ST", "ST"]] },
    "3-4-1-2": { lines: [["CB", "CB", "CB"], ["LM", "CM", "CM", "RM"], ["CAM"], ["ST", "ST"]] },
    "3-4-3":   { lines: [["CB", "CB", "CB"], ["LM", "CM", "CM", "RM"], ["LW", "ST", "RW"]] },
    "5-3-2":   { lines: [["LWB", "CB", "CB", "CB", "RWB"], ["CM", "CDM", "CM"], ["ST", "ST"]] },
    "4-5-1":   { lines: [["LB", "CB", "CB", "RB"], ["LM", "CM", "CDM", "CM", "RM"], ["ST"]] },
    "5-4-1":   { lines: [["LWB", "CB", "CB", "CB", "RWB"], ["LM", "CM", "CM", "RM"], ["ST"]] }
  };
  var FORMATION_KEYS = Object.keys(FORMATIONS);

  var VERSATILE = {
    "Philipp Lahm": ["DEF", "MID"], "Gianluca Zambrotta": ["DEF", "MID"], "Javier Mascherano": ["MID", "DEF"],
    "Dani Alves": ["DEF", "MID"], "Marcelo": ["DEF", "MID"], "Cafu": ["DEF", "MID"], "Roberto Carlos": ["DEF", "MID"],
    "Lothar Matthäus": ["MID", "DEF"], "Arie Haan": ["DEF", "MID"], "Aurélien Tchouaméni": ["MID", "DEF"],
    "Javi Martínez": ["MID", "DEF"], "John Heitinga": ["DEF", "MID"], "Zé Roberto": ["MID", "DEF"],
    "Bixente Lizarazu": ["DEF", "MID"], "Antoine Griezmann": ["FWD", "MID"], "Thomas Müller": ["FWD", "MID"],
    "Mesut Özil": ["MID", "FWD"], "Dirk Kuyt": ["FWD", "MID"], "Ángel Di María": ["MID", "FWD"],
    "Ivan Perišić": ["FWD", "MID"], "David Silva": ["MID", "FWD"], "Bruno Conti": ["MID", "FWD"],
    "Johnny Rep": ["FWD", "MID"], "Rivaldo": ["FWD", "MID"], "Ronaldinho": ["MID", "FWD"],
    "Kingsley Coman": ["FWD", "MID"], "Florian Thauvin": ["FWD", "MID"], "Raheem Sterling": ["FWD", "MID"],
    "Marcus Rashford": ["FWD", "MID"], "Pedro": ["FWD", "MID"], "Jesús Navas": ["FWD", "MID"],
    "Maxi Rodríguez": ["MID", "FWD"], "Joshua Kimmich": ["DEF", "MID"], "Trent Alexander-Arnold": ["DEF", "MID"],
    "João Cancelo": ["DEF", "MID"], "Achraf Hakimi": ["DEF", "MID"], "Federico Valverde": ["MID", "FWD"],
    "Phil Foden": ["MID", "FWD"], "Jude Bellingham": ["MID", "FWD"], "Bukayo Saka": ["FWD", "MID"],
    "Rodrygo": ["FWD", "MID"], "Raphinha": ["FWD", "MID"], "Bernardo Silva": ["MID", "FWD"]
  };

  var MGR_ICONS = {
    none:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l3-6h3a3 3 0 0 0 6 0h3l3 6-3 1.5V21H6V10.5z"/></svg>',
    attack:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6 2 2-6 6z"/><path d="M2 21l4-4"/><path d="M15.5 6.5l1.5 1.5"/></svg>',
    defence:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    press:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c0 6-7 8-7 13a7 7 0 0 0 14 0c0-5-7-7-7-13z"/><path d="M9 18a3 3 0 0 0 6 0"/></svg>',
    cup:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h12v3a6 6 0 0 1-12 0z"/><path d="M6 5H4a2 2 0 0 0 0 4h2M18 5h2a2 2 0 0 1 0 4h-2"/><path d="M9 19h6M10 15v4M14 15v4"/></svg>',
    motivator: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
    counter:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    tikitaka:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14M12 2v20M2 12h20"/></svg>',
    routeone:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17L12 5l7 12H5z"/><path d="M5 17h14"/></svg>'
  };
  var MANAGERS = [
    { id: "none",      name: "No manager",    atk: 0,  def: 0,  ko: 0, desc: "No bonus — just the XI." },
    { id: "attack",    name: "Total Football", atk: 4,  def: 0,  ko: 0, desc: "+4 ATK — all-out attack, no compromise." },
    { id: "defence",   name: "Catenaccio",     atk: 0,  def: 4,  ko: 0, desc: "+4 DEF — lock it down, suffocate the opposition." },
    { id: "press",     name: "Gegenpress",     atk: 2,  def: 2,  ko: 0, desc: "+2 ATK, +2 DEF — relentless intensity across the pitch." },
    { id: "counter",   name: "Counter-Attack", atk: 1,  def: 3,  ko: 0, desc: "+3 DEF, +1 ATK — absorb, then strike with precision." },
    { id: "tikitaka",  name: "Tiki-Taka",      atk: 0,  def: 0,  ko: 0, cond: true,
      desc: "+3 ATK if your midfielders average 90+ — pass them to death.",
      condLabel: "Mid avg ≥ 90" },
    { id: "routeone",  name: "Route One",      atk: 0,  def: 0,  ko: 0, cond: true,
      desc: "+4 ATK if 2+ players from pre-1980 squads — long ball, old school.",
      condLabel: "2+ pre-1980 players" },
    { id: "cup",       name: "Cup Specialist", atk: 0,  def: 0,  ko: 6, desc: "+6 in every knockout tie — built for the big occasion." },
    { id: "motivator", name: "The Motivator",  atk: 2,  def: 2,  ko: 2, desc: "+2 overall and +2 in knockouts — wins the big moments." }
  ];
  // Legacy/iconic managers linked to a tactical style (the bonus comes from the style above).
  var MANAGERS_DB = [
    { n: "Rinus Michels", s: "attack" }, { n: "Johan Cruyff", s: "attack" }, { n: "Joachim Löw", s: "attack" },
    { n: "Roberto Martínez", s: "attack" }, { n: "Mário Zagallo", s: "attack" },
    { n: "Helenio Herrera", s: "defence" }, { n: "Giovanni Trapattoni", s: "defence" }, { n: "Diego Simeone", s: "defence" },
    { n: "Fabio Capello", s: "defence" }, { n: "Antonio Conte", s: "defence" },
    { n: "Marcelo Bielsa", s: "press" }, { n: "Jürgen Klopp", s: "press" }, { n: "Pep Guardiola", s: "press" },
    { n: "Arrigo Sacchi", s: "press" }, { n: "Valeriy Lobanovskyi", s: "press" },
    { n: "José Mourinho", s: "cup" }, { n: "Carlo Ancelotti", s: "cup" }, { n: "Didier Deschamps", s: "cup" },
    { n: "Lionel Scaloni", s: "cup" }, { n: "Zinedine Zidane", s: "cup" },
    { n: "Sir Alex Ferguson", s: "motivator" }, { n: "Vicente del Bosque", s: "motivator" },
    { n: "Luiz Felipe Scolari", s: "motivator" }, { n: "Bora Milutinović", s: "motivator" }, { n: "Otto Rehhagel", s: "motivator" },
    { n: "Claudio Ranieri", s: "counter" }, { n: "Roberto Di Matteo", s: "counter" }, { n: "Sven-Göran Eriksson", s: "counter" }, { n: "Guus Hiddink", s: "counter" },
    { n: "Pep Guardiola", s: "tikitaka" }, { n: "Xabi Alonso", s: "tikitaka" }, { n: "Luis Enrique", s: "tikitaka" }, { n: "Vicente del Bosque", s: "tikitaka" },
    { n: "Brian Clough", s: "routeone" }, { n: "Bobby Robson", s: "routeone" }, { n: "Ron Greenwood", s: "routeone" }, { n: "César Luis Menotti", s: "routeone" }
  ];
  /* Expose for other modules (league, multiplayer) */
  window.WCXI_MANAGERS    = MANAGERS;
  window.WCXI_MANAGERS_DB = MANAGERS_DB;
  /* Shared synergy/conditional helpers for league.js / multiplayer */
  window.WCXI_computeSynergy   = computeSynergy;
  window.WCXI_computeCondBonus = computeConditionalBonus;
  /* Shared leaderboard API so League / Multiplayer can post per-mode scores */
  window.WCXI_addScore = function (e) { try { addScore(e); _trackProgress(e); } catch (err) {} };
  window.WCXI_shareXIPNG = function(btn) { shareXIPNG(btn); };
  window.WCXI_copyXIPNG  = function(btn) { copyXIPNG(btn); };

  /* ── Progression system ───────────────────────────────────────────── */
  var PROG_KEY = "wcxi_progress";
  var PROG_MILESTONES = [
    { id:"first_game",   check:function(p){ return p.gamesPlayed >= 1;  }, msg:"First game played!" },
    { id:"first_win",    check:function(p){ return p.wins >= 1;          }, msg:"First win!" },
    { id:"win_5",        check:function(p){ return p.wins >= 5;          }, msg:"5 wins — you're on a roll!" },
    { id:"win_10",       check:function(p){ return p.wins >= 10;         }, msg:"10 wins — you're a manager now!" },
    { id:"win_25",       check:function(p){ return p.wins >= 25;         }, msg:"25 wins — legendary form!" },
    { id:"streak_3",     check:function(p){ return p.bestStreak >= 3;    }, msg:"3-win streak — on fire!" },
    { id:"streak_5",     check:function(p){ return p.bestStreak >= 5;    }, msg:"5-win streak — unstoppable!" },
    { id:"games_10",     check:function(p){ return p.gamesPlayed >= 10;  }, msg:"10 games played" },
    { id:"games_50",     check:function(p){ return p.gamesPlayed >= 50;  }, msg:"50 games — true fan" },
    { id:"games_100",    check:function(p){ return p.gamesPlayed >= 100; }, msg:"100 games — all-timer!" }
  ];
  function _loadProgress(){
    try{ return JSON.parse(localStorage.getItem(PROG_KEY)||"{}"); }catch(e){ return {}; }
  }
  function _saveProgress(p){
    try{ localStorage.setItem(PROG_KEY, JSON.stringify(p)); }catch(e){}
  }
  function _trackProgress(e){
    var p = _loadProgress();
    if(typeof p.gamesPlayed !== "number") p.gamesPlayed = 0;
    if(typeof p.wins !== "number") p.wins = 0;
    if(typeof p.currentStreak !== "number") p.currentStreak = 0;
    if(typeof p.bestStreak !== "number") p.bestStreak = 0;
    if(!p.milestones) p.milestones = {};
    p.gamesPlayed++;
    /* Detect a win: score > 0 and result doesn't include "Relegated" or "Bottom" */
    var isWin = (e.score && e.score > 0) && !/relegate|bottom|last/i.test(e.result||"");
    if(isWin){ p.wins++; p.currentStreak++; if(p.currentStreak > p.bestStreak) p.bestStreak = p.currentStreak; }
    else { p.currentStreak = 0; }
    _saveProgress(p);
    /* Check milestones */
    PROG_MILESTONES.forEach(function(m){
      if(!p.milestones[m.id] && m.check(p)){
        p.milestones[m.id] = Date.now();
        _saveProgress(p);
        setTimeout(function(){ if(typeof W.flToast==="function") W.flToast(m.msg, 3000); }, 600);
      }
    });
  }
  /* Expose for home screen reading */
  window.WCXI_getProgress = function(){ return _loadProgress(); };

  // ---- state ----
  var squad = [];        // [{id,n,p(broad),r,slot(granular),country,year}]
  var nextId = 1;
  var pendingPick = null;
  var current = null;
  var spinning = false;
  var awaitingPick = false;
  var rerollsLeft = REROLLS;
  var formation = "4-3-3";
  var teamName = "";
  var managerId = "none";
  var managerName = "";
  var managerSpinning = false;
  var managerSpun = false;
  var showRatings = true;
  var pool = "all";
  var DIFFICULTIES = [
    { id: "Easy",   rr: 5, desc: "5 rerolls — room to be picky" },
    { id: "Medium", rr: 3, desc: "3 rerolls — classic mode" },
    { id: "Hard",   rr: 1, desc: "1 reroll — make it count" },
    { id: "Legend", rr: 0, desc: "No rerolls — you take what you spin" }
  ];
  var difficulty = "Medium";
  function diffRerolls() { for (var i = 0; i < DIFFICULTIES.length; i++) if (DIFFICULTIES[i].id === difficulty) return DIFFICULTIES[i].rr; return 3; }
  /* Reroll economy tracking */
  var rerollsMax    = 0;       /* set at draft start */
  var rerollLog     = [];      /* [{discarded:R, kept:R|null}, …] */
  var pendingDiscard = null;   /* rating about to be burned; set just before doSpin() */
  var boardTab = "daily";
  var boardMode = "all";
  var lastSim = null;
  var reveal = null;  // staged World Cup reveal state
  var lReveal = null; // staged League reveal state
  var revealTimer = null; // game-by-game auto-reveal timer
  var deferredPrompt = null;
  var LB_KEY = "wcxi_leaderboard_v1";
  var DRAFT_KEY = "wcxi_draft_v1";

  function saveDraft() {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({
        mode: mode, squad: squad, formation: formation,
        managerId: managerId, managerName: managerName, nextId: nextId
      }));
    } catch (e) {}
  }
  function loadDraft() {
    try {
      var s = sessionStorage.getItem(DRAFT_KEY);
      if (!s) return false;
      var d = JSON.parse(s);
      if (!d || d.mode !== mode || !d.squad || !d.squad.length) return false;
      squad = d.squad; formation = d.formation || formation;
      managerId = d.managerId || managerId; managerName = d.managerName || "";
      nextId = d.nextId || (squad.length + 1);
      return true;
    } catch (e) { return false; }
  }
  function clearDraft() { try { sessionStorage.removeItem(DRAFT_KEY); } catch (e) {} }

  function currentManager() {
    for (var i = 0; i < MANAGERS.length; i++) if (MANAGERS[i].id === managerId) return MANAGERS[i];
    return MANAGERS[0];
  }
  function teamDisplayName() { return teamName.trim() || "My XI"; }

  /* ── Country flag emoji ─────────────────────────────────────────── */
  var COUNTRY_ISO = {
    "Argentina":"AR","Australia":"AU","Austria":"AT","Belgium":"BE","Bolivia":"BO",
    "Brazil":"BR","Bulgaria":"BG","Cameroon":"CM","Chile":"CL","China":"CN",
    "Colombia":"CO","Costa Rica":"CR","Croatia":"HR","Czech Republic":"CZ","Denmark":"DK",
    "DR Congo":"CD","Ecuador":"EC","Egypt":"EG","El Salvador":"SV","England":"GB",
    "Finland":"FI","France":"FR","Germany":"DE","Ghana":"GH","Greece":"GR",
    "Honduras":"HN","Hungary":"HU","Iceland":"IS","Indonesia":"ID","Iran":"IR",
    "Ireland":"IE","Israel":"IL","Italy":"IT","Jamaica":"JM","Japan":"JP",
    "Kazakhstan":"KZ","Kenya":"KE","Kuwait":"KW","Libya":"LY","Malaysia":"MY",
    "Mali":"ML","Mexico":"MX","Morocco":"MA","Netherlands":"NL","New Zealand":"NZ",
    "Nigeria":"NG","North Korea":"KP","Norway":"NO","Panama":"PA","Paraguay":"PY",
    "Peru":"PE","Poland":"PL","Portugal":"PT","Qatar":"QA","Romania":"RO",
    "Russia":"RU","Saudi Arabia":"SA","Senegal":"SN","Serbia":"RS","Slovakia":"SK",
    "Slovenia":"SI","South Africa":"ZA","South Korea":"KR","Spain":"ES","Sweden":"SE",
    "Switzerland":"CH","Togo":"TG","Trinidad and Tobago":"TT","Tunisia":"TN",
    "Turkey":"TR","Ukraine":"UA","United Arab Emirates":"AE","United States":"US",
    "Uruguay":"UY","Venezuela":"VE","Wales":"GB","Zambia":"ZM","Zimbabwe":"ZW",
    "Republic of Ireland":"IE","Ivory Coast":"CI","Algeria":"DZ","Angola":"AO",
    "Cuba":"CU","Ethiopia":"ET","Libya":"LY","Tanzania":"TZ","Uganda":"UG",
    "Sweden":"SE","Scotland":"GB"
  };
  function countryFlag(name) {
    var iso = COUNTRY_ISO[name]; if (!iso || iso.length !== 2) return "";
    try { return String.fromCodePoint(0x1F1E6+iso.charCodeAt(0)-65, 0x1F1E6+iso.charCodeAt(1)-65); } catch(e){ return ""; }
  }

  // ---- elements ----
  var $ = function (id) { return document.getElementById(id); };
  var views = { home: $("homeView"), setup: $("setupView"), draft: $("draftView"), results: $("resultsView"), board: $("boardView"), challenge: $("challengeView") };
  var elCountryStrip = $("countryStrip"), elYearStrip = $("yearStrip");
  var elSpin = $("spinBtn"), elReroll = $("rerollBtn"), elRerollCount = $("rerollCount"), elAutoPick = $("autoPickBtn");
  var elHint = $("hint"), elSquadPanel = $("squadPanel");
  var elXiList = $("xiList"), elXiCount = $("xiCount"), elFormation = $("formation");
  var elDone = $("doneBanner"), elRatingNote = $("ratingNote"), elResultsBody = $("resultsBody");
  var elManagerStrip = $("managerStrip"), elManagerSpin = $("managerSpin"), elManagerDesc = $("managerDesc"), elManagerStyles = $("managerStyles"), elTeamName = $("teamName");
  var elFormationBar = $("formationBar"), elSetupPitch = $("setupPitch"), elDraftPitch = $("draftPitch");
  var elPitchTitle = $("pitchTitle"), elDraftTeam = $("draftTeam"), elDraftMeta = $("draftMeta");
  var elRatingsToggle = $("ratingsToggle"), elRatingsDesc = $("ratingsDesc");
  var elProgressFill = $("draftProgressFill"), elProgressLabel = $("draftProgressLabel");
  var elEraMin = $("eraMin"), elEraMax = $("eraMax"), elEraFill = $("eraFill"), elEraLo = $("eraLo"), elEraHi = $("eraHi");
  var elPoolDesc = $("poolDesc"), elBoardBody = $("boardBody");
  var ALL_YEARS = (function () {
    var s = {}; COUNTRIES.forEach(function (c) { Object.keys(DATA[c].years).forEach(function (y) { s[y] = 1; }); });
    return Object.keys(s).sort();
  })();
  var selectedYears = {}; ALL_YEARS.forEach(function (y) { selectedYears[y] = true; });
  var minIdx = 0, maxIdx = ALL_YEARS.length - 1;
  var continent = "all";
  var CONTINENT = {
    "Austria": "EU", "Belgium": "EU", "Bosnia and Herzegovina": "EU", "Bulgaria": "EU", "Croatia": "EU",
    "Czech Republic": "EU", "Denmark": "EU", "England": "EU", "France": "EU", "Georgia": "EU", "Germany": "EU",
    "Greece": "EU", "Hungary": "EU", "Iceland": "EU", "Ireland": "EU", "Italy": "EU", "Netherlands": "EU",
    "Norway": "EU", "Poland": "EU", "Portugal": "EU", "Romania": "EU", "Russia": "EU", "Scotland": "EU",
    "Serbia": "EU", "Serbia & Montenegro": "EU", "Slovakia": "EU", "Slovenia": "EU", "Spain": "EU",
    "Sweden": "EU", "Switzerland": "EU", "Turkey": "EU", "Ukraine": "EU", "Wales": "EU", "Yugoslavia": "EU",
    "Czechoslovakia": "EU", "Soviet Union": "EU", "West Germany": "EU", "Northern Ireland": "EU",
    "Algeria": "AF", "Angola": "AF", "Cameroon": "AF", "Cape Verde": "AF", "Egypt": "AF", "Ghana": "AF",
    "Ivory Coast": "AF", "Morocco": "AF", "Nigeria": "AF", "Senegal": "AF", "South Africa": "AF", "Togo": "AF", "Tunisia": "AF",
    "Argentina": "SA", "Brazil": "SA", "Chile": "SA", "Colombia": "SA", "Ecuador": "SA", "Paraguay": "SA", "Peru": "SA", "Uruguay": "SA", "Bolivia": "SA",
    "Kuwait": "AS",
    "Australia": "OC", "New Zealand": "OC",
    "Canada": "NA", "Costa Rica": "NA", "Curaçao": "NA", "El Salvador": "NA", "Haiti": "NA", "Honduras": "NA",
    "Jamaica": "NA", "Mexico": "NA", "Panama": "NA", "Trinidad and Tobago": "NA", "USA": "NA", "United States": "NA",
    "China": "AS", "Iran": "AS", "Iraq": "AS", "Japan": "AS", "Jordan": "AS", "North Korea": "AS", "Qatar": "AS",
    "Saudi Arabia": "AS", "South Korea": "AS", "United Arab Emirates": "AS", "Uzbekistan": "AS"
  };
  var elContinentBar = $("continentBar");
  var elDiffBar = $("difficultyBar"), elDiffDesc = $("difficultyDesc");

  function rand(a) { return a[Math.floor(Math.random() * a.length)]; }
  function esc(s) { return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function shortName(n) { var p = String(n).split(" "); var l = p[p.length - 1]; return l.length > 10 ? l.slice(0, 9) + "…" : l; }
  function initials(n) {
    var p = String(n).split(" ").filter(Boolean);
    if (!p.length) return "?";
    if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
    return (p[0].charAt(0) + p[p.length - 1].charAt(0)).toUpperCase();
  }
  function showView(name) {
    Object.keys(views).forEach(function (k) { views[k].style.display = "none"; });
    views[name].style.display = "block";
    document.body.setAttribute("data-view", name);
    // Close, wipe and reset the squad dock whenever the view changes
    if (window.flResetSquadDock) window.flResetSquadDock();
    if (window.scrollTo) window.scrollTo(0, 0);
  }

  // ---- formation helpers ----
  function formationSlots(name) {
    var slots = [];
    FORMATIONS[name || formation].lines.forEach(function (line) {
      line.forEach(function (pos) { slots.push({ pos: pos, line: LINE_OF[pos] }); });
    });
    slots.push({ pos: "GK", line: "GK" });
    return slots;
  }
  function slotCountsFor(name) {
    var c = {}; formationSlots(name).forEach(function (s) { c[s.pos] = (c[s.pos] || 0) + 1; }); return c;
  }
  function pickCounts() { var c = {}; squad.forEach(function (p) { c[p.slot] = (c[p.slot] || 0) + 1; }); return c; }
  function openOf(pos) { return (slotCountsFor(formation)[pos] || 0) - (pickCounts()[pos] || 0); }
  function formationCounts(name) {
    var c = { GK: 1, DEF: 0, MID: 0, FWD: 0 };
    FORMATIONS[name].lines.forEach(function (line) { line.forEach(function (pos) { c[LINE_OF[pos]]++; }); });
    return c;
  }
  function broadPositions(pl) { return VERSATILE[pl.n] || [pl.p]; }
  function eligGranular(pl) {
    var set = {}, gps = gpOf(pl);
    if (gps) {
      // exact positions only — a left-back can't be slotted at right-back, etc.
      gps.forEach(function (p) { (SLOT_FILL[p] || [p]).forEach(function (s) { set[s] = 1; }); });
    } else {
      broadPositions(pl).forEach(function (bp) { (BROAD_ELIG[bp] || [bp]).forEach(function (g) { set[g] = 1; }); });
    }
    return Object.keys(set);
  }
  function openEligiblePositions(pl) {
    var elig = eligGranular(pl), seen = {}, out = [];
    formationSlots().forEach(function (s) {
      if (seen[s.pos]) return;
      if (elig.indexOf(s.pos) !== -1 && openOf(s.pos) > 0) { seen[s.pos] = 1; out.push(s.pos); }
    });
    return out;
  }
  function preferredSlot(pl, opts) {
    var prim = pl.p;
    for (var i = 0; i < opts.length; i++) if (LINE_OF[opts[i]] === prim) return opts[i];
    return opts[0];
  }

  // Assign drafted picks to the formation's slots (line by line) for rendering.
  function assignByLines() {
    var byPos = {};
    squad.forEach(function (p) { (byPos[p.slot] = byPos[p.slot] || []).push(p); });
    function pop(pos) { var a = byPos[pos]; return a && a.length ? a.shift() : null; }
    var lines = FORMATIONS[formation].lines.map(function (line) {
      return line.map(function (pos) { return { pos: pos, line: LINE_OF[pos], pick: pop(pos) }; });
    });
    var gk = [{ pos: "GK", line: "GK", pick: pop("GK") }];
    return { lines: lines, gk: gk };
  }

  // ---- pitch ----
  function ratingTierClass(r) {
    if (!r) return "";
    return r >= 90 ? " r-gold" : r >= 85 ? " r-elite" : r >= 80 ? " r-great" : r >= 75 ? " r-good" : r >= 70 ? " r-amber" : r >= 60 ? " r-orange" : " r-red";
  }
  function renderPitchInto(el) {
    var a = assignByLines();
    function cell(c) {
      if (c.pick) {
        var tier = ratingTierClass(c.pick.r);
        return '<div class="pdot filled ' + c.line + tier + '">' +
          '<span class="dot-init">' + (c.pick.r ? c.pick.r : esc(initials(c.pick.n))) +
          '</span><span class="dot-name">' + esc(shortName(c.pick.n)) + "</span></div>";
      }
      return '<div class="pdot ' + c.line + '"><span class="dot-pos">' + c.pos + "</span></div>";
    }
    var html = '<div class="pitch">';
    a.lines.slice().reverse().forEach(function (line) {
      html += '<div class="pitch-row">' + line.map(cell).join("") + "</div>";
    });
    html += '<div class="pitch-row">' + a.gk.map(cell).join("") + "</div>";
    el.innerHTML = html + "</div>";
  }
  function paintPitches() {
    if (elSetupPitch) renderPitchInto(elSetupPitch);
    if (elDraftPitch) renderPitchInto(elDraftPitch);
    var mgr = currentManager();
    if (elPitchTitle) elPitchTitle.textContent = formation;
    if (elDraftTeam) elDraftTeam.textContent = teamDisplayName();
    if (elDraftMeta) elDraftMeta.textContent = formation + " · " + mgr.name;
  }

  // ---- setup controls ----
  function styleById(id) { for (var i = 0; i < MANAGERS.length; i++) if (MANAGERS[i].id === id) return MANAGERS[i]; return MANAGERS[0]; }
  function managerItemHTML(name, styleId) {
    var st = styleById(styleId);
    return '<div class="reel-item mgr-item"><span class="mgr-name-big">' + esc(name) + '</span></div>';
  }
  function renderManagerStyles() {
    elManagerStyles.innerHTML = MANAGERS.map(function (m) {
      var condState = "";
      if (m.cond) {
        var cb = computeConditionalBonus(squad, m.id);
        if (cb) condState = '<span class="mgr-cond-dot ' + (cb.met ? "met" : "unmet") + '"></span>';
      }
      return '<button class="manager-opt' + (m.id === managerId ? " active" : "") + (m.cond ? " cond-style" : "") + '" data-style="' + m.id +
        '" title="' + esc(m.desc) + '"><span class="mgr-icon">' + (MGR_ICONS[m.id] || "") + '</span>' +
        '<span class="mgr-name">' + esc(m.name) + condState + '</span></button>';
    }).join("");
    Array.prototype.forEach.call(elManagerStyles.querySelectorAll(".manager-opt"), function (b) {
      b.addEventListener("click", function () {
        managerId = b.getAttribute("data-style"); managerName = "";
        saveManagerPref();
        renderManagerStyles(); renderManager(); paintPitches(); renderXI();
      });
    });
  }
  function mgrBonusHTML(st) {
    if (!st || st.id === "none") return "";
    var parts = [];
    if (st.cond) {
      var cb = computeConditionalBonus(squad, st.id);
      if (cb) {
        var bonus = cb.met
          ? '<span class="mgr-bonus mgr-atk-pos">+' + (st.id === "tikitaka" ? 3 : 4) + ' ATK ✓</span>'
          : '<span class="mgr-bonus mgr-cond-locked">Condition not met</span>';
        parts.push(bonus);
        parts.push('<span class="mgr-bonus mgr-cond-hint">' + esc(cb.detail || st.condLabel || "") + '</span>');
      }
    } else {
      if (st.atk > 0) parts.push('<span class="mgr-bonus mgr-atk-pos">+' + st.atk + " ATK</span>");
      if (st.atk < 0) parts.push('<span class="mgr-bonus mgr-atk-neg">' + st.atk + " ATK</span>");
      if (st.def > 0) parts.push('<span class="mgr-bonus mgr-def-pos">+' + st.def + " DEF</span>");
      if (st.def < 0) parts.push('<span class="mgr-bonus mgr-def-neg">' + st.def + " DEF</span>");
      if (st.ko  > 0) parts.push('<span class="mgr-bonus mgr-ko-pos">+' + st.ko + " KO</span>");
    }
    return parts.length ? '<div class="mgr-bonus-row">' + parts.join("") + "</div>" : "";
  }

  function renderManager() {
    if (managerId === "none") {
      elManagerStrip.innerHTML = '<div class="reel-item mgr-item"><span class="mgr-name-big">No manager</span></div>';
      elManagerDesc.innerHTML = "Pick a tactical style above, or spin the wheel for a famous manager.";
    } else {
      var st = currentManager();
      if (managerName) {
        elManagerStrip.innerHTML = managerItemHTML(managerName, managerId);
      } else {
        elManagerStrip.innerHTML = '<div class="reel-item mgr-item"><span class="mgr-name-big"><span class="mgr-icon">' + (MGR_ICONS[st.id] || "") + '</span>' + esc(st.name) + '</span></div>';
      }
      elManagerDesc.innerHTML = esc(st.name) + " — " + esc(st.desc) + mgrBonusHTML(st);
    }
  }
  function saveManagerPref(){
    try{ localStorage.setItem("wcxi_manager", JSON.stringify({id:managerId,name:managerName})); }catch(e){}
  }
  function loadManagerPref(){
    try{
      var s=localStorage.getItem("wcxi_manager"); if(!s) return;
      var o=JSON.parse(s);
      if(o.id) managerId=o.id;
      if(o.name) managerName=o.name;
    }catch(e){}
  }
  function spinManager() {
    if (managerSpinning || managerSpun) return; // one spin only
    managerSpinning = true; elManagerSpin.disabled = true;
    var pick = rand(MANAGERS_DB);
    spinReel(elManagerStrip, function () { var m = rand(MANAGERS_DB); return managerItemHTML(m.n, m.s); },
      managerItemHTML(pick.n, pick.s), 500).then(function () {
        managerName = pick.n; managerId = pick.s; managerSpinning = false; managerSpun = true;
        elManagerSpin.disabled = true; elManagerSpin.textContent = "Manager appointed";
        saveManagerPref();
        renderManager(); renderManagerStyles(); paintPitches(); renderXI();
      });
  }
  function renderFormationBar() {
    var html = "";
    FORMATION_KEYS.forEach(function (name) {
      html += '<button class="formation-opt' + (name === formation ? " active" : "") +
        '" data-formation="' + name + '">' + name + "</button>";
    });
    elFormationBar.innerHTML = html;
    Array.prototype.forEach.call(elFormationBar.querySelectorAll(".formation-opt"), function (b) {
      b.addEventListener("click", function () { selectFormation(b.getAttribute("data-formation")); });
    });
  }
  function selectFormation(name) {
    if (!FORMATIONS[name]) return;
    formation = name;
    var cap = slotCountsFor(name), used = {};
    squad = squad.filter(function (p) {
      used[p.slot] = used[p.slot] || 0;
      if (used[p.slot] < (cap[p.slot] || 0)) { used[p.slot]++; return true; }
      return false;
    });
    renderFormationBar(); paintPitches(); renderXI();
    if (current) renderSquadPicker();
  }
  function renderTwoToggle(el, descEl, attr, getVal, setVal, descs) {
    Array.prototype.forEach.call(el.querySelectorAll(".tg-opt"), function (b) {
      var v = b.getAttribute(attr);
      b.className = "tg-opt" + (v === getVal() ? " active" : "");
      b.onclick = function () { setVal(v); renderTwoToggle(el, descEl, attr, getVal, setVal, descs); };
    });
    if (descEl) descEl.textContent = descs[getVal()] || "";
  }
  function renderRatingsToggle() {
    renderTwoToggle(elRatingsToggle, elRatingsDesc, "data-ratings",
      function () { return showRatings ? "show" : "hide"; },
      function (v) { showRatings = (v === "show"); paintPitches(); renderXI(); if (current) renderSquadPicker(); },
      { show: "Player ratings are visible while you draft.", hide: "Ratings hidden — draft blind for a tougher challenge." });
  }
  function eraApply() {
    selectedYears = {};
    for (var i = minIdx; i <= maxIdx; i++) selectedYears[ALL_YEARS[i]] = true;
    var n = ALL_YEARS.length - 1;
    elEraMin.max = n; elEraMax.max = n; elEraMin.value = minIdx; elEraMax.value = maxIdx;
    elEraFill.style.left = (n ? 100 * minIdx / n : 0) + "%";
    elEraFill.style.width = (n ? 100 * (maxIdx - minIdx) / n : 100) + "%";
    elEraLo.textContent = ALL_YEARS[minIdx]; elEraHi.textContent = ALL_YEARS[maxIdx];
    var cnt = maxIdx - minIdx + 1;
    var contName = { all: "all continents", EU: "Europe", AF: "Africa", SA: "South America" }[continent];
    if (mode === "cl") {
      elPoolDesc.textContent = ALL_YEARS[minIdx] + "–" + ALL_YEARS[maxIdx] + " · " + poolPairs().length + " squads in the draw.";
    } else if (mode === "euro") {
      elPoolDesc.textContent = cnt + " Euro" + (cnt === 1 ? "" : "s") + " · " + poolPairs().length + " squads in the draw.";
    } else {
      elPoolDesc.textContent = cnt + " World Cup" + (cnt === 1 ? "" : "s") + " · " + contName + " · " + poolPairs().length + " squads in the draw.";
    }
  }
  function renderEra() {
    elEraMin.oninput = function () { minIdx = Math.min(parseInt(this.value, 10), maxIdx); eraApply(); };
    elEraMax.oninput = function () { maxIdx = Math.max(parseInt(this.value, 10), minIdx); eraApply(); };
    $("eraAll").onclick = function () { minIdx = 0; maxIdx = ALL_YEARS.length - 1; eraApply(); };
    $("era2026").onclick = function () { var i = ALL_YEARS.indexOf("2026"); if (i < 0) i = ALL_YEARS.length - 1; minIdx = maxIdx = i; eraApply(); };
    eraApply();
  }

  function renderDifficultyBar() {
    elDiffBar.innerHTML = DIFFICULTIES.map(function (d) {
      var sub = d.rr === 0 ? "No rerolls" : d.rr + " reroll" + (d.rr === 1 ? "" : "s");
      return '<button class="diff-btn' + (d.id === difficulty ? " active" : "") + '" data-diff="' + d.id +
        '"><span class="diff-name">' + d.id + '</span><span class="diff-sub">' + sub + "</span></button>";
    }).join("");
    Array.prototype.forEach.call(elDiffBar.querySelectorAll(".diff-btn"), function (b) {
      b.addEventListener("click", function () { difficulty = b.getAttribute("data-diff"); renderDifficultyBar(); });
    });
    var d = DIFFICULTIES.filter(function(x){ return x.id === difficulty; })[0];
    elDiffDesc.textContent = d ? d.desc : "";
  }

  function inContinent(c) { return continent === "all" || CONTINENT[c] === continent; }
  /* ═══════════════════════════════════════════════════════════════════
     CHALLENGE SYSTEM — Daily constraints + curated historical challenges
     ═══════════════════════════════════════════════════════════════════ */
  var activeConstraint = null; /* set when a challenge mode is active */

  var SA_NATIONS = ["Argentina","Brazil","Chile","Colombia","Ecuador","Paraguay","Peru","Uruguay","Bolivia"];
  var AF_NATIONS = ["Algeria","Angola","Cameroon","Cape Verde","Egypt","Ghana","Ivory Coast","Morocco","Nigeria","Senegal","South Africa","Togo","Tunisia"];
  var AMER_NATIONS = SA_NATIONS.concat(["USA","United States","Mexico","Canada","Costa Rica","Honduras","Jamaica","Panama","Trinidad and Tobago"]);

  /* Daily constraints: pair-level filters + optional player-level filters */
  var DAILY_CONSTRAINTS = [
    { id:"wc2022", label:"Qatar 2022 Only",        icon:"🏆", desc:"Only players from the 2022 World Cup squads.", filterPair:function(p){ return p.y==="2022"; } },
    { id:"wc2018", label:"Russia 2018 Only",        icon:"🏅", desc:"Only players from the 2018 World Cup squads.", filterPair:function(p){ return p.y==="2018"; } },
    { id:"wc2014", label:"Brazil 2014 Only",        icon:"⭐", desc:"Only players from the 2014 World Cup in Brazil.", filterPair:function(p){ return p.y==="2014"; } },
    { id:"wc2010", label:"South Africa 2010 Only",  icon:"🌍", desc:"Only players from the 2010 World Cup squads.", filterPair:function(p){ return p.y==="2010"; } },
    { id:"wc2006", label:"Germany 2006 Only",       icon:"🦅", desc:"Only players from the 2006 World Cup in Germany.", filterPair:function(p){ return p.y==="2006"; } },
    { id:"wc2002", label:"Korea/Japan 2002 Only",   icon:"🏟", desc:"Only players from the 2002 World Cup squads.", filterPair:function(p){ return p.y==="2002"; } },
    { id:"wc1998", label:"France 98 Only",          icon:"🇫🇷", desc:"Only players from the 1998 World Cup in France.", filterPair:function(p){ return p.y==="1998"; } },
    { id:"wc1994", label:"USA 94 Only",             icon:"🦅", desc:"Only players from the 1994 World Cup squads.", filterPair:function(p){ return p.y==="1994"; } },
    { id:"wc1990", label:"Italia 90 Only",          icon:"🇮🇹", desc:"Build your XI exclusively from Italia 90 squads.", filterPair:function(p){ return p.y==="1990"; } },
    { id:"wc1986", label:"Mexico 86 Only",          icon:"⚽", desc:"Only players from the 1986 World Cup in Mexico.", filterPair:function(p){ return p.y==="1986"; } },
    { id:"decade90s", label:"The 90s",              icon:"📼", desc:"Only players from World Cups held in the 1990s (1990, 1994, 1998).", filterPair:function(p){ var y=parseInt(p.y); return y>=1990&&y<2000; } },
    { id:"decade80s", label:"The 80s",              icon:"📻", desc:"Only players from World Cups held in the 1980s (1982, 1986).", filterPair:function(p){ var y=parseInt(p.y); return y>=1980&&y<1990; } },
    { id:"golden_era", label:"The Golden Era",      icon:"✨", desc:"Only players from tournaments between 1994 and 2006.", filterPair:function(p){ var y=parseInt(p.y); return y>=1994&&y<=2006; } },
    { id:"modern", label:"Modern Football",         icon:"🚀", desc:"Only players from 2010 World Cups onwards.", filterPair:function(p){ return parseInt(p.y)>=2010; } },
    { id:"classic", label:"The Classic Era",        icon:"🎞", desc:"Only players from pre-1980 squads — the purists' choice.", filterPair:function(p){ return parseInt(p.y)<1980; } },
    { id:"sa_only", label:"South American XI",      icon:"🌎", desc:"Only South American nations — Brazil, Argentina & Co.", filterPair:function(p){ return SA_NATIONS.indexOf(p.c)>=0; } },
    { id:"eu_only", label:"European XI",            icon:"🏰", desc:"Only European nations may enter the draft.", filterPair:function(p){ return CONTINENT[p.c]==="EU"; } },
    { id:"af_only", label:"African XI",             icon:"🌍", desc:"Only African nations. Underrated squads, massive upsets.", filterPair:function(p){ return AF_NATIONS.indexOf(p.c)>=0; } },
    { id:"americas", label:"The Americas",          icon:"🗺", desc:"North & South America combined — a continental showdown.", filterPair:function(p){ return AMER_NATIONS.indexOf(p.c)>=0||CONTINENT[p.c]==="SA"; } },
    { id:"elite90", label:"Elite Only",             icon:"💎", desc:"Every player in your XI must be rated 90 or above.", filterPair:null, filterPlayer:function(pl){ return pl.r>=90; } },
    { id:"elite85", label:"Stars Only",             icon:"⭐", desc:"Only players rated 85+ may be selected.", filterPair:null, filterPlayer:function(pl){ return pl.r>=85; } },
    { id:"wc2026", label:"2026 World Cup Only",     icon:"🆕", desc:"Only players from the brand new 2026 World Cup squads.", filterPair:function(p){ return p.y==="2026"; } },
    { id:"latin", label:"Latin Classic",            icon:"🔥", desc:"Brazil, Argentina, Spain, Italy & Portugal only.", filterPair:function(p){ return ["Brazil","Argentina","Spain","Italy","Portugal"].indexOf(p.c)>=0; } },
    { id:"big4", label:"The Big 4",                 icon:"👑", desc:"Only players from Brazil, Argentina, Germany and France.", filterPair:function(p){ return ["Brazil","Argentina","Germany","West Germany","France"].indexOf(p.c)>=0; } }
  ];

  /* Permanent historical challenges (playable any time) */
  var PERMANENT_CHALLENGES = [
    { id:"italia90", label:"Italia '90 XI",        icon:"🇮🇹", desc:"Build your XI exclusively from 1990 World Cup squads.",      filterPair:function(p){ return p.y==="1990"; }, badge:"Classic" },
    { id:"golden_era", label:"The Golden Era",     icon:"✨", desc:"Only players from World Cups 1994–2006 — the peak era.",      filterPair:function(p){ var y=parseInt(p.y); return y>=1994&&y<=2006; }, badge:"Fan favourite" },
    { id:"sa_xi", label:"South American XI",       icon:"🌎", desc:"Only South American nations. The continent of passion.",      filterPair:function(p){ return SA_NATIONS.indexOf(p.c)>=0; }, badge:"Regional" },
    { id:"elite_club", label:"The Elite",          icon:"💎", desc:"Every player must be rated 90+. Only the very best.",         filterPair:null, filterPlayer:function(pl){ return pl.r>=90; }, badge:"Hardest" },
    { id:"modern", label:"Modern Legends",         icon:"🚀", desc:"2010 onwards only. The era of pressing, data, and Messi.",    filterPair:function(p){ return parseInt(p.y)>=2010; }, badge:"Modern" },
    { id:"big4_only", label:"Big 4 Nations",       icon:"👑", desc:"Brazil, Argentina, Germany and France only. The gods.",       filterPair:function(p){ return ["Brazil","Argentina","Germany","West Germany","France"].indexOf(p.c)>=0; }, badge:"Curated" }
  ];

  function todayStrChal() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
  }
  function getDailyConstraint() {
    var s = todayStrChal(), h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h<<5)+h+s.charCodeAt(i))|0;
    return DAILY_CONSTRAINTS[Math.abs(h) % DAILY_CONSTRAINTS.length];
  }
  function setConstraint(c) {
    activeConstraint = c || null;
  }
  function clearConstraint() {
    activeConstraint = null;
  }

  function poolPairs() {
    var pairs = [];
    COUNTRIES.forEach(function (c) {
      if (!inContinent(c)) return;
      Object.keys(DATA[c].years).forEach(function (y) { if (selectedYears[y]) pairs.push({ c: c, y: y }); });
    });
    // fallback: keep continent, ignore era; then drop everything
    if (!pairs.length) COUNTRIES.forEach(function (c) { if (inContinent(c)) Object.keys(DATA[c].years).forEach(function (y) { pairs.push({ c: c, y: y }); }); });
    if (!pairs.length) COUNTRIES.forEach(function (c) { Object.keys(DATA[c].years).forEach(function (y) { pairs.push({ c: c, y: y }); }); });
    /* Apply active constraint pair filter */
    if (activeConstraint && activeConstraint.filterPair) {
      var constrained = pairs.filter(activeConstraint.filterPair);
      if (constrained.length > 0) pairs = constrained;
    }
    return pairs;
  }
  function renderContinent() {
    var opts = [["all", "Everywhere"], ["EU", "Europe"], ["AF", "Africa"], ["SA", "South America"]];
    elContinentBar.innerHTML = opts.map(function (o) {
      return '<button class="formation-opt' + (o[0] === continent ? " active" : "") + '" data-cont="' + o[0] + '">' + o[1] + "</button>";
    }).join("");
    Array.prototype.forEach.call(elContinentBar.querySelectorAll(".formation-opt"), function (b) {
      b.addEventListener("click", function () { continent = b.getAttribute("data-cont"); renderContinent(); eraApply(); });
    });
  }

  // ---- slot machine ----
  function countryItemHTML(c) {
    return '<div class="reel-item reel-item-noflag"><span class="name">' + c + "</span></div>";
  }
  function yearItemHTML(y) { return '<div class="reel-item"><span class="year">' + y + "</span></div>"; }
  function spinReel(stripEl, randomItem, finalHTML, duration) {
    var reelEl = stripEl.parentElement;
    return new Promise(function (resolve) {
      var BLUR = 14, html = "";
      for (var i = 0; i < BLUR; i++) html += randomItem();
      html += finalHTML;
      stripEl.style.transition = "none"; stripEl.style.transform = "translateY(0)";
      stripEl.innerHTML = html; void stripEl.offsetHeight;
      /* Dynamic item height — safe for CL (58px items) and WC/league (96px) */
      var itemH = (stripEl.firstElementChild && stripEl.firstElementChild.offsetHeight) || ITEM_H;
      /* Sharper deceleration = slot-machine snap feel */
      stripEl.style.transition = "transform " + duration + "ms cubic-bezier(0.12,0.05,0.05,1)";
      stripEl.style.transform = "translateY(" + (-(BLUR * itemH)) + "px)";
      var done = false;
      function finish(e) {
        /* Only fire on the strip's own transform transition, not bubbled child events */
        if (e && e.propertyName && e.propertyName !== "transform") return;
        if (done) return; done = true;
        stripEl.style.transition = "none";
        stripEl.style.transform = "translateY(0)";
        stripEl.innerHTML = finalHTML;
        /* Settle flash: add class, remove after animation completes */
        if (reelEl) {
          reelEl.classList.add("reel--settled");
          setTimeout(function () { reelEl.classList.remove("reel--settled"); }, 950);
        }
        resolve();
      }
      stripEl.addEventListener("transitionend", finish, { once: true });
      setTimeout(function(){ finish(null); }, duration + 120);
    });
  }

  /* ── Reroll summary (shown in done-banner when XI is complete) ───── */
  function rerollSummaryHTML() {
    if (!rerollsMax) return ""; /* Legend mode — no rerolls to show */
    var used = rerollLog.length;
    if (!used) {
      return '<div class="rr-summary rr-summary--clean">' +
        '<span class="rr-sum-ico">🎯</span>' +
        '<span class="rr-sum-txt">No rerolls used — built with ice-cold precision.</span>' +
      '</div>';
    }
    /* Net gain: sum of (kept − discarded) for entries where we have both */
    var netGain = 0, pairs = 0;
    var rows = rerollLog.map(function(e, i) {
      var net = (e.kept !== null && e.discarded !== null) ? (e.kept - e.discarded) : null;
      if (net !== null) { netGain += net; pairs++; }
      return '<span class="rr-sum-swap">' +
        (e.discarded !== null ? '<span class="rr-sum-was">' + e.discarded + '</span>' : '') +
        ' → ' +
        (e.kept !== null ? '<span class="rr-sum-got ' + (net !== null && net >= 0 ? "pos" : "neg") + '">' + e.kept + '</span>' : '?') +
        (net !== null ? '<span class="rr-sum-net">' + (net >= 0 ? "+" : "") + net + '</span>' : '') +
      '</span>';
    }).join(' · ');

    var leftOver = rerollsMax - used;
    var netLabel = pairs > 0 ? ' &nbsp;·&nbsp; Net <strong>' + (netGain >= 0 ? "+" : "") + netGain + '</strong>' : '';
    return '<div class="rr-summary">' +
      '<div class="rr-sum-head">' +
        '<span class="rr-sum-ico">🔥</span>' +
        '<span class="rr-sum-stat"><strong>' + used + '</strong> of <strong>' + rerollsMax + '</strong> reroll' + (rerollsMax === 1 ? '' : 's') + ' used' +
        (leftOver > 0 ? ' &nbsp;·&nbsp; <span class="rr-saved">' + leftOver + ' saved</span>' : '') +
        netLabel +
        '</span>' +
      '</div>' +
      '<div class="rr-sum-swaps">' + rows + '</div>' +
    '</div>';
  }

  function updateControls() {
    var full = squad.length >= XI_SIZE;
    elSpin.disabled = spinning || awaitingPick || full;
    elRerollCount.textContent = rerollsLeft;
    elReroll.hidden = true; /* Respin button is now inside the squad panel */
    elReroll.disabled = spinning;
    elAutoPick.hidden = !(awaitingPick && !full);
    elAutoPick.disabled = spinning;
    /* Progress bar */
    var pct = Math.round((squad.length / XI_SIZE) * 100);
    if (elProgressFill) elProgressFill.style.width = pct + "%";
    if (elProgressLabel) elProgressLabel.textContent = squad.length + " / " + XI_SIZE + " drafted";
    /* Reroll warning at 1 left */
    var rerollBar = $("draftProgressBar");
    if (rerollBar) rerollBar.className = "draft-progress-bar" + (rerollsLeft === 1 ? " reroll-warn" : "");
    /* Constraint banner */
    var existBanner = $("constraintBanner");
    if (activeConstraint) {
      if (!existBanner) {
        var banner = document.createElement("div");
        banner.id = "constraintBanner";
        banner.className = "constraint-banner";
        if (rerollBar && rerollBar.parentNode) rerollBar.parentNode.insertBefore(banner, rerollBar.nextSibling);
      }
      var b = $("constraintBanner");
      if (b) b.innerHTML = '<span class="cb-icon">' + (activeConstraint.icon||"🎯") + '</span>' +
        '<span class="cb-label">' + esc(activeConstraint.label) + '</span>' +
        '<span class="cb-desc">' + esc(activeConstraint.desc) + '</span>' +
        '<button class="cb-exit" id="constraintExit">✕ Exit challenge</button>';
      var exitBtn = $("constraintExit");
      if (exitBtn && !exitBtn._wired) {
        exitBtn._wired = true;
        exitBtn.addEventListener("click", function() { clearConstraint(); newGame(); });
      }
    } else if (existBanner) {
      existBanner.remove();
    }
  }

  function doSpin() {
    if (spinning) return;
    if (window.sfx) window.sfx.spin();
    spinning = true; awaitingPick = false; elDone.style.display = "none";
    updateControls(); elHint.textContent = "Spinning…";
    var pairs = poolPairs();
    // Weighted spin — big football nations are much more likely to appear
    var SPIN_WEIGHTS = {
      "Brazil":5,"Germany":5,"Italy":5,"Argentina":5,"France":5,"Spain":5,
      "England":4,"Netherlands":4,"Portugal":4,"Belgium":3.5,"Croatia":3,
      "Uruguay":3,"Mexico":3,"Colombia":2.5,"Chile":2.5,"Denmark":2.5,
      "Sweden":2.5,"Poland":2.5,"Switzerland":2.5,"Serbia":2,"Czech Republic":2,
      "Austria":2,"Hungary":2,"Russia":2,"Romania":2,"USA":2,"Japan":2,"South Korea":2,
      "Cameroon":2,"Senegal":2,"Morocco":2,"Nigeria":2,"Ghana":2,"Tunisia":2,
      "Australia":1.8,"Peru":1.8,"Ecuador":1.8,"Paraguay":1.8,"Bolivia":1.5
    };
    var weights = pairs.map(function(p){ return SPIN_WEIGHTS[p.c] || 1; });
    var totalW = 0; for (var wi=0;wi<weights.length;wi++) totalW+=weights[wi];
    var rnd = Math.random()*totalW, cum=0, pickIdx=0;
    for (var wj=0;wj<weights.length;wj++){ cum+=weights[wj]; if(rnd<=cum){ pickIdx=wj; break; } }
    var pick = pairs[pickIdx];
    current = { country: pick.c, year: pick.y };
    var pc = pairs.map(function (p) { return p.c; }), py = pairs.map(function (p) { return p.y; });
    elSpin.textContent = "SPINNING…";
    /* Longer durations make the deceleration more satisfying */
    var p1 = spinReel(elCountryStrip, function () { return countryItemHTML(rand(pc)); }, countryItemHTML(pick.c), 560);
    var p2 = spinReel(elYearStrip, function () { return yearItemHTML(rand(py)); }, yearItemHTML(pick.y), 620);
    Promise.all([p1, p2]).then(function () { spinning = false; elSpin.textContent = "SPIN"; elHint.textContent = ""; renderSquadPicker(); if (window.GAFFER_OB) window.GAFFER_OB.afterSpin(); });
  }

  function ratingBadge(p) { return showRatings ? '<span class="mp-r-badge' + ratingTierClass(p.r) + '">' + p.r + '</span>' : ""; }
  function playerByName(name) {
    var list = DATA[current.country].years[current.year];
    for (var i = 0; i < list.length; i++) if (list[i].n === name) return list[i];
    return null;
  }

  function renderSquadPicker() {
    if (!current) return;
    var c = current.country, y = current.year, players = DATA[c].years[y];
    /* Apply player-level constraint if active (e.g. "Elite Only: 90+") */
    if (activeConstraint && activeConstraint.filterPlayer) {
      var fp = players.filter(activeConstraint.filterPlayer);
      if (fp.length > 0) players = fp;
    }
    var taken = squad.map(function (s) { return s.country + "|" + s.year + "|" + s.n; });

    // Pre-compute draftable count so header can show respin button correctly
    var draftable = 0;
    players.forEach(function (pl) {
      var isTaken = taken.indexOf(c + "|" + y + "|" + pl.n) !== -1;
      var open = openEligiblePositions(pl);
      if (!isTaken && open.length > 0) draftable++;
    });

    // Find GOAT (highest-rated available player)
    var goatName = null, goatR = -1;
    players.forEach(function(pl) {
      if (taken.indexOf(c+"|"+y+"|"+pl.n) !== -1) return;
      if ((pl.r||0) > goatR) { goatR = pl.r||0; goatName = pl.n; }
    });

    // Modal card header
    var flag = countryFlag(c);
    var inner = '<div class="squad-card">';
    inner += '<div class="squad-head"><h2>' + (flag ? '<span class="squad-flag">'+flag+'</span> ' : '') + esc(c) + " &middot; " + y + '</h2>';
    if (draftable > 0 && rerollsLeft > 0) {
      var rerollWarn = rerollsLeft === 1 ? ' reroll-last' : '';
      inner += '<button class="squad-respin-btn'+rerollWarn+'" id="squadRespinBtn">Respin <span class="reroll-badge">'+rerollsLeft+'</span></button>';
    } else if (draftable > 0) {
      inner += '<span class="squad-respin-empty">No respins left</span>';
    }
    inner += '</div>';
    inner += '<div class="sub">Pick a player, then choose where they play.</div>';
    inner += '<div class="squad-search-wrap"><input class="squad-search" id="squadSearch" type="text" placeholder="Search players…" autocomplete="off" /></div>';

    if (pendingPick) {
      inner += '<div class="chooser">Where should <b>' + esc(pendingPick.name) + "</b> play? " +
        pendingPick.positions.map(function (pos) {
          return '<button class="choose-pos ' + LINE_OF[pos] + '" data-name="' + esc(pendingPick.name) + '" data-pos="' + pos + '">' + POS_FULL[pos] + " (" + pos + ")</button>";
        }).join("") + '<button class="choose-cancel">cancel</button></div>';
    }

    // Sort players into position groups: GK → DEF → MID → FWD, rating desc within each
    var lineLabels = { GK: "Goalkeeper", DEF: "Defenders", MID: "Midfielders", FWD: "Attackers" };
    var groups = { GK: [], DEF: [], MID: [], FWD: [] };
    players.forEach(function (pl) {
      var gps0 = gpOf(pl);
      var line = LINE_OF[gps0 ? gps0[0] : pl.p] || "MID";
      (groups[line] || groups.MID).push(pl);
    });
    var GAME_POS_ORD = {GK:0,LB:1,LWB:2,CB:3,RWB:4,RB:5,CDM:6,CM:7,CAM:8,AM:8,LW:9,RW:10,ST:11,CF:11};
    ["GK","DEF","MID","FWD"].forEach(function (L) {
      groups[L].sort(function (a, b) {
        var gA = gpOf(a), gB = gpOf(b);
        var pa = GAME_POS_ORD[gA?gA[0]:a.p]; if(pa==null) pa=7;
        var pb = GAME_POS_ORD[gB?gB[0]:b.p]; if(pb==null) pb=7;
        return pa!==pb ? pa-pb : (b.r||0)-(a.r||0);
      });
    });

    inner += '<div class="players">';
    ["GK","DEF","MID","FWD"].forEach(function (line) {
      var grp = groups[line];
      if (!grp.length) return;
      inner += '<div class="squad-group-label ' + line + '">' + lineLabels[line] + '</div>';
      grp.forEach(function (pl) {
        var isTaken = taken.indexOf(c + "|" + y + "|" + pl.n) !== -1;
        var open = openEligiblePositions(pl);
        var noSlot = open.length === 0;
        if (!isTaken && !noSlot) draftable++;
        var isGoat = !isTaken && pl.n === goatName;
        var cls = "player" + (isTaken ? " taken" : "") + (noSlot && !isTaken ? " noslot" : "") + (isGoat ? " goat-player" : "");
        var gps = gpOf(pl), posTag = gps ? gps.join("/") : pl.p, lineCls = gps ? LINE_OF[gps[0]] : pl.p;
        inner += '<div class="' + cls + '" data-name="' + esc(pl.n) + '"><span class="pos ' + lineCls + '">' + posTag + "</span>" +
          '<span class="pname">' + esc(pl.n) + "</span>" +
          (isGoat ? '<span class="goat-badge">GOAT</span>' : '') +
          (noSlot && !isTaken ? '<span class="slot-tag">no slot</span>' : ratingBadge(pl)) + "</div>";
      });
    });
    inner += "</div></div>"; // close .players + .squad-card

    elSquadPanel.innerHTML = inner;
    elSquadPanel.style.display = "flex";

    var respinBtn = elSquadPanel.querySelector("#squadRespinBtn");
    if (respinBtn) {
      respinBtn.addEventListener("click", function () {
        if (rerollsLeft <= 0 || spinning) return;
        /* Record what's being burned before decrement */
        var discR = pendingPick ? pendingPick.r : null;
        rerollLog.push({ discarded: discR, kept: null });
        rerollsLeft--;
        pendingDiscard = discR;
        pendingPick = null;
        /* Burn animation on badge */
        var badge = respinBtn.querySelector(".reroll-badge");
        if (badge) { badge.classList.add("rr-burn"); setTimeout(function(){ badge.classList.remove("rr-burn"); }, 500); }
        elSquadPanel.style.display = "none";
        doSpin();
      });
    }

    Array.prototype.forEach.call(elSquadPanel.querySelectorAll(".player"), function (n) {
      n.addEventListener("click", function () {
        if (n.classList.contains("taken") || n.classList.contains("noslot")) return;
        var name = n.getAttribute("data-name"), pl = playerByName(name), open = openEligiblePositions(pl);
        if (!open.length) return;
        pendingPick = { name: name, positions: open }; renderSquadPicker();
      });
    });
    Array.prototype.forEach.call(elSquadPanel.querySelectorAll(".choose-pos"), function (b) {
      b.addEventListener("click", function () { pickPlayer(b.getAttribute("data-name"), b.getAttribute("data-pos")); });
    });
    var cancel = elSquadPanel.querySelector(".choose-cancel");
    if (cancel) cancel.addEventListener("click", function () { pendingPick = null; renderSquadPicker(); });
    /* Search box filtering */
    var searchInput = elSquadPanel.querySelector("#squadSearch");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        var q = searchInput.value.toLowerCase().trim();
        Array.prototype.forEach.call(elSquadPanel.querySelectorAll(".player,.squad-group-label"), function(el) {
          if (el.classList.contains("squad-group-label")) {
            el.style.display = ""; // reset; hide if all siblings hidden
            return;
          }
          var name = (el.getAttribute("data-name") || "").toLowerCase();
          el.style.display = (!q || name.indexOf(q) !== -1) ? "" : "none";
        });
        // Hide group labels if all players in group are hidden
        var players2 = elSquadPanel.querySelector(".players");
        if (players2) {
          Array.prototype.forEach.call(players2.querySelectorAll(".squad-group-label"), function(lbl) {
            var next = lbl.nextElementSibling;
            var hasVisible = false;
            while (next && !next.classList.contains("squad-group-label")) {
              if (next.style.display !== "none") { hasVisible = true; break; }
              next = next.nextElementSibling;
            }
            lbl.style.display = hasVisible ? "" : "none";
          });
        }
      });
      if (!pendingPick) setTimeout(function(){ searchInput.focus(); }, 50);
    }
    if (draftable === 0) { awaitingPick = false; elHint.textContent = "No open slots for this squad — spin again (free)."; }
    else awaitingPick = true;
    updateControls();
  }

  function pickPlayer(name, pos) {
    if (squad.length >= XI_SIZE || !current || !pos || openOf(pos) <= 0) return;
    if (window.sfx) window.sfx.pick();
    var pl = playerByName(name);
    var pickedR = pl ? pl.r : 80;
    /* Close out the last reroll log entry — record what they kept */
    if (rerollLog.length && rerollLog[rerollLog.length - 1].kept === null) {
      rerollLog[rerollLog.length - 1].kept = pickedR;
    }
    pendingDiscard = null;
    squad.push({ id: nextId++, n: name, p: pl ? pl.p : "MID", r: pickedR, slot: pos, country: current.country, year: current.year });
    current = null; awaitingPick = false; pendingPick = null;
    elSquadPanel.style.display = "none";
    renderXI(); paintPitches(); updateControls();
    elHint.textContent = squad.length < XI_SIZE ? (name + " → " + pos + ". Spin for your next pick.") : "XI complete — enter a competition!";
    if (window.GAFFER_OB) window.GAFFER_OB.playerAdded(squad.length);
  }
  function removePlayer(id) {
    squad = squad.filter(function (p) { return p.id !== id; });
    renderXI(); paintPitches(); updateControls();
  }

  function autoPickCurrent() {
    if (!current) return;
    var list = DATA[current.country].years[current.year];
    var taken = squad.map(function (s) { return s.country + "|" + s.year + "|" + s.n; });
    var best = null, bestPos = null;
    list.forEach(function (pl) {
      if (taken.indexOf(current.country + "|" + current.year + "|" + pl.n) !== -1) return;
      var opts = openEligiblePositions(pl);
      if (!opts.length) return;
      if (!best || pl.r > best.r) { best = pl; bestPos = preferredSlot(pl, opts); }
    });
    if (best) pickPlayer(best.n, bestPos);
  }
  function autoFill() {
    var guard = 0;
    while (squad.length < XI_SIZE && guard < 600) {
      guard++;
      var pairs = poolPairs(), pk = rand(pairs), list = DATA[pk.c].years[pk.y];
      var taken = squad.map(function (s) { return s.country + "|" + s.year + "|" + s.n; });
      // Collect ALL eligible players then pick one at random (avoids always selecting the first)
      var eligible = [];
      list.forEach(function (pl) {
        if (taken.indexOf(pk.c + "|" + pk.y + "|" + pl.n) !== -1) return;
        if ((pl.r || 0) < 75) return;
        var opts = openEligiblePositions(pl);
        if (opts.length) eligible.push({ pl: pl, pos: preferredSlot(pl, opts) });
      });
      if (eligible.length) {
        var pick = eligible[Math.floor(Math.random() * eligible.length)];
        squad.push({ id: nextId++, n: pick.pl.n, p: pick.pl.p, r: pick.pl.r, slot: pick.pos, country: pk.c, year: pk.y });
      }
    }
    current = null; awaitingPick = false; pendingPick = null;
    elSquadPanel.style.display = "none";
    renderXI(); paintPitches(); updateControls();
    elHint.textContent = "Auto-filled your XI — review and enter a competition.";
  }

  // ---- Your XI ----
  function renderXI() {
    var a = assignByLines();
    elXiCount.textContent = squad.length + "/" + XI_SIZE;
    elFormation.textContent = "· " + formation;
    var groups = [{ label: "Goalkeeper", cells: a.gk }];
    a.lines.forEach(function (line, idx) {
      groups.push({ label: idx === 0 ? "Defence" : (idx === a.lines.length - 1 ? "Attack" : "Midfield"), cells: line });
    });
    var html = "";
    groups.forEach(function (g) {
      html += '<div class="line-label">' + g.label + "</div>";
      g.cells.forEach(function (c) {
        if (c.pick) {
          html += '<div class="xi-row"><span class="pos ' + c.line + '">' + c.pos + "</span>" +
            '<span class="info"><span class="pn">' + esc(c.pick.n) + (showRatings ? ' <span class="xi-rate' + ratingTierClass(c.pick.r) + '">' + c.pick.r + "</span>" : "") +
            '</span><span class="meta">' + c.pick.country + " &middot; " + c.pick.year +
            '</span></span></div>';
        } else {
          html += '<div class="xi-row empty"><span class="pos ' + c.line + '">' + c.pos + "</span>" +
            '<span class="info"><span class="pn slot-empty">' + POS_FULL[c.pos] + " — empty</span></span></div>";
        }
      });
    });
    elXiList.innerHTML = html;
    Array.prototype.forEach.call(elXiList.querySelectorAll(".remove"), function (b) {
      b.addEventListener("click", function () { removePlayer(parseInt(b.getAttribute("data-id"), 10)); });
    });

    var full = squad.length >= XI_SIZE;
    var cl = mode === "cl";
    var euro = mode === "euro";
    $("goWorldCup").disabled = !full; $("goWorldCup").hidden = !full || cl;
    $("goWorldCup").textContent = euro ? "Euro Championship with my XI" : "World Cup with my XI";
    $("goCL").disabled     = !full;   $("goCL").hidden       = !full || !cl;
    $("shareBtn").disabled = squad.length < 1;
    $("autoFillBtn").disabled = full;
    elDone.style.display = full ? "block" : "none";
    if (full) {
      elDone.innerHTML = '<span class="done-main">Full ' + formation + ' XI — choose a competition below.</span>' +
        rerollSummaryHTML();
    }

    if (squad.length) {
      var t = userTeamFromSquad(), mgr = currentManager();
      var condBonus = t.condBonus || {};
      var condStr = (condBonus.met && condBonus.atk > 0) ? " · +" + condBonus.atk + " ATK ✓" : "";
      elRatingNote.innerHTML =
        esc(teamDisplayName() + " · " + formation + " · " + mgr.name) +
        (showRatings ? ' · <span class="rn-atk">ATK ' + Math.round(t.atk) + '</span> / <span class="rn-def">DEF ' + Math.round(t.def) + '</span>' + (mgr.ko ? ' · +' + mgr.ko + ' KO' : '') + esc(condStr) : " · ratings hidden") +
        (full ? "" : "<span class='rn-warn'> — 11 players needed to enter</span>") +
        (t.synergy ? '<div class="syn-badge">🏆 Tournament DNA: ' + esc(t.synergy.country + " " + t.synergy.year + " ×" + t.synergy.count) + ' — +' + t.synergy.bonus + ' group stage</div>' : "");
      saveDraft();
      /* Refresh conditional dots on manager style buttons live */
      if (elManagerStyles) renderManagerStyles();
    } else { elRatingNote.innerHTML = ""; clearDraft(); }
  }

  function avgRating() { if (!squad.length) return 80; var s = 0; squad.forEach(function (p) { s += p.r; }); return s / squad.length; }

  /* ── World Cup winners for synergy detection ──────────────────────── */
  var WC_WINNERS = {
    "1930":"Uruguay","1934":"Italy","1938":"Italy","1950":"Uruguay",
    "1954":"West Germany","1958":"Brazil","1962":"Brazil","1966":"England",
    "1970":"Brazil","1974":"West Germany","1978":"Argentina","1982":"Italy",
    "1986":"Argentina","1990":"West Germany","1994":"Brazil","1998":"France",
    "2002":"Brazil","2006":"Italy","2010":"Spain","2014":"Germany",
    "2018":"France","2022":"Argentina"
  };

  /* Returns the strongest synergy group, or null */
  function computeSynergy(sq) {
    var groups = {};
    sq.forEach(function (p) {
      if (!p.country || !p.year) return;
      var key = p.country + "|" + p.year;
      if (!groups[key]) groups[key] = { country: p.country, year: p.year, count: 0 };
      groups[key].count++;
    });
    var best = null;
    Object.keys(groups).forEach(function (k) {
      var g = groups[k];
      if (g.count >= 3 && WC_WINNERS[g.year] === g.country) {
        if (!best || g.count > best.count) best = g;
      }
    });
    if (!best) return null;
    return { country: best.country, year: best.year, count: best.count, bonus: 4 };
  }

  /* Returns conditional ATK/DEF bonus for styles that depend on squad composition */
  function computeConditionalBonus(sq, styleId) {
    if (styleId === "tikitaka") {
      var MID_POS = { CDM: 1, CM: 1, CAM: 1, AM: 1, MID: 1 };
      var mids = sq.filter(function (p) { return MID_POS[p.p]; });
      if (!mids.length) return { atk: 0, def: 0, met: false };
      var avg = mids.reduce(function (s, p) { return s + (p.r || 80); }, 0) / mids.length;
      return avg >= 90 ? { atk: 3, def: 0, met: true, detail: "Mid avg " + Math.round(avg) }
                       : { atk: 0, def: 0, met: false, detail: "Mid avg " + Math.round(avg) + " (need 90)" };
    }
    if (styleId === "routeone") {
      var old = sq.filter(function (p) { return p.year && parseInt(p.year, 10) < 1980; });
      return old.length >= 2 ? { atk: 4, def: 0, met: true, detail: old.length + " pre-1980 players" }
                             : { atk: 0, def: 0, met: false, detail: old.length + " pre-1980 (need 2)" };
    }
    return null;
  }
  function formationTilt(name) {
    var c = formationCounts(name), SCALE = 2;
    return { atk: ((c.FWD - 2) + (c.MID - 4) * 0.5) * SCALE, def: (c.DEF - 4) * SCALE };
  }
  function userTeamFromSquad() {
    var rating = Math.round(avgRating()), tilt = formationTilt(formation), mgr = currentManager();
    var cond   = computeConditionalBonus(squad, mgr.id) || { atk: 0, def: 0, met: false };
    var syn    = computeSynergy(squad);
    return {
      name: teamDisplayName(), flag: "⭐", rating: rating,
      atk: rating + tilt.atk + mgr.atk + cond.atk,
      def: rating + tilt.def + mgr.def + cond.def,
      koBonus: mgr.ko, isUser: true, formation: formation,
      manager: (managerId === "none" ? "No manager" : (managerName ? managerName + " (" + mgr.name + ")" : mgr.name)),
      players: squad.map(function (s) { return { n: s.n, p: s.p, r: s.r }; }),
      groupBonus: syn ? syn.bonus : 0,
      synergy: syn,
      condBonus: cond
    };
  }

  function buildXICanvas() {
    var a = assignByLines();
    var lines = [a.gk].concat(a.lines);
    var CW = 900, CH = 1200, PAD = 48;
    var c = document.createElement("canvas"); c.width = CW; c.height = CH;
    var ctx = c.getContext("2d"); if (!ctx) return null;
    var FS = "system-ui, -apple-system, 'Segoe UI', sans-serif";
    var bg = ctx.createLinearGradient(0, 0, 0, CH);
    bg.addColorStop(0, "#0B1020"); bg.addColorStop(1, "#121830");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, CW, CH);
    var pitchY = 140, pitchH = CH - pitchY - 80;
    var pg = ctx.createLinearGradient(0, pitchY, 0, pitchY + pitchH);
    pg.addColorStop(0, "#0d1f14"); pg.addColorStop(1, "#091510");
    ctx.fillStyle = pg; ctx.fillRect(PAD, pitchY, CW - PAD * 2, pitchH);
    ctx.strokeStyle = "rgba(34,224,200,0.18)"; ctx.lineWidth = 1.5;
    ctx.strokeRect(PAD, pitchY, CW - PAD * 2, pitchH);
    var pbW = (CW - PAD * 2) * 0.56, pbH = pitchH * 0.3, pbX = PAD + (CW - PAD * 2 - pbW) / 2, pbY = pitchY + pitchH - pbH;
    ctx.strokeRect(pbX, pbY, pbW, pbH);
    ctx.textAlign = "center";
    ctx.fillStyle = "#22E0C8"; ctx.font = "700 18px " + FS; ctx.fillText("GAFFER", CW / 2, 38);
    ctx.fillStyle = "#ECF1FF"; ctx.font = "800 32px " + FS; ctx.fillText(teamDisplayName(), CW / 2, 78);
    ctx.fillStyle = "rgba(236,241,255,0.5)"; ctx.font = "500 17px " + FS;
    ctx.fillText(formation + "  ·  " + currentManager().name, CW / 2, 110);
    if (lastSim && lastSim.userTeam && lastSim.userTeam.result) {
      ctx.fillStyle = "#F5B43C"; ctx.font = "700 15px " + FS;
      ctx.fillText(String(lastSim.userTeam.result), CW / 2, 132);
    }
    var lineColors = { GK: "#F5B43C", DEF: "#22E0C8", MID: "#7C5CFC", FWD: "#FF7A59" };
    lines.forEach(function (row, rowIdx) {
      var n = row.length, rowFrac = (rowIdx + 0.6) / (lines.length);
      var y = pitchY + pitchH * (0.95 - rowFrac * 0.88);
      row.forEach(function (cell, colIdx) {
        if (!cell) return;
        var x = PAD + (CW - PAD * 2) * ((colIdx + 0.5) / n);
        var line = rowIdx === 0 ? "GK" : (rowIdx === lines.length - 1 ? "FWD" : (rowIdx <= 1 ? "DEF" : "MID"));
        var col = lineColors[line] || "#ECF1FF";
        ctx.beginPath(); ctx.arc(x, y, 26, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(11,16,32,0.85)"; ctx.fill();
        ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = col; ctx.font = "700 10px " + FS; ctx.textAlign = "center";
        ctx.fillText(cell.pos, x, y - 7);
        if (cell.pick) {
          var name = cell.pick.n.split(" ").pop();
          ctx.fillStyle = "#ECF1FF"; ctx.font = "600 11px " + FS;
          ctx.fillText(name.length > 10 ? name.slice(0, 9) + "." : name, x, y + 6);
          if (showRatings) { ctx.fillStyle = col; ctx.font = "700 9px " + FS; ctx.fillText(cell.pick.r, x, y + 18); }
        }
        ctx.textAlign = "center";
      });
    });
    ctx.fillStyle = "rgba(236,241,255,0.25)"; ctx.font = "500 14px " + FS;
    ctx.fillText("Gaffer", CW / 2, CH - 24);
    return c;
  }

  function shareXIPNG(btn) {
    var c = buildXICanvas(); if (!c) return;
    c.toBlob(function (blob) {
      if (!blob) return;
      var fname = "gaffer.png";
      try {
        var file = new File([blob], fname, { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], title: "My Gaffer XI", text: teamDisplayName() + " · " + formation }).catch(function () {});
          return;
        }
      } catch (e) {}
      var url = URL.createObjectURL(blob), el = document.createElement("a");
      el.href = url; el.download = fname; document.body.appendChild(el); el.click(); el.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      if (btn) { btn.textContent = "Saved!"; setTimeout(function () { btn.textContent = "Share my XI ↗"; }, 1800); }
    }, "image/png");
  }

  function copyXIPNG(btn) {
    if (!navigator.clipboard || !window.ClipboardItem) {
      if (btn) { btn.textContent = "Not supported"; setTimeout(function(){ btn.textContent = "Copy image"; }, 2000); }
      return;
    }
    var c = buildXICanvas(); if (!c) return;
    c.toBlob(function(blob) {
      if (!blob) return;
      try {
        navigator.clipboard.write([new ClipboardItem({"image/png": blob})]).then(function() {
          if (btn) { btn.textContent = "Copied!"; setTimeout(function(){ btn.textContent = "Copy image"; }, 2000); }
        });
      } catch(e) { if (btn) { btn.textContent = "Failed"; setTimeout(function(){ btn.textContent = "Copy image"; }, 2000); } }
    }, "image/png");
  }

  function shareTeam() {
    var a = assignByLines(), lines = [];
    [a.gk].concat(a.lines).forEach(function (grp) {
      grp.forEach(function (c) { if (c.pick) lines.push(c.pos + "  " + c.pick.n + (showRatings ? " (" + c.pick.r + ")" : "") + " — " + c.pick.country + " " + c.pick.year); });
    });
    var mgr = currentManager();
    var text = teamDisplayName() + " (" + formation + ")" + (mgr.id !== "none" ? " · Mgr: " + mgr.name : "") + "\n\n" + lines.join("\n");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { elHint.textContent = "Copied your XI to the clipboard!"; }, function () { window.prompt("Your XI:", text); });
    } else window.prompt("Your XI:", text);
  }

  function renderClFormat() {
    var bar = $("clFormatBar"); if (!bar) return;
    bar.innerHTML = CL_FORMATS.map(function (f) {
      return '<button class="formation-opt' + (f.id === clFormat ? " active" : "") + '" data-cl="' + f.id + '">' + f.name + "</button>";
    }).join("");
    Array.prototype.forEach.call(bar.querySelectorAll(".formation-opt"), function (b) {
      b.addEventListener("click", function () { clFormat = b.getAttribute("data-cl"); renderClFormat(); });
    });
    var f = CL_FORMATS.filter(function (x) { return x.id === clFormat; })[0];
    $("clFormatDesc").textContent = f ? f.desc : "";
  }
  function setMode(m) {
    mode = m;
    clFormat = "swiss"; /* always use New Swiss format */
    document.body.classList.toggle("mode-cl", m === "cl");
    DATA = m === "cl" ? window.CL_DATA : m === "euro" ? (window.EURO_DATA || window.WORLD_CUP_DATA) : window.WORLD_CUP_DATA;
    COUNTRIES = Object.keys(DATA);
    ALL_YEARS = (function () { var s = {}; COUNTRIES.forEach(function (c) { Object.keys(DATA[c].years).forEach(function (y) { s[y] = 1; }); }); return Object.keys(s).sort(); })();
    minIdx = 0; maxIdx = ALL_YEARS.length - 1;
    selectedYears = {}; ALL_YEARS.forEach(function (y) { selectedYears[y] = true; });
    continent = "all";
    squad = []; current = null; pendingPick = null; awaitingPick = false;
    /* Reset manager so player can spin fresh each time they enter a mode */
    managerId = "none"; managerName = ""; managerSpun = false;
    if (elManagerSpin) { elManagerSpin.disabled = false; elManagerSpin.textContent = "Spin"; }
    var cl = (m === "cl");
    var euro = (m === "euro");
    var cw = $("continentWrap"); if (cw) cw.style.display = (cl || euro) ? "none" : "block";
    var pl = $("poolLabel"); if (pl) pl.textContent = cl ? "Player pool — Champions League seasons" : euro ? "Player pool — Euro tournament eras" : "Player pool — World Cup eras";
    var cl2 = $("countryLabel"); if (cl2) cl2.textContent = cl ? "Club" : "Nation";
    renderManager(); renderManagerStyles(); renderFormationBar(); renderRatingsToggle(); renderEra();
    renderContinent(); renderDifficultyBar();
    paintPitches(); renderXI(); updateControls(); showView("setup");
  }

  function startDraft() {
    showView("draft");
    if (window.GAFFER_OB) window.GAFFER_OB.onEnterDraft();
    current = null; awaitingPick = false; spinning = false;
    rerollsLeft = diffRerolls(); rerollsMax = rerollsLeft;
    rerollLog = []; pendingDiscard = null;
    elSquadPanel.style.display = "none";
    var restored = loadDraft();
    elHint.textContent = restored ? "Draft restored from your last session." : "";
    elCountryStrip.innerHTML = countryItemHTML(rand(poolPairs().map(function (p) { return p.c; })));
    elYearStrip.innerHTML = yearItemHTML(poolPairs()[0].y);
    paintPitches(); renderXI(); updateControls();
  }
  function newGame() {
    clearTimeout(revealTimer);
    squad = []; current = null; awaitingPick = false; pendingPick = null; spinning = false;
    teamName = ""; managerId = "none"; managerName = ""; managerSpun = false; formation = "4-3-3"; showRatings = true; difficulty = "Medium";
    rerollLog = []; rerollsMax = 0; pendingDiscard = null;
    elManagerSpin.disabled = false; elManagerSpin.textContent = "Spin";
    minIdx = 0; maxIdx = ALL_YEARS.length - 1; continent = "all";
    rerollsLeft = diffRerolls();
    elTeamName.value = ""; elSquadPanel.style.display = "none"; elHint.textContent = "";
    renderManager(); renderManagerStyles(); renderFormationBar(); renderRatingsToggle(); renderEra(); renderContinent(); renderDifficultyBar();
    paintPitches(); renderXI(); updateControls(); showView("home");
  }

  // ================= RESULTS =================
  function teamCell(t) { return '<span class="tname' + (t.isUser ? " me" : "") + '">' + esc(t.name) + "</span>"; }
  function groupCardHTML(g) {
    var html = '<div class="group-card"><div class="group-name">Group ' + g.name + "</div>";
    html += '<table class="mini"><thead><tr><th></th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr></thead><tbody>';
    g.table.forEach(function (r, i) {
      var cls = (i < 2 ? "qual" : (i === 2 ? "third" : "")) + (r.team.isUser ? " me-row" : "");
      html += '<tr class="' + cls + '"><td class="tcell">' + teamCell(r.team) + "</td><td>" + r.P + "</td><td>" + r.W + "</td><td>" + r.D + "</td><td>" + r.L + "</td><td>" + (r.GD > 0 ? "+" : "") + r.GD + "</td><td><b>" + r.Pts + "</b></td></tr>";
    });
    return html + "</tbody></table></div>";
  }
  function renderGroups(groups) {
    return '<div class="grid-groups">' + groups.map(groupCardHTML).join("") + "</div>";
  }
  function renderBracket(rounds) {
    var html = '<div class="bracket">';
    rounds.forEach(function (rd, rdIdx) {
      html += '<div class="round"><div class="round-name">' + rd.name + "</div>";
      rd.ties.forEach(function (t) {
        var aw = t.winner === t.a, bw = t.winner === t.b;
        var userTie = (t.a.isUser || t.b.isUser) ? " user-tie" : "";
        var pens = t.res.pens ? ' <span class="pens">(pens ' + t.res.pens[0] + "–" + t.res.pens[1] + ")</span>" : "";
        html += '<div class="tie' + userTie + '"><div class="side ' + (aw ? "win" : "") + '">' + teamCell(t.a) + "<b>" + t.res.a + "</b></div>" +
          '<div class="side ' + (bw ? "win" : "") + '">' + teamCell(t.b) + "<b>" + t.res.b + "</b></div>" + pens + "</div>";
      });
      if (rdIdx === rounds.length - 1 && rd.ties.length === 1 && rd.ties[0].winner) {
        var champ = rd.ties[0].winner;
        html += '<div class="bracket-champion">' + (champ.flag ? esc(champ.flag) + " " : "") + "<b>" + esc(champ.name) + "</b></div>";
      }
      html += "</div>";
    });
    return html + "</div>";
  }
  function ordinal(n) { var s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }
  function leagueTableHTML(result) {
    var html = '<div class="table-scroll"><table class="league"><thead><tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr></thead><tbody>';
    result.table.forEach(function (r, i) {
      var cls = r.team.isUser ? "me-row" : (i === 0 ? "top-row" : "");
      html += '<tr class="' + cls + '"><td>' + (i + 1) + "</td><td class=\"tcell\">" + teamCell(r.team) + "</td><td>" + r.P + "</td><td>" + r.W + "</td><td>" + r.D + "</td><td>" + r.L + "</td><td>" + r.GF + "</td><td>" + r.GA + "</td><td>" + (r.GD > 0 ? "+" : "") + r.GD + "</td><td><b>" + r.Pts + "</b></td></tr>";
    });
    return html + "</tbody></table></div>";
  }
  function renderLeague(result, label) {
    var html = '<h2 class="res-title">' + label + "</h2>";
    html += '<div class="champion">Winners: <b>' + esc(result.table[0].team.name) + "</b> · " + result.totalMatches + " matches played</div>";
    return html + leagueTableHTML(result);
  }
  function renderWorldCup(result, label) {
    var champ = result.champion;
    var html = '<h2 class="res-title">' + label + "</h2>";
    html += '<div class="champion">Champions: <b>' + (champ.flag ? esc(champ.flag) + " " : "") + esc(champ.name) + "</b></div>";
    html += '<h3 class="sec">Knockouts</h3>' + renderBracket(result.rounds);
    html += '<h3 class="sec">Group stage</h3>' + renderGroups(result.groups);
    return html;
  }
  function scorerLines(events) {
    if (!events || !events.length) return "";
    return '<div class="mscorers">' + events.map(function (e) {
      return '<span class="goal">' + esc(e.scorer) + (e.assist ? ' <span class="assist">↳ ' + esc(e.assist) + "</span>" : "") + "</span>";
    }).join("") + "</div>";
  }
  function matchCardHTML(m, teamName) {
    var pens = m.pens ? ' <span class="pens">(pens ' + m.pens[0] + "–" + m.pens[1] + ")</span>" : "";
    return '<div class="mcard ' + m.result + '"><div class="mcard-top"><span class="mround">' + esc(m.round) + "</span>" +
      '<span class="pill ' + m.result + '">' + m.result + "</span></div>" +
      '<div class="mscore"><span class="me">' + esc(teamName) + "</span> <b>" + m.gf + "–" + m.ga + "</b> " +
      '<span class="oppname">' + esc(m.opp.name) + "</span>" + pens + "</div>" +
      scorerLines(m.events) + (m.cleanSheet ? '<div class="mclean">Clean sheet</div>' : "") + "</div>";
  }
  function statRows(list, key, max) {
    if (!list.length) return '<div class="stat-empty">—</div>';
    return list.slice(0, max).map(function (x) {
      return '<div class="stat-row"><span class="sp ' + (LINE_OF[x.p] || x.p || "") + '">' + (x.p || "") + "</span><span class=\"sn\">" + esc(x.n) + "</span><span class=\"sv\">" + x[key] + "</span></div>";
    }).join("");
  }
  function statsSummaryHTML(s) {
    return '<div class="stats-summary"><h3 class="sec">Summary</h3><div class="stat-grid">' +
      '<div class="stat-pill">Played <b>' + s.games + "</b></div>" +
      '<div class="stat-pill">Record <b>' + s.w + "-" + s.d + "-" + s.l + "</b></div>" +
      '<div class="stat-pill">Goals <b>' + s.gf + "</b></div>" +
      '<div class="stat-pill">Conceded <b>' + s.ga + "</b></div>" +
      '<div class="stat-pill">Clean sheets <b>' + s.cleanSheets + "</b></div></div>" +
      '<div class="stat-cols"><div class="stat-col"><div class="stat-h">Top scorers</div>' + statRows(s.scorers, "g", 5) + "</div>" +
      '<div class="stat-col"><div class="stat-h">Top assists</div>' + statRows(s.assisters, "a", 5) + "</div></div></div>";
  }
  /* ═══════════════════════════════════════════════════════════════════
     MATCH NARRATIVE + WHAT-IF ENGINE
     ═══════════════════════════════════════════════════════════════════ */

  /* Picks one string from an array using a numeric seed (not random — stable per call) */
  function pick(arr, seed) { return arr[Math.abs(seed || 0) % arr.length]; }

  /* Short last-name helper */
  function lastName(full) {
    if (!full) return "—";
    var parts = full.trim().split(/\s+/);
    return parts[parts.length - 1];
  }

  /* Generate a 4–5 sentence tournament narrative from real match data */
  function matchNarrativeHTML(userMatches, userStats, userTeam, compType) {
    if (!userMatches || !userMatches.length || !userStats) return "";
    var s = userStats;
    var topScorer   = s.scorers[0]   || null;
    var topAssister = s.assisters[0] || null;
    var keeper      = s.keeper       || null;

    /* Classify group stage */
    var groupM = userMatches.filter(function(m){ return m.round.indexOf("Group") === 0 || m.round === "League phase" || m.round === "Matchday"; });
    var koM    = userMatches.filter(function(m){ return m.round.indexOf("Group") !== 0 && m.round !== "League phase" && m.round !== "Matchday"; });
    var groupW = groupM.filter(function(m){ return m.result === "W"; }).length;
    var groupGF = groupM.reduce(function(acc,m){ return acc+m.gf; }, 0);
    var groupGA = groupM.reduce(function(acc,m){ return acc+m.ga; }, 0);

    /* Key KO moments */
    var finalMatch = koM.length ? koM[koM.length-1] : null;
    var biggestWin = null, biggestMargin = 0;
    koM.forEach(function(m) { var d = m.gf - m.ga; if (m.result === "W" && d > biggestMargin) { biggestMargin = d; biggestWin = m; } });
    var penMatch = koM.filter(function(m){ return m.pens; })[0] || null;
    var cleanSheetKO = koM.filter(function(m){ return m.cleanSheet && m.result === "W"; })[0] || null;

    var lines = [];

    /* ── Line 1: Group stage tone ── */
    var gLabel = compType === "league" ? "season" : "group stage";
    if (groupM.length) {
      var groupDesc;
      if (groupW === groupM.length)      groupDesc = "dominant — " + groupW + " wins from " + groupM.length + " with " + groupGF + " goals scored";
      else if (groupW >= groupM.length * 0.6) groupDesc = "solid — " + groupW + " wins, " + groupGF + " goals and only " + groupGA + " conceded";
      else if (groupW >= 1)              groupDesc = "patchy — " + groupW + " wins from " + groupM.length + ", but enough to advance";
      else                               groupDesc = "brutal — winless in " + groupM.length + " games, outscored " + groupGF + "–" + groupGA;
      lines.push("The " + gLabel + " was " + groupDesc + ".");
    }

    /* ── Line 2: Top scorer ── */
    if (topScorer && topScorer.g >= 1) {
      var scoreVerbs = ["lit up the tournament", "led the line brilliantly", "was the standout attacker", "carried the attack all campaign"];
      var contrib = esc(lastName(topScorer.n)) + " " + pick(scoreVerbs, topScorer.g) + " with <strong>" + topScorer.g + " goal" + (topScorer.g !== 1 ? "s" : "") + "</strong>";
      if (topAssister && topAssister.n !== topScorer.n && topAssister.a >= 2) {
        contrib += ", with " + esc(lastName(topAssister.n)) + " pulling the strings behind (" + topAssister.a + " assists)";
      }
      lines.push(contrib + ".");
    } else if (topAssister && topAssister.a >= 2) {
      lines.push(esc(lastName(topAssister.n)) + " was the creative hub, registering <strong>" + topAssister.a + " assists</strong> across the campaign.");
    }

    /* ── Line 3: Key KO moment (most dramatic) ── */
    if (penMatch) {
      var penRes = penMatch.result === "W" ? "survived" : "were knocked out";
      lines.push("The " + esc(penMatch.round.toLowerCase()) + " against <strong>" + esc(penMatch.opp.name) + "</strong> went to penalties — they " + penRes + " <strong>" + penMatch.pens[0] + "–" + penMatch.pens[1] + "</strong> in the shootout.");
    } else if (biggestWin) {
      var dominateAdjs = ["clinical", "ruthless", "brilliant", "stunning"];
      lines.push("A " + pick(dominateAdjs, biggestMargin) + " <strong>" + biggestWin.gf + "–" + biggestWin.ga + "</strong> win over <strong>" + esc(biggestWin.opp.name) + "</strong> in the " + esc(biggestWin.round.toLowerCase()) + " was the standout result.");
    } else if (koM.length && koM[koM.length-1].result === "L") {
      var lm = koM[koM.length-1];
      lines.push("The run ended in the " + esc(lm.round.toLowerCase()) + " — a <strong>" + lm.gf + "–" + lm.ga + "</strong> loss to <strong>" + esc(lm.opp.name) + "</strong> that could have gone either way.");
    }

    /* ── Line 4: Defensive story ── */
    if (keeper && s.cleanSheets >= 2) {
      var keepAdjs = ["commanding", "composed", "exceptional", "imperious"];
      lines.push(esc(lastName(keeper.n)) + " was " + pick(keepAdjs, s.cleanSheets) + " in goal — <strong>" + s.cleanSheets + " clean sheet" + (s.cleanSheets !== 1 ? "s" : "") + "</strong> across the campaign.");
    } else if (s.ga > s.gf) {
      lines.push("Defensively it was a struggle — <strong>" + s.ga + "</strong> goals conceded to just <strong>" + s.gf + "</strong> scored told the real story.");
    } else if (s.ga === 0 && s.games >= 3) {
      lines.push((keeper ? esc(lastName(keeper.n)) + "-anchored — a" : "A") + " perfect <strong>" + s.games + "-game clean sheet run</strong>. A rare achievement.");
    }

    /* ── Line 5: Final verdict ── */
    if (finalMatch && compType !== "league") {
      if (finalMatch.round === "Final") {
        if (finalMatch.result === "W") {
          lines.push("The final against <strong>" + esc(finalMatch.opp.name) + "</strong> ended <strong>" + finalMatch.gf + "–" + finalMatch.ga + "</strong> — the trophy was earned, not gifted.");
        } else {
          lines.push("The final against <strong>" + esc(finalMatch.opp.name) + "</strong> — a <strong>" + finalMatch.gf + "–" + finalMatch.ga + "</strong> loss — will sting. So close.");
        }
      } else if (finalMatch.result === "W" && koM.length >= 3) {
        lines.push("A squad rated <strong>" + (userTeam ? userTeam.rating : "?") + "</strong> making it to the " + esc(finalMatch.round.toLowerCase()) + ". Overachievement of the highest order.");
      }
    }

    if (!lines.length) return "";
    return '<div class="match-narrative">' +
      '<div class="mn-head">📋 Match report</div>' +
      '<div class="mn-body">' +
        lines.map(function(l) { return '<p class="mn-line">' + l + '</p>'; }).join("") +
      '</div>' +
    '</div>';
  }

  /* ── What If engine ────────────────────────────────────────────────── */

  /* Search DATA for the best available player at position p, not already in squad */
  function findBestAlternative(weakPlayer) {
    var takenNames = {};
    squad.forEach(function(s) { takenNames[s.n] = true; });
    /* Position line mapping — look for same or adjacent position */
    var LINE_OF2 = { GK:"GK", LB:"DEF", CB:"DEF", RB:"DEF", LWB:"DEF", RWB:"DEF",
                     CDM:"MID", CM:"MID", CAM:"MID", AM:"MID",
                     LW:"FWD", RW:"FWD", ST:"FWD", CF:"FWD" };
    var targetLine = LINE_OF2[weakPlayer.p] || "MID";
    var best = null;
    try {
      var countries = Object.keys(DATA);
      for (var ci = 0; ci < countries.length; ci++) {
        var c = countries[ci];
        var years = Object.keys(DATA[c].years);
        for (var yi = 0; yi < years.length; yi++) {
          var players = DATA[c].years[years[yi]];
          for (var pi = 0; pi < players.length; pi++) {
            var pl = players[pi];
            if (takenNames[pl.n]) continue;
            var plLine = LINE_OF2[pl.p] || "MID";
            if (plLine !== targetLine) continue;
            if (pl.r <= weakPlayer.r) continue;
            if (!best || pl.r > best.r) {
              best = { n: pl.n, r: pl.r, p: pl.p, country: c, year: years[yi] };
            }
          }
        }
      }
    } catch(e) {}
    return best;
  }

  function whatIfHTML(userTeam, scoreObj) {
    if (!squad.length || !scoreObj) return "";
    /* Find the weakest outfield player (or any player) */
    var outfield = squad.filter(function(p){ return p.p !== "GK"; });
    var pool = outfield.length ? outfield : squad;
    pool = pool.slice().sort(function(a,b){ return a.r - b.r; });
    var weakest = pool[0];
    if (!weakest) return "";

    var alt = findBestAlternative(weakest);
    if (!alt || alt.r - weakest.r < 2) return ""; /* Gap too small to be interesting */

    var ratingGap = alt.r - weakest.r;
    /* Rough score estimate: each +1 ATK ≈ +0.3 extra goals per game; each extra win ≈ +80-150 pts */
    var scoreGain = Math.round(ratingGap * 14 + Math.random() * ratingGap * 6);
    scoreGain = Math.round(scoreGain / 10) * 10; /* Round to nearest 10 for credibility */

    return '<div class="whatif-card">' +
      '<div class="wi-head">💭 What if?</div>' +
      '<div class="wi-body">' +
        'If you\'d picked <strong>' + esc(alt.n) + '</strong> (' + alt.country + ' ' + alt.year + ', <span class="wi-alt-r">' + alt.r + '</span>) ' +
        'over <strong>' + esc(weakest.n) + '</strong> (<span class="wi-weak-r">' + weakest.r + '</span>), ' +
        'your score would have been approximately <strong>+' + scoreGain + ' pts</strong> higher.' +
      '</div>' +
      '<div class="wi-footer">Replay and try it →</div>' +
    '</div>';
  }

  function renderWorldCupUser(result, label) {
    var groupMatches = result.userMatches.filter(function (m) { return m.round.indexOf("Group") === 0; });
    var koMatches = result.userMatches.filter(function (m) { return m.round.indexOf("Group") !== 0; });
    var userGroup = null;
    result.groups.forEach(function (g) { if (g.table.some(function (r) { return r.team.isUser; })) userGroup = g; });

    var html = '<h2 class="res-title">' + label + '</h2><div class="champion big">' + result.userResult + "</div>";
    html += statsSummaryHTML(result.userStats);

    // ---- Part 1: Group stage ----
    html += '<h3 class="sec">① Group stage</h3>';
    if (userGroup) html += '<div class="grid-groups">' + groupCardHTML(userGroup) + "</div>";
    html += '<div class="journey">' + groupMatches.map(function (m) { return matchCardHTML(m, result.teamName); }).join("") + "</div>";

    // ---- Part 2: Knockouts ----
    html += '<h3 class="sec">② Knockouts</h3>';
    if (koMatches.length) {
      html += '<div class="journey">' + koMatches.map(function (m) { return matchCardHTML(m, result.teamName); }).join("") + "</div>";
    } else {
      html += '<p class="legend">Your run ended in the group stage.</p>';
    }
    html += '<h4 class="sub-sec">Full bracket</h4><p class="legend">All knockout results — your team highlighted in gold.</p>' + renderBracket(result.rounds);

    // ---- All groups (standings only) ----
    html += '<h3 class="sec">All groups</h3><p class="legend">Final standings — individual match scores hidden.</p>' + renderGroups(result.groups);
    return html;
  }
  function renderLeagueUser(result, label) {
    var ur = result.userRow;
    var html = '<h2 class="res-title">' + label + '</h2><div class="champion big">' + esc(ur.team.name) + " finished <b>" + ordinal(result.userPos) + "</b> of " + result.table.length + " &middot; " + ur.Pts + " pts</div>";
    html += statsSummaryHTML(result.userStats);
    html += '<h3 class="sec">Your games <span class="legend-note">(' + result.userMatches.length + " shown · other " + (result.totalMatches - result.userMatches.length) + " simulated in the background)</span></h3>";
    html += '<div class="journey">' + result.userMatches.map(function (m) { return matchCardHTML(m, result.teamName); }).join("") + "</div>";
    html += '<button class="btn-ghost" id="toggleTable" data-show="Show full ' + result.table.length + '-team table">Show full ' + result.table.length + '-team table</button>';
    html += '<div id="fullTableWrap" style="display:none;margin-top:14px;">' + leagueTableHTML(result) + "</div>";
    return html;
  }
  function wireResults() {
    var tg = document.getElementById("toggleTable");
    if (tg) tg.addEventListener("click", function () {
      var w = document.getElementById("fullTableWrap"), shown = w.style.display !== "none";
      w.style.display = shown ? "none" : "block";
      tg.innerHTML = shown ? tg.getAttribute("data-show") : "Hide";
    });
    var btmNew = document.getElementById("btmNewGame");
    if (btmNew) btmNew.addEventListener("click", newGame);
    var btmHome = document.getElementById("btmGoHome");
    if (btmHome) btmHome.addEventListener("click", function () { showView("home"); });
    var btmBoard = document.getElementById("btmBoard");
    if (btmBoard) btmBoard.addEventListener("click", function () { renderBoard(); showView("board"); });
    var shareXIBtn = document.getElementById("shareXIBtn");
    if (shareXIBtn) shareXIBtn.addEventListener("click", function () { shareXIPNG(this); });
    var copyImgBtn = document.getElementById("copyImgBtn");
    if (copyImgBtn) copyImgBtn.addEventListener("click", function () { copyXIPNG(this); });
    var boardBtn = document.getElementById("boardBtn");
    if (boardBtn) boardBtn.addEventListener("click", function () { renderBoard(); showView("board"); });
    var btmNewGame2 = document.getElementById("btmNewGame");
    if (btmNewGame2) btmNewGame2.addEventListener("click", newGame);
    /* What-if "Replay" link */
    var wiFooter = document.querySelector(".wi-footer");
    if (wiFooter) wiFooter.addEventListener("click", newGame);
    animateRankReveal();
    wireNextStep();
  }

  // ---- scoring + leaderboards (only leaderboards persist) ----
  function tallyScore(parts) {
    var t = 0; parts.forEach(function (p) { t += p.value; });
    return { score: Math.max(0, Math.round(t)), parts: parts };
  }
  function wcScore(wc) {
    var s = wc.userStats;
    var base = { "Eliminated in the Group stage": 100, "Out in the Round of 32": 220, "Out in the Round of 16": 380, "Out in the Quarter-finals": 560, "Semi-finalists": 820, "Runners-up": 1100, "Champions!": 1600,
      "Out in the league phase": 100, "Out in the group stage": 100, "Out in the Knockout playoff": 170, "Champions of Europe!": 1600 };
    return tallyScore([
      { label: wc.userResult, value: base[wc.userResult] || 100 },
      { label: s.gf + " goals × 10", value: s.gf * 10 },
      { label: s.cleanSheets + " clean sheets × 25", value: s.cleanSheets * 25 },
      { label: s.w + " wins × 30", value: s.w * 30 },
      { label: s.ga + " conceded × −5", value: -s.ga * 5 }
    ]);
  }
  function leagueScore(lg) {
    var ur = lg.userRow, s = lg.userStats;
    var tableSize = (lg.table && lg.table.length) || 48;
    return tallyScore([
      { label: "Finished " + ordinal(lg.userPos) + " (" + (tableSize + 1) + "−pos) × 30", value: ((tableSize + 1) - lg.userPos) * 30 },
      { label: ur.Pts + " points × 4", value: ur.Pts * 4 },
      { label: "Goal diff " + (ur.GD > 0 ? "+" : "") + ur.GD + " × 3", value: ur.GD * 3 },
      { label: s.cleanSheets + " clean sheets × 20", value: s.cleanSheets * 20 },
      { label: s.gf + " goals × 4", value: s.gf * 4 }
    ]);
  }
  function shareCardHTML(sc, resultLabel, competitionLabel) {
    var a = assignByLines();
    var allRows = [a.gk].concat(a.lines);
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var now = new Date(), dateStr = months[now.getMonth()] + " " + now.getDate();
    var gridRows = allRows.map(function(row) {
      return '<div class="f-row">' + row.map(function(cell) {
        var pick = cell && cell.pick;
        var isGK = cell && cell.pos === "GK";
        var isGoat = pick && pick.r >= 97;
        var cls = "f-player" + (isGK ? " gk" : "") + (isGoat ? " goat" : "");
        var lastName = pick ? pick.n.split(" ").pop() : "—";
        if (lastName.length > 8) lastName = lastName.slice(0, 7) + ".";
        var flagYear = pick ? (pick.country + " '" + String(pick.year || "").slice(-2)) : "";
        return '<div class="' + cls + '">' +
          '<div class="f-rating">' + (pick ? pick.r : "") + '</div>' +
          '<div class="f-name">' + esc(lastName) + '</div>' +
          '<div class="f-year">' + esc(flagYear) + '</div>' +
          '</div>';
      }).join("") + '</div>';
    }).join("");
    var mgr = currentManager();
    var mgrTxt = managerId !== "none" ? " · " + esc(mgr.name) : "";
    return '<div class="share-card" id="shareCard">' +
      '<div class="sc-header">' +
        '<div class="sc-logo">GAFFER</div>' +
        '<div class="sc-date">' + esc(dateStr) + ' · ' + esc(competitionLabel) + '</div>' +
      '</div>' +
      '<div class="sc-title">' + esc(teamDisplayName()) + '\'s XI</div>' +
      '<div class="sc-sub">' + esc(formation) + mgrTxt + '</div>' +
      '<div class="formation-grid">' + gridRows + '</div>' +
      '<div class="sc-result">' +
        '<div><div class="sc-rt">Score</div><div class="sc-rv">' + (sc ? sc.score : 0) + ' pts</div></div>' +
        '<div style="text-align:right"><div class="sc-rt">Result</div><div class="sc-rrank">' + esc(resultLabel) + '</div></div>' +
      '</div>' +
      '<div class="sc-share-row">' +
        '<button class="sc-btn sc-btn-primary" id="shareXIBtn">Share my XI ↗</button>' +
        '<button class="sc-btn sc-btn-sec" id="copyImgBtn">Copy image</button>' +
        '<button class="sc-btn sc-btn-sec" id="btmNewGame">New game</button>' +
      '</div>' +
    '</div>';
  }

  function scoreBannerHTML(sc, result) {
    var rows = sc.parts.map(function (p) {
      return '<div class="sb-row"><span>' + esc(p.label) + '</span><span class="' + (p.value < 0 ? "neg" : "pos") + '">' +
        (p.value >= 0 ? "+" : "") + p.value + "</span></div>";
    }).join("");
    return '<div class="score-banner"><div class="sb-top">Total score <b>' + sc.score + "</b> <span>· " + esc(result) +
      " · saved to leaderboard</span></div><div class=\"sb-break\"><div class=\"sb-break-h\">How it was scored</div>" + rows + "</div></div>";
  }
  function loadBoard() { try { return JSON.parse(localStorage.getItem(LB_KEY) || "[]"); } catch (e) { return []; } }
  function saveBoard(a) { try { localStorage.setItem(LB_KEY, JSON.stringify(a)); } catch (e) {} }

  /* ── Username gate ──────────────────────────────────────────────── */
  var UN_KEY = "gaffer_username";
  function getUsername() { try { return (localStorage.getItem(UN_KEY) || "").trim(); } catch(e){ return ""; } }
  function saveUsername(n) { try { localStorage.setItem(UN_KEY, n.trim()); } catch(e){} }

  function showUsernameModal(onSave) {
    var existing = document.getElementById("usernameModal");
    if (existing) existing.remove();
    var modal = document.createElement("div");
    modal.id = "usernameModal";
    modal.className = "um-overlay";
    modal.innerHTML =
      '<div class="um-card">' +
        '<div class="um-title">Choose your username</div>' +
        '<p class="um-sub">Required to save scores to the leaderboard. Set once, stays forever.</p>' +
        '<input class="um-input" id="umInput" type="text" maxlength="20" placeholder="Your name…" autocomplete="off" />' +
        '<button class="btn-primary um-save" id="umSave">Save &amp; continue</button>' +
        '<button class="um-skip btn-ghost" id="umSkip">Skip (score won\'t be saved)</button>' +
      '</div>';
    document.body.appendChild(modal);
    var inp = document.getElementById("umInput");
    var saveBtn = document.getElementById("umSave");
    var skipBtn = document.getElementById("umSkip");
    inp.focus();
    function doSave() {
      var n = inp.value.trim();
      if (!n) { inp.classList.add("um-shake"); setTimeout(function(){ inp.classList.remove("um-shake"); }, 500); return; }
      saveUsername(n);
      modal.remove();
      onSave(n);
    }
    saveBtn.addEventListener("click", doSave);
    inp.addEventListener("keydown", function(e){ if (e.key === "Enter") doSave(); });
    skipBtn.addEventListener("click", function(){ modal.remove(); });
  }

  function addScore(e) {
    var un = getUsername();
    if (!un) {
      showUsernameModal(function(name) {
        e.username = name;
        var a = loadBoard(); a.push(e); saveBoard(a);
        renderBoard(); /* refresh if board is visible */
      });
      return;
    }
    e.username = un;
    var a = loadBoard(); a.push(e); saveBoard(a);
  }
  function sameDay(a, b) { return new Date(a).toDateString() === new Date(b).toDateString(); }

  /* ── Results: rank calculation ──────────────────────────────────── */
  function getUserRank(score) {
    var all = loadBoard(), rank = 1;
    all.forEach(function(e) { if ((e.score||0) > score) rank++; });
    return rank;
  }
  function rankRevealHTML(score) {
    var rank = getUserRank(score);
    var rankLabel = rank === 1 ? "🥇 #1 on your leaderboard!" : rank <= 3 ? "🏆 Top 3" : "#" + rank + " on your board";
    return '<div class="rank-reveal" id="rankReveal">' +
      '<div class="rank-reveal-inner">' +
        '<div class="rank-calc" id="rankCalc">Calculating your rank…</div>' +
        '<div class="rank-num" id="rankNum" style="display:none">' + rankLabel + '</div>' +
      '</div>' +
    '</div>';
  }
  function animateRankReveal() {
    var calc = document.getElementById("rankCalc");
    var num  = document.getElementById("rankNum");
    if (!calc || !num) return;
    setTimeout(function() {
      calc.classList.add("rank-calc-fade");
      setTimeout(function() {
        calc.style.display = "none";
        num.style.display = "";
        num.classList.add("rank-num-pop");
      }, 500);
    }, 1200);
  }

  /* ── Results: manager verdict ───────────────────────────────────── */
  function managerVerdictHTML(userStats, compLabel, teamObj) {
    var mgr = currentManager();
    if (!mgr || mgr.id === "none") return "";
    var name = managerName || mgr.name;
    var lines = [];

    /* Conditional styles */
    if (mgr.id === "tikitaka" && teamObj && teamObj.condBonus) {
      if (teamObj.condBonus.met) lines.push("<strong>Tiki-Taka unlocked</strong> — " + esc(teamObj.condBonus.detail || "Mid avg ≥ 90") + " gave a <strong>+3 ATK</strong> boost that turned possession into goals.");
      else lines.push("Tiki-Taka <em>wasn't unlocked</em> — " + esc(teamObj.condBonus.detail || "midfield didn't reach 90 avg") + ". Bring better mids next time.");
    } else if (mgr.id === "routeone" && teamObj && teamObj.condBonus) {
      if (teamObj.condBonus.met) lines.push("<strong>Route One unlocked</strong> — " + esc(teamObj.condBonus.detail || "2+ pre-1980 players") + " powered a brutal <strong>+4 ATK</strong> old-school surge.");
      else lines.push("Route One <em>wasn't active</em> — " + esc(teamObj.condBonus.detail || "not enough pre-1980 players") + ". Draft more legends from the 70s.");
    } else {
      if (mgr.atk !== 0 && userStats) {
        var gf = userStats.gf || 0;
        var atkEst = Math.round(Math.abs(mgr.atk) / 2);
        if (mgr.atk > 0 && gf > 0) lines.push(name + "'s <strong>+" + mgr.atk + " ATK</strong> bonus translated to roughly <strong>" + atkEst + " extra goal" + (atkEst !== 1 ? "s" : "") + "</strong> across the campaign.");
        if (mgr.atk < 0) lines.push("The defensive style cost around " + atkEst + " goal" + (atkEst !== 1 ? "s" : "") + " — but the backline more than compensated.");
      }
      if (mgr.def !== 0 && userStats) {
        var ga = userStats.ga || 0;
        var defEst = Math.round(Math.abs(mgr.def) / 2);
        if (mgr.def > 0) lines.push("The <strong>+" + mgr.def + " DEF</strong> style kept the backline organised — saving roughly " + defEst + " goal" + (defEst !== 1 ? "s" : "") + " conceded.");
      }
      if (mgr.ko > 0) lines.push("The <strong>+" + mgr.ko + " KO</strong> tournament bonus gave a decisive edge in every knockout tie.");
    }

    /* Synergy line */
    var syn = teamObj && teamObj.synergy;
    if (syn) {
      lines.push('🏆 <strong>Tournament DNA</strong> — ' + esc(syn.country + " " + syn.year + " ×" + syn.count) + ' added <strong>+' + syn.bonus + '</strong> to group stage ATK & DEF.');
    }

    if (!lines.length) return "";
    return '<div class="manager-verdict">' +
      '<div class="mv-head">⚙️ Manager insight · ' + esc(name) + '</div>' +
      '<div class="mv-body">' + lines.join("<br>") + '</div>' +
    '</div>';
  }

  /* ── Results: next-step CTAs ────────────────────────────────────── */
  function nextStepCTAsHTML(currentMode, result) {
    var btns = [];
    // Harder difficulty
    if (difficulty !== "Legend") {
      var diffOrder = ["Easy","Medium","Hard","Legend"];
      var dIdx = diffOrder.indexOf(difficulty);
      var harder = dIdx >= 0 && dIdx < diffOrder.length - 1 ? diffOrder[dIdx + 1] : null;
      if (harder) btns.push('<button class="next-cta-btn" id="nsHarder">Try ' + harder + ' →</button>');
    }
    // Cross-sell other mode
    if (currentMode === "wc" || currentMode === "euro") {
      btns.push('<button class="next-cta-btn next-cta-sec" id="nsCL">Play Champions League →</button>');
    } else if (currentMode === "cl") {
      btns.push('<button class="next-cta-btn next-cta-sec" id="nsWC">Play World Cup →</button>');
    } else if (currentMode === "league") {
      btns.push('<button class="next-cta-btn next-cta-sec" id="nsWC">Play World Cup →</button>');
    }
    // Challenge a friend
    btns.push('<button class="next-cta-btn next-cta-ghost" id="nsChallenge">📣 Challenge a friend to beat this</button>');
    if (!btns.length) return "";
    return '<div class="next-step-ctas"><div class="nsc-label">What\'s next?</div>' + btns.join("") + '</div>';
  }

  /* ── Results: daily challenge CTA ──────────────────────────────── */
  function dailyCTAHTML() {
    var DC_KEY = "wcxi_daily_ts";
    var lastDone = 0;
    try { lastDone = parseInt(localStorage.getItem(DC_KEY) || "0", 10); } catch(e) {}
    if (sameDay(lastDone, Date.now())) return ""; // already done today
    return '<div class="daily-cta-card" id="dailyCTACard">' +
      '<span class="daily-cta-ico">🏆</span>' +
      '<div class="daily-cta-text"><strong>Daily challenge</strong><br><span>You haven\'t played today\'s challenge — a fresh mode drops every day.</span></div>' +
      '<button class="daily-cta-btn" id="dailyCTABtn">Play now →</button>' +
    '</div>';
  }

  /* ── Wire new result buttons ────────────────────────────────────── */
  function wireNextStep() {
    var nsHarder = document.getElementById("nsHarder");
    if (nsHarder) nsHarder.addEventListener("click", function() {
      var order = ["Easy","Medium","Hard","Legend"];
      var idx = order.indexOf(difficulty);
      if (idx < order.length-1) difficulty = order[idx+1];
      newGame();
    });
    var nsCL = document.getElementById("nsCL");
    if (nsCL) nsCL.addEventListener("click", function() { newGame(); showView("setup"); });
    var nsWC = document.getElementById("nsWC");
    if (nsWC) nsWC.addEventListener("click", function() { newGame(); showView("setup"); });
    var nsChallenge = document.getElementById("nsChallenge");
    if (nsChallenge) nsChallenge.addEventListener("click", function() {
      var text = "I scored " + (window._lastResultScore||"") + " pts in Gaffer — can you beat it? gaffer.app";
      try { navigator.share({ text: text }); } catch(e) {
        navigator.clipboard && navigator.clipboard.writeText(text);
        nsChallenge.textContent = "Copied!"; setTimeout(function(){ nsChallenge.textContent = "📣 Challenge a friend to beat this"; }, 2000);
      }
    });
    var dailyBtn = document.getElementById("dailyCTABtn");
    if (dailyBtn) dailyBtn.addEventListener("click", function() { showView("home"); setTimeout(function(){ var d = document.getElementById("homeDaily"); if(d) d.click(); }, 100); });
  }
  function modeLabel(m) {
    return m === "wc" ? "World Cup" : m === "cl" ? "Champions League" : m === "mp" ? "Multiplayer" :
           m === "euro" ? "Euros" : m === "dvc" ? "vs Computer" : m === "duels" ? "Duels" : "League";
  }
  function renderBoard() {
    Array.prototype.forEach.call(document.getElementById("boardTabs").querySelectorAll(".seg-opt"), function (b) {
      b.className = "seg-opt" + (b.getAttribute("data-board") === boardTab ? " active" : "");
    });
    var modeTabs = document.getElementById("boardModes");
    if (modeTabs) Array.prototype.forEach.call(modeTabs.querySelectorAll(".seg-opt"), function (b) {
      b.className = "seg-opt" + (b.getAttribute("data-mode") === boardMode ? " active" : "");
    });
    var all = loadBoard(), now = Date.now();
    var myName = getUsername();
    var filtered = all.filter(function (e) {
      if (boardMode !== "all" && (e.mode || "league") !== boardMode) return false;
      if (boardTab === "daily") return sameDay(e.ts, now);
      if (boardTab === "weekly") return (now - e.ts) <= 7 * 86400000;
      return true;
    });
    filtered.sort(function (a, b) { return b.score - a.score; });
    var top = filtered.slice(0, 25);

    /* Find user's personal best in this filtered set (even outside top 25) */
    var myBest = null, myBestRank = -1;
    if (myName) {
      filtered.forEach(function(e, i) {
        if ((e.username || e.name) === myName && (!myBest || e.score > myBest.score)) {
          myBest = e; myBestRank = i + 1;
        }
      });
    }
    var myBestInTop = myBest && myBestRank <= 25;

    if (!top.length) { elBoardBody.innerHTML = '<div class="empty-note">No scores yet — finish a game in this mode to set one!</div>'; return; }
    var showModeCol = (boardMode === "all");
    var html = '<div class="board-list">';

    top.forEach(function (e, i) {
      var entryName = e.username || e.name;
      var isMe = myName && entryName === myName && e === myBest;
      html += '<div class="board-row' + (i < 3 ? " top3" : "") + (isMe ? " board-mine" : "") + '">' +
        '<span class="brank">' + (i + 1) + '</span>' +
        '<span class="bname">' + esc(entryName) + (isMe ? ' <span class="board-you-tag">You</span>' : '') + '</span>' +
        '<span class="bres">' + esc(e.result || "") + (showModeCol ? " · " + modeLabel(e.mode) : "") + '</span>' +
        '<span class="bscore">' + e.score + '</span>' +
        '<button class="board-challenge-btn" data-mode="' + (e.mode||"wc") + '" data-score="' + e.score + '" title="Beat this score">⚔️</button>' +
      '</div>';
    });

    /* Show user's best below the list if outside top 25 */
    if (myBest && !myBestInTop) {
      html += '<div class="board-my-best">' +
        '<div class="board-row board-mine">' +
          '<span class="brank">#' + myBestRank + '</span>' +
          '<span class="bname">' + esc(myName) + ' <span class="board-you-tag">You</span></span>' +
          '<span class="bres">' + esc(myBest.result || "") + (showModeCol ? " · " + modeLabel(myBest.mode) : "") + '</span>' +
          '<span class="bscore">' + myBest.score + '</span>' +
          '<button class="board-challenge-btn" data-mode="' + (myBest.mode||"wc") + '" data-score="' + myBest.score + '">⚔️</button>' +
        '</div>' +
      '</div>';
    }

    html += "</div>";
    elBoardBody.innerHTML = html;

    /* Wire challenge buttons */
    Array.prototype.forEach.call(elBoardBody.querySelectorAll(".board-challenge-btn"), function(btn) {
      btn.addEventListener("click", function() {
        var targetScore = btn.getAttribute("data-score");
        var mode = btn.getAttribute("data-mode") || "wc";
        /* Show the user their challenge target, then go to setup */
        if (window.flToast) window.flToast("Beat " + targetScore + " pts — good luck!", 3000);
        window._challengeTarget = { score: parseInt(targetScore, 10), mode: mode };
        setTimeout(function() { showView("home"); }, 200);
      });
    });
  }

  function whoLabel(userTeam, comp) {
    return esc(userTeam.name) + " · " + esc(userTeam.formation) +
      (userTeam.manager && userTeam.manager !== "No manager" ? " · " + esc(userTeam.manager) : "") + " · " + esc(comp);
  }

  function runSim(type, userTeam) {
    clearDraft();
    clearTimeout(revealTimer);
    lastSim = { type: type, userTeam: userTeam };
    elResultsBody.innerHTML = '<div class="loading">Drawing groups…</div>';
    showView("results");
    setTimeout(function () {
      if (type === "wc" || type === "euro") {
        var compLabel = type === "euro" ? "Euro Championship" : "World Cup";
        /* Draw groups first — show preview before simulating */
        var field = window.ENGINE.buildField(userTeam);
        var rawGroups = window.ENGINE.seedGroups(field);
        var userRawGroup = null;
        for (var gi = 0; gi < rawGroups.length; gi++) {
          if (rawGroups[gi].teams.some(function (t) { return t.isUser; })) { userRawGroup = rawGroups[gi]; break; }
        }
        reveal = { field: field, rawGroups: rawGroups, userRawGroup: userRawGroup,
          userTeam: userTeam, label: whoLabel(userTeam, compLabel), mode: type,
          compLabel: compLabel, stage: "groupPreview" };
        renderWCStage();
      } else {
        var lg = window.ENGINE.runLeague(userTeam);
        lReveal = { lg: lg, userTeam: userTeam, label: whoLabel(userTeam, "League"),
          matches: lg.userMatches, shown: 0, stage: "reveal", sc: leagueScore(lg), saved: false };
        renderLeagueStage();
      }
    }, 30);
  }

  function runCLSim(format) {
    clearTimeout(revealTimer);
    var userTeam = userTeamFromSquad();
    lastSim = { type: "cl", userTeam: userTeam };
    elResultsBody.innerHTML = '<div class="loading">Simulating…</div>';
    showView("results");
    setTimeout(function () {
      if (format === "league") {
        var lg = window.ENGINE.runCLLeague(userTeam);
        lReveal = { lg: lg, userTeam: userTeam, label: whoLabel(userTeam, "Champions League"),
          matches: lg.userMatches, shown: 0, stage: "reveal", sc: leagueScore(lg), saved: false, cl: true };
        renderLeagueStage();
      } else {
        var res = (format === "swiss") ? window.ENGINE.runCLSwiss(userTeam) : window.ENGINE.runCLGroups(userTeam);
        var koNames = { "Knockout playoff": 1, "Round of 16": 1, "Round of 32": 1, "Quarter-finals": 1, "Semi-finals": 1, "Final": 1 };
        reveal = { wc: res, userTeam: userTeam, label: whoLabel(userTeam, "Champions League"),
          groupMatches: res.userMatches.filter(function (m) { return !koNames[m.round]; }),
          koMatches: res.userMatches.filter(function (m) { return koNames[m.round]; }),
          shown: 0, stage: "groups", sc: wcScore(res), saved: false, cl: true,
          phaseLabel: (format === "swiss" ? "League phase" : "Group stage"),
          advanceText: (format === "swiss" ? "Top 8 go straight to the Round of 16; 9th–24th into a knockout playoff." : "Top 2 of each group reach the Round of 16.") };
        renderWCStage();
      }
    }, 30);
  }

  // All ties in one knockout round (user's tie highlighted in gold).
  function roundResultsHTML(wc, idx) {
    var rd = wc.rounds[idx], html = '<div class="ko-results">';
    rd.ties.forEach(function (t) {
      var uTie = t.a.isUser || t.b.isUser;
      var pens = t.res.pens ? ' <span class="pens">(p ' + t.res.pens[0] + "–" + t.res.pens[1] + ")</span>" : "";
      html += '<div class="ko-line' + (uTie ? " user" : "") + '">' +
        '<span class="ko-t' + (t.winner === t.a ? " w" : "") + '">' + teamCell(t.a) + "</span>" +
        '<span class="ko-sc">' + t.res.a + "–" + t.res.b + pens + "</span>" +
        '<span class="ko-t' + (t.winner === t.b ? " w" : "") + '">' + teamCell(t.b) + "</span></div>";
    });
    return html + "</div>";
  }

  // ---- shared game-by-game auto-reveal ----
  function scheduleRevealN(total, state, rerender, totalMs) {
    clearTimeout(revealTimer);
    if (state.shown < total) {
      var delay = Math.max(180, Math.min(650, Math.round((totalMs || 7000) / total)));
      revealTimer = setTimeout(function () { state.shown++; rerender(); }, delay);
    }
  }
  function revealListHTML(matches, shown, teamName) {
    var html = '<div class="journey">';
    for (var i = 0; i < shown && i < matches.length; i++) html += matchCardHTML(matches[i], teamName);
    return html + "</div>";
  }
  function skipBarHTML(shown, total) {
    return '<div class="reveal-bar"><span class="reveal-count">' + shown + " / " + total +
      ' games</span><button class="btn-ghost" id="skipReveal">Skip</button></div>';
  }
  function roundOthersHTML(wc, roundName) {
    var rd = null;
    wc.rounds.forEach(function (r) { if (r.name === roundName) rd = r; });
    if (!rd) return "";
    var rows = "";
    rd.ties.forEach(function (t) {
      if (t.a.isUser || t.b.isUser) return; // user's own tie shown as a card above
      var pens = t.res.pens ? ' <span class="pens">(p ' + t.res.pens[0] + "–" + t.res.pens[1] + ")</span>" : "";
      rows += '<div class="ko-line"><span class="ko-t' + (t.winner === t.a ? " w" : "") + '">' + teamCell(t.a) + "</span>" +
        '<span class="ko-sc">' + t.res.a + "–" + t.res.b + pens + "</span>" +
        '<span class="ko-t' + (t.winner === t.b ? " w" : "") + '">' + teamCell(t.b) + "</span></div>";
    });
    if (!rows) return "";
    return '<div class="ko-all-h">Other ' + esc(roundName) + " results</div><div class=\"ko-results\">" + rows + "</div>";
  }
  function koRevealListHTML(wc, km, shown) {
    var html = '<div class="journey">';
    for (var i = 0; i < shown && i < km.length; i++) {
      html += '<div class="ko-round-block">' + matchCardHTML(km[i], wc.teamName) + roundOthersHTML(wc, km[i].round) + "</div>";
    }
    return html + "</div>";
  }

  // World Cup: group games revealed one-by-one → group tables → knockouts one-by-one → result.
  function standingsHTML(wc) { return wc.groups ? renderGroups(wc.groups) : leagueTableHTML(wc); }
  function renderWCStage() {
    var r = reveal;
    /* ── Group preview interstitial ── */
    if (r.stage === "groupPreview") {
      var ug = r.userRawGroup;
      var html = '<h2 class="res-title">' + r.label + "</h2>";
      html += '<div class="stage-badge">Group Draw · Group ' + (ug ? ug.name : "?") + "</div>";
      html += '<div class="group-preview">';
      if (ug) {
        ug.teams.forEach(function (t) {
          var isMe = t.isUser;
          var badge = (t.rating >= 90 ? "r-gold" : t.rating >= 85 ? "r-elite" : t.rating >= 80 ? "r-great" : t.rating >= 75 ? "r-good" : "r-amber");
          html += '<div class="gp-row' + (isMe ? " gp-me" : "") + '">';
          html += (t.flag ? '<span class="gp-flag">' + esc(t.flag) + "</span>" : "");
          html += '<span class="gp-name">' + esc(t.name) + "</span>";
          html += '<span class="mp-r-badge ' + badge + '">' + (isMe ? "Your XI" : t.rating) + "</span>";
          html += "</div>";
        });
      }
      html += "</div>";
      html += '<p class="legend">Your squad is highlighted. Top 2 + best thirds advance.</p>';
      html += '<div class="reveal-bar"><button class="start-btn" id="kickOff">Kick off! →</button></div>';
      elResultsBody.innerHTML = html;
      var ko = document.getElementById("kickOff");
      if (ko) ko.onclick = function () {
        elResultsBody.innerHTML = '<div class="loading">Simulating…</div>';
        setTimeout(function () {
          var wc2 = window.ENGINE.runWorldCupFromGroups(r.field, r.rawGroups, r.userTeam);
          r.wc = wc2;
          r.groupMatches = wc2.userMatches.filter(function (m) { return m.round.indexOf("Group") === 0; });
          r.koMatches    = wc2.userMatches.filter(function (m) { return m.round.indexOf("Group") !== 0; });
          r.shown = 0; r.stage = "groups"; r.sc = wcScore(wc2); r.saved = false;
          renderWCStage();
        }, 30);
      };
      wireResults();
      return;
    }
    var wc = r.wc, html = '<h2 class="res-title">' + r.label + "</h2>";
    var phase = r.phaseLabel || "Group stage";
    var advance = r.advanceText || "Top 2 of each + the 8 best thirds advance.";
    var standHdr = wc.groups ? "How the groups finished" : "League phase table";
    if (r.stage === "groups") {
      var gm = r.groupMatches;
      html += '<div class="stage-badge">Part 1 · ' + phase + "</div>";
      if (r.shown < gm.length) {
        html += skipBarHTML(r.shown, gm.length) + revealListHTML(gm, r.shown, wc.teamName);
      } else {
        html += revealListHTML(gm, gm.length, wc.teamName);
        if (wc.groups) {
          var ug = null;
          wc.groups.forEach(function (g) { if (g.table.some(function (row) { return row.team.isUser; })) ug = g; });
          if (ug) html += '<h3 class="sec">Your group — Group ' + ug.name + "</h3>" + renderGroups([ug]);
        }
        html += '<h3 class="sec">' + standHdr + '</h3><p class="legend">' + advance + "</p>" + standingsHTML(wc);
        html += '<div class="reveal-bar"><button class="start-btn" id="toKO">' + (r.koMatches.length ? "Into the knockouts →" : "See your fate →") + "</button></div>";
      }
    } else if (r.stage === "ko") {
      var km = r.koMatches;
      if (!km.length) { r.stage = "result"; renderWCStage(); return; }
      html += '<div class="stage-badge">Part 2 · Knockouts</div>';
      if (r.shown < km.length) {
        html += skipBarHTML(r.shown, km.length) + koRevealListHTML(wc, km, r.shown);
      } else {
        html += koRevealListHTML(wc, km, km.length);
        html += '<div class="reveal-bar"><button class="start-btn" id="toResult">See your result →</button></div>';
      }
    } else {
      if (!r.saved) { r.saved = true; window._lastResultScore = r.sc.score; if (window.sfx && wc.userResult === "Champions!") window.sfx.win(); addScore({ name: r.userTeam.name, score: r.sc.score, result: wc.userResult, mode: r.mode || (r.cl ? "cl" : "wc"), ts: Date.now() }); if (window.GAFFER_OB) setTimeout(function(){ window.GAFFER_OB.onResult(r.sc.score); }, 1800); }
      html += shareCardHTML(r.sc, wc.userResult, r.compLabel || "World Cup");
      html += '<div class="champion big">' + wc.userResult + "</div>";
      html += rankRevealHTML(r.sc.score);
      html += scoreBannerHTML(r.sc, wc.userResult);
      html += matchNarrativeHTML(wc.userMatches, wc.userStats, r.userTeam, "tournament");
      html += managerVerdictHTML(wc.userStats, r.compLabel || "World Cup", r.userTeam);
      html += statsSummaryHTML(wc.userStats);
      html += whatIfHTML(r.userTeam, r.sc);
      html += nextStepCTAsHTML(r.mode || (r.cl ? "cl" : "wc"), wc.userResult);
      html += dailyCTAHTML();
      html += '<div class="result-under-summary"><button class="btn-ghost" id="boardBtn">Leaderboards</button></div>';
      /* Group phase journey (shown for all WC/CL result screens) */
      var gPhase = r.phaseLabel || "Group stage";
      if (r.groupMatches && r.groupMatches.length) {
        html += '<h3 class="sec">Your ' + esc(gPhase.toLowerCase()) + '</h3>';
        html += '<div class="journey">' + r.groupMatches.map(function (m) { return matchCardHTML(m, wc.teamName); }).join("") + "</div>";
        /* Show the user's group table for old-format CL or WC */
        if (wc.groups) {
          var ug2 = null;
          wc.groups.forEach(function (g) { if (g.table.some(function (row) { return row.team.isUser; })) ug2 = g; });
          if (ug2) html += '<h4 class="sub-sec">Your group · Group ' + ug2.name + "</h4>" + renderGroups([ug2]);
        }
      }
      /* Knockout journey */
      if (r.koMatches && r.koMatches.length) {
        html += '<h3 class="sec">Knockouts</h3>';
        html += '<div class="journey">' + r.koMatches.map(function (m) { return matchCardHTML(m, wc.teamName); }).join("") + "</div>";
      }
      html += '<h3 class="sec">Knockout bracket</h3><p class="legend">Your team highlighted in gold.</p>' + renderBracket(wc.rounds);
      html += '<div class="result-bottom-cta"><button class="btn-ghost" id="btmGoHome">← Home</button><button class="btn-ghost" id="btmBoard">Leaderboards</button></div>';
    }
    elResultsBody.innerHTML = html;
    var skip = document.getElementById("skipReveal");
    if (skip) skip.onclick = function () { clearTimeout(revealTimer); reveal.shown = (reveal.stage === "groups" ? reveal.groupMatches.length : reveal.koMatches.length); renderWCStage(); };
    var toKO = document.getElementById("toKO");
    if (toKO) toKO.onclick = function () { clearTimeout(revealTimer); reveal.stage = "ko"; reveal.shown = 0; if (window.scrollTo) window.scrollTo(0, 0); renderWCStage(); };
    var tr = document.getElementById("toResult");
    if (tr) tr.onclick = function () { clearTimeout(revealTimer); reveal.stage = "result"; if (window.scrollTo) window.scrollTo(0, 0); renderWCStage(); };
    wireResults();
    if (reveal.stage === "groups") scheduleRevealN(reveal.groupMatches.length, reveal, renderWCStage, 6000);
    else if (reveal.stage === "ko") scheduleRevealN(reveal.koMatches.length, reveal, renderWCStage, 6000);
  }

  function leagueVerdict(actual, expected) {
    if (actual === 1) return "Champions of the world's hardest league — the perfect campaign.";
    var d = expected - actual; // positive = better than expected
    if (d >= 8) return "A sensational overachievement — nobody saw that coming.";
    if (d >= 3) return "Punched well above your weight.";
    if (d >= -2) return "Just about as expected for a side this strong.";
    if (d >= -7) return "A disappointing return for the talent on paper.";
    return "A campaign to forget.";
  }

  function renderLeagueStage() {
    var r = lReveal, lg = r.lg, gm = lg.userMatches, html = '<h2 class="res-title">' + r.label + "</h2>";
    if (r.stage === "reveal") {
      html += '<div class="stage-badge">Your season · game by game</div>';
      html += (r.shown < gm.length ? skipBarHTML(r.shown, gm.length)
        : '<div class="reveal-bar"><button class="start-btn" id="toResult">See your final standing →</button></div>');
      html += revealListHTML(gm, r.shown, lg.teamName);
    } else {
      var result = ordinal(lg.userPos) + " of " + lg.table.length;
      if (!r.saved) { r.saved = true; window._lastResultScore = r.sc.score; if (window.sfx && lg.userPos === 1) window.sfx.win(); addScore({ name: r.userTeam.name, score: r.sc.score, result: result, mode: r.cl ? "cl" : "league", ts: Date.now() }); if (window.GAFFER_OB) setTimeout(function(){ window.GAFFER_OB.onResult(r.sc.score); }, 1800); }
      html += shareCardHTML(r.sc, result, r.cl ? "Champions League" : "League");
      html += rankRevealHTML(r.sc.score);
      html += scoreBannerHTML(r.sc, result);
      html += '<div class="verdict-card"><div class="vc-row">' +
        '<div class="vc-cell"><div class="vc-k">Finished</div><div class="vc-v">' + ordinal(lg.userPos) + "</div></div>" +
        '<div class="vc-cell"><div class="vc-k">Expected</div><div class="vc-v">' + ordinal(lg.expectedPos) + "</div></div>" +
        '<div class="vc-cell"><div class="vc-k">Squad rating</div><div class="vc-v">' + lg.squadRating + "</div></div>" +
        '<div class="vc-cell"><div class="vc-k">Record</div><div class="vc-v">' + lg.userRow.W + "-" + lg.userRow.D + "-" + lg.userRow.L + "</div></div>" +
        '</div><div class="vc-comment">' + leagueVerdict(lg.userPos, lg.expectedPos) + "</div></div>";
      html += matchNarrativeHTML(lg.userMatches, lg.userStats, r.userTeam, "league");
      html += managerVerdictHTML(lg.userStats, r.cl ? "Champions League" : "League", r.userTeam);
      html += statsSummaryHTML(lg.userStats);
      html += whatIfHTML(r.userTeam, r.sc);
      html += nextStepCTAsHTML(r.cl ? "cl" : "league", result);
      html += dailyCTAHTML();
      html += '<div class="result-under-summary"><button class="btn-ghost" id="boardBtn">Leaderboards</button></div>';
      html += '<h3 class="sec">Final ' + lg.table.length + '-team table</h3>' + leagueTableHTML(lg);
      html += '<div class="result-bottom-cta"><button class="btn-ghost" id="btmGoHome">← Home</button><button class="btn-ghost" id="btmBoard">Leaderboards</button></div>';
    }
    elResultsBody.innerHTML = html;
    var skip = document.getElementById("skipReveal");
    if (skip) skip.onclick = function () { clearTimeout(revealTimer); lReveal.shown = gm.length; renderLeagueStage(); };
    var tr = document.getElementById("toResult");
    if (tr) tr.onclick = function () { clearTimeout(revealTimer); lReveal.stage = "result"; if (window.scrollTo) window.scrollTo(0, 0); renderLeagueStage(); };
    wireResults();
    if (lReveal.stage === "reveal") scheduleRevealN(gm.length, lReveal, renderLeagueStage, 22000);
  }

  // ================= WIRING =================
  elTeamName.addEventListener("input", function () { teamName = elTeamName.value; paintPitches(); renderXI(); });
  var elThemeToggle = $("themeToggle");
  function applyTheme(light) {
    if (light) document.body.classList.add("light"); else document.body.classList.remove("light");
    if (elThemeToggle) Array.prototype.forEach.call(elThemeToggle.querySelectorAll("button"), function (b) {
      b.className = (b.getAttribute("data-theme") === (light ? "light" : "dark")) ? "active" : "";
    });
    try { localStorage.setItem("wcxi_theme", light ? "light" : "dark"); } catch (e) {}
  }
  if (elThemeToggle) Array.prototype.forEach.call(elThemeToggle.querySelectorAll("button"), function (b) {
    b.addEventListener("click", function () { applyTheme(b.getAttribute("data-theme") === "light"); });
  });
  (function () { var t = null; try { t = localStorage.getItem("wcxi_theme"); } catch (e) {} applyTheme(t === "light"); })();
  $("homeWC").addEventListener("click", function () { setMode("wc"); });
  $("homeCL").addEventListener("click", function () { setMode("cl"); });
  var _euroBtn = document.getElementById("homeEuro");
  if (_euroBtn) _euroBtn.addEventListener("click", function () { setMode("euro"); });
  $("homeBoard").addEventListener("click", function () { renderBoard(); showView("board"); });
  $("goCL").addEventListener("click", function () { if (squad.length === XI_SIZE) runCLSim(clFormat); });
  $("setupBack").addEventListener("click", function () { showView("home"); });
  $("draftHomeBtn").addEventListener("click", function () { showView("home"); });
  $("resultsHomeBtn").addEventListener("click", function () { showView("home"); });
  $("startBtn").addEventListener("click", startDraft);
  Array.prototype.forEach.call(document.querySelectorAll("[data-home]"), function (b) { b.addEventListener("click", function () { showView("home"); }); });

  elManagerSpin.addEventListener("click", spinManager);
  /* Random Legend — picks a random manager instantly (no animation required) */
  var elManagerRandom = $("managerRandom");
  if (elManagerRandom) {
    elManagerRandom.addEventListener("click", function () {
      if (managerSpun) return;
      var pick = MANAGERS_DB[Math.floor(Math.random() * MANAGERS_DB.length)];
      managerName = pick.n; managerId = pick.s; managerSpun = true;
      elManagerSpin.disabled = true; elManagerSpin.textContent = "Manager appointed";
      elManagerRandom.disabled = true; elManagerRandom.textContent = "✓ Legend picked";
      saveManagerPref(); renderManagerStyles(); renderManager(); paintPitches(); renderXI();
    });
  }
  elSpin.addEventListener("click", doSpin);
  elReroll.addEventListener("click", function () {
    if (rerollsLeft <= 0 || spinning) return;
    var discR = pendingPick ? pendingPick.r : null;
    rerollLog.push({ discarded: discR, kept: null });
    rerollsLeft--;
    pendingDiscard = discR;
    /* Burn animation on the reroll count span */
    var countEl = $("rerollCount");
    if (countEl) { countEl.classList.add("rr-burn"); setTimeout(function(){ countEl.classList.remove("rr-burn"); }, 500); }
    if (window.GAFFER_OB) window.GAFFER_OB.afterReroll();
    doSpin();
  });
  elAutoPick.addEventListener("click", autoPickCurrent);
  $("autoFillBtn").addEventListener("click", function () { if (window.GAFFER_OB) window.GAFFER_OB.afterAutoFill(); autoFill(); });
  $("clearBtn").addEventListener("click", newGame);
  $("shareBtn").addEventListener("click", shareTeam);
  $("goWorldCup").addEventListener("click", function () { if (squad.length === XI_SIZE) runSim(mode === "euro" ? "euro" : "wc", userTeamFromSquad()); });
  // shareXIBtn and boardBtn are dynamically rendered inside resultsBody — wired in wireResults()
  $("boardBack").addEventListener("click", function () { showView("home"); });
  $("clearBoardBtn").addEventListener("click", function () { if (window.confirm("Clear all saved leaderboard scores?")) { saveBoard([]); renderBoard(); } });

  /* ---- Challenge Hub ---- */
  var _homeChallengesBtn = $("homeChallenges");
  if (_homeChallengesBtn) _homeChallengesBtn.addEventListener("click", function () { renderChallengeHub(); showView("challenge"); });
  var _challengeBackBtn = $("challengeBack");
  if (_challengeBackBtn) _challengeBackBtn.addEventListener("click", function () { showView("home"); });

  function renderChallengeHub() {
    /* Daily constraint */
    var dc = getDailyConstraint();
    var nameEl = $("chDailyName"), descEl = $("chDailyDesc"), iconEl = $("chDailyIcon");
    if (nameEl) nameEl.textContent = dc.label;
    if (descEl) descEl.textContent = dc.desc;
    if (iconEl) iconEl.textContent = dc.icon || "🎯";

    /* Countdown to midnight */
    var countdown = $("chCountdown");
    if (countdown) {
      var now = new Date(), midnight = new Date(now); midnight.setHours(24,0,0,0);
      var diff = Math.floor((midnight - now) / 1000);
      var h = Math.floor(diff / 3600), m = Math.floor((diff % 3600) / 60);
      countdown.textContent = "Resets in " + h + "h " + m + "m";
    }

    /* Play daily button */
    var playDaily = $("chPlayDaily");
    if (playDaily) {
      playDaily.onclick = function () { setConstraint(dc); newGame(); showView("setup"); };
    }

    /* Permanent challenges grid */
    var grid = $("chGrid");
    if (!grid) return;
    grid.innerHTML = "";
    PERMANENT_CHALLENGES.forEach(function (ch) {
      var card = document.createElement("div");
      card.className = "ch-card";
      card.innerHTML =
        '<div class="ch-card-top">' +
          '<span class="ch-card-icon">' + (ch.icon||"🎯") + '</span>' +
          '<span class="ch-card-name">' + esc(ch.label) + '</span>' +
          (ch.badge ? '<span class="ch-card-badge">' + esc(ch.badge) + '</span>' : '') +
        '</div>' +
        '<div class="ch-card-desc">' + esc(ch.desc||"") + '</div>' +
        '<button class="ch-card-play">Play →</button>';
      card.querySelector(".ch-card-play").addEventListener("click", (function (c) {
        return function () { setConstraint(c); newGame(); showView("setup"); };
      })(ch));
      grid.appendChild(card);
    });
  }
  Array.prototype.forEach.call(document.getElementById("boardTabs").querySelectorAll(".seg-opt"), function (b) {
    b.addEventListener("click", function () { boardTab = b.getAttribute("data-board"); renderBoard(); });
  });
  var _bm = document.getElementById("boardModes");
  if (_bm) Array.prototype.forEach.call(_bm.querySelectorAll(".seg-opt"), function (b) {
    b.addEventListener("click", function () { boardMode = b.getAttribute("data-mode"); renderBoard(); });
  });

  // ---- Keyboard navigation on spin wheel ----
  document.addEventListener("keydown", function (e) {
    var inDraft = document.getElementById("draftView") && document.getElementById("draftView").style.display !== "none";
    if (!inDraft) return;
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
    if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      if (elSpin && !elSpin.disabled) elSpin.click();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (elAutoPick && !elAutoPick.disabled) elAutoPick.click();
    }
  });

  // ---- PWA ----
  var installBtn = $("installBtn");
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferredPrompt = e; if (installBtn) installBtn.hidden = false; });
  if (installBtn) installBtn.addEventListener("click", function () { if (!deferredPrompt) return; deferredPrompt.prompt(); deferredPrompt.userChoice.then(function () { deferredPrompt = null; installBtn.hidden = true; }); });
  window.addEventListener("appinstalled", function () { if (installBtn) installBtn.hidden = true; });
  if ("serviceWorker" in navigator) window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });

  // ---- init ----
  renderManager(); renderManagerStyles(); renderFormationBar(); renderRatingsToggle(); renderEra(); renderContinent(); renderDifficultyBar();
  paintPitches(); renderXI(); updateControls(); showView("home");
})(window);
