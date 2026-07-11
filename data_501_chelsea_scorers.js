/* data_501_chelsea_scorers.js — Football 501 category: Chelsea all-time
 * top scorers (career goals for the club, all competitions).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Chelsea F.C. records and
 *                         statistics" ("Overall scorers" table)
 *   Cross-check source:  Frank Lampard as Chelsea's all-time record
 *                         goalscorer (211 goals) is widely and
 *                         independently reported general football
 *                         knowledge.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.chelsea_scorers = {
  label: "Chelsea all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Chelsea_F.C._records_and_statistics",
  rows: [
    { n: "Frank Lampard",   v: 211 },
    { n: "Bobby Tambling",  v: 202 },
    { n: "Kerry Dixon",     v: 193 },
    { n: "Didier Drogba",   v: 164 },
    { n: "Roy Bentley",     v: 150 },
    { n: "Peter Osgood",    v: 150 },
    { n: "Jimmy Greaves",   v: 132 },
    { n: "George Mills",    v: 125 },
    { n: "Eden Hazard",     v: 110 },
    { n: "George Hilsdon",  v: 108 },
    { n: "Gianfranco Zola", v: 80  },
    { n: "Diego Costa",     v: 58  }
  ]
};
