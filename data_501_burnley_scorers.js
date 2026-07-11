/* data_501_burnley_scorers.js — Football 501 category: Burnley all-time
 * top scorers (career goals for the club).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Burnley F.C. records and
 *                         statistics" ("Overall scorers" table)
 *   Cross-check source:  George Beel's 188-goal record, most hat-tricks
 *                         (11), and most seasons as top scorer (6) are
 *                         all explicitly stated on the same source page,
 *                         a strong internal-consistency signal.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.burnley_scorers = {
  label: "Burnley all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Burnley_F.C._records_and_statistics",
  rows: [
    { n: "George Beel",      v: 188 },
    { n: "Ray Pointer",      v: 132 },
    { n: "Jimmy McIlroy",    v: 131 },
    { n: "Andy Lochhead",    v: 128 },
    { n: "Bert Freeman",     v: 115 },
    { n: "Louis Page",       v: 115 },
    { n: "John Connelly",    v: 104 },
    { n: "Jimmy Robson",     v: 100 },
    { n: "Willie Irvine",    v: 97  },
    { n: "Bob Kelly",        v: 97  },
    { n: "Ashley Barnes",    v: 49  },
    { n: "Chris Wood",       v: 46  }
  ]
};
