/* data_minefield_100_caps.js — Football Minefield category: "Capped 100+
 * times for their country". safe = confirmed 100+ cap internationals;
 * mine = famous players with well-documented LOWER cap counts, chosen for
 * real per-player confidence (players who retired from international duty
 * early, or whose fame outweighs their actual cap count).
 *
 * VERIFICATION (B6 pipeline): safe list reuses the same Wikipedia "List of
 * men's footballers with 100 or more international caps" table already
 * sourced for data_501_intl_caps.js (same underlying research, reused
 * here rather than re-researched from scratch). Mine list cap counts are
 * well-documented individually-famous facts (e.g. George Best's low
 * Northern Ireland cap count despite being one of the greatest players
 * ever is a commonly-cited "surprising stat"). asOf: 2026-07-11. */
window.MINEFIELD_DATA = window.MINEFIELD_DATA || {};
window.MINEFIELD_DATA.caps_100 = {
  label: "Capped 100+ times for their country",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_men%27s_footballers_with_100_or_more_international_caps",
  boardSize: 6,
  safe: [
    "Cristiano Ronaldo", "Lionel Messi", "Luka Modric", "Bader Al-Mutawa",
    "Soh Chin Ann", "Ahmed Kano", "Hassan Al-Haydos", "Ahmed Hassan",
    "Andres Guardado", "Sergio Ramos", "Gianluigi Buffon", "Ivan Hurtado",
    "Alexis Sanchez", "Iker Casillas", "Robert Lewandowski", "Diego Godin",
    "Gary Medel", "Xavi", "Miroslav Klose", "Thiago Silva",
    "Maynor Figueroa", "Hossam Hassan", "Claudio Suarez"
  ],
  mine: [
    "George Best", "Diego Maradona", "Zico", "Eusebio",
    "Ronaldinho", "Garrincha", "Ferenc Puskas", "Johan Cruyff",
    "Michael Owen", "Roberto Baggio", "Gabriel Batistuta",
    "Ronaldo Nazario", "Rivaldo", "David Villa", "Pele"
  ]
};
