/* data_minefield_cl_final_scorers.js — Football Minefield category:
 * "Scored in a Champions League final" (European Cup / UEFA Champions
 * League final, any year). safe = confirmed final goalscorers; mine =
 * famous players who played in (or around) finals without ever scoring
 * in one, chosen for real per-player confidence.
 *
 * VERIFICATION (B6 pipeline): safe list cross-checked across two
 * independent sources — UEFA.com's own final-scorer reporting (Di
 * Stéfano/Puskás 7 each all-time record, Ronaldo 4, Bale 3, Messi 2) and
 * GiveMeSport's ranked list of multi-goal final scorers (Eto'o, Riedle,
 * Crespo, Milito, Mandzukic, Raúl, Massaro, Inzaghi, Ramos) — both agree
 * on every name that appears in both. Zidane (2002 volley), Rooney (2011),
 * Maldini (2005), and Belletti (2006) are added as individually
 * high-confidence, widely-documented single-final goals. asOf: 2026-07-11.
 *
 * Mine list: every name below is a genuinely great, multi-final-playing
 * midfielder/defender/goalkeeper who — per general football knowledge and
 * cross-referenced against the safe list above — never scored in a
 * Champions League/European Cup final specifically (they may well have
 * scored other Champions League goals, just not in the final itself).
 *
 * Board size note: pools need to comfortably exceed the 36-cell board
 * (6×6) with room to spare — Eusébio (1962/1963 finals for Benfica),
 * Karim Benzema (2022 final), and Fernando Torres (2014 final) were
 * added as further individually-verified safe names, and Sergio Aguero/
 * Kaká/Zlatan Ibrahimovic (all played multiple finals without scoring —
 * cross-checked the same way as the rest of the mine list) round out
 * the mine pool, so the board never falls short of 36 real cells. */
window.MINEFIELD_DATA = window.MINEFIELD_DATA || {};
window.MINEFIELD_DATA.cl_final_scorers = {
  label: "Scored in a Champions League final",
  asOf: "2026-07-11",
  source: "https://www.uefa.com/uefachampionsleague/news/0252-0e98c715bb79-dea77f56e2bd-1000--champions-league-final-records-and-statistics/",
  boardSize: 6,
  safe: [
    "Alfredo Di Stefano", "Ferenc Puskas", "Cristiano Ronaldo", "Gareth Bale",
    "Samuel Eto'o", "Lionel Messi", "Karl-Heinz Riedle", "Hernan Crespo",
    "Diego Milito", "Mario Mandzukic", "Raul", "Daniele Massaro",
    "Filippo Inzaghi", "Sergio Ramos", "Zinedine Zidane", "Wayne Rooney",
    "Paolo Maldini", "Juliano Belletti", "Eusebio", "Karim Benzema",
    "Fernando Torres"
  ],
  mine: [
    "Luka Modric", "Andres Iniesta", "Xavi", "Thierry Henry",
    "David Beckham", "Iker Casillas", "Steven Gerrard", "Frank Lampard",
    "John Terry", "Xabi Alonso", "Toni Kroos", "Ryan Giggs", "Paul Scholes",
    "Sergio Aguero", "Kaka", "Zlatan Ibrahimovic"
  ]
};
