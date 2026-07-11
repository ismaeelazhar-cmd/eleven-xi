/* data_501_fulham_scorers.js — Football 501 category: Fulham all-time top
 * scorers (career goals for the club).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Fulham F.C. records and
 *                         statistics" (players with 100+ goals section)
 *   Cross-check source:  The source page explicitly states "eight players
 *                         have scored 100 or more goals for the club" —
 *                         matching exactly the 8 rows used here, a strong
 *                         internal-consistency check.
 *   asOf:                2026-07-11
 *   Re-verify:           Aleksandar Mitrović's total was still climbing
 *                         prior to his departure from the club — treated
 *                         as a closed total as of asOf.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.fulham_scorers = {
  label: "Fulham all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Fulham_F.C._records_and_statistics",
  rows: [
    { n: "Gordon Davies",       v: 178 },
    { n: "Johnny Haynes",       v: 158 },
    { n: "Bedford Jezzard",     v: 154 },
    { n: "Jim Hammond",         v: 150 },
    { n: "Graham Leggat",       v: 134 },
    { n: "Arthur Stevens",      v: 124 },
    { n: "Aleksandar Mitrovic", v: 111 },
    { n: "Steve Earle",         v: 108 }
  ]
};
