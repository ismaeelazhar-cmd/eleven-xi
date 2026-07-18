/* data_501_cameroon_caps.js — Football 501 category: Cameroon men's
 * national team all-time most-capped players. Value = career caps for
 * Cameroon.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Cameroon - Record International
 *                         Players" (most-capped table).
 *   Cross-check source:  WebSearch aggregation independently confirms
 *                         Rigobert Song's lead at 137 caps and Eto'o
 *                         second at 118.
 *   asOf:                2026-07-18
 *   Re-verify:           None of the players in this top-15 were still
 *                         active internationals as of asOf, so drift risk
 *                         is low.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.cameroon_caps = {
  label: "Cameroon all-time most capped players",
  unit: "caps",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/kam-recintlp.html",
  rows: [
    { n: "Rigobert Song", v: 137 },
    { n: "Samuel Etoo", v: 118 },
    { n: "Njitap Geremi", v: 118 },
    { n: "Vincent Aboubakar", v: 117 },
    { n: "Emmanuel Kunde", v: 102 },
    { n: "Nicolas N Koulou", v: 81 },
    { n: "Jacques Songo'o", v: 80 },
    { n: "Roger Milla", v: 77 },
    { n: "Choupo-Moting", v: 76 },
    { n: "Francois Omam-Biyik", v: 73 },
    { n: "Idriss Carlos Kameni", v: 72 },
    { n: "Pierre Wome", v: 69 },
    { n: "Jean Makoun", v: 68 },
    { n: "Stephane M Bia", v: 68 },
    { n: "Emile Mbouh", v: 68 }
  ]
};
