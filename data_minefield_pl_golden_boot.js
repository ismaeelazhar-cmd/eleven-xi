/* data_minefield_pl_golden_boot.js — Football Minefield category: "Won
 * the Premier League Golden Boot" (top scorer award, any season since
 * 1993). safe = every unique winner (deduplicated — several players won
 * multiple times); mine = famous prolific PL strikers who — per a
 * dedicated article on exactly this topic — never actually won it.
 *
 * VERIFICATION (B6 pipeline): safe list sourced from Wikipedia's
 * "Premier League Golden Boot" article (26 unique winners, 1993-present)
 * — since this is the COMPLETE deduplicated winners list, any real PL
 * striker NOT on it is by definition a correct mine, which is the logic
 * used for the last 3 mine entries below (Crouch/Heskey/Adebayor — none
 * ever had a top-scorer season, general football knowledge, no separate
 * article needed given the safe list's completeness). The first 7 mine
 * entries additionally have a dedicated source: planetfootball.com's
 * "8 legendary goalscorers we can't believe never won a Premier League
 * Golden Boot" article, an unusually strong source since its whole point
 * is confirming each name specifically never won. asOf: 2026-07-11. */
window.MINEFIELD_DATA = window.MINEFIELD_DATA || {};
window.MINEFIELD_DATA.pl_golden_boot = {
  label: "Won the Premier League Golden Boot",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/Premier_League_Golden_Boot",
  boardSize: 6,
  safe: [
    "Teddy Sheringham", "Andy Cole", "Alan Shearer", "Chris Sutton",
    "Dion Dublin", "Michael Owen", "Dwight Yorke", "Jimmy Floyd Hasselbaink",
    "Kevin Phillips", "Thierry Henry", "Ruud van Nistelrooy", "Didier Drogba",
    "Cristiano Ronaldo", "Nicolas Anelka", "Carlos Tevez", "Dimitar Berbatov",
    "Robin van Persie", "Luis Suarez", "Sergio Aguero", "Harry Kane",
    "Mohamed Salah", "Pierre-Emerick Aubameyang", "Sadio Mane", "Jamie Vardy",
    "Son Heung-min", "Erling Haaland"
  ],
  mine: [
    "Wayne Rooney", "Fernando Torres", "Diego Costa", "Robbie Fowler",
    "Jermain Defoe", "Frank Lampard", "Les Ferdinand",
    "Peter Crouch", "Emile Heskey", "Emmanuel Adebayor",
    "Steven Gerrard", "Paul Scholes"
  ]
};
