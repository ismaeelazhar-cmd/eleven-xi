/* data_501_spain_scorers.js — Football 501 category: Spain men's
 * national team all-time top scorers. Value = career goals for Spain.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Spain national football team records
 *                         and statistics" (Most goals table, as of
 *                         2026-07-02)
 *   Cross-check source:  WebSearch aggregation (si.com / goal.com /
 *                         statista.com) — independently confirms Villa (59),
 *                         Raul (44), Torres (38), Morata (37), Silva (35)
 *                         exactly for the top 5.
 *   asOf:                2026-07-13
 *   Re-verify:           Alvaro Morata and Mikel Oyarzabal were still
 *                         active internationals as of asOf — re-verify
 *                         their totals frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.spain_scorers = {
  label: "Spain all-time top scorers",
  unit: "goals",
  asOf: "2026-07-13",
  source: "https://en.wikipedia.org/wiki/Spain_national_football_team_records_and_statistics",
  rows: [
    { n: "David Villa",          v: 59 },
    { n: "Raul",                 v: 44 },
    { n: "Fernando Torres",      v: 38 },
    { n: "Alvaro Morata",        v: 37 }, /* active — re-verify frequently */
    { n: "David Silva",          v: 35 },
    { n: "Mikel Oyarzabal",      v: 29 }, /* active — re-verify frequently */
    { n: "Fernando Hierro",      v: 29 },
    { n: "Fernando Morientes",   v: 27 },
    { n: "Emilio Butragueno",    v: 26 },
    { n: "Ferran Torres",        v: 24 }, /* active — re-verify frequently */
    { n: "Alfredo Di Stefano",   v: 23 },
    { n: "Sergio Ramos",         v: 23 },
    { n: "Julio Salinas",        v: 22 },
    { n: "Michel Gonzalez",      v: 21 },
    { n: "Telmo Zarra",          v: 20 },
    { n: "Isidro Langara",       v: 17 },
    { n: "Pedro Rodriguez",      v: 17 },
    { n: "Luis Regueiro",        v: 16 },
    { n: "Pirri",                v: 16 },
    { n: "Xabi Alonso",          v: 16 }
  ]
};
