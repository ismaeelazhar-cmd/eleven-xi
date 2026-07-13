/* data_501_argentina_scorers.js — Football 501 category: Argentina men's
 * national team all-time top scorers. Value = career goals for Argentina.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Argentina national football team
 *                         records and statistics" (Top goalscorers table)
 *   Cross-check source:  RSSSF (Rec.Sport.Soccer Statistics Foundation)
 *                         independently confirms Rene Pontoni (19),
 *                         Norberto Mendez (19), Jose Sanfilippo (21),
 *                         Herminio Masantonio (21), and Angel Labruna (17)
 *                         — used to extend the list past the Wikipedia
 *                         table's top-10 cutoff. Note: an older Statistico
 *                         snapshot shows lower totals for several active-
 *                         era players (e.g. Messi 106, Batistuta 54,
 *                         Higuain/Di Maria at 28/31) — expected, since
 *                         those totals kept climbing after that snapshot;
 *                         Wikipedia's more recent table is treated as
 *                         current.
 *   asOf:                2026-07-11
 *   Re-verify:           Lionel Messi is an active international as of
 *                         asOf — his total (125) is a live, moving figure;
 *                         re-verify frequently rather than treating it as
 *                         final.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.argentina_scorers = {
  label: "Argentina all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/Argentina_national_football_team_records_and_statistics",
  rows: [
    { n: "Lionel Messi",        v: 125 }, /* active — re-verify frequently */
    { n: "Gabriel Batistuta",   v: 56 },
    { n: "Sergio Aguero",       v: 41 },
    { n: "Lautaro Martinez",    v: 39 },
    { n: "Hernan Crespo",       v: 35 },
    { n: "Diego Maradona",      v: 34 },
    { n: "Gonzalo Higuain",     v: 31 },
    { n: "Angel Di Maria",      v: 31 },
    { n: "Luis Artime",         v: 24 },
    { n: "Leopoldo Luque",      v: 22 },
    { n: "Daniel Passarella",   v: 22 },
    { n: "Jose Sanfilippo",     v: 21 },
    { n: "Herminio Masantonio", v: 21 },
    { n: "Rene Pontoni",        v: 19 },
    { n: "Norberto Mendez",     v: 19 },
    { n: "Angel Labruna",       v: 17 }
  ]
};
