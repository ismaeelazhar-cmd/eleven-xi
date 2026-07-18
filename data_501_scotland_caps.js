/* data_501_scotland_caps.js — Football 501 category: Scotland men's
 * national team all-time most-capped players. Value = career caps for
 * Scotland.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Scotland national football team
 *                         records and statistics" (Most capped players
 *                         table).
 *   Cross-check source:  RSSSF — "Scotland - Record International
 *                         Players" — independently confirms Dalglish's
 *                         lead at 102 caps and the ranking order for the
 *                         retired players in this list.
 *   asOf:                2026-07-18
 *   Re-verify:           Robertson and McTominay were still active
 *                         internationals as of asOf — re-verify their
 *                         totals frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.scotland_caps = {
  label: "Scotland all-time most capped players",
  unit: "caps",
  asOf: "2026-07-18",
  source: "https://en.wikipedia.org/wiki/Scotland_national_football_team_records_and_statistics",
  rows: [
    { n: "Kenny Dalglish",     v: 102 },
    { n: "Andy Robertson",     v: 97 }, /* active — re-verify frequently */
    { n: "Jim Leighton",       v: 91 },
    { n: "John McGinn",        v: 89 }, /* active — re-verify frequently */
    { n: "Craig Gordon",       v: 84 },
    { n: "Darren Fletcher",    v: 80 },
    { n: "Alex McLeish",       v: 77 },
    { n: "Paul McStay",        v: 76 },
    { n: "Scott McTominay",    v: 73 }, /* active — re-verify frequently */
    { n: "Tom Boyd",           v: 72 }
  ]
};
