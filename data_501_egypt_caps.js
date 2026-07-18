/* data_501_egypt_caps.js — Football 501 category: Egypt men's national
 * team all-time most-capped players. Value = career caps for Egypt.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Egypt - Record International Players"
 *                         (most-capped table).
 *   Cross-check source:  WebSearch aggregation independently confirms
 *                         Ahmed Hassan's lead at 184 caps and Hossam
 *                         Hassan second at 177 — the two share the
 *                         nation's most-decorated-scorer/most-capped
 *                         status.
 *   asOf:                2026-07-18
 *   Re-verify:           Mohamed Salah was still an active international
 *                         as of asOf — re-verify his total frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.egypt_caps = {
  label: "Egypt all-time most capped players",
  unit: "caps",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/egy-recintlp.html",
  rows: [
    { n: "Ahmed Hassan", v: 184 },
    { n: "Hossam Hassan", v: 177 },
    { n: "Essam El-Hadary", v: 159 },
    { n: "Ahmed Fathi", v: 135 },
    { n: "Ibrahim Hassan", v: 131 },
    { n: "Hany Ramzy", v: 122 },
    { n: "Mohamed Salah", v: 115 }, /* active — re-verify frequently */
    { n: "Wael Gomaa", v: 114 },
    { n: "Abdel Zaher El-Saqua", v: 112 },
    { n: "Ahmed El-Kass", v: 110 },
    { n: "Rabei Yassin", v: 108 },
    { n: "Ahmed Shobair", v: 107 },
    { n: "Mohamed El-Nenny", v: 106 },
    { n: "Nader El-Sayed", v: 104 },
    { n: "Hosni Abd Rabbou", v: 102 }
  ]
};
