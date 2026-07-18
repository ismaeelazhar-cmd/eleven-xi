/* data_501_poland_caps.js — Football 501 category: Poland men's national
 * team all-time most-capped players. Value = career caps for Poland.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Poland - Record International Players"
 *                         (most-capped table, snapshot through 17 Nov
 *                         2025).
 *   Cross-check source:  WebSearch aggregation of Wikipedia's Lewandowski
 *                         coverage — confirms his cap total reached 167 by
 *                         mid-2026 (up from RSSSF's 163 snapshot), same
 *                         drift documented in this batch's
 *                         poland_scorers.js.
 *   asOf:                2026-07-18
 *   Re-verify:           Zielinski was still a plausibly active
 *                         international as of asOf — re-verify if this
 *                         list is revisited.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.poland_caps = {
  label: "Poland all-time most capped players",
  unit: "caps",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/pol-recintlp.html",
  rows: [
    { n: "Robert Lewandowski",     v: 167 },
    { n: "Jakub Blaszczykowski",   v: 109 },
    { n: "Piotr Zielinski",        v: 105 }, /* active — re-verify frequently */
    { n: "Kamil Glik",             v: 103 },
    { n: "Michal Zewlakow",        v: 102 },
    { n: "Kamil Grosicki",         v: 100 },
    { n: "Grzegorz Krychowiak",    v: 100 },
    { n: "Grzegorz Lato",          v: 100 },
    { n: "Kazimierz Deyna",        v: 97 },
    { n: "Jacek Bak",              v: 96 },
    { n: "Jacek Krzynowek",        v: 96 },
    { n: "Wladyslaw Zmuda",        v: 91 },
    { n: "Wojciech Szczesny",      v: 84 },
    { n: "Antoni Szymanowski",     v: 82 },
    { n: "Zbigniew Boniek",        v: 80 }
  ]
};
