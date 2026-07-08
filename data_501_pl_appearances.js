/* data_501_pl_appearances.js — Football 501 category: Premier League all-time
 * appearance leaders. Value = career Premier League appearances.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Premier League records and statistics",
 *                         Most Appearances table
 *   Cross-check source:  The Analyst (Opta) — "Players With the Most Premier
 *                         League Appearances" — independently confirms all 20
 *                         rows below match exactly between both sources.
 *   asOf:                2026-07-08
 *   Re-verify:           James Milner (#1) retired June 2026, so his total is
 *                         now a closed record — this list is fully closed for
 *                         all 20 rows as of this snapshot. Still spot-check
 *                         before major pushes in case of record corrections.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.pl_appearances = {
  label: "Premier League appearances",
  unit: "apps",
  asOf: "2026-07-08",
  source: "https://en.wikipedia.org/wiki/Premier_League_records_and_statistics",
  rows: [
    { n: "James Milner",     v: 658 },
    { n: "Gareth Barry",     v: 653 },
    { n: "Ryan Giggs",       v: 632 },
    { n: "Frank Lampard",    v: 609 },
    { n: "David James",      v: 572 },
    { n: "Gary Speed",       v: 535 },
    { n: "Emile Heskey",     v: 516 },
    { n: "Mark Schwarzer",   v: 514 },
    { n: "Jamie Carragher",  v: 508 },
    { n: "Phil Neville",     v: 505 },
    { n: "Rio Ferdinand",    v: 504 },
    { n: "Steven Gerrard",   v: 504 },
    { n: "Sol Campbell",     v: 503 },
    { n: "Paul Scholes",     v: 499 },
    { n: "Jermain Defoe",    v: 496 },
    { n: "John Terry",       v: 492 },
    { n: "Wayne Rooney",     v: 491 },
    { n: "Ashley Young",     v: 485 },
    { n: "Michael Carrick",  v: 481 },
    { n: "Sylvain Distin",   v: 469 }
  ]
};
