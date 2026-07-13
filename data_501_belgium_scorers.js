/* data_501_belgium_scorers.js — Football 501 category: Belgium men's
 * national team all-time top scorers. Value = career goals for Belgium.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Belgium national football team
 *                         records and statistics" (Top scorers table, as
 *                         of 10 July 2026).
 *   Cross-check source:  RSSSF — "Belgium - Record International Players"
 *                         — independently confirms the ranking order and
 *                         supplies ranks 11-23 past Wikipedia's top-10 cut.
 *                         RSSSF's own top-10 snapshot is visibly stale
 *                         (Lukaku 89/124 caps, De Bruyne 36/115 caps) next
 *                         to Wikipedia's current 93/132 and 38/124 — both
 *                         are still active internationals, so Wikipedia's
 *                         more recent figures are used for ranks 1-10 and
 *                         the drift is documented here rather than
 *                         silently resolved.
 *   asOf:                2026-07-10
 *   Re-verify:           Lukaku and De Bruyne remain active — re-verify
 *                         their totals frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.belgium_scorers = {
  label: "Belgium all-time top scorers",
  unit: "goals",
  asOf: "2026-07-10",
  source: "https://en.wikipedia.org/wiki/Belgium_national_football_team_records_and_statistics",
  rows: [
    { n: "Romelu Lukaku",       v: 93 }, /* active — re-verify frequently */
    { n: "Kevin De Bruyne",     v: 38 }, /* active — re-verify frequently */
    { n: "Eden Hazard",         v: 33 },
    { n: "Bernard Voorhoof",    v: 30 },
    { n: "Paul Van Himst",      v: 30 },
    { n: "Joseph Mermans",      v: 28 },
    { n: "Marc Wilmots",        v: 28 },
    { n: "Michy Batshuayi",     v: 27 },
    { n: "Robert De Veen",      v: 26 },
    { n: "Raymond Braine",      v: 26 },
    { n: "Wesley Sonck",        v: 24 },
    { n: "Marc Degryse",        v: 23 },
    { n: "Jan Ceulemans",       v: 23 },
    { n: "Rik Coppens",         v: 21 },
    { n: "Dries Mertens",       v: 21 },
    { n: "Leopold Anoul",       v: 20 },
    { n: "Erwin Vandenbergh",   v: 20 },
    { n: "Jean Capelle",        v: 19 },
    { n: "Emile Mpenza",        v: 19 },
    { n: "Raoul Lambert",       v: 18 },
    { n: "Christian Benteke",   v: 18 },
    { n: "Vincenzo Scifo",      v: 18 },
    { n: "Marouane Fellaini",   v: 18 }
  ]
};
