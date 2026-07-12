/* data_501_feyenoord_scorers.js — Football 501 category: Feyenoord
 * all-time top scorers (career goals for the club).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Feyenoord players"
 *                         (goalscorers table)
 *   Cross-check source:  the source page explicitly states Jaap
 *                         Barendregt was "the club's greatest historical
 *                         goalscorer" with 196 goals across a 12-year
 *                         period — matching the top row used here.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.feyenoord_scorers = {
  label: "Feyenoord all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Feyenoord_players",
  rows: [
    { n: "Jaap Barendregt",     v: 196 },
    { n: "Cor van der Gijp",    v: 177 },
    { n: "Ove Kindvall",        v: 129 },
    { n: "Dirk Kuyt",           v: 102 },
    { n: "Adriaan Koonings",    v: 100 },
    { n: "Jan Linssen",         v: 91  },
    { n: "Willem van Hanegem",  v: 90  },
    { n: "Coen Moulijn",        v: 84  },
    { n: "Peter Houtman",       v: 84  },
    { n: "Piet Kruiver",        v: 74  },
    { n: "Ruud Geels",          v: 46  },
    { n: "Frans Bouwmeester",   v: 44  },
    { n: "Julio Ricardo Cruz",  v: 44  }
  ]
};
