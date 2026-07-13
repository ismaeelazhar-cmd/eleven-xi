/* data_501_brazil_caps.js — Football 501 category: Brazil men's national
 * team all-time most-capped players. Value = career caps for Brazil.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Brazil national football team
 *                         records and statistics" (Most appearances table)
 *   Cross-check source:  footballfancast.com / 433futbol.com (aggregated
 *                         via search) independently confirm Gilberto
 *                         Silva (93), Kaka (92), Pele (92), Roberto
 *                         Rivellino (92), and Emerson (80) — used to
 *                         extend the list past Wikipedia's top-10 cutoff.
 *   asOf:                2026-07-11
 *   Re-verify:           Marquinhos was still an active international as
 *                         of asOf — re-verify his cap total periodically;
 *                         all other rows are closed-career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.brazil_caps = {
  label: "Brazil all-time most capped players",
  unit: "caps",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/Brazil_national_football_team_records_and_statistics",
  rows: [
    { n: "Cafu",               v: 142 },
    { n: "Neymar",             v: 130 },
    { n: "Dani Alves",         v: 126 },
    { n: "Roberto Carlos",     v: 125 },
    { n: "Thiago Silva",       v: 113 },
    { n: "Marquinhos",         v: 110 }, /* active — re-verify periodically */
    { n: "Lucio",              v: 105 },
    { n: "Claudio Taffarel",   v: 101 },
    { n: "Robinho",            v: 100 },
    { n: "Ronaldo",            v: 98 },
    { n: "Djalma Santos",      v: 98 },
    { n: "Gilberto Silva",     v: 93 },
    { n: "Kaka",               v: 92 },
    { n: "Pele",               v: 92 },
    { n: "Roberto Rivellino",  v: 92 },
    { n: "Emerson",            v: 80 }
  ]
};
