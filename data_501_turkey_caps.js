/* data_501_turkey_caps.js — Football 501 category: Turkey men's national
 * team all-time most-capped players. Value = career caps for Turkey.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Turkey - Record International Players"
 *                         (most-capped table).
 *   Cross-check source:  Wikipedia independently confirms Rustu Recber's
 *                         lead at 120 caps.
 *   asOf:                2026-07-18
 *   Re-verify:           Calhanoglu, Ayhan, and Topal were still
 *                         plausibly active internationals as of asOf.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.turkey_caps = {
  label: "Turkey all-time most capped players",
  unit: "caps",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/tur-recintlp.html",
  rows: [
    { n: "Rustu Recber", v: 120 },
    { n: "Hakan Sukur", v: 112 },
    { n: "Bulent Korkmaz", v: 102 },
    { n: "Hakan Calhanoglu", v: 102 }, /* active — re-verify frequently */
    { n: "Emre Belozoglu", v: 101 },
    { n: "Arda Turan", v: 100 },
    { n: "Tugay Kerimoglu", v: 94 },
    { n: "Fehmi Alpay Ozalan", v: 90 },
    { n: "Hamit Altintop", v: 82 },
    { n: "Mehmet Topal", v: 81 },
    { n: "Tuncay Sanli", v: 80 },
    { n: "Burak Yilmaz", v: 77 },
    { n: "Ogun Temizkanoglu", v: 76 },
    { n: "Kaan Ayhan", v: 72 }, /* active — re-verify frequently */
    { n: "Abdullah Ercan", v: 71 }
  ]
};
