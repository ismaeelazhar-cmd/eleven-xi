/* Match + competition engine.
 * Simulates matches (with goal scorers/assisters + clean sheets for the user team),
 * a 48-team World Cup (groups → knockouts) and a 48-team league, and tracks the
 * user's game-by-game journey and tournament stats. The user is deliberately taxed
 * (DIFFICULTY) so winning is hard. */
window.ENGINE = (function () {
  "use strict";

  var DIFFICULTY = 8;        // points shaved off the user's attack & defence (harder)
  var ASSIST_CHANCE = 0.66;  // chance a goal has an assist

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function poisson(lambda) {
    var L = Math.exp(-lambda), k = 0, p = 1;
    do { k++; p *= Math.random(); } while (p > L);
    return k - 1;
  }

  function atkOf(t) { return t.atk != null ? t.atk : t.rating; }
  function defOf(t) { return t.def != null ? t.def : t.rating; }
  function overall(t) { return (atkOf(t) + defOf(t)) / 2; }

  function koTeam(t) {
    if (!t.koBonus) return t;
    return {
      name: t.name, flag: t.flag, rating: t.rating,
      atk: atkOf(t) + t.koBonus, def: defOf(t) + t.koBonus,
      isUser: t.isUser, koBonus: t.koBonus, players: t.players
    };
  }

  // ---- goal attribution (only the user team carries .players) ----
  var SCORE_W  = { GK: 0.02, DEF: 0.5, MID: 1.6, FWD: 4.0 };
  var ASSIST_W = { GK: 0.02, DEF: 0.8, MID: 2.5, FWD: 1.6 };

  function weightedPick(players, wKey, excludeName) {
    var total = 0, pool = [];
    for (var i = 0; i < players.length; i++) {
      var p = players[i];
      if (excludeName && p.n === excludeName) continue;
      var w = (wKey[p.p] || 0.1) * ((p.r || 80) / 80);
      if (w > 0) { pool.push([p, w]); total += w; }
    }
    if (!total) return null;
    var r = Math.random() * total;
    for (var j = 0; j < pool.length; j++) { r -= pool[j][1]; if (r <= 0) return pool[j][0]; }
    return pool[pool.length - 1][0];
  }

  function makeEvents(players, n) {
    if (!players || !players.length || !n) return [];
    var ev = [];
    for (var i = 0; i < n; i++) {
      var scorer = weightedPick(players, SCORE_W, null);
      var assist = Math.random() < ASSIST_CHANCE ? weightedPick(players, ASSIST_W, scorer ? scorer.n : null) : null;
      ev.push({ scorer: scorer ? scorer.n : "—", assist: assist ? assist.n : null });
    }
    return ev;
  }

  // ---- single match ----
  function simulateMatch(A, B, allowDraw) {
    var base = 1.3, scale = 24;
    var aAtk = atkOf(A) - (A.isUser ? DIFFICULTY : 0), aDef = defOf(A) - (A.isUser ? DIFFICULTY : 0);
    var bAtk = atkOf(B) - (B.isUser ? DIFFICULTY : 0), bDef = defOf(B) - (B.isUser ? DIFFICULTY : 0);
    var la = clamp(base * Math.exp((aAtk - bDef) / scale), 0.16, 5.5);
    var lb = clamp(base * Math.exp((bAtk - aDef) / scale), 0.16, 5.5);
    var ga = poisson(la), gb = poisson(lb);
    var res = { a: ga, b: gb, pens: null, winner: null };
    res.eventsA = A.players ? makeEvents(A.players, ga) : null;
    res.eventsB = B.players ? makeEvents(B.players, gb) : null;
    if (ga > gb) res.winner = "A";
    else if (gb > ga) res.winner = "B";
    else if (!allowDraw) {
      var ovA = overall(A) - (A.isUser ? DIFFICULTY : 0), ovB = overall(B) - (B.isUser ? DIFFICULTY : 0);
      var pA = 0.5 + (ovA - ovB) / 220;
      if (Math.random() < pA) { res.winner = "A"; res.pens = [ga + 1, gb]; res.pensWinner = "A"; }
      else { res.winner = "B"; res.pens = [ga, gb + 1]; res.pensWinner = "B"; }
    }
    return res;
  }

  function recordUserMatch(list, round, A, B, res) {
    var userIsA = A.isUser;
    var opp = userIsA ? B : A;
    var gf = userIsA ? res.a : res.b, ga = userIsA ? res.b : res.a;
    var events = (userIsA ? res.eventsA : res.eventsB) || [];
    var result;
    if (gf > ga) result = "W";
    else if (gf < ga) result = "L";
    else if (res.pens) result = (res.pensWinner === (userIsA ? "A" : "B")) ? "W" : "L";
    else result = "D";
    list.push({ round: round, opp: { name: opp.name, flag: opp.flag }, gf: gf, ga: ga,
      events: events, cleanSheet: ga === 0, pens: res.pens, result: result });
  }

  function buildField(userTeam) {
    var nations = window.NATIONS.map(function (n) {
      return { name: n.name, flag: n.flag, rating: n.rating, atk: n.rating, def: n.rating, isUser: false };
    });
    nations.sort(function (a, b) { return b.rating - a.rating; });
    if (userTeam) { nations = nations.slice(0, 47); nations.push(userTeam); }
    return nations;
  }

  function blankRow(team) { return { team: team, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 }; }
  function applyResult(rA, rB, ga, gb) {
    rA.P++; rB.P++;
    rA.GF += ga; rA.GA += gb; rB.GF += gb; rB.GA += ga;
    rA.GD = rA.GF - rA.GA; rB.GD = rB.GF - rB.GA;
    if (ga > gb) { rA.W++; rB.L++; rA.Pts += 3; }
    else if (gb > ga) { rB.W++; rA.L++; rB.Pts += 3; }
    else { rA.D++; rB.D++; rA.Pts++; rB.Pts++; }
  }
  function sortTable(rows) {
    rows.sort(function (x, y) {
      return (y.Pts - x.Pts) || (y.GD - x.GD) || (y.GF - x.GF) || (y.team.rating - x.team.rating);
    });
    return rows;
  }

  // ---- aggregate the user's tournament stats from their matches ----
  function aggregateStats(userMatches, userTeam) {
    var map = {}, posOf = {};
    (userTeam.players || []).forEach(function (p) { posOf[p.n] = p.p; });
    function ensure(n) { if (!map[n]) map[n] = { n: n, p: posOf[n] || "", g: 0, a: 0 }; return map[n]; }
    var cs = 0, gf = 0, ga = 0, w = 0, d = 0, l = 0;
    userMatches.forEach(function (m) {
      if (m.cleanSheet) cs++;
      gf += m.gf; ga += m.ga;
      if (m.result === "W") w++; else if (m.result === "L") l++; else d++;
      m.events.forEach(function (e) {
        if (e.scorer && e.scorer !== "—") ensure(e.scorer).g++;
        if (e.assist) ensure(e.assist).a++;
      });
    });
    var arr = Object.keys(map).map(function (k) { return map[k]; });
    var scorers = arr.filter(function (x) { return x.g > 0; }).sort(function (a, b) { return b.g - a.g || b.a - a.a; });
    var assisters = arr.filter(function (x) { return x.a > 0; }).sort(function (a, b) { return b.a - a.a || b.g - a.g; });
    var gk = null;
    (userTeam.players || []).forEach(function (p) { if (p.p === "GK" && (!gk || p.r > gk.r)) gk = p; });
    return { scorers: scorers, assisters: assisters, cleanSheets: cs, keeper: gk,
      gf: gf, ga: ga, w: w, d: d, l: l, games: userMatches.length };
  }

  // ---- World Cup ----
  function seedGroups(teams) {
    var sorted = teams.slice().sort(function (a, b) { return b.rating - a.rating; });
    var pots = [[], [], [], []];
    for (var i = 0; i < sorted.length; i++) pots[Math.floor(i / 12)].push(sorted[i]);
    pots.forEach(shuffle);
    var groups = [];
    for (var g = 0; g < 12; g++) {
      groups.push({ name: String.fromCharCode(65 + g), teams: [pots[0][g], pots[1][g], pots[2][g], pots[3][g]] });
    }
    return groups;
  }
  function playGroup(group, userMatches) {
    var rows = group.teams.map(blankRow), matches = [];
    for (var i = 0; i < group.teams.length; i++) {
      for (var j = i + 1; j < group.teams.length; j++) {
        var A = group.teams[i], B = group.teams[j];
        var r = simulateMatch(A, B, true);
        applyResult(rows[i], rows[j], r.a, r.b);
        matches.push({ a: A, b: B, ga: r.a, gb: r.b });
        if (userMatches && (A.isUser || B.isUser)) recordUserMatch(userMatches, "Group " + group.name, A, B, r);
      }
    }
    sortTable(rows);
    return { name: group.name, table: rows, matches: matches };
  }

  function runWorldCup(userTeam) {
    var field = buildField(userTeam);
    var userMatches = userTeam ? [] : null;
    var groups = seedGroups(field).map(function (g) { return playGroup(g, userMatches); });

    var qualified = [], thirds = [];
    groups.forEach(function (grp) {
      qualified.push(grp.table[0]); qualified.push(grp.table[1]); thirds.push(grp.table[2]);
    });
    sortTable(thirds);
    qualified = qualified.concat(thirds.slice(0, 8));
    qualified.sort(function (x, y) {
      return (y.Pts - x.Pts) || (y.GD - x.GD) || (y.GF - x.GF) || (y.team.rating - x.team.rating);
    });
    var seeds = qualified.map(function (r) { return r.team; });

    var roundTeams = [];
    for (var k = 0; k < 16; k++) { roundTeams.push(seeds[k]); roundTeams.push(seeds[31 - k]); }
    var roundNames = ["Round of 32", "Round of 16", "Quarter-finals", "Semi-finals", "Final"];
    var rounds = [], rIdx = 0;
    while (roundTeams.length > 1) {
      var ties = [], next = [], rname = roundNames[rIdx] || ("Round of " + roundTeams.length);
      for (var m = 0; m < roundTeams.length; m += 2) {
        var A = roundTeams[m], B = roundTeams[m + 1];
        var res = simulateMatch(koTeam(A), koTeam(B), false);
        var winner = res.winner === "A" ? A : B;
        ties.push({ a: A, b: B, res: res, winner: winner });
        next.push(winner);
        if (userMatches && (A.isUser || B.isUser)) recordUserMatch(userMatches, rname, A, B, res);
      }
      rounds.push({ name: rname, ties: ties });
      roundTeams = next; rIdx++;
    }
    var champion = roundTeams[0];

    var out = { groups: groups, qualified: qualified, rounds: rounds, champion: champion };
    if (userTeam) {
      out.userMatches = userMatches;
      out.userStats = aggregateStats(userMatches, userTeam);
      out.teamName = userTeam.name;
      if (champion && champion.isUser) out.userResult = "🏆 Champions!";
      else {
        var ko = userMatches.filter(function (mm) { return mm.round.indexOf("Group") !== 0; });
        if (!ko.length) out.userResult = "Eliminated in the Group stage";
        else {
          var lastR = ko[ko.length - 1].round;
          if (lastR === "Final") out.userResult = "🥈 Runners-up";
          else if (lastR === "Semi-finals") out.userResult = "Semi-finalists";
          else out.userResult = "Out in the " + lastR;
        }
      }
    }
    return out;
  }

  // ---- League ----
  function runLeague(userTeam) {
    var field = buildField(userTeam);
    var rows = field.map(blankRow), total = 0, userMatches = [];
    for (var i = 0; i < field.length; i++) {
      for (var j = i + 1; j < field.length; j++) {
        var A = field[i], B = field[j];
        var r = simulateMatch(A, B, true);
        applyResult(rows[i], rows[j], r.a, r.b);
        if (userTeam && (A.isUser || B.isUser)) recordUserMatch(userMatches, "Matchday", A, B, r);
        total++;
      }
    }
    sortTable(rows);
    var userRow = null, userPos = -1;
    if (userTeam) {
      for (var k = 0; k < rows.length; k++) if (rows[k].team.isUser) { userRow = rows[k]; userPos = k + 1; break; }
    }
    var out = { table: rows, totalMatches: total, userMatches: userMatches, userRow: userRow, userPos: userPos };
    if (userTeam) { out.userStats = aggregateStats(userMatches, userTeam); out.teamName = userTeam.name; }
    return out;
  }

  function teamRatingFromXI(squad) {
    if (!squad || !squad.length) return 80;
    var sum = 0; squad.forEach(function (s) { sum += (s.r || 80); });
    return Math.round(sum / squad.length);
  }

  return {
    teamRatingFromXI: teamRatingFromXI,
    simulateMatch: simulateMatch,
    runWorldCup: runWorldCup,
    runLeague: runLeague,
    DIFFICULTY: DIFFICULTY
  };
})();
