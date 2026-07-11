/* data_501_sevilla_scorers.js — Football 501 category: Sevilla FC
 * all-time top scorers (career La Liga goals for the club).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      StatMuse (LaLiga statistics) — "Sevilla FC
 *                         all-time top goalscorers" ranked list.
 *   Cross-check source:  A separate independent search summary
 *                         independently confirms Juan Arza as Sevilla's
 *                         all-time La Liga scoring leader with the same
 *                         182-goal figure.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.sevilla_scorers = {
  label: "Sevilla all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://www.statmuse.com/fc/ask?q=sevilla+top+goal+scorer+all-time&l=laliga",
  rows: [
    { n: "Juan Arza",                  v: 182 },
    { n: "Juan Araujo",                v: 139 },
    { n: "Marcelino Guillermo Garcia", v: 102 },
    { n: "Frederic Kanoute",           v: 89  },
    { n: "Davor Suker",                v: 76  },
    { n: "Luis Fabiano",               v: 72  },
    { n: "Alvaro Negredo",             v: 70  },
    { n: "Manuel Domenech",            v: 69  },
    { n: "Anton Polster",              v: 55  },
    { n: "Jose Carlos Dieguez",        v: 55  }
  ]
};
