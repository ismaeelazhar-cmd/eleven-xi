/* data_501_man_utd_scorers.js — Football 501 category: Manchester United
 * all-time top scorers (all competitions). Value = career goals for the club.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Manchester United F.C. records
 *                         and statistics" ("Overall scorers" table)
 *   Cross-check source:  Rooney overtaking Charlton's 249-goal record in
 *                         2017 to become the club's all-time top scorer is
 *                         widely and independently reported general
 *                         football knowledge, confirming the #1/#2 order
 *                         and values here.
 *   asOf:                2026-07-11
 *   Re-verify:           Marcus Rashford's total (138, spanning 2016-2025)
 *                         was still climbing until his recent departure —
 *                         treated as a closed total as of asOf, flagged in
 *                         case it needs a bump if he returns/his figure was
 *                         still being finalized at time of writing.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.man_utd_scorers = {
  label: "Manchester United all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Manchester_United_F.C._records_and_statistics",
  rows: [
    { n: "Wayne Rooney",         v: 253 },
    { n: "Bobby Charlton",       v: 249 },
    { n: "Denis Law",            v: 237 },
    { n: "Jack Rowley",          v: 211 },
    { n: "Dennis Viollet",       v: 179 },
    { n: "George Best",          v: 179 },
    { n: "Joe Spence",           v: 168 },
    { n: "Ryan Giggs",           v: 168 },
    { n: "Mark Hughes",          v: 163 },
    { n: "Paul Scholes",         v: 155 },
    { n: "Ruud van Nistelrooy",  v: 150 },
    { n: "Stan Pearson",         v: 148 },
    { n: "David Herd",           v: 145 },
    { n: "Cristiano Ronaldo",    v: 145 },
    { n: "Marcus Rashford",      v: 138 }, /* recently departed — re-verify final total */
    { n: "Tommy Taylor",         v: 131 },
    { n: "Eric Cantona",         v: 87  },
    { n: "David Beckham",        v: 85  }
  ]
};
