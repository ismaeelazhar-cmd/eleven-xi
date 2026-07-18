/* data_501_japan_caps.js — Football 501 category: Japan men's national
 * team all-time most-capped players. Value = career caps for Japan.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Japan national football team
 *                         records and statistics" (Most capped players
 *                         table).
 *   Cross-check source:  RSSSF — "Japan - Record International Players"
 *                         — independently confirms Endo's lead at 152
 *                         caps.
 *   asOf:                2026-07-18
 *   Re-verify:           Nagatomo was still a plausibly active
 *                         international as of asOf — re-verify if this
 *                         list is revisited.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.japan_caps = {
  label: "Japan all-time most capped players",
  unit: "caps",
  asOf: "2026-07-18",
  source: "https://en.wikipedia.org/wiki/Japan_national_football_team_records_and_statistics",
  rows: [
    { n: "Yasuhito Endo",       v: 152 },
    { n: "Yuto Nagatomo",       v: 142 }, /* active — re-verify frequently */
    { n: "Maya Yoshida",        v: 125 },
    { n: "Masami Ihara",        v: 122 },
    { n: "Shinji Okazaki",      v: 119 },
    { n: "Yoshikatsu Kawaguchi",v: 116 },
    { n: "Makoto Hasebe",       v: 114 },
    { n: "Yuji Nakazawa",       v: 110 },
    { n: "Shunsuke Nakamura",   v: 98 },
    { n: "Keisuke Honda",       v: 98 }
  ]
};
