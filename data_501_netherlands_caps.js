/* data_501_netherlands_caps.js — Football 501 category: Netherlands men's
 * national team all-time most-capped players. Value = career caps for the
 * Netherlands.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Netherlands national football team
 *                         records and statistics" (Most-capped players
 *                         table, as of 2026-06-29)
 *   Cross-check source:  besoccer.com ("Top 10 most capped players for the
 *                         Netherlands") — independently confirms Sneijder
 *                         (134), van der Sar (130), de Boer (112), van der
 *                         Vaart (109), Blind/Depay (108/112 tie region),
 *                         van Bronckhorst (106), Kuyt (104), van Persie
 *                         (102), Cocu (101) for the top 10. Rows 11-21
 *                         (Robben through Bergkamp) sourced via WebSearch
 *                         aggregation to extend past the top-10 cutoff.
 *   asOf:                2026-06-29
 *   Re-verify:           none of these players were active internationals
 *                         as of asOf — all totals should be stable
 *                         (retired careers).
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.netherlands_caps = {
  label: "Netherlands all-time most capped players",
  unit: "caps",
  asOf: "2026-06-29",
  source: "https://en.wikipedia.org/wiki/Netherlands_national_football_team_records_and_statistics",
  rows: [
    { n: "Wesley Sneijder",           v: 134 },
    { n: "Edwin van der Sar",         v: 130 },
    { n: "Frank de Boer",             v: 112 },
    { n: "Memphis Depay",             v: 112 },
    { n: "Rafael van der Vaart",      v: 109 },
    { n: "Daley Blind",               v: 108 },
    { n: "Giovanni van Bronckhorst",  v: 106 },
    { n: "Dirk Kuyt",                 v: 104 },
    { n: "Robin van Persie",          v: 102 },
    { n: "Phillip Cocu",              v: 101 },
    { n: "Arjen Robben",              v: 96 },
    { n: "Georginio Wijnaldum",       v: 96 },
    { n: "Virgil van Dijk",           v: 88 },
    { n: "John Heitinga",             v: 87 },
    { n: "Clarence Seedorf",          v: 87 },
    { n: "Marc Overmars",             v: 86 },
    { n: "Joris Mathijsen",           v: 84 },
    { n: "Aron Winter",               v: 84 },
    { n: "Ruud Krol",                 v: 83 },
    { n: "Nigel de Jong",             v: 81 },
    { n: "Dennis Bergkamp",           v: 79 }
  ]
};
