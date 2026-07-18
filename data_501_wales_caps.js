/* data_501_wales_caps.js — Football 501 category: Wales men's national
 * team all-time most-capped players. Value = career caps for Wales.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Wales national football team
 *                         records and statistics" (Most capped players
 *                         table, as of 6 June 2026).
 *   Cross-check source:  RSSSF — "Wales - Record International Players"
 *                         — independently confirms Bale's lead at 111
 *                         caps and the ranking order for the retired
 *                         players in this list.
 *   asOf:                2026-06-06
 *   Re-verify:            Ben Davies was still a plausibly active
 *                         international as of asOf — re-verify if this
 *                         list is revisited.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.wales_caps = {
  label: "Wales all-time most capped players",
  unit: "caps",
  asOf: "2026-06-06",
  source: "https://en.wikipedia.org/wiki/Wales_national_football_team_records_and_statistics",
  rows: [
    { n: "Gareth Bale",        v: 111 },
    { n: "Chris Gunter",       v: 109 },
    { n: "Wayne Hennessey",    v: 109 },
    { n: "Ben Davies",         v: 100 }, /* active — re-verify frequently */
    { n: "Neville Southall",   v: 92 },
    { n: "Ashley Williams",    v: 86 },
    { n: "Aaron Ramsey",       v: 86 },
    { n: "Gary Speed",         v: 85 },
    { n: "Craig Bellamy",      v: 78 },
    { n: "Joe Ledley",         v: 77 }
  ]
};
