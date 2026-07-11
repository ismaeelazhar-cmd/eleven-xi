/* data_minefield_wc_golden_boot.js — Football Minefield category: "Won
 * the World Cup Golden Boot" (top scorer at a single World Cup, any
 * year). safe = every unique winner (deduplicated — 1962 and 1994 both
 * had ties); mine = legendary players who — despite immense World Cup
 * pedigree, sometimes even winning the trophy itself — never won the
 * individual top-scorer award at any tournament.
 *
 * VERIFICATION (B6 pipeline): safe list sourced from Wikipedia's "FIFA
 * World Cup Golden Boot" article (24 unique winners/co-winners,
 * 1930-2022). Mine list: Messi winning the 2022 World Cup itself while
 * Mbappé won that tournament's Golden Boot is a well-documented, widely
 * reported specific fact, making Messi an especially high-confidence
 * mine; Pelé/Maradona/Zidane/Cruyff/Beckenbauer/Puskás never won the
 * award in any of their tournaments per the same source's full list.
 * asOf: 2026-07-11. */
window.MINEFIELD_DATA = window.MINEFIELD_DATA || {};
window.MINEFIELD_DATA.wc_golden_boot = {
  label: "Won the World Cup Golden Boot",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/FIFA_World_Cup_Golden_Boot",
  boardSize: 6,
  safe: [
    "Guillermo Stabile", "Oldrich Nejedly", "Leonidas", "Ademir",
    "Sandor Kocsis", "Just Fontaine", "Florian Albert", "Valentin Ivanov",
    "Eusebio", "Gerd Muller", "Grzegorz Lato", "Mario Kempes",
    "Paolo Rossi", "Gary Lineker", "Salvatore Schillaci", "Oleg Salenko",
    "Hristo Stoichkov", "Davor Suker", "Ronaldo", "Miroslav Klose",
    "Thomas Muller", "James Rodriguez", "Harry Kane", "Kylian Mbappe"
  ],
  mine: [
    "Pele", "Diego Maradona", "Lionel Messi", "Zinedine Zidane",
    "Johan Cruyff", "Franz Beckenbauer", "Ferenc Puskas", "Michel Platini",
    "Cristiano Ronaldo", "Neymar", "George Best", "Alfredo Di Stefano",
    "Xavi", "Andres Iniesta", "Luka Modric"
  ]
};
