/* data_501_austria_caps.js — Football 501 category: Austria men's
 * national team all-time most-capped players. Value = career caps for
 * Austria.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Austria - Record International
 *                         Players" (most-capped table).
 *   Cross-check source:  WebSearch aggregation independently confirms
 *                         Marko Arnautovic's lead at 130 caps.
 *   asOf:                2026-07-18
 *   Re-verify:           Arnautovic, Alaba, Dragovic, Sabitzer, and
 *                         Gregoritsch were still active internationals as
 *                         of asOf — re-verify their totals frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.austria_caps = {
  label: "Austria all-time most capped players",
  unit: "caps",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/oost-recintlp.html",
  rows: [
    { n: "Marko Arnautovic", v: 130 }, /* active — re-verify frequently */
    { n: "David Alaba", v: 111 }, /* active — re-verify frequently */
    { n: "Andreas Herzog", v: 103 },
    { n: "Aleksandar Dragovic", v: 100 }, /* active — re-verify frequently */
    { n: "Anton Polster", v: 95 },
    { n: "Marcel Sabitzer", v: 95 }, /* active — re-verify frequently */
    { n: "Gerhard Hanappi", v: 93 },
    { n: "Karl Koller", v: 86 },
    { n: "Julian Baumgartlinger", v: 84 },
    { n: "Friedl Koncilia", v: 84 },
    { n: "Bruno Pezzey", v: 84 },
    { n: "Herbert Prohaska", v: 83 },
    { n: "Christian Fuchs", v: 78 },
    { n: "Sebastian Prodl", v: 73 },
    { n: "Michael Gregoritsch", v: 72 } /* active — re-verify frequently */
  ]
};
