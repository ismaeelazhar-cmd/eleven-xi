/* data_501_usa_scorers.js — Football 501 category: USA men's national
 * team all-time top scorers. Value = career goals for the USA.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "USA - Record International Players"
 *                         (goalscoring table, data through 18 Nov 2025).
 *   Cross-check source:  Wikipedia — "United States men's national soccer
 *                         team records and statistics" — independently
 *                         confirms Dempsey/Donovan's tied lead at 57 and
 *                         puts Pulisic at 33 goals (one ahead of RSSSF's
 *                         32-goal snapshot since he remained an active
 *                         international into 2026) — the more current
 *                         Wikipedia figure is used, drift documented.
 *   asOf:                2026-07-18
 *   Re-verify:           Pulisic, Ferreira, Pepi, Wood, McKennie, and
 *                         Aaronson were still active internationals as of
 *                         asOf — re-verify their totals frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.usa_scorers = {
  label: "USA all-time top scorers",
  unit: "goals",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/usa-recintlp.html",
  rows: [
    { n: "Clint Dempsey", v: 57 },
    { n: "Landon Donovan", v: 57 },
    { n: "Jozy Altidore", v: 42 },
    { n: "Eric Wynalda", v: 34 },
    { n: "Christian Pulisic", v: 33 }, /* active — re-verify frequently */
    { n: "Brian McBride", v: 30 },
    { n: "Joe-Max Moore", v: 24 },
    { n: "Bruce Murray", v: 21 },
    { n: "Eddie Johnson", v: 19 },
    { n: "DaMarcus Beasley", v: 17 },
    { n: "Michael Bradley", v: 17 },
    { n: "Earnie Stewart", v: 17 },
    { n: "Jesus Ferreira", v: 15 }, /* active — re-verify frequently */
    { n: "Cobi Jones", v: 15 },
    { n: "Carlos Bocanegra", v: 14 },
    { n: "Gyasi Zardes", v: 14 },
    { n: "Marcelo Balboa", v: 13 },
    { n: "Ricardo Pepi", v: 13 }, /* active — re-verify frequently */
    { n: "Hugo Perez", v: 13 },
    { n: "Bobby Wood", v: 13 },
    { n: "Frank Klopas", v: 12 },
    { n: "Clint Mathis", v: 12 },
    { n: "Brian Ching", v: 11 },
    { n: "Weston McKennie", v: 11 }, /* active — re-verify frequently */
    { n: "Peter Vermes", v: 11 },
    { n: "Chris Wondolowski", v: 11 },
    { n: "Brenden Aaronson", v: 10 }, /* active — re-verify frequently */
    { n: "Paul Arriola", v: 10 },
    { n: "Eddie Lewis", v: 10 },
    { n: "Jordan Morris", v: 10 },
    { n: "William Roy", v: 10 }
  ]
};
