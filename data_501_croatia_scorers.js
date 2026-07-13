/* data_501_croatia_scorers.js — Football 501 category: Croatia men's
 * national team all-time top scorers. Value = career goals for Croatia.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Croatia national football team
 *                         records and statistics" (Top scorers table, as
 *                         of 2 July 2026).
 *   Cross-check source:  RSSSF — "Croatia - Record International Players"
 *                         and Wikipedia's "List of Croatia national
 *                         football team goalscorers" — independently
 *                         confirm the ranking order and supply ranks
 *                         11-34 past the records page's top-10 cut. RSSSF's
 *                         own snapshot (through Nov 2025) trails slightly
 *                         on a few low-goal mid-table names (e.g. Kranjcar
 *                         15 vs Wikipedia's more current 16) — expected
 *                         drift, documented rather than silently resolved.
 *   asOf:                2026-07-02
 *   Re-verify:           Croatia's per-player scoring ceiling tops out at
 *                         45 (Suker), but the mid/lower table thins out
 *                         fast, so this category needed 34 rows — the
 *                         deepest extension yet — before the total sum
 *                         cleared 501 with a clean subset-sum, the same
 *                         "sum shortfall" pattern seen in Italy, the
 *                         Netherlands, and Uruguay.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.croatia_scorers = {
  label: "Croatia all-time top scorers",
  unit: "goals",
  asOf: "2026-07-02",
  source: "https://en.wikipedia.org/wiki/Croatia_national_football_team_records_and_statistics",
  rows: [
    { n: "Davor Suker",          v: 45 },
    { n: "Ivan Perisic",         v: 39 }, /* active — re-verify frequently */
    { n: "Andrej Kramaric",      v: 36 }, /* active — re-verify frequently */
    { n: "Mario Mandzukic",      v: 33 },
    { n: "Eduardo",              v: 29 },
    { n: "Luka Modric",          v: 29 }, /* active — re-verify frequently */
    { n: "Darijo Srna",          v: 22 },
    { n: "Ivica Olic",           v: 20 },
    { n: "Niko Kranjcar",        v: 16 },
    { n: "Nikola Kalinic",       v: 15 },
    { n: "Ivan Rakitic",         v: 15 },
    { n: "Goran Vlaovic",        v: 15 },
    { n: "Niko Kovac",           v: 14 },
    { n: "Mladen Petric",        v: 13 },
    { n: "Zvonimir Boban",       v: 12 },
    { n: "Ivan Klasnic",         v: 12 },
    { n: "Franjo Wolfl",         v: 12 },
    { n: "Mario Pasalic",        v: 11 }, /* active — re-verify frequently */
    { n: "Bruno Petkovic",       v: 11 }, /* active — re-verify frequently */
    { n: "Bosko Balaban",        v: 10 },
    { n: "Alen Boksic",          v: 10 },
    { n: "Robert Prosinecki",    v: 10 },
    { n: "Nikola Vlasic",        v: 10 }, /* active — re-verify frequently */
    { n: "Lovro Majer",          v: 9 }, /* active — re-verify frequently */
    { n: "Dado Prso",            v: 9 },
    { n: "Marcelo Brozovic",     v: 7 }, /* active — re-verify frequently */
    { n: "Ante Budimir",         v: 7 }, /* active — re-verify frequently */
    { n: "Marko Babic",          v: 7 },
    { n: "Davor Vugrinec",       v: 7 },
    { n: "Nikica Jelavic",       v: 6 },
    { n: "Mateo Kovacic",        v: 5 }, /* active — re-verify frequently */
    { n: "Vedran Corluka",       v: 4 },
    { n: "Josko Gvardiol",       v: 4 }, /* active — re-verify frequently */
    { n: "Domagoj Vida",         v: 4 }
  ]
};
