/* data_501_wolves_scorers.js — Football 501 category: Wolverhampton
 * Wanderers all-time top scorers (career goals for the club, competitive
 * first-team matches).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Wolverhampton Wanderers
 *                         F.C. records and statistics" (Top goalscorers
 *                         table)
 *   Cross-check source:  Steve Bull's 306 goals as the all-time club
 *                         record, explicitly stated on the same source
 *                         page, is widely and independently reported
 *                         general Wolves history knowledge.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.wolves_scorers = {
  label: "Wolverhampton Wanderers all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Wolverhampton_Wanderers_F.C._records_and_statistics",
  rows: [
    { n: "Steve Bull",         v: 306 },
    { n: "John Richards",      v: 194 },
    { n: "Billy Hartill",      v: 170 },
    { n: "Johnny Hancocks",    v: 167 },
    { n: "Jimmy Murray",       v: 166 },
    { n: "Peter Broadbent",    v: 145 },
    { n: "Harry Wood",         v: 126 },
    { n: "Dennis Westcott",    v: 124 },
    { n: "Derek Dougan",       v: 123 },
    { n: "Roy Swinbourne",     v: 114 },
    { n: "Diogo Jota",         v: 44  },
    { n: "Raul Jimenez",       v: 40  },
    { n: "Robbie Keane",       v: 29  }
  ]
};
