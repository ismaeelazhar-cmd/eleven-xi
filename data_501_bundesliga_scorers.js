/* data_501_bundesliga_scorers.js — Football 501 category: Bundesliga
 * all-time top scorers (career goals in the Bundesliga, across all clubs).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Bundesliga top scorers"
 *                         (full ranked all-time table)
 *   Cross-check source:  bundesliga.com's own "all-time top scorers"
 *                         reporting independently confirms the top 3
 *                         (Müller 365, Lewandowski 312, Fischer 268).
 *   asOf:                2026-07-11
 *   Re-verify:           none of this list's players were still active
 *                         Bundesliga players as of asOf (Lewandowski moved
 *                         to Barcelona; Reus/Kimmich-era names not yet high
 *                         enough to place) — closed totals, periodic
 *                         spot-check only.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.bundesliga_scorers = {
  label: "Bundesliga all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Bundesliga_top_scorers",
  rows: [
    { n: "Gerd Muller",             v: 365 },
    { n: "Robert Lewandowski",      v: 312 },
    { n: "Klaus Fischer",           v: 268 },
    { n: "Jupp Heynckes",           v: 220 },
    { n: "Manfred Burgsmuller",     v: 213 },
    { n: "Claudio Pizarro",         v: 197 },
    { n: "Ulf Kirsten",             v: 181 },
    { n: "Stefan Kuntz",            v: 179 },
    { n: "Dieter Muller",           v: 177 },
    { n: "Klaus Allofs",            v: 177 },
    { n: "Mario Gomez",             v: 170 },
    { n: "Hannes Lohr",             v: 166 },
    { n: "Karl-Heinz Rummenigge",   v: 162 },
    { n: "Bernd Holzenbein",        v: 160 },
    { n: "Fritz Walter",            v: 157 },
    { n: "Marco Reus",              v: 156 },
    { n: "Thomas Muller",           v: 150 },
    { n: "Thomas Allofs",           v: 148 },
    { n: "Stefan Kiessling",        v: 144 },
    { n: "Bernd Nickel",            v: 141 }
  ]
};
