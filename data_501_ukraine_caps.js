/* data_501_ukraine_caps.js — Football 501 category: Ukraine men's
 * national team all-time most-capped players. Value = career caps for
 * Ukraine.
 *
 * NOTE: Ukraine's SCORERS axis was researched this batch but DROPPED —
 * extended past the top-27-goal table down to 1-goal players (RSSSF plus
 * two follow-up "exactly 1 goal" queries, ~40 individually-verified
 * rows) and the total sum still only reached ~395, well short of 501.
 * Ukraine's goal-scoring pool below the top ~10 thins out very fast
 * (dozens of squad players capped 9-30 times with just 1-2 career goals
 * each) and RSSSF's page did not surface enough additional distinct
 * values to close the gap. Per the plan's "never fabricate a stat" rule,
 * ukraine_scorers is dropped this batch rather than shipped with padded
 * rows — same honest-drop precedent as Senegal and Morocco.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Ukraine - Record International
 *                         Players" (most-capped table).
 *   Cross-check source:  WebSearch aggregation independently confirms
 *                         Anatoliy Tymoschuk's lead at 144 caps.
 *   asOf:                2026-07-18
 *   Re-verify:           Yarmolenko, Zinchenko, Stepanenko, and
 *                         Malinovskyi were still plausibly active
 *                         internationals as of asOf.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.ukraine_caps = {
  label: "Ukraine all-time most capped players",
  unit: "caps",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/oekr-recintlp.html",
  rows: [
    { n: "Anatoliy Tymoschuk", v: 144 },
    { n: "Andriy Yarmolenko", v: 125 }, /* active — re-verify frequently */
    { n: "Andriy Shevchenko", v: 111 },
    { n: "Andriy Pyatov", v: 102 },
    { n: "Ruslan Rotan", v: 100 },
    { n: "Oleh Husyev", v: 98 },
    { n: "Olexandr Shovkovskyi", v: 92 },
    { n: "Yevhen Konoplyanka", v: 87 },
    { n: "Taras Stepanenko", v: 87 }, /* active — re-verify frequently */
    { n: "Mykola Matviyenko", v: 82 },
    { n: "Oleksandr Zinchenko", v: 75 }, /* active — re-verify frequently */
    { n: "Serhiy Rebrov", v: 75 },
    { n: "Andriy Voronin", v: 74 },
    { n: "Andriy Husyn", v: 71 },
    { n: "Ruslan Malinovskyi", v: 69 } /* active — re-verify frequently */
  ]
};
