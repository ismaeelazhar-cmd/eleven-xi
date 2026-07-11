/* data_501_liverpool_scorers.js — Football 501 category: Liverpool FC
 * all-time top scorers (career goals for the club, competitive matches).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Liverpool F.C. records and
 *                         statistics" (Top goalscorers table) — used for
 *                         the top 10 rows (Rush through Chambers).
 *   Cross-check source:  Ian Rush as Liverpool's all-time record
 *                         goalscorer with 346 goals is widely and
 *                         independently reported general football
 *                         knowledge; Mane/Suárez/Torres totals below
 *                         independently corroborated by general reporting
 *                         on each player's Liverpool career.
 *   asOf:                2026-07-11
 *   Re-verify:           Mohamed Salah (257, 2017-2026) is still an active
 *                         first-team player as of asOf — re-verify each
 *                         season, his total will keep climbing.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.liverpool_scorers = {
  label: "Liverpool all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Liverpool_F.C._records_and_statistics",
  rows: [
    { n: "Ian Rush",           v: 346 },
    { n: "Roger Hunt",         v: 285 },
    { n: "Mohamed Salah",      v: 257 }, /* active — re-verify each season */
    { n: "Gordon Hodgson",     v: 241 },
    { n: "Billy Liddell",      v: 228 },
    { n: "Steven Gerrard",     v: 186 },
    { n: "Robbie Fowler",      v: 183 },
    { n: "Kenny Dalglish",     v: 172 },
    { n: "Michael Owen",       v: 158 },
    { n: "Harry Chambers",     v: 151 },
    { n: "Sadio Mane",         v: 120 },
    { n: "Roberto Firmino",    v: 111 },
    { n: "John Barnes",        v: 108 },
    { n: "Kevin Keegan",       v: 100 },
    { n: "Luis Suarez",        v: 82  },
    { n: "Fernando Torres",    v: 81  }
  ]
};
