/* World Cup XI — controller: setup → draft (spin/reroll) → simulate */
(function () {
  "use strict";

  var DATA = window.WORLD_CUP_DATA;
  var COUNTRIES = Object.keys(DATA);
  var XI_SIZE = 11;
  var ITEM_H = 96;
  var REROLLS = 3;

  // GK always 1. DEF/MID/FWD = slot counts; rows = visual pitch lines (DEF→FWD).
  var FORMATIONS = {
    "4-3-3":   { DEF: 4, MID: 3, FWD: 3, rows: [4, 3, 3] },
    "4-4-2":   { DEF: 4, MID: 4, FWD: 2, rows: [4, 4, 2] },
    "4-2-3-1": { DEF: 4, MID: 5, FWD: 1, rows: [4, 2, 3, 1] },
    "3-5-2":   { DEF: 3, MID: 5, FWD: 2, rows: [3, 5, 2] },
    "3-4-1-2": { DEF: 3, MID: 5, FWD: 2, rows: [3, 4, 1, 2] },
    "3-4-3":   { DEF: 3, MID: 4, FWD: 3, rows: [3, 4, 3] },
    "5-3-2":   { DEF: 5, MID: 3, FWD: 2, rows: [5, 3, 2] },
    "4-5-1":   { DEF: 4, MID: 5, FWD: 1, rows: [4, 5, 1] },
    "5-4-1":   { DEF: 5, MID: 4, FWD: 1, rows: [5, 4, 1] }
  };
  var FORMATION_KEYS = Object.keys(FORMATIONS);
  var POS_LABEL = { GK: "Goalkeeper", DEF: "Defender", MID: "Midfielder", FWD: "Forward" };

  var MANAGERS = [
    { id: "none",      emoji: "🎽", name: "No manager",     atk: 0,  def: 0,  ko: 0, desc: "No bonus — just the XI." },
    { id: "attack",    emoji: "⚔️", name: "Total Football",  atk: 4,  def: -2, ko: 0, desc: "+4 attack, −2 defence — all-out attack." },
    { id: "defence",   emoji: "🛡️", name: "Catenaccio",      atk: -2, def: 4,  ko: 0, desc: "+4 defence, −2 attack — shut up shop." },
    { id: "press",     emoji: "🔥", name: "Gegenpress",      atk: 2,  def: 2,  ko: 0, desc: "+2 attack, +2 defence — relentless intensity." },
    { id: "cup",       emoji: "🏆", name: "Cup Specialist",  atk: 0,  def: 0,  ko: 6, desc: "+6 in knockout games — a tournament master." },
    { id: "motivator", emoji: "🗣️", name: "The Motivator",   atk: 2,  def: 2,  ko: 2, desc: "+2 overall and +2 in knockouts — wins the big moments." }
  ];

  // Versatile players can be drafted into more than one position (incl. their primary).
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
    "Maxi Rodríguez": ["MID", "FWD"], "Simão Sabrosa": ["FWD", "MID"], "Bernard": ["FWD", "MID"]
  };
  function eligOf(pl) { return VERSATILE[pl.n] || [pl.p]; }

  // ---- state ----
  var squad = [];
  var pendingPick = null; // {name, positions:[...]} while user chooses a slot
  var current = null;
  var spinning = false;
  var awaitingPick = false;
  var rerollsLeft = REROLLS;
  var formation = "4-3-3";
  var teamName = "";
  var managerId = "none";
  var showRatings = true;
  var pool = "all";          // "all" or "2026"
  var boardTab = "daily";
  var lastSim = null;
  var deferredPrompt = null;
  var LB_KEY = "wcxi_leaderboard_v1";

  function currentManager() {
    for (var i = 0; i < MANAGERS.length; i++) if (MANAGERS[i].id === managerId) return MANAGERS[i];
    return MANAGERS[0];
  }
  function teamDisplayName() { return teamName.trim() || "My XI"; }

  // ---- elements ----
  var $ = function (id) { return document.getElementById(id); };
  var views = { setup: $("setupView"), draft: $("draftView"), sim: $("simView"), results: $("resultsView"), board: $("boardView") };
  var elCountryStrip = $("countryStrip"), elYearStrip = $("yearStrip");
  var elSpin = $("spinBtn"), elReroll = $("rerollBtn"), elRerollCount = $("rerollCount");
  var elHint = $("hint"), elSquadPanel = $("squadPanel");
  var elXiList = $("xiList"), elXiCount = $("xiCount"), elFormation = $("formation");
  var elDone = $("doneBanner"), elRatingNote = $("ratingNote"), elResultsBody = $("resultsBody");
  var elManagerBar = $("managerBar"), elManagerDesc = $("managerDesc"), elTeamName = $("teamName");
  var elFormationBar = $("formationBar"), elSetupPitch = $("setupPitch"), elDraftPitch = $("draftPitch");
  var elPitchTitle = $("pitchTitle"), elDraftTeam = $("draftTeam"), elDraftMeta = $("draftMeta");
  var elRatingsToggle = $("ratingsToggle"), elRatingsDesc = $("ratingsDesc");
  var elPoolToggle = $("poolToggle"), elPoolDesc = $("poolDesc"), elBoardBody = $("boardBody");

  function rand(a) { return a[Math.floor(Math.random() * a.length)]; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
  function shortName(n) {
    var parts = String(n).split(" "); var last = parts[parts.length - 1];
    return last.length > 10 ? last.slice(0, 9) + "…" : last;
  }
  function initials(n) {
    var parts = String(n).split(" ").filter(Boolean);
    if (!parts.length) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  function showView(name) {
    Object.keys(views).forEach(function (k) { views[k].style.display = "none"; });
    views[name].style.display = "block";
    if (window.scrollTo) window.scrollTo(0, 0);
  }

  // ---- formation / pitch ----
  function req() {
    var f = FORMATIONS[formation];
    return { GK: 1, DEF: f.DEF, MID: f.MID, FWD: f.FWD };
  }
  function countGroup(g) { return squad.filter(function (s) { return s.p === g; }).length; }
  function groupFull(g) { return countGroup(g) >= req()[g]; }

  function pitchLines() {
    var rows = FORMATIONS[formation].rows;
    var lines = rows.map(function (c, i) {
      return { group: i === 0 ? "DEF" : (i === rows.length - 1 ? "FWD" : "MID"), count: c };
    });
    var display = lines.slice().reverse(); // forwards on top
    display.push({ group: "GK", count: 1 });
    return display;
  }
  function renderPitchInto(el) {
    var display = pitchLines();
    var byGroup = { GK: [], DEF: [], MID: [], FWD: [] };
    squad.forEach(function (s) { byGroup[s.p].push(s); });
    var ptr = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
    var html = '<div class="pitch">';
    display.forEach(function (line) {
      html += '<div class="pitch-row">';
      for (var k = 0; k < line.count; k++) {
        var p = byGroup[line.group][ptr[line.group]++];
        if (p) {
          html += '<div class="pdot filled ' + line.group + '">' +
            '<span class="dot-init">' + esc(initials(p.n)) + "</span>" +
            '<span class="dot-name">' + esc(shortName(p.n)) + "</span></div>";
        } else {
          html += '<div class="pdot ' + line.group + '"><span class="dot-pos">' + line.group + "</span></div>";
        }
      }
      html += "</div>";
    });
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
  function renderManagerBar() {
    var html = "";
    MANAGERS.forEach(function (m) {
      html += '<button class="manager-opt' + (m.id === managerId ? " active" : "") +
        '" data-manager="' + m.id + '" title="' + esc(m.desc) + '">' +
        '<span class="mgr-emoji">' + m.emoji + '</span><span class="mgr-name">' + m.name + "</span></button>";
    });
    elManagerBar.innerHTML = html;
    Array.prototype.forEach.call(elManagerBar.querySelectorAll(".manager-opt"), function (b) {
      b.addEventListener("click", function () {
        managerId = b.getAttribute("data-manager");
        renderManagerBar(); paintPitches(); renderXI();
      });
    });
    elManagerDesc.textContent = currentManager().desc;
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
    var r = req(), counts = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
    squad = squad.filter(function (s) { counts[s.p]++; return counts[s.p] <= r[s.p]; });
    renderFormationBar(); paintPitches(); renderXI();
    if (current) renderSquadPicker();
  }

  function renderRatingsToggle() {
    Array.prototype.forEach.call(elRatingsToggle.querySelectorAll(".seg-opt"), function (b) {
      var on = b.getAttribute("data-ratings") === (showRatings ? "show" : "hide");
      b.className = "seg-opt" + (on ? " active" : "");
      b.onclick = function () {
        showRatings = b.getAttribute("data-ratings") === "show";
        renderRatingsToggle(); paintPitches(); renderXI();
        if (current) renderSquadPicker();
      };
    });
    elRatingsDesc.textContent = showRatings
      ? "Player ratings are visible while you draft."
      : "Ratings are hidden — draft blind for a tougher challenge.";
  }

  function renderPoolToggle() {
    Array.prototype.forEach.call(elPoolToggle.querySelectorAll(".seg-opt"), function (b) {
      var on = b.getAttribute("data-pool") === pool;
      b.className = "seg-opt" + (on ? " active" : "");
      b.onclick = function () { pool = b.getAttribute("data-pool"); renderPoolToggle(); };
    });
    elPoolDesc.textContent = pool === "2026"
      ? "Only 2026 World Cup squads (projected from current rosters)."
      : "Draft from every squad across all World Cups.";
  }

  function poolPairs() {
    var pairs = [];
    COUNTRIES.forEach(function (c) {
      Object.keys(DATA[c].years).forEach(function (y) {
        if (pool === "all" || y === "2026") pairs.push({ c: c, y: y });
      });
    });
    return pairs;
  }

  // ================= DRAFT =================
  function countryItemHTML(c) {
    return '<div class="reel-item"><span class="flag">' + DATA[c].flag +
           '</span><span class="name">' + c + "</span></div>";
  }
  function yearItemHTML(y) { return '<div class="reel-item"><span class="year">' + y + "</span></div>"; }

  function spinReel(stripEl, randomItem, finalHTML, duration) {
    return new Promise(function (resolve) {
      var BLUR = 30, html = "";
      for (var i = 0; i < BLUR; i++) html += randomItem();
      html += finalHTML;
      stripEl.style.transition = "none";
      stripEl.style.transform = "translateY(0)";
      stripEl.innerHTML = html;
      void stripEl.offsetHeight;
      stripEl.style.transition = "transform " + duration + "ms cubic-bezier(0.12,0.7,0.18,1)";
      stripEl.style.transform = "translateY(" + (-(BLUR * ITEM_H)) + "px)";
      var done = false;
      function finish() {
        if (done) return; done = true;
        stripEl.style.transition = "none";
        stripEl.style.transform = "translateY(0)";
        stripEl.innerHTML = finalHTML;
        resolve();
      }
      stripEl.addEventListener("transitionend", finish, { once: true });
      setTimeout(finish, duration + 120);
    });
  }
  function allYears() {
    var all = [];
    COUNTRIES.forEach(function (c) { Object.keys(DATA[c].years).forEach(function (y) { all.push(y); }); });
    return all;
  }

  function updateControls() {
    var full = squad.length >= XI_SIZE;
    elSpin.disabled = spinning || awaitingPick || full;
    elRerollCount.textContent = rerollsLeft;
    elReroll.hidden = !(awaitingPick && rerollsLeft > 0 && !full);
    elReroll.disabled = spinning;
  }

  function doSpin() {
    if (spinning) return;
    spinning = true; awaitingPick = false; elDone.style.display = "none";
    updateControls(); elHint.textContent = "Spinning…";
    var pairs = poolPairs();
    var pick = rand(pairs);
    var country = pick.c, year = pick.y;
    current = { country: country, year: year };
    var poolCountries = pairs.map(function (p) { return p.c; });
    var poolYears = pairs.map(function (p) { return p.y; });
    var p1 = spinReel(elCountryStrip, function () { return countryItemHTML(rand(poolCountries)); }, countryItemHTML(country), 2100);
    var p2 = spinReel(elYearStrip, function () { return yearItemHTML(rand(poolYears)); }, yearItemHTML(year), 2600);
    Promise.all([p1, p2]).then(function () {
      spinning = false; elHint.textContent = "";
      renderSquadPicker();
    });
  }

  function ratingBadge(p) {
    return showRatings ? '<span class="rate-badge">' + p.r + "</span>" : "";
  }

  function openSlots(pl) {
    return eligOf(pl).filter(function (pos) { return !groupFull(pos); });
  }

  function renderSquadPicker() {
    if (!current) return;
    var c = current.country, y = current.year;
    var players = DATA[c].years[y];
    var taken = squad.map(function (s) { return s.country + "|" + s.year + "|" + s.n; });

    var draftable = 0;
    var html = '<h2><span class="flag">' + DATA[c].flag + "</span>" + c + " &middot; " + y + " squad</h2>";
    html += '<div class="sub">Pick a player and choose where they play.</div>';

    if (pendingPick) {
      html += '<div class="chooser">Where should <b>' + esc(pendingPick.name) + '</b> play? ' +
        pendingPick.positions.map(function (pos) {
          return '<button class="choose-pos ' + pos + '" data-name="' + esc(pendingPick.name) + '" data-pos="' + pos + '">' + POS_LABEL[pos] + "</button>";
        }).join("") + '<button class="choose-cancel">cancel</button></div>';
    }

    html += '<div class="players">';
    players.forEach(function (pl) {
      var isTaken = taken.indexOf(c + "|" + y + "|" + pl.n) !== -1;
      var open = openSlots(pl);
      var noSlot = open.length === 0;
      if (!isTaken && !noSlot) draftable++;
      var elig = eligOf(pl);
      var posTag = elig.length > 1 ? elig.join("/") : pl.p;
      var cls = "player" + (isTaken ? " taken" : "") + (noSlot && !isTaken ? " noslot" : "");
      html += '<div class="' + cls + '" data-name="' + esc(pl.n) + '" data-pos="' + pl.p + '">' +
        '<span class="pos ' + pl.p + '">' + posTag + '</span><span class="pname">' + pl.n + "</span>" +
        (noSlot && !isTaken ? '<span class="slot-tag">full</span>' : ratingBadge(pl)) + "</div>";
    });
    html += "</div>";
    elSquadPanel.innerHTML = html;
    elSquadPanel.style.display = "block";

    Array.prototype.forEach.call(elSquadPanel.querySelectorAll(".player"), function (n) {
      n.addEventListener("click", function () {
        if (n.classList.contains("taken") || n.classList.contains("noslot")) return;
        var name = n.getAttribute("data-name");
        var pl = playerByName(name);
        var open = openSlots(pl);
        if (open.length <= 1) { pickPlayer(name, open[0]); }
        else { pendingPick = { name: name, positions: open }; renderSquadPicker(); }
      });
    });
    Array.prototype.forEach.call(elSquadPanel.querySelectorAll(".choose-pos"), function (b) {
      b.addEventListener("click", function () { pickPlayer(b.getAttribute("data-name"), b.getAttribute("data-pos")); });
    });
    var cancel = elSquadPanel.querySelector(".choose-cancel");
    if (cancel) cancel.addEventListener("click", function () { pendingPick = null; renderSquadPicker(); });

    if (draftable === 0) { awaitingPick = false; elHint.textContent = "No open slots for this squad — spin again (free)."; }
    else { awaitingPick = true; }
    updateControls();
  }

  function playerByName(name) {
    var list = DATA[current.country].years[current.year];
    for (var i = 0; i < list.length; i++) if (list[i].n === name) return list[i];
    return null;
  }

  function pickPlayer(name, pos) {
    if (squad.length >= XI_SIZE || !current || !pos || groupFull(pos)) return;
    var pl = playerByName(name);
    squad.push({ n: name, p: pos, r: pl ? pl.r : 80, country: current.country, year: current.year });
    current = null; awaitingPick = false; pendingPick = null;
    elSquadPanel.style.display = "none";
    renderXI(); paintPitches(); updateControls();
    elHint.textContent = squad.length < XI_SIZE ? (name + " drafted! Spin for your next pick.") : "";
  }
  function removePlayer(i) { squad.splice(i, 1); renderXI(); paintPitches(); updateControls(); }

  // ---- Your XI (slot-based) ----
  function renderXI() {
    elXiCount.textContent = squad.length + "/" + XI_SIZE;
    elFormation.textContent = "· " + formation;
    var r = req(), groups = ["GK", "DEF", "MID", "FWD"], html = "";
    groups.forEach(function (g) {
      var filled = [];
      squad.forEach(function (s, i) { if (s.p === g) filled.push({ s: s, i: i }); });
      html += '<div class="line-label">' + POS_LABEL[g] + "s <span class=\"line-count\">" + filled.length + "/" + r[g] + "</span></div>";
      for (var k = 0; k < r[g]; k++) {
        if (k < filled.length) {
          var s = filled[k].s;
          html += '<div class="xi-row"><span class="pos ' + g + '">' + g + "</span>" +
            '<span class="info"><span class="pn">' + s.n + (showRatings ? ' <span class="xi-rate">' + s.r + "</span>" : "") +
            '</span><span class="meta">' + DATA[s.country].flag + " " + s.country + " &middot; " + s.year +
            '</span></span><button class="remove" data-idx="' + filled[k].i + '">remove</button></div>';
        } else {
          html += '<div class="xi-row empty"><span class="pos ' + g + '">' + g + "</span>" +
            '<span class="info"><span class="pn slot-empty">Empty ' + POS_LABEL[g] + " slot</span></span></div>";
        }
      }
    });
    elXiList.innerHTML = html;
    Array.prototype.forEach.call(elXiList.querySelectorAll(".remove"), function (b) {
      b.addEventListener("click", function () { removePlayer(parseInt(b.getAttribute("data-idx"), 10)); });
    });

    var ready = squad.length >= 1, full = squad.length >= XI_SIZE;
    $("goWorldCup").disabled = !ready;
    $("goLeague").disabled = !ready;
    $("shareBtn").disabled = !ready;
    elDone.style.display = full ? "block" : "none";
    if (full) elDone.textContent = "🏆 Full " + formation + " XI — ready to compete!";

    if (ready) {
      var t = userTeamFromSquad(), mgr = currentManager();
      elRatingNote.textContent = teamDisplayName() + " · " + formation + " · " + mgr.emoji + " " + mgr.name +
        (showRatings ? " · ATK " + Math.round(t.atk) + " / DEF " + Math.round(t.def) + (mgr.ko ? " · +" + mgr.ko + " KO" : "") : " · ratings hidden") +
        (full ? "" : "  — fill all 11 for full strength");
    } else {
      elRatingNote.textContent = "";
    }
  }

  function avgRating() {
    if (!squad.length) return 80;
    var sum = 0; squad.forEach(function (s) { sum += s.r; });
    return sum / squad.length;
  }
  function userTeamFromSquad() {
    var rating = Math.round(avgRating());
    var f = FORMATIONS[formation], SCALE = 2;
    var atkTilt = ((f.FWD - 2) + (f.MID - 4) * 0.5) * SCALE;
    var defTilt = (f.DEF - 4) * SCALE;
    var mgr = currentManager();
    return {
      name: teamDisplayName(), flag: "⭐", rating: rating,
      atk: rating + atkTilt + mgr.atk, def: rating + defTilt + mgr.def,
      koBonus: mgr.ko, isUser: true, formation: formation, manager: mgr.name,
      players: squad.map(function (s) { return { n: s.n, p: s.p, r: s.r }; })
    };
  }

  function shareTeam() {
    var order = { GK: 0, DEF: 1, MID: 2, FWD: 3 };
    var lines = squad.slice().sort(function (a, b) { return order[a.p] - order[b.p]; })
      .map(function (s) { return s.p + "  " + s.n + (showRatings ? " (" + s.r + ")" : "") + " — " + s.country + " " + s.year; });
    var mgr = currentManager();
    var header = teamDisplayName() + " (" + formation + ")" + (mgr.id !== "none" ? " · Mgr: " + mgr.name : "");
    var text = header + "\n\n" + lines.join("\n");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { elHint.textContent = "Copied your XI to the clipboard!"; },
        function () { window.prompt("Your XI:", text); });
    } else { window.prompt("Your XI:", text); }
  }

  function clearAll() {
    squad = []; current = null; awaitingPick = false; pendingPick = null; rerollsLeft = REROLLS;
    elSquadPanel.style.display = "none"; elHint.textContent = "";
    renderXI(); paintPitches(); updateControls();
  }

  function startDraft() {
    showView("draft");
    current = null; awaitingPick = false; spinning = false;
    elSquadPanel.style.display = "none"; elHint.textContent = "";
    elCountryStrip.innerHTML = countryItemHTML(rand(COUNTRIES));
    elYearStrip.innerHTML = yearItemHTML(Object.keys(DATA[COUNTRIES[0]].years)[0]);
    paintPitches(); renderXI(); updateControls();
  }

  // ================= RESULTS =================
  function teamCell(t) { return '<span class="tname' + (t.isUser ? " me" : "") + '">' + t.flag + " " + esc(t.name) + "</span>"; }

  function renderGroups(groups) {
    var html = '<div class="grid-groups">';
    groups.forEach(function (g) {
      html += '<div class="group-card"><div class="group-name">Group ' + g.name + "</div>";
      html += '<table class="mini"><thead><tr><th></th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr></thead><tbody>';
      g.table.forEach(function (r, i) {
        var cls = i < 2 ? "qual" : (i === 2 ? "third" : "");
        html += '<tr class="' + cls + '"><td class="tcell">' + teamCell(r.team) + "</td><td>" +
          r.P + "</td><td>" + r.W + "</td><td>" + r.D + "</td><td>" + r.L + "</td><td>" +
          (r.GD > 0 ? "+" : "") + r.GD + "</td><td><b>" + r.Pts + "</b></td></tr>";
      });
      html += "</tbody></table></div>";
    });
    return html + "</div>";
  }
  function renderBracket(rounds) {
    var html = '<div class="bracket">';
    rounds.forEach(function (rd) {
      html += '<div class="round"><div class="round-name">' + rd.name + "</div>";
      rd.ties.forEach(function (t) {
        var aw = t.winner === t.a, bw = t.winner === t.b;
        var pens = t.res.pens ? ' <span class="pens">(pens ' + t.res.pens[0] + "–" + t.res.pens[1] + ")</span>" : "";
        html += '<div class="tie">' +
          '<div class="side ' + (aw ? "win" : "") + '">' + teamCell(t.a) + "<b>" + t.res.a + "</b></div>" +
          '<div class="side ' + (bw ? "win" : "") + '">' + teamCell(t.b) + "<b>" + t.res.b + "</b></div>" +
          pens + "</div>";
      });
      html += "</div>";
    });
    return html + "</div>";
  }
  function renderWorldCup(result, label) {
    var champ = result.champion;
    var html = '<h2 class="res-title">' + label + "</h2>";
    html += '<div class="champion">🏆 Champions: ' + champ.flag + " <b>" + esc(champ.name) + "</b>" +
            (champ.isUser ? " — your XI won the World Cup!" : "") + "</div>";
    html += '<h3 class="sec">Knockouts</h3>' + renderBracket(result.rounds);
    html += '<h3 class="sec">Group stage</h3><p class="legend"><span class="dot qd"></span>top 2 advance · <span class="dot td"></span>3rd (best 8 advance)</p>';
    return html + renderGroups(result.groups);
  }
  function ordinal(n) { var s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }
  function leagueTableHTML(result) {
    var html = '<div class="table-scroll"><table class="league"><thead><tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr></thead><tbody>';
    result.table.forEach(function (r, i) {
      var cls = r.team.isUser ? "me-row" : (i === 0 ? "top-row" : "");
      html += '<tr class="' + cls + '"><td>' + (i + 1) + "</td><td class=\"tcell\">" + teamCell(r.team) +
        "</td><td>" + r.P + "</td><td>" + r.W + "</td><td>" + r.D + "</td><td>" + r.L + "</td><td>" +
        r.GF + "</td><td>" + r.GA + "</td><td>" + (r.GD > 0 ? "+" : "") + r.GD + "</td><td><b>" + r.Pts + "</b></td></tr>";
    });
    return html + "</tbody></table></div>";
  }
  function renderLeague(result, label) {
    var html = '<h2 class="res-title">' + label + "</h2>";
    html += '<div class="champion">🥇 Winners: ' + result.table[0].team.flag + " <b>" +
            esc(result.table[0].team.name) + "</b> · " + result.totalMatches + " matches played</div>";
    return html + leagueTableHTML(result);
  }
  // ---- match cards + stats (user runs) ----
  function scorerLines(events) {
    if (!events || !events.length) return "";
    return '<div class="mscorers">' + events.map(function (e) {
      return '<span class="goal">⚽ ' + esc(e.scorer) + (e.assist ? ' <span class="assist">↳ ' + esc(e.assist) + "</span>" : "") + "</span>";
    }).join("") + "</div>";
  }
  function matchCardHTML(m, teamName) {
    var pens = m.pens ? ' <span class="pens">(pens ' + m.pens[0] + "–" + m.pens[1] + ")</span>" : "";
    return '<div class="mcard ' + m.result + '">' +
      '<div class="mcard-top"><span class="mround">' + esc(m.round) + "</span>" +
      '<span class="pill ' + m.result + '">' + m.result + "</span></div>" +
      '<div class="mscore"><span class="me">⭐ ' + esc(teamName) + "</span> <b>" + m.gf + "–" + m.ga + "</b> " +
      '<span class="oppname">' + m.opp.flag + " " + esc(m.opp.name) + "</span>" + pens + "</div>" +
      scorerLines(m.events) +
      (m.cleanSheet ? '<div class="mclean">🧤 Clean sheet</div>' : "") + "</div>";
  }
  function statRows(list, key, max) {
    if (!list.length) return '<div class="stat-empty">—</div>';
    return list.slice(0, max).map(function (x) {
      return '<div class="stat-row"><span class="sp ' + (x.p || "") + '">' + (x.p || "") + "</span>" +
        '<span class="sn">' + esc(x.n) + "</span><span class=\"sv\">" + x[key] + "</span></div>";
    }).join("");
  }
  function statsSummaryHTML(s) {
    return '<div class="stats-summary"><h3 class="sec">📊 Summary</h3>' +
      '<div class="stat-grid">' +
        '<div class="stat-pill">Played <b>' + s.games + "</b></div>" +
        '<div class="stat-pill">Record <b>' + s.w + "-" + s.d + "-" + s.l + "</b></div>" +
        '<div class="stat-pill">Goals <b>' + s.gf + "</b></div>" +
        '<div class="stat-pill">Conceded <b>' + s.ga + "</b></div>" +
        '<div class="stat-pill">🧤 Clean sheets <b>' + s.cleanSheets + "</b></div>" +
      "</div>" +
      '<div class="stat-cols">' +
        '<div class="stat-col"><div class="stat-h">⚽ Top scorers</div>' + statRows(s.scorers, "g", 5) + "</div>" +
        '<div class="stat-col"><div class="stat-h">🅰️ Top assists</div>' + statRows(s.assisters, "a", 5) + "</div>" +
      "</div></div>";
  }

  function renderWorldCupUser(result, label) {
    var html = '<h2 class="res-title">' + label + "</h2>";
    html += '<div class="champion big">' + result.userResult + "</div>";
    html += statsSummaryHTML(result.userStats);
    html += '<h3 class="sec">Your road</h3>';
    html += '<div class="journey">' + result.userMatches.map(function (m) { return matchCardHTML(m, result.teamName); }).join("") + "</div>";
    html += '<button class="btn-ghost" id="toggleTable" data-show="Show full bracket &amp; groups">Show full bracket &amp; groups</button>';
    html += '<div id="fullTableWrap" style="display:none; margin-top:14px;">' +
      '<h3 class="sec">Knockouts</h3>' + renderBracket(result.rounds) +
      '<h3 class="sec">Group stage</h3>' + renderGroups(result.groups) + "</div>";
    return html;
  }

  function renderLeagueUser(result, label) {
    var ur = result.userRow;
    var html = '<h2 class="res-title">' + label + "</h2>";
    html += '<div class="champion big">⭐ ' + esc(ur.team.name) + " finished <b>" + ordinal(result.userPos) + "</b> of " +
            result.table.length + " &middot; " + ur.Pts + " pts</div>";
    html += statsSummaryHTML(result.userStats);
    html += '<h3 class="sec">Your games <span class="legend-note">(' + result.userMatches.length +
            " shown · other " + (result.totalMatches - result.userMatches.length) + " simulated in the background)</span></h3>";
    html += '<div class="journey">' + result.userMatches.map(function (m) { return matchCardHTML(m, result.teamName); }).join("") + "</div>";
    html += '<button class="btn-ghost" id="toggleTable" data-show="Show full 48-team table">Show full 48-team table</button>';
    html += '<div id="fullTableWrap" style="display:none; margin-top:14px;">' + leagueTableHTML(result) + "</div>";
    return html;
  }

  function wireResults() {
    var tg = document.getElementById("toggleTable");
    if (tg) tg.addEventListener("click", function () {
      var w = document.getElementById("fullTableWrap");
      var shown = w.style.display !== "none";
      w.style.display = shown ? "none" : "block";
      tg.innerHTML = shown ? tg.getAttribute("data-show") : "Hide";
    });
  }

  // ---- scoring + leaderboards (persisted; game state itself is NOT persisted) ----
  function wcScore(wc) {
    var s = wc.userStats;
    var base = { "Eliminated in the Group stage": 100, "Out in the Round of 32": 220,
      "Out in the Round of 16": 380, "Out in the Quarter-finals": 560,
      "Semi-finalists": 820, "🥈 Runners-up": 1100, "🏆 Champions!": 1600 };
    var b = base[wc.userResult] || 100;
    return Math.max(0, Math.round(b + s.gf * 10 + s.cleanSheets * 25 - s.ga * 5 + s.w * 30));
  }
  function leagueScore(lg) {
    var ur = lg.userRow, s = lg.userStats;
    return Math.max(0, Math.round((49 - lg.userPos) * 30 + ur.Pts * 4 + ur.GD * 3 + s.cleanSheets * 20 + s.gf * 4));
  }
  function loadBoard() { try { return JSON.parse(localStorage.getItem(LB_KEY) || "[]"); } catch (e) { return []; } }
  function saveBoard(a) { try { localStorage.setItem(LB_KEY, JSON.stringify(a)); } catch (e) {} }
  function addScore(entry) { var a = loadBoard(); a.push(entry); saveBoard(a); }
  function sameDay(a, b) { var x = new Date(a), y = new Date(b); return x.toDateString() === y.toDateString(); }

  function renderBoard() {
    Array.prototype.forEach.call(document.getElementById("boardTabs").querySelectorAll(".seg-opt"), function (b) {
      b.className = "seg-opt" + (b.getAttribute("data-board") === boardTab ? " active" : "");
    });
    var all = loadBoard(), now = Date.now();
    var filtered = all.filter(function (e) {
      if (boardTab === "daily") return sameDay(e.ts, now);
      if (boardTab === "weekly") return (now - e.ts) <= 7 * 86400000;
      return true;
    });
    filtered.sort(function (a, b) { return b.score - a.score; });
    var top = filtered.slice(0, 25);
    if (!top.length) { elBoardBody.innerHTML = '<div class="empty-note">No scores yet — finish a game to set one!</div>'; return; }
    var html = '<div class="board-list">';
    top.forEach(function (e, i) {
      html += '<div class="board-row' + (i < 3 ? " top3" : "") + '"><span class="brank">' + (i + 1) + "</span>" +
        '<span class="bname">' + esc(e.name) + "</span>" +
        '<span class="bres">' + esc(e.result || "") + " · " + (e.mode === "wc" ? "WC" : "League") + "</span>" +
        '<span class="bscore">' + e.score + "</span></div>";
    });
    elBoardBody.innerHTML = html + "</div>";
  }

  function newGame() {
    squad = []; current = null; awaitingPick = false; pendingPick = null; spinning = false; rerollsLeft = REROLLS;
    teamName = ""; managerId = "none"; formation = "4-3-3"; showRatings = true; pool = "all";
    elTeamName.value = "";
    elSquadPanel.style.display = "none"; elHint.textContent = "";
    renderManagerBar(); renderFormationBar(); renderRatingsToggle(); renderPoolToggle();
    paintPitches(); renderXI(); updateControls();
    showView("setup");
  }

  function runSim(type, userTeam) {
    lastSim = { type: type, userTeam: userTeam };
    elResultsBody.innerHTML = '<div class="loading">Simulating…</div>';
    showView("results");
    setTimeout(function () {
      var who = userTeam
        ? (userTeam.name + " · " + userTeam.formation + (userTeam.manager && userTeam.manager !== "No manager" ? " · " + userTeam.manager : ""))
        : "48 Nations";
      var html, score = null, result = null;
      if (type === "wc") {
        var wc = window.ENGINE.runWorldCup(userTeam);
        if (userTeam) { score = wcScore(wc); result = wc.userResult; html = renderWorldCupUser(wc, who + " · World Cup"); }
        else html = renderWorldCup(wc, who + " · World Cup");
      } else {
        var lg = window.ENGINE.runLeague(userTeam);
        if (userTeam) { score = leagueScore(lg); result = ordinal(lg.userPos) + " of " + lg.table.length; html = renderLeagueUser(lg, who + " · League"); }
        else html = renderLeague(lg, who + " · League");
      }
      if (userTeam && score != null) {
        addScore({ name: userTeam.name, score: score, result: result, mode: type, ts: Date.now() });
        html = '<div class="score-banner">🎯 Total score <b>' + score + "</b> <span>· " + esc(result) + " · saved to leaderboard</span></div>" + html;
      }
      elResultsBody.innerHTML = html;
      wireResults();
    }, 30);
  }

  // ================= WIRING =================
  elTeamName.addEventListener("input", function () { teamName = elTeamName.value; paintPitches(); renderXI(); });
  $("startBtn").addEventListener("click", startDraft);
  $("toSim").addEventListener("click", function () { showView("sim"); });
  $("draftBack").addEventListener("click", function () { paintPitches(); showView("setup"); });
  Array.prototype.forEach.call(document.querySelectorAll("[data-home]"), function (b) {
    b.addEventListener("click", function () { showView("setup"); });
  });

  elSpin.addEventListener("click", doSpin);
  elReroll.addEventListener("click", function () {
    if (rerollsLeft <= 0 || spinning) return;
    rerollsLeft--; doSpin();
  });
  $("clearBtn").addEventListener("click", clearAll);
  $("shareBtn").addEventListener("click", shareTeam);
  $("goWorldCup").addEventListener("click", function () { runSim("wc", userTeamFromSquad()); });
  $("goLeague").addEventListener("click", function () { runSim("league", userTeamFromSquad()); });
  $("simWorldCup").addEventListener("click", function () { runSim("wc", null); });
  $("simLeague").addEventListener("click", function () { runSim("league", null); });
  $("resultsBack").addEventListener("click", function () { showView(lastSim && lastSim.userTeam ? "draft" : "sim"); });
  $("newGameBtn").addEventListener("click", newGame);
  $("boardBtn").addEventListener("click", function () { renderBoard(); showView("board"); });
  $("toBoard").addEventListener("click", function () { renderBoard(); showView("board"); });
  $("boardBack").addEventListener("click", function () { showView("setup"); });
  $("clearBoardBtn").addEventListener("click", function () {
    if (window.confirm("Clear all saved leaderboard scores?")) { saveBoard([]); renderBoard(); }
  });
  Array.prototype.forEach.call(document.getElementById("boardTabs").querySelectorAll(".seg-opt"), function (b) {
    b.addEventListener("click", function () { boardTab = b.getAttribute("data-board"); renderBoard(); });
  });

  // ---- PWA ----
  var installBtn = $("installBtn");
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferredPrompt = e; if (installBtn) installBtn.hidden = false; });
  if (installBtn) installBtn.addEventListener("click", function () {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function () { deferredPrompt = null; installBtn.hidden = true; });
  });
  window.addEventListener("appinstalled", function () { if (installBtn) installBtn.hidden = true; });
  if ("serviceWorker" in navigator) window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });

  // ---- init ----
  renderManagerBar();
  renderFormationBar();
  renderRatingsToggle();
  renderPoolToggle();
  paintPitches();
  renderXI();
  updateControls();
  showView("setup");
})();
