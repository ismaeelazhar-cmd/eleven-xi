/* data_501_nigeria_caps.js — Football 501 category: Nigeria men's
 * national team all-time most-capped players. Value = career caps for
 * Nigeria.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Nigeria - Record International
 *                         Players" (most-capped table, data through 17
 *                         Jan 2026).
 *   Cross-check source:  Wikipedia — "Nigeria national football team
 *                         records and statistics" — independently
 *                         confirms Ahmed Musa's lead at 110-111 caps and
 *                         the ranking order for the top 10.
 *   asOf:                2026-07-18
 *   Re-verify:           Musa, Iwobi, Simon, and Troost-Ekong were still
 *                         active internationals as of asOf — re-verify
 *                         their totals frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.nigeria_caps = {
  label: "Nigeria all-time most capped players",
  unit: "caps",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/nig-recintlp.html",
  rows: [
    { n: "Ahmed Musa", v: 110 }, /* active — re-verify frequently */
    { n: "Vincent Enyeama", v: 101 },
    { n: "Joseph Yobo", v: 101 },
    { n: "Alex Iwobi", v: 96 }, /* active — re-verify frequently */
    { n: "Moses Simon", v: 95 }, /* active — re-verify frequently */
    { n: "John Mikel Obi", v: 90 },
    { n: "Christian Kanu", v: 86 },
    { n: "Muda Lawal", v: 86 },
    { n: "William Troost-Ekong", v: 83 }, /* active — re-verify frequently */
    { n: "Onyinye Ndidi", v: 75 },
    { n: "Jay-Jay Okocha", v: 73 },
    { n: "Kenneth Omeruo", v: 69 },
    { n: "Stephen Keshi", v: 68 },
    { n: "Peter Rufai", v: 66 },
    { n: "Peter Odemwingie", v: 65 },
    { n: "Finidi George", v: 62 },
    { n: "Rashidi Yekini", v: 62 },
    { n: "Uwa Echiejile", v: 61 },
    { n: "Kelechi Iheanacho", v: 59 }, /* active — re-verify frequently */
    { n: "Emmanuel Okala", v: 59 }
  ]
};
