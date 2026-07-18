/* data_501_wales_scorers.js — Football 501 category: Wales men's national
 * team all-time top scorers. Value = career goals for Wales.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Wales - Record International Players"
 *                         (goalscoring table, data through 19 Nov 2024).
 *   Cross-check source:  Wikipedia — "Wales national football team records
 *                         and statistics" (as of 6 June 2026) — confirms
 *                         the top-9 order and totals exactly (Bale 41,
 *                         Rush 28, Ford 23, Allchurch 23, Saunders 22,
 *                         Ramsey 21, Bellamy 19, Wilson 17, Earnshaw 16).
 *   asOf:                2026-07-18
 *   Re-verify:           Wales' per-player scoring ceiling tops out at 41
 *                         (Bale), so this category needed a deep
 *                         extension — 56 rows — down to 2-goal players
 *                         before the total sum cleared 501 with a clean
 *                         subset-sum, the deepest extension yet in this
 *                         nation-stats phase. Ramsey and Brennan Johnson
 *                         were still plausibly active internationals as
 *                         of asOf.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.wales_scorers = {
  label: "Wales all-time top scorers",
  unit: "goals",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/wal-recintlp.html",
  rows: [
    { n: "Gareth Bale", v: 41 },
    { n: "Ian Rush", v: 28 },
    { n: "Trevor Ford", v: 23 },
    { n: "Ivor Allchurch", v: 23 },
    { n: "Dean Saunders", v: 22 },
    { n: "Aaron Ramsey", v: 21 }, /* active — re-verify frequently */
    { n: "Craig Bellamy", v: 19 },
    { n: "Harry Wilson", v: 17 },
    { n: "Robert Earnshaw", v: 16 },
    { n: "Cliff Jones", v: 16 },
    { n: "Mark Hughes", v: 16 },
    { n: "John Charles", v: 15 },
    { n: "Kieffer Moore", v: 15 },
    { n: "John Hartson", v: 14 },
    { n: "John Toshack", v: 13 },
    { n: "Billy Lewis", v: 12 },
    { n: "Ryan Giggs", v: 12 },
    { n: "Billy Meredith", v: 11 },
    { n: "Sam Vokes", v: 11 },
    { n: "Jason Koumas", v: 10 },
    { n: "Leighton James", v: 10 },
    { n: "Daniel James", v: 9 }, /* active — re-verify frequently */
    { n: "Ron Davies", v: 8 },
    { n: "Roy Vernon", v: 8 },
    { n: "Gary Speed", v: 7 },
    { n: "Bryan Flynn", v: 7 },
    { n: "Robbie James", v: 7 },
    { n: "Brennan Johnson", v: 7 }, /* active — re-verify frequently */
    { n: "Simon Davies", v: 6 },
    { n: "Mark Pembridge", v: 6 },
    { n: "Alan Curtis", v: 6 },
    { n: "Wyn Davies", v: 6 },
    { n: "Mel Charles", v: 6 },
    { n: "Terry Medwin", v: 6 },
    { n: "David Brooks", v: 6 }, /* active — re-verify frequently */
    { n: "Thomas Robson-Kanu", v: 5 },
    { n: "Mike England", v: 4 },
    { n: "Christopher Coleman", v: 4 },
    { n: "Nathan Blake", v: 4 },
    { n: "Ben Davies", v: 3 }, /* active — re-verify frequently */
    { n: "Andrew Melville", v: 3 },
    { n: "James Collins", v: 3 },
    { n: "Simon Church", v: 3 },
    { n: "John Robinson", v: 3 },
    { n: "Joe Allen", v: 2 },
    { n: "Ashley Williams", v: 2 },
    { n: "Peter Nicholas", v: 2 },
    { n: "David Phillips", v: 2 },
    { n: "Barry Horne", v: 2 },
    { n: "Terry Yorath", v: 2 },
    { n: "Joe Rodon", v: 2 }, /* active — re-verify frequently */
    { n: "Andrew King", v: 2 },
    { n: "Mark Bowen", v: 2 },
    { n: "Christopher Symons", v: 2 },
    { n: "Alan Durban", v: 2 },
    { n: "Fred Keenor", v: 2 }
  ]
};
