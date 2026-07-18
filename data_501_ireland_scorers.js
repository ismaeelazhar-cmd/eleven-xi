/* data_501_ireland_scorers.js — Football 501 category: Republic of
 * Ireland men's national team all-time top scorers. Value = career goals
 * for the Republic of Ireland.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Ireland - Record International
 *                         Players" (goalscoring table).
 *   Cross-check source:  WebSearch aggregation confirms Robbie Keane's
 *                         lead at 68 goals / 146 caps and the general
 *                         ranking order (Quinn, Stapleton, Aldridge,
 *                         Cascarino next).
 *   asOf:                2026-07-18
 *   Re-verify:           Ireland's per-player scoring ceiling outside of
 *                         Keane's outlier 68 drops fast (Quinn 21 is
 *                         second), so this category needed 54 rows down
 *                         to 3-goal players before the total sum cleared
 *                         501 with a clean subset-sum. James McClean,
 *                         Callum Robinson, Chiedozie Ogbene, Matt Doherty,
 *                         and John Egan were still plausibly active
 *                         internationals as of asOf.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.ireland_scorers = {
  label: "Republic of Ireland all-time top scorers",
  unit: "goals",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/ier-recintlp.html",
  rows: [
    { n: "Robbie Keane", v: 68 },
    { n: "Niall Quinn", v: 21 },
    { n: "Frank Stapleton", v: 20 },
    { n: "John Aldridge", v: 19 },
    { n: "Tony Cascarino", v: 19 },
    { n: "Don Givens", v: 19 },
    { n: "Shane Long", v: 17 },
    { n: "Noel Cantwell", v: 14 },
    { n: "Kevin Doyle", v: 14 },
    { n: "Jonathan Walters", v: 14 },
    { n: "Gerry Daly", v: 13 },
    { n: "Jimmy Dunne", v: 13 },
    { n: "Ian Harte", v: 11 },
    { n: "James McClean", v: 11 }, /* active — re-verify frequently */
    { n: "Robbie Brady", v: 10 },
    { n: "Troy Parrott", v: 10 }, /* active — re-verify frequently */
    { n: "Liam Brady", v: 9 },
    { n: "David Connolly", v: 9 },
    { n: "Roy Keane", v: 9 },
    { n: "David Kelly", v: 9 },
    { n: "Clinton Morrison", v: 9 },
    { n: "Callum Robinson", v: 9 }, /* active — re-verify frequently */
    { n: "Kevin Sheedy", v: 9 },
    { n: "Kevin Kilbane", v: 8 },
    { n: "Damien Duff", v: 8 },
    { n: "Paul McGrath", v: 8 },
    { n: "Richard Dunne", v: 8 },
    { n: "Stephen Staunton", v: 7 },
    { n: "Andy Townsend", v: 7 },
    { n: "Shane Duffy", v: 7 },
    { n: "Con Martin", v: 6 },
    { n: "Chiedozie Ogbene", v: 6 }, /* active — re-verify frequently */
    { n: "Ray Houghton", v: 5 },
    { n: "Johnny Giles", v: 5 },
    { n: "Ray Treacy", v: 5 },
    { n: "Mark Lawrenson", v: 5 },
    { n: "John Sheridan", v: 5 },
    { n: "Joe Haverty", v: 5 },
    { n: "Matthew Holland", v: 5 },
    { n: "Gary Breen", v: 4 },
    { n: "Denis Irwin", v: 4 },
    { n: "Mick Martin", v: 4 },
    { n: "Kevin Moran", v: 4 },
    { n: "Gary Doherty", v: 4 },
    { n: "Mark Kennedy", v: 4 },
    { n: "Simon Cox", v: 4 },
    { n: "John O'Shea", v: 3 },
    { n: "Ronnie Whelan", v: 3 },
    { n: "Mark Kinsella", v: 3 },
    { n: "Wesley Hoolahan", v: 3 },
    { n: "Sean St Ledger", v: 3 },
    { n: "Matt Doherty", v: 3 }, /* active — re-verify frequently */
    { n: "John Egan", v: 3 }, /* active — re-verify frequently */
    { n: "Stephen Ward", v: 3 }
  ]
};
