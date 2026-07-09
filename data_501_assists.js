/* data_501_assists.js — Football 501 category: Premier League all-time
 * assist leaders. Value = career Premier League assists.
 *
 * VERIFICATION (B6 pipeline): The Analyst (Opta) "Which Player Has the Most
 * Premier League Assists?" (primary), cross-checked against StatMuse
 * reporting the same figures. asOf: 2026-07-08. Re-verify each season for
 * active players (De Bruyne, Salah). */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.assists = {
  label: "Premier League assists",
  unit: "assists",
  asOf: "2026-07-08",
  source: "https://theanalyst.com/articles/most-premier-league-assists-players",
  rows: [
    { n: "Ryan Giggs",         v: 162 },
    { n: "Kevin De Bruyne",    v: 119 }, /* active — re-verify each season */
    { n: "Cesc Fabregas",      v: 111 },
    { n: "Wayne Rooney",       v: 103 },
    { n: "Frank Lampard",      v: 102 },
    { n: "Dennis Bergkamp",    v: 94 },
    { n: "David Silva",        v: 93 },
    { n: "Steven Gerrard",     v: 92 },
    { n: "James Milner",       v: 89 },
    { n: "Mohamed Salah",      v: 87 } /* active — re-verify each season */
  ]
};
