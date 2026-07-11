/* data_minefield_multi_wc_winner.js — Football Minefield category: "Won
 * the World Cup more than once (as a player)". safe = confirmed 2-time
 * or 3-time World Cup winners; mine = legendary players who won the
 * World Cup zero or exactly once, despite immense fame.
 *
 * VERIFICATION (B6 pipeline): safe list sourced from Wikipedia's "List
 * of FIFA World Cup winning players" — Pelé is the sole 3-time winner
 * (1958/1962/1970), with ~20 further 2-time winners named specifically
 * (Cafu and Ronaldo both 1994+2002; the full 1958+1962 Brazil core;
 * the 1934+1938 Italy core; Daniel Passarella 1978+1986). asOf:
 * 2026-07-11. Mine list: each name below won the World Cup exactly
 * once (Messi 2022, Maradona 1986, Zidane 1998, Beckenbauer 1974 as a
 * PLAYER — his 1990 win was as manager, not counted here) or never won
 * it at all (Cristiano Ronaldo, Neymar, George Best, Ferenc Puskás,
 * Johan Cruyff) — all high-confidence, well-documented facts. */
window.MINEFIELD_DATA = window.MINEFIELD_DATA || {};
window.MINEFIELD_DATA.multi_wc_winner = {
  label: "Won the World Cup more than once",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_FIFA_World_Cup_winning_players",
  boardSize: 6,
  safe: [
    "Pele", "Cafu", "Ronaldo", "Garrincha", "Djalma Santos",
    "Nilton Santos", "Pepe", "Vava", "Gilmar", "Mauro",
    "Zito", "Zozimo", "Mario Zagallo", "Giovanni Ferrari", "Giuseppe Meazza",
    "Guido Masetti", "Eraldo Monzeglio", "Daniel Passarella"
  ],
  mine: [
    "Lionel Messi", "Diego Maradona", "Zinedine Zidane", "Franz Beckenbauer",
    "Cristiano Ronaldo", "Neymar", "George Best", "Ferenc Puskas",
    "Johan Cruyff", "Michel Platini", "Luka Modric", "Kylian Mbappe",
    "Xavi", "Andres Iniesta", "Gabriel Batistuta", "Alfredo Di Stefano",
    "Eusebio", "Gerd Muller"
  ]
};
