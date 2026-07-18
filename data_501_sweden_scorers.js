/* data_501_sweden_scorers.js — Football 501 category: Sweden men's
 * national team all-time top scorers. Value = career goals for Sweden.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Sweden national football team
 *                         records and statistics" (Top goalscorers table).
 *   Cross-check source:  RSSSF — "Sweden - Record International Players"
 *                         — independently confirms the top scorers and
 *                         supplies ranks 11-20 past Wikipedia's top-10
 *                         cut (Berg, Kaufeldt, Gustafsson, Dahl, Forsberg,
 *                         Svensson, Elmander, Jonasson, Persson, Sandell).
 *                         RSSSF's own ranking places Brolin one goal lower
 *                         (26 vs Wikipedia's 27) — minor snapshot-timing
 *                         drift, documented rather than silently resolved;
 *                         Wikipedia's figure is used since it is the
 *                         primary source for the top-10.
 *   asOf:                2026-07-18
 *   Re-verify:           Sweden's per-player scoring ceiling tops out well
 *                         below bigger nations (Ibrahimovic 62 max), so
 *                         this category needed 20 rows before the total
 *                         sum cleared 501 with a clean subset-sum.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.sweden_scorers = {
  label: "Sweden all-time top scorers",
  unit: "goals",
  asOf: "2026-07-18",
  source: "https://en.wikipedia.org/wiki/Sweden_national_football_team_records_and_statistics",
  rows: [
    { n: "Zlatan Ibrahimovic",   v: 62 },
    { n: "Sven Rydell",          v: 49 },
    { n: "Gunnar Nordahl",       v: 43 },
    { n: "Henrik Larsson",       v: 37 },
    { n: "Gunnar Gren",          v: 32 },
    { n: "Kennet Andersson",     v: 31 },
    { n: "Marcus Allback",       v: 30 },
    { n: "Martin Dahlin",        v: 29 },
    { n: "Tomas Brolin",         v: 27 },
    { n: "Agne Simonsson",       v: 27 },
    { n: "Marcus Berg",          v: 24 },
    { n: "Per Kaufeldt",         v: 23 },
    { n: "Karl Gustafsson",      v: 22 },
    { n: "Albin Dahl",           v: 21 },
    { n: "Emil Forsberg",        v: 21 }, /* active — re-verify frequently */
    { n: "Anders Svensson",      v: 21 },
    { n: "Johan Elmander",       v: 20 },
    { n: "Sven Jonasson",        v: 20 },
    { n: "Erik Persson",         v: 20 },
    { n: "Nils-Ake Sandell",     v: 20 }
  ]
};
