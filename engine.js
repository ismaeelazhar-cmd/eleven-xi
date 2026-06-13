/* Match + competition engine.
 * Simulates matches (with goal scorers/assisters + clean sheets for the user team),
 * a 48-team World Cup (groups → knockouts) and a 48-team league, and tracks the
 * user's game-by-game journey and tournament stats. The user is deliberately taxed
 * (DIFFICULTY) so winning is hard. */
window.ENGINE = (function () {
  "use strict";

  var DIFFICULTY = -10;         // WC/Euros: user gets a +10 bonus → easy to qualify & reach the Final; Final itself is near-impossible to win
  var LEAGUE_DIFFICULTY = -8;  // League: user gets +8 bonus → winning the league is very achievable
  var activeTax = DIFFICULTY;  // set per competition
  // KO escalation applied ON TOP of DIFFICULTY each knockout round.
  // R32/R16 are easy (reach QF roughly 50% of the time), SF is hard, Final is nearly impossible.
  var KO_ESCALATION = [0, 0, 0, 5, 45]; // R32, R16, QF, SF, Final
  // Upset variance for league: random chance of flipping a user win to draw/loss.
  // Prevents unbeaten seasons (38-0-0 / 34-0-0) while keeping winning the league very achievable.
  var LEAGUE_UPSET_CHANCE = 0.14; // 14% of user wins become draws/losses
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

  function koTeam(t, roundPen) {
    roundPen = roundPen || 0;
    if (!t.koBonus && !t.isUser) return t;
    var atk = atkOf(t), def = defOf(t);
    if (t.koBonus) { atk += t.koBonus; def += t.koBonus; }
    if (t.isUser) { atk -= roundPen; def -= roundPen; } // escalating tax hits only the user
    return {
      name: t.name, flag: t.flag, rating: t.rating, atk: atk, def: def,
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
    var aAtk = atkOf(A) - (A.isUser ? activeTax : 0), aDef = defOf(A) - (A.isUser ? activeTax : 0);
    var bAtk = atkOf(B) - (B.isUser ? activeTax : 0), bDef = defOf(B) - (B.isUser ? activeTax : 0);
    var la = clamp(base * Math.exp((aAtk - bDef) / scale), 0.16, 5.5);
    var lb = clamp(base * Math.exp((bAtk - aDef) / scale), 0.16, 5.5);
    var ga = poisson(la), gb = poisson(lb);
    var res = { a: ga, b: gb, pens: null, winner: null };
    res.eventsA = A.players ? makeEvents(A.players, ga) : null;
    res.eventsB = B.players ? makeEvents(B.players, gb) : null;
    if (ga > gb) res.winner = "A";
    else if (gb > ga) res.winner = "B";
    else if (!allowDraw) {
      var ovA = overall(A) - (A.isUser ? activeTax : 0), ovB = overall(B) - (B.isUser ? activeTax : 0);
      var pA = 0.5 + (ovA - ovB) / 220;
      if (Math.random() < pA) { res.winner = "A"; res.pens = [ga + 1, gb]; res.pensWinner = "A"; }
      else { res.winner = "B"; res.pens = [ga, gb + 1]; res.pensWinner = "B"; }
    }

    // League upset variance: if user won, apply a random chance to flip to draw/loss.
    // This prevents 38-0-0 seasons while keeping winning the league very achievable.
    if (activeTax === LEAGUE_DIFFICULTY && allowDraw && (A.isUser || B.isUser)) {
      var userIsA = A.isUser;
      var userGoals = userIsA ? res.a : res.b, oppGoals = userIsA ? res.b : res.a;
      if (userGoals > oppGoals && Math.random() < LEAGUE_UPSET_CHANCE) {
        // Turn the win into a draw or narrow loss
        var flip = Math.random();
        if (flip < 0.6) {
          // Draw: lower the user's score to match opponent
          if (userIsA) { res.a = res.b; } else { res.b = res.a; }
          res.winner = null;
        } else {
          // Loss: give opponent one extra goal
          if (userIsA) { res.a = Math.max(0, res.b - 1); } else { res.b = Math.max(0, res.a - 1); }
          res.winner = userIsA ? "B" : "A";
        }
      }
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

  /* runWorldCupFromGroups: accepts a pre-drawn rawGroups array so the group preview
   * shown to the user matches what actually gets simulated. */
  function runWorldCupFromGroups(field, rawGroups, userTeam) {
    activeTax = DIFFICULTY;
    var userMatches = userTeam ? [] : null;
    var groups = rawGroups.map(function (g) { return playGroup(g, userMatches); });
    return _finishWorldCup(groups, userMatches, userTeam);
  }

  function _finishWorldCup(groups, userMatches, userTeam) {
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
      var pen = KO_ESCALATION[rIdx] != null ? KO_ESCALATION[rIdx] : KO_ESCALATION[KO_ESCALATION.length - 1];
      for (var m = 0; m < roundTeams.length; m += 2) {
        var A = roundTeams[m], B = roundTeams[m + 1];
        var res = simulateMatch(koTeam(A, pen), koTeam(B, pen), false);
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
      if (champion && champion.isUser) out.userResult = "Champions!";
      else {
        var ko = userMatches.filter(function (mm) { return mm.round.indexOf("Group") !== 0; });
        if (!ko.length) out.userResult = "Eliminated in the Group stage";
        else {
          var lastR = ko[ko.length - 1].round;
          if (lastR === "Final") out.userResult = "Runners-up";
          else if (lastR === "Semi-finals") out.userResult = "Semi-finalists";
          else out.userResult = "Out in the " + lastR;
        }
      }
    }
    return out;
  }

  function runWorldCup(userTeam) {
    activeTax = DIFFICULTY;
    var field = buildField(userTeam);
    var userMatches = userTeam ? [] : null;
    var groups = seedGroups(field).map(function (g) { return playGroup(g, userMatches); });
    return _finishWorldCup(groups, userMatches, userTeam);
  }

  // ---- League ----
  // Full round-robin league on a given field (each pair once).
  function leagueOn(field, userTeam) {
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
    if (userTeam) for (var k = 0; k < rows.length; k++) if (rows[k].team.isUser) { userRow = rows[k]; userPos = k + 1; break; }
    var out = { table: rows, totalMatches: total, userMatches: userMatches, userRow: userRow, userPos: userPos };
    if (userTeam) {
      out.userStats = aggregateStats(userMatches, userTeam);
      out.teamName = userTeam.name;
      var uo = overall(userTeam), better = 0;
      field.forEach(function (t) { if (!t.isUser && overall(t) > uo) better++; });
      out.expectedPos = better + 1;
      out.squadRating = Math.round(userTeam.rating);
    }
    return out;
  }
  function runLeague(userTeam) { activeTax = LEAGUE_DIFFICULTY; return leagueOn(buildField(userTeam), userTeam); }

  // ===================== Champions League =====================
  function buildFieldFrom(list, userTeam, size) {
    var teams = list.map(function (n) { return { name: n.name, flag: n.flag, rating: n.rating, atk: n.rating, def: n.rating, isUser: false }; });
    teams.sort(function (a, b) { return b.rating - a.rating; });
    if (userTeam) { teams = teams.slice(0, size - 1); teams.push(userTeam); } else teams = teams.slice(0, size);
    return teams;
  }
  function roundRobinRounds(n) { // returns first n-1 rounds of pairings (indices)
    var t = []; for (var i = 0; i < n; i++) t.push(i);
    var rounds = [];
    for (var r = 0; r < n - 1; r++) {
      var round = [];
      for (var k = 0; k < n / 2; k++) round.push([t[k], t[n - 1 - k]]);
      rounds.push(round);
      t.splice(1, 0, t.pop());
    }
    return rounds;
  }
  function oneRound(roundTeams, rname, userMatches, pen) {
    var ties = [], next = [];
    for (var m = 0; m < roundTeams.length; m += 2) {
      var A = roundTeams[m], B = roundTeams[m + 1];
      var res = simulateMatch(koTeam(A, pen || 0), koTeam(B, pen || 0), false);
      var winner = res.winner === "A" ? A : B;
      ties.push({ a: A, b: B, res: res, winner: winner }); next.push(winner);
      if (userMatches && (A.isUser || B.isUser)) recordUserMatch(userMatches, rname, A, B, res);
    }
    return { round: { name: rname, ties: ties }, winners: next };
  }
  function knockoutRounds(roundTeams, roundNames, userMatches, esc) {
    esc = esc || []; var rounds = [], rIdx = 0;
    while (roundTeams.length > 1) {
      var rname = roundNames[rIdx] || ("Round of " + roundTeams.length);
      var rr = oneRound(roundTeams, rname, userMatches, esc[rIdx] || 0);
      rounds.push(rr.round); roundTeams = rr.winners; rIdx++;
    }
    return { rounds: rounds, champion: roundTeams[0] };
  }
  function seedBracket(teams) { // 1v(n), 2v(n-1)...
    var out = []; for (var k = 0; k < teams.length / 2; k++) { out.push(teams[k]); out.push(teams[teams.length - 1 - k]); } return out;
  }
  function userKOResult(userTeam, champion, userMatches, groupTag, phaseLabel) {
    if (!userTeam) return null;
    if (champion && champion.isUser) return "Champions of Europe!";
    var ko = userMatches.filter(function (m) { return m.round.indexOf(groupTag) !== 0 && m.round !== "Matchday"; });
    if (!ko.length) return "Out in the " + (phaseLabel || "league phase");
    var last = ko[ko.length - 1].round;
    if (last === "Final") return "Runners-up";
    if (last === "Semi-finals") return "Semi-finalists";
    return "Out in the " + last;
  }

  // 36-team single league (each plays each once)
  function runCLLeague(userTeam) { activeTax = LEAGUE_DIFFICULTY; return leagueOn(buildFieldFrom(window.CL_CLUBS, userTeam, 36), userTeam); }

  // Old format: 8 groups of 4, home & away, top 2 → Round of 16 knockouts
  function runCLGroups(userTeam) {
    activeTax = DIFFICULTY;
    var field = buildFieldFrom(window.CL_CLUBS, userTeam, 32);
    var userMatches = userTeam ? [] : null;
    var sorted = field.slice().sort(function (a, b) { return b.rating - a.rating; });
    var pots = [[], [], [], []];
    for (var i = 0; i < sorted.length; i++) pots[Math.floor(i / 8)].push(sorted[i]);
    pots.forEach(shuffle);
    var groups = [];
    for (var g = 0; g < 8; g++) {
      var gteams = [pots[0][g], pots[1][g], pots[2][g], pots[3][g]];
      var rows = gteams.map(blankRow);
      for (var a = 0; a < 4; a++) for (var b = a + 1; b < 4; b++) {
        var r1 = simulateMatch(gteams[a], gteams[b], true);
        applyResult(rows[a], rows[b], r1.a, r1.b);
        if (userMatches && (gteams[a].isUser || gteams[b].isUser)) recordUserMatch(userMatches, "Group " + String.fromCharCode(65 + g), gteams[a], gteams[b], r1);
        var r2 = simulateMatch(gteams[b], gteams[a], true);
        applyResult(rows[b], rows[a], r2.a, r2.b);
        if (userMatches && (gteams[a].isUser || gteams[b].isUser)) recordUserMatch(userMatches, "Group " + String.fromCharCode(65 + g), gteams[b], gteams[a], r2);
      }
      sortTable(rows);
      groups.push({ name: String.fromCharCode(65 + g), table: rows, teams: gteams });
    }
    var quals = [];
    groups.forEach(function (grp) { quals.push(grp.table[0]); quals.push(grp.table[1]); });
    quals.sort(function (x, y) { return (y.Pts - x.Pts) || (y.GD - x.GD) || (y.GF - x.GF) || (y.team.rating - x.team.rating); });
    var seeds = seedBracket(quals.map(function (q) { return q.team; }));
    var ko = knockoutRounds(seeds, ["Round of 16", "Quarter-finals", "Semi-finals", "Final"], userMatches, [0, 2, 4, 6]);
    var out = { groups: groups, rounds: ko.rounds, champion: ko.champion };
    if (userTeam) { out.userMatches = userMatches; out.userStats = aggregateStats(userMatches, userTeam); out.teamName = userTeam.name; out.userResult = userKOResult(userTeam, ko.champion, userMatches, "Group", "group stage"); }
    return out;
  }

  // New (Swiss) format: 36-team league phase (8 games), top 8 → R16, 9-24 → playoff, then knockouts
  function runCLSwiss(userTeam) {
    activeTax = LEAGUE_DIFFICULTY;
    var field = buildFieldFrom(window.CL_CLUBS, userTeam, 36);
    var rows = field.map(blankRow), userMatches = userTeam ? [] : null, total = 0;
    var rr = roundRobinRounds(36);
    for (var r = 0; r < 8; r++) rr[r].forEach(function (pair) {
      var A = field[pair[0]], B = field[pair[1]];
      var res = simulateMatch(A, B, true);
      applyResult(rows[pair[0]], rows[pair[1]], res.a, res.b);
      if (userMatches && (A.isUser || B.isUser)) recordUserMatch(userMatches, "League phase", A, B, res);
      total++;
    });
    sortTable(rows);
    activeTax = DIFFICULTY; // knockouts are hard
    var teamsByRank = rows.map(function (x) { return x.team; });
    var top8 = teamsByRank.slice(0, 8);
    var playoffTeams = teamsByRank.slice(8, 24);
    var po = oneRound(seedBracket(playoffTeams), "Knockout playoff", userMatches, 0);
    var r16Teams = seedBracket(top8.concat(po.winners));
    var ko = knockoutRounds(r16Teams, ["Round of 16", "Quarter-finals", "Semi-finals", "Final"], userMatches, [0, 2, 4, 6]);
    var userRow = null, userPos = -1;
    if (userTeam) for (var k = 0; k < rows.length; k++) if (rows[k].team.isUser) { userRow = rows[k]; userPos = k + 1; break; }
    var out = { table: rows, totalMatches: total, rounds: [po.round].concat(ko.rounds), champion: ko.champion, leaguePhase: true, userRow: userRow, userPos: userPos };
    if (userTeam) {
      out.userMatches = userMatches; out.userStats = aggregateStats(userMatches, userTeam); out.teamName = userTeam.name;
      out.userResult = userKOResult(userTeam, ko.champion, userMatches, "League phase", "league phase");
      out.squadRating = Math.round(userTeam.rating);
    }
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
    buildField: buildField,
    seedGroups: seedGroups,
    runWorldCup: runWorldCup,
    runWorldCupFromGroups: runWorldCupFromGroups,
    runLeague: runLeague,
    runCLLeague: runCLLeague,
    runCLGroups: runCLGroups,
    runCLSwiss: runCLSwiss,
    DIFFICULTY: DIFFICULTY
  };
})();
