/* data_501_sporting_scorers.js — Football 501 category: Sporting CP
 * all-time top scorers (career goals for the club).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Sporting CP players"
 *                         (goalscorers table)
 *   Cross-check source:  the source page explicitly states "Peyroteo
 *                         stands as the club's all-time leading
 *                         goalscorer with 332 goals across 197 matches"
 *                         — matching the top row used here.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.sporting_scorers = {
  label: "Sporting CP all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Sporting_CP_players",
  rows: [
    { n: "Fernando Peyroteo",  v: 332 },
    { n: "Manuel Vasques",     v: 190 },
    { n: "Manuel Fernandes",   v: 189 },
    { n: "Liedson",            v: 174 },
    { n: "Albano",             v: 162 },
    { n: "Ernesto Figueiredo", v: 148 },
    { n: "Joao Lourenco",      v: 145 },
    { n: "Joao Cruz",          v: 144 },
    { n: "Rui Jordao",         v: 140 },
    { n: "Jose Travassos",     v: 129 },
    { n: "Jesus Correia",      v: 127 },
    { n: "Hector Yazalde",     v: 104 },
    { n: "Manuel Soeiro",      v: 99  },
    { n: "Mario Jardel",       v: 53  },
    { n: "Jaime Goncalves",    v: 30  }
  ]
};
