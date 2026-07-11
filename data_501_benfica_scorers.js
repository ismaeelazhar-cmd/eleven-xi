/* data_501_benfica_scorers.js — Football 501 category: Benfica all-time
 * top scorers (career goals for the club).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of S.L. Benfica players"
 *                         (goalscorers table)
 *   Cross-check source:  the source page explicitly states "only three
 *                         players — Eusébio, Nené, and José Águas —
 *                         scored over 300 goals for the club," an
 *                         internal-consistency check matching the top 3
 *                         rows used here.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.benfica_scorers = {
  label: "Benfica all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_S.L._Benfica_players",
  rows: [
    { n: "Eusebio",           v: 474 },
    { n: "Jose Aguas",        v: 379 },
    { n: "Nene",              v: 360 },
    { n: "Arsenio Duarte",    v: 220 },
    { n: "Rogerio Pipi",      v: 212 },
    { n: "Oscar Cardozo",     v: 172 },
    { n: "Nuno Gomes",        v: 166 },
    { n: "Alfredo Valadas",   v: 158 },
    { n: "Jonas",             v: 137 },
    { n: "Simao Sabrosa",     v: 89  },
    { n: "Haris Seferovic",   v: 74  },
    { n: "Raul Jimenez",      v: 31  }
  ]
};
