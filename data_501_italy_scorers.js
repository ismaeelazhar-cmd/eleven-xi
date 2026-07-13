/* data_501_italy_scorers.js — Football 501 category: Italy men's national
 * team all-time top scorers. Value = career goals for Italy.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Italy - Record International Players"
 *                         (goalscoring table, as of 2026-06-25)
 *   Cross-check source:  Wikipedia — "Italy national football team records
 *                         and statistics" — independently confirms Riva
 *                         (35), Meazza (33), Piola (30), Baggio (27), Del
 *                         Piero (27), Altobelli (25), Baloncieri (25),
 *                         Inzaghi (25), Graziani (23), Vieri (23) exactly
 *                         for the top 10.
 *   asOf:                2026-06-25
 *   Re-verify:           Ciro Immobile and Moise Kean were still active
 *                         internationals as of asOf — re-verify their
 *                         totals frequently. Note: unlike bigger-nation
 *                         lists, Italy's per-player ceiling tops out at 35
 *                         goals, so this category needed 29 rows (well
 *                         beyond the usual 15-20) before the total sum
 *                         even cleared 501, let alone passed subset-sum.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.italy_scorers = {
  label: "Italy all-time top scorers",
  unit: "goals",
  asOf: "2026-06-25",
  source: "https://www.rsssf.org/miscellaneous/ital-recintlp.html",
  rows: [
    { n: "Luigi Riva",             v: 35 },
    { n: "Giuseppe Meazza",        v: 33 },
    { n: "Silvio Piola",           v: 30 },
    { n: "Roberto Baggio",         v: 27 },
    { n: "Alessandro Del Piero",   v: 27 },
    { n: "Alessandro Altobelli",   v: 25 },
    { n: "Adolfo Baloncieri",      v: 25 },
    { n: "Filippo Inzaghi",        v: 25 },
    { n: "Francesco Graziani",     v: 23 },
    { n: "Christian Vieri",        v: 23 },
    { n: "Alessandro Mazzola",     v: 22 },
    { n: "Daniele De Rossi",       v: 21 },
    { n: "Paolo Rossi",            v: 20 },
    { n: "Roberto Bettega",        v: 19 },
    { n: "Alberto Gilardino",      v: 19 },
    { n: "Ciro Immobile",          v: 17 }, /* active — re-verify frequently */
    { n: "Luca Toni",              v: 16 },
    { n: "Gianluca Vialli",        v: 16 },
    { n: "Gino Colaussi",          v: 15 },
    { n: "Julio Libonatti",        v: 15 },
    { n: "Angelo Schiavio",        v: 15 },
    { n: "Mario Balotelli",        v: 14 },
    { n: "Giovanni Ferrari",       v: 14 },
    { n: "Gianni Rivera",          v: 14 },
    { n: "Pier Luigi Casiraghi",   v: 13 },
    { n: "Moise Kean",             v: 13 }, /* active — re-verify frequently */
    { n: "Mario Magnozzi",         v: 13 },
    { n: "Raimondo Orsi",          v: 13 },
    { n: "Andrea Pirlo",           v: 13 }
  ]
};
