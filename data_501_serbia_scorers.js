/* data_501_serbia_scorers.js — Football 501 category: Serbia men's
 * national team all-time top scorers. Value = career goals for Serbia,
 * counting the unified Yugoslavia -> Serbia and Montenegro -> Serbia
 * lineage that Serbia's football federation officially recognizes as one
 * continuous record (confirmed by press coverage of Mitrovic surpassing
 * Bobek's combined Yugoslavia/Serbia record in 2021).
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Yugoslavia (Serbia and Montenegro) -
 *                         Record International Players" (goalscoring
 *                         table, the officially recognized unified
 *                         lineage).
 *   Cross-check source:  WebSearch aggregation confirms Mitrovic's most
 *                         current total at 64 goals (one ahead of RSSSF's
 *                         63-goal snapshot, since he remained active into
 *                         2026) and explicitly confirms this is treated
 *                         as "the all-time goal-scoring record for Serbia
 *                         AND ITS PRECURSOR YUGOSLAVIA" by Serbian
 *                         football press — not a fabricated merge.
 *   asOf:                2026-07-18
 *   Re-verify:           Mitrovic and Vlahovic were still active
 *                         internationals as of asOf — re-verify their
 *                         totals frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.serbia_scorers = {
  label: "Serbia all-time top scorers",
  unit: "goals",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/joeg-recintlp.html",
  rows: [
    { n: "Aleksandar Mitrovic", v: 64 }, /* active — re-verify frequently */
    { n: "Stjepan Bobek", v: 38 },
    { n: "Milan Galic", v: 37 },
    { n: "Savo Milosevic", v: 37 },
    { n: "Blagoje Marjanovic", v: 36 },
    { n: "Rajko Mitic", v: 32 },
    { n: "Dusan Bajevic", v: 29 },
    { n: "Todor Veselinovic", v: 28 },
    { n: "Predrag Mijatovic", v: 27 },
    { n: "Borivoje Kostic", v: 26 },
    { n: "Zlatko Vujovic", v: 25 },
    { n: "Dragan Dzajic", v: 23 },
    { n: "Dusan Tadic", v: 23 },
    { n: "Bernard Vukas", v: 22 },
    { n: "Safet Susic", v: 21 },
    { n: "Slaven Zambata", v: 21 },
    { n: "Nikola Zigic", v: 20 },
    { n: "Dejan Savicevic", v: 19 },
    { n: "Djordje Vujadinovic", v: 18 },
    { n: "Mateja Kezman", v: 17 },
    { n: "Muhamed Mujic", v: 17 },
    { n: "Darko Pancev", v: 17 },
    { n: "Branko Zebec", v: 17 },
    { n: "Milos Milutinovic", v: 16 },
    { n: "Dusan Vlahovic", v: 16 }, /* active — re-verify frequently */
    { n: "Dejan Stankovic", v: 15 },
    { n: "Dragan Stojkovic", v: 15 },
    { n: "Aleksandar Zivkovic", v: 15 },
    { n: "Branislav Ivanovic", v: 13 },
    { n: "Zeljko Cajkovski", v: 12 }
  ]
};
