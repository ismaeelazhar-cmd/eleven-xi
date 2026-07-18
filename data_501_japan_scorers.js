/* data_501_japan_scorers.js — Football 501 category: Japan men's national
 * team all-time top scorers. Value = career goals for Japan.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Japan - Record International Players"
 *                         (goalscoring table).
 *   Cross-check source:  Wikipedia — "Japan national football team
 *                         records and statistics" — independently
 *                         confirms the top-10 order and totals exactly
 *                         (Kamamoto 75, Miura 55, Okazaki 50, Hara/Honda
 *                         37, Kagawa 31).
 *   asOf:                2026-07-18
 *   Re-verify:           Minamino was still a plausibly active
 *                         international as of asOf — re-verify if this
 *                         list is revisited.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.japan_scorers = {
  label: "Japan all-time top scorers",
  unit: "goals",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/jap-recintlp.html",
  rows: [
    { n: "Kunishige Kamamoto", v: 75 },
    { n: "Kazuyoshi Miura", v: 55 },
    { n: "Shinji Okazaki", v: 50 },
    { n: "Hiromi Hara", v: 37 },
    { n: "Keisuke Honda", v: 37 },
    { n: "Shinji Kagawa", v: 31 },
    { n: "Takumi Minamino", v: 27 }, /* active — re-verify frequently */
    { n: "Takuya Takagi", v: 27 },
    { n: "Kazushi Kimura", v: 26 },
    { n: "Yuya Osako", v: 25 },
    { n: "Shunsuke Nakamura", v: 24 },
    { n: "Naohiro Takahara", v: 23 },
    { n: "Masashi Nakayama", v: 21 },
    { n: "Teruki Miyamoto", v: 19 },
    { n: "Yuji Nakazawa", v: 17 },
    { n: "Atsushi Yanagisawa", v: 17 },
    { n: "Keiji Tamada", v: 16 },
    { n: "Ayase Ueda", v: 16 },
    { n: "Yasuhito Endo", v: 15 },
    { n: "Ryuichi Sugiyama", v: 15 },
    { n: "Hiroyuki Usui", v: 15 },
    { n: "Junya Ito", v: 14 },
    { n: "Daichi Kamada", v: 12 },
    { n: "Hiroaki Morishima", v: 12 },
    { n: "Masashi Watanabe", v: 12 },
    { n: "Maya Yoshida", v: 12 },
    { n: "Ritsu Doan", v: 11 },
    { n: "Genki Haraguchi", v: 11 },
    { n: "Tatsuhiko Kubo", v: 11 },
    { n: "Hideki Maeda", v: 11 }
  ]
};
