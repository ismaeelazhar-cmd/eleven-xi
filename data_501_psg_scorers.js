/* data_501_psg_scorers.js — Football 501 category: Paris Saint-Germain
 * all-time top scorers (career goals for the club, all competitions).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Paris Saint-Germain F.C.
 *                         records and statistics" (Top goalscorers table)
 *   Cross-check source:  Mbappé and Cavani as PSG's all-time top 2
 *                         goalscorers is widely and independently
 *                         reported general football knowledge.
 *   asOf:                2026-07-11
 *   Re-verify:           Mbappé's figure was captured "as of 18 July
 *                         2024" per the source page and he has since
 *                         left the club (moved to Real Madrid) — treated
 *                         as a closed career total for PSG as of asOf.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.psg_scorers = {
  label: "Paris Saint-Germain all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Paris_Saint-Germain_F.C._records_and_statistics",
  rows: [
    { n: "Kylian Mbappe",         v: 256 },
    { n: "Edinson Cavani",        v: 200 },
    { n: "Zlatan Ibrahimovic",    v: 156 },
    { n: "Neymar",                v: 118 },
    { n: "Pauleta",               v: 109 },
    { n: "Dominique Rocheteau",   v: 100 },
    { n: "Mustapha Dahleb",       v: 98  },
    { n: "Francois M'Pele",       v: 95  },
    { n: "Angel Di Maria",        v: 92  },
    { n: "Safet Susic",           v: 85  },
    { n: "Lionel Messi",          v: 32  }
  ]
};
