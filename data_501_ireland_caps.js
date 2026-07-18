/* data_501_ireland_caps.js — Football 501 category: Republic of Ireland
 * men's national team all-time most-capped players. Value = career caps
 * for the Republic of Ireland.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Ireland - Record International
 *                         Players" (most-capped table).
 *   Cross-check source:  WebSearch aggregation independently confirms
 *                         Robbie Keane's lead at 146 caps, Shay Given at
 *                         134, and John O'Shea at 118.
 *   asOf:                2026-07-18
 *   Re-verify:           None of the players in this top-15 were still
 *                         active internationals as of asOf, so drift risk
 *                         is low.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.ireland_caps = {
  label: "Republic of Ireland all-time most capped players",
  unit: "caps",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/ier-recintlp.html",
  rows: [
    { n: "Robbie Keane", v: 146 },
    { n: "Shay Given", v: 134 },
    { n: "John O'Shea", v: 118 },
    { n: "Kevin Kilbane", v: 110 },
    { n: "James McClean", v: 103 },
    { n: "Stephen Staunton", v: 102 },
    { n: "Damien Duff", v: 100 },
    { n: "Aiden McGeady", v: 93 },
    { n: "Niall Quinn", v: 91 },
    { n: "Glenn Whelan", v: 91 },
    { n: "Tony Cascarino", v: 88 },
    { n: "Shane Long", v: 88 },
    { n: "Paul McGrath", v: 83 },
    { n: "Pat Bonner", v: 80 },
    { n: "Richard Dunne", v: 80 }
  ]
};
