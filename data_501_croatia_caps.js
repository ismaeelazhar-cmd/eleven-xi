/* data_501_croatia_caps.js — Football 501 category: Croatia men's
 * national team all-time most-capped players. Value = career caps for
 * Croatia.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Croatia national football team
 *                         records and statistics" (Most capped players
 *                         table, matches played through 2 July 2026).
 *   Cross-check source:  RSSSF — "Croatia - Record International Players"
 *                         — independently confirms Modric's lead, though
 *                         its own snapshot (through Nov 2025) trails at
 *                         194 caps vs Wikipedia's current 202 — expected
 *                         drift for a still-active player, documented
 *                         rather than silently resolved.
 *   asOf:                2026-07-02
 *   Re-verify:           Modric was still an active international as of
 *                         asOf and had already passed 200 caps — this is
 *                         an intentional "OVER" trap row (>180, never a
 *                         legal throw), same pattern as Ronaldo's entry in
 *                         data_501_intl_caps.js and Messi's entry in
 *                         data_501_argentina_caps.js.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.croatia_caps = {
  label: "Croatia all-time most capped players",
  unit: "caps",
  asOf: "2026-07-02",
  source: "https://en.wikipedia.org/wiki/Croatia_national_football_team_records_and_statistics",
  rows: [
    { n: "Luka Modric",          v: 202 }, /* over 180, always a "no go" throw — active, re-verify frequently */
    { n: "Ivan Perisic",         v: 158 },
    { n: "Darijo Srna",          v: 134 },
    { n: "Andrej Kramaric",      v: 119 }, /* active — re-verify frequently */
    { n: "Mateo Kovacic",        v: 117 }, /* active — re-verify frequently */
    { n: "Stipe Pletikosa",      v: 114 },
    { n: "Ivan Rakitic",         v: 106 },
    { n: "Domagoj Vida",         v: 105 },
    { n: "Josip Simunic",        v: 105 },
    { n: "Ivica Olic",           v: 104 }
  ]
};
