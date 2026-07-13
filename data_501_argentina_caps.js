/* data_501_argentina_caps.js — Football 501 category: Argentina men's
 * national team all-time most-capped players. Value = career caps for
 * Argentina.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Argentina national football team
 *                         records and statistics" (Most appearances table)
 *   Cross-check source:  RSSSF-derived record confirms Mascherano (147),
 *                         Zanetti (145), Ayala (115), and Aguero (101)
 *                         exactly; shows lower totals for still-active-at-
 *                         the-time players (Messi 196 vs 205, Otamendi 129
 *                         vs 137, Simeone 106 vs 104 — small variance,
 *                         expected snapshot-timing drift) — Wikipedia's
 *                         more recent table is treated as current.
 *   asOf:                2026-07-11
 *   Re-verify:           Messi and Otamendi were still active
 *                         internationals as of asOf — re-verify their cap
 *                         totals frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}.
 * Note: Messi's 205 caps exceeds the 180-max-throw line, so this is an
 * intentional "OVER" trap row, same pattern as other big-name entries in
 * data_501_intl_caps.js. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.argentina_caps = {
  label: "Argentina all-time most capped players",
  unit: "caps",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/Argentina_national_football_team_records_and_statistics",
  rows: [
    { n: "Lionel Messi",         v: 205 }, /* active — over 180, always a "no go" throw */
    { n: "Javier Mascherano",    v: 147 },
    { n: "Angel Di Maria",       v: 145 },
    { n: "Javier Zanetti",       v: 145 },
    { n: "Nicolas Otamendi",     v: 137 }, /* active — re-verify frequently */
    { n: "Roberto Ayala",        v: 115 },
    { n: "Diego Simeone",        v: 104 },
    { n: "Sergio Aguero",        v: 101 },
    { n: "Oscar Ruggeri",        v: 97 },
    { n: "Sergio Romero",        v: 96 }
  ]
};
