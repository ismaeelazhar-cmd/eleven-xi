/* data_501_chile_scorers.js — Football 501 category: Chile men's
 * national team all-time top scorers. Value = career goals for Chile.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Chile national football team
 *                         records and statistics" (Top goalscorers table)
 *                         for the top 10; RSSSF — "Chile - Record
 *                         International Players" for ranks 11+.
 *   Cross-check source:  RSSSF's own snapshot confirms Sanchez's lead
 *                         (52 vs Wikipedia's 51 — one-goal snapshot
 *                         drift for a still-active player, documented
 *                         rather than silently resolved; RSSSF's 52 used
 *                         here since it comes with the deeper ranked
 *                         table needed for this category).
 *   asOf:                2026-07-18
 *   Re-verify:           Sanchez, Vidal, and Vargas were still plausibly
 *                         active internationals as of asOf.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.chile_scorers = {
  label: "Chile all-time top scorers",
  unit: "goals",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/chil-recintlp.html",
  rows: [
    { n: "Alexis Sanchez", v: 52 }, /* active — re-verify frequently */
    { n: "Eduardo Vargas", v: 45 }, /* active — re-verify frequently */
    { n: "Marcelo Salas", v: 37 },
    { n: "Arturo Vidal", v: 34 }, /* active — re-verify frequently */
    { n: "Ivan Zamorano", v: 34 },
    { n: "Carlos Caszely", v: 29 },
    { n: "Leonel Sanchez", v: 23 },
    { n: "Jorge Aravena", v: 22 },
    { n: "Humberto Suazo", v: 21 },
    { n: "Juan Carlos Letelier", v: 18 },
    { n: "Enrique Hormazabal", v: 17 },
    { n: "Matias Fernandez", v: 14 },
    { n: "Alberto Fouilloux", v: 12 },
    { n: "Esteban Paredes", v: 12 },
    { n: "Jaime Ramirez", v: 12 },
    { n: "Hugo Rubio", v: 12 },
    { n: "Raul Toro", v: 12 },
    { n: "Pedro Araya", v: 11 },
    { n: "Julio Crisosto", v: 11 },
    { n: "Atilio Cremaschi", v: 10 },
    { n: "Rene Melendez", v: 10 },
    { n: "Reinaldo Navia", v: 10 },
    { n: "Francisco Valdes", v: 9 },
    { n: "Jose Luis Sierra", v: 8 },
    { n: "Marcelo Pinilla", v: 8 },
    { n: "Charles Aranguiz", v: 7 },
    { n: "Jorge Valdivia", v: 7 },
    { n: "Ruben Marcos", v: 7 },
    { n: "Jean Beausejour", v: 6 },
    { n: "Javier Margas", v: 6 },
    { n: "Mark Gonzalez", v: 6 },
    { n: "Gary Medel", v: 5 }, /* active — re-verify frequently */
    { n: "Mauricio Isla", v: 5 }, /* active — re-verify frequently */
    { n: "Fabian Estay", v: 5 },
    { n: "Jose Pedro Fuenzalida", v: 5 },
    { n: "Patricio Yanez", v: 5 },
    { n: "Esteban Valencia", v: 5 },
    { n: "Fernando Cornejo", v: 5 }
  ]
};
