/* data_501_cl_appearances.js — Football 501 category: UEFA Champions League
 * all-time appearance leaders. Value = career UEFA Champions League
 * appearances, across all clubs a player represented.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of footballers with 100 or more
 *                         UEFA Champions League appearances" (full ranked
 *                         table, every row below sourced from here)
 *   Cross-check source:  UEFA.com's own "Champions League all-time
 *                         appearances" reporting independently confirms the
 *                         top 4 (Ronaldo 183, Casillas 177, Messi 163,
 *                         Müller 163) and Buffon's 124.
 *   asOf:                2026-07-11
 *   Re-verify:           several rows near the bottom of this list belong
 *                         to still-active players (e.g. Kimmich, Bernardo
 *                         Silva, Otamendi) whose totals will keep climbing —
 *                         re-verify each season for anyone still playing
 *                         Champions League football as of asOf.
 *   This is the deepest category in the app so far (55 rows, all real,
 *   sourced from one authoritative Wikipedia table) — a good example of
 *   the "100-500 rows where the source data supports it" depth target.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.cl_appearances = {
  label: "Champions League appearances",
  unit: "apps",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_footballers_with_100_or_more_UEFA_Champions_League_appearances",
  rows: [
    { n: "Cristiano Ronaldo",  v: 183 },
    { n: "Iker Casillas",      v: 177 },
    { n: "Lionel Messi",       v: 163 },
    { n: "Thomas Muller",      v: 163 },
    { n: "Manuel Neuer",       v: 161 },
    { n: "Karim Benzema",      v: 152 },
    { n: "Xavi",               v: 151 },
    { n: "Toni Kroos",         v: 151 },
    { n: "Robert Lewandowski", v: 144 },
    { n: "Raul",               v: 142 },
    { n: "Sergio Ramos",       v: 142 },
    { n: "Luka Modric",        v: 142 },
    { n: "Ryan Giggs",         v: 141 },
    { n: "Andres Iniesta",     v: 130 },
    { n: "Sergio Busquets",    v: 129 },
    { n: "Gerard Pique",       v: 128 },
    { n: "Clarence Seedorf",   v: 125 },
    { n: "David Alaba",        v: 125 },
    { n: "Paul Scholes",       v: 124 },
    { n: "Gianluigi Buffon",   v: 124 },
    { n: "Zlatan Ibrahimovic", v: 124 },
    { n: "Marquinhos",         v: 122 },
    { n: "Roberto Carlos",     v: 120 },
    { n: "Pepe",               v: 120 },
    { n: "Antoine Griezmann",  v: 120 },
    { n: "Xabi Alonso",        v: 119 },
    { n: "Koke",               v: 118 },
    { n: "Angel Di Maria",     v: 116 },
    { n: "Carles Puyol",       v: 115 },
    { n: "Ilkay Gundogan",     v: 115 },
    { n: "Thierry Henry",      v: 112 },
    { n: "Philipp Lahm",       v: 112 },
    { n: "Petr Cech",          v: 111 },
    { n: "Dani Alves",         v: 111 },
    { n: "Arjen Robben",       v: 110 },
    { n: "Paolo Maldini",      v: 109 },
    { n: "Gary Neville",       v: 109 },
    { n: "John Terry",         v: 109 },
    { n: "Joshua Kimmich",     v: 109 },
    { n: "Andrea Pirlo",       v: 108 },
    { n: "Ashley Cole",        v: 108 },
    { n: "Patrice Evra",       v: 108 },
    { n: "David Beckham",      v: 107 },
    { n: "Victor Valdes",      v: 106 },
    { n: "Jan Oblak",          v: 106 },
    { n: "Frank Lampard",      v: 105 },
    { n: "Thiago Silva",       v: 105 },
    { n: "Cesc Fabregas",      v: 104 },
    { n: "Bernardo Silva",     v: 104 },
    { n: "Oliver Kahn",        v: 103 },
    { n: "Luis Figo",          v: 103 },
    { n: "Fernandinho",        v: 103 },
    { n: "Marcelo",            v: 102 },
    { n: "Nicolas Otamendi",   v: 102 },
    { n: "Andriy Shevchenko",  v: 100 }
  ]
};
