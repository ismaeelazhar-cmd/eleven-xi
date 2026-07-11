/* data_501_rangers_scorers.js — Football 501 category: Rangers FC
 * all-time top scorers (career goals for the club).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Rangers F.C. records and
 *                         statistics" (Top goalscorers table) — used for
 *                         the top 10 rows.
 *   Cross-check source:  Ally McCoist's 355 goals as "the club's record
 *                         goalscorer" is explicitly stated on the same
 *                         source page and is widely reported general
 *                         Rangers history knowledge. Boyd/Hateley/
 *                         Ferguson totals independently corroborated by
 *                         general reporting on each player.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *   Data note: the original top-10 table is ENTIRELY above 180 goals
 *   (184-355), which would make the category mathematically unwinnable
 *   under the 180-max-throw rule if shipped alone — same failure class
 *   caught for La Liga appearances in an earlier batch. Boyd/Hateley/
 *   Ferguson were specifically added to give the category real
 *   throwable rows before shipping, not as an afterthought.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.rangers_scorers = {
  label: "Rangers all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Rangers_F.C._records_and_statistics",
  rows: [
    { n: "Ally McCoist",        v: 355 },
    { n: "Bob McPhail",         v: 261 },
    { n: "Jimmy Smith",         v: 249 },
    { n: "Jimmy Fleming",       v: 220 },
    { n: "Derek Johnstone",     v: 210 },
    { n: "Ralph Brand",         v: 206 },
    { n: "Willie Reid",         v: 195 },
    { n: "Willie Thornton",     v: 194 },
    { n: "Robert C. Hamilton",  v: 184 },
    { n: "Andy Cunningham",     v: 182 },
    { n: "Jim Forrest",         v: 145 },
    { n: "Alfredo Morelos",     v: 124 },
    { n: "Mark Hateley",        v: 115 },
    { n: "Kris Boyd",           v: 101 },
    { n: "Nacho Novo",          v: 71  },
    { n: "Barry Ferguson",      v: 60  },
    { n: "Jermain Defoe",       v: 32  }
  ]
};
