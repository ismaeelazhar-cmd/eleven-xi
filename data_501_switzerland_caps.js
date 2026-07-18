/* data_501_switzerland_caps.js — Football 501 category: Switzerland
 * men's national team all-time most-capped players. Value = career caps
 * for Switzerland.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Switzerland - Record International
 *                         Players" (most-capped table).
 *   Cross-check source:  WebSearch aggregation independently confirms
 *                         Granit Xhaka's lead at 143 caps.
 *   asOf:                2026-07-18
 *   Re-verify:           Xhaka, Rodriguez, Shaqiri, Sommer, Schar, and
 *                         Embolo were still active internationals as of
 *                         asOf — re-verify their totals frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.switzerland_caps = {
  label: "Switzerland all-time most capped players",
  unit: "caps",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/zwit-recintlp.html",
  rows: [
    { n: "Granit Xhaka", v: 143 }, /* active — re-verify frequently */
    { n: "Ricardo Rodriguez", v: 135 }, /* active — re-verify frequently */
    { n: "Xherdan Shaqiri", v: 125 }, /* active — re-verify frequently */
    { n: "Heinz Hermann", v: 118 },
    { n: "Alain Geiger", v: 112 },
    { n: "Stefan Lichtsteiner", v: 108 },
    { n: "Stephane Chapuisat", v: 103 },
    { n: "Yann Sommer", v: 94 }, /* active — re-verify frequently */
    { n: "Johann Vogel", v: 94 },
    { n: "Haris Seferovic", v: 93 }, /* active — re-verify frequently */
    { n: "Gokhan Inler", v: 89 },
    { n: "Hakan Yakin", v: 87 },
    { n: "Fabian Schar", v: 86 }, /* active — re-verify frequently */
    { n: "Breel Embolo", v: 84 }, /* active — re-verify frequently */
    { n: "Alexander Frei", v: 84 }
  ]
};
