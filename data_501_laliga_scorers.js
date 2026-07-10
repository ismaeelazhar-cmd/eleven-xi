/* data_501_laliga_scorers.js — Football 501 category: La Liga all-time top
 * scorers (career goals in La Liga, across all clubs a player represented).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      laligaexpert.com — "La Liga all-time top scorers"
 *                         (every player with 150+ career La Liga goals)
 *   Cross-check source:  Wikipedia — "List of La Liga top scorers" —
 *                         independently confirms the top 10 rows below with
 *                         matching goal totals (Messi 474, Ronaldo 311,
 *                         Zarra 251, Benzema 238, Hugo Sánchez 234, Raúl 228,
 *                         Di Stéfano 227, César Rodríguez 221, Quini 219,
 *                         Pahiño 212). Griezmann differs slightly between
 *                         the two sources (198 vs 205) — used the more
 *                         detailed/recent laligaexpert figure, noting the
 *                         variance rather than hiding it.
 *   asOf:                2026-07-11
 *   Re-verify:           Griezmann is still an active La Liga player as of
 *                         asOf — his total will keep climbing, re-verify
 *                         each season.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.laliga_scorers = {
  label: "La Liga all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://laligaexpert.com/la-liga-all-time-top-scorers/",
  rows: [
    { n: "Lionel Messi",           v: 474 },
    { n: "Cristiano Ronaldo",      v: 311 },
    { n: "Telmo Zarra",            v: 251 },
    { n: "Karim Benzema",          v: 238 },
    { n: "Hugo Sanchez",           v: 234 },
    { n: "Raul",                   v: 228 },
    { n: "Alfredo Di Stefano",     v: 227 },
    { n: "Cesar Rodriguez",        v: 221 },
    { n: "Quini",                  v: 219 },
    { n: "Pahino",                 v: 212 },
    { n: "Antoine Griezmann",      v: 198 }, /* active — re-verify each season */
    { n: "Edmundo Suarez",         v: 195 },
    { n: "Santillana",             v: 186 },
    { n: "David Villa",            v: 186 },
    { n: "Guillermo Gorostiza",    v: 183 },
    { n: "Juan Arza",              v: 182 },
    { n: "Luis Suarez",            v: 179 },
    { n: "Iago Aspas",             v: 165 },
    { n: "Samuel Eto'o",           v: 162 },
    { n: "Luis Aragones",          v: 160 },
    { n: "Aritz Aduriz",           v: 158 },
    { n: "Ferenc Puskas",          v: 156 },
    { n: "Julio Salinas",          v: 152 },
    { n: "Adrian Escudero",        v: 150 }
  ]
};
