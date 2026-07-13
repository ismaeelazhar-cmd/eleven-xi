/* data_501_italy_caps.js — Football 501 category: Italy men's national
 * team all-time most-capped players. Value = career caps for Italy.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Italy national football team records
 *                         and statistics" (Most appearances table, as of
 *                         2026-06-29)
 *   Cross-check source:  WebSearch aggregation (433Futbol.com / eu-football.info) —
 *                         independently confirms Buffon (176), Maldini (126),
 *                         Cannavaro (136), De Rossi (117) exactly; Del
 *                         Piero's cap total (91) sourced separately to
 *                         extend past the Wikipedia table's top-10 cutoff.
 *   asOf:                2026-06-29
 *   Re-verify:           none of these players were active internationals
 *                         as of asOf — all totals should be stable
 *                         (retired careers), though re-verify Del Piero's
 *                         91-cap figure against a primary Italian-language
 *                         source if precision matters.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.italy_caps = {
  label: "Italy all-time most capped players",
  unit: "caps",
  asOf: "2026-06-29",
  source: "https://en.wikipedia.org/wiki/Italy_national_football_team_records_and_statistics",
  rows: [
    { n: "Gianluigi Buffon",       v: 176 },
    { n: "Fabio Cannavaro",        v: 136 },
    { n: "Paolo Maldini",          v: 126 },
    { n: "Leonardo Bonucci",       v: 121 },
    { n: "Giorgio Chiellini",      v: 117 },
    { n: "Daniele De Rossi",       v: 117 },
    { n: "Andrea Pirlo",           v: 116 },
    { n: "Dino Zoff",              v: 112 },
    { n: "Gianluca Zambrotta",     v: 98 },
    { n: "Giacinto Facchetti",     v: 94 },
    { n: "Alessandro Del Piero",   v: 91 }
  ]
};
