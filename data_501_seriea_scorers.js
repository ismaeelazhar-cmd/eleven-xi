/* data_501_seriea_scorers.js — Football 501 category: Serie A all-time top
 * scorers (career goals in Serie A, across all clubs a player represented).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Serie A players with 100 or
 *                         more goals" (full ranked table)
 *   Cross-check source:  Goal.com / 888sport Serie A all-time top-scorer
 *                         reporting independently confirms the top 3
 *                         (Piola 274, Totti 250, Nordahl 225).
 *   asOf:                2026-07-11
 *   Re-verify:           Ciro Immobile (201) was still an active Serie A
 *                         player as of asOf — re-verify each season.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.seriea_scorers = {
  label: "Serie A all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Serie_A_players_with_100_or_more_goals",
  rows: [
    { n: "Silvio Piola",           v: 274 },
    { n: "Francesco Totti",        v: 250 },
    { n: "Gunnar Nordahl",         v: 225 },
    { n: "Giuseppe Meazza",        v: 216 },
    { n: "Jose Altafini",          v: 216 },
    { n: "Antonio Di Natale",      v: 209 },
    { n: "Roberto Baggio",         v: 205 },
    { n: "Ciro Immobile",          v: 201 }, /* active — re-verify each season */
    { n: "Kurt Hamrin",            v: 190 },
    { n: "Giuseppe Signori",       v: 188 },
    { n: "Alessandro Del Piero",   v: 188 },
    { n: "Alberto Gilardino",      v: 188 },
    { n: "Gabriel Batistuta",      v: 183 },
    { n: "Fabio Quagliarella",     v: 182 },
    { n: "Giampiero Boniperti",    v: 178 },
    { n: "Amedeo Amadei",          v: 174 },
    { n: "Giuseppe Savoldi",       v: 168 },
    { n: "Guglielmo Gabetto",      v: 164 },
    { n: "Roberto Boninsegna",     v: 162 },
    { n: "Luca Toni",              v: 157 },
    { n: "Zlatan Ibrahimovic",     v: 156 },
    { n: "Gigi Riva",              v: 156 },
    { n: "Filippo Inzaghi",        v: 156 },
    { n: "Roberto Mancini",        v: 156 },
    { n: "Luis Vinicio",           v: 155 },
    { n: "Carlo Reguzzoni",        v: 155 },
    { n: "Istvan Nyers",           v: 153 },
    { n: "Hernan Crespo",          v: 153 },
    { n: "Adriano Bassetto",       v: 149 },
    { n: "Omar Sivori",            v: 147 },
    { n: "Christian Vieri",        v: 142 }
  ]
};
