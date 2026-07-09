/* data_501_pl_appearances.js — Football 501 category: Premier League
 * appearances. Value = career Premier League appearances.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   All-time-leaders rows (658 down to 469): Wikipedia — "Premier League
 *     records and statistics", Most Appearances table; cross-checked
 *     against The Analyst (Opta)'s "Players With the Most Premier League
 *     Appearances" — all match exactly between both sources.
 *   Mid-range rows (392-420): myfootballfacts.com "All Time 300 or More
 *     Players' Premier League Appearances" table.
 *   Low rows (33-99): Football365 "Top ten Premier League players with
 *     fewer than 100 games" and Opta Analyst "Race to the Century" —
 *     Zlatan Ibrahimovic, Michu, Mascherano, Demba Ba figures confirmed there.
 *   asOf: 2026-07-08
 *
 * IMPORTANT — why the low/mid rows exist: Football 501's darts-realistic
 * rule caps any single "throw" at 180 (real 501's max single-visit score).
 * The original 20-row all-time-leaders list was ENTIRELY 469+ — every
 * single value exceeded 180, making the category mathematically
 * unwinnable from the very first guess under that rule. These extra rows
 * give the category a genuine spread down into throwable range so a real
 * checkout path exists, exactly like a real darts leg needs some markers
 * good for finishing, not just big numbers.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.pl_appearances = {
  label: "Premier League appearances",
  unit: "apps",
  asOf: "2026-07-08",
  source: "https://en.wikipedia.org/wiki/Premier_League_records_and_statistics",
  rows: [
    { n: "James Milner",     v: 658 },
    { n: "Gareth Barry",     v: 653 },
    { n: "Ryan Giggs",       v: 632 },
    { n: "Frank Lampard",    v: 609 },
    { n: "David James",      v: 572 },
    { n: "Gary Speed",       v: 535 },
    { n: "Emile Heskey",     v: 516 },
    { n: "Mark Schwarzer",   v: 514 },
    { n: "Jamie Carragher",  v: 508 },
    { n: "Phil Neville",     v: 505 },
    { n: "Rio Ferdinand",    v: 504 },
    { n: "Steven Gerrard",   v: 504 },
    { n: "Sol Campbell",     v: 503 },
    { n: "Paul Scholes",     v: 499 },
    { n: "Jermain Defoe",    v: 496 },
    { n: "John Terry",       v: 492 },
    { n: "Wayne Rooney",     v: 491 },
    { n: "Ashley Young",     v: 485 },
    { n: "Michael Carrick",  v: 481 },
    { n: "Sylvain Distin",   v: 469 },
    { n: "Leighton Baines",  v: 420 },
    { n: "Teddy Sheringham", v: 418 },
    { n: "Danny Murphy",     v: 417 },
    { n: "Nicky Butt",       v: 411 },
    { n: "Gary Neville",     v: 400 },
    { n: "Raheem Sterling",  v: 396 },
    { n: "Damien Duff",      v: 392 },
    { n: "Demba Ba",         v: 99 },
    { n: "Javier Mascherano", v: 99 },
    { n: "Michu",            v: 52 },
    { n: "Zlatan Ibrahimovic", v: 33 }
  ]
};
