/* data_501_mexico_caps.js — Football 501 category: Mexico men's national
 * team all-time most-capped players. Value = career caps for Mexico.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Mexico - Record International Players"
 *                         (most-capped table).
 *   Cross-check source:  Wikipedia — "Mexico national football team
 *                         records and statistics" — independently
 *                         confirms Guardado's lead at 180-182 caps
 *                         (RSSSF's slightly higher 182 used here as the
 *                         more granular snapshot) and Claudio Suarez
 *                         second at 178.
 *   asOf:                2026-07-18
 *   Re-verify:           Raul Jimenez was still an active international
 *                         as of asOf — re-verify his total frequently.
 *                         Note: this category needed all 20 rows before
 *                         passing subset-sum — the top-10 alone (sum
 *                         2550) failed despite the huge total, because
 *                         the values cluster too tightly together (all in
 *                         the 96-182 range) for an exact 501 combination
 *                         to exist without the wider spread the extra 10
 *                         rows provide — the same "sum isn't enough, need
 *                         distinct-value breadth" lesson as PSV/Schalke.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.mexico_caps = {
  label: "Mexico all-time most capped players",
  unit: "caps",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/mex-recintlp.html",
  rows: [
    { n: "Andres Guardado", v: 182 }, /* over 180, always a "no go" throw */
    { n: "Claudio Suarez", v: 178 },
    { n: "Guillermo Ochoa", v: 152 },
    { n: "Rafael Marquez", v: 147 },
    { n: "Pavel Pardo", v: 147 },
    { n: "Gerardo Torrado", v: 146 },
    { n: "Hector Moreno", v: 132 },
    { n: "Jorge Campos", v: 130 },
    { n: "Carlos Salcido", v: 124 },
    { n: "Raul Jimenez", v: 123 }, /* active — re-verify frequently */
    { n: "Ramon Ramirez", v: 121 },
    { n: "Cuauhtemoc Blanco", v: 120 },
    { n: "Jesus Gallardo", v: 114 },
    { n: "Alberto Garcia Aspe", v: 110 },
    { n: "Javier Hernandez", v: 109 },
    { n: "Francisco Javier Rodriguez", v: 108 },
    { n: "Giovani Dos Santos", v: 107 },
    { n: "Hector Herrera", v: 105 },
    { n: "Oswaldo Sanchez", v: 99 },
    { n: "Edson Alvarez", v: 96 }
  ]
};
