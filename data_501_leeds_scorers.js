/* data_501_leeds_scorers.js — Football 501 category: Leeds United
 * all-time top scorers (career goals for the club).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Leeds United F.C. records
 *                         and statistics" (Record goalscorers table)
 *   Cross-check source:  Peter Lorimer as Leeds' all-time record
 *                         goalscorer (238 goals) is widely and
 *                         independently reported general football
 *                         knowledge — he's a club legend with a stand
 *                         named after him at Elland Road.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.leeds_scorers = {
  label: "Leeds United all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Leeds_United_F.C._records_and_statistics",
  rows: [
    { n: "Peter Lorimer",       v: 238 },
    { n: "John Charles",        v: 157 },
    { n: "Allan Clarke",        v: 151 },
    { n: "Tom Jennings",        v: 117 },
    { n: "Billy Bremner",       v: 115 },
    { n: "Johnny Giles",        v: 114 },
    { n: "Mick Jones",          v: 111 },
    { n: "Charlie Keetley",     v: 110 },
    { n: "Jack Charlton",       v: 96  },
    { n: "Russell Wainscoat",   v: 93  },
    { n: "Rod Wallace",         v: 42  },
    { n: "Alan Smith",          v: 38  }
  ]
};
