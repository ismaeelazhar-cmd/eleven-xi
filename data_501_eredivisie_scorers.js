/* data_501_eredivisie_scorers.js — Football 501 category: Eredivisie
 * all-time top scorers (career goals in the Dutch Eredivisie, across all
 * clubs a player represented).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Eredivisie top scorers"
 *                         (full ranked all-time career table, top 20)
 *   Cross-check source:  A second independent search summary confirms
 *                         Willy van der Kuijlen as the all-time #1 (311
 *                         goals) and the Eredivisie's own "Willy van der
 *                         Kuijlen Trophy" (renamed in his honour in
 *                         2020-21) for the league's season top scorer.
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.eredivisie_scorers = {
  label: "Eredivisie all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Eredivisie_top_scorers",
  rows: [
    { n: "Willy van der Kuijlen",  v: 311 },
    { n: "Ruud Geels",             v: 265 },
    { n: "Johan Cruyff",           v: 215 },
    { n: "Kees Kist",              v: 212 },
    { n: "Tonny van der Linden",   v: 208 },
    { n: "Henk Groot",             v: 196 },
    { n: "Luuk de Jong",           v: 192 },
    { n: "Peter Houtman",          v: 180 },
    { n: "Sjaak Swart",            v: 175 },
    { n: "Leo van Veen",           v: 174 },
    { n: "Cor van der Gijp",       v: 162 },
    { n: "Wim Kieft",              v: 158 },
    { n: "Klaas-Jan Huntelaar",    v: 154 },
    { n: "Dirk Kuyt",              v: 153 },
    { n: "Henk Bosveld",           v: 152 },
    { n: "Hallvar Thoresen",       v: 152 },
    { n: "John Bosman",            v: 146 },
    { n: "Willy Brokamp",          v: 146 },
    { n: "Piet Keizer",            v: 146 },
    { n: "Lex Schoenmaker",        v: 144 }
  ]
};
