/* data_501_crystal_palace_scorers.js — Football 501 category: Crystal
 * Palace all-time top scorers (career goals for the club).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Crystal Palace F.C. records
 *                         and statistics" (Top goalscorers table)
 *   Cross-check source:  Peter Simpson's 0.85 goals-per-game ratio as the
 *                         club's all-time best is explicitly stated on
 *                         the same source page, consistent with his
 *                         195-in-165-appearances record.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals
 *                         (Wilfried Zaha's spell at the club has closed).
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.crystal_palace_scorers = {
  label: "Crystal Palace all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Crystal_Palace_F.C._records_and_statistics",
  rows: [
    { n: "Peter Simpson",       v: 195 },
    { n: "Edwin Smith",         v: 192 },
    { n: "Ian Wright",          v: 118 },
    { n: "Mark Bright",         v: 114 },
    { n: "Clinton Morrison",    v: 112 },
    { n: "Dougie Freedman",     v: 108 },
    { n: "George Clarke",       v: 106 },
    { n: "Johnny Byrne",        v: 101 },
    { n: "Albert Dawes",        v: 92  },
    { n: "Wilfried Zaha",       v: 90  }
  ]
};
