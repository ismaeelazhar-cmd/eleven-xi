/* Draftable World Cup squads.
 * COUNTRY -> { flag, years: { YEAR: [ {n: name, p: GK|DEF|MID|FWD} ] } }
 * Squads are real tournament rosters (full where confidently known, strong core otherwise).
 * Easy to extend: add another YEAR array, or another COUNTRY block.
 */
window.WORLD_CUP_DATA = {
  "Brazil": {
    flag: "🇧🇷",
    years: {
      "1970": [
        { n: "Félix", p: "GK" }, { n: "Ado", p: "GK" },
        { n: "Carlos Alberto", p: "DEF" }, { n: "Brito", p: "DEF" }, { n: "Piazza", p: "DEF" },
        { n: "Everaldo", p: "DEF" }, { n: "Marco Antônio", p: "DEF" }, { n: "Fontana", p: "DEF" },
        { n: "Clodoaldo", p: "MID" }, { n: "Gérson", p: "MID" }, { n: "Rivelino", p: "MID" },
        { n: "Paulo Cézar", p: "MID" }, { n: "Edu", p: "MID" },
        { n: "Jairzinho", p: "FWD" }, { n: "Tostão", p: "FWD" }, { n: "Pelé", p: "FWD" },
        { n: "Roberto", p: "FWD" }
      ],
      "1982": [
        { n: "Waldir Peres", p: "GK" }, { n: "Paulo Sérgio", p: "GK" },
        { n: "Leandro", p: "DEF" }, { n: "Oscar", p: "DEF" }, { n: "Luizinho", p: "DEF" },
        { n: "Júnior", p: "DEF" }, { n: "Edinho", p: "DEF" },
        { n: "Cerezo", p: "MID" }, { n: "Falcão", p: "MID" }, { n: "Sócrates", p: "MID" },
        { n: "Zico", p: "MID" }, { n: "Dirceu", p: "MID" },
        { n: "Éder", p: "FWD" }, { n: "Serginho", p: "FWD" }, { n: "Careca", p: "FWD" }
      ],
      "1998": [
        { n: "Taffarel", p: "GK" }, { n: "Dida", p: "GK" }, { n: "Carlos Germano", p: "GK" },
        { n: "Cafu", p: "DEF" }, { n: "Roberto Carlos", p: "DEF" }, { n: "Aldair", p: "DEF" },
        { n: "Júnior Baiano", p: "DEF" }, { n: "Gonçalves", p: "DEF" }, { n: "Zé Carlos", p: "DEF" },
        { n: "Ze Roberto", p: "MID" }, { n: "Dunga", p: "MID" }, { n: "César Sampaio", p: "MID" },
        { n: "Leonardo", p: "MID" }, { n: "Rivaldo", p: "MID" }, { n: "Doriva", p: "MID" },
        { n: "Emerson", p: "MID" },
        { n: "Ronaldo", p: "FWD" }, { n: "Bebeto", p: "FWD" }, { n: "Denílson", p: "FWD" },
        { n: "Edmundo", p: "FWD" }
      ],
      "2002": [
        { n: "Marcos", p: "GK" }, { n: "Dida", p: "GK" }, { n: "Rogério Ceni", p: "GK" },
        { n: "Cafu", p: "DEF" }, { n: "Roberto Carlos", p: "DEF" }, { n: "Lúcio", p: "DEF" },
        { n: "Roque Júnior", p: "DEF" }, { n: "Edmílson", p: "DEF" }, { n: "Anderson Polga", p: "DEF" },
        { n: "Júnior", p: "DEF" }, { n: "Belletti", p: "DEF" },
        { n: "Gilberto Silva", p: "MID" }, { n: "Kléberson", p: "MID" }, { n: "Juninho Paulista", p: "MID" },
        { n: "Ricardinho", p: "MID" }, { n: "Vampeta", p: "MID" }, { n: "Ronaldinho", p: "MID" },
        { n: "Ronaldo", p: "FWD" }, { n: "Rivaldo", p: "FWD" }, { n: "Edílson", p: "FWD" },
        { n: "Luizão", p: "FWD" }, { n: "Denílson", p: "FWD" }
      ],
      "2014": [
        { n: "Júlio César", p: "GK" }, { n: "Jefferson", p: "GK" }, { n: "Victor", p: "GK" },
        { n: "Dani Alves", p: "DEF" }, { n: "Marcelo", p: "DEF" }, { n: "Thiago Silva", p: "DEF" },
        { n: "David Luiz", p: "DEF" }, { n: "Dante", p: "DEF" }, { n: "Maicon", p: "DEF" },
        { n: "Maxwell", p: "DEF" },
        { n: "Luiz Gustavo", p: "MID" }, { n: "Fernandinho", p: "MID" }, { n: "Paulinho", p: "MID" },
        { n: "Oscar", p: "MID" }, { n: "Ramires", p: "MID" }, { n: "Hernanes", p: "MID" },
        { n: "Willian", p: "MID" },
        { n: "Neymar", p: "FWD" }, { n: "Hulk", p: "FWD" }, { n: "Fred", p: "FWD" },
        { n: "Jô", p: "FWD" }, { n: "Bernard", p: "FWD" }
      ]
    }
  },
  "Argentina": {
    flag: "🇦🇷",
    years: {
      "1978": [
        { n: "Ubaldo Fillol", p: "GK" }, { n: "Héctor Baley", p: "GK" },
        { n: "Daniel Passarella", p: "DEF" }, { n: "Alberto Tarantini", p: "DEF" },
        { n: "Luis Galván", p: "DEF" }, { n: "Jorge Olguín", p: "DEF" }, { n: "Miguel Oviedo", p: "DEF" },
        { n: "Américo Gallego", p: "MID" }, { n: "Osvaldo Ardiles", p: "MID" }, { n: "Daniel Valencia", p: "MID" },
        { n: "Rubén Galván", p: "MID" }, { n: "Omar Larrosa", p: "MID" },
        { n: "Mario Kempes", p: "FWD" }, { n: "Leopoldo Luque", p: "FWD" }, { n: "Daniel Bertoni", p: "FWD" },
        { n: "René Houseman", p: "FWD" }, { n: "Oscar Ortiz", p: "FWD" }
      ],
      "1986": [
        { n: "Nery Pumpido", p: "GK" }, { n: "Luis Islas", p: "GK" },
        { n: "José Luis Cuciuffo", p: "DEF" }, { n: "Oscar Ruggeri", p: "DEF" }, { n: "José Luis Brown", p: "DEF" },
        { n: "Julio Olarticoechea", p: "DEF" }, { n: "Néstor Clausen", p: "DEF" }, { n: "Oscar Garré", p: "DEF" },
        { n: "Sergio Batista", p: "MID" }, { n: "Ricardo Giusti", p: "MID" }, { n: "Héctor Enrique", p: "MID" },
        { n: "Jorge Burruchaga", p: "MID" }, { n: "Julio Olarticoechea", p: "MID" }, { n: "Carlos Tapia", p: "MID" },
        { n: "Diego Maradona", p: "FWD" }, { n: "Jorge Valdano", p: "FWD" }, { n: "Pedro Pasculli", p: "FWD" },
        { n: "Jorge Luis Burruchaga", p: "FWD" }
      ],
      "2014": [
        { n: "Sergio Romero", p: "GK" }, { n: "Mariano Andújar", p: "GK" }, { n: "Agustín Orion", p: "GK" },
        { n: "Pablo Zabaleta", p: "DEF" }, { n: "Marcos Rojo", p: "DEF" }, { n: "Ezequiel Garay", p: "DEF" },
        { n: "Federico Fernández", p: "DEF" }, { n: "Martín Demichelis", p: "DEF" }, { n: "Hugo Campagnaro", p: "DEF" },
        { n: "José Basanta", p: "DEF" },
        { n: "Javier Mascherano", p: "MID" }, { n: "Lucas Biglia", p: "MID" }, { n: "Fernando Gago", p: "MID" },
        { n: "Ángel Di María", p: "MID" }, { n: "Maxi Rodríguez", p: "MID" }, { n: "Enzo Pérez", p: "MID" },
        { n: "Lionel Messi", p: "FWD" }, { n: "Gonzalo Higuaín", p: "FWD" }, { n: "Sergio Agüero", p: "FWD" },
        { n: "Ezequiel Lavezzi", p: "FWD" }, { n: "Rodrigo Palacio", p: "FWD" }
      ],
      "2022": [
        { n: "Emiliano Martínez", p: "GK" }, { n: "Franco Armani", p: "GK" }, { n: "Gerónimo Rulli", p: "GK" },
        { n: "Nahuel Molina", p: "DEF" }, { n: "Cristian Romero", p: "DEF" }, { n: "Nicolás Otamendi", p: "DEF" },
        { n: "Nicolás Tagliafico", p: "DEF" }, { n: "Marcos Acuña", p: "DEF" }, { n: "Gonzalo Montiel", p: "DEF" },
        { n: "Germán Pezzella", p: "DEF" }, { n: "Lisandro Martínez", p: "DEF" },
        { n: "Rodrigo De Paul", p: "MID" }, { n: "Enzo Fernández", p: "MID" }, { n: "Alexis Mac Allister", p: "MID" },
        { n: "Leandro Paredes", p: "MID" }, { n: "Guido Rodríguez", p: "MID" }, { n: "Alejandro Gómez", p: "MID" },
        { n: "Lionel Messi", p: "FWD" }, { n: "Julián Álvarez", p: "FWD" }, { n: "Ángel Di María", p: "FWD" },
        { n: "Lautaro Martínez", p: "FWD" }, { n: "Nicolás González", p: "FWD" }, { n: "Paulo Dybala", p: "FWD" }
      ]
    }
  },
  "France": {
    flag: "🇫🇷",
    years: {
      "1998": [
        { n: "Fabien Barthez", p: "GK" }, { n: "Bernard Lama", p: "GK" }, { n: "Lionel Charbonnier", p: "GK" },
        { n: "Lilian Thuram", p: "DEF" }, { n: "Marcel Desailly", p: "DEF" }, { n: "Laurent Blanc", p: "DEF" },
        { n: "Bixente Lizarazu", p: "DEF" }, { n: "Vincent Candela", p: "DEF" }, { n: "Frank Lebœuf", p: "DEF" },
        { n: "Didier Deschamps", p: "MID" }, { n: "Emmanuel Petit", p: "MID" }, { n: "Patrick Vieira", p: "MID" },
        { n: "Zinedine Zidane", p: "MID" }, { n: "Youri Djorkaeff", p: "MID" }, { n: "Christian Karembeu", p: "MID" },
        { n: "Alain Boghossian", p: "MID" }, { n: "Robert Pirès", p: "MID" }, { n: "Bernard Diomède", p: "MID" },
        { n: "Thierry Henry", p: "FWD" }, { n: "David Trezeguet", p: "FWD" }, { n: "Stéphane Guivarc'h", p: "FWD" },
        { n: "Christophe Dugarry", p: "FWD" }
      ],
      "2006": [
        { n: "Fabien Barthez", p: "GK" }, { n: "Grégory Coupet", p: "GK" }, { n: "Mickaël Landreau", p: "GK" },
        { n: "Lilian Thuram", p: "DEF" }, { n: "William Gallas", p: "DEF" }, { n: "Willy Sagnol", p: "DEF" },
        { n: "Éric Abidal", p: "DEF" }, { n: "Jean-Alain Boumsong", p: "DEF" }, { n: "Mikaël Silvestre", p: "DEF" },
        { n: "Patrick Vieira", p: "MID" }, { n: "Claude Makélélé", p: "MID" }, { n: "Zinedine Zidane", p: "MID" },
        { n: "Florent Malouda", p: "MID" }, { n: "Franck Ribéry", p: "MID" }, { n: "Alou Diarra", p: "MID" },
        { n: "Vikash Dhorasoo", p: "MID" },
        { n: "Thierry Henry", p: "FWD" }, { n: "David Trezeguet", p: "FWD" }, { n: "Sylvain Wiltord", p: "FWD" },
        { n: "Louis Saha", p: "FWD" }
      ],
      "2018": [
        { n: "Hugo Lloris", p: "GK" }, { n: "Steve Mandanda", p: "GK" }, { n: "Alphonse Areola", p: "GK" },
        { n: "Benjamin Pavard", p: "DEF" }, { n: "Raphaël Varane", p: "DEF" }, { n: "Samuel Umtiti", p: "DEF" },
        { n: "Lucas Hernández", p: "DEF" }, { n: "Presnel Kimpembe", p: "DEF" }, { n: "Djibril Sidibé", p: "DEF" },
        { n: "Benjamin Mendy", p: "DEF" }, { n: "Adil Rami", p: "DEF" },
        { n: "N'Golo Kanté", p: "MID" }, { n: "Paul Pogba", p: "MID" }, { n: "Blaise Matuidi", p: "MID" },
        { n: "Corentin Tolisso", p: "MID" }, { n: "Steven N'Zonzi", p: "MID" },
        { n: "Antoine Griezmann", p: "FWD" }, { n: "Kylian Mbappé", p: "FWD" }, { n: "Olivier Giroud", p: "FWD" },
        { n: "Ousmane Dembélé", p: "FWD" }, { n: "Thomas Lemar", p: "FWD" }, { n: "Nabil Fekir", p: "FWD" },
        { n: "Florian Thauvin", p: "FWD" }
      ],
      "2022": [
        { n: "Hugo Lloris", p: "GK" }, { n: "Steve Mandanda", p: "GK" }, { n: "Alphonse Areola", p: "GK" },
        { n: "Jules Koundé", p: "DEF" }, { n: "Raphaël Varane", p: "DEF" }, { n: "Dayot Upamecano", p: "DEF" },
        { n: "Theo Hernández", p: "DEF" }, { n: "Ibrahima Konaté", p: "DEF" }, { n: "Benjamin Pavard", p: "DEF" },
        { n: "Lucas Hernández", p: "DEF" },
        { n: "Aurélien Tchouaméni", p: "MID" }, { n: "Adrien Rabiot", p: "MID" }, { n: "Youssouf Fofana", p: "MID" },
        { n: "Eduardo Camavinga", p: "MID" },
        { n: "Antoine Griezmann", p: "FWD" }, { n: "Kylian Mbappé", p: "FWD" }, { n: "Olivier Giroud", p: "FWD" },
        { n: "Ousmane Dembélé", p: "FWD" }, { n: "Marcus Thuram", p: "FWD" }, { n: "Randal Kolo Muani", p: "FWD" },
        { n: "Kingsley Coman", p: "FWD" }
      ]
    }
  },
  "Germany": {
    flag: "🇩🇪",
    years: {
      "1990": [
        { n: "Bodo Illgner", p: "GK" }, { n: "Raimond Aumann", p: "GK" },
        { n: "Andreas Brehme", p: "DEF" }, { n: "Klaus Augenthaler", p: "DEF" }, { n: "Guido Buchwald", p: "DEF" },
        { n: "Jürgen Kohler", p: "DEF" }, { n: "Thomas Berthold", p: "DEF" }, { n: "Stefan Reuter", p: "DEF" },
        { n: "Lothar Matthäus", p: "MID" }, { n: "Olaf Thon", p: "MID" }, { n: "Pierre Littbarski", p: "MID" },
        { n: "Thomas Häßler", p: "MID" }, { n: "Uwe Bein", p: "MID" },
        { n: "Jürgen Klinsmann", p: "FWD" }, { n: "Rudi Völler", p: "FWD" }, { n: "Karl-Heinz Riedle", p: "FWD" }
      ],
      "2002": [
        { n: "Oliver Kahn", p: "GK" }, { n: "Jens Lehmann", p: "GK" },
        { n: "Christoph Metzelder", p: "DEF" }, { n: "Thomas Linke", p: "DEF" }, { n: "Carsten Ramelow", p: "DEF" },
        { n: "Marko Rehmer", p: "DEF" }, { n: "Frank Baumann", p: "DEF" },
        { n: "Michael Ballack", p: "MID" }, { n: "Dietmar Hamann", p: "MID" }, { n: "Bernd Schneider", p: "MID" },
        { n: "Jens Jeremies", p: "MID" }, { n: "Torsten Frings", p: "MID" }, { n: "Sebastian Kehl", p: "MID" },
        { n: "Miroslav Klose", p: "FWD" }, { n: "Oliver Neuville", p: "FWD" }, { n: "Carsten Jancker", p: "FWD" },
        { n: "Marco Bode", p: "FWD" }
      ],
      "2014": [
        { n: "Manuel Neuer", p: "GK" }, { n: "Roman Weidenfeller", p: "GK" }, { n: "Ron-Robert Zieler", p: "GK" },
        { n: "Philipp Lahm", p: "DEF" }, { n: "Jérôme Boateng", p: "DEF" }, { n: "Mats Hummels", p: "DEF" },
        { n: "Benedikt Höwedes", p: "DEF" }, { n: "Per Mertesacker", p: "DEF" }, { n: "Shkodran Mustafi", p: "DEF" },
        { n: "Erik Durm", p: "DEF" },
        { n: "Bastian Schweinsteiger", p: "MID" }, { n: "Toni Kroos", p: "MID" }, { n: "Sami Khedira", p: "MID" },
        { n: "Mesut Özil", p: "MID" }, { n: "Christoph Kramer", p: "MID" }, { n: "Julian Draxler", p: "MID" },
        { n: "André Schürrle", p: "MID" },
        { n: "Thomas Müller", p: "FWD" }, { n: "Mario Götze", p: "FWD" }, { n: "Miroslav Klose", p: "FWD" },
        { n: "Lukas Podolski", p: "FWD" }
      ]
    }
  },
  "Italy": {
    flag: "🇮🇹",
    years: {
      "1982": [
        { n: "Dino Zoff", p: "GK" }, { n: "Ivano Bordon", p: "GK" },
        { n: "Claudio Gentile", p: "DEF" }, { n: "Gaetano Scirea", p: "DEF" }, { n: "Antonio Cabrini", p: "DEF" },
        { n: "Fulvio Collovati", p: "DEF" }, { n: "Giuseppe Bergomi", p: "DEF" }, { n: "Pietro Vierchowod", p: "DEF" },
        { n: "Gabriele Oriali", p: "MID" }, { n: "Marco Tardelli", p: "MID" }, { n: "Giancarlo Antognoni", p: "MID" },
        { n: "Bruno Conti", p: "MID" }, { n: "Giampiero Marini", p: "MID" },
        { n: "Paolo Rossi", p: "FWD" }, { n: "Francesco Graziani", p: "FWD" }, { n: "Alessandro Altobelli", p: "FWD" }
      ],
      "2006": [
        { n: "Gianluigi Buffon", p: "GK" }, { n: "Angelo Peruzzi", p: "GK" }, { n: "Marco Amelia", p: "GK" },
        { n: "Fabio Cannavaro", p: "DEF" }, { n: "Marco Materazzi", p: "DEF" }, { n: "Gianluca Zambrotta", p: "DEF" },
        { n: "Fabio Grosso", p: "DEF" }, { n: "Alessandro Nesta", p: "DEF" }, { n: "Gianluca Zaccardo", p: "DEF" },
        { n: "Massimo Oddo", p: "DEF" },
        { n: "Andrea Pirlo", p: "MID" }, { n: "Gennaro Gattuso", p: "MID" }, { n: "Daniele De Rossi", p: "MID" },
        { n: "Mauro Camoranesi", p: "MID" }, { n: "Simone Perrotta", p: "MID" }, { n: "Massimo Ambrosini", p: "MID" },
        { n: "Francesco Totti", p: "FWD" }, { n: "Luca Toni", p: "FWD" }, { n: "Alessandro Del Piero", p: "FWD" },
        { n: "Alberto Gilardino", p: "FWD" }, { n: "Vincenzo Iaquinta", p: "FWD" }, { n: "Filippo Inzaghi", p: "FWD" }
      ]
    }
  },
  "England": {
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    years: {
      "1966": [
        { n: "Gordon Banks", p: "GK" }, { n: "Ron Springett", p: "GK" },
        { n: "George Cohen", p: "DEF" }, { n: "Ray Wilson", p: "DEF" }, { n: "Jack Charlton", p: "DEF" },
        { n: "Bobby Moore", p: "DEF" }, { n: "George Eastham", p: "DEF" },
        { n: "Nobby Stiles", p: "MID" }, { n: "Alan Ball", p: "MID" }, { n: "Bobby Charlton", p: "MID" },
        { n: "Martin Peters", p: "MID" },
        { n: "Roger Hunt", p: "FWD" }, { n: "Geoff Hurst", p: "FWD" }, { n: "Jimmy Greaves", p: "FWD" },
        { n: "Ian Callaghan", p: "FWD" }
      ],
      "1990": [
        { n: "Peter Shilton", p: "GK" }, { n: "Chris Woods", p: "GK" },
        { n: "Stuart Pearce", p: "DEF" }, { n: "Des Walker", p: "DEF" }, { n: "Terry Butcher", p: "DEF" },
        { n: "Mark Wright", p: "DEF" }, { n: "Paul Parker", p: "DEF" }, { n: "Gary Stevens", p: "DEF" },
        { n: "Paul Gascoigne", p: "MID" }, { n: "David Platt", p: "MID" }, { n: "Chris Waddle", p: "MID" },
        { n: "John Barnes", p: "MID" }, { n: "Trevor Steven", p: "MID" }, { n: "Steve McMahon", p: "MID" },
        { n: "Gary Lineker", p: "FWD" }, { n: "Peter Beardsley", p: "FWD" }, { n: "Steve Bull", p: "FWD" }
      ],
      "2018": [
        { n: "Jordan Pickford", p: "GK" }, { n: "Jack Butland", p: "GK" }, { n: "Nick Pope", p: "GK" },
        { n: "Kyle Walker", p: "DEF" }, { n: "John Stones", p: "DEF" }, { n: "Harry Maguire", p: "DEF" },
        { n: "Kieran Trippier", p: "DEF" }, { n: "Ashley Young", p: "DEF" }, { n: "Danny Rose", p: "DEF" },
        { n: "Gary Cahill", p: "DEF" }, { n: "Phil Jones", p: "DEF" },
        { n: "Jordan Henderson", p: "MID" }, { n: "Dele Alli", p: "MID" }, { n: "Jesse Lingard", p: "MID" },
        { n: "Eric Dier", p: "MID" }, { n: "Ruben Loftus-Cheek", p: "MID" },
        { n: "Harry Kane", p: "FWD" }, { n: "Raheem Sterling", p: "FWD" }, { n: "Marcus Rashford", p: "FWD" },
        { n: "Jamie Vardy", p: "FWD" }, { n: "Danny Welbeck", p: "FWD" }
      ]
    }
  },
  "Netherlands": {
    flag: "🇳🇱",
    years: {
      "1974": [
        { n: "Jan Jongbloed", p: "GK" }, { n: "Piet Schrijvers", p: "GK" },
        { n: "Wim Suurbier", p: "DEF" }, { n: "Wim Rijsbergen", p: "DEF" }, { n: "Ruud Krol", p: "DEF" },
        { n: "Arie Haan", p: "DEF" }, { n: "Theo de Jong", p: "DEF" },
        { n: "Wim Jansen", p: "MID" }, { n: "Johan Neeskens", p: "MID" }, { n: "Wim van Hanegem", p: "MID" },
        { n: "René van de Kerkhof", p: "MID" }, { n: "Willy van de Kerkhof", p: "MID" },
        { n: "Johnny Rep", p: "FWD" }, { n: "Johan Cruyff", p: "FWD" }, { n: "Rob Rensenbrink", p: "FWD" }
      ],
      "2010": [
        { n: "Maarten Stekelenburg", p: "GK" }, { n: "Michel Vorm", p: "GK" }, { n: "Sander Boschker", p: "GK" },
        { n: "Gregory van der Wiel", p: "DEF" }, { n: "John Heitinga", p: "DEF" }, { n: "Joris Mathijsen", p: "DEF" },
        { n: "Giovanni van Bronckhorst", p: "DEF" }, { n: "Khalid Boulahrouz", p: "DEF" }, { n: "André Ooijer", p: "DEF" },
        { n: "Mark van Bommel", p: "MID" }, { n: "Nigel de Jong", p: "MID" }, { n: "Wesley Sneijder", p: "MID" },
        { n: "Rafael van der Vaart", p: "MID" }, { n: "Demy de Zeeuw", p: "MID" },
        { n: "Dirk Kuyt", p: "FWD" }, { n: "Arjen Robben", p: "FWD" }, { n: "Robin van Persie", p: "FWD" },
        { n: "Eljero Elia", p: "FWD" }, { n: "Ryan Babel", p: "FWD" }, { n: "Klaas-Jan Huntelaar", p: "FWD" }
      ]
    }
  },
  "Spain": {
    flag: "🇪🇸",
    years: {
      "2010": [
        { n: "Iker Casillas", p: "GK" }, { n: "Pepe Reina", p: "GK" }, { n: "Víctor Valdés", p: "GK" },
        { n: "Sergio Ramos", p: "DEF" }, { n: "Gerard Piqué", p: "DEF" }, { n: "Carles Puyol", p: "DEF" },
        { n: "Joan Capdevila", p: "DEF" }, { n: "Carlos Marchena", p: "DEF" }, { n: "Raúl Albiol", p: "DEF" },
        { n: "Álvaro Arbeloa", p: "DEF" },
        { n: "Sergio Busquets", p: "MID" }, { n: "Xabi Alonso", p: "MID" }, { n: "Xavi", p: "MID" },
        { n: "Andrés Iniesta", p: "MID" }, { n: "David Silva", p: "MID" }, { n: "Cesc Fàbregas", p: "MID" },
        { n: "Javi Martínez", p: "MID" },
        { n: "Pedro", p: "FWD" }, { n: "David Villa", p: "FWD" }, { n: "Fernando Torres", p: "FWD" },
        { n: "Fernando Llorente", p: "FWD" }, { n: "Jesús Navas", p: "FWD" }
      ]
    }
  },
  "Portugal": {
    flag: "🇵🇹",
    years: {
      "2006": [
        { n: "Ricardo", p: "GK" }, { n: "Quim", p: "GK" }, { n: "Paulo Santos", p: "GK" },
        { n: "Miguel", p: "DEF" }, { n: "Ricardo Carvalho", p: "DEF" }, { n: "Fernando Meira", p: "DEF" },
        { n: "Nuno Valente", p: "DEF" }, { n: "Paulo Ferreira", p: "DEF" }, { n: "Ricardo Costa", p: "DEF" },
        { n: "Maniche", p: "MID" }, { n: "Costinha", p: "MID" }, { n: "Deco", p: "MID" },
        { n: "Luís Figo", p: "MID" }, { n: "Petit", p: "MID" }, { n: "Tiago", p: "MID" },
        { n: "Armando Petit", p: "MID" },
        { n: "Cristiano Ronaldo", p: "FWD" }, { n: "Pauleta", p: "FWD" }, { n: "Nuno Gomes", p: "FWD" },
        { n: "Simão Sabrosa", p: "FWD" }, { n: "Hélder Postiga", p: "FWD" }
      ]
    }
  },
  "Uruguay": {
    flag: "🇺🇾",
    years: {
      "2010": [
        { n: "Fernando Muslera", p: "GK" }, { n: "Juan Castillo", p: "GK" }, { n: "Martín Silva", p: "GK" },
        { n: "Diego Lugano", p: "DEF" }, { n: "Diego Godín", p: "DEF" }, { n: "Maxi Pereira", p: "DEF" },
        { n: "Álvaro Pereira", p: "DEF" }, { n: "Mauricio Victorino", p: "DEF" }, { n: "Jorge Fucile", p: "DEF" },
        { n: "Egidio Arévalo Ríos", p: "MID" }, { n: "Diego Pérez", p: "MID" }, { n: "Walter Gargano", p: "MID" },
        { n: "Álvaro Fernández", p: "MID" }, { n: "Ignacio González", p: "MID" }, { n: "Nicolás Lodeiro", p: "MID" },
        { n: "Diego Forlán", p: "FWD" }, { n: "Luis Suárez", p: "FWD" }, { n: "Edinson Cavani", p: "FWD" },
        { n: "Sebastián Abreu", p: "FWD" }
      ]
    }
  },
  "Croatia": {
    flag: "🇭🇷",
    years: {
      "2018": [
        { n: "Danijel Subašić", p: "GK" }, { n: "Lovre Kalinić", p: "GK" }, { n: "Dominik Livaković", p: "GK" },
        { n: "Šime Vrsaljko", p: "DEF" }, { n: "Dejan Lovren", p: "DEF" }, { n: "Domagoj Vida", p: "DEF" },
        { n: "Ivan Strinić", p: "DEF" }, { n: "Vedran Ćorluka", p: "DEF" }, { n: "Josip Pivarić", p: "DEF" },
        { n: "Tin Jedvaj", p: "DEF" },
        { n: "Luka Modrić", p: "MID" }, { n: "Ivan Rakitić", p: "MID" }, { n: "Marcelo Brozović", p: "MID" },
        { n: "Mateo Kovačić", p: "MID" }, { n: "Milan Badelj", p: "MID" }, { n: "Filip Bradarić", p: "MID" },
        { n: "Ante Rebić", p: "FWD" }, { n: "Mario Mandžukić", p: "FWD" }, { n: "Ivan Perišić", p: "FWD" },
        { n: "Andrej Kramarić", p: "FWD" }, { n: "Marko Pjaca", p: "FWD" }, { n: "Nikola Kalinić", p: "FWD" }
      ]
    }
  }
};
