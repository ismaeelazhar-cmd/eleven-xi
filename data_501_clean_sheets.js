/* data_501_clean_sheets.js — Football 501 category: Premier League all-time
 * goalkeeper clean sheet leaders. Value = career PL clean sheets.
 *
 * VERIFICATION (B6 pipeline): Wikipedia "List of goalkeepers with 100 or
 * more Premier League clean sheets" (primary), cross-checked against Opta
 * Analyst "The Most Premier League Clean Sheets". asOf: 2026-07-08. Cech
 * and James are retired/closed totals; de Gea's total should be
 * re-verified if he returns to a PL club. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.clean_sheets = {
  label: "Premier League clean sheets",
  unit: "clean sheets",
  asOf: "2026-07-08",
  source: "https://en.wikipedia.org/wiki/List_of_goalkeepers_with_100_or_more_Premier_League_clean_sheets",
  rows: [
    { n: "Petr Cech",          v: 202 },
    { n: "David James",        v: 169 },
    { n: "Mark Schwarzer",     v: 152 },
    { n: "David de Gea",       v: 147 }, /* re-verify if he returns to a PL club */
    { n: "David Seaman",       v: 141 },
    { n: "Nigel Martyn",       v: 137 },
    { n: "Pepe Reina",         v: 136 },
    { n: "Edwin van der Sar",  v: 132 },
    { n: "Tim Howard",         v: 132 },
    { n: "Brad Friedel",       v: 132 },
    { n: "Peter Schmeichel",   v: 128 },
    { n: "Joe Hart",           v: 127 },
    { n: "Hugo Lloris",        v: 127 },
    { n: "Ederson",            v: 115 }, /* active — re-verify each season */
    { n: "Shay Given",         v: 113 },
    { n: "Jussi Jaaskelainen", v: 108 },
    { n: "Thomas Sorensen",    v: 107 },
    { n: "Alisson Becker",     v: 103 } /* active — re-verify each season */
  ]
};
