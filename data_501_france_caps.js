/* data_501_france_caps.js — Football 501 category: France men's national
 * team all-time most-capped players. Value = career caps for France.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "France national football team
 *                         records and statistics" (Most caps table)
 *   Cross-check source:  Wikipedia — "List of France international
 *                         footballers" — independently confirms Lloris
 *                         (145), Thuram (142), Henry (123), Desailly (116),
 *                         Zidane (108), Vieira (107), Deschamps (103),
 *                         Blanc (97), Lizarazu (97), Wiltord (92), Barthez
 *                         (87). Djorkaeff's total (82) sourced via
 *                         WebSearch aggregation. Note: a third source
 *                         (433futbol.com) carried a stale Mbappe figure
 *                         (71) reflecting an older snapshot — Wikipedia's
 *                         103 (matching his still-active status through
 *                         World Cup 2026) is treated as current.
 *   asOf:                2026-07-13
 *   Re-verify:           Antoine Griezmann and Kylian Mbappe were still
 *                         active internationals as of asOf — re-verify
 *                         their totals frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.france_caps = {
  label: "France all-time most capped players",
  unit: "caps",
  asOf: "2026-07-13",
  source: "https://en.wikipedia.org/wiki/France_national_football_team_records_and_statistics",
  rows: [
    { n: "Hugo Lloris",         v: 145 },
    { n: "Lilian Thuram",       v: 142 },
    { n: "Olivier Giroud",      v: 137 },
    { n: "Antoine Griezmann",   v: 137 }, /* active — re-verify frequently */
    { n: "Thierry Henry",       v: 123 },
    { n: "Marcel Desailly",     v: 116 },
    { n: "Zinedine Zidane",     v: 108 },
    { n: "Patrick Vieira",      v: 107 },
    { n: "Didier Deschamps",    v: 103 },
    { n: "Kylian Mbappe",       v: 103 }, /* active — re-verify frequently */
    { n: "Laurent Blanc",       v: 97 },
    { n: "Bixente Lizarazu",    v: 97 },
    { n: "Karim Benzema",       v: 97 },
    { n: "Sylvain Wiltord",     v: 92 },
    { n: "Fabien Barthez",      v: 87 },
    { n: "Youri Djorkaeff",     v: 82 }
  ]
};
