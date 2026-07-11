/* data_minefield_ballon_dor.js — Football Minefield category: "Won the
 * Ballon d'Or". safe = every unique winner of the men's Ballon d'Or,
 * 1956-2025 (deduplicated — several players won multiple times); mine =
 * widely-regarded world-class players who never won it, chosen for real
 * per-player confidence.
 *
 * VERIFICATION (B6 pipeline): safe list sourced from topendsports.com's
 * full year-by-year Ballon d'Or winners table (1956-2025), cross-checked
 * against Wikipedia's "Ballon d'Or" article which independently confirms
 * the same names for the years both sources cover (record holders Messi
 * with 8 wins, Ronaldo with 5; three-time winners Platini/Cruyff/van
 * Basten). asOf: 2026-07-11.
 *
 * Mine list: every name below is a real, extremely famous top-level
 * player who — per the same Wikipedia/topendsports sources used for the
 * safe list — never appears as a winner in any year. Maradona and Pelé
 * are especially safe mine picks: the award was Europe-only eligibility
 * until 1995, so neither was ever eligible during their prime, making
 * "never won it" a very high-confidence fact rather than a close call. */
window.MINEFIELD_DATA = window.MINEFIELD_DATA || {};
window.MINEFIELD_DATA.ballon_dor = {
  label: "Won the Ballon d'Or",
  asOf: "2026-07-11",
  source: "https://www.topendsports.com/sport/soccer/list-player-of-the-year-ballondor.htm",
  boardSize: 6,
  safe: [
    "Stanley Matthews", "Alfredo Di Stefano", "Raymond Kopa", "Luis Suarez",
    "Omar Sivori", "Josef Masopust", "Lev Yashin", "Denis Law",
    "Eusebio", "Bobby Charlton", "Florian Albert", "George Best",
    "Gianni Rivera", "Gerd Muller", "Johan Cruyff", "Oleg Blokhin",
    "Franz Beckenbauer", "Allan Simonsen", "Kevin Keegan", "Karl-Heinz Rummenigge",
    "Paolo Rossi", "Michel Platini", "Igor Belanov", "Ruud Gullit",
    "Marco van Basten", "Lothar Matthaus", "Jean-Pierre Papin", "Roberto Baggio",
    "Hristo Stoichkov", "George Weah", "Matthias Sammer", "Ronaldo",
    "Zinedine Zidane", "Rivaldo", "Luis Figo", "Michael Owen",
    "Pavel Nedved", "Andriy Shevchenko", "Ronaldinho", "Fabio Cannavaro",
    "Kaka", "Cristiano Ronaldo", "Lionel Messi", "Luka Modric",
    "Karim Benzema", "Rodri", "Ousmane Dembele"
  ],
  mine: [
    "Diego Maradona", "Pele", "Neymar", "Kylian Mbappe",
    "Mohamed Salah", "Xavi", "Andres Iniesta", "Thierry Henry",
    "Ryan Giggs", "Paolo Maldini", "Roberto Carlos", "Didier Drogba",
    "Sergio Ramos", "Iker Casillas", "Gianluigi Buffon", "Robert Lewandowski",
    "Erling Haaland", "Vinicius Junior", "Harry Kane", "Sadio Mane"
  ]
};
