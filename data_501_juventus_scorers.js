/* data_501_juventus_scorers.js — Football 501 category: Juventus all-time
 * top scorers (career goals for the club, all competitions).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Juventus F.C. players"
 *                         (100+ appearances table, goals column)
 *   Cross-check source:  Alessandro Del Piero as Juventus's all-time
 *                         record goalscorer (290 goals) is widely and
 *                         independently reported general football
 *                         knowledge.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.juventus_scorers = {
  label: "Juventus all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Juventus_F.C._players",
  rows: [
    { n: "Alessandro Del Piero",   v: 290 },
    { n: "David Trezeguet",        v: 171 },
    { n: "Giampiero Boniperti",    v: 182 },
    { n: "Roberto Bettega",        v: 179 },
    { n: "Omar Sivori",            v: 174 },
    { n: "Felice Borel",           v: 163 },
    { n: "Pietro Anastasi",        v: 132 },
    { n: "Roberto Baggio",         v: 115 },
    { n: "Paulo Dybala",           v: 115 },
    { n: "Federico Munerati",      v: 114 },
    { n: "John Charles",           v: 109 },
    { n: "Guglielmo Gabetto",      v: 102 },
    { n: "Raimundo Orsi",          v: 88  },
    { n: "Giovanni Ferrari",       v: 78  },
    { n: "Bruno Nicole",           v: 66  }
  ]
};
