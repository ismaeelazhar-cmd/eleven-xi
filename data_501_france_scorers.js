/* data_501_france_scorers.js — Football 501 category: France men's
 * national team all-time top scorers. Value = career goals for France.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of international goals scored
 *                         by Kylian Mbappe" (updated 2026-07-09), which
 *                         states Mbappe overtook Giroud's record (57) to
 *                         become France's all-time top scorer on 16 June
 *                         2026 and had reached 64 goals as of the page's
 *                         most recent update.
 *   Cross-check source:  Wikipedia — "List of leading goalscorers for the
 *                         France national football team" — independently
 *                         confirms Giroud (57), Henry (51), Griezmann (44),
 *                         Platini (41), Benzema (37), Trezeguet (34),
 *                         Zidane (31), Fontaine (30), Papin (30), Djorkaeff
 *                         (28), Wiltord (26), Vincent (22), J. Nicolas (21),
 *                         P. Nicolas (20), Cantona (20), Baratte (19),
 *                         Piantoni (18), Kopa (18), Ribery (16). That page's
 *                         own Mbappe figure (63) trails the more recent
 *                         Mbappe-specific page's 64 by one goal — expected
 *                         snapshot-timing drift for an active player who
 *                         scored again during World Cup 2026.
 *   asOf:                2026-07-13
 *   Re-verify:           Kylian Mbappe was an active international as of
 *                         asOf (through World Cup 2026) — his total (64) is
 *                         a live, moving figure; re-verify frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.france_scorers = {
  label: "France all-time top scorers",
  unit: "goals",
  asOf: "2026-07-13",
  source: "https://en.wikipedia.org/wiki/List_of_international_goals_scored_by_Kylian_Mbapp%C3%A9",
  rows: [
    { n: "Kylian Mbappe",       v: 64 }, /* active — re-verify frequently */
    { n: "Olivier Giroud",      v: 57 },
    { n: "Thierry Henry",       v: 51 },
    { n: "Antoine Griezmann",   v: 44 },
    { n: "Michel Platini",      v: 41 },
    { n: "Karim Benzema",       v: 37 },
    { n: "David Trezeguet",     v: 34 },
    { n: "Zinedine Zidane",     v: 31 },
    { n: "Just Fontaine",       v: 30 },
    { n: "Jean-Pierre Papin",   v: 30 },
    { n: "Youri Djorkaeff",     v: 28 },
    { n: "Sylvain Wiltord",     v: 26 },
    { n: "Jean Vincent",        v: 22 },
    { n: "Jean Nicolas",        v: 21 },
    { n: "Paul Nicolas",        v: 20 },
    { n: "Eric Cantona",        v: 20 },
    { n: "Jean Baratte",        v: 19 },
    { n: "Roger Piantoni",      v: 18 },
    { n: "Raymond Kopa",        v: 18 },
    { n: "Franck Ribery",       v: 16 }
  ]
};
