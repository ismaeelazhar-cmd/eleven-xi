/* data_501_scotland_scorers.js — Football 501 category: Scotland men's
 * national team all-time top scorers. Value = career goals for Scotland.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Scotland national football team
 *                         records and statistics" (Top goalscorers table)
 *                         for the top 10; RSSSF — "Scotland - Record
 *                         International Players" for ranks 11+.
 *   Cross-check source:  RSSSF's own top-10 snapshot trails Wikipedia
 *                         slightly on a couple of names (e.g. Hughie
 *                         Gallacher 23 vs Wikipedia's 24, John McGinn 20
 *                         vs Wikipedia's 21) — expected snapshot-timing
 *                         drift, documented rather than silently
 *                         resolved; Wikipedia's figures are used for the
 *                         top 10.
 *   asOf:                2026-07-18
 *   Re-verify:           Scotland's per-player scoring ceiling tops out
 *                         at 30 (Law/Dalglish, tied) — the lowest ceiling
 *                         yet in this nation-stats phase — so this
 *                         category needed 60 rows, the deepest extension
 *                         yet, down to 1-goal players before the total
 *                         sum cleared 501 with a clean subset-sum. McGinn,
 *                         McTominay, Adams, Robertson, Tierney, Gilmour,
 *                         and McGregor were still plausibly active
 *                         internationals as of asOf.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.scotland_scorers = {
  label: "Scotland all-time top scorers",
  unit: "goals",
  asOf: "2026-07-18",
  source: "https://en.wikipedia.org/wiki/Scotland_national_football_team_records_and_statistics",
  rows: [
    { n: "Denis Law", v: 30 },
    { n: "Kenny Dalglish", v: 30 },
    { n: "Hughie Gallacher", v: 24 },
    { n: "Lawrie Reilly", v: 22 },
    { n: "John McGinn", v: 21 }, /* active — re-verify frequently */
    { n: "Ally McCoist", v: 19 },
    { n: "Kenny Miller", v: 18 },
    { n: "Robert Hamilton", v: 15 },
    { n: "James McFadden", v: 15 },
    { n: "Scott McTominay", v: 15 }, /* active — re-verify frequently */
    { n: "Robert McColl", v: 13 },
    { n: "John Smith", v: 13 },
    { n: "Andrew Wilson", v: 13 },
    { n: "John Collins", v: 12 },
    { n: "Alan Gilzean", v: 12 },
    { n: "Billy Steel", v: 12 },
    { n: "Che Adams", v: 11 }, /* active — re-verify frequently */
    { n: "Joe Jordan", v: 11 },
    { n: "Bobby Collins", v: 10 },
    { n: "Lyndon Dykes", v: 10 },
    { n: "Stephen Fletcher", v: 10 },
    { n: "George Ker", v: 10 },
    { n: "Steven Naismith", v: 10 },
    { n: "Colin Stein", v: 10 },
    { n: "Kevin Gallacher", v: 9 },
    { n: "Paul McStay", v: 9 },
    { n: "Ryan Christie", v: 9 },
    { n: "Archie Gemmill", v: 8 },
    { n: "Richard Gough", v: 6 },
    { n: "Darren Fletcher", v: 5 },
    { n: "Gordon Strachan", v: 5 },
    { n: "Gary McAllister", v: 5 },
    { n: "Stuart Armstrong", v: 5 },
    { n: "Gordon McQueen", v: 5 },
    { n: "Asa Hartford", v: 4 },
    { n: "Christophe Berra", v: 4 },
    { n: "Eric Caldow", v: 4 },
    { n: "Shaun Maloney", v: 7 },
    { n: "Gordon Durie", v: 7 },
    { n: "Craig Burley", v: 3 },
    { n: "James Morrison", v: 3 },
    { n: "Kenny McClean", v: 3 },
    { n: "John Greig", v: 3 },
    { n: "Billy Bremner", v: 3 },
    { n: "Colin Hendry", v: 3 },
    { n: "Charlie Mulgrew", v: 3 },
    { n: "Jack Hendry", v: 3 },
    { n: "Jim Baxter", v: 3 },
    { n: "James McArthur", v: 3 },
    { n: "Andrew Robertson", v: 2 }, /* active — re-verify frequently */
    { n: "Grant Hanley", v: 2 }, /* active — re-verify frequently */
    { n: "Kieran Tierney", v: 2 }, /* active — re-verify frequently */
    { n: "Billy Gilmour", v: 2 }, /* active — re-verify frequently */
    { n: "Callum McGregor", v: 2 }, /* active — re-verify frequently */
    { n: "Alex McLeish", v: 1 },
    { n: "Tom Boyd", v: 1 },
    { n: "David Weir", v: 1 },
    { n: "Willie Miller", v: 1 },
    { n: "Roy Aitken", v: 1 },
    { n: "Paul Lambert", v: 1 }
  ]
};
