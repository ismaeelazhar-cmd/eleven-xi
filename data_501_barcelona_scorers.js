/* data_501_barcelona_scorers.js — Football 501 category: FC Barcelona
 * all-time top scorers (all competitions). Value = career goals for the club.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of FC Barcelona records and
 *                         statistics" (Top goalscorers table) — used for
 *                         the top 9 rows (Messi through Mariano Martín).
 *   Cross-check source:  Independent secondary aggregations (Bolavip,
 *                         888sport) converge on the same goal totals for
 *                         Kluivert/Rexach/Stoichkov/Ronaldinho, used to
 *                         extend the list deeper for checkout variety.
 *   Deliberately excluded: Rivaldo — goal totals for his Barcelona spell
 *                         varied wildly across sources checked (86 / 130 /
 *                         235 depending on the page), so rather than guess
 *                         which is right he's left out entirely — same
 *                         "no fabricated/unverifiable stats" rule applied
 *                         everywhere else in this app.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.barcelona_scorers = {
  label: "Barcelona all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_FC_Barcelona_records_and_statistics",
  rows: [
    { n: "Lionel Messi",       v: 672 },
    { n: "Cesar Rodriguez",    v: 232 },
    { n: "Luis Suarez",        v: 198 },
    { n: "Laszlo Kubala",      v: 194 },
    { n: "Josep Samitier",     v: 184 },
    { n: "Josep Escola",       v: 165 },
    { n: "Paulino Alcantara",  v: 143 },
    { n: "Samuel Eto'o",       v: 130 },
    { n: "Mariano Martin",     v: 129 },
    { n: "Patrick Kluivert",   v: 122 },
    { n: "Carles Rexach",      v: 122 },
    { n: "Hristo Stoichkov",   v: 117 },
    { n: "Neymar",              v: 105 },
    { n: "Ronaldinho",         v: 94  },
    { n: "Xavi",               v: 85  },
    { n: "David Villa",        v: 48  }
  ]
};
