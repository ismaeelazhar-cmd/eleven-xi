/* data_501_ghana_caps.js — Football 501 category: Ghana men's national
 * team all-time most-capped players. Value = career caps for Ghana.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Ghana - Record International Players"
 *                         (most-capped table).
 *   Cross-check source:  WebSearch aggregation independently confirms
 *                         Andre Ayew's lead at 120 caps and Jordan Ayew
 *                         second at 117.
 *   asOf:                2026-07-18
 *   Re-verify:           Andre Ayew, Jordan Ayew, Agyemang-Badu, and
 *                         Wakaso were still plausibly active
 *                         internationals as of asOf — re-verify their
 *                         totals frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.ghana_caps = {
  label: "Ghana all-time most capped players",
  unit: "caps",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/gha-recintlp.html",
  rows: [
    { n: "Andre Ayew", v: 120 }, /* active — re-verify frequently */
    { n: "Jordan Ayew", v: 117 }, /* active — re-verify frequently */
    { n: "Asamoah Gyan", v: 109 },
    { n: "Richard Kingson", v: 93 },
    { n: "John Paintsil", v: 91 },
    { n: "Harrison Afful", v: 84 },
    { n: "Sulley Muntari", v: 84 },
    { n: "John Mensah", v: 83 },
    { n: "Emmanuel Agyemang-Badu", v: 79 }, /* active — re-verify frequently */
    { n: "Kwadwo Asamoah", v: 74 },
    { n: "Abedi Pele", v: 73 },
    { n: "John Boye", v: 70 },
    { n: "Jonathan Mensah", v: 70 },
    { n: "Mubarak Wakaso", v: 70 }, /* active — re-verify frequently */
    { n: "Stephen Appiah", v: 69 }
  ]
};
