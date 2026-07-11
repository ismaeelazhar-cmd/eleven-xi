/* data_501_everton_scorers.js — Football 501 category: Everton all-time
 * top scorers (career goals for the club, all competitions).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Everton F.C. records and
 *                         statistics" ("Top scorers (all competitions)"
 *                         table)
 *   Cross-check source:  Dixie Dean's 383 goals as the all-time club and
 *                         top-flight single-season (60 goals in 1927-28)
 *                         record is widely and independently reported
 *                         general football knowledge.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.everton_scorers = {
  label: "Everton all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Everton_F.C._records_and_statistics",
  rows: [
    { n: "Dixie Dean",      v: 383 },
    { n: "Graeme Sharp",    v: 160 },
    { n: "Bob Latchford",   v: 138 },
    { n: "Alex Young",      v: 126 },
    { n: "Joe Royle",       v: 119 },
    { n: "Roy Vernon",      v: 111 },
    { n: "Dave Hickson",    v: 109 },
    { n: "Edgar Chadwick",  v: 104 },
    { n: "Tony Cottee",     v: 99  },
    { n: "Alf Milward",     v: 98  }
  ]
};
