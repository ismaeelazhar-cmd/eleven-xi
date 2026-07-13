/* data_501_uruguay_scorers.js — Football 501 category: Uruguay men's
 * national team all-time top scorers. Value = career goals for Uruguay.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Uruguay national football team
 *                         records and statistics" (Top scorers table).
 *   Cross-check source:  RSSSF — "Uruguay - Record International Players"
 *                         — independently confirms the top-10 order and
 *                         supplies ranks 12-23 past Wikipedia's top-10 cut
 *                         (Varela, Castro, Scarone, Francescoli, Rocha,
 *                         Ambrois, Sosa, Victorino, Silva, Abbadie, Bueno,
 *                         Cea, Porta).
 *   asOf:                2026-07-13
 *   Re-verify:           Uruguay's per-player scoring ceiling tops out
 *                         well below bigger nations (Suarez 69 max), so
 *                         this category needed 23 rows before the total
 *                         sum cleared 501 with a clean subset-sum, the
 *                         same "sum shortfall" pattern seen in Italy and
 *                         the Netherlands.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.uruguay_scorers = {
  label: "Uruguay all-time top scorers",
  unit: "goals",
  asOf: "2026-07-13",
  source: "https://en.wikipedia.org/wiki/Uruguay_national_football_team_records_and_statistics",
  rows: [
    { n: "Luis Suarez",          v: 69 },
    { n: "Edinson Cavani",       v: 58 },
    { n: "Diego Forlan",         v: 36 },
    { n: "Hector Scarone",       v: 31 },
    { n: "Angel Romano",         v: 28 },
    { n: "Oscar Miguez",         v: 27 },
    { n: "Sebastian Abreu",      v: 26 },
    { n: "Pedro Petrone",        v: 24 },
    { n: "Fernando Morena",      v: 22 },
    { n: "Carlos Aguilera",      v: 22 },
    { n: "Severino Varela",      v: 19 },
    { n: "Hector Castro",        v: 18 },
    { n: "Carlos Scarone",       v: 18 },
    { n: "Enzo Francescoli",     v: 17 },
    { n: "Pedro Rocha",          v: 17 },
    { n: "Javier Ambrois",       v: 16 },
    { n: "Ruben Sosa",           v: 15 },
    { n: "Waldemar Victorino",   v: 15 },
    { n: "Dario Silva",          v: 14 },
    { n: "Julio Cesar Abbadie",  v: 13 },
    { n: "Carlos Bueno",         v: 13 },
    { n: "Jose Pedro Cea",       v: 13 },
    { n: "Roberto Porta",        v: 13 }
  ]
};
