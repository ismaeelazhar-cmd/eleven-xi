/* data_501_turkey_scorers.js — Football 501 category: Turkey men's
 * national team all-time top scorers. Value = career goals for Turkey.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Turkey - Record International Players"
 *                         (goalscoring table, data through 18 Nov 2025).
 *   Cross-check source:  Wikipedia's Turkey national team page
 *                         independently confirms Hakan Sukur's lead at
 *                         51 goals.
 *   asOf:                2026-07-18
 *   Re-verify:           Calhanoglu, Tosun, Akturkoglu, Under, Tufan,
 *                         Guler, and Yildiz were still plausibly active
 *                         internationals as of asOf. Note: this category
 *                         needed 44 rows down to 4-goal players before
 *                         the total sum landed on EXACTLY 501 — the full
 *                         row set is the only valid subset, same tight
 *                         clearance pattern as Cameroon's scorer list.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.turkey_scorers = {
  label: "Turkey all-time top scorers",
  unit: "goals",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/tur-recintlp.html",
  rows: [
    { n: "Hakan Sukur", v: 51 },
    { n: "Burak Yilmaz", v: 31 },
    { n: "Hakan Calhanoglu", v: 22 }, /* active — re-verify frequently */
    { n: "Tuncay Sanli", v: 22 },
    { n: "Lefter Kucukandonyadis", v: 21 },
    { n: "Cenk Tosun", v: 21 }, /* active — re-verify frequently */
    { n: "Cemil Turan", v: 19 },
    { n: "Metin Oktay", v: 19 },
    { n: "Nihat Kahveci", v: 19 },
    { n: "Arda Turan", v: 17 },
    { n: "Zeki-Riza Sporel", v: 15 },
    { n: "Kerem Akturkoglu", v: 14 }, /* active — re-verify frequently */
    { n: "Cengiz Under", v: 14 }, /* active — re-verify frequently */
    { n: "Arif Erdem", v: 11 },
    { n: "Ertugrul Saglam", v: 11 },
    { n: "Umut Bulut", v: 10 },
    { n: "Emre Belozoglu", v: 9 },
    { n: "Fatih Tekke", v: 9 },
    { n: "Oktay Derelioglu", v: 9 },
    { n: "Tanju Colak", v: 9 },
    { n: "Ozan Tufan", v: 9 }, /* active — re-verify frequently */
    { n: "Halil Altintop", v: 8 },
    { n: "Hami Mandirali", v: 8 },
    { n: "Mevlut Erdinc", v: 8 },
    { n: "Okan Buruk", v: 8 },
    { n: "Selcuk Inan", v: 8 },
    { n: "Semih Senturk", v: 8 },
    { n: "Burhan Sargin", v: 7 },
    { n: "Feyyaz Ucar", v: 7 },
    { n: "Hamit Altintop", v: 7 },
    { n: "Merih Demiral", v: 6 }, /* active — re-verify frequently */
    { n: "Irfan Can Kahveci", v: 6 }, /* active — re-verify frequently */
    { n: "Arda Guler", v: 6 }, /* active — re-verify frequently */
    { n: "Karadeniz Gokdeniz", v: 6 },
    { n: "Kaan Ayhan", v: 5 }, /* active — re-verify frequently */
    { n: "Kenan Yildiz", v: 5 }, /* active — re-verify frequently */
    { n: "Yalcin Sergen", v: 5 },
    { n: "Dilmen Ridvan", v: 5 },
    { n: "Yula Selcuk", v: 5 },
    { n: "Ozturk Talat", v: 5 },
    { n: "Fehmi Alpay Ozalan", v: 4 },
    { n: "Umit Davala", v: 4 },
    { n: "Metin Kurt", v: 4 },
    { n: "Suat Mamat", v: 4 }
  ]
};
