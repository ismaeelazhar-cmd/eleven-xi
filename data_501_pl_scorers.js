/* data_501_pl_scorers.js — Football 501 category: Premier League all-time top scorers.
 * Value = career Premier League goals.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of footballers with 100 or more
 *                         Premier League goals" (all 35 rows below sourced from here)
 *   Cross-check source:  Premier League official all-time top-scorer reporting
 *                         (confirms the top of the list: Shearer 260, Kane 213,
 *                         Rooney 208, Salah as the top-scoring foreign player)
 *   asOf:                2026-07-08
 *   Re-verify:           every season for any row belonging to an ACTIVE player
 *                         (their totals still climb) — flagged per-row below.
 *                         Retired-player rows are closed totals and only need a
 *                         periodic spot-check.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.pl_scorers = {
  label: "Premier League top scorers",
  unit: "goals",
  asOf: "2026-07-08",
  source: "https://en.wikipedia.org/wiki/List_of_footballers_with_100_or_more_Premier_League_goals",
  rows: [
    { n: "Alan Shearer",            v: 260 },
    { n: "Harry Kane",              v: 213 }, /* active — re-verify each season */
    { n: "Wayne Rooney",            v: 208 },
    { n: "Mohamed Salah",           v: 193 }, /* active — re-verify each season */
    { n: "Andy Cole",               v: 187 },
    { n: "Sergio Aguero",           v: 184 },
    { n: "Frank Lampard",           v: 177 },
    { n: "Thierry Henry",           v: 175 },
    { n: "Robbie Fowler",           v: 163 },
    { n: "Jermain Defoe",           v: 162 },
    { n: "Michael Owen",            v: 150 },
    { n: "Les Ferdinand",           v: 149 },
    { n: "Teddy Sheringham",        v: 146 },
    { n: "Jamie Vardy",             v: 145 },
    { n: "Robin van Persie",        v: 144 },
    { n: "Jimmy Floyd Hasselbaink", v: 127 },
    { n: "Son Heung-min",           v: 126 },
    { n: "Robbie Keane",            v: 126 },
    { n: "Nicolas Anelka",          v: 125 },
    { n: "Dwight Yorke",            v: 123 },
    { n: "Raheem Sterling",         v: 123 }, /* active — re-verify each season */
    { n: "Romelu Lukaku",           v: 121 }, /* active — re-verify each season */
    { n: "Steven Gerrard",          v: 120 },
    { n: "Ian Wright",              v: 113 },
    { n: "Erling Haaland",          v: 112 }, /* active — re-verify each season, climbing fast */
    { n: "Sadio Mane",              v: 111 },
    { n: "Dion Dublin",             v: 111 },
    { n: "Emile Heskey",            v: 110 },
    { n: "Ryan Giggs",              v: 109 },
    { n: "Peter Crouch",            v: 108 },
    { n: "Paul Scholes",            v: 107 },
    { n: "Darren Bent",             v: 106 },
    { n: "Didier Drogba",           v: 104 },
    { n: "Cristiano Ronaldo",       v: 103 },
    { n: "Matt Le Tissier",         v: 100 }
  ]
};
