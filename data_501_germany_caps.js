/* data_501_germany_caps.js — Football 501 category: Germany men's
 * national team all-time most-capped players. Value = career caps for
 * Germany (West Germany + unified Germany combined, per standard
 * convention).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Germany international
 *                         footballers" (caps table)
 *   Cross-check source:  WebSearch aggregation (bundesliga.com "Germany's
 *                         top 10 most capped players") — independently
 *                         confirms Matthaus (150), Klose (137), Podolski
 *                         (130), Schweinsteiger (121) exactly; T. Muller's
 *                         figure (131 vs bundesliga.com's earlier 114,
 *                         since he remained active) reflects his continued
 *                         appearances after that article was published —
 *                         Wikipedia's more recent table is treated as
 *                         current.
 *   asOf:                2026-07-13
 *   Re-verify:            Joshua Kimmich, Antonio Rudiger, and Thomas
 *                         Muller were still active internationals as of
 *                         asOf — re-verify their totals frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.germany_caps = {
  label: "Germany all-time most capped players",
  unit: "caps",
  asOf: "2026-07-13",
  source: "https://en.wikipedia.org/wiki/List_of_Germany_international_footballers",
  rows: [
    { n: "Lothar Matthaus",        v: 150 },
    { n: "Miroslav Klose",         v: 137 },
    { n: "Thomas Muller",          v: 131 }, /* active — re-verify frequently */
    { n: "Lukas Podolski",         v: 130 },
    { n: "Manuel Neuer",           v: 128 },
    { n: "Bastian Schweinsteiger", v: 121 },
    { n: "Joshua Kimmich",         v: 114 }, /* active — re-verify frequently */
    { n: "Toni Kroos",             v: 114 },
    { n: "Philipp Lahm",           v: 113 },
    { n: "Jurgen Klinsmann",       v: 108 },
    { n: "Jurgen Kohler",          v: 105 },
    { n: "Per Mertesacker",        v: 104 },
    { n: "Franz Beckenbauer",      v: 103 },
    { n: "Thomas Hassler",         v: 101 },
    { n: "Michael Ballack",        v: 98 },
    { n: "Berti Vogts",            v: 96 },
    { n: "Sepp Maier",             v: 95 },
    { n: "Karl-Heinz Rummenigge",  v: 95 },
    { n: "Mesut Ozil",             v: 92 },
    { n: "Rudi Voller",            v: 90 },
    { n: "Andreas Brehme",         v: 86 },
    { n: "Oliver Kahn",            v: 86 },
    { n: "Antonio Rudiger",        v: 86 }, /* active — re-verify frequently */
    { n: "Andreas Moller",         v: 85 },
    { n: "Arne Friedrich",         v: 82 }
  ]
};
