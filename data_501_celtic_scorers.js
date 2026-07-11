/* data_501_celtic_scorers.js — Football 501 category: Celtic all-time top
 * scorers (career goals for the club, competitive professional matches).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Celtic F.C. records and
 *                         statistics" (Top goalscorers table, "all
 *                         figures correct as of 16 May 2026")
 *   Cross-check source:  the same source page separately notes McGrory's
 *                         total including Glasgow Charity Cup appearances
 *                         reaches 522 across all senior competitions —
 *                         internally consistent with the 502 competitive-
 *                         only figure used here.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.celtic_scorers = {
  label: "Celtic all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Celtic_F.C._records_and_statistics",
  rows: [
    { n: "Jimmy McGrory",    v: 502 },
    { n: "Bobby Lennox",     v: 301 },
    { n: "Henrik Larsson",   v: 242 },
    { n: "Jimmy Quinn",      v: 239 },
    { n: "Stevie Chalmers",  v: 236 },
    { n: "Sandy McMahon",    v: 200 },
    { n: "Patsy Gallacher",  v: 200 },
    { n: "John Hughes",      v: 197 },
    { n: "Jimmy McMenemy",   v: 178 },
    { n: "Kenny Dalglish",   v: 173 },
    { n: "Leigh Griffiths",  v: 123 },
    { n: "John Hartson",     v: 88  },
    { n: "Chris Sutton",     v: 84  },
    { n: "Scott McDonald",   v: 64  },
    { n: "Georgios Samaras", v: 53  },
    { n: "Moussa Dembele",   v: 51  }
  ]
};
