/* World Cup XI — controller: setup → draft (granular positions) → simulate */
(function () {
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

  var MANAGERS = [
    { id: "none",      emoji: "🎽", name: "No manager",     atk: 0,  def: 0,  ko: 0, desc: "No bonus — just the XI." },
    { id: "attack",    emoji: "⚔️", name: "Total Football",  atk: 4,  def: -2, ko: 0, desc: "+4 attack, −2 defence — all-out attack." },
    { id: "defence",   emoji: "🛡️", name: "Catenaccio",      atk: -2, def: 4,  ko: 0, desc: "+4 defence, −2 attack — shut up shop." },
    { id: "press",     emoji: "🔥", name: "Gegenpress",      atk: 2,  def: 2,  ko: 0, desc: "+2 attack, +2 defence — relentless intensity." },
    { id: "cup",       emoji: "🏆", name: "Cup Specialist",  atk: 0,  def: 0,  ko: 6, desc: "+6 in knockout games — a tournament master." },
    { id: "motivator", emoji: "🗣️", name: "The Motivator",   atk: 2,  def: 2,  ko: 2, desc: "+2 overall and +2 in knockouts — wins the big moments." },
    { id: "counter",   emoji: "⚡", name: "Counter-Attack",  atk: 3,  def: 1,  ko: 0, desc: "+3 attack, +1 defence — lethal on the break." }
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
    { n: "Claudio Ranieri", s: "counter" }, { n: "Roberto Di Matteo", s: "counter" }, { n: "Sven-Göran Eriksson", s: "counter" }, { n: "Guus Hiddink", s: "counter" }
  ];
  /* Expose for other modules (league, multiplayer) */
  window.WCXI_MANAGERS    = MANAGERS;
  window.WCXI_MANAGERS_DB = MANAGERS_DB;
  /* Shared leaderboard API so League / Multiplayer can post per-mode scores */
  window.WCXI_addScore = function (e) { try { addScore(e); } catch (err) {} };

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
  var DIFFICULTIES = [{ id: "Rookie", rr: 3 }, { id: "Pro", rr: 1 }, { id: "Legend", rr: 0 }];
  var difficulty = "Pro";
  function diffRerolls() { for (var i = 0; i < DIFFICULTIES.length; i++) if (DIFFICULTIES[i].id === difficulty) return DIFFICULTIES[i].rr; return 3; }
  var boardTab = "daily";
  var boardMode = "all";
  var lastSim = null;
  var reveal = null;  // staged World Cup reveal state
  var lReveal = null; // staged League reveal state
  var revealTimer = null; // game-by-game auto-reveal timer
  var deferredPrompt = null;
  var LB_KEY = "wcxi_leaderboard_v1";

  function currentManager() {
    for (var i = 0; i < MANAGERS.length; i++) if (MANAGERS[i].id === managerId) return MANAGERS[i];
    return MANAGERS[0];
  }
  function teamDisplayName() { return teamName.trim() || "My XI"; }

  // ---- elements ----
  var $ = function (id) { return document.getElementById(id); };
  var views = { home: $("homeView"), setup: $("setupView"), draft: $("draftView"), results: $("resultsView"), board: $("boardView") };
  var elCountryStrip = $("countryStrip"), elYearStrip = $("yearStrip");
  var elSpin = $("spinBtn"), elReroll = $("rerollBtn"), elRerollCount = $("rerollCount"), elAutoPick = $("autoPickBtn");
  var elHint = $("hint"), elSquadPanel = $("squadPanel");
  var elXiList = $("xiList"), elXiCount = $("xiCount"), elFormation = $("formation");
  var elDone = $("doneBanner"), elRatingNote = $("ratingNote"), elResultsBody = $("resultsBody");
  var elManagerStrip = $("managerStrip"), elManagerSpin = $("managerSpin"), elManagerDesc = $("managerDesc"), elManagerStyles = $("managerStyles"), elTeamName = $("teamName");
  var elFormationBar = $("formationBar"), elSetupPitch = $("setupPitch"), elDraftPitch = $("draftPitch");
  var elPitchTitle = $("pitchTitle"), elDraftTeam = $("draftTeam"), elDraftMeta = $("draftMeta");
  var elRatingsToggle = $("ratingsToggle"), elRatingsDesc = $("ratingsDesc");
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
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
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
  function renderPitchInto(el) {
    var a = assignByLines();
    function cell(c) {
      if (c.pick) return '<div class="pdot filled ' + c.line + '">' +
        '<span class="dot-init">' + (showRatings && c.pick.r ? c.pick.r : esc(initials(c.pick.n))) +
        '</span><span class="dot-name">' + esc(shortName(c.pick.n)) + "</span></div>";
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
    if (elDraftMeta) elDraftMeta.textContent = formation + " · " + mgr.emoji + " " + mgr.name;
  }

  // ---- setup controls ----
  function styleById(id) { for (var i = 0; i < MANAGERS.length; i++) if (MANAGERS[i].id === id) return MANAGERS[i]; return MANAGERS[0]; }
  function managerItemHTML(name, styleId) {
    var st = styleById(styleId);
    return '<div class="reel-item mgr-item"><span class="mgr-name-big">' + esc(name) +
      '</span><span class="mgr-style-tag">' + st.emoji + " " + st.name + "</span></div>";
  }
  function renderManagerStyles() {
    elManagerStyles.innerHTML = MANAGERS.map(function (m) {
      return '<button class="manager-opt' + (m.id === managerId ? " active" : "") + '" data-style="' + m.id +
        '" title="' + esc(m.desc) + '"><span class="mgr-emoji">' + m.emoji + '</span><span class="mgr-name">' + m.name + "</span></button>";
    }).join("");
    Array.prototype.forEach.call(elManagerStyles.querySelectorAll(".manager-opt"), function (b) {
      b.addEventListener("click", function () {
        managerId = b.getAttribute("data-style"); managerName = "";
        saveManagerPref();
        renderManagerStyles(); renderManager(); paintPitches(); renderXI();
      });
    });
  }
  function renderManager() {
    if (managerId === "none") {
      elManagerStrip.innerHTML = '<div class="reel-item mgr-item"><span class="mgr-name-big">No manager</span><span class="mgr-style-tag">pick a style or spin</span></div>';
      elManagerDesc.textContent = "Pick a tactical style above, or spin the wheel for a famous manager.";
    } else {
      var st = currentManager();
      if (managerName) {
        elManagerStrip.innerHTML = managerItemHTML(managerName, managerId);
      } else {
        elManagerStrip.innerHTML = '<div class="reel-item mgr-item"><span class="mgr-name-big">' + st.emoji + " " + st.name +
          '</span><span class="mgr-style-tag">tactical style</span></div>';
      }
      elManagerDesc.textContent = st.emoji + " " + st.name + " — " + st.desc;
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
    elPoolDesc.textContent = cnt + " World Cup" + (cnt === 1 ? "" : "s") + " · " + contName + " · " + poolPairs().length + " squads in the draw.";
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
    var rr = diffRerolls();
    elDiffDesc.textContent = rr === 0
      ? "Legend — no rerolls. You take whatever you spin."
      : difficulty + " — " + rr + " reroll" + (rr === 1 ? "" : "s") + " during the draft.";
  }

  function inContinent(c) { return continent === "all" || CONTINENT[c] === continent; }
  function poolPairs() {
    var pairs = [];
    COUNTRIES.forEach(function (c) {
      if (!inContinent(c)) return;
      Object.keys(DATA[c].years).forEach(function (y) { if (selectedYears[y]) pairs.push({ c: c, y: y }); });
    });
    // fallback: keep continent, ignore era; then drop everything
    if (!pairs.length) COUNTRIES.forEach(function (c) { if (inContinent(c)) Object.keys(DATA[c].years).forEach(function (y) { pairs.push({ c: c, y: y }); }); });
    if (!pairs.length) COUNTRIES.forEach(function (c) { Object.keys(DATA[c].years).forEach(function (y) { pairs.push({ c: c, y: y }); }); });
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
    if (mode === "wc") {
      return '<div class="reel-item"><span class="flag">' + DATA[c].flag + '</span><span class="name">' + c + "</span></div>";
    }
    return '<div class="reel-item"><span class="name">' + c + "</span></div>";
  }
  function yearItemHTML(y) { return '<div class="reel-item"><span class="year">' + y + "</span></div>"; }
  function spinReel(stripEl, randomItem, finalHTML, duration) {
    return new Promise(function (resolve) {
      var BLUR = 10, html = "";
      for (var i = 0; i < BLUR; i++) html += randomItem();
      html += finalHTML;
      stripEl.style.transition = "none"; stripEl.style.transform = "translateY(0)";
      stripEl.innerHTML = html; void stripEl.offsetHeight;
      stripEl.style.transition = "transform " + duration + "ms cubic-bezier(0.25,0.1,0.15,1)";
      stripEl.style.transform = "translateY(" + (-(BLUR * ITEM_H)) + "px)";
      var done = false;
      function finish(e) {
        /* Only fire on the strip's own transform transition, not bubbled child events */
        if (e && e.propertyName && e.propertyName !== "transform") return;
        if (done) return; done = true;
        stripEl.style.transition = "none";
        stripEl.style.transform = "translateY(0)";
        stripEl.innerHTML = finalHTML;
        resolve();
      }
      stripEl.addEventListener("transitionend", finish, { once: true });
      setTimeout(function(){ finish(null); }, duration + 120);
    });
  }

  function updateControls() {
    var full = squad.length >= XI_SIZE;
    elSpin.disabled = spinning || awaitingPick || full;
    elRerollCount.textContent = rerollsLeft;
    elReroll.hidden = !(awaitingPick && rerollsLeft > 0 && !full);
    elReroll.disabled = spinning;
    elAutoPick.hidden = !(awaitingPick && !full);
    elAutoPick.disabled = spinning;
  }

  function doSpin() {
    if (spinning) return;
    spinning = true; awaitingPick = false; elDone.style.display = "none";
    updateControls(); elHint.textContent = "Spinning…";
    var pairs = poolPairs(), pick = rand(pairs);
    current = { country: pick.c, year: pick.y };
    var pc = pairs.map(function (p) { return p.c; }), py = pairs.map(function (p) { return p.y; });
    var p1 = spinReel(elCountryStrip, function () { return countryItemHTML(rand(pc)); }, countryItemHTML(pick.c), 380);
    var p2 = spinReel(elYearStrip, function () { return yearItemHTML(rand(py)); }, yearItemHTML(pick.y), 420);
    Promise.all([p1, p2]).then(function () { spinning = false; elHint.textContent = ""; renderSquadPicker(); });
  }

  function ratingBadge(p) { return showRatings ? '<span class="rate-badge">' + p.r + "</span>" : ""; }
  function playerByName(name) {
    var list = DATA[current.country].years[current.year];
    for (var i = 0; i < list.length; i++) if (list[i].n === name) return list[i];
    return null;
  }

  function renderSquadPicker() {
    if (!current) return;
    var c = current.country, y = current.year, players = DATA[c].years[y];
    var taken = squad.map(function (s) { return s.country + "|" + s.year + "|" + s.n; });
    var draftable = 0;
    var html = '<h2>' + (mode === "wc" ? '<span class="flag">' + DATA[c].flag + "</span>" : "") + c + " &middot; " + y + " squad</h2>";
    html += '<div class="sub">Pick a player, then choose where they play.</div>';
    if (pendingPick) {
      html += '<div class="chooser">Where should <b>' + esc(pendingPick.name) + "</b> play? " +
        pendingPick.positions.map(function (pos) {
          return '<button class="choose-pos ' + LINE_OF[pos] + '" data-name="' + esc(pendingPick.name) + '" data-pos="' + pos + '">' + POS_FULL[pos] + " (" + pos + ")</button>";
        }).join("") + '<button class="choose-cancel">cancel</button></div>';
    }
    html += '<div class="players">';
    players.forEach(function (pl) {
      var isTaken = taken.indexOf(c + "|" + y + "|" + pl.n) !== -1;
      var open = openEligiblePositions(pl);
      var noSlot = open.length === 0;
      if (!isTaken && !noSlot) draftable++;
      var cls = "player" + (isTaken ? " taken" : "") + (noSlot && !isTaken ? " noslot" : "");
      var gps = gpOf(pl), posTag = gps ? gps.join("/") : pl.p, lineCls = gps ? LINE_OF[gps[0]] : pl.p;
      html += '<div class="' + cls + '" data-name="' + esc(pl.n) + '"><span class="pos ' + lineCls + '">' + posTag + "</span>" +
        '<span class="pname">' + pl.n + "</span>" + (noSlot && !isTaken ? '<span class="slot-tag">no slot</span>' : ratingBadge(pl)) + "</div>";
    });
    html += "</div>";
    elSquadPanel.innerHTML = html;
    elSquadPanel.style.display = "block";
    Array.prototype.forEach.call(elSquadPanel.querySelectorAll(".player"), function (n) {
      n.addEventListener("click", function () {
        if (n.classList.contains("taken") || n.classList.contains("noslot")) return;
        var name = n.getAttribute("data-name"), pl = playerByName(name), open = openEligiblePositions(pl);
        if (!open.length) return;
        pendingPick = { name: name, positions: open }; renderSquadPicker(); // always choose, even one slot
      });
    });
    Array.prototype.forEach.call(elSquadPanel.querySelectorAll(".choose-pos"), function (b) {
      b.addEventListener("click", function () { pickPlayer(b.getAttribute("data-name"), b.getAttribute("data-pos")); });
    });
    var cancel = elSquadPanel.querySelector(".choose-cancel");
    if (cancel) cancel.addEventListener("click", function () { pendingPick = null; renderSquadPicker(); });
    if (draftable === 0) { awaitingPick = false; elHint.textContent = "No open slots for this squad — spin again (free)."; }
    else awaitingPick = true;
    updateControls();
  }

  function pickPlayer(name, pos) {
    if (squad.length >= XI_SIZE || !current || !pos || openOf(pos) <= 0) return;
    var pl = playerByName(name);
    squad.push({ id: nextId++, n: name, p: pl ? pl.p : "MID", r: pl ? pl.r : 80, slot: pos, country: current.country, year: current.year });
    current = null; awaitingPick = false; pendingPick = null;
    elSquadPanel.style.display = "none";
    renderXI(); paintPitches(); updateControls();
    elHint.textContent = squad.length < XI_SIZE ? (name + " → " + pos + ". Spin for your next pick.") : "XI complete — enter a competition!";
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
      var cand = null, cpos = null;
      for (var k = 0; k < list.length; k++) {
        var pl = list[k];
        if (taken.indexOf(pk.c + "|" + pk.y + "|" + pl.n) !== -1) continue;
        var opts = openEligiblePositions(pl);
        if (opts.length) { cand = pl; cpos = preferredSlot(pl, opts); break; }
      }
      if (cand) squad.push({ id: nextId++, n: cand.n, p: cand.p, r: cand.r, slot: cpos, country: pk.c, year: pk.y });
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
            '<span class="info"><span class="pn">' + c.pick.n + (showRatings ? ' <span class="xi-rate">' + c.pick.r + "</span>" : "") +
            '</span><span class="meta">' + (mode === "wc" ? DATA[c.pick.country].flag + " " : "") + c.pick.country + " &middot; " + c.pick.year +
            '</span></span><button class="remove" data-id="' + c.pick.id + '">remove</button></div>';
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
    $("goWorldCup").disabled = !full;
    $("goLeague").disabled = !full;
    $("goCL").disabled = !full;
    $("shareBtn").disabled = squad.length < 1;
    $("autoFillBtn").disabled = full;
    elDone.style.display = full ? "block" : "none";
    if (full) elDone.textContent = "✅ Full " + formation + " XI — choose a competition below.";

    if (squad.length) {
      var t = userTeamFromSquad(), mgr = currentManager();
      elRatingNote.textContent = teamDisplayName() + " · " + formation + " · " + mgr.emoji + " " + mgr.name +
        (showRatings ? " · ATK " + Math.round(t.atk) + " / DEF " + Math.round(t.def) + (mgr.ko ? " · +" + mgr.ko + " KO" : "") : " · ratings hidden") +
        (full ? "" : "  — all 11 must be picked to enter");
    } else elRatingNote.textContent = "";
  }

  function avgRating() { if (!squad.length) return 80; var s = 0; squad.forEach(function (p) { s += p.r; }); return s / squad.length; }
  function formationTilt(name) {
    var c = formationCounts(name), SCALE = 2;
    return { atk: ((c.FWD - 2) + (c.MID - 4) * 0.5) * SCALE, def: (c.DEF - 4) * SCALE };
  }
  function userTeamFromSquad() {
    var rating = Math.round(avgRating()), tilt = formationTilt(formation), mgr = currentManager();
    return {
      name: teamDisplayName(), flag: "⭐", rating: rating,
      atk: rating + tilt.atk + mgr.atk, def: rating + tilt.def + mgr.def,
      koBonus: mgr.ko, isUser: true, formation: formation, manager: (managerId === "none" ? "No manager" : (managerName ? managerName + " (" + mgr.name + ")" : mgr.name)),
      players: squad.map(function (s) { return { n: s.n, p: s.p, r: s.r }; })
    };
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
    loadManagerPref();   /* restore last manager across modes */
    document.body.classList.toggle("mode-cl", m === "cl");
    DATA = (m === "cl") ? window.CL_DATA : window.WORLD_CUP_DATA;
    COUNTRIES = Object.keys(DATA);
    ALL_YEARS = (function () { var s = {}; COUNTRIES.forEach(function (c) { Object.keys(DATA[c].years).forEach(function (y) { s[y] = 1; }); }); return Object.keys(s).sort(); })();
    minIdx = 0; maxIdx = ALL_YEARS.length - 1;
    selectedYears = {}; ALL_YEARS.forEach(function (y) { selectedYears[y] = true; });
    continent = "all";
    squad = []; current = null; pendingPick = null; awaitingPick = false;
    var cl = (m === "cl");
    $("clFormatRow").style.display = cl ? "block" : "none";
    var cw = $("continentWrap"); if (cw) cw.style.display = cl ? "none" : "block";
    var pl = $("poolLabel"); if (pl) pl.textContent = cl ? "Player pool — Champions League seasons" : "Player pool — World Cup eras";
    $("goWorldCup").hidden = cl; $("goLeague").hidden = cl; $("goCL").hidden = !cl;
    renderManager(); renderManagerStyles(); renderFormationBar(); renderRatingsToggle(); renderEra();
    renderContinent(); renderDifficultyBar(); renderClFormat();
    paintPitches(); renderXI(); updateControls(); showView("setup");
  }

  function startDraft() {
    showView("draft");
    current = null; awaitingPick = false; spinning = false; rerollsLeft = diffRerolls();
    elSquadPanel.style.display = "none"; elHint.textContent = "";
    elCountryStrip.innerHTML = countryItemHTML(rand(poolPairs().map(function (p) { return p.c; })));
    elYearStrip.innerHTML = yearItemHTML(poolPairs()[0].y);
    paintPitches(); renderXI(); updateControls();
  }
  function newGame() {
    clearTimeout(revealTimer);
    squad = []; current = null; awaitingPick = false; pendingPick = null; spinning = false;
    teamName = ""; managerId = "none"; managerName = ""; managerSpun = false; formation = "4-3-3"; showRatings = true; difficulty = "Pro";
    elManagerSpin.disabled = false; elManagerSpin.textContent = "Spin manager";
    minIdx = 0; maxIdx = ALL_YEARS.length - 1; continent = "all";
    rerollsLeft = diffRerolls();
    elTeamName.value = ""; elSquadPanel.style.display = "none"; elHint.textContent = "";
    renderManager(); renderManagerStyles(); renderFormationBar(); renderRatingsToggle(); renderEra(); renderContinent(); renderDifficultyBar();
    paintPitches(); renderXI(); updateControls(); showView("home");
  }

  // ================= RESULTS =================
  function teamCell(t) { return '<span class="tname' + (t.isUser ? " me" : "") + '">' + t.flag + " " + esc(t.name) + "</span>"; }
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
    rounds.forEach(function (rd) {
      html += '<div class="round"><div class="round-name">' + rd.name + "</div>";
      rd.ties.forEach(function (t) {
        var aw = t.winner === t.a, bw = t.winner === t.b;
        var userTie = (t.a.isUser || t.b.isUser) ? " user-tie" : "";
        var pens = t.res.pens ? ' <span class="pens">(pens ' + t.res.pens[0] + "–" + t.res.pens[1] + ")</span>" : "";
        html += '<div class="tie' + userTie + '"><div class="side ' + (aw ? "win" : "") + '">' + teamCell(t.a) + "<b>" + t.res.a + "</b></div>" +
          '<div class="side ' + (bw ? "win" : "") + '">' + teamCell(t.b) + "<b>" + t.res.b + "</b></div>" + pens + "</div>";
      });
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
    html += '<div class="champion">🥇 Winners: ' + result.table[0].team.flag + " <b>" + esc(result.table[0].team.name) + "</b> · " + result.totalMatches + " matches played</div>";
    return html + leagueTableHTML(result);
  }
  function renderWorldCup(result, label) {
    var champ = result.champion;
    var html = '<h2 class="res-title">' + label + "</h2>";
    html += '<div class="champion">🏆 Champions: ' + champ.flag + " <b>" + esc(champ.name) + "</b></div>";
    html += '<h3 class="sec">Knockouts</h3>' + renderBracket(result.rounds);
    html += '<h3 class="sec">Group stage</h3>' + renderGroups(result.groups);
    return html;
  }
  function scorerLines(events) {
    if (!events || !events.length) return "";
    return '<div class="mscorers">' + events.map(function (e) {
      return '<span class="goal">⚽ ' + esc(e.scorer) + (e.assist ? ' <span class="assist">↳ ' + esc(e.assist) + "</span>" : "") + "</span>";
    }).join("") + "</div>";
  }
  function matchCardHTML(m, teamName) {
    var pens = m.pens ? ' <span class="pens">(pens ' + m.pens[0] + "–" + m.pens[1] + ")</span>" : "";
    return '<div class="mcard ' + m.result + '"><div class="mcard-top"><span class="mround">' + esc(m.round) + "</span>" +
      '<span class="pill ' + m.result + '">' + m.result + "</span></div>" +
      '<div class="mscore"><span class="me">⭐ ' + esc(teamName) + "</span> <b>" + m.gf + "–" + m.ga + "</b> " +
      '<span class="oppname">' + m.opp.flag + " " + esc(m.opp.name) + "</span>" + pens + "</div>" +
      scorerLines(m.events) + (m.cleanSheet ? '<div class="mclean">🧤 Clean sheet</div>' : "") + "</div>";
  }
  function statRows(list, key, max) {
    if (!list.length) return '<div class="stat-empty">—</div>';
    return list.slice(0, max).map(function (x) {
      return '<div class="stat-row"><span class="sp ' + (LINE_OF[x.p] || x.p || "") + '">' + (x.p || "") + "</span><span class=\"sn\">" + esc(x.n) + "</span><span class=\"sv\">" + x[key] + "</span></div>";
    }).join("");
  }
  function statsSummaryHTML(s) {
    return '<div class="stats-summary"><h3 class="sec">📊 Summary</h3><div class="stat-grid">' +
      '<div class="stat-pill">Played <b>' + s.games + "</b></div>" +
      '<div class="stat-pill">Record <b>' + s.w + "-" + s.d + "-" + s.l + "</b></div>" +
      '<div class="stat-pill">Goals <b>' + s.gf + "</b></div>" +
      '<div class="stat-pill">Conceded <b>' + s.ga + "</b></div>" +
      '<div class="stat-pill">🧤 Clean sheets <b>' + s.cleanSheets + "</b></div></div>" +
      '<div class="stat-cols"><div class="stat-col"><div class="stat-h">⚽ Top scorers</div>' + statRows(s.scorers, "g", 5) + "</div>" +
      '<div class="stat-col"><div class="stat-h">🅰️ Top assists</div>' + statRows(s.assisters, "a", 5) + "</div></div></div>";
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
    var html = '<h2 class="res-title">' + label + '</h2><div class="champion big">⭐ ' + esc(ur.team.name) + " finished <b>" + ordinal(result.userPos) + "</b> of " + result.table.length + " &middot; " + ur.Pts + " pts</div>";
    html += statsSummaryHTML(result.userStats);
    html += '<h3 class="sec">Your games <span class="legend-note">(' + result.userMatches.length + " shown · other " + (result.totalMatches - result.userMatches.length) + " simulated in the background)</span></h3>";
    html += '<div class="journey">' + result.userMatches.map(function (m) { return matchCardHTML(m, result.teamName); }).join("") + "</div>";
    html += '<button class="btn-ghost" id="toggleTable" data-show="Show full 48-team table">Show full 48-team table</button>';
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
  }

  // ---- scoring + leaderboards (only leaderboards persist) ----
  function tallyScore(parts) {
    var t = 0; parts.forEach(function (p) { t += p.value; });
    return { score: Math.max(0, Math.round(t)), parts: parts };
  }
  function wcScore(wc) {
    var s = wc.userStats;
    var base = { "Eliminated in the Group stage": 100, "Out in the Round of 32": 220, "Out in the Round of 16": 380, "Out in the Quarter-finals": 560, "Semi-finalists": 820, "🥈 Runners-up": 1100, "🏆 Champions!": 1600,
      "Out in the league phase": 100, "Out in the group stage": 100, "Out in the Knockout playoff": 170, "🏆 Champions of Europe!": 1600 };
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
    return tallyScore([
      { label: "Finished " + ordinal(lg.userPos) + " (49−pos) × 30", value: (49 - lg.userPos) * 30 },
      { label: ur.Pts + " points × 4", value: ur.Pts * 4 },
      { label: "Goal diff " + (ur.GD > 0 ? "+" : "") + ur.GD + " × 3", value: ur.GD * 3 },
      { label: s.cleanSheets + " clean sheets × 20", value: s.cleanSheets * 20 },
      { label: s.gf + " goals × 4", value: s.gf * 4 }
    ]);
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
  function addScore(e) { var a = loadBoard(); a.push(e); saveBoard(a); }
  function sameDay(a, b) { return new Date(a).toDateString() === new Date(b).toDateString(); }
  function modeLabel(m) {
    return m === "wc" ? "World Cup" : m === "cl" ? "Champions League" : m === "mp" ? "Multiplayer" : "League";
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
    var filtered = all.filter(function (e) {
      if (boardMode !== "all" && (e.mode || "league") !== boardMode) return false;
      if (boardTab === "daily") return sameDay(e.ts, now);
      if (boardTab === "weekly") return (now - e.ts) <= 7 * 86400000;
      return true;
    });
    filtered.sort(function (a, b) { return b.score - a.score; });
    var top = filtered.slice(0, 25);
    if (!top.length) { elBoardBody.innerHTML = '<div class="empty-note">No scores yet — finish a game in this mode to set one!</div>'; return; }
    var showModeCol = (boardMode === "all");
    var html = '<div class="board-list">';
    top.forEach(function (e, i) {
      html += '<div class="board-row' + (i < 3 ? " top3" : "") + '"><span class="brank">' + (i + 1) + "</span><span class=\"bname\">" + esc(e.name) + "</span><span class=\"bres\">" + esc(e.result || "") + (showModeCol ? " · " + modeLabel(e.mode) : "") + "</span><span class=\"bscore\">" + e.score + "</span></div>";
    });
    elBoardBody.innerHTML = html + "</div>";
  }

  function whoLabel(userTeam, comp) {
    return userTeam.name + " · " + userTeam.formation +
      (userTeam.manager && userTeam.manager !== "No manager" ? " · " + userTeam.manager : "") + " · " + comp;
  }

  function runSim(type, userTeam) {
    clearTimeout(revealTimer);
    lastSim = { type: type, userTeam: userTeam };
    elResultsBody.innerHTML = '<div class="loading">Simulating…</div>';
    showView("results");
    setTimeout(function () {
      if (type === "wc") {
        var wc = window.ENGINE.runWorldCup(userTeam);
        reveal = { wc: wc, userTeam: userTeam, label: whoLabel(userTeam, "World Cup"),
          groupMatches: wc.userMatches.filter(function (m) { return m.round.indexOf("Group") === 0; }),
          koMatches: wc.userMatches.filter(function (m) { return m.round.indexOf("Group") !== 0; }),
          shown: 0, stage: "groups", sc: wcScore(wc), saved: false };
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
    var r = reveal, wc = r.wc, html = '<h2 class="res-title">' + r.label + "</h2>";
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
      html += '<div class="stage-badge">Part 2 · Knockouts</div>';
      if (km.length && r.shown < km.length) {
        html += skipBarHTML(r.shown, km.length) + koRevealListHTML(wc, km, r.shown);
      } else {
        html += koRevealListHTML(wc, km, km.length);
        html += '<div class="reveal-bar"><button class="start-btn" id="toResult">See your result →</button></div>';
      }
    } else {
      if (!r.saved) { r.saved = true; addScore({ name: r.userTeam.name, score: r.sc.score, result: wc.userResult, mode: r.cl ? "cl" : "wc", ts: Date.now() }); }
      html += '<div class="champion big">' + wc.userResult + "</div>";
      html += scoreBannerHTML(r.sc, wc.userResult);
      html += statsSummaryHTML(wc.userStats);
      html += '<h3 class="sec">Knockout bracket</h3><p class="legend">Your team highlighted in gold.</p>' + renderBracket(wc.rounds);
      html += '<h3 class="sec">' + (wc.groups ? "Groups" : "League phase") + '</h3>' + standingsHTML(wc);
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
    if (actual === 1) return "🏆 Champions of the world's hardest league — the perfect campaign.";
    var d = expected - actual; // positive = better than expected
    if (d >= 8) return "🚀 A sensational overachievement — nobody saw that coming.";
    if (d >= 3) return "💪 Punched well above your weight.";
    if (d >= -2) return "👍 Just about as expected for a side this strong.";
    if (d >= -7) return "😕 A disappointing return for the talent on paper.";
    return "💀 A campaign to forget.";
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
      if (!r.saved) { r.saved = true; addScore({ name: r.userTeam.name, score: r.sc.score, result: result, mode: r.cl ? "cl" : "league", ts: Date.now() }); }
      html += scoreBannerHTML(r.sc, result);
      html += '<div class="verdict-card"><div class="vc-row">' +
        '<div class="vc-cell"><div class="vc-k">Finished</div><div class="vc-v">' + ordinal(lg.userPos) + "</div></div>" +
        '<div class="vc-cell"><div class="vc-k">Expected</div><div class="vc-v">' + ordinal(lg.expectedPos) + "</div></div>" +
        '<div class="vc-cell"><div class="vc-k">Squad rating</div><div class="vc-v">' + lg.squadRating + "</div></div>" +
        '<div class="vc-cell"><div class="vc-k">Record</div><div class="vc-v">' + lg.userRow.W + "-" + lg.userRow.D + "-" + lg.userRow.L + "</div></div>" +
        '</div><div class="vc-comment">' + leagueVerdict(lg.userPos, lg.expectedPos) + "</div></div>";
      html += statsSummaryHTML(lg.userStats);
      html += '<h3 class="sec">Final 48-team table</h3>' + leagueTableHTML(lg);
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
  $("homeBoard").addEventListener("click", function () { renderBoard(); showView("board"); });
  $("goCL").addEventListener("click", function () { if (squad.length === XI_SIZE) runCLSim(clFormat); });
  $("setupBack").addEventListener("click", function () { showView("home"); });
  $("startBtn").addEventListener("click", startDraft);
  Array.prototype.forEach.call(document.querySelectorAll("[data-home]"), function (b) { b.addEventListener("click", function () { showView("home"); }); });

  elManagerSpin.addEventListener("click", spinManager);
  elSpin.addEventListener("click", doSpin);
  elReroll.addEventListener("click", function () { if (rerollsLeft <= 0 || spinning) return; rerollsLeft--; doSpin(); });
  elAutoPick.addEventListener("click", autoPickCurrent);
  $("autoFillBtn").addEventListener("click", autoFill);
  $("clearBtn").addEventListener("click", newGame);
  $("shareBtn").addEventListener("click", shareTeam);
  $("goWorldCup").addEventListener("click", function () { if (squad.length === XI_SIZE) runSim("wc", userTeamFromSquad()); });
  $("goLeague").addEventListener("click", function () { if (squad.length === XI_SIZE) runSim("league", userTeamFromSquad()); });
  $("newGameBtn").addEventListener("click", newGame);
  $("boardBtn").addEventListener("click", function () { renderBoard(); showView("board"); });
  $("boardBack").addEventListener("click", function () { showView("home"); });
  $("clearBoardBtn").addEventListener("click", function () { if (window.confirm("Clear all saved leaderboard scores?")) { saveBoard([]); renderBoard(); } });
  Array.prototype.forEach.call(document.getElementById("boardTabs").querySelectorAll(".seg-opt"), function (b) {
    b.addEventListener("click", function () { boardTab = b.getAttribute("data-board"); renderBoard(); });
  });
  var _bm = document.getElementById("boardModes");
  if (_bm) Array.prototype.forEach.call(_bm.querySelectorAll(".seg-opt"), function (b) {
    b.addEventListener("click", function () { boardMode = b.getAttribute("data-mode"); renderBoard(); });
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
})();
