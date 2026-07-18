/* data_501_mexico_scorers.js — Football 501 category: Mexico men's
 * national team all-time top scorers. Value = career goals for Mexico.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Mexico - Record International Players"
 *                         (goalscoring table).
 *   Cross-check source:  Wikipedia — "Mexico national football team
 *                         records and statistics" — independently
 *                         confirms the top-10 order and totals almost
 *                         exactly (Chicharito 52, Borgetti 46 vs
 *                         Wikipedia's 46, Jimenez 44 vs Wikipedia's 48 —
 *                         Jimenez remained an active international into
 *                         2026, so the higher/more current Wikipedia
 *                         figure is used here, drift documented).
 *   asOf:                2026-07-18
 *   Re-verify:           Jimenez, Lozano, and Vela were still active
 *                         internationals as of asOf — re-verify their
 *                         totals frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.mexico_scorers = {
  label: "Mexico all-time top scorers",
  unit: "goals",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/mex-recintlp.html",
  rows: [
    { n: "Javier Hernandez", v: 52 },
    { n: "Jared Borgetti", v: 46 },
    { n: "Raul Jimenez", v: 48 }, /* active — re-verify frequently */
    { n: "Cuauhtemoc Blanco", v: 39 },
    { n: "Carlos Hermosillo", v: 35 },
    { n: "Luis Hernandez", v: 35 },
    { n: "Enrique Borja", v: 31 },
    { n: "Luis Roberto Alves", v: 30 },
    { n: "Luis Flores", v: 29 },
    { n: "Luis Garcia Postigo", v: 29 },
    { n: "Benjamin Galindo", v: 28 },
    { n: "Andres Guardado", v: 28 },
    { n: "Hugo Sanchez", v: 27 },
    { n: "Oribe Peralta", v: 25 },
    { n: "Jose Francisco Fonseca", v: 21 },
    { n: "Alberto Garcia Aspe", v: 21 },
    { n: "Giovani Dos Santos", v: 19 },
    { n: "Javier Fragoso", v: 19 },
    { n: "Hirving Lozano", v: 19 }, /* active — re-verify frequently */
    { n: "Carlos Vela", v: 19 },
    { n: "Rafael Marquez", v: 17 },
    { n: "Isidoro Diaz", v: 16 },
    { n: "Ricardo Pelaez", v: 16 },
    { n: "Omar Bravo", v: 15 },
    { n: "Horacio Casaran", v: 15 },
    { n: "Ramon Ramirez", v: 15 },
    { n: "Carlos Antuna", v: 14 },
    { n: "Salvador Reyes", v: 14 },
    { n: "Javier Aguirre", v: 13 },
    { n: "Ernesto Cisneros", v: 13 }
  ]
};
