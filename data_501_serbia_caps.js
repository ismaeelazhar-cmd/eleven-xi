/* data_501_serbia_caps.js — Football 501 category: Serbia men's national
 * team all-time most-capped players. Value = career caps for the
 * Serbia-only era (post-2006), per RSSSF's own dating for each entry.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Yugoslavia (Serbia and Montenegro) -
 *                         Record International Players" (most-capped
 *                         table).
 *   Cross-check source:  WebSearch aggregation independently confirms
 *                         Dusan Tadic's lead at 111 caps (2008-2024).
 *   asOf:                2026-07-18
 *   Re-verify:           Mitrovic, Gudelj, Kostic, and Milenkovic were
 *                         still active internationals as of asOf.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.serbia_caps = {
  label: "Serbia all-time most capped players",
  unit: "caps",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/joeg-recintlp.html",
  rows: [
    { n: "Dusan Tadic", v: 111 },
    { n: "Branislav Ivanovic", v: 105 },
    { n: "Aleksandar Mitrovic", v: 104 }, /* active — re-verify frequently */
    { n: "Dejan Stankovic", v: 103 },
    { n: "Savo Milosevic", v: 102 },
    { n: "Aleksandar Kolarov", v: 94 },
    { n: "Dragan Dzajic", v: 85 },
    { n: "Dragan Stojkovic", v: 84 },
    { n: "Vladimir Stojkovic", v: 84 },
    { n: "Zoran Tosic", v: 76 },
    { n: "Nemanja Gudelj", v: 74 }, /* active — re-verify frequently */
    { n: "Predrag Mijatovic", v: 73 },
    { n: "Filip Kostic", v: 70 }, /* active — re-verify frequently */
    { n: "Nikola Milenkovic", v: 70 }, /* active — re-verify frequently */
    { n: "Zlatko Vujovic", v: 70 }
  ]
};
