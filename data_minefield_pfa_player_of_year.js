/* data_minefield_pfa_player_of_year.js — Football Minefield category:
 * "Won the PFA Players' Player of the Year award". safe = every winner
 * from the award's 1973-74 inception through 2024-25; mine = major
 * Premier League stars, often multi-time title winners or top scorers,
 * who — despite huge reputations — never actually won this specific
 * peer-voted award.
 *
 * VERIFICATION (B6 pipeline): safe list sourced from Wikipedia's "PFA
 * Players' Player of the Year" full winners table, 52 seasons 1973-74
 * through 2024-25 (most recently Mohamed Salah's third win in 2024-25).
 * Mine list individually verified as PL greats who never won it despite
 * long, decorated careers at the time — Lampard, Drogba, Aguero, Silva,
 * Pires, Vieira, Vidic, Cech, Cole, Toure, Sterling, and (as of the
 * award's most recent 2024-25 running) Kane and Saka had not yet won it
 * either. asOf: 2026-07-18. */
window.MINEFIELD_DATA = window.MINEFIELD_DATA || {};
window.MINEFIELD_DATA.pfa_player_of_year = {
  label: "Won the PFA Players' Player of the Year award",
  asOf: "2026-07-18",
  source: "https://en.wikipedia.org/wiki/PFA_Players%27_Player_of_the_Year",
  boardSize: 6,
  safe: [
    "Norman Hunter", "Colin Todd", "Pat Jennings", "Andy Gray",
    "Peter Shilton", "Liam Brady", "Terry McDermott", "John Wark",
    "Kevin Keegan", "Kenny Dalglish", "Ian Rush", "Peter Reid",
    "Gary Lineker", "Clive Allen", "John Barnes", "Mark Hughes",
    "David Platt", "Gary Pallister", "Paul McGrath", "Eric Cantona",
    "Alan Shearer", "Les Ferdinand", "Dennis Bergkamp", "David Ginola",
    "Roy Keane", "Teddy Sheringham", "Ruud van Nistelrooy", "Thierry Henry",
    "John Terry", "Steven Gerrard", "Cristiano Ronaldo", "Ryan Giggs",
    "Wayne Rooney", "Gareth Bale", "Robin van Persie", "Luis Suarez",
    "Eden Hazard", "Riyad Mahrez", "N'Golo Kante", "Mohamed Salah",
    "Virgil van Dijk", "Kevin De Bruyne", "Erling Haaland", "Phil Foden"
  ],
  mine: [
    "Frank Lampard", "Didier Drogba", "Sergio Aguero", "David Silva",
    "Robert Pires", "Patrick Vieira", "Nemanja Vidic", "Petr Cech",
    "Ashley Cole", "Yaya Toure", "Raheem Sterling", "Harry Kane",
    "Bukayo Saka", "Andy Cole", "Dwight Yorke", "Michael Owen",
    "Rio Ferdinand", "Jamie Carragher"
  ]
};
