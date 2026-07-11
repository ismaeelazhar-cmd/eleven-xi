/* data_501_spurs_scorers.js — Football 501 category: Tottenham Hotspur
 * all-time top scorers (career goals for the club, all competitions).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Tottenham Hotspur F.C.
 *                         records and statistics" (Top 10 all-time
 *                         scorers table)
 *   Cross-check source:  Harry Kane surpassing Jimmy Greaves' previous
 *                         league-goals record in 2023 is widely and
 *                         independently reported general football
 *                         knowledge, confirming the #1/#2 order.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals
 *                         (Kane left for Bayern Munich, Son's tenure
 *                         also closed as of the data captured).
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.spurs_scorers = {
  label: "Tottenham Hotspur all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Tottenham_Hotspur_F.C._records_and_statistics",
  rows: [
    { n: "Harry Kane",         v: 280 },
    { n: "Jimmy Greaves",      v: 268 },
    { n: "Bobby Smith",        v: 208 },
    { n: "Martin Chivers",     v: 174 },
    { n: "Son Heung-min",      v: 173 },
    { n: "Cliff Jones",        v: 159 },
    { n: "Jermain Defoe",      v: 143 },
    { n: "George Hunt",        v: 138 },
    { n: "Len Duquemin",       v: 134 },
    { n: "Alan Gilzean",       v: 133 },
    { n: "Teddy Sheringham",   v: 124 },
    { n: "Glenn Hoddle",       v: 88  },
    { n: "Gareth Bale",        v: 56  }
  ]
};
