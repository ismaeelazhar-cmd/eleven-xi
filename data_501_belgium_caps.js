/* data_501_belgium_caps.js — Football 501 category: Belgium men's
 * national team all-time most-capped players. Value = career caps for
 * Belgium.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Belgium national football team
 *                         records and statistics" (Most capped players
 *                         table, as of 10 July 2026).
 *   Cross-check source:  RSSSF — "Belgium - Record International Players"
 *                         — independently confirms the ranking order,
 *                         though its own snapshot trails on caps totals
 *                         for still-active names (e.g. Lukaku 124 vs
 *                         Wikipedia's current 132) — expected drift,
 *                         documented rather than silently resolved, same
 *                         pattern as this batch's belgium_scorers.js.
 *   asOf:                2026-07-10
 *   Re-verify:           Witsel, Lukaku, De Bruyne, and Courtois were
 *                         still active internationals as of asOf —
 *                         re-verify their totals frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.belgium_caps = {
  label: "Belgium all-time most capped players",
  unit: "caps",
  asOf: "2026-07-10",
  source: "https://en.wikipedia.org/wiki/Belgium_national_football_team_records_and_statistics",
  rows: [
    { n: "Jan Vertonghen",       v: 157 },
    { n: "Axel Witsel",          v: 140 }, /* active — re-verify frequently */
    { n: "Romelu Lukaku",        v: 132 }, /* active — re-verify frequently */
    { n: "Toby Alderweireld",    v: 127 },
    { n: "Eden Hazard",          v: 126 },
    { n: "Kevin De Bruyne",      v: 124 }, /* active — re-verify frequently */
    { n: "Thibaut Courtois",     v: 115 }, /* active — re-verify frequently */
    { n: "Dries Mertens",        v: 109 },
    { n: "Jan Ceulemans",        v: 96 },
    { n: "Timmy Simons",         v: 94 }
  ]
};
