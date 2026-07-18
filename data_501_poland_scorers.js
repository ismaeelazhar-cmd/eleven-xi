/* data_501_poland_scorers.js — Football 501 category: Poland men's
 * national team all-time top scorers. Value = career goals for Poland.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Poland - Record International Players"
 *                         (goalscoring table, snapshot through 17 Nov
 *                         2025).
 *   Cross-check source:  Wikipedia (Robert Lewandowski's player page and
 *                         "List of international goals scored by Robert
 *                         Lewandowski") — puts Lewandowski's Poland tally
 *                         at 89 goals / 167 caps as of mid-2026, slightly
 *                         ahead of RSSSF's 88/163 snapshot since he
 *                         remained active into 2026 before hinting at
 *                         international retirement after Poland missed
 *                         out on World Cup 2026 qualification — the more
 *                         current Wikipedia figure is used here, drift
 *                         documented rather than silently resolved.
 *   asOf:                2026-07-18
 *   Re-verify:           Milik and Swiderski were still plausibly active
 *                         internationals as of asOf — re-verify their
 *                         totals if this list is revisited.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.poland_scorers = {
  label: "Poland all-time top scorers",
  unit: "goals",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/pol-recintlp.html",
  rows: [
    { n: "Robert Lewandowski",     v: 89 },
    { n: "Wlodzimierz Lubanski",   v: 48 },
    { n: "Grzegorz Lato",          v: 45 },
    { n: "Kazimierz Deyna",        v: 41 },
    { n: "Ernest Pol",             v: 39 },
    { n: "Andrzej Szarmach",       v: 32 },
    { n: "Gerard Cieslik",         v: 27 },
    { n: "Zbigniew Boniek",        v: 24 },
    { n: "Ernest Wilimowski",      v: 21 },
    { n: "Jakub Blaszczykowski",   v: 21 },
    { n: "Dariusz Dziekanowski",   v: 20 },
    { n: "Euzebiusz Smolarek",     v: 19 },
    { n: "Roman Kosecki",          v: 19 },
    { n: "Lucjan Brychczy",        v: 18 },
    { n: "Maciej Zurawski",        v: 17 },
    { n: "Arkadiusz Milik",        v: 17 }, /* active — re-verify frequently */
    { n: "Kamil Grosicki",         v: 17 },
    { n: "Jozef Nawrot",           v: 16 },
    { n: "Robert Gadocha",         v: 16 },
    { n: "Piotr Zielinski",        v: 16 }, /* active — re-verify frequently */
    { n: "Jacek Krzynowek",        v: 15 },
    { n: "Andrzej Juskowiak",      v: 13 },
    { n: "Karol Swiderski",        v: 13 }, /* active — re-verify frequently */
    { n: "Wlodzimierz Smolarek",   v: 13 },
    { n: "Krzysztof Piatek",       v: 12 },
    { n: "Wawrzyniec Stalinski",   v: 11 },
    { n: "Leonard Piatek",         v: 11 },
    { n: "Andrzej Jarosik",        v: 11 },
    { n: "Emmanuel Olisadebe",     v: 11 },
    { n: "Andrzej Iwan",           v: 11 }
  ]
};
