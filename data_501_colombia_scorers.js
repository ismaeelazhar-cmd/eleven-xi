/* data_501_colombia_scorers.js — Football 501 category: Colombia men's
 * national team all-time top scorers. Value = career goals for Colombia.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Colombia national football team
 *                         records and statistics" (Top goalscorers table)
 *                         for the top 10; RSSSF — "Colombia - Record
 *                         International Players" for ranks 11+.
 *   Cross-check source:  RSSSF's own top-10 snapshot puts Luis Diaz at 21
 *                         (vs Wikipedia's more current 23, since he
 *                         remained active into 2026) — drift documented
 *                         rather than silently resolved.
 *   asOf:                2026-07-18
 *   Re-verify:           Luis Diaz, Borja, Mina, Muriel, and Santos Borre
 *                         were still plausibly active internationals as
 *                         of asOf — re-verify their totals frequently.
 *                         Note: this category needed 71 rows down to
 *                         1-goal players before the total sum cleared 501
 *                         — the deepest single extension of the whole
 *                         nation-stats phase (beating Scotland's 60).
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.colombia_scorers = {
  label: "Colombia all-time top scorers",
  unit: "goals",
  asOf: "2026-07-18",
  source: "https://en.wikipedia.org/wiki/Colombia_national_football_team_records_and_statistics",
  rows: [
    { n: "Radamel Falcao", v: 36 },
    { n: "James Rodriguez", v: 31 },
    { n: "Arnoldo Iguaran", v: 25 },
    { n: "Luis Diaz", v: 23 }, /* active — re-verify frequently */
    { n: "Faustino Asprilla", v: 20 },
    { n: "Freddy Rincon", v: 17 },
    { n: "Carlos Bacca", v: 16 },
    { n: "Teofilo Gutierrez", v: 15 },
    { n: "Victor Aristizabal", v: 15 },
    { n: "Adolfo Valencia", v: 14 },
    { n: "Ivan Valenciano", v: 13 },
    { n: "Anthony de Avila", v: 13 },
    { n: "Willington Ortiz", v: 12 },
    { n: "Carlos Valderrama", v: 11 },
    { n: "Juan Cuadrado", v: 11 },
    { n: "Edixon Perea", v: 9 },
    { n: "Miguel Angel Borja", v: 9 }, /* active — re-verify frequently */
    { n: "Juan Pablo Angel", v: 9 },
    { n: "Hernan Dario Herrera", v: 9 },
    { n: "Jackson Martinez", v: 8 },
    { n: "Hugo Rodallega", v: 8 },
    { n: "Luis Muriel", v: 8 }, /* active — re-verify frequently */
    { n: "Yerry Mina", v: 8 }, /* active — re-verify frequently */
    { n: "Eduardo Vilarete", v: 7 },
    { n: "Malher Moreno", v: 7 },
    { n: "Mario Yepes", v: 6 },
    { n: "Abel Aguilar", v: 6 },
    { n: "Jefferson Lerma", v: 6 },
    { n: "Mateus Uribe", v: 6 },
    { n: "Edwin Cardona", v: 6 },
    { n: "Juan Fernando Quintero", v: 6 },
    { n: "Rafael Santos Borre", v: 6 }, /* active — re-verify frequently */
    { n: "Giovanni Moreno", v: 6 },
    { n: "Ivan Cordoba", v: 5 },
    { n: "Freddy Guarin", v: 5 },
    { n: "Hamilton Ricard", v: 5 },
    { n: "Jairo Castillo", v: 5 },
    { n: "Neider Morantes", v: 5 },
    { n: "Wason Renteria", v: 5 },
    { n: "Luis Carlos Gonzalez", v: 5 },
    { n: "Gerardo Bedoya", v: 4 },
    { n: "Macnelly Torres", v: 4 },
    { n: "Gustavo Ramos", v: 4 },
    { n: "Jaime Castrillon", v: 4 },
    { n: "Hermenegildo Segrera", v: 4 },
    { n: "Davinson Sanchez", v: 3 },
    { n: "Jorge Bermudez", v: 3 },
    { n: "Wilmer Cabrera", v: 3 },
    { n: "John Harold Lozano", v: 3 },
    { n: "Wilson Enrique Perez", v: 3 },
    { n: "Victor Pacheco", v: 3 },
    { n: "Herman Gaviria", v: 3 },
    { n: "Luis Carlos Perea", v: 2 },
    { n: "Pablo Armero", v: 2 },
    { n: "Cristian Zapata", v: 2 },
    { n: "Gabriel Jaime Gomez", v: 2 },
    { n: "Alexis Mendoza", v: 2 },
    { n: "Leonel Alvarez", v: 1 },
    { n: "Luis Fernando Herrera", v: 1 },
    { n: "Juan Camilo Zuniga", v: 1 },
    { n: "Andres Escobar", v: 1 },
    { n: "John Viafara", v: 1 },
    { n: "Johan Mojica", v: 1 },
    { n: "William Tesillo", v: 1 },
    { n: "Yulian Anchico", v: 1 },
    { n: "Aquivaldo Mosquera", v: 1 },
    { n: "Frank Fabra", v: 1 },
    { n: "Jersson Gonzalez", v: 1 },
    { n: "Jorge Bolano", v: 1 },
    { n: "Gonzalo Martinez", v: 1 },
    { n: "Jeison Murillo", v: 1 }
  ]
};
