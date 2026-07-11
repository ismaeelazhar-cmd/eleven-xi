/* data_501_atletico_scorers.js — Football 501 category: Atletico Madrid
 * all-time top scorers (career goals for the club, all competitions).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Atlético Madrid players"
 *                         (top goalscorers table)
 *   Cross-check source:  Antoine Griezmann as Atlético's all-time record
 *                         goalscorer (212 goals across two spells) is
 *                         explicitly stated on the same source page and
 *                         is widely reported general football knowledge.
 *   asOf:                2026-07-11
 *   Re-verify:           Griezmann was still an active first-team player
 *                         as of asOf (second spell, 2021–) — re-verify
 *                         each season, his total will keep climbing.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.atletico_scorers = {
  label: "Atletico Madrid all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Atl%C3%A9tico_Madrid_players",
  rows: [
    { n: "Antoine Griezmann",   v: 212 }, /* active — re-verify each season */
    { n: "Luis Aragones",       v: 173 },
    { n: "Adrian Escudero",     v: 169 },
    { n: "Jose Eulogio Garate", v: 136 },
    { n: "Fernando Torres",     v: 129 },
    { n: "Joaquin Peiro",       v: 125 },
    { n: "Adelardo Rodriguez",  v: 113 },
    { n: "Enrique Collar",      v: 105 },
    { n: "Jose Juncosa",        v: 103 },
    { n: "Sergio Aguero",       v: 101 },
    { n: "Diego Forlan",        v: 96  },
    { n: "Angel Correa",        v: 88  },
    { n: "Diego Costa",         v: 83  }
  ]
};
