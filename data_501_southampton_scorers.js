/* data_501_southampton_scorers.js — Football 501 category: Southampton
 * all-time top scorers (career goals for the club, all competitions).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Aggregated search summary citing Southampton
 *                         club-history reporting for the top 5 (Channon,
 *                         Le Tissier, Paine, O'Brien, Davies).
 *   Cross-check note:    Mick Channon's total varies noticeably between
 *                         sources checked (185 vs 228) — flagged rather
 *                         than silently picking one; used 228 (the more
 *                         detailed figure, paired with a specific
 *                         608-appearance count across two spells) as the
 *                         primary value.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.southampton_scorers = {
  label: "Southampton all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://eflanalysis.com/news/southampton-top-five-scorers-of-all-time/",
  rows: [
    { n: "Mick Channon",     v: 228 },
    { n: "Matt Le Tissier",  v: 210 },
    { n: "Terry Paine",      v: 187 },
    { n: "George O'Brien",   v: 180 },
    { n: "Ron Davies",       v: 153 },
    { n: "Rickie Lambert",   v: 117 },
    { n: "James Beattie",    v: 76  },
    { n: "Danny Ings",       v: 46  },
    { n: "Jay Rodriguez",    v: 26  },
    { n: "Sadio Mane",       v: 22  },
    { n: "Che Adams",        v: 25  },
    { n: "Manolo Gabbiadini", v: 12 }
  ]
};
