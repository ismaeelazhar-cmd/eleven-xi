/* data_501_germany_scorers.js — Football 501 category: Germany men's
 * national team all-time top scorers. Value = career goals for Germany
 * (West Germany + unified Germany combined, per standard convention).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of leading goalscorers for the
 *                         German national football team"
 *   Cross-check source:  Wikipedia — "Germany national football team
 *                         records and statistics" (Top scorers section) and
 *                         WebSearch aggregation (11v11.com / worldfootball.net /
 *                         khelnow.com) — independently confirms Klose (71),
 *                         Müller (68), Podolski (49), Völler (47),
 *                         Klinsmann (47), Rummenigge (45), T. Müller (45),
 *                         Seeler (43), Ballack (42), Bierhoff (37) exactly.
 *   asOf:                2026-07-13
 *   Re-verify:           Kai Havertz, Serge Gnabry, and Timo Werner were
 *                         still active internationals as of asOf — re-verify
 *                         their totals frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.germany_scorers = {
  label: "Germany all-time top scorers",
  unit: "goals",
  asOf: "2026-07-13",
  source: "https://en.wikipedia.org/wiki/List_of_leading_goalscorers_for_the_German_national_football_team",
  rows: [
    { n: "Miroslav Klose",         v: 71 },
    { n: "Gerd Muller",            v: 68 },
    { n: "Lukas Podolski",         v: 49 },
    { n: "Rudi Voller",            v: 47 },
    { n: "Jurgen Klinsmann",       v: 47 },
    { n: "Karl-Heinz Rummenigge",  v: 45 },
    { n: "Thomas Muller",          v: 45 },
    { n: "Uwe Seeler",             v: 43 },
    { n: "Michael Ballack",        v: 42 },
    { n: "Oliver Bierhoff",        v: 37 },
    { n: "Klaus Fischer",          v: 32 },
    { n: "Ernst Lehner",           v: 31 },
    { n: "Mario Gomez",            v: 31 },
    { n: "Andreas Moller",         v: 29 },
    { n: "Serge Gnabry",           v: 26 }, /* active — re-verify frequently */
    { n: "Kai Havertz",            v: 25 }, /* active — re-verify frequently */
    { n: "Timo Werner",            v: 24 }, /* active — re-verify frequently */
    { n: "Mesut Ozil",             v: 23 },
    { n: "Leroy Sane",             v: 18 }, /* active — re-verify frequently */
    { n: "Karl-Heinz Riedle",      v: 16 }
  ]
};
