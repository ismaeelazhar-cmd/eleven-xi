/* data_501_real_madrid_scorers.js — Football 501 category: Real Madrid CF
 * all-time top scorers (all competitions). Value = career goals for the club.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Sports Illustrated — "Top 20 Goalscorers in Real
 *                         Madrid History" (used for depth beyond the top 10,
 *                         which most other sources stop at)
 *   Cross-check source:  Wikipedia — "List of Real Madrid CF records and
 *                         statistics" (Top goalscorers table) — independently
 *                         confirms the top 10 rows below (Ronaldo/Benzema/
 *                         Raúl/Di Stéfano/Santillana/Puskás/Hugo Sánchez);
 *                         Gento/Pirri/Butragueño differ by 1 goal between the
 *                         two sources (182 vs 183 / 172 vs 171 / 171 vs 170)
 *                         — a known minor variance in how some older-era
 *                         competitions get counted, noted rather than hidden.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         top-20 as of asOf, so all rows are closed career
 *                         totals — only needs a periodic spot-check.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.real_madrid_scorers = {
  label: "Real Madrid all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://www.si.com/soccer/top-20-goalscorers-in-real-madrid-history",
  rows: [
    { n: "Cristiano Ronaldo",   v: 450 },
    { n: "Karim Benzema",       v: 354 },
    { n: "Raul",                v: 323 },
    { n: "Alfredo Di Stefano",  v: 308 },
    { n: "Santillana",          v: 290 },
    { n: "Ferenc Puskas",       v: 242 },
    { n: "Hugo Sanchez",        v: 208 },
    { n: "Paco Gento",          v: 182 },
    { n: "Pirri",               v: 172 },
    { n: "Emilio Butragueno",   v: 171 },
    { n: "Amancio",             v: 155 },
    { n: "Michel",              v: 130 },
    { n: "Fernando Hierro",     v: 127 },
    { n: "Pahino",              v: 125 },
    { n: "Juanito",             v: 121 },
    { n: "Gonzalo Higuain",     v: 121 },
    { n: "Gareth Bale",         v: 106 },
    { n: "Ronaldo Nazario",     v: 104 },
    { n: "Luis Molowny",        v: 104 },
    { n: "Sergio Ramos",        v: 101 }
  ]
};
