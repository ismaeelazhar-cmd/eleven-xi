/* data_501_ligue1_scorers.js — Football 501 category: Ligue 1 all-time top
 * scorers (career goals in Ligue 1, across all clubs a player represented).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Ligue 1 top scorers" (full
 *                         ranked all-time career table)
 *   Cross-check source:  Delio Onnis holding the all-time Ligue 1 scoring
 *                         record "since 1980-81" is explicitly stated on
 *                         the same source page and is widely reported
 *                         general French football knowledge.
 *   asOf:                2026-07-11
 *   Re-verify:           Kylian Mbappé's total (191, still climbing prior
 *                         to his move away from Ligue 1) is treated as a
 *                         closed total as of asOf since he's since left
 *                         PSG for Real Madrid.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.ligue1_scorers = {
  label: "Ligue 1 all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Ligue_1_top_scorers",
  rows: [
    { n: "Delio Onnis",        v: 299 },
    { n: "Bernard Lacombe",    v: 255 },
    { n: "Herve Revelli",      v: 216 },
    { n: "Roger Courtois",     v: 210 },
    { n: "Thadee Cisowski",    v: 206 },
    { n: "Roger Piantoni",     v: 203 },
    { n: "Kylian Mbappe",      v: 191 },
    { n: "Joseph Ujlaki",      v: 190 },
    { n: "Fleury Di Nallo",    v: 187 },
    { n: "Carlos Bianchi",     v: 179 },
    { n: "Gunnar Andersson",   v: 179 },
    { n: "Hassan Akesbi",      v: 173 },
    { n: "Jean Baratte",       v: 169 },
    { n: "Just Fontaine",      v: 164 },
    { n: "Alain Giresse",      v: 163 },
    { n: "Jean-Pierre Papin",  v: 156 },
    { n: "Edinson Cavani",     v: 138 },
    { n: "Zlatan Ibrahimovic", v: 113 },
    { n: "David Trezeguet",    v: 52  }
  ]
};
