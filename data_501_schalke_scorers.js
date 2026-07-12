/* data_501_schalke_scorers.js — Football 501 category: FC Schalke 04
 * all-time top scorers (career goals for the club, across all eras).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of FC Schalke 04 records and
 *                         statistics" (Top goalscorers table, all eras)
 *   Cross-check note:    a separate, shallower search aggregation gave a
 *                         lower Kuzorra figure (271 vs 445 here) — the
 *                         deeper dedicated records page is used as
 *                         primary since it explicitly covers his full
 *                         26-year, multi-era career (pre-Bundesliga
 *                         regional leagues included), which the shorter
 *                         aggregation likely didn't. Klaus Fischer's 226
 *                         figure is independently confirmed by both
 *                         sources.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.schalke_scorers = {
  label: "Schalke 04 all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_FC_Schalke_04_records_and_statistics",
  rows: [
    { n: "Ernst Kuzorra",        v: 445 },
    { n: "Fritz Szepan",         v: 311 },
    { n: "Klaus Fischer",        v: 226 },
    { n: "Ernst Kalwitzki",      v: 195 },
    { n: "Bernhard Klodt",       v: 168 },
    { n: "Hermann Eppenhoff",    v: 146 },
    { n: "Klaas-Jan Huntelaar",  v: 128 },
    { n: "Adolf Urban",          v: 124 },
    { n: "Ernst Poertgen",       v: 104 },
    { n: "Ebbe Sand",            v: 104 },
    { n: "Julian Draxler",       v: 29  },
    { n: "Leon Goretzka",        v: 14  },
    { n: "Ivan Rakitic",         v: 12  }
  ]
};
