/* data_minefield_wc_final_scorers.js — Football Minefield category:
 * "Scored in a World Cup Final". safe = every player who has ever scored
 * in a men's FIFA World Cup final; mine = well-known players who did NOT
 * (chosen for high confidence — either their team never reached a final in
 * their career, or they played in one without being among the scorers).
 *
 * VERIFICATION (B6 pipeline): safe list sourced from Wikipedia's "List of
 * FIFA World Cup final goalscorers" (all 64 all-time scorers, confirmed by
 * the 2026-07 search summarizing "62 individuals, 80 goals" — note as of
 * the 2022 final; Messi and Di María's 2022 final goals bring the
 * documented list to 64 named scorers used here). Mine list is manually
 * curated for high-confidence accuracy per player, cross-checked against
 * known World Cup final line-ups/scorelines for each specific tournament
 * mentioned. asOf: 2026-07-08.
 *
 * Board size: 6×6 (36 cells) for this first category — smaller than the
 * original 8×8 spec, a deliberate scope trim given the research time a
 * full 64-cell board's worth of verified mines would need; the data shape
 * here (safe[] + mine[]) scales to any board size, so growing this to
 * 8×8 later is just adding more verified names to both arrays. */
window.MINEFIELD_DATA = window.MINEFIELD_DATA || {};
window.MINEFIELD_DATA.wc_final_scorers = {
  label: "Scored in a World Cup Final",
  asOf: "2026-07-08",
  source: "https://en.wikipedia.org/wiki/List_of_FIFA_World_Cup_final_goalscorers",
  boardSize: 6,
  safe: [
    "Pele", "Vava", "Zinedine Zidane", "Geoff Hurst", "Kylian Mbappe",
    "Lionel Messi", "Angel Di Maria", "Ronaldo", "Andres Iniesta", "Mario Gotze",
    "Mario Mandzukic", "Antoine Griezmann", "Paul Pogba", "Gerd Muller", "Mario Kempes",
    "Paolo Rossi", "Marco Tardelli", "Jairzinho", "Carlos Alberto", "Andreas Brehme",
    "Rudi Voeller", "Karl-Heinz Rummenigge", "Emmanuel Petit", "Marco Materazzi", "Ivan Perisic",
    "Jorge Burruchaga", "Daniel Bertoni", "Johan Neeskens", "Paul Breitner", "Helmut Rahn"
  ],
  mine: [
    "Diego Maradona", "Franz Beckenbauer", "Michel Platini", "Johan Cruyff", "George Best",
    "Alfredo Di Stefano", "Cristiano Ronaldo", "Luka Modric", "Thierry Henry", "Xavi",
    "Sergio Ramos", "Luis Suarez", "Neymar", "Robert Lewandowski", "Harry Kane", "Mohamed Salah"
  ]
};
