/* data_501_cameroon_scorers.js — Football 501 category: Cameroon men's
 * national team all-time top scorers. Value = career goals for Cameroon.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Cameroon - Record International
 *                         Players" (goalscoring + appearances tables,
 *                         data through 26 Aug 2025).
 *   Cross-check source:  WebSearch aggregation independently confirms
 *                         Eto'o's lead at 56 goals and Aboubakar second.
 *   asOf:                2026-07-18
 *   Re-verify:           Aboubakar, Choupo-Moting, Toko Ekambi, Mbeumo,
 *                         and several defenders were still plausibly
 *                         active internationals as of asOf — re-verify
 *                         their totals frequently. Note: this category
 *                         needed 55 rows down to 1-goal players before
 *                         the total sum reached EXACTLY 501 — the tightest
 *                         possible clearance of the whole nation-stats
 *                         phase (the full row set itself is the only
 *                         subset that sums to the target).
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.cameroon_scorers = {
  label: "Cameroon all-time top scorers",
  unit: "goals",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/kam-recintlp.html",
  rows: [
    { n: "Samuel Etoo", v: 56 },
    { n: "Vincent Aboubakar", v: 45 }, /* active — re-verify frequently */
    { n: "Roger Milla", v: 43 },
    { n: "Patrick Mboma", v: 33 },
    { n: "Francois Omam-Biyik", v: 26 },
    { n: "Choupo-Moting", v: 20 }, /* active — re-verify frequently */
    { n: "Achille Webo", v: 19 },
    { n: "Emmanuel Kunde", v: 17 },
    { n: "Andre Kana-Biyik", v: 15 },
    { n: "Karl Toko Ekambi", v: 14 }, /* active — re-verify frequently */
    { n: "Njitap Geremi", v: 13 },
    { n: "Alphonse Tchami", v: 12 },
    { n: "Bonaventure Djonkep", v: 10 },
    { n: "Jacob Ewane", v: 10 },
    { n: "Clinton Njie", v: 10 },
    { n: "Joseph-Desire Job", v: 9 },
    { n: "Ernest-Lottin Ebongue", v: 9 },
    { n: "Christian Bassogog", v: 8 },
    { n: "Marc-Vivien Foe", v: 8 },
    { n: "Louis-Paul Mfede", v: 8 },
    { n: "Bryan Mbeumo", v: 7 }, /* active — re-verify frequently */
    { n: "Benjamin Moukandjo", v: 7 },
    { n: "Mohamadou Idrissou", v: 6 },
    { n: "Theophile Abega", v: 6 },
    { n: "Achille Emana", v: 6 },
    { n: "Rigobert Song", v: 5 },
    { n: "Nicolas N Koulou", v: 5 },
    { n: "Jean Makoun", v: 5 },
    { n: "Stephane M Bia", v: 5 },
    { n: "Rene Salomon Olembe", v: 5 },
    { n: "Michael Ngadeu-Ngadjui", v: 5 }, /* active — re-verify frequently */
    { n: "Andre Zambo Anguissa", v: 5 }, /* active — re-verify frequently */
    { n: "Nicolas Moumi Ngamaleu", v: 4 },
    { n: "Ibrahim Aoudou", v: 4 },
    { n: "Edgar Salli", v: 4 },
    { n: "Emile Mbouh", v: 3 },
    { n: "Stephen Tataw", v: 3 },
    { n: "Bertin Ebwelle", v: 3 },
    { n: "Joel Landry N Guemo", v: 3 },
    { n: "Modeste M Bami", v: 3 },
    { n: "Raymond Kalla", v: 2 },
    { n: "Henri Bedimo", v: 2 },
    { n: "Hans Agbo", v: 2 },
    { n: "Aurelien Chedjou", v: 2 },
    { n: "Bill Tchato", v: 2 },
    { n: "Enoh Eyong", v: 2 },
    { n: "Pierre Njanka", v: 2 },
    { n: "Pierre Wome", v: 1 },
    { n: "Nohuou Tolo", v: 1 },
    { n: "Ambroise Oyongo", v: 1 },
    { n: "Pierre Kunde Malong", v: 1 },
    { n: "Lucien Mettomo", v: 1 },
    { n: "Martin Hongla", v: 1 },
    { n: "Joseph-Antoine Bell", v: 1 },
    { n: "Lauren Etame Mayer", v: 1 }
  ]
};
