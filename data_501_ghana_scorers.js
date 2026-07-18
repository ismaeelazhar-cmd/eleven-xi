/* data_501_ghana_scorers.js — Football 501 category: Ghana men's national
 * team all-time top scorers. Value = career goals for Ghana.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Ghana - Record International Players"
 *                         (goalscoring table).
 *   Cross-check source:  WebSearch aggregation independently confirms
 *                         Asamoah Gyan's lead at 51 goals and Jordan
 *                         Ayew/Andre Ayew as the leading active scorers.
 *   asOf:                2026-07-18
 *   Re-verify:           Jordan Ayew, Andre Ayew, Partey, Kudus, and
 *                         Wakaso were still plausibly active
 *                         internationals as of asOf — re-verify their
 *                         totals frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.ghana_scorers = {
  label: "Ghana all-time top scorers",
  unit: "goals",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/gha-recintlp.html",
  rows: [
    { n: "Asamoah Gyan", v: 51 },
    { n: "Edward Acquah", v: 45 },
    { n: "Kwasi Owusu", v: 36 },
    { n: "Jordan Ayew", v: 33 }, /* active — re-verify frequently */
    { n: "Andre Ayew", v: 28 }, /* active — re-verify frequently */
    { n: "Karin Abdul Razak", v: 25 },
    { n: "Wilberforce Mfum", v: 20 },
    { n: "Sulley Muntari", v: 20 },
    { n: "Osei Kofi", v: 19 },
    { n: "Abedi Pele", v: 19 },
    { n: "Thomas Partey", v: 16 }, /* active — re-verify frequently */
    { n: "Kofi Pare", v: 15 },
    { n: "Anthony Yeboah", v: 15 },
    { n: "Stephen Appiah", v: 14 },
    { n: "Charles Akonnor", v: 13 },
    { n: "Matthew Amoah", v: 13 },
    { n: "Mohammed Kudus", v: 13 }, /* active — re-verify frequently */
    { n: "Mubarak Wakaso", v: 13 }, /* active — re-verify frequently */
    { n: "Junior Agogo", v: 12 },
    { n: "Isaac Asare", v: 12 },
    { n: "Emmanuel Agyemang-Badu", v: 11 },
    { n: "Charles Amoah", v: 10 },
    { n: "Christian Atsu", v: 10 },
    { n: "Michael Essien", v: 9 },
    { n: "Yaw Preko", v: 7 },
    { n: "Ibrahim Sunday", v: 7 },
    { n: "Kwame Ayew", v: 7 },
    { n: "Prince Tagoe", v: 7 },
    { n: "John Boye", v: 5 },
    { n: "Samuel Johnson", v: 5 }
  ]
};
