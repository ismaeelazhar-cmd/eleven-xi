/* data_501_man_city_scorers.js — Football 501 category: Manchester City
 * all-time top scorers (career goals for the club, all competitions).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      manchestercitylatestnews.com — full ranked
 *                         all-time top-scorers table.
 *   Cross-check source:  Goal.com's own "Manchester City all-time top
 *                         goal scorers" reporting independently confirms
 *                         the top 2 (Agüero 260, Brook 177).
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals
 *                         (Erling Haaland was reported as "approaching"
 *                         this list per Goal.com but hadn't cracked the
 *                         top 10 as of the sources checked).
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.man_city_scorers = {
  label: "Manchester City all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://manchestercitylatestnews.com/manchester-city-top-scorers/",
  rows: [
    { n: "Sergio Aguero",     v: 260 },
    { n: "Eric Brook",        v: 177 },
    { n: "Tommy Johnson",     v: 166 },
    { n: "Colin Bell",        v: 153 },
    { n: "Joe Hayes",         v: 152 },
    { n: "Francis Lee",       v: 148 },
    { n: "Billy Meredith",    v: 147 },
    { n: "Tommy Browell",     v: 139 },
    { n: "Billie Gillespie",  v: 132 },
    { n: "Fred Tilson",       v: 130 },
    { n: "Kevin De Bruyne",   v: 108 },
    { n: "Shaun Goater",      v: 105 },
    { n: "Yaya Toure",        v: 81  },
    { n: "David Silva",       v: 77  }
  ]
};
