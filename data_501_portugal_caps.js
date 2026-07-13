/* data_501_portugal_caps.js — Football 501 category: Portugal men's
 * national team all-time most-capped players. Value = career caps for
 * Portugal.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Portugal national football team
 *                         records and statistics" (Most capped players
 *                         table, matches played through 6 July 2026)
 *   Cross-check source:  UEFA.com ("Europe's most-capped men's
 *                         international players") — independently confirms
 *                         Ronaldo's cap total, though earlier UEFA
 *                         snapshots (226) trail the most recent Wikipedia
 *                         figure (233) since Ronaldo remained active
 *                         through World Cup 2026 — expected drift,
 *                         documented rather than silently resolved.
 *                         Carvalho (89) and Pauleta (88) sourced via
 *                         WebSearch aggregation to extend past the
 *                         Wikipedia table's top-10 cutoff.
 *   asOf:                2026-07-06
 *   Re-verify:           Ronaldo's 233 caps exceeds the 180-max-throw
 *                         line, so this is an intentional "OVER" trap row,
 *                         same pattern as Ronaldo's entry in
 *                         data_501_intl_caps.js and Messi's entry in
 *                         data_501_argentina_caps.js.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.portugal_caps = {
  label: "Portugal all-time most capped players",
  unit: "caps",
  asOf: "2026-07-06",
  source: "https://en.wikipedia.org/wiki/Portugal_national_football_team_records_and_statistics",
  rows: [
    { n: "Cristiano Ronaldo",   v: 233 }, /* over 180, always a "no go" throw */
    { n: "Joao Moutinho",       v: 146 },
    { n: "Pepe",                v: 141 },
    { n: "Luis Figo",           v: 127 },
    { n: "Bernardo Silva",      v: 113 },
    { n: "Nani",                v: 112 },
    { n: "Fernando Couto",      v: 110 },
    { n: "Rui Patricio",        v: 108 },
    { n: "Bruno Alves",         v: 96 },
    { n: "Rui Costa",           v: 94 },
    { n: "Bruno Fernandes",     v: 94 },
    { n: "Ricardo Carvalho",    v: 89 },
    { n: "Pauleta",             v: 88 }
  ]
};
