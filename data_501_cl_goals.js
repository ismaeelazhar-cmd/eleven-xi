/* data_501_cl_goals.js — Football 501 category: UEFA Champions League
 * all-time top scorers. Value = career UCL goals.
 *
 * VERIFICATION (B6 pipeline): UEFA.com official "Champions League all-time
 * top scorers" report (primary), cross-checked against Opta Analyst /
 * Wikipedia's "List of UEFA Champions League top scorers". asOf: 2026-07-08.
 * Re-verify each season for active players (Lewandowski still playing). */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.cl_goals = {
  label: "Champions League top scorers",
  unit: "UCL goals",
  asOf: "2026-07-08",
  source: "https://en.wikipedia.org/wiki/List_of_UEFA_Champions_League_top_scorers",
  rows: [
    { n: "Cristiano Ronaldo",  v: 140 },
    { n: "Lionel Messi",       v: 129 },
    { n: "Robert Lewandowski", v: 109 }, /* active — re-verify each season */
    { n: "Karim Benzema",      v: 90 },
    { n: "Raul",               v: 71 },
    { n: "Kylian Mbappe",      v: 70 },  /* active — re-verify each season */
    { n: "Erling Haaland",     v: 57 },  /* active — re-verify each season */
    { n: "Thomas Muller",      v: 57 },
    { n: "Ruud van Nistelrooy", v: 56 },
    { n: "Harry Kane",         v: 54 },  /* active — re-verify each season */
    { n: "Mohamed Salah",      v: 50 },  /* active — re-verify each season */
    { n: "Thierry Henry",      v: 50 },
    { n: "Alfredo Di Stefano", v: 49 },
    { n: "Andriy Shevchenko",  v: 48 },
    { n: "Zlatan Ibrahimovic", v: 48 },
    { n: "Eusebio",            v: 46 },
    { n: "Filippo Inzaghi",    v: 46 },
    { n: "Didier Drogba",      v: 44 },
    { n: "Antoine Griezmann",  v: 44 }, /* active — re-verify each season */
    { n: "Neymar",             v: 43 }
  ]
};
