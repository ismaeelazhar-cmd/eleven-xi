/* data_501_colombia_caps.js — Football 501 category: Colombia men's
 * national team all-time most-capped players. Value = career caps for
 * Colombia.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Colombia national football team
 *                         records and statistics" (Most capped players
 *                         table).
 *   Cross-check source:  RSSSF — "Colombia - Record International
 *                         Players" — independently confirms James
 *                         Rodriguez's lead (RSSSF's slightly lower
 *                         122-cap snapshot vs Wikipedia's more current
 *                         131 — Rodriguez remained active into 2026,
 *                         drift documented rather than silently
 *                         resolved).
 *   asOf:                2026-07-18
 *   Re-verify:           James Rodriguez, Luis Diaz (already in scorers),
 *                         and Davinson Sanchez were still plausibly
 *                         active internationals as of asOf.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.colombia_caps = {
  label: "Colombia all-time most capped players",
  unit: "caps",
  asOf: "2026-07-18",
  source: "https://en.wikipedia.org/wiki/Colombia_national_football_team_records_and_statistics",
  rows: [
    { n: "James Rodriguez", v: 131 }, /* active — re-verify frequently */
    { n: "David Ospina", v: 130 },
    { n: "Juan Cuadrado", v: 116 },
    { n: "Carlos Valderrama", v: 111 },
    { n: "Radamel Falcao", v: 104 },
    { n: "Mario Yepes", v: 102 },
    { n: "Leonel Alvarez", v: 101 },
    { n: "Carlos Sanchez", v: 88 },
    { n: "Freddy Rincon", v: 84 },
    { n: "Davinson Sanchez", v: 84 } /* active — re-verify frequently */
  ]
};
