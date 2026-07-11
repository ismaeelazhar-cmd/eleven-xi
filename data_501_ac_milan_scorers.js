/* data_501_ac_milan_scorers.js — Football 501 category: AC Milan all-time
 * top scorers (career goals for the club, all competitions).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of A.C. Milan players" (top
 *                         goalscorers table)
 *   Cross-check source:  Gunnar Nordahl as the only Milan player to score
 *                         200+ club goals is a specifically-noted fact on
 *                         the same source page, and is widely reported
 *                         general Milan-history knowledge elsewhere.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.ac_milan_scorers = {
  label: "AC Milan all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_A.C._Milan_players",
  rows: [
    { n: "Gunnar Nordahl",       v: 221 },
    { n: "Andriy Shevchenko",    v: 175 },
    { n: "Gianni Rivera",        v: 164 },
    { n: "Jose Altafini",        v: 161 },
    { n: "Aldo Boffi",           v: 131 },
    { n: "Filippo Inzaghi",      v: 126 },
    { n: "Marco van Basten",     v: 124 },
    { n: "Kaka",                 v: 104 },
    { n: "Pierino Prati",        v: 102 },
    { n: "Renzo Burini",         v: 88  },
    { n: "Pietro Paolo Virdis",  v: 76  },
    { n: "Pietro Arcari",        v: 70  },
    { n: "Daniele Massaro",      v: 70  },
    { n: "Giovanni Moretti",     v: 68  },
    { n: "Angelo Sormani",       v: 65  }
  ]
};
