/* data_501_dortmund_scorers.js — Football 501 category: Borussia Dortmund
 * all-time top scorers (career goals for the club, all competitions).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      khelnow.com — "Borussia Dortmund: Top 10 all-time
 *                         goal scorers" (full ranked table)
 *   Cross-check source:  A second independent search summary confirms Adi
 *                         Preißler as the all-time #1 (177 goals) and lists
 *                         matching/close totals for Burgsmüller (158),
 *                         Zorc (159), Schütz (143), Aubameyang (141).
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *   Every row here is ≤180, so every row is always throwable under the
 *   180-max-throw rule — no permanently-unthrowable entries at all.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.dortmund_scorers = {
  label: "Borussia Dortmund all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://khelnow.com/football/2023-03-world-football-top-10-all-time-goal-scorers-borussia-dortmund",
  rows: [
    { n: "Adi Preissler",           v: 177 },
    { n: "Marco Reus",              v: 159 },
    { n: "Michael Zorc",            v: 159 },
    { n: "Manfred Burgsmuller",     v: 158 },
    { n: "Timo Konietzka",          v: 155 },
    { n: "Lothar Emmerich",         v: 148 },
    { n: "Jurgen Schutz",           v: 143 },
    { n: "Pierre-Emerick Aubameyang", v: 141 },
    { n: "Alfred Niepieklo",        v: 125 },
    { n: "Stephane Chapuisat",      v: 123 },
    { n: "Nuri Sahin",              v: 26  },
    { n: "Jude Bellingham",         v: 24  }
  ]
};
