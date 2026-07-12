/* data_501_leverkusen_scorers.js — Football 501 category: Bayer
 * Leverkusen all-time top scorers (career goals for the club).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of Bayer 04 Leverkusen
 *                         players" (goalscorers)
 *   Cross-check source:  the source page explicitly states "Ulf Kirsten
 *                         holds the distinction of being" the club's
 *                         all-time leading scorer with 182 goals —
 *                         matching the top row used here.
 *   asOf:                2026-07-11
 *   Re-verify:           Patrik Schick (2020–) was still an active
 *                         first-team player as of asOf — re-verify each
 *                         season, his total will keep climbing.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.leverkusen_scorers = {
  label: "Bayer Leverkusen all-time top scorers",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Bayer_04_Leverkusen_players",
  rows: [
    { n: "Ulf Kirsten",         v: 182 },
    { n: "Stefan Kiessling",    v: 131 },
    { n: "Cha Bum-kun",         v: 52  },
    { n: "Herbert Waas",        v: 72  },
    { n: "Dimitar Berbatov",    v: 69  },
    { n: "Patrik Schick",       v: 62  }, /* active — re-verify each season */
    { n: "Kevin Volland",       v: 44  },
    { n: "Lucas Alario",        v: 42  },
    { n: "Oliver Neuville",     v: 42  },
    { n: "Kai Havertz",         v: 36  },
    { n: "Florian Wirtz",       v: 35  },
    { n: "Moussa Diaby",        v: 31  },
    { n: "Andriy Voronin",      v: 32  },
    { n: "Javier Hernandez",    v: 28  },
    { n: "Arturo Vidal",        v: 15  }
  ]
};
