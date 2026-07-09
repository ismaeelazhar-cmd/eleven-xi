/* data_501_transfer_fees.js — Football 501 category: most expensive
 * football transfers of all time. Value = fee in € millions (rounded).
 *
 * VERIFICATION (B6 pipeline): Wikipedia — "List of most expensive
 * association football transfers" (primary), cross-checked against
 * FootballTransfers/FourFourTwo/beIN Sports reporting on the same deals.
 * asOf: 2026-07-08. HIGH re-verification cadence — this list changes
 * every transfer window, unlike closed all-time career-stat records. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.transfer_fees = {
  label: "Most expensive transfers",
  unit: "£m fee",
  asOf: "2026-07-08",
  source: "https://en.wikipedia.org/wiki/List_of_most_expensive_association_football_transfers",
  rows: [
    { n: "Neymar",              v: 222 },
    { n: "Kylian Mbappe",       v: 180 },
    { n: "Alexander Isak",      v: 145 },
    { n: "Elliot Anderson",     v: 136 },
    { n: "Joao Felix",          v: 126 },
    { n: "Enzo Fernandez",      v: 121 },
    { n: "Antoine Griezmann",   v: 120 },
    { n: "Philippe Coutinho",   v: 118 },
    { n: "Jack Grealish",       v: 118 },
    { n: "Florian Wirtz",       v: 118 },
    { n: "Declan Rice",         v: 117 },
    { n: "Moises Caicedo",      v: 116 },
    { n: "Romelu Lukaku",       v: 115 },
    { n: "Sandro Tonali",       v: 108 },
    { n: "Ousmane Dembele",     v: 105 },
    { n: "Paul Pogba",          v: 105 },
    { n: "Jude Bellingham",     v: 103 },
    { n: "Eden Hazard",         v: 100 },
    { n: "Harry Kane",          v: 100 },
    { n: "Gareth Bale",         v: 100 },
    { n: "Antony",              v: 95 },
    { n: "Josko Gvardiol",      v: 90 }
  ]
};
