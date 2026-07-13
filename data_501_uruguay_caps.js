/* data_501_uruguay_caps.js — Football 501 category: Uruguay men's
 * national team all-time most-capped players. Value = career caps for
 * Uruguay.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Uruguay national football team
 *                         records and statistics" (Most caps table).
 *   Cross-check source:  RSSSF — "Uruguay - Record International Players"
 *                         — independently confirms the ranking order and
 *                         cap totals for the retired players in this list
 *                         (Godin, Suarez, Cavani, Forlan, Lugano).
 *   asOf:                2026-07-13
 *   Re-verify:           Muslera and Gimenez were still active
 *                         internationals as of asOf — re-verify their
 *                         totals frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.uruguay_caps = {
  label: "Uruguay all-time most capped players",
  unit: "caps",
  asOf: "2026-07-13",
  source: "https://en.wikipedia.org/wiki/Uruguay_national_football_team_records_and_statistics",
  rows: [
    { n: "Diego Godin",          v: 161 },
    { n: "Luis Suarez",          v: 143 },
    { n: "Edinson Cavani",       v: 136 },
    { n: "Fernando Muslera",     v: 135 }, /* active — re-verify frequently */
    { n: "Maxi Pereira",         v: 125 },
    { n: "Martin Caceres",       v: 116 },
    { n: "Diego Forlan",         v: 112 },
    { n: "Cristian Rodriguez",   v: 110 },
    { n: "Jose Maria Gimenez",   v: 99 }, /* active — re-verify frequently */
    { n: "Diego Lugano",         v: 95 }
  ]
};
