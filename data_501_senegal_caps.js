/* data_501_senegal_caps.js — Football 501 category: Senegal men's
 * national team all-time most-capped players. Value = career caps for
 * Senegal.
 *
 * NOTE: Senegal's SCORERS axis was researched this batch but DROPPED —
 * even after extending to 57 individually-verified rows (down to 1-goal
 * players, pulled from RSSSF's ranked list plus 4 separate targeted
 * "exactly N goals" follow-up queries), the total sum only reached 438,
 * short of the 501 checkout target with zero chance of an exact subset.
 * A cross-check against Transfermarkt's Senegal scorer numbers surfaced
 * further disagreement with RSSSF on several players' totals (e.g. Sarr
 * 23 vs RSSSF's 16, Niang 18 vs RSSSF's 20) too large to be simple
 * snapshot drift, suggesting the two sources scope different competitions
 * — not safe to merge without more research. Per the plan's "never
 * fabricate a stat" rule, senegal_scorers is dropped this batch rather
 * than shipped with padded/guessed rows; revisit with more sources later
 * if a fuller Senegal-specific goalscorer archive turns up.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Senegal - Record International
 *                         Players" (most-capped table).
 *   Cross-check source:  Wikipedia's Senegal national team infobox
 *                         independently confirms Idrissa Gana Gueye's
 *                         lead (136 caps per Wikipedia's more current
 *                         snapshot vs RSSSF's 130 — Gueye remained active
 *                         into 2026, drift documented rather than
 *                         silently resolved; RSSSF's more granular
 *                         130-cap figure is used here since it comes with
 *                         the full ranked table needed for this category).
 *   asOf:                2026-07-18
 *   Re-verify:           Gueye, Mane, Koulibaly, Kouyate, and Sarr were
 *                         still plausibly active internationals as of
 *                         asOf — re-verify their totals frequently.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.senegal_caps = {
  label: "Senegal all-time most capped players",
  unit: "caps",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/sene-recintlp.html",
  rows: [
    { n: "Idrissa Gana Gueye", v: 130 }, /* active — re-verify frequently */
    { n: "Sadio Mane", v: 126 }, /* active — re-verify frequently */
    { n: "Kalidou Koulibaly", v: 103 }, /* active — re-verify frequently */
    { n: "Henri Camara", v: 98 },
    { n: "Cheikhou Kouyate", v: 89 }, /* active — re-verify frequently */
    { n: "Tony Sylva", v: 84 },
    { n: "Ismaila Sarr", v: 81 }, /* active — re-verify frequently */
    { n: "Lamine Diatta", v: 72 },
    { n: "El Hadji Diouf", v: 70 },
    { n: "Roger Mendy", v: 70 },
    { n: "Moussa Ndiaye", v: 67 },
    { n: "Adolphe Mendy", v: 65 },
    { n: "Pape Bouba Diop", v: 63 },
    { n: "Omar Daf", v: 60 },
    { n: "Pape Malick Diop", v: 59 }
  ]
};
