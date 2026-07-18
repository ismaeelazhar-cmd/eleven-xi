/* data_minefield_two_countries.js — Football Minefield category:
 * "Represented two different countries at senior international level".
 * safe = confirmed nationality-switchers with senior caps for two
 * different national teams; mine = legendary/famous players who only
 * ever played senior international football for one country, despite
 * often being eligible for others.
 *
 * VERIFICATION (B6 pipeline): safe list sourced from Wikipedia's "List of
 * association football players capped by two senior national teams" plus
 * WebSearch cross-checks for each individual switch (Diego Costa
 * Brazil→Spain, Thiago Motta Brazil→Italy, Ferenc Puskas Hungary→Spain,
 * Alfredo Di Stefano Argentina→Spain, Laszlo Kubala Czechoslovakia→
 * Hungary→Spain, Jermaine Jones Germany→USA, Wilfried Zaha England→Ivory
 * Coast, Nacer Chadli Morocco→Belgium, Dodi Lukebakio DR Congo→Belgium,
 * Florent Malouda France→French Guiana, Houssem Aouar France→Algeria,
 * Inaki Williams Spain→Ghana, Alejandro Zendejas Mexico→USA, Denzel
 * Dumfries Aruba→Netherlands, Joe Gaetjens Haiti→USA, Luis Monti
 * Argentina→Italy, Adnan Januzaj Belgium→Kosovo, Munir El Haddadi
 * Spain→Morocco). Mine list: each name below has a single, exclusive
 * senior-international career for one nation only, individually
 * high-confidence. asOf: 2026-07-18. */
window.MINEFIELD_DATA = window.MINEFIELD_DATA || {};
window.MINEFIELD_DATA.two_countries = {
  label: "Represented two different countries internationally",
  asOf: "2026-07-18",
  source: "https://en.wikipedia.org/wiki/List_of_association_football_players_capped_by_two_senior_national_teams",
  boardSize: 6,
  safe: [
    "Diego Costa", "Thiago Motta", "Ferenc Puskas", "Alfredo Di Stefano",
    "Laszlo Kubala", "Jermaine Jones", "Wilfried Zaha", "Nacer Chadli",
    "Dodi Lukebakio", "Florent Malouda", "Houssem Aouar", "Inaki Williams",
    "Alejandro Zendejas", "Denzel Dumfries", "Joe Gaetjens", "Luis Monti",
    "Adnan Januzaj", "Munir El Haddadi"
  ],
  mine: [
    "Lionel Messi", "Cristiano Ronaldo", "Kylian Mbappe", "Neymar",
    "Luka Modric", "Harry Kane", "Mohamed Salah", "Robert Lewandowski",
    "Antoine Griezmann", "Kevin De Bruyne", "Erling Haaland", "Ronaldinho",
    "Zinedine Zidane", "Diego Maradona", "Pele", "Franz Beckenbauer",
    "Johan Cruyff", "Xavi", "Andres Iniesta", "Luis Suarez"
  ]
};
