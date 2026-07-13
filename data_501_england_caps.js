/* data_501_england_caps.js — Football 501 category: England men's
 * national team all-time most-capped players. Value = career caps for
 * England.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "England national football team
 *                         records and statistics" (Most appearances table)
 *   Cross-check source:  englandfootball.com — "England men's all-time
 *                         record appearances/international caps" —
 *                         independently confirms every row through Bryan
 *                         Robson (90), with one expected variance: Kane is
 *                         shown level with Rooney on 120 caps in the more
 *                         recent englandfootball.com article vs 119 in the
 *                         Wikipedia table used here — he was still an
 *                         active international as of asOf, so his exact
 *                         figure is a moving target, flagged rather than
 *                         silently picking one. Owen (89), Henderson (87),
 *                         Sansom (86), Neville (85) sourced separately
 *                         (search-aggregated historical record sites) to
 *                         extend the list past Wikipedia's top-10 cutoff.
 *   asOf:                2026-07-11
 *   Re-verify:           Harry Kane was still an active international as
 *                         of asOf — re-verify his cap total frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.england_caps = {
  label: "England all-time most capped players",
  unit: "caps",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/England_national_football_team_records_and_statistics",
  rows: [
    { n: "Peter Shilton",     v: 125 },
    { n: "Wayne Rooney",      v: 120 },
    { n: "Harry Kane",        v: 119 }, /* active — re-verify frequently */
    { n: "David Beckham",     v: 115 },
    { n: "Steven Gerrard",    v: 114 },
    { n: "Bobby Moore",       v: 108 },
    { n: "Ashley Cole",       v: 107 },
    { n: "Bobby Charlton",    v: 106 },
    { n: "Frank Lampard",     v: 106 },
    { n: "Billy Wright",      v: 105 },
    { n: "Bryan Robson",      v: 90 },
    { n: "Michael Owen",      v: 89 },
    { n: "Jordan Henderson",  v: 87 },
    { n: "Kenny Sansom",      v: 86 },
    { n: "Gary Neville",      v: 85 }
  ]
};
