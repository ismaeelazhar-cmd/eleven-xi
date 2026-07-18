/* data_501_southkorea_caps.js — Football 501 category: South Korea men's
 * national team all-time most-capped players. Value = career caps for
 * South Korea.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "South Korea national football team
 *                         records and statistics" (Most appearances
 *                         table).
 *   Cross-check source:  WebSearch aggregation independently confirms
 *                         Son Heung-min's lead at 147 caps and Cha
 *                         Bum-kun/Hong Myung-bo tied second at 136.
 *   asOf:                2026-07-18
 *   Re-verify:           Son Heung-min was still an active international
 *                         as of asOf — re-verify his total frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.southkorea_caps = {
  label: "South Korea all-time most capped players",
  unit: "caps",
  asOf: "2026-07-18",
  source: "https://en.wikipedia.org/wiki/South_Korea_national_football_team_records_and_statistics",
  rows: [
    { n: "Son Heung-min", v: 147 }, /* active — re-verify frequently */
    { n: "Cha Bum-kun", v: 136 },
    { n: "Hong Myung-bo", v: 136 },
    { n: "Lee Woon-jae", v: 133 },
    { n: "Lee Young-pyo", v: 127 },
    { n: "Kim Ho-kon", v: 124 },
    { n: "Yoo Sang-chul", v: 122 },
    { n: "Cho Young-jeung", v: 113 },
    { n: "Kim Young-gwon", v: 112 },
    { n: "Ki Sung-yueng", v: 110 }
  ]
};
