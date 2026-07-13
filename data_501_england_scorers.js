/* data_501_england_scorers.js — Football 501 category: England men's
 * national team all-time top scorers. Value = career goals for England.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "England national football team
 *                         records and statistics" (Top goalscorers table)
 *   Cross-check source:  englandfootball.com — "England men's all-time
 *                         record goalscorers list" — independently confirms
 *                         every row 1-10 (Kane/Rooney/Charlton/Lineker/
 *                         Greaves/Owen/Finney/Lofthouse/Shearer/Lampard)
 *                         with identical goal totals; Beckham (17), Hurst
 *                         (24), Mortensen (23), and Keegan (21) sourced
 *                         separately (englandstats.com / RSSSF-style
 *                         historical records) to extend the list past the
 *                         Wikipedia table's top-10 cutoff.
 *   asOf:                2026-07-11
 *   Re-verify:           Harry Kane is an active international as of asOf
 *                         (still playing at World Cup 2026) — his total
 *                         (85) is a live, moving figure; re-verify
 *                         frequently rather than treating it as final.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.england_scorers = {
  label: "England all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/England_national_football_team_records_and_statistics",
  rows: [
    { n: "Harry Kane",        v: 85 }, /* active — re-verify frequently */
    { n: "Wayne Rooney",      v: 53 },
    { n: "Bobby Charlton",    v: 49 },
    { n: "Gary Lineker",      v: 48 },
    { n: "Jimmy Greaves",     v: 44 },
    { n: "Michael Owen",      v: 40 },
    { n: "Nat Lofthouse",     v: 30 },
    { n: "Alan Shearer",      v: 30 },
    { n: "Tom Finney",        v: 30 },
    { n: "Vivian Woodward",   v: 29 },
    { n: "Frank Lampard",     v: 29 },
    { n: "Geoff Hurst",       v: 24 },
    { n: "Stan Mortensen",    v: 23 },
    { n: "Kevin Keegan",      v: 21 },
    { n: "David Beckham",     v: 17 }
  ]
};
