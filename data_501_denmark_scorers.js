/* data_501_denmark_scorers.js — Football 501 category: Denmark men's
 * national team all-time top scorers. Value = career goals for Denmark.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Denmark national football team
 *                         records and statistics" (Top scorers table).
 *   Cross-check source:  RSSSF — "Denmark - Record International Players"
 *                         — independently confirms the top-10 order and
 *                         supplies ranks 11-31 past Wikipedia's top-10
 *                         cut, down to Pierre-Emile Hojbjerg's 11 goals.
 *   asOf:                2026-07-18
 *   Re-verify:           Denmark's per-player scoring ceiling tops out at
 *                         52 (Nielsen/Tomasson, tied), so this category
 *                         needed 31 rows before the total sum cleared 501
 *                         with a clean subset-sum — a similar deep
 *                         extension to Croatia's 34-row scorer list.
 *                         Hojlund and Hojbjerg were still active
 *                         internationals as of asOf — re-verify frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.denmark_scorers = {
  label: "Denmark all-time top scorers",
  unit: "goals",
  asOf: "2026-07-18",
  source: "https://en.wikipedia.org/wiki/Denmark_national_football_team_records_and_statistics",
  rows: [
    { n: "Poul Nielsen",           v: 52 },
    { n: "Jon Dahl Tomasson",      v: 52 },
    { n: "Christian Eriksen",      v: 46 }, /* active — re-verify frequently */
    { n: "Pauli Jorgensen",        v: 44 },
    { n: "Ole Madsen",             v: 42 },
    { n: "Preben Elkjaer",         v: 38 },
    { n: "Michael Laudrup",        v: 37 },
    { n: "Nicklas Bendtner",       v: 30 },
    { n: "Henning Enoksen",        v: 29 },
    { n: "Michael Rohde",          v: 22 },
    { n: "Ebbe Sand",              v: 22 },
    { n: "Brian Laudrup",          v: 21 },
    { n: "Flemming Povlsen",       v: 21 },
    { n: "Dennis Rommedahl",       v: 21 },
    { n: "Allan Simonsen",         v: 20 },
    { n: "Jens Peder Hansen",      v: 18 },
    { n: "Sophus Nielsen",         v: 16 },
    { n: "Frank Arnesen",          v: 14 },
    { n: "Anthon Olsen",           v: 14 },
    { n: "Yussuf Poulsen",         v: 14 }, /* active — re-verify frequently */
    { n: "Kim Vilfort",            v: 14 },
    { n: "Vilhelm Wolfhagen",      v: 14 },
    { n: "Kasper Dolberg",         v: 13 }, /* active — re-verify frequently */
    { n: "Lars Elstrup",           v: 13 },
    { n: "Rasmus Hojlund",         v: 13 }, /* active — re-verify frequently */
    { n: "Bent Jensen",            v: 13 },
    { n: "Daniel Agger",           v: 12 },
    { n: "Kresten Bjerre",         v: 12 },
    { n: "Kaj Hansen",             v: 12 },
    { n: "Martin Jorgensen",       v: 12 },
    { n: "Pierre-Emile Hojbjerg",  v: 11 } /* active — re-verify frequently */
  ]
};
