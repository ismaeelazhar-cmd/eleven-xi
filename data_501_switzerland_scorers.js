/* data_501_switzerland_scorers.js — Football 501 category: Switzerland
 * men's national team all-time top scorers. Value = career goals for
 * Switzerland.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Switzerland - Record International
 *                         Players" (goalscoring table).
 *   Cross-check source:  WebSearch aggregation independently confirms
 *                         Alexander Frei's lead at 42 goals in 84 caps.
 *   asOf:                2026-07-18
 *   Re-verify:           Shaqiri, Embolo, Xhaka, Seferovic, and Amdouni
 *                         were still plausibly active internationals as
 *                         of asOf — re-verify their totals frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.switzerland_scorers = {
  label: "Switzerland all-time top scorers",
  unit: "goals",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/zwit-recintlp.html",
  rows: [
    { n: "Alexander Frei", v: 42 },
    { n: "Kubilay Turkyilmaz", v: 34 },
    { n: "Max Abegglen", v: 34 },
    { n: "Xherdan Shaqiri", v: 32 }, /* active — re-verify frequently */
    { n: "Andre Abegglen", v: 29 },
    { n: "Jacques Fatton", v: 29 },
    { n: "Adrian Knup", v: 26 },
    { n: "Haris Seferovic", v: 25 }, /* active — re-verify frequently */
    { n: "Charles Antenen", v: 23 },
    { n: "Breel Embolo", v: 22 }, /* active — re-verify frequently */
    { n: "Josef Hugi", v: 22 },
    { n: "Lauro Amado", v: 21 },
    { n: "Stephane Chapuisat", v: 21 },
    { n: "Hakan Yakin", v: 20 },
    { n: "Robert Ballaman", v: 19 },
    { n: "Mario Gavranovic", v: 16 },
    { n: "Granit Xhaka", v: 16 }, /* active — re-verify frequently */
    { n: "Alfred Bickel", v: 15 },
    { n: "Heinz Hermann", v: 15 },
    { n: "Fritz Kunzli", v: 15 },
    { n: "Georges Aeby", v: 13 },
    { n: "Willy Jaeggi", v: 13 },
    { n: "Claudio Sulser", v: 13 },
    { n: "Beat Sutter", v: 13 },
    { n: "Rolf Blaettler", v: 12 },
    { n: "Georges Bregy", v: 12 },
    { n: "Leopold Kielholz", v: 12 },
    { n: "Marco Streller", v: 12 },
    { n: "Zeki Amdouni", v: 11 }, /* active — re-verify frequently */
    { n: "Eren Derdiyok", v: 11 }
  ]
};
