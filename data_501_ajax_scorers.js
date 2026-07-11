/* data_501_ajax_scorers.js — Football 501 category: AFC Ajax all-time top
 * scorers (career goals for the club, official matches all competitions).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      afc-ajax.info — the club's own dedicated
 *                         statistics/records site, "Soccer players with
 *                         most scored goals" (full ranked table).
 *   Cross-check note:    a general Wikipedia-summary search turned up
 *                         DIFFERENT totals for the top 2 (van Reenen 278,
 *                         Cruyff 249) vs this source's deeper table
 *                         (378 / 367) — a real, sizeable discrepancy,
 *                         flagged rather than silently picking one. The
 *                         afc-ajax.info table was used as primary because
 *                         it's the deeper, club-specific dedicated
 *                         records source (going 15 rows deep vs a
 *                         2-3-name summary) and explicitly states its
 *                         competition scope ("official matches,
 *                         competitive play-offs, cup competitions,
 *                         European tournaments").
 *   asOf:                2026-07-11
 *   Re-verify:           no currently-active first-team player is in this
 *                         list as of asOf — all closed career totals.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.ajax_scorers = {
  label: "Ajax all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://www.afc-ajax.info/en/overview/soccer-players-with-most-scored-goal",
  rows: [
    { n: "Piet van Reenen",       v: 378 },
    { n: "Johan Cruyff",          v: 367 },
    { n: "Sjaak Swart",           v: 268 },
    { n: "Henk Groot",            v: 239 },
    { n: "Piet Keizer",           v: 239 },
    { n: "Theo Brokmann Sr",      v: 182 },
    { n: "Klaas-Jan Huntelaar",   v: 178 },
    { n: "Wim Volkers",           v: 172 },
    { n: "Ruud Geels",            v: 160 },
    { n: "Marco van Basten",      v: 156 },
    { n: "Rinus Michels",         v: 136 },
    { n: "Jari Litmanen",         v: 135 },
    { n: "Cees Groot",            v: 129 },
    { n: "Dennis Bergkamp",       v: 123 },
    { n: "Luis Suarez",           v: 113 }
  ]
};
