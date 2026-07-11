/* data_501_roma_scorers.js — Football 501 category: AS Roma all-time top
 * scorers (career goals for the club).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of A.S. Roma players"
 *                         (goalscorers table)
 *   Cross-check source:  Francesco Totti as Roma's all-time record
 *                         goalscorer (307 goals, 25-year one-club career)
 *                         is extremely widely and independently reported
 *                         general football knowledge.
 *   asOf:                2026-07-11
 *   Re-verify:           Paulo Dybala (45, 2022–) was still an active
 *                         first-team player as of asOf — re-verify each
 *                         season, his total will keep climbing.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.roma_scorers = {
  label: "AS Roma all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_A.S._Roma_players",
  rows: [
    { n: "Francesco Totti",       v: 307 },
    { n: "Roberto Pruzzo",        v: 136 },
    { n: "Edin Dzeko",            v: 119 },
    { n: "Rodolfo Volk",          v: 103 },
    { n: "Amedeo Amadei",         v: 101 },
    { n: "Abel Balbo",            v: 87  },
    { n: "Marco Delvecchio",      v: 83  },
    { n: "Giuseppe Giannini",     v: 75  },
    { n: "Rudi Voller",           v: 69  },
    { n: "Stephan El Shaarawy",   v: 64  },
    { n: "Daniele De Rossi",      v: 64  },
    { n: "Ruggiero Rizzitelli",   v: 54  },
    { n: "Antonio Cassano",       v: 52  },
    { n: "Bruno Conti",           v: 47  },
    { n: "Paulo Dybala",          v: 45  }, /* active — re-verify each season */
    { n: "Fulvio Bernardini",     v: 45  }
  ]
};
