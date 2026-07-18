/* data_501_denmark_caps.js — Football 501 category: Denmark men's national
 * team all-time most-capped players. Value = career caps for Denmark.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Denmark national football team
 *                         records and statistics" (Most appearances table).
 *   Cross-check source:  RSSSF — "Denmark - Record International Players"
 *                         — independently confirms Eriksen's lead and the
 *                         ranking order for the retired players in this
 *                         list (Schmeichel, Helveg, Olsen, Rommedahl).
 *   asOf:                2026-07-18
 *   Re-verify:           Eriksen was still an active international as of
 *                         asOf — re-verify his total frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.denmark_caps = {
  label: "Denmark all-time most capped players",
  unit: "caps",
  asOf: "2026-07-18",
  source: "https://en.wikipedia.org/wiki/Denmark_national_football_team_records_and_statistics",
  rows: [
    { n: "Christian Eriksen",   v: 151 }, /* active — re-verify frequently */
    { n: "Simon Kjaer",         v: 132 },
    { n: "Peter Schmeichel",    v: 129 },
    { n: "Dennis Rommedahl",    v: 126 },
    { n: "Kasper Schmeichel",   v: 120 },
    { n: "Jon Dahl Tomasson",   v: 112 },
    { n: "Thomas Helveg",       v: 108 },
    { n: "Michael Laudrup",     v: 104 },
    { n: "Morten Olsen",        v: 102 },
    { n: "Martin Jorgensen",    v: 102 }
  ]
};
