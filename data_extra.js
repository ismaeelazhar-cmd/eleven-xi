/* Extra squads merged into window.WORLD_CUP_DATA.
 * 2026 squads are PROJECTED from current (2024–25) regulars — official rosters
 * aren't available — and are tagged by year "2026" for the current-tournament pool.
 * Also adds some legacy teams missed earlier. Ratings curated for gameplay.
 */
(function () {
  var D = window.WORLD_CUP_DATA;
  function add(country, flag, year, players) {
    if (!D[country]) D[country] = { flag: flag, years: {} };
    D[country].years[year] = players;
  }

  /* ===================== 2026 (projected) ===================== */
  add("Argentina", "🇦🇷", "2026", [
    { n: "Emiliano Martínez", p: "GK", r: 87 }, { n: "Gerónimo Rulli", p: "GK", r: 78 },
    { n: "Nahuel Molina", p: "DEF", r: 81 }, { n: "Cristian Romero", p: "DEF", r: 86 }, { n: "Nicolás Otamendi", p: "DEF", r: 82 },
    { n: "Nicolás Tagliafico", p: "DEF", r: 81 }, { n: "Lisandro Martínez", p: "DEF", r: 84 }, { n: "Gonzalo Montiel", p: "DEF", r: 79 },
    { n: "Rodrigo De Paul", p: "MID", r: 84 }, { n: "Enzo Fernández", p: "MID", r: 86 }, { n: "Alexis Mac Allister", p: "MID", r: 86 },
    { n: "Leandro Paredes", p: "MID", r: 80 }, { n: "Giovani Lo Celso", p: "MID", r: 81 },
    { n: "Lionel Messi", p: "FWD", r: 93 }, { n: "Julián Álvarez", p: "FWD", r: 87 }, { n: "Lautaro Martínez", p: "FWD", r: 86 },
    { n: "Alejandro Garnacho", p: "FWD", r: 82 }, { n: "Nicolás González", p: "FWD", r: 79 }
  ]);
  add("Brazil", "🇧🇷", "2026", [
    { n: "Alisson", p: "GK", r: 88 }, { n: "Ederson", p: "GK", r: 85 },
    { n: "Danilo", p: "DEF", r: 80 }, { n: "Marquinhos", p: "DEF", r: 86 }, { n: "Gabriel Magalhães", p: "DEF", r: 84 },
    { n: "Éder Militão", p: "DEF", r: 84 }, { n: "Wendell", p: "DEF", r: 78 }, { n: "Vanderson", p: "DEF", r: 79 },
    { n: "Bruno Guimarães", p: "MID", r: 85 }, { n: "Lucas Paquetá", p: "MID", r: 83 }, { n: "André", p: "MID", r: 80 },
    { n: "Joelinton", p: "MID", r: 81 },
    { n: "Vinícius Júnior", p: "FWD", r: 90 }, { n: "Rodrygo", p: "FWD", r: 86 }, { n: "Raphinha", p: "FWD", r: 86 },
    { n: "Endrick", p: "FWD", r: 81 }, { n: "Gabriel Jesus", p: "FWD", r: 82 }, { n: "Savinho", p: "FWD", r: 81 }
  ]);
  add("France", "🇫🇷", "2026", [
    { n: "Mike Maignan", p: "GK", r: 86 }, { n: "Brice Samba", p: "GK", r: 78 },
    { n: "Jules Koundé", p: "DEF", r: 84 }, { n: "William Saliba", p: "DEF", r: 86 }, { n: "Dayot Upamecano", p: "DEF", r: 84 },
    { n: "Theo Hernández", p: "DEF", r: 84 }, { n: "Ibrahima Konaté", p: "DEF", r: 83 }, { n: "Lucas Digne", p: "DEF", r: 79 },
    { n: "Aurélien Tchouaméni", p: "MID", r: 85 }, { n: "Eduardo Camavinga", p: "MID", r: 84 }, { n: "Adrien Rabiot", p: "MID", r: 82 },
    { n: "Warren Zaïre-Emery", p: "MID", r: 80 },
    { n: "Kylian Mbappé", p: "FWD", r: 93 }, { n: "Ousmane Dembélé", p: "FWD", r: 85 }, { n: "Marcus Thuram", p: "FWD", r: 83 },
    { n: "Bradley Barcola", p: "FWD", r: 81 }, { n: "Michael Olise", p: "FWD", r: 83 }, { n: "Randal Kolo Muani", p: "FWD", r: 80 }
  ]);
  add("England", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "2026", [
    { n: "Jordan Pickford", p: "GK", r: 83 }, { n: "Dean Henderson", p: "GK", r: 78 },
    { n: "Kyle Walker", p: "DEF", r: 82 }, { n: "John Stones", p: "DEF", r: 84 }, { n: "Marc Guéhi", p: "DEF", r: 82 },
    { n: "Ezri Konsa", p: "DEF", r: 80 }, { n: "Trent Alexander-Arnold", p: "DEF", r: 84 }, { n: "Levi Colwill", p: "DEF", r: 81 },
    { n: "Declan Rice", p: "MID", r: 86 }, { n: "Jude Bellingham", p: "MID", r: 89 }, { n: "Phil Foden", p: "MID", r: 87 },
    { n: "Kobbie Mainoo", p: "MID", r: 81 }, { n: "Cole Palmer", p: "MID", r: 85 },
    { n: "Harry Kane", p: "FWD", r: 89 }, { n: "Bukayo Saka", p: "FWD", r: 87 }, { n: "Anthony Gordon", p: "FWD", r: 81 },
    { n: "Ollie Watkins", p: "FWD", r: 82 }
  ]);
  add("Spain", "🇪🇸", "2026", [
    { n: "Unai Simón", p: "GK", r: 84 }, { n: "David Raya", p: "GK", r: 83 },
    { n: "Dani Carvajal", p: "DEF", r: 85 }, { n: "Robin Le Normand", p: "DEF", r: 82 }, { n: "Aymeric Laporte", p: "DEF", r: 83 },
    { n: "Marc Cucurella", p: "DEF", r: 81 }, { n: "Pau Cubarsí", p: "DEF", r: 81 }, { n: "Dani Vivian", p: "DEF", r: 79 },
    { n: "Rodri", p: "MID", r: 90 }, { n: "Pedri", p: "MID", r: 87 }, { n: "Gavi", p: "MID", r: 84 },
    { n: "Fabián Ruiz", p: "MID", r: 83 }, { n: "Martín Zubimendi", p: "MID", r: 82 }, { n: "Dani Olmo", p: "MID", r: 84 },
    { n: "Lamine Yamal", p: "FWD", r: 88 }, { n: "Nico Williams", p: "FWD", r: 85 }, { n: "Álvaro Morata", p: "FWD", r: 82 },
    { n: "Mikel Oyarzabal", p: "FWD", r: 82 }
  ]);
  add("Portugal", "🇵🇹", "2026", [
    { n: "Diogo Costa", p: "GK", r: 84 }, { n: "José Sá", p: "GK", r: 79 },
    { n: "Rúben Dias", p: "DEF", r: 86 }, { n: "Gonçalo Inácio", p: "DEF", r: 82 }, { n: "Nuno Mendes", p: "DEF", r: 84 },
    { n: "João Cancelo", p: "DEF", r: 84 }, { n: "António Silva", p: "DEF", r: 80 }, { n: "Diogo Dalot", p: "DEF", r: 82 },
    { n: "Bruno Fernandes", p: "MID", r: 86 }, { n: "Vitinha", p: "MID", r: 85 }, { n: "João Neves", p: "MID", r: 83 },
    { n: "Bernardo Silva", p: "MID", r: 87 }, { n: "Rúben Neves", p: "MID", r: 82 },
    { n: "Cristiano Ronaldo", p: "FWD", r: 85 }, { n: "Rafael Leão", p: "FWD", r: 85 }, { n: "Gonçalo Ramos", p: "FWD", r: 82 },
    { n: "Diogo Jota", p: "FWD", r: 84 }, { n: "Pedro Neto", p: "FWD", r: 82 }
  ]);
  add("Netherlands", "🇳🇱", "2026", [
    { n: "Bart Verbruggen", p: "GK", r: 81 }, { n: "Mark Flekken", p: "GK", r: 78 },
    { n: "Denzel Dumfries", p: "DEF", r: 82 }, { n: "Virgil van Dijk", p: "DEF", r: 87 }, { n: "Nathan Aké", p: "DEF", r: 83 },
    { n: "Micky van de Ven", p: "DEF", r: 82 }, { n: "Matthijs de Ligt", p: "DEF", r: 84 }, { n: "Lutsharel Geertruida", p: "DEF", r: 80 },
    { n: "Frenkie de Jong", p: "MID", r: 86 }, { n: "Tijjani Reijnders", p: "MID", r: 83 }, { n: "Ryan Gravenberch", p: "MID", r: 83 },
    { n: "Xavi Simons", p: "MID", r: 84 },
    { n: "Memphis Depay", p: "FWD", r: 83 }, { n: "Cody Gakpo", p: "FWD", r: 84 }, { n: "Donyell Malen", p: "FWD", r: 81 },
    { n: "Wout Weghorst", p: "FWD", r: 79 }
  ]);
  add("Germany", "🇩🇪", "2026", [
    { n: "Marc-André ter Stegen", p: "GK", r: 86 }, { n: "Oliver Baumann", p: "GK", r: 78 },
    { n: "Joshua Kimmich", p: "DEF", r: 87 }, { n: "Antonio Rüdiger", p: "DEF", r: 86 }, { n: "Jonathan Tah", p: "DEF", r: 83 },
    { n: "Nico Schlotterbeck", p: "DEF", r: 82 }, { n: "David Raum", p: "DEF", r: 80 }, { n: "Waldemar Anton", p: "DEF", r: 79 },
    { n: "İlkay Gündoğan", p: "MID", r: 84 }, { n: "Robert Andrich", p: "MID", r: 80 }, { n: "Pascal Groß", p: "MID", r: 80 },
    { n: "Florian Wirtz", p: "MID", r: 87 }, { n: "Jamal Musiala", p: "MID", r: 88 },
    { n: "Kai Havertz", p: "FWD", r: 84 }, { n: "Leroy Sané", p: "FWD", r: 84 }, { n: "Serge Gnabry", p: "FWD", r: 83 },
    { n: "Niclas Füllkrug", p: "FWD", r: 81 }
  ]);
  add("Belgium", "🇧🇪", "2026", [
    { n: "Thibaut Courtois", p: "GK", r: 88 }, { n: "Koen Casteels", p: "GK", r: 80 },
    { n: "Timothy Castagne", p: "DEF", r: 80 }, { n: "Wout Faes", p: "DEF", r: 80 }, { n: "Zeno Debast", p: "DEF", r: 79 },
    { n: "Arthur Theate", p: "DEF", r: 80 }, { n: "Maxim De Cuyper", p: "DEF", r: 78 },
    { n: "Youri Tielemans", p: "MID", r: 83 }, { n: "Amadou Onana", p: "MID", r: 82 }, { n: "Kevin De Bruyne", p: "MID", r: 88 },
    { n: "Orel Mangala", p: "MID", r: 79 },
    { n: "Jérémy Doku", p: "FWD", r: 84 }, { n: "Romelu Lukaku", p: "FWD", r: 84 }, { n: "Leandro Trossard", p: "FWD", r: 82 },
    { n: "Charles De Ketelaere", p: "FWD", r: 81 }, { n: "Dodi Lukébakio", p: "FWD", r: 80 }
  ]);
  add("Croatia", "🇭🇷", "2026", [
    { n: "Dominik Livaković", p: "GK", r: 81 }, { n: "Ivica Ivušić", p: "GK", r: 77 },
    { n: "Josip Stanišić", p: "DEF", r: 80 }, { n: "Joško Gvardiol", p: "DEF", r: 85 }, { n: "Josip Šutalo", p: "DEF", r: 80 },
    { n: "Borna Sosa", p: "DEF", r: 79 }, { n: "Marin Pongračić", p: "DEF", r: 79 },
    { n: "Luka Modrić", p: "MID", r: 84 }, { n: "Mateo Kovačić", p: "MID", r: 84 }, { n: "Marcelo Brozović", p: "MID", r: 82 },
    { n: "Luka Sučić", p: "MID", r: 80 }, { n: "Lovro Majer", p: "MID", r: 81 },
    { n: "Andrej Kramarić", p: "FWD", r: 81 }, { n: "Ante Budimir", p: "FWD", r: 79 }, { n: "Igor Matanović", p: "FWD", r: 78 }
  ]);
  add("Uruguay", "🇺🇾", "2026", [
    { n: "Sergio Rochet", p: "GK", r: 79 }, { n: "Santiago Mele", p: "GK", r: 76 },
    { n: "José María Giménez", p: "DEF", r: 84 }, { n: "Ronald Araújo", p: "DEF", r: 85 }, { n: "Mathías Olivera", p: "DEF", r: 81 },
    { n: "Nahitan Nández", p: "DEF", r: 80 }, { n: "Sebastián Cáceres", p: "DEF", r: 79 },
    { n: "Federico Valverde", p: "MID", r: 88 }, { n: "Manuel Ugarte", p: "MID", r: 82 }, { n: "Rodrigo Bentancur", p: "MID", r: 83 },
    { n: "Nicolás de la Cruz", p: "MID", r: 82 },
    { n: "Darwin Núñez", p: "FWD", r: 83 }, { n: "Facundo Pellistri", p: "FWD", r: 80 }, { n: "Maxi Araújo", p: "FWD", r: 79 }
  ]);
  add("USA", "🇺🇸", "2026", [
    { n: "Matt Turner", p: "GK", r: 80 }, { n: "Patrick Schulte", p: "GK", r: 76 },
    { n: "Sergiño Dest", p: "DEF", r: 80 }, { n: "Chris Richards", p: "DEF", r: 80 }, { n: "Tim Ream", p: "DEF", r: 78 },
    { n: "Antonee Robinson", p: "DEF", r: 81 }, { n: "Cameron Carter-Vickers", p: "DEF", r: 79 },
    { n: "Tyler Adams", p: "MID", r: 81 }, { n: "Weston McKennie", p: "MID", r: 82 }, { n: "Yunus Musah", p: "MID", r: 81 },
    { n: "Gio Reyna", p: "MID", r: 82 },
    { n: "Christian Pulisic", p: "FWD", r: 85 }, { n: "Folarin Balogun", p: "FWD", r: 81 }, { n: "Tim Weah", p: "FWD", r: 80 },
    { n: "Ricardo Pepi", p: "FWD", r: 79 }
  ]);
  add("Mexico", "🇲🇽", "2026", [
    { n: "Guillermo Ochoa", p: "GK", r: 80 }, { n: "Luis Malagón", p: "GK", r: 79 },
    { n: "Jorge Sánchez", p: "DEF", r: 78 }, { n: "César Montes", p: "DEF", r: 80 }, { n: "Johan Vásquez", p: "DEF", r: 80 },
    { n: "Jesús Gallardo", p: "DEF", r: 79 }, { n: "Israel Reyes", p: "DEF", r: 78 },
    { n: "Edson Álvarez", p: "MID", r: 83 }, { n: "Luis Chávez", p: "MID", r: 80 }, { n: "Orbelín Pineda", p: "MID", r: 80 },
    { n: "Diego Lainez", p: "MID", r: 78 },
    { n: "Santiago Giménez", p: "FWD", r: 83 }, { n: "Raúl Jiménez", p: "FWD", r: 81 }, { n: "Hirving Lozano", p: "FWD", r: 82 },
    { n: "Alexis Vega", p: "FWD", r: 79 }
  ]);
  add("Morocco", "🇲🇦", "2026", [
    { n: "Yassine Bounou", p: "GK", r: 84 }, { n: "Munir Mohamedi", p: "GK", r: 78 },
    { n: "Achraf Hakimi", p: "DEF", r: 85 }, { n: "Nayef Aguerd", p: "DEF", r: 81 }, { n: "Romain Saïss", p: "DEF", r: 80 },
    { n: "Noussair Mazraoui", p: "DEF", r: 82 }, { n: "Jawad El Yamiq", p: "DEF", r: 78 },
    { n: "Sofyan Amrabat", p: "MID", r: 81 }, { n: "Azzedine Ounahi", p: "MID", r: 80 }, { n: "Bilal El Khannouss", p: "MID", r: 80 },
    { n: "Amine Adli", p: "MID", r: 79 },
    { n: "Brahim Díaz", p: "FWD", r: 83 }, { n: "Youssef En-Nesyri", p: "FWD", r: 81 }, { n: "Hakim Ziyech", p: "FWD", r: 82 },
    { n: "Sofiane Boufal", p: "FWD", r: 79 }
  ]);

  /* ===================== Legacy teams ===================== */
  add("Brazil", "🇧🇷", "1958", [
    { n: "Gilmar", p: "GK", r: 84 },
    { n: "Djalma Santos", p: "DEF", r: 85 }, { n: "Nílton Santos", p: "DEF", r: 86 }, { n: "Bellini", p: "DEF", r: 84 },
    { n: "Orlando", p: "DEF", r: 82 },
    { n: "Zito", p: "MID", r: 84 }, { n: "Didi", p: "MID", r: 89 }, { n: "Zagallo", p: "MID", r: 85 },
    { n: "Garrincha", p: "FWD", r: 93 }, { n: "Vavá", p: "FWD", r: 85 }, { n: "Pelé", p: "FWD", r: 94 }
  ]);
  add("Brazil", "🇧🇷", "1994", [
    { n: "Taffarel", p: "GK", r: 83 },
    { n: "Jorginho", p: "DEF", r: 82 }, { n: "Aldair", p: "DEF", r: 84 }, { n: "Márcio Santos", p: "DEF", r: 80 },
    { n: "Branco", p: "DEF", r: 80 }, { n: "Cafu", p: "DEF", r: 86 },
    { n: "Mauro Silva", p: "MID", r: 82 }, { n: "Dunga", p: "MID", r: 85 }, { n: "Mazinho", p: "MID", r: 80 },
    { n: "Zinho", p: "MID", r: 81 }, { n: "Raí", p: "MID", r: 82 },
    { n: "Romário", p: "FWD", r: 92 }, { n: "Bebeto", p: "FWD", r: 86 }
  ]);
  add("Germany", "🇩🇪", "1974", [
    { n: "Sepp Maier", p: "GK", r: 85 },
    { n: "Berti Vogts", p: "DEF", r: 84 }, { n: "Franz Beckenbauer", p: "DEF", r: 95 }, { n: "Hans-Georg Schwarzenbeck", p: "DEF", r: 80 },
    { n: "Paul Breitner", p: "DEF", r: 86 },
    { n: "Uli Hoeneß", p: "MID", r: 85 }, { n: "Wolfgang Overath", p: "MID", r: 84 }, { n: "Rainer Bonhof", p: "MID", r: 82 },
    { n: "Jürgen Grabowski", p: "MID", r: 82 },
    { n: "Gerd Müller", p: "FWD", r: 93 }, { n: "Bernd Hölzenbein", p: "FWD", r: 81 }
  ]);
  add("Netherlands", "🇳🇱", "1978", [
    { n: "Piet Schrijvers", p: "GK", r: 78 },
    { n: "Ernie Brandts", p: "DEF", r: 79 }, { n: "Ruud Krol", p: "DEF", r: 86 }, { n: "Wim Suurbier", p: "DEF", r: 81 },
    { n: "Jan Poortvliet", p: "DEF", r: 78 },
    { n: "Arie Haan", p: "MID", r: 85 }, { n: "Wim Jansen", p: "MID", r: 82 }, { n: "Johan Neeskens", p: "MID", r: 88 },
    { n: "Willy van de Kerkhof", p: "MID", r: 81 },
    { n: "Rob Rensenbrink", p: "FWD", r: 87 }, { n: "Johnny Rep", p: "FWD", r: 84 }, { n: "René van de Kerkhof", p: "FWD", r: 81 }
  ]);
  add("France", "🇫🇷", "1986", [
    { n: "Joël Bats", p: "GK", r: 80 },
    { n: "Maxime Bossis", p: "DEF", r: 82 }, { n: "Patrick Battiston", p: "DEF", r: 81 }, { n: "Manuel Amoros", p: "DEF", r: 82 },
    { n: "William Ayache", p: "DEF", r: 78 },
    { n: "Luis Fernández", p: "MID", r: 83 }, { n: "Alain Giresse", p: "MID", r: 85 }, { n: "Jean Tigana", p: "MID", r: 85 },
    { n: "Michel Platini", p: "MID", r: 92 },
    { n: "Dominique Rocheteau", p: "FWD", r: 83 }, { n: "Jean-Pierre Papin", p: "FWD", r: 84 }, { n: "Yannick Stopyra", p: "FWD", r: 80 }
  ]);
  add("Argentina", "🇦🇷", "1990", [
    { n: "Sergio Goycochea", p: "GK", r: 83 },
    { n: "Oscar Ruggeri", p: "DEF", r: 84 }, { n: "Juan Simón", p: "DEF", r: 79 }, { n: "Roberto Sensini", p: "DEF", r: 80 },
    { n: "Julio Olarticoechea", p: "DEF", r: 79 },
    { n: "José Basualdo", p: "MID", r: 80 }, { n: "Jorge Burruchaga", p: "MID", r: 84 }, { n: "Pedro Troglio", p: "MID", r: 78 },
    { n: "Diego Maradona", p: "FWD", r: 95 }, { n: "Claudio Caniggia", p: "FWD", r: 85 }, { n: "Gustavo Dezotti", p: "FWD", r: 78 }
  ]);
})();
