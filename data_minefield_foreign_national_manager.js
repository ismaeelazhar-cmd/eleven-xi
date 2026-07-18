/* data_minefield_foreign_national_manager.js — Football Minefield
 * category: "Managed a national team different from the country they
 * played international football for". safe = confirmed cases of a
 * player-turned-manager taking charge of a foreign nation's team; mine =
 * well-known managers who, despite long international coaching careers,
 * only ever managed their own home nation.
 *
 * VERIFICATION (B6 pipeline): safe list individually verified — Guus
 * Hiddink (Netherlands player, managed South Korea, Russia, Turkey,
 * Australia), Bora Milutinovic (Yugoslavia player, managed Mexico, Costa
 * Rica, USA, Nigeria, China, Honduras, Jamaica, Iraq — a record 5
 * different nations at 5 straight World Cups), Sven-Goran Eriksson
 * (Sweden player, managed England, Mexico, Ivory Coast, Philippines),
 * Otto Rehhagel (West Germany player, managed Greece to the 2004 Euros
 * title), Marcello Lippi (Italy player, managed China after winning the
 * 2006 World Cup with his own Italy), Dick Advocaat (Netherlands player,
 * managed South Korea, Russia, Serbia, Iraq), Vahid Halilhodzic
 * (Yugoslavia player, managed Ivory Coast, Algeria, Japan, Morocco).
 * Mine list: each manager below built a long international coaching
 * career exclusively with their own home nation, never a foreign one.
 * asOf: 2026-07-18. */
window.MINEFIELD_DATA = window.MINEFIELD_DATA || {};
window.MINEFIELD_DATA.foreign_national_manager = {
  label: "Managed a national team different from the one they played for",
  asOf: "2026-07-18",
  source: "https://en.wikipedia.org/wiki/Bora_Milutinovi%C4%87",
  boardSize: 5,
  safe: [
    "Guus Hiddink", "Bora Milutinovic", "Sven-Goran Eriksson", "Otto Rehhagel",
    "Marcello Lippi", "Dick Advocaat", "Vahid Halilhodzic"
  ],
  mine: [
    "Didier Deschamps", "Joachim Low", "Gareth Southgate", "Luis Enrique",
    "Vicente del Bosque", "Cesare Prandelli", "Frank de Boer", "Zinedine Zidane",
    "Pep Guardiola", "Jurgen Klopp", "Carlo Ancelotti", "Antonio Conte",
    "Thomas Tuchel", "Unai Emery", "Diego Simeone", "Mikel Arteta",
    "Xavi Hernandez", "Steven Gerrard"
  ]
};
