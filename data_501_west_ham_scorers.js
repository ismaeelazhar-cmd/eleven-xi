/* data_501_west_ham_scorers.js — Football 501 category: West Ham United
 * all-time top scorers (career goals for the club, first-class matches).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of West Ham United F.C.
 *                         records and statistics" (leading first-class
 *                         goalscorers table)
 *   Cross-check source:  Vic Watson as West Ham's all-time record
 *                         goalscorer (326 goals, 1920-1935) is explicitly
 *                         stated on the same source page and is widely
 *                         reported general West Ham history knowledge.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.west_ham_scorers = {
  label: "West Ham United all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_West_Ham_United_F.C._records_and_statistics",
  rows: [
    { n: "Vic Watson",         v: 326 },
    { n: "Geoff Hurst",        v: 252 },
    { n: "John Dick",          v: 166 },
    { n: "Jimmy Ruffell",      v: 166 },
    { n: "Tony Cottee",        v: 146 },
    { n: "Johnny Byrne",       v: 107 },
    { n: "Pop Robson",         v: 104 },
    { n: "Trevor Brooking",    v: 102 },
    { n: "Malcolm Musgrove",   v: 100 },
    { n: "Martin Peters",      v: 100 },
    { n: "Michail Antonio",    v: 68  },
    { n: "Paolo Di Canio",     v: 47  },
    { n: "Frank Lampard Sr",   v: 24  }
  ]
};
