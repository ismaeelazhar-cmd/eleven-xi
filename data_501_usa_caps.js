/* data_501_usa_caps.js — Football 501 category: USA men's national team
 * all-time most-capped players. Value = career caps for the USA.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "United States men's national soccer
 *                         team records and statistics" (Most appearances
 *                         table).
 *   Cross-check source:  RSSSF — "USA - Record International Players" —
 *                         independently confirms Cobi Jones' lead at 164
 *                         caps and the ranking order for this top-10.
 *   asOf:                2026-07-18
 *   Re-verify:           None of the players in this top-10 were still
 *                         active as of asOf, so drift risk is low.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.usa_caps = {
  label: "USA all-time most capped players",
  unit: "caps",
  asOf: "2026-07-18",
  source: "https://en.wikipedia.org/wiki/United_States_men%27s_national_soccer_team_records_and_statistics",
  rows: [
    { n: "Cobi Jones",         v: 164 },
    { n: "Landon Donovan",     v: 157 },
    { n: "Michael Bradley",    v: 151 },
    { n: "Clint Dempsey",      v: 141 },
    { n: "Jeff Agoos",         v: 134 },
    { n: "Marcelo Balboa",     v: 127 },
    { n: "DaMarcus Beasley",   v: 126 },
    { n: "Tim Howard",         v: 121 },
    { n: "Jozy Altidore",      v: 115 },
    { n: "Claudio Reyna",      v: 112 }
  ]
};
