/* data_501_napoli_scorers.js — Football 501 category: Napoli all-time top
 * scorers (career goals for the club).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of S.S.C. Napoli players"
 *                         (goalscorers, "correct as of 31 January 2026")
 *   Cross-check source:  Diego Maradona as Napoli's all-time top scorer
 *                         (115 goals) is widely and independently
 *                         reported general football knowledge — he's the
 *                         club's defining icon, stadium later renamed in
 *                         his honour.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.napoli_scorers = {
  label: "Napoli all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_S.S.C._Napoli_players",
  rows: [
    { n: "Diego Maradona",       v: 115 },
    { n: "Jose Altafini",        v: 97  },
    { n: "Careca",               v: 95  },
    { n: "Giuseppe Savoldi",     v: 77  },
    { n: "Luis Vinicio",         v: 70  },
    { n: "Cane",                 v: 70  },
    { n: "Hasse Jeppson",        v: 51  },
    { n: "Amedeo Amadei",        v: 47  },
    { n: "Andrea Carnevale",     v: 47  },
    { n: "Giancarlo Vitali",     v: 41  },
    { n: "Claudio Pellegrini",   v: 41  },
    { n: "Giorgio Braglia",      v: 35  },
    { n: "Bruno Giordano",       v: 37  },
    { n: "Beniamino Di Giacomo", v: 37  },
    { n: "Giovanni Fanello",     v: 19  }
  ]
};
