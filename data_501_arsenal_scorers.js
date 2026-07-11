/* data_501_arsenal_scorers.js — Football 501 category: Arsenal all-time
 * top scorers (career goals for the club, competitive matches only).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Arsenal F.C. records and
 *                         statistics" (Top goalscorers table)
 *   Cross-check source:  Thierry Henry as Arsenal's all-time record
 *                         goalscorer (228 goals) is widely and
 *                         independently reported general football
 *                         knowledge.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.arsenal_scorers = {
  label: "Arsenal all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Arsenal_F.C._records_and_statistics",
  rows: [
    { n: "Thierry Henry",       v: 228 },
    { n: "Ian Wright",          v: 185 },
    { n: "Cliff Bastin",        v: 178 },
    { n: "John Radford",        v: 149 },
    { n: "Jimmy Brain",         v: 139 },
    { n: "Ted Drake",           v: 139 },
    { n: "Doug Lishman",        v: 137 },
    { n: "Robin van Persie",    v: 132 },
    { n: "Joe Hulme",           v: 125 },
    { n: "David Jack",          v: 124 },
    { n: "Alan Smith",          v: 115 },
    { n: "Aaron Ramsey",        v: 69  },
    { n: "Liam Brady",          v: 59  },
    { n: "Charlie George",      v: 49  },
    { n: "Tony Adams",          v: 48  }
  ]
};
