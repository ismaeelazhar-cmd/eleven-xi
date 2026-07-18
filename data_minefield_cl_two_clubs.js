/* data_minefield_cl_two_clubs.js — Football Minefield category: "Won the
 * Champions League with two different clubs (as a player)". safe =
 * confirmed multi-club UCL winners; mine = legendary players who won the
 * competition one or more times but ALWAYS with the same single club
 * (chosen for high per-player confidence).
 *
 * VERIFICATION (B6 pipeline): safe list sourced from Wikipedia's "List of
 * footballers who won the UEFA Champions League with more than one club"
 * (27 confirmed names, most recently Achraf Hakimi with Real Madrid 2018
 * and PSG 2025). Mine list individually verified as single-club winners:
 * Messi/Iniesta/Xavi (Barcelona only), Gerrard (Liverpool 2005 only,
 * never won again), Maldini/Pirlo (AC Milan only — Pirlo lost 2 finals
 * with Juventus, never won there), Giggs/Scholes (Man Utd only), Zidane
 * (Real Madrid 2002 only as a player), Benzema/Ramos/Casillas/Modric
 * (Real Madrid only), Henry (never won UCL as a player at all), Lampard/
 * Drogba (Chelsea 2012 only). asOf: 2026-07-18. */
window.MINEFIELD_DATA = window.MINEFIELD_DATA || {};
window.MINEFIELD_DATA.cl_two_clubs = {
  label: "Won the Champions League with two different clubs",
  asOf: "2026-07-18",
  source: "https://en.wikipedia.org/wiki/List_of_footballers_who_won_the_UEFA_Champions_League_with_more_than_one_club",
  boardSize: 6,
  safe: [
    "Toni Kroos", "Cristiano Ronaldo", "Clarence Seedorf", "Gerard Pique",
    "Mateo Kovacic", "David Alaba", "Fernando Redondo", "Samuel Eto'o",
    "Achraf Hakimi", "Lucas Hernandez", "Marcel Desailly", "Didier Deschamps",
    "Paulo Sousa", "Christian Panucci", "Deco", "Edwin van der Sar",
    "Owen Hargreaves", "Thiago Motta", "Jose Bosingwa", "Paulo Ferreira",
    "Xabi Alonso", "Daniel Sturridge", "Xherdan Shaqiri", "Thiago Alcantara",
    "Scott Carson", "Antonio Rudiger", "Kepa Arrizabalaga"
  ],
  mine: [
    "Lionel Messi", "Andres Iniesta", "Xavi", "Steven Gerrard",
    "Paolo Maldini", "Ryan Giggs", "Paul Scholes", "Andrea Pirlo",
    "Zinedine Zidane", "Karim Benzema", "Sergio Ramos", "Iker Casillas",
    "Luka Modric", "Thierry Henry", "Frank Lampard", "Didier Drogba"
  ]
};
