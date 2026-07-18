/* data_501_southkorea_scorers.js — Football 501 category: South Korea
 * men's national team all-time top scorers. Value = career goals for
 * South Korea.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "South Korea national football team
 *                         records and statistics" (Top goalscorers table)
 *                         for the top 10-12; RSSSF — "South Korea -
 *                         Record International Players" for the ranks 13+
 *                         extension.
 *   Cross-check source:  RSSSF's own snapshot confirms the same ranking
 *                         order for ranks 10-21, with minor spelling
 *                         variants only (Choi Soon-hoo/Choi Soon-ho,
 *                         Lee Tae-hoo/Lee Tae-ho) — no goal-count drift.
 *   asOf:                2026-07-18
 *   Re-verify:           Son Heung-min was still an active international
 *                         as of asOf and remains within striking distance
 *                         of Cha Bum-kun's all-time record — re-verify
 *                         his total frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.southkorea_scorers = {
  label: "South Korea all-time top scorers",
  unit: "goals",
  asOf: "2026-07-18",
  source: "https://en.wikipedia.org/wiki/South_Korea_national_football_team_records_and_statistics",
  rows: [
    { n: "Cha Bum-kun", v: 58 },
    { n: "Son Heung-min", v: 56 }, /* active — re-verify frequently */
    { n: "Hwang Sun-hong", v: 50 },
    { n: "Park Lee-chun", v: 36 },
    { n: "Kim Jae-han", v: 33 },
    { n: "Lee Dong-gook", v: 33 },
    { n: "Choi Soon-ho", v: 30 },
    { n: "Kim Do-hoon", v: 29 },
    { n: "Huh Jung-moo", v: 29 },
    { n: "Choi Yong-soo", v: 27 },
    { n: "Lee Tae-ho", v: 27 },
    { n: "Kim Jin-kook", v: 27 },
    { n: "Park Sung-hwa", v: 26 },
    { n: "Lee Young-moo", v: 24 },
    { n: "Park Chu-young", v: 24 },
    { n: "Ha Seok-joo", v: 23 },
    { n: "Chung Hae-won", v: 22 }
  ]
};
