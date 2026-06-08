/* Match + competition engine: simulates matches, group stage, knockouts and a 48-team league. */
window.ENGINE = (function () {
  "use strict";

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Knuth's Poisson sampler
  function poisson(lambda) {
    var L = Math.exp(-lambda), k = 0, p = 1;
    do { k++; p *= Math.random(); } while (p > L);
    return k - 1;
  }

  // Derive a strength rating for the user's drafted XI from its balance.
  function teamRatingFromXI(squad) {
    if (!squad || !squad.length) return 80;
    var g = 0, d = 0, m = 0, f = 0;
    squad.forEach(function (s) {
      if (s.p === "GK") g++; else if (s.p === "DEF") d++;
      else if (s.p === "MID") m++; else f++;
    });
    var rating = 82;
    if (g >= 1) rating += 2;            // has a keeper
    if (d >= 3) rating += 2;            // a back line
    if (m >= 3) rating += 2;            // a midfield
    if (f >= 1) rating += 1;            // an attacker
    if (g === 0) rating -= 6;           // no keeper hurts
    if (squad.length >= 11) rating += 1;
    return clamp(rating, 70, 92);
  }

  // Attack / defence ratings (formations set these; nations default to overall rating).
  function atkOf(t) { return t.atk != null ? t.atk : t.rating; }
  function defOf(t) { return t.def != null ? t.def : t.rating; }
  function overall(t) { return (atkOf(t) + defOf(t)) / 2; }

  // A manager's "cup specialist" bonus only applies in knockout matches.
  function koTeam(t) {
    if (!t.koBonus) return t;
    return {
      name: t.name, flag: t.flag, rating: t.rating,
      atk: atkOf(t) + t.koBonus, def: defOf(t) + t.koBonus,
      isUser: t.isUser, koBonus: t.koBonus
    };
  }

  // Simulate one match. allowDraw=false forces a winner (penalties).
  // A team's goals come from ITS attack vs the OPPONENT's defence, so attacking
  // formations score more but concede more, and vice-versa.
  function simulateMatch(A, B, allowDraw) {
    var base = 1.3, scale = 24;
    var la = clamp(base * Math.exp((atkOf(A) - defOf(B)) / scale), 0.16, 5.5);
    var lb = clamp(base * Math.exp((atkOf(B) - defOf(A)) / scale), 0.16, 5.5);
    var ga = poisson(la), gb = poisson(lb);
    var res = { a: ga, b: gb, pens: null, winner: null };
    if (ga > gb) res.winner = "A";
    else if (gb > ga) res.winner = "B";
    else if (!allowDraw) {
      // penalty shootout, slightly weighted by overall strength
      var pA = 0.5 + (overall(A) - overall(B)) / 220;
      if (Math.random() < pA) { res.winner = "A"; res.pens = [ga + 1, gb]; }
      else { res.winner = "B"; res.pens = [ga, gb + 1]; }
      res.pensWinner = res.winner;
    }
    return res;
  }

  // Build the 48-team field. If userTeam given, it takes a slot (drop weakest nation).
  function buildField(userTeam) {
    var nations = window.NATIONS.map(function (n) {
      return { name: n.name, flag: n.flag, rating: n.rating, atk: n.rating, def: n.rating, isUser: false };
    });
    nations.sort(function (a, b) { return b.rating - a.rating; });
    if (userTeam) {
      nations = nations.slice(0, 47); // drop the lowest-rated nation
      nations.push(userTeam);
    }
    return nations;
  }

  function blankRow(team) {
    return { team: team, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 };
  }
  function applyResult(rowA, rowB, ga, gb) {
    rowA.P++; rowB.P++;
    rowA.GF += ga; rowA.GA += gb; rowB.GF += gb; rowB.GA += ga;
    rowA.GD = rowA.GF - rowA.GA; rowB.GD = rowB.GF - rowB.GA;
    if (ga > gb) { rowA.W++; rowB.L++; rowA.Pts += 3; }
    else if (gb > ga) { rowB.W++; rowA.L++; rowB.Pts += 3; }
    else { rowA.D++; rowB.D++; rowA.Pts++; rowB.Pts++; }
  }
  function sortTable(rows) {
    rows.sort(function (x, y) {
      return (y.Pts - x.Pts) || (y.GD - x.GD) || (y.GF - x.GF) ||
             (y.team.rating - x.team.rating);
    });
    return rows;
  }

  // ---- World Cup: 12 groups of 4, then knockouts ----
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

  function playGroup(group) {
    var rows = group.teams.map(blankRow);
    var idx = {};
    group.teams.forEach(function (t, i) { idx[t.name] = i; });
    var matches = [];
    for (var i = 0; i < group.teams.length; i++) {
      for (var j = i + 1; j < group.teams.length; j++) {
        var r = simulateMatch(group.teams[i], group.teams[j], true);
        applyResult(rows[i], rows[j], r.a, r.b);
        matches.push({ a: group.teams[i], b: group.teams[j], ga: r.a, gb: r.b });
      }
    }
    sortTable(rows);
    return { name: group.name, table: rows, matches: matches };
  }

  function runWorldCup(userTeam) {
    var field = buildField(userTeam);
    var groups = seedGroups(field).map(playGroup);

    var qualified = [];
    var thirds = [];
    groups.forEach(function (grp) {
      qualified.push(grp.table[0]); // winner
      qualified.push(grp.table[1]); // runner-up
      thirds.push(grp.table[2]);    // third
    });
    sortTable(thirds);
    var bestThirds = thirds.slice(0, 8);
    qualified = qualified.concat(bestThirds);

    // Seed the 32 qualifiers (winners > runners-up > thirds, then by points/GD)
    qualified.sort(function (x, y) {
      return (y.Pts - x.Pts) || (y.GD - x.GD) || (y.GF - x.GF) ||
             (y.team.rating - x.team.rating);
    });
    var seeds = qualified.map(function (r) { return r.team; });

    // Standard bracket pairing: 1v32, 2v31 ... for round of 32
    var roundTeams = [];
    for (var k = 0; k < 16; k++) { roundTeams.push(seeds[k]); roundTeams.push(seeds[31 - k]); }

    var roundNames = ["Round of 32", "Round of 16", "Quarter-finals", "Semi-finals", "Final"];
    var rounds = [];
    var rIdx = 0;
    while (roundTeams.length > 1) {
      var ties = [];
      var next = [];
      for (var m = 0; m < roundTeams.length; m += 2) {
        var A = roundTeams[m], B = roundTeams[m + 1];
        var res = simulateMatch(koTeam(A), koTeam(B), false); // cup-specialist bonus applies here
        var winner = res.winner === "A" ? A : B;
        ties.push({ a: A, b: B, res: res, winner: winner });
        next.push(winner);
      }
      rounds.push({ name: roundNames[rIdx] || ("Round of " + roundTeams.length), ties: ties });
      roundTeams = next;
      rIdx++;
    }
    return { groups: groups, qualified: qualified, rounds: rounds, champion: roundTeams[0] };
  }

  // ---- League: all 48 play each other once ----
  // Every match is simulated (the "background" games count toward the table),
  // but the user's own fixtures are recorded separately for a focused view.
  function runLeague(userTeam) {
    var field = buildField(userTeam);
    var rows = field.map(blankRow);
    var total = 0;
    var userMatches = [];
    for (var i = 0; i < field.length; i++) {
      for (var j = i + 1; j < field.length; j++) {
        var A = field[i], B = field[j];
        var r = simulateMatch(A, B, true);
        applyResult(rows[i], rows[j], r.a, r.b);
        if (userTeam && (A.isUser || B.isUser)) {
          var opp = A.isUser ? B : A;
          var gf = A.isUser ? r.a : r.b;
          var ga = A.isUser ? r.b : r.a;
          userMatches.push({ opp: opp, gf: gf, ga: ga, result: gf > ga ? "W" : (gf < ga ? "L" : "D") });
        }
        total++;
      }
    }
    sortTable(rows);
    var userRow = null, userPos = -1;
    if (userTeam) {
      for (var k = 0; k < rows.length; k++) {
        if (rows[k].team.isUser) { userRow = rows[k]; userPos = k + 1; break; }
      }
    }
    return { table: rows, totalMatches: total, userMatches: userMatches, userRow: userRow, userPos: userPos };
  }

  return {
    teamRatingFromXI: teamRatingFromXI,
    simulateMatch: simulateMatch,
    runWorldCup: runWorldCup,
    runLeague: runLeague
  };
})();
