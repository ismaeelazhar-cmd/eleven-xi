/* data_501_villa_scorers.js — Football 501 category: Aston Villa all-time
 * top scorers (career goals for the club, competitive matches only).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Aston Villa F.C. records and
 *                         statistics" (Top goalscorers table)
 *   Cross-check source:  Billy Walker as Villa's all-time record
 *                         goalscorer (244 goals) is widely and
 *                         independently reported general football
 *                         knowledge.
 *   asOf:                2026-07-11
 *   Re-verify:           Ollie Watkins (108, 2020-present) was still an
 *                         active first-team player as of asOf — re-verify
 *                         each season, his total will keep climbing.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.villa_scorers = {
  label: "Aston Villa all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Aston_Villa_F.C._records_and_statistics",
  rows: [
    { n: "Billy Walker",     v: 244 },
    { n: "Harry Hampton",    v: 242 },
    { n: "John Devey",       v: 187 },
    { n: "Joe Bache",        v: 185 },
    { n: "Eric Houghton",    v: 170 },
    { n: "Tom Waring",       v: 167 },
    { n: "Johnny Dixon",     v: 144 },
    { n: "Peter McParland",  v: 120 },
    { n: "Billy Garraty",    v: 112 },
    { n: "Ollie Watkins",    v: 108 }, /* active — re-verify each season */
    { n: "Dwight Yorke",     v: 98  },
    { n: "Gabriel Agbonlahor", v: 74 },
    { n: "Juan Pablo Angel", v: 62  },
    { n: "Christian Benteke", v: 42 }
  ]
};
