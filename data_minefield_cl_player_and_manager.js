/* data_minefield_cl_player_and_manager.js — Football Minefield category:
 * "Won the Champions League/European Cup as both player and manager".
 * safe = the 7 confirmed men in football history to have achieved this;
 * mine = legendary figures who won it multiple times but ONLY ever as a
 * player, or ONLY ever as a manager, never both.
 *
 * VERIFICATION (B6 pipeline): safe list sourced from UEFA.com's dedicated
 * article "Who has won the UEFA Champions League as a player and coach?"
 * — Miguel Munoz (player: Real Madrid 1956/57/58; manager: Real Madrid
 * 1960), Giovanni Trapattoni (player: AC Milan 1963/69; manager: Juventus
 * 1985), Johan Cruyff (player: Ajax 1971/72/73; manager: Barcelona 1992),
 * Frank Rijkaard (player: AC Milan 1989/90, Ajax 1995; manager: Barcelona
 * 2006), Carlo Ancelotti (player: AC Milan 1989/90; manager: AC Milan
 * 2003/07, Real Madrid 2014/22/24), Pep Guardiola (player: Barcelona
 * 1992; manager: Barcelona 2009/11, Man City 2023), Zinedine Zidane
 * (player: Real Madrid 2002; manager: Real Madrid 2016/17/18). Mine list
 * individually verified as player-only or manager-only winners. asOf:
 * 2026-07-18. */
window.MINEFIELD_DATA = window.MINEFIELD_DATA || {};
window.MINEFIELD_DATA.cl_player_and_manager = {
  label: "Won the Champions League as both player and manager",
  asOf: "2026-07-18",
  source: "https://www.uefa.com/uefachampionsleague/news/022d-0e90fc10974b-cb5bd86b8f7d-1000--who-has-won-the-uefa-champions-league-as-a-player-and-coach/",
  boardSize: 5,
  safe: [
    "Miguel Munoz", "Giovanni Trapattoni", "Johan Cruyff", "Frank Rijkaard",
    "Carlo Ancelotti", "Pep Guardiola", "Zinedine Zidane"
  ],
  mine: [
    "Lionel Messi", "Cristiano Ronaldo", "David Beckham", "Andres Iniesta",
    "Xavi", "Luka Modric", "Harry Kane", "Mohamed Salah",
    "Jurgen Klopp", "Alex Ferguson", "Arsene Wenger", "Jose Mourinho",
    "Diego Simeone", "Antonio Conte", "Thomas Tuchel", "Unai Emery",
    "Steven Gerrard", "Paolo Maldini"
  ]
};
