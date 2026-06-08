/* World Cup XI — controller: formation + draft + simulation UI */
(function () {
  "use strict";

  var DATA = window.WORLD_CUP_DATA;
  var COUNTRIES = Object.keys(DATA);
  var XI_SIZE = 11;
  var ITEM_H = 96; // matches .reel-item height in CSS

  // Formations: GK is always 1. Values are DEF / MID / FWD counts (sum + 1 = 11).
  var FORMATIONS = {
    "4-3-3":   { DEF: 4, MID: 3, FWD: 3 },
    "4-4-2":   { DEF: 4, MID: 4, FWD: 2 },
    "4-2-3-1": { DEF: 4, MID: 5, FWD: 1 },
    "3-5-2":   { DEF: 3, MID: 5, FWD: 2 },
    "3-4-1-2": { DEF: 3, MID: 5, FWD: 2 },
    "3-4-3":   { DEF: 3, MID: 4, FWD: 3 },
    "5-3-2":   { DEF: 5, MID: 3, FWD: 2 },
    "4-5-1":   { DEF: 4, MID: 5, FWD: 1 },
    "5-4-1":   { DEF: 5, MID: 4, FWD: 1 }
  };

  // Formation tilt: more forwards/midfield = attack, more defenders = defence.
  function formationTilt(name) {
    var f = FORMATIONS[name], SCALE = 2;
    var attackBias = (f.FWD - 2) + (f.MID - 4) * 0.5;
    var defenceBias = (f.DEF - 4);
    return { atk: attackBias * SCALE, def: defenceBias * SCALE };
  }
  function formationStyle(name) {
    var t = formationTilt(name);
    if (t.atk > t.def + 0.25) return "attacking";
    if (t.def > t.atk + 0.25) return "defensive";
    return "balanced";
  }
  var POS_LABEL = { GK: "Goalkeeper", DEF: "Defender", MID: "Midfielder", FWD: "Forward" };

  // Managers give the user's team a tactical bonus (atk/def) and/or a knockout bonus.
  var MANAGERS = [
    { id: "none",      emoji: "🎽", name: "No manager",     atk: 0,  def: 0,  ko: 0, desc: "No bonus — just the XI." },
    { id: "attack",    emoji: "⚔️", name: "Total Football",  atk: 4,  def: -2, ko: 0, desc: "+4 attack, −2 defence — all-out attack." },
    { id: "defence",   emoji: "🛡️", name: "Catenaccio",      atk: -2, def: 4,  ko: 0, desc: "+4 defence, −2 attack — shut up shop." },
    { id: "press",     emoji: "🔥", name: "Gegenpress",      atk: 2,  def: 2,  ko: 0, desc: "+2 attack, +2 defence — relentless intensity." },
    { id: "cup",       emoji: "🏆", name: "Cup Specialist",  atk: 0,  def: 0,  ko: 6, desc: "+6 in knockout games — a tournament master." },
    { id: "motivator", emoji: "🗣️", name: "The Motivator",   atk: 2,  def: 2,  ko: 2, desc: "+2 overall and +2 in knockouts — wins the big moments." }
  ];

  // ---- state ----
  var squad = [];
  var current = null;
  var spinning = false;
  var formation = "4-3-3";
  var teamName = "";
  var managerId = "none";
  var lastSim = null;
  var deferredPrompt = null;

  function currentManager() {
    for (var i = 0; i < MANAGERS.length; i++) if (MANAGERS[i].id === managerId) return MANAGERS[i];
    return MANAGERS[0];
  }
  function teamDisplayName() { return teamName.trim() || "My XI"; }

  // ---- elements ----
  var $ = function (id) { return document.getElementById(id); };
  var views = { home: $("homeView"), draft: $("draftView"), sim: $("simView"), results: $("resultsView") };
  var elCountryStrip = $("countryStrip"), elYearStrip = $("yearStrip");
  var elSpin = $("spinBtn"), elHint = $("hint"), elSquadPanel = $("squadPanel");
  var elXiList = $("xiList"), elXiCount = $("xiCount"), elFormation = $("formation");
  var elDone = $("doneBanner"), elRatingNote = $("ratingNote");
  var elResultsBody = $("resultsBody"), elFormationBar = $("formationBar");
  var elManagerBar = $("managerBar"), elManagerDesc = $("managerDesc"), elTeamName = $("teamName");

  function rand(a) { return a[Math.floor(Math.random() * a.length)]; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }

  function showView(name) {
    Object.keys(views).forEach(function (k) { views[k].style.display = "none"; });
    views[name].style.display = "block";
    if (window.scrollTo) window.scrollTo(0, 0);
  }

  // ---- formation helpers ----
  function req() {
    var f = FORMATIONS[formation];
    return { GK: 1, DEF: f.DEF, MID: f.MID, FWD: f.FWD };
  }
  function countGroup(g) {
    return squad.filter(function (s) { return s.p === g; }).length;
  }
  function groupFull(g) { return countGroup(g) >= req()[g]; }

  function renderFormationBar() {
    var html = "";
    Object.keys(FORMATIONS).forEach(function (name) {
      html += '<button class="formation-opt' + (name === formation ? " active" : "") +
              '" data-formation="' + name + '">' + name + "</button>";
    });
    elFormationBar.innerHTML = html;
    Array.prototype.forEach.call(elFormationBar.querySelectorAll(".formation-opt"), function (b) {
      b.addEventListener("click", function () { selectFormation(b.getAttribute("data-formation")); });
    });
  }

  function renderManagerBar() {
    var html = "";
    MANAGERS.forEach(function (m) {
      html += '<button class="manager-opt' + (m.id === managerId ? " active" : "") +
        '" data-manager="' + m.id + '" title="' + esc(m.desc) + '">' +
        '<span class="mgr-emoji">' + m.emoji + '</span><span class="mgr-name">' + m.name + "</span></button>";
    });
    elManagerBar.innerHTML = html;
    Array.prototype.forEach.call(elManagerBar.querySelectorAll(".manager-opt"), function (b) {
      b.addEventListener("click", function () { selectManager(b.getAttribute("data-manager")); });
    });
    elManagerDesc.textContent = currentManager().desc;
  }

  function selectManager(id) {
    managerId = id;
    renderManagerBar();
    renderXI();
  }

  function selectFormation(name) {
    if (!FORMATIONS[name]) return;
    formation = name;
    // trim any players that no longer fit the new shape (keep earliest drafted per group)
    var r = req(), counts = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
    squad = squad.filter(function (s) { counts[s.p]++; return counts[s.p] <= r[s.p]; });
    renderFormationBar();
    renderXI();
    renderSquadPicker();
  }

  // ================= SLOT MACHINE =================
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

  function doSpin() {
    if (spinning) return;
    spinning = true; elSpin.disabled = true;
    elDone.style.display = "none";
    elHint.textContent = "Spinning…";
    var country = rand(COUNTRIES);
    var year = rand(Object.keys(DATA[country].years));
    current = { country: country, year: year };
    var years = allYears();
    var p1 = spinReel(elCountryStrip, function () { return countryItemHTML(rand(COUNTRIES)); }, countryItemHTML(country), 2100);
    var p2 = spinReel(elYearStrip, function () { return yearItemHTML(rand(years)); }, yearItemHTML(year), 2600);
    Promise.all([p1, p2]).then(function () {
      spinning = false; elSpin.disabled = false; elHint.textContent = "";
      renderSquadPicker();
    });
  }

  function renderSquadPicker() {
    if (!current) return;
    var c = current.country, y = current.year;
    var players = DATA[c].years[y];
    var taken = squad.map(function (s) { return s.country + "|" + s.year + "|" + s.n; });

    var html = '<h2><span class="flag">' + DATA[c].flag + "</span>" + c + " &middot; " + y + " squad</h2>";
    html += '<div class="sub">Tap a player to fill an open slot in your ' + formation + ".</div>";
    if (squad.length >= XI_SIZE) {
      html += '<div class="empty-note">Your XI is full — remove someone or run a tournament below.</div>';
    } else {
      html += '<div class="players">';
      players.forEach(function (pl) {
        var isTaken = taken.indexOf(c + "|" + y + "|" + pl.n) !== -1;
        var noSlot = groupFull(pl.p);
        var disabled = isTaken || noSlot;
        var cls = "player" + (isTaken ? " taken" : "") + (noSlot && !isTaken ? " noslot" : "");
        html += '<div class="' + cls + '" data-name="' + esc(pl.n) + '" data-pos="' + pl.p + '">' +
                '<span class="pos ' + pl.p + '">' + pl.p + '</span><span class="pname">' + pl.n + "</span>" +
                (noSlot && !isTaken ? '<span class="slot-tag">full</span>' : "") + "</div>";
      });
      html += "</div>";
    }
    elSquadPanel.innerHTML = html;
    elSquadPanel.style.display = "block";
    Array.prototype.forEach.call(elSquadPanel.querySelectorAll(".player"), function (n) {
      n.addEventListener("click", function () {
        if (n.classList.contains("taken") || n.classList.contains("noslot")) {
          if (n.classList.contains("noslot")) elHint.textContent = "No open " + POS_LABEL[n.getAttribute("data-pos")] + " slots in a " + formation + ".";
          return;
        }
        pickPlayer(n.getAttribute("data-name"), n.getAttribute("data-pos"));
      });
    });
  }

  function pickPlayer(name, pos) {
    if (squad.length >= XI_SIZE || groupFull(pos)) return;
    squad.push({ n: name, p: pos, country: current.country, year: current.year });
    renderXI(); renderSquadPicker();
    if (squad.length < XI_SIZE) elHint.textContent = name + " drafted! Spin again.";
  }
  function removePlayer(i) { squad.splice(i, 1); renderXI(); renderSquadPicker(); }

  // ================= YOUR XI (slot-based) =================
  function renderXI() {
    elXiCount.textContent = squad.length + "/" + XI_SIZE;
    elFormation.textContent = "· " + formation;

    var r = req();
    var groups = ["GK", "DEF", "MID", "FWD"];
    var html = "";
    groups.forEach(function (g) {
      var filled = [];
      squad.forEach(function (s, i) { if (s.p === g) filled.push({ s: s, i: i }); });
      html += '<div class="line-label">' + POS_LABEL[g] + "s <span class=\"line-count\">" + filled.length + "/" + r[g] + "</span></div>";
      for (var k = 0; k < r[g]; k++) {
        if (k < filled.length) {
          var s = filled[k].s;
          html += '<div class="xi-row"><span class="pos ' + g + '">' + g + "</span>" +
            '<span class="info"><span class="pn">' + s.n + '</span><span class="meta">' +
            DATA[s.country].flag + " " + s.country + " &middot; " + s.year +
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

    var ready = squad.length >= 1;
    var full = squad.length >= XI_SIZE;
    $("goWorldCup").disabled = !ready;
    $("goLeague").disabled = !ready;
    $("shareBtn").disabled = !ready;
    elDone.style.display = full ? "block" : "none";
    if (full) elDone.textContent = "🏆 Full " + formation + " XI — ready to compete!";

    if (ready) {
      var rating = window.ENGINE.teamRatingFromXI(squad);
      var tilt = formationTilt(formation);
      var mgr = currentManager();
      var atk = Math.round(rating + tilt.atk + mgr.atk);
      var def = Math.round(rating + tilt.def + mgr.def);
      elRatingNote.textContent = teamDisplayName() + " · " + formation + " · " + mgr.emoji + " " + mgr.name +
        " · ATK " + atk + " / DEF " + def + (mgr.ko ? " · +" + mgr.ko + " KO" : "") +
        (full ? "" : "  — fill all 11 for full strength");
    } else {
      elRatingNote.textContent = "";
    }
  }

  function userTeamFromSquad() {
    var rating = window.ENGINE.teamRatingFromXI(squad);
    var tilt = formationTilt(formation);
    var mgr = currentManager();
    return {
      name: teamDisplayName(), flag: "⭐", rating: rating,
      atk: rating + tilt.atk + mgr.atk,
      def: rating + tilt.def + mgr.def,
      koBonus: mgr.ko,
      isUser: true, formation: formation, manager: mgr.name
    };
  }

  function shareTeam() {
    var order = { GK: 0, DEF: 1, MID: 2, FWD: 3 };
    var lines = squad.slice().sort(function (a, b) { return order[a.p] - order[b.p]; })
      .map(function (s) { return s.p + "  " + s.n + " (" + s.country + " " + s.year + ")"; });
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
    squad = []; current = null;
    elSquadPanel.style.display = "none";
    elHint.textContent = "";
    renderXI();
  }

  // ================= RESULTS =================
  function teamCell(t) {
    return '<span class="tname' + (t.isUser ? " me" : "") + '">' + t.flag + " " + esc(t.name) + "</span>";
  }

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
    html += renderGroups(result.groups);
    return html;
  }

  function ordinal(n) {
    var s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

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

  // Full 48-team view (Nation Simulator)
  function renderLeague(result, label) {
    var html = '<h2 class="res-title">' + label + "</h2>";
    html += '<div class="champion">🥇 Winners: ' + result.table[0].team.flag + " <b>" +
            esc(result.table[0].team.name) + "</b> · " + result.totalMatches + " matches played</div>";
    return html + leagueTableHTML(result);
  }

  // Focused view: only the user's games are shown; the rest are simulated in the
  // background and feed the (toggleable) full table.
  function renderLeagueUser(result, label) {
    var ur = result.userRow;
    var html = '<h2 class="res-title">' + label + "</h2>";
    html += '<div class="champion">⭐ Your XI finished <b>' + ordinal(result.userPos) + "</b> of " +
            result.table.length + " &middot; " + ur.W + "W " + ur.D + "D " + ur.L + "L &middot; " +
            ur.GF + "–" + ur.GA + " &middot; <b>" + ur.Pts + " pts</b></div>";
    html += '<h3 class="sec">Your fixtures <span class="legend-note">(' + result.userMatches.length +
            " games · other " + (result.totalMatches - result.userMatches.length) + " played in the background)</span></h3>";
    html += '<div class="fixtures">';
    result.userMatches.forEach(function (m, i) {
      html += '<div class="fixture ' + m.result + '"><span class="fnum">' + (i + 1) + "</span>" +
        '<span class="pill ' + m.result + '">' + m.result + "</span>" +
        '<span class="opp">vs ' + m.opp.flag + " " + esc(m.opp.name) + "</span>" +
        '<span class="fscore">' + m.gf + "–" + m.ga + "</span></div>";
    });
    html += "</div>";
    html += '<button class="btn-ghost" id="toggleTable">Show full 48-team table</button>';
    html += '<div id="fullTableWrap" style="display:none; margin-top:14px;">' + leagueTableHTML(result) + "</div>";
    return html;
  }

  function wireResults() {
    var tg = document.getElementById("toggleTable");
    if (tg) {
      tg.addEventListener("click", function () {
        var w = document.getElementById("fullTableWrap");
        var shown = w.style.display !== "none";
        w.style.display = shown ? "none" : "block";
        tg.textContent = shown ? "Show full 48-team table" : "Hide full table";
      });
    }
  }

  function runSim(type, userTeam) {
    lastSim = { type: type, userTeam: userTeam };
    elResultsBody.innerHTML = '<div class="loading">Simulating…</div>';
    showView("results");
    setTimeout(function () {
      var who = userTeam
        ? (userTeam.name + " · " + userTeam.formation + (userTeam.manager && userTeam.manager !== "No manager" ? " · " + userTeam.manager : ""))
        : "48 Nations";
      if (type === "wc") {
        elResultsBody.innerHTML = renderWorldCup(window.ENGINE.runWorldCup(userTeam), who + " · World Cup");
      } else {
        var res = window.ENGINE.runLeague(userTeam);
        elResultsBody.innerHTML = userTeam
          ? renderLeagueUser(res, who + " · League")
          : renderLeague(res, who + " · League");
      }
      wireResults();
    }, 30);
  }

  // ================= WIRING =================
  $("modeDraft").addEventListener("click", function () { showView("draft"); });
  $("modeSim").addEventListener("click", function () { showView("sim"); });
  Array.prototype.forEach.call(document.querySelectorAll("[data-home]"), function (b) {
    b.addEventListener("click", function () { showView("home"); });
  });

  elSpin.addEventListener("click", doSpin);
  $("clearBtn").addEventListener("click", clearAll);
  $("shareBtn").addEventListener("click", shareTeam);
  $("goWorldCup").addEventListener("click", function () { runSim("wc", userTeamFromSquad()); });
  $("goLeague").addEventListener("click", function () { runSim("league", userTeamFromSquad()); });
  $("simWorldCup").addEventListener("click", function () { runSim("wc", null); });
  $("simLeague").addEventListener("click", function () { runSim("league", null); });
  $("resultsBack").addEventListener("click", function () { showView(lastSim && lastSim.userTeam ? "draft" : "sim"); });
  $("resimBtn").addEventListener("click", function () { if (lastSim) runSim(lastSim.type, lastSim.userTeam); });

  // ---- PWA: install prompt + service worker ----
  var installBtn = $("installBtn");
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.hidden = false;
  });
  if (installBtn) {
    installBtn.addEventListener("click", function () {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function () { deferredPrompt = null; installBtn.hidden = true; });
    });
  }
  window.addEventListener("appinstalled", function () { if (installBtn) installBtn.hidden = true; });
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }

  // team name input
  elTeamName.addEventListener("input", function () {
    teamName = elTeamName.value;
    if (squad.length) renderXI();
  });

  // ---- init ----
  renderManagerBar();
  renderFormationBar();
  elCountryStrip.innerHTML = countryItemHTML(rand(COUNTRIES));
  elYearStrip.innerHTML = yearItemHTML(Object.keys(DATA[COUNTRIES[0]].years)[0]);
  renderXI();
  showView("home");
})();
