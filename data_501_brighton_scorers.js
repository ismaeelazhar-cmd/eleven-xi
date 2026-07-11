/* data_501_brighton_scorers.js — Football 501 category: Brighton & Hove
 * Albion all-time top scorers (career goals for the club).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      talesfromthetopflight.com — "Brighton & Hove
 *                         Albion's top goalscorers of all-time" (ranked
 *                         table)
 *   Cross-check source:  a separate independent search summary confirms
 *                         Tommy Cook is "officially recognised by the
 *                         club as their top scorer" with the same 123
 *                         goals in 209 appearances figure.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.brighton_scorers = {
  label: "Brighton & Hove Albion all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://www.talesfromthetopflight.com/2024/04/18/brighton-hove-albions-top-goalscorers-of-all-time/",
  rows: [
    { n: "Tommy Cook",       v: 123 },
    { n: "Glenn Murray",     v: 111 },
    { n: "Kit Napier",       v: 99  },
    { n: "Peter Ward",       v: 95  },
    { n: "Bert Stephens",    v: 94  },
    { n: "Albert Mundy",     v: 90  },
    { n: "Bobby Zamora",     v: 90  }
  ]
};
