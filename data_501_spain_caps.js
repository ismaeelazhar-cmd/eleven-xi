/* data_501_spain_caps.js — Football 501 category: Spain men's national
 * team all-time most-capped players. Value = career caps for Spain.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Spain national football team
 *                         records and statistics" (Most caps table)
 *   Cross-check source:  WebSearch aggregation (besoccer.com / 433futbol.com /
 *                         goal.com) — independently confirms Ramos (180,
 *                         having overtaken Casillas's 167 to become Spain's
 *                         most-capped player), Casillas (167), Busquets
 *                         (143), Iniesta (131), Zubizarreta (126), Xavi
 *                         (125-133 range across sources), Xabi Alonso (114)
 *                         exactly or within known snapshot-timing variance.
 *   asOf:                2026-07-13
 *   Re-verify:           Ramos's 180-cap total sits exactly on the
 *                         180-max-throw line — it IS throwable (180 is the
 *                         real-darts max single visit), unlike the
 *                         intentional >180 "OVER" trap rows used elsewhere
 *                         (e.g. Messi/Ronaldo in the caps categories).
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.spain_caps = {
  label: "Spain all-time most capped players",
  unit: "caps",
  asOf: "2026-07-13",
  source: "https://en.wikipedia.org/wiki/Spain_national_football_team_records_and_statistics",
  rows: [
    { n: "Sergio Ramos",         v: 180 },
    { n: "Iker Casillas",        v: 167 },
    { n: "Sergio Busquets",      v: 143 },
    { n: "Xavi",                 v: 133 },
    { n: "Andres Iniesta",       v: 131 },
    { n: "Andoni Zubizarreta",   v: 126 },
    { n: "David Silva",          v: 125 },
    { n: "Xabi Alonso",          v: 114 },
    { n: "Cesc Fabregas",        v: 110 },
    { n: "Fernando Torres",      v: 110 },
    { n: "Gerard Pique",         v: 102 },
    { n: "Raul",                 v: 102 },
    { n: "Carles Puyol",         v: 100 },
    { n: "David Villa",          v: 98 },
    { n: "Jordi Alba",           v: 93 },
    { n: "Fernando Hierro",      v: 89 },
    { n: "Alvaro Morata",        v: 87 }, /* active — re-verify frequently */
    { n: "Jose Antonio Camacho", v: 81 },
    { n: "Santi Cazorla",        v: 81 },
    { n: "Rafael Gordillo",      v: 75 },
    { n: "Koke",                 v: 70 }, /* active — re-verify frequently */
    { n: "Emilio Butragueno",    v: 69 },
    { n: "Carlos Marchena",      v: 69 },
    { n: "Luis Arconada",        v: 68 },
    { n: "Rodri",                v: 66 } /* active — re-verify frequently */
  ]
};
