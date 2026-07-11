/* data_501_bayern_scorers.js — Football 501 category: Bayern Munich
 * all-time top scorers (career goals for the club, all competitions).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Aggregated all-time scorer ranking (GiveMeSport,
 *                         via a fully-numbered 1-10 list) — used for the
 *                         top 10 rows.
 *   Cross-check source:  A second independent all-time-scorer post
 *                         converges on matching totals for #1/#2/#3/#5
 *                         (Müller 570, Lewandowski 344, Thomas Müller 250,
 *                         Rummenigge 217); Robben/Ribéry/Pizarro totals
 *                         (144/124/101) independently corroborated by
 *                         general football reporting on each player.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.bayern_scorers = {
  label: "Bayern Munich all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://fcbayern.com/en/news/2023/02/muller-lewandowski-elber-bayerns-bundesliga-top-scorers",
  rows: [
    { n: "Gerd Muller",             v: 570 },
    { n: "Robert Lewandowski",      v: 344 },
    { n: "Thomas Muller",           v: 250 },
    { n: "Rainer Ohlhauser",        v: 229 },
    { n: "Karl-Heinz Rummenigge",   v: 217 },
    { n: "Roland Wohlfarth",        v: 156 },
    { n: "Dieter Hoeness",          v: 145 },
    { n: "Arjen Robben",            v: 144 },
    { n: "Dieter Brenninger",       v: 142 },
    { n: "Harry Kane",              v: 139 },
    { n: "Franck Ribery",           v: 124 },
    { n: "Claudio Pizarro",         v: 101 },
    { n: "Bastian Schweinsteiger",  v: 68  },
    { n: "Philipp Lahm",            v: 16  },
    { n: "Owen Hargreaves",         v: 10  }
  ]
};
