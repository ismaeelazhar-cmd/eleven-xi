/* data_501_porto_scorers.js — Football 501 category: FC Porto all-time
 * top scorers (career goals for the club).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of FC Porto players"
 *                         (goalscorers table)
 *   Cross-check source:  the source page explicitly states "Fernando
 *                         Gomes is Porto's top goalscorer, with 347
 *                         goals in 455 appearances" — matching the top
 *                         row used here.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.porto_scorers = {
  label: "FC Porto all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_FC_Porto_players",
  rows: [
    { n: "Fernando Gomes",     v: 347 },
    { n: "Pinga",              v: 314 },
    { n: "Antonio Araujo",     v: 205 },
    { n: "Correia Dias",       v: 200 },
    { n: "Hernani Silva",      v: 187 },
    { n: "Valdemar Mota",      v: 177 },
    { n: "Mario Jardel",       v: 168 },
    { n: "Antonio Teixeira",   v: 171 },
    { n: "Domingos Paciencia", v: 144 },
    { n: "Carlos Nunes",       v: 129 },
    { n: "Acacio Mesquita",    v: 111 },
    { n: "Monteiro da Costa",  v: 92  },
    { n: "Antonio Oliveira",   v: 85  },
    { n: "Hulk",               v: 77  },
    { n: "Rabah Madjer",       v: 73  }
  ]
};
