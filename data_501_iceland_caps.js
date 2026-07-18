/* data_501_iceland_caps.js — Football 501 category: Iceland men's
 * national team all-time most-capped players. Value = career caps for
 * Iceland.
 *
 * NOTE: Iceland's SCORERS axis was researched this batch but DROPPED —
 * extended to ~45 individually-verified rows (RSSSF's ranked table plus
 * 3 follow-up "exactly N goals" queries down to 1-goal players) and the
 * total sum still only reached ~429, short of 501. Several of the
 * deepest entries came with suspiciously low cap counts (2-3 caps for a
 * credited goal) that could not be confidently cross-checked and were
 * excluded rather than risk shipping unverifiable rows. Iceland is a
 * very small football nation (population ~380,000) with an unusually
 * thin all-time scoring pool even by the standards of other
 * low-ceiling nations seen this session (Wales, Scotland, Croatia).
 * Per the plan's "never fabricate a stat" rule, iceland_scorers is
 * dropped this batch rather than shipped with padded/uncertain rows —
 * same honest-drop precedent as Senegal, Morocco, and Ukraine.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      RSSSF — "Iceland - Record International
 *                         Players" (most-capped table).
 *   Cross-check source:  WebSearch aggregation independently confirms
 *                         Birkir Bjarnason's lead at 113 caps.
 *   asOf:                2026-07-18
 *   Re-verify:           Gunnarsson, Gudmundsson, Sigurdsson, and
 *                         Skulason were still plausibly active
 *                         internationals as of asOf.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.iceland_caps = {
  label: "Iceland all-time most capped players",
  unit: "caps",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/ijs-recintlp.html",
  rows: [
    { n: "Birkir Bjarnason", v: 113 },
    { n: "Aron Einar Gunnarsson", v: 107 }, /* active — re-verify frequently */
    { n: "Ronar Kristinsson", v: 104 },
    { n: "Birkir Mor Saevarsson", v: 103 },
    { n: "Johann Berg Gudmundsson", v: 101 }, /* active — re-verify frequently */
    { n: "Ragnar Sigurdsson", v: 97 },
    { n: "Kari Arnason", v: 90 },
    { n: "Hermann Hreidarsson", v: 89 },
    { n: "Eidur Smari Gudjohnsen", v: 88 },
    { n: "Gylfi Sigurdsson", v: 83 }, /* active — re-verify frequently */
    { n: "Ari Freyr Skulason", v: 83 }, /* active — re-verify frequently */
    { n: "Gudni Bergsson", v: 80 },
    { n: "Hannes Thor Halldorsson", v: 77 },
    { n: "Brynjar Bjorn Gunnarsson", v: 74 },
    { n: "Birkir Kristinsson", v: 74 }
  ]
};
