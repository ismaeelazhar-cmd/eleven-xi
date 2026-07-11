/* data_501_psv_scorers.js — Football 501 category: PSV Eindhoven all-time
 * top scorers (career goals for the club, all competitions).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      GiveMeSport — "Top 5 PSV Eindhoven goalscorers
 *                         of all time" (fully ranked, all-competitions
 *                         totals)
 *   Cross-check source:  a separate independent search summary
 *                         independently confirms Willy van der Kuijlen's
 *                         320-goal all-competitions total (543
 *                         appearances, 1964-1981).
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.psv_scorers = {
  label: "PSV Eindhoven all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://www.givemesport.com/88065036-psv-goalscorers-kezman-houtman/",
  rows: [
    { n: "Willy van der Kuijlen", v: 320 },
    { n: "Luc Nilis",             v: 133 },
    { n: "Hallvar Thoresen",      v: 133 },
    { n: "Mateja Kezman",         v: 129 },
    { n: "Romario",               v: 128 },
    { n: "Wim Kieft",             v: 89  },
    { n: "Ruud van Nistelrooy",   v: 77  },
    { n: "Georginio Wijnaldum",   v: 56  },
    { n: "Memphis Depay",         v: 49  },
    { n: "Arjen Robben",          v: 21  },
    { n: "Ernie Brandts",         v: 23  },
    { n: "Park Ji-sung",          v: 19  },
    { n: "Eran Zahavi",           v: 37  }
  ]
};
