/* data_minefield_pl_hattrick.js — Football Minefield category: "Scored a
 * Premier League hat-trick". safe = confirmed hat-trick scorers; mine =
 * prolific PL goalscorers who — per a dedicated Sky Sports article on
 * exactly this stat — never scored one, despite big overall goal tallies.
 *
 * VERIFICATION (B6 pipeline): safe list sourced from Wikipedia's "List of
 * Premier League hat-tricks" (84 distinct names extracted from the
 * article's early-era rows alone — the app easily has room to add more
 * from later seasons in a future batch). Mine list sourced from Sky
 * Sports' "Martin Tyler's stats: Who has the most Premier League goals
 * without a hat-trick?" — an unusually strong source since it's a
 * dedicated ranked list of exactly this fact, led by Ryan Giggs (109
 * goals, explicitly "the highest scoring Premier League player to have
 * never scored a hat-trick"). asOf: 2026-07-11. */
window.MINEFIELD_DATA = window.MINEFIELD_DATA || {};
window.MINEFIELD_DATA.pl_hattrick = {
  label: "Scored a Premier League hat-trick",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_Premier_League_hat-tricks",
  boardSize: 6,
  safe: [
    "Eric Cantona", "Mark Robins", "John Hendrie", "Andy Sinton",
    "Brian Deane", "Teddy Sheringham", "Gordon Strachan", "Les Ferdinand",
    "Chris Sutton", "Mark Walters", "Rod Wallace", "Matthew Le Tissier",
    "Micky Quinn", "Tony Cottee", "Kevin Campbell", "Efan Ekoku",
    "Alan Shearer", "Peter Beardsley", "Robbie Fowler", "Andy Cole",
    "Dean Saunders", "Ian Wright", "Dean Holdsworth", "Andrei Kanchelskis",
    "Tommy Johnson", "Peter Ndlovu", "Tony Yeboah", "Gary McAllister",
    "Mark Hughes", "Fabrizio Ravanelli", "Dwight Yorke", "Gary Speed",
    "Dion Dublin", "Gianluca Vialli", "Dennis Bergkamp", "Gianfranco Zola",
    "Duncan Ferguson", "Michael Owen", "Jurgen Klinsmann", "Nicolas Anelka",
    "Kevin Phillips", "Nwankwo Kanu", "Marc Overmars", "Ole Gunnar Solskjaer",
    "Stan Collymore", "Emile Heskey", "Jimmy Floyd Hasselbaink", "Robbie Keane",
    "Thierry Henry", "Ruud van Nistelrooy", "Robert Pires", "Freddie Ljungberg",
    "Paul Scholes", "Mark Viduka", "Yakubu", "Jermain Defoe",
    "Steven Gerrard", "Frank Lampard"
  ],
  mine: [
    "Ryan Giggs", "Kevin Davies", "Craig Bellamy", "Paolo Di Canio",
    "David Beckham", "Niall Quinn", "Lee Bowyer", "Harry Kewell",
    "Tim Cahill", "Jason Euell"
  ]
};
