/* data_501_egypt_scorers.js — Football 501 category: Egypt men's national
 * team all-time top scorers. Value = career goals for Egypt.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Egypt - Record International Players"
 *                         (goalscoring table).
 *   Cross-check source:  WebSearch aggregation independently confirms
 *                         Hossam Hassan's lead at 69 goals and Mohamed
 *                         Salah's 67-68 range (Salah remained an active
 *                         international into 2026, chasing the all-time
 *                         record — the RSSSF snapshot figure of 67 is
 *                         used here since it comes with the full ranked
 *                         table needed for this category; drift
 *                         documented rather than silently resolved).
 *   asOf:                2026-07-18
 *   Re-verify:           Salah and Mostafa Mohamed were still active
 *                         internationals as of asOf — re-verify their
 *                         totals frequently, especially Salah who was
 *                         within 2 goals of the all-time record.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.egypt_scorers = {
  label: "Egypt all-time top scorers",
  unit: "goals",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/egy-recintlp.html",
  rows: [
    { n: "Hossam Hassan", v: 69 },
    { n: "Mohamed Salah", v: 67 }, /* active — re-verify frequently */
    { n: "Hassan El-Shazly", v: 49 },
    { n: "El-Sayed Al-Tabei", v: 41 },
    { n: "Mohamed Aboutraika", v: 38 },
    { n: "Ahmed Hassan", v: 33 },
    { n: "Amr Zaki", v: 30 },
    { n: "Emad Moteab", v: 28 },
    { n: "Badawi Abdel Fattah", v: 27 },
    { n: "Moustafa Reyadh", v: 26 },
    { n: "Ahmed El-Kass", v: 25 },
    { n: "Gamal Abdel Hamid", v: 24 },
    { n: "Mohamed El-Khateeb", v: 24 },
    { n: "Mohamed Diab Al-Attar", v: 22 },
    { n: "Mahmoud Trezeguet", v: 22 },
    { n: "Ahmed Belal", v: 19 },
    { n: "Mohamed Nagy Geddo", v: 19 },
    { n: "Ahmed Mido", v: 19 },
    { n: "Mohamed Shehta", v: 18 },
    { n: "Hosni Abd Rabbou", v: 17 },
    { n: "Ali Abougreisha", v: 16 },
    { n: "Taha Ismail", v: 16 },
    { n: "Hazem Emam", v: 15 },
    { n: "Ali Khalil", v: 15 },
    { n: "Ibrahim Hassan", v: 14 },
    { n: "Hassan Shehata", v: 14 },
    { n: "Emad Soliman", v: 14 },
    { n: "Taher Abouzaid", v: 13 },
    { n: "Rifaat El-Fanageely", v: 13 },
    { n: "Mostafa Mohamed", v: 13 } /* active — re-verify frequently */
  ]
};
