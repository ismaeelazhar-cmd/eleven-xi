/* data_501_sweden_caps.js — Football 501 category: Sweden men's national
 * team all-time most-capped players. Value = career caps for Sweden.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Sweden national football team
 *                         records and statistics" (Most capped players
 *                         table).
 *   Cross-check source:  RSSSF — "Sweden - Record International Players"
 *                         — independently confirms Anders Svensson's lead
 *                         at 148 caps and Ibrahimovic's 122.
 *   asOf:                2026-07-18
 *   Re-verify:           None of the players in this top-10 were still
 *                         active as of asOf, so drift risk is low.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.sweden_caps = {
  label: "Sweden all-time most capped players",
  unit: "caps",
  asOf: "2026-07-18",
  source: "https://en.wikipedia.org/wiki/Sweden_national_football_team_records_and_statistics",
  rows: [
    { n: "Anders Svensson",      v: 148 },
    { n: "Thomas Ravelli",       v: 143 },
    { n: "Sebastian Larsson",    v: 133 },
    { n: "Andreas Isaksson",     v: 133 },
    { n: "Kim Kallstrom",        v: 131 },
    { n: "Zlatan Ibrahimovic",   v: 122 },
    { n: "Olof Mellberg",        v: 117 },
    { n: "Roland Nilsson",       v: 116 },
    { n: "Bjorn Nordqvist",      v: 115 },
    { n: "Niclas Alexandersson", v: 109 }
  ]
};
