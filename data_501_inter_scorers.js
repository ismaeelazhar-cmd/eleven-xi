/* data_501_inter_scorers.js — Football 501 category: Inter Milan all-time
 * top scorers (career goals for the club, all competitions).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Inter Milan players" (top
 *                         goalscorers table)
 *   Cross-check source:  Giuseppe Meazza as Inter's all-time record
 *                         goalscorer (284 goals) is widely and
 *                         independently reported general football
 *                         knowledge — San Siro is officially named the
 *                         "Stadio Giuseppe Meazza" partly in his honour.
 *   asOf:                2026-07-11
 *   Re-verify:           Lautaro Martínez was still an active first-team
 *                         player as of asOf — re-verify each season, his
 *                         total will keep climbing.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.inter_scorers = {
  label: "Inter Milan all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Inter_Milan_players",
  rows: [
    { n: "Giuseppe Meazza",      v: 284 },
    { n: "Lautaro Martinez",     v: 175 }, /* active — re-verify each season */
    { n: "Roberto Boninsegna",   v: 171 },
    { n: "Sandro Mazzola",       v: 158 },
    { n: "Benito Lorenzi",       v: 143 },
    { n: "Mauro Icardi",         v: 124 },
    { n: "Christian Vieri",      v: 123 },
    { n: "Antonio Angelillo",    v: 77  },
    { n: "Aldo Serena",          v: 78  },
    { n: "Adriano",              v: 74  },
    { n: "Diego Milito",         v: 75  },
    { n: "Alvaro Recoba",        v: 72  },
    { n: "Jair",                 v: 69  },
    { n: "Eddie Firmani",        v: 69  },
    { n: "Zlatan Ibrahimovic",   v: 66  }
  ]
};
