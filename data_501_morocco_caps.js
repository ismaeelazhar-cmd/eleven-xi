/* data_501_morocco_caps.js — Football 501 category: Morocco men's
 * national team all-time most-capped players. Value = career caps for
 * Morocco.
 *
 * NOTE: Morocco's SCORERS axis was researched this batch but DROPPED —
 * extended to 37 individually-verified rows (RSSSF's top-30 ranked table
 * plus Transfermarkt cross-checks for Boutaib/Safri/Chippo/Iajour/Bahja/
 * Boufal/Boussoufa) and the total sum only reached 450, short of the 501
 * checkout target with zero chance of an exact subset. Morocco's
 * international scoring pool below the top ~20 thins out fast (many
 * defenders/midfielders capped 60-115 times with 2-4 career goals total)
 * and further research (WebSearch, additional Transfermarkt pages) did
 * not surface enough additional distinct low-value scorers to close the
 * ~51-goal gap. Per the plan's "never fabricate a stat" rule,
 * morocco_scorers is dropped this batch rather than shipped with padded
 * rows — same honest-drop precedent as senegal_scorers this session;
 * revisit if a fuller Morocco-specific goalscorer archive turns up.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Morocco - Record International
 *                         Players" (most-capped table).
 *   Cross-check source:  WebSearch aggregation independently confirms
 *                         Naybet's lead at 115 caps and Hakimi third at
 *                         92.
 *   asOf:                2026-07-18
 *   Re-verify:           Hakimi, El-Nesyri, Bounou, Saiss, and Amrabat
 *                         were still plausibly active internationals as
 *                         of asOf — re-verify their totals frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.morocco_caps = {
  label: "Morocco all-time most capped players",
  unit: "caps",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/maro-recintlp.html",
  rows: [
    { n: "Noureddine Naybet", v: 115 },
    { n: "Ahmed Faras", v: 94 },
    { n: "Achraf Hakimi", v: 92 }, /* active — re-verify frequently */
    { n: "Youssef El-Nesyri", v: 90 }, /* active — re-verify frequently */
    { n: "Yassine Bounou", v: 87 }, /* active — re-verify frequently */
    { n: "Romain Saiss", v: 84 }, /* active — re-verify frequently */
    { n: "Youssef Safri", v: 79 },
    { n: "Houssine Kharja", v: 78 },
    { n: "Ezzaki Badou Zaki", v: 78 },
    { n: "Abdelmajid Dolmy", v: 76 },
    { n: "Sofiane Amrabat", v: 73 }, /* active — re-verify frequently */
    { n: "Youssef Chippo", v: 73 },
    { n: "Mohamed Hazzaz", v: 73 },
    { n: "Abdelkrim El-Hadrioui", v: 72 },
    { n: "Mbark Boussoufa", v: 68 }
  ]
};
