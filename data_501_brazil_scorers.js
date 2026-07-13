/* data_501_brazil_scorers.js — Football 501 category: Brazil men's
 * national team all-time top scorers. Value = career goals for Brazil.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Brazil national football team
 *                         records and statistics" (Top goalscorers table,
 *                         data "as of 5 July 2026")
 *   Cross-check source:  Transfermarkt independently confirms Zizinho
 *                         (30), Careca (29), and Kaká (29) — used to
 *                         extend the list past the Wikipedia table's
 *                         top-10 cutoff. Note: some secondary sources
 *                         (e.g. 11v11/Statista snapshots) show Neymar at
 *                         79 and Bebeto at 39 rather than 80/38 — a minor,
 *                         known variance likely due to snapshot timing
 *                         while Neymar was still active; Wikipedia's
 *                         explicitly-dated table is treated as current.
 *   asOf:                2026-07-11
 *   Re-verify:           no player in this list was an active senior
 *                         Brazil international as of asOf, so this is a
 *                         closed-career list — only needs a periodic
 *                         spot-check.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.brazil_scorers = {
  label: "Brazil all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/Brazil_national_football_team_records_and_statistics",
  rows: [
    { n: "Neymar",              v: 80 },
    { n: "Pele",                v: 77 },
    { n: "Ronaldo",             v: 62 },
    { n: "Romario",             v: 55 },
    { n: "Zico",                v: 48 },
    { n: "Bebeto",              v: 38 },
    { n: "Rivaldo",             v: 35 },
    { n: "Jairzinho",           v: 33 },
    { n: "Ronaldinho",          v: 33 },
    { n: "Ademir",              v: 32 },
    { n: "Tostao",              v: 32 },
    { n: "Zizinho",             v: 30 },
    { n: "Careca",              v: 29 },
    { n: "Kaka",                v: 29 },
    { n: "Luis Fabiano",        v: 28 },
    { n: "Robinho",             v: 28 },
    { n: "Adriano",             v: 27 },
    { n: "Roberto Rivellino",   v: 26 }
  ]
};
