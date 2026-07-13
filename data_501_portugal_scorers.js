/* data_501_portugal_scorers.js — Football 501 category: Portugal men's
 * national team all-time top scorers. Value = career goals for Portugal.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Portugal national football team
 *                         records and statistics" (Top goalscorers table,
 *                         as of match played 6 July 2026)
 *   Cross-check source:  RSSSF — "Portugal - Record International Players"
 *                         — independently confirms Pauleta (47), Eusebio
 *                         (41), Figo (32), Nuno Gomes (29), Rui Costa (26)
 *                         exactly, and supplies the extended ranks 11-25
 *                         (Nene through Joao Felix) not present in
 *                         Wikipedia's top-10-only table. Ronaldo's total
 *                         differs by source (146 per Wikipedia's more
 *                         recent snapshot vs 143 per RSSSF) — expected
 *                         drift for a player still active through World
 *                         Cup 2026; the more recent figure is used.
 *   asOf:                2026-07-06
 *   Re-verify:           Cristiano Ronaldo, Bruno Fernandes, Bernardo
 *                         Silva, Joao Cancelo, and Joao Felix were still
 *                         active internationals as of asOf — re-verify
 *                         their totals frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.portugal_scorers = {
  label: "Portugal all-time top scorers",
  unit: "goals",
  asOf: "2026-07-06",
  source: "https://en.wikipedia.org/wiki/Portugal_national_football_team_records_and_statistics",
  rows: [
    { n: "Cristiano Ronaldo",   v: 146 }, /* active — re-verify frequently */
    { n: "Pauleta",             v: 47 },
    { n: "Eusebio",             v: 41 },
    { n: "Luis Figo",           v: 32 },
    { n: "Nuno Gomes",          v: 29 },
    { n: "Bruno Fernandes",     v: 28 }, /* active — re-verify frequently */
    { n: "Helder Postiga",      v: 27 },
    { n: "Rui Costa",           v: 26 },
    { n: "Nani",                v: 24 },
    { n: "Joao Vieira Pinto",   v: 23 },
    { n: "Nene",                v: 22 },
    { n: "Simao Sabrosa",       v: 22 },
    { n: "Andre Silva",         v: 19 },
    { n: "Hugo Almeida",        v: 19 },
    { n: "Rui Jordao",          v: 15 },
    { n: "Peyroteo",            v: 14 },
    { n: "Jose Torres",         v: 14 },
    { n: "Jota",                v: 14 },
    { n: "Bernardo Silva",      v: 14 }, /* active — re-verify frequently */
    { n: "Matateu",             v: 13 },
    { n: "Fernando Gomes",      v: 13 },
    { n: "Sergio Conceicao",    v: 12 },
    { n: "Joao Cancelo",        v: 12 }, /* active — re-verify frequently */
    { n: "Jose Aguas",          v: 11 },
    { n: "Joao Felix",          v: 11 } /* active — re-verify frequently */
  ]
};
