/* data_501_chile_caps.js — Football 501 category: Chile men's national
 * team all-time most-capped players. Value = career caps for Chile.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Chile national football team
 *                         records and statistics" (Most capped players
 *                         table) for the top 10; RSSSF — "Chile - Record
 *                         International Players" for ranks 11-20.
 *   Cross-check source:  RSSSF's own snapshot confirms the same top-10
 *                         order and totals as Wikipedia exactly.
 *   asOf:                2026-07-18
 *   Re-verify:           Sanchez, Medel, Vidal, Isla, and Aranguiz were
 *                         still plausibly active internationals as of
 *                         asOf. Note: this category needed all 20 rows
 *                         (not just top-10) — the top-10 alone summed to
 *                         1302 but failed subset-sum since the values
 *                         cluster too tightly, same "sum isn't enough"
 *                         lesson as Mexico's caps list.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.chile_caps = {
  label: "Chile all-time most capped players",
  unit: "caps",
  asOf: "2026-07-18",
  source: "https://en.wikipedia.org/wiki/Chile_national_football_team_records_and_statistics",
  rows: [
    { n: "Alexis Sanchez", v: 168 }, /* active — re-verify frequently */
    { n: "Gary Medel", v: 161 }, /* active — re-verify frequently */
    { n: "Claudio Bravo", v: 150 },
    { n: "Arturo Vidal", v: 147 }, /* active — re-verify frequently */
    { n: "Mauricio Isla", v: 144 }, /* active — re-verify frequently */
    { n: "Eduardo Vargas", v: 120 }, /* active — re-verify frequently */
    { n: "Gonzalo Jara", v: 115 },
    { n: "Jean Beausejour", v: 109 },
    { n: "Charles Aranguiz", v: 103 }, /* active — re-verify frequently */
    { n: "Leonel Sanchez", v: 84 },
    { n: "Jorge Valdivia", v: 79 },
    { n: "Matias Fernandez", v: 74 },
    { n: "Eugenio Mena", v: 73 },
    { n: "Nelson Tapia", v: 73 },
    { n: "Alberto Fouilloux", v: 70 },
    { n: "Marcelo Salas", v: 70 },
    { n: "Fabian Estay", v: 69 },
    { n: "Ivan Zamorano", v: 69 },
    { n: "Pablo Contreras", v: 67 },
    { n: "Javier Margas", v: 63 }
  ]
};
