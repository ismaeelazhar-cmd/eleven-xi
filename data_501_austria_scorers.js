/* data_501_austria_scorers.js — Football 501 category: Austria men's
 * national team all-time top scorers. Value = career goals for Austria.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Austria - Record International
 *                         Players" (goalscoring table).
 *   Cross-check source:  WebSearch aggregation independently confirms
 *                         Marko Arnautovic's lead at 47 goals in 130 caps.
 *   asOf:                2026-07-18
 *   Re-verify:           Arnautovic, Gregoritsch, Sabitzer, Baumgartner,
 *                         and Alaba were still plausibly active
 *                         internationals as of asOf — re-verify their
 *                         totals frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.austria_scorers = {
  label: "Austria all-time top scorers",
  unit: "goals",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/oost-recintlp.html",
  rows: [
    { n: "Marko Arnautovic", v: 47 }, /* active — re-verify frequently */
    { n: "Anton Polster", v: 44 },
    { n: "Hans Krankl", v: 34 },
    { n: "Hans Horvath", v: 29 },
    { n: "Erich Hof", v: 28 },
    { n: "Marc Janko", v: 28 },
    { n: "Anton Schall", v: 27 },
    { n: "Matthias Sindelar", v: 26 },
    { n: "Andreas Herzog", v: 26 },
    { n: "Karl Zischek", v: 24 },
    { n: "Walter Schachner", v: 23 },
    { n: "Michael Gregoritsch", v: 23 }, /* active — re-verify frequently */
    { n: "Marcel Sabitzer", v: 23 }, /* active — re-verify frequently */
    { n: "Theodor Wagner", v: 22 },
    { n: "Karl Decker", v: 19 },
    { n: "Christoph Baumgartner", v: 19 }, /* active — re-verify frequently */
    { n: "Erich Probst", v: 18 },
    { n: "Ferdinand Swatosch", v: 18 },
    { n: "Jan Studnicka", v: 18 },
    { n: "Ferdinand Wessely", v: 17 },
    { n: "Franz Binder", v: 16 },
    { n: "Horst Nemec", v: 16 },
    { n: "Ernst Melchior", v: 16 },
    { n: "Alfred Korner", v: 15 },
    { n: "Peter Stoger", v: 15 },
    { n: "Martin Harnik", v: 15 },
    { n: "David Alaba", v: 15 }, /* active — re-verify frequently */
    { n: "Josef Bican", v: 14 },
    { n: "Richard Kuthan", v: 14 },
    { n: "Ernst Stojaspal", v: 14 }
  ]
};
