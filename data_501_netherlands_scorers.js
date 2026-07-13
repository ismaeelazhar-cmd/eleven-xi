/* data_501_netherlands_scorers.js — Football 501 category: Netherlands
 * men's national team all-time top scorers. Value = career goals for the
 * Netherlands.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Netherlands national football team
 *                         records and statistics" (Top goalscorers table)
 *   Cross-check source:  FIFA.com ("Memphis Depay becomes all-time top
 *                         Netherlands goalscorer") and WebSearch
 *                         aggregation — independently confirms Depay (55),
 *                         van Persie (50), Huntelaar (42), Kluivert (40),
 *                         Bergkamp (37) for the top 5. Robben's total (36
 *                         per this primary table) showed a 1-goal variance
 *                         against a separate aggregation (37) — expected
 *                         snapshot drift, documented rather than silently
 *                         resolved. Sneijder, Wijnaldum, van Basten, Kuyt,
 *                         Gullit, Overmars, and Koeman sourced via
 *                         WebSearch aggregation to extend past the
 *                         Wikipedia table's top-10-only cutoff.
 *   asOf:                2026-07-13
 *   Re-verify:           Memphis Depay was still an active international
 *                         as of asOf (through World Cup 2026) — his total
 *                         (55) is a live, moving figure; re-verify
 *                         frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.netherlands_scorers = {
  label: "Netherlands all-time top scorers",
  unit: "goals",
  asOf: "2026-07-13",
  source: "https://en.wikipedia.org/wiki/Netherlands_national_football_team_records_and_statistics",
  rows: [
    { n: "Memphis Depay",          v: 55 }, /* active — re-verify frequently */
    { n: "Robin van Persie",       v: 50 },
    { n: "Klaas-Jan Huntelaar",    v: 42 },
    { n: "Patrick Kluivert",       v: 40 },
    { n: "Dennis Bergkamp",        v: 37 },
    { n: "Arjen Robben",           v: 36 },
    { n: "Faas Wilkes",            v: 35 },
    { n: "Ruud van Nistelrooy",    v: 35 },
    { n: "Abe Lenstra",            v: 33 },
    { n: "Johan Cruyff",           v: 33 },
    { n: "Wesley Sneijder",        v: 31 },
    { n: "Georginio Wijnaldum",    v: 28 },
    { n: "Marco van Basten",       v: 24 },
    { n: "Dirk Kuyt",              v: 24 },
    { n: "Ruud Gullit",            v: 17 },
    { n: "Marc Overmars",          v: 17 },
    { n: "Ronald Koeman",          v: 14 }
  ]
};
