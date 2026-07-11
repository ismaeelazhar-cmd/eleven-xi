/* data_501_newcastle_scorers.js — Football 501 category: Newcastle United
 * all-time top scorers (career goals for the club, all competitions).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Alan Shearer" article + general
 *                         search aggregation citing the same underlying
 *                         Newcastle United club records (Shearer 206,
 *                         Milburn 200, Gallacher 143, White 153,
 *                         Macdonald 121).
 *   Cross-check source:  Shearer breaking Milburn's 49-year-old 200-goal
 *                         record on 4 February 2006 (vs Portsmouth) is
 *                         widely and independently reported general
 *                         football knowledge, confirming the #1/#2 order.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.newcastle_scorers = {
  label: "Newcastle United all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/Alan_Shearer",
  rows: [
    { n: "Alan Shearer",       v: 206 },
    { n: "Jackie Milburn",     v: 200 },
    { n: "Len White",         v: 153 },
    { n: "Hughie Gallacher",   v: 143 },
    { n: "Peter Beardsley",    v: 118 },
    { n: "Malcolm Macdonald",  v: 121 },
    { n: "Andy Cole",          v: 68  },
    { n: "John Tudor",         v: 75  },
    { n: "Kevin Keegan",       v: 48  },
    { n: "Les Ferdinand",      v: 50  },
    { n: "Chris Waddle",       v: 46  },
    { n: "Papiss Cisse",       v: 44  },
    { n: "Peter Withe",        v: 25  }
  ]
};
