/* Draftable World Cup squads.
 * COUNTRY -> { flag, years: { YEAR: [ {n: name, p: GK|DEF|MID|FWD, r: rating} ] } }
 * Squads are real tournament rosters; ratings (≈74–97) are curated for gameplay.
 */
window.WORLD_CUP_DATA = {
  "Brazil": {
    flag: "🇧🇷",
    years: {
      "1970": [
        { n: "Félix", p: "GK", r: 78 }, { n: "Ado", p: "GK", r: 74 },
        { n: "Carlos Alberto", p: "DEF", r: 89 }, { n: "Brito", p: "DEF", r: 80 }, { n: "Piazza", p: "DEF", r: 82 },
        { n: "Everaldo", p: "DEF", r: 79 }, { n: "Marco Antônio", p: "DEF", r: 77 }, { n: "Fontana", p: "DEF", r: 76 },
        { n: "Clodoaldo", p: "MID", r: 84 }, { n: "Gérson", p: "MID", r: 88 }, { n: "Rivelino", p: "MID", r: 90 },
        { n: "Paulo Cézar", p: "MID", r: 81 }, { n: "Edu", p: "MID", r: 80 },
        { n: "Jairzinho", p: "FWD", r: 90 }, { n: "Tostão", p: "FWD", r: 88 }, { n: "Pelé", p: "FWD", r: 97 },
        { n: "Roberto", p: "FWD", r: 78 }
      ],
      "1982": [
        { n: "Waldir Peres", p: "GK", r: 77 }, { n: "Paulo Sérgio", p: "GK", r: 74 },
        { n: "Leandro", p: "DEF", r: 84 }, { n: "Oscar", p: "DEF", r: 83 }, { n: "Luizinho", p: "DEF", r: 80 },
        { n: "Júnior", p: "DEF", r: 85 }, { n: "Edinho", p: "DEF", r: 80 },
        { n: "Cerezo", p: "MID", r: 84 }, { n: "Falcão", p: "MID", r: 89 }, { n: "Sócrates", p: "MID", r: 91 },
        { n: "Zico", p: "MID", r: 93 }, { n: "Dirceu", p: "MID", r: 81 },
        { n: "Éder", p: "FWD", r: 85 }, { n: "Serginho", p: "FWD", r: 77 }, { n: "Careca", p: "FWD", r: 86 }
      ],
      "1998": [
        { n: "Taffarel", p: "GK", r: 83 }, { n: "Dida", p: "GK", r: 80 }, { n: "Carlos Germano", p: "GK", r: 74 },
        { n: "Cafu", p: "DEF", r: 88 }, { n: "Roberto Carlos", p: "DEF", r: 90 }, { n: "Aldair", p: "DEF", r: 84 },
        { n: "Júnior Baiano", p: "DEF", r: 79 }, { n: "Gonçalves", p: "DEF", r: 77 }, { n: "Zé Carlos", p: "DEF", r: 76 },
        { n: "Zé Roberto", p: "MID", r: 84 }, { n: "Dunga", p: "MID", r: 85 }, { n: "César Sampaio", p: "MID", r: 80 },
        { n: "Leonardo", p: "MID", r: 85 }, { n: "Rivaldo", p: "MID", r: 92 }, { n: "Doriva", p: "MID", r: 76 },
        { n: "Emerson", p: "MID", r: 82 },
        { n: "Ronaldo", p: "FWD", r: 95 }, { n: "Bebeto", p: "FWD", r: 85 }, { n: "Denílson", p: "FWD", r: 80 },
        { n: "Edmundo", p: "FWD", r: 81 }
      ],
      "2002": [
        { n: "Marcos", p: "GK", r: 83 }, { n: "Dida", p: "GK", r: 82 }, { n: "Rogério Ceni", p: "GK", r: 80 },
        { n: "Cafu", p: "DEF", r: 88 }, { n: "Roberto Carlos", p: "DEF", r: 90 }, { n: "Lúcio", p: "DEF", r: 87 },
        { n: "Roque Júnior", p: "DEF", r: 81 }, { n: "Edmílson", p: "DEF", r: 82 }, { n: "Anderson Polga", p: "DEF", r: 77 },
        { n: "Júnior", p: "DEF", r: 80 }, { n: "Belletti", p: "DEF", r: 81 },
        { n: "Gilberto Silva", p: "MID", r: 84 }, { n: "Kléberson", p: "MID", r: 80 }, { n: "Juninho Paulista", p: "MID", r: 81 },
        { n: "Ricardinho", p: "MID", r: 78 }, { n: "Vampeta", p: "MID", r: 78 }, { n: "Ronaldinho", p: "MID", r: 92 },
        { n: "Ronaldo", p: "FWD", r: 95 }, { n: "Rivaldo", p: "FWD", r: 92 }, { n: "Edílson", p: "FWD", r: 80 },
        { n: "Luizão", p: "FWD", r: 79 }, { n: "Denílson", p: "FWD", r: 80 }
      ],
      "2014": [
        { n: "Júlio César", p: "GK", r: 82 }, { n: "Jefferson", p: "GK", r: 78 }, { n: "Victor", p: "GK", r: 75 },
        { n: "Dani Alves", p: "DEF", r: 86 }, { n: "Marcelo", p: "DEF", r: 87 }, { n: "Thiago Silva", p: "DEF", r: 89 },
        { n: "David Luiz", p: "DEF", r: 84 }, { n: "Dante", p: "DEF", r: 80 }, { n: "Maicon", p: "DEF", r: 81 },
        { n: "Maxwell", p: "DEF", r: 79 },
        { n: "Luiz Gustavo", p: "MID", r: 82 }, { n: "Fernandinho", p: "MID", r: 83 }, { n: "Paulinho", p: "MID", r: 81 },
        { n: "Oscar", p: "MID", r: 83 }, { n: "Ramires", p: "MID", r: 81 }, { n: "Hernanes", p: "MID", r: 80 },
        { n: "Willian", p: "MID", r: 83 },
        { n: "Neymar", p: "FWD", r: 90 }, { n: "Hulk", p: "FWD", r: 82 }, { n: "Fred", p: "FWD", r: 79 },
        { n: "Jô", p: "FWD", r: 76 }, { n: "Bernard", p: "FWD", r: 77 }
      ]
    }
  },
  "Argentina": {
    flag: "🇦🇷",
    years: {
      "1978": [
        { n: "Ubaldo Fillol", p: "GK", r: 84 }, { n: "Héctor Baley", p: "GK", r: 74 },
        { n: "Daniel Passarella", p: "DEF", r: 88 }, { n: "Alberto Tarantini", p: "DEF", r: 80 },
        { n: "Luis Galván", p: "DEF", r: 80 }, { n: "Jorge Olguín", p: "DEF", r: 79 }, { n: "Miguel Oviedo", p: "DEF", r: 76 },
        { n: "Américo Gallego", p: "MID", r: 82 }, { n: "Osvaldo Ardiles", p: "MID", r: 86 }, { n: "Daniel Valencia", p: "MID", r: 80 },
        { n: "Rubén Galván", p: "MID", r: 78 }, { n: "Omar Larrosa", p: "MID", r: 78 },
        { n: "Mario Kempes", p: "FWD", r: 90 }, { n: "Leopoldo Luque", p: "FWD", r: 84 }, { n: "Daniel Bertoni", p: "FWD", r: 83 },
        { n: "René Houseman", p: "FWD", r: 82 }, { n: "Oscar Ortiz", p: "FWD", r: 79 }
      ],
      "1986": [
        { n: "Nery Pumpido", p: "GK", r: 82 }, { n: "Luis Islas", p: "GK", r: 76 },
        { n: "José Luis Cuciuffo", p: "DEF", r: 79 }, { n: "Oscar Ruggeri", p: "DEF", r: 85 }, { n: "José Luis Brown", p: "DEF", r: 81 },
        { n: "Julio Olarticoechea", p: "DEF", r: 80 }, { n: "Néstor Clausen", p: "DEF", r: 78 }, { n: "Oscar Garré", p: "DEF", r: 77 },
        { n: "Sergio Batista", p: "MID", r: 84 }, { n: "Ricardo Giusti", p: "MID", r: 83 }, { n: "Héctor Enrique", p: "MID", r: 82 },
        { n: "Jorge Burruchaga", p: "MID", r: 87 }, { n: "Ricardo Bochini", p: "MID", r: 82 }, { n: "Carlos Tapia", p: "MID", r: 79 },
        { n: "Diego Maradona", p: "FWD", r: 97 }, { n: "Jorge Valdano", p: "FWD", r: 86 }, { n: "Pedro Pasculli", p: "FWD", r: 80 },
        { n: "Claudio Borghi", p: "FWD", r: 80 }
      ],
      "2014": [
        { n: "Sergio Romero", p: "GK", r: 82 }, { n: "Mariano Andújar", p: "GK", r: 77 }, { n: "Agustín Orion", p: "GK", r: 75 },
        { n: "Pablo Zabaleta", p: "DEF", r: 84 }, { n: "Marcos Rojo", p: "DEF", r: 81 }, { n: "Ezequiel Garay", p: "DEF", r: 83 },
        { n: "Federico Fernández", p: "DEF", r: 81 }, { n: "Martín Demichelis", p: "DEF", r: 80 }, { n: "Hugo Campagnaro", p: "DEF", r: 78 },
        { n: "José Basanta", p: "DEF", r: 77 },
        { n: "Javier Mascherano", p: "MID", r: 87 }, { n: "Lucas Biglia", p: "MID", r: 81 }, { n: "Fernando Gago", p: "MID", r: 80 },
        { n: "Ángel Di María", p: "MID", r: 88 }, { n: "Maxi Rodríguez", p: "MID", r: 80 }, { n: "Enzo Pérez", p: "MID", r: 79 },
        { n: "Lionel Messi", p: "FWD", r: 96 }, { n: "Gonzalo Higuaín", p: "FWD", r: 85 }, { n: "Sergio Agüero", p: "FWD", r: 88 },
        { n: "Ezequiel Lavezzi", p: "FWD", r: 82 }, { n: "Rodrigo Palacio", p: "FWD", r: 80 }
      ],
      "2022": [
        { n: "Emiliano Martínez", p: "GK", r: 86 }, { n: "Franco Armani", p: "GK", r: 78 }, { n: "Gerónimo Rulli", p: "GK", r: 77 },
        { n: "Nahuel Molina", p: "DEF", r: 81 }, { n: "Cristian Romero", p: "DEF", r: 85 }, { n: "Nicolás Otamendi", p: "DEF", r: 83 },
        { n: "Nicolás Tagliafico", p: "DEF", r: 81 }, { n: "Marcos Acuña", p: "DEF", r: 82 }, { n: "Gonzalo Montiel", p: "DEF", r: 79 },
        { n: "Germán Pezzella", p: "DEF", r: 79 }, { n: "Lisandro Martínez", p: "DEF", r: 83 },
        { n: "Rodrigo De Paul", p: "MID", r: 84 }, { n: "Enzo Fernández", p: "MID", r: 84 }, { n: "Alexis Mac Allister", p: "MID", r: 84 },
        { n: "Leandro Paredes", p: "MID", r: 81 }, { n: "Guido Rodríguez", p: "MID", r: 79 }, { n: "Alejandro Gómez", p: "MID", r: 80 },
        { n: "Lionel Messi", p: "FWD", r: 95 }, { n: "Julián Álvarez", p: "FWD", r: 85 }, { n: "Ángel Di María", p: "FWD", r: 86 },
        { n: "Lautaro Martínez", p: "FWD", r: 85 }, { n: "Nicolás González", p: "FWD", r: 79 }, { n: "Paulo Dybala", p: "FWD", r: 84 }
      ]
    }
  },
  "France": {
    flag: "🇫🇷",
    years: {
      "1998": [
        { n: "Fabien Barthez", p: "GK", r: 85 }, { n: "Bernard Lama", p: "GK", r: 79 }, { n: "Lionel Charbonnier", p: "GK", r: 74 },
        { n: "Lilian Thuram", p: "DEF", r: 89 }, { n: "Marcel Desailly", p: "DEF", r: 88 }, { n: "Laurent Blanc", p: "DEF", r: 86 },
        { n: "Bixente Lizarazu", p: "DEF", r: 85 }, { n: "Vincent Candela", p: "DEF", r: 80 }, { n: "Frank Lebœuf", p: "DEF", r: 82 },
        { n: "Didier Deschamps", p: "MID", r: 85 }, { n: "Emmanuel Petit", p: "MID", r: 85 }, { n: "Patrick Vieira", p: "MID", r: 86 },
        { n: "Zinedine Zidane", p: "MID", r: 95 }, { n: "Youri Djorkaeff", p: "MID", r: 85 }, { n: "Christian Karembeu", p: "MID", r: 80 },
        { n: "Alain Boghossian", p: "MID", r: 78 }, { n: "Robert Pirès", p: "MID", r: 84 }, { n: "Bernard Diomède", p: "MID", r: 77 },
        { n: "Thierry Henry", p: "FWD", r: 86 }, { n: "David Trezeguet", p: "FWD", r: 83 }, { n: "Stéphane Guivarc'h", p: "FWD", r: 76 },
        { n: "Christophe Dugarry", p: "FWD", r: 80 }
      ],
      "2006": [
        { n: "Fabien Barthez", p: "GK", r: 82 }, { n: "Grégory Coupet", p: "GK", r: 80 }, { n: "Mickaël Landreau", p: "GK", r: 76 },
        { n: "Lilian Thuram", p: "DEF", r: 85 }, { n: "William Gallas", p: "DEF", r: 85 }, { n: "Willy Sagnol", p: "DEF", r: 82 },
        { n: "Éric Abidal", p: "DEF", r: 83 }, { n: "Jean-Alain Boumsong", p: "DEF", r: 78 }, { n: "Mikaël Silvestre", p: "DEF", r: 80 },
        { n: "Patrick Vieira", p: "MID", r: 87 }, { n: "Claude Makélélé", p: "MID", r: 85 }, { n: "Zinedine Zidane", p: "MID", r: 94 },
        { n: "Florent Malouda", p: "MID", r: 83 }, { n: "Franck Ribéry", p: "MID", r: 85 }, { n: "Alou Diarra", p: "MID", r: 79 },
        { n: "Vikash Dhorasoo", p: "MID", r: 77 },
        { n: "Thierry Henry", p: "FWD", r: 90 }, { n: "David Trezeguet", p: "FWD", r: 85 }, { n: "Sylvain Wiltord", p: "FWD", r: 80 },
        { n: "Louis Saha", p: "FWD", r: 81 }
      ],
      "2018": [
        { n: "Hugo Lloris", p: "GK", r: 86 }, { n: "Steve Mandanda", p: "GK", r: 79 }, { n: "Alphonse Areola", p: "GK", r: 77 },
        { n: "Benjamin Pavard", p: "DEF", r: 82 }, { n: "Raphaël Varane", p: "DEF", r: 87 }, { n: "Samuel Umtiti", p: "DEF", r: 84 },
        { n: "Lucas Hernández", p: "DEF", r: 84 }, { n: "Presnel Kimpembe", p: "DEF", r: 81 }, { n: "Djibril Sidibé", p: "DEF", r: 79 },
        { n: "Benjamin Mendy", p: "DEF", r: 80 }, { n: "Adil Rami", p: "DEF", r: 78 },
        { n: "N'Golo Kanté", p: "MID", r: 89 }, { n: "Paul Pogba", p: "MID", r: 87 }, { n: "Blaise Matuidi", p: "MID", r: 83 },
        { n: "Corentin Tolisso", p: "MID", r: 81 }, { n: "Steven N'Zonzi", p: "MID", r: 80 },
        { n: "Antoine Griezmann", p: "FWD", r: 89 }, { n: "Kylian Mbappé", p: "FWD", r: 91 }, { n: "Olivier Giroud", p: "FWD", r: 84 },
        { n: "Ousmane Dembélé", p: "FWD", r: 83 }, { n: "Thomas Lemar", p: "FWD", r: 81 }, { n: "Nabil Fekir", p: "FWD", r: 81 },
        { n: "Florian Thauvin", p: "FWD", r: 80 }
      ],
      "2022": [
        { n: "Hugo Lloris", p: "GK", r: 85 }, { n: "Steve Mandanda", p: "GK", r: 77 }, { n: "Alphonse Areola", p: "GK", r: 77 },
        { n: "Jules Koundé", p: "DEF", r: 84 }, { n: "Raphaël Varane", p: "DEF", r: 85 }, { n: "Dayot Upamecano", p: "DEF", r: 83 },
        { n: "Theo Hernández", p: "DEF", r: 84 }, { n: "Ibrahima Konaté", p: "DEF", r: 82 }, { n: "Benjamin Pavard", p: "DEF", r: 82 },
        { n: "Lucas Hernández", p: "DEF", r: 84 },
        { n: "Aurélien Tchouaméni", p: "MID", r: 84 }, { n: "Adrien Rabiot", p: "MID", r: 82 }, { n: "Youssouf Fofana", p: "MID", r: 79 },
        { n: "Eduardo Camavinga", p: "MID", r: 82 },
        { n: "Antoine Griezmann", p: "FWD", r: 88 }, { n: "Kylian Mbappé", p: "FWD", r: 94 }, { n: "Olivier Giroud", p: "FWD", r: 84 },
        { n: "Ousmane Dembélé", p: "FWD", r: 84 }, { n: "Marcus Thuram", p: "FWD", r: 81 }, { n: "Randal Kolo Muani", p: "FWD", r: 80 },
        { n: "Kingsley Coman", p: "FWD", r: 83 }
      ]
    }
  },
  "Germany": {
    flag: "🇩🇪",
    years: {
      "1990": [
        { n: "Bodo Illgner", p: "GK", r: 82 }, { n: "Raimond Aumann", p: "GK", r: 76 },
        { n: "Andreas Brehme", p: "DEF", r: 87 }, { n: "Klaus Augenthaler", p: "DEF", r: 84 }, { n: "Guido Buchwald", p: "DEF", r: 84 },
        { n: "Jürgen Kohler", p: "DEF", r: 85 }, { n: "Thomas Berthold", p: "DEF", r: 81 }, { n: "Stefan Reuter", p: "DEF", r: 80 },
        { n: "Lothar Matthäus", p: "MID", r: 91 }, { n: "Olaf Thon", p: "MID", r: 82 }, { n: "Pierre Littbarski", p: "MID", r: 83 },
        { n: "Thomas Häßler", p: "MID", r: 84 }, { n: "Uwe Bein", p: "MID", r: 80 },
        { n: "Jürgen Klinsmann", p: "FWD", r: 88 }, { n: "Rudi Völler", p: "FWD", r: 87 }, { n: "Karl-Heinz Riedle", p: "FWD", r: 82 }
      ],
      "2002": [
        { n: "Oliver Kahn", p: "GK", r: 90 }, { n: "Jens Lehmann", p: "GK", r: 82 },
        { n: "Christoph Metzelder", p: "DEF", r: 80 }, { n: "Thomas Linke", p: "DEF", r: 79 }, { n: "Carsten Ramelow", p: "DEF", r: 80 },
        { n: "Marko Rehmer", p: "DEF", r: 78 }, { n: "Frank Baumann", p: "DEF", r: 78 },
        { n: "Michael Ballack", p: "MID", r: 88 }, { n: "Dietmar Hamann", p: "MID", r: 83 }, { n: "Bernd Schneider", p: "MID", r: 82 },
        { n: "Jens Jeremies", p: "MID", r: 79 }, { n: "Torsten Frings", p: "MID", r: 82 }, { n: "Sebastian Kehl", p: "MID", r: 79 },
        { n: "Miroslav Klose", p: "FWD", r: 85 }, { n: "Oliver Neuville", p: "FWD", r: 81 }, { n: "Carsten Jancker", p: "FWD", r: 80 },
        { n: "Marco Bode", p: "FWD", r: 78 }
      ],
      "2014": [
        { n: "Manuel Neuer", p: "GK", r: 92 }, { n: "Roman Weidenfeller", p: "GK", r: 78 }, { n: "Ron-Robert Zieler", p: "GK", r: 76 },
        { n: "Philipp Lahm", p: "DEF", r: 88 }, { n: "Jérôme Boateng", p: "DEF", r: 85 }, { n: "Mats Hummels", p: "DEF", r: 87 },
        { n: "Benedikt Höwedes", p: "DEF", r: 81 }, { n: "Per Mertesacker", p: "DEF", r: 80 }, { n: "Shkodran Mustafi", p: "DEF", r: 78 },
        { n: "Erik Durm", p: "DEF", r: 76 },
        { n: "Bastian Schweinsteiger", p: "MID", r: 88 }, { n: "Toni Kroos", p: "MID", r: 89 }, { n: "Sami Khedira", p: "MID", r: 84 },
        { n: "Mesut Özil", p: "MID", r: 87 }, { n: "Christoph Kramer", p: "MID", r: 77 }, { n: "Julian Draxler", p: "MID", r: 81 },
        { n: "André Schürrle", p: "MID", r: 82 },
        { n: "Thomas Müller", p: "FWD", r: 89 }, { n: "Mario Götze", p: "FWD", r: 84 }, { n: "Miroslav Klose", p: "FWD", r: 85 },
        { n: "Lukas Podolski", p: "FWD", r: 82 }
      ]
    }
  },
  "Italy": {
    flag: "🇮🇹",
    years: {
      "1982": [
        { n: "Dino Zoff", p: "GK", r: 88 }, { n: "Ivano Bordon", p: "GK", r: 76 },
        { n: "Claudio Gentile", p: "DEF", r: 85 }, { n: "Gaetano Scirea", p: "DEF", r: 87 }, { n: "Antonio Cabrini", p: "DEF", r: 84 },
        { n: "Fulvio Collovati", p: "DEF", r: 81 }, { n: "Giuseppe Bergomi", p: "DEF", r: 82 }, { n: "Pietro Vierchowod", p: "DEF", r: 80 },
        { n: "Gabriele Oriali", p: "MID", r: 81 }, { n: "Marco Tardelli", p: "MID", r: 85 }, { n: "Giancarlo Antognoni", p: "MID", r: 85 },
        { n: "Bruno Conti", p: "MID", r: 86 }, { n: "Giampiero Marini", p: "MID", r: 79 },
        { n: "Paolo Rossi", p: "FWD", r: 90 }, { n: "Francesco Graziani", p: "FWD", r: 82 }, { n: "Alessandro Altobelli", p: "FWD", r: 83 }
      ],
      "2006": [
        { n: "Gianluigi Buffon", p: "GK", r: 92 }, { n: "Angelo Peruzzi", p: "GK", r: 80 }, { n: "Marco Amelia", p: "GK", r: 76 },
        { n: "Fabio Cannavaro", p: "DEF", r: 90 }, { n: "Marco Materazzi", p: "DEF", r: 83 }, { n: "Gianluca Zambrotta", p: "DEF", r: 85 },
        { n: "Fabio Grosso", p: "DEF", r: 82 }, { n: "Alessandro Nesta", p: "DEF", r: 88 }, { n: "Gianluca Zaccardo", p: "DEF", r: 77 },
        { n: "Massimo Oddo", p: "DEF", r: 80 },
        { n: "Andrea Pirlo", p: "MID", r: 89 }, { n: "Gennaro Gattuso", p: "MID", r: 84 }, { n: "Daniele De Rossi", p: "MID", r: 84 },
        { n: "Mauro Camoranesi", p: "MID", r: 82 }, { n: "Simone Perrotta", p: "MID", r: 80 }, { n: "Massimo Ambrosini", p: "MID", r: 80 },
        { n: "Francesco Totti", p: "FWD", r: 89 }, { n: "Luca Toni", p: "FWD", r: 84 }, { n: "Alessandro Del Piero", p: "FWD", r: 87 },
        { n: "Alberto Gilardino", p: "FWD", r: 82 }, { n: "Vincenzo Iaquinta", p: "FWD", r: 80 }, { n: "Filippo Inzaghi", p: "FWD", r: 84 }
      ]
    }
  },
  "England": {
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    years: {
      "1966": [
        { n: "Gordon Banks", p: "GK", r: 88 }, { n: "Ron Springett", p: "GK", r: 76 },
        { n: "George Cohen", p: "DEF", r: 82 }, { n: "Ray Wilson", p: "DEF", r: 83 }, { n: "Jack Charlton", p: "DEF", r: 84 },
        { n: "Bobby Moore", p: "DEF", r: 91 }, { n: "George Eastham", p: "DEF", r: 79 },
        { n: "Nobby Stiles", p: "MID", r: 82 }, { n: "Alan Ball", p: "MID", r: 85 }, { n: "Bobby Charlton", p: "MID", r: 91 },
        { n: "Martin Peters", p: "MID", r: 85 },
        { n: "Roger Hunt", p: "FWD", r: 83 }, { n: "Geoff Hurst", p: "FWD", r: 86 }, { n: "Jimmy Greaves", p: "FWD", r: 87 },
        { n: "Ian Callaghan", p: "FWD", r: 80 }
      ],
      "1990": [
        { n: "Peter Shilton", p: "GK", r: 86 }, { n: "Chris Woods", p: "GK", r: 78 },
        { n: "Stuart Pearce", p: "DEF", r: 85 }, { n: "Des Walker", p: "DEF", r: 83 }, { n: "Terry Butcher", p: "DEF", r: 83 },
        { n: "Mark Wright", p: "DEF", r: 81 }, { n: "Paul Parker", p: "DEF", r: 80 }, { n: "Gary Stevens", p: "DEF", r: 79 },
        { n: "Paul Gascoigne", p: "MID", r: 88 }, { n: "David Platt", p: "MID", r: 84 }, { n: "Chris Waddle", p: "MID", r: 85 },
        { n: "John Barnes", p: "MID", r: 86 }, { n: "Trevor Steven", p: "MID", r: 80 }, { n: "Steve McMahon", p: "MID", r: 79 },
        { n: "Gary Lineker", p: "FWD", r: 88 }, { n: "Peter Beardsley", p: "FWD", r: 84 }, { n: "Steve Bull", p: "FWD", r: 78 }
      ],
      "2018": [
        { n: "Jordan Pickford", p: "GK", r: 81 }, { n: "Jack Butland", p: "GK", r: 77 }, { n: "Nick Pope", p: "GK", r: 76 },
        { n: "Kyle Walker", p: "DEF", r: 84 }, { n: "John Stones", p: "DEF", r: 83 }, { n: "Harry Maguire", p: "DEF", r: 82 },
        { n: "Kieran Trippier", p: "DEF", r: 82 }, { n: "Ashley Young", p: "DEF", r: 79 }, { n: "Danny Rose", p: "DEF", r: 79 },
        { n: "Gary Cahill", p: "DEF", r: 80 }, { n: "Phil Jones", p: "DEF", r: 78 },
        { n: "Jordan Henderson", p: "MID", r: 82 }, { n: "Dele Alli", p: "MID", r: 83 }, { n: "Jesse Lingard", p: "MID", r: 81 },
        { n: "Eric Dier", p: "MID", r: 80 }, { n: "Ruben Loftus-Cheek", p: "MID", r: 79 },
        { n: "Harry Kane", p: "FWD", r: 88 }, { n: "Raheem Sterling", p: "FWD", r: 85 }, { n: "Marcus Rashford", p: "FWD", r: 82 },
        { n: "Jamie Vardy", p: "FWD", r: 82 }, { n: "Danny Welbeck", p: "FWD", r: 79 }
      ]
    }
  },
  "Netherlands": {
    flag: "🇳🇱",
    years: {
      "1974": [
        { n: "Jan Jongbloed", p: "GK", r: 78 }, { n: "Piet Schrijvers", p: "GK", r: 76 },
        { n: "Wim Suurbier", p: "DEF", r: 82 }, { n: "Wim Rijsbergen", p: "DEF", r: 80 }, { n: "Ruud Krol", p: "DEF", r: 86 },
        { n: "Arie Haan", p: "DEF", r: 85 }, { n: "Theo de Jong", p: "DEF", r: 78 },
        { n: "Wim Jansen", p: "MID", r: 83 }, { n: "Johan Neeskens", p: "MID", r: 89 }, { n: "Wim van Hanegem", p: "MID", r: 86 },
        { n: "René van de Kerkhof", p: "MID", r: 82 }, { n: "Willy van de Kerkhof", p: "MID", r: 82 },
        { n: "Johnny Rep", p: "FWD", r: 84 }, { n: "Johan Cruyff", p: "FWD", r: 96 }, { n: "Rob Rensenbrink", p: "FWD", r: 87 }
      ],
      "2010": [
        { n: "Maarten Stekelenburg", p: "GK", r: 81 }, { n: "Michel Vorm", p: "GK", r: 78 }, { n: "Sander Boschker", p: "GK", r: 73 },
        { n: "Gregory van der Wiel", p: "DEF", r: 81 }, { n: "John Heitinga", p: "DEF", r: 82 }, { n: "Joris Mathijsen", p: "DEF", r: 80 },
        { n: "Giovanni van Bronckhorst", p: "DEF", r: 83 }, { n: "Khalid Boulahrouz", p: "DEF", r: 77 }, { n: "André Ooijer", p: "DEF", r: 78 },
        { n: "Mark van Bommel", p: "MID", r: 83 }, { n: "Nigel de Jong", p: "MID", r: 82 }, { n: "Wesley Sneijder", p: "MID", r: 88 },
        { n: "Rafael van der Vaart", p: "MID", r: 84 }, { n: "Demy de Zeeuw", p: "MID", r: 79 },
        { n: "Dirk Kuyt", p: "FWD", r: 83 }, { n: "Arjen Robben", p: "FWD", r: 90 }, { n: "Robin van Persie", p: "FWD", r: 88 },
        { n: "Eljero Elia", p: "FWD", r: 79 }, { n: "Ryan Babel", p: "FWD", r: 79 }, { n: "Klaas-Jan Huntelaar", p: "FWD", r: 83 }
      ]
    }
  },
  "Spain": {
    flag: "🇪🇸",
    years: {
      "2010": [
        { n: "Iker Casillas", p: "GK", r: 91 }, { n: "Pepe Reina", p: "GK", r: 82 }, { n: "Víctor Valdés", p: "GK", r: 83 },
        { n: "Sergio Ramos", p: "DEF", r: 88 }, { n: "Gerard Piqué", p: "DEF", r: 87 }, { n: "Carles Puyol", p: "DEF", r: 87 },
        { n: "Joan Capdevila", p: "DEF", r: 80 }, { n: "Carlos Marchena", p: "DEF", r: 80 }, { n: "Raúl Albiol", p: "DEF", r: 79 },
        { n: "Álvaro Arbeloa", p: "DEF", r: 80 },
        { n: "Sergio Busquets", p: "MID", r: 85 }, { n: "Xabi Alonso", p: "MID", r: 86 }, { n: "Xavi", p: "MID", r: 91 },
        { n: "Andrés Iniesta", p: "MID", r: 91 }, { n: "David Silva", p: "MID", r: 86 }, { n: "Cesc Fàbregas", p: "MID", r: 85 },
        { n: "Javi Martínez", p: "MID", r: 80 },
        { n: "Pedro", p: "FWD", r: 83 }, { n: "David Villa", p: "FWD", r: 88 }, { n: "Fernando Torres", p: "FWD", r: 86 },
        { n: "Fernando Llorente", p: "FWD", r: 81 }, { n: "Jesús Navas", p: "FWD", r: 80 }
      ]
    }
  },
  "Portugal": {
    flag: "🇵🇹",
    years: {
      "2006": [
        { n: "Ricardo", p: "GK", r: 82 }, { n: "Quim", p: "GK", r: 78 }, { n: "Paulo Santos", p: "GK", r: 74 },
        { n: "Miguel", p: "DEF", r: 80 }, { n: "Ricardo Carvalho", p: "DEF", r: 86 }, { n: "Fernando Meira", p: "DEF", r: 80 },
        { n: "Nuno Valente", p: "DEF", r: 79 }, { n: "Paulo Ferreira", p: "DEF", r: 81 }, { n: "Ricardo Costa", p: "DEF", r: 77 },
        { n: "Maniche", p: "MID", r: 83 }, { n: "Costinha", p: "MID", r: 81 }, { n: "Deco", p: "MID", r: 88 },
        { n: "Luís Figo", p: "MID", r: 89 }, { n: "Petit", p: "MID", r: 79 }, { n: "Tiago", p: "MID", r: 81 },
        { n: "Hugo Viana", p: "MID", r: 78 },
        { n: "Cristiano Ronaldo", p: "FWD", r: 88 }, { n: "Pauleta", p: "FWD", r: 83 }, { n: "Nuno Gomes", p: "FWD", r: 81 },
        { n: "Simão Sabrosa", p: "FWD", r: 83 }, { n: "Hélder Postiga", p: "FWD", r: 79 }
      ]
    }
  },
  "Uruguay": {
    flag: "🇺🇾",
    years: {
      "2010": [
        { n: "Fernando Muslera", p: "GK", r: 82 }, { n: "Juan Castillo", p: "GK", r: 76 }, { n: "Martín Silva", p: "GK", r: 76 },
        { n: "Diego Lugano", p: "DEF", r: 82 }, { n: "Diego Godín", p: "DEF", r: 86 }, { n: "Maxi Pereira", p: "DEF", r: 81 },
        { n: "Álvaro Pereira", p: "DEF", r: 80 }, { n: "Mauricio Victorino", p: "DEF", r: 78 }, { n: "Jorge Fucile", p: "DEF", r: 78 },
        { n: "Egidio Arévalo Ríos", p: "MID", r: 80 }, { n: "Diego Pérez", p: "MID", r: 80 }, { n: "Walter Gargano", p: "MID", r: 80 },
        { n: "Álvaro Fernández", p: "MID", r: 78 }, { n: "Ignacio González", p: "MID", r: 76 }, { n: "Nicolás Lodeiro", p: "MID", r: 80 },
        { n: "Diego Forlán", p: "FWD", r: 87 }, { n: "Luis Suárez", p: "FWD", r: 88 }, { n: "Edinson Cavani", p: "FWD", r: 86 },
        { n: "Sebastián Abreu", p: "FWD", r: 79 }
      ]
    }
  },
  "Croatia": {
    flag: "🇭🇷",
    years: {
      "2018": [
        { n: "Danijel Subašić", p: "GK", r: 81 }, { n: "Lovre Kalinić", p: "GK", r: 77 }, { n: "Dominik Livaković", p: "GK", r: 78 },
        { n: "Šime Vrsaljko", p: "DEF", r: 82 }, { n: "Dejan Lovren", p: "DEF", r: 82 }, { n: "Domagoj Vida", p: "DEF", r: 80 },
        { n: "Ivan Strinić", p: "DEF", r: 78 }, { n: "Vedran Ćorluka", p: "DEF", r: 79 }, { n: "Josip Pivarić", p: "DEF", r: 76 },
        { n: "Tin Jedvaj", p: "DEF", r: 77 },
        { n: "Luka Modrić", p: "MID", r: 91 }, { n: "Ivan Rakitić", p: "MID", r: 87 }, { n: "Marcelo Brozović", p: "MID", r: 84 },
        { n: "Mateo Kovačić", p: "MID", r: 83 }, { n: "Milan Badelj", p: "MID", r: 80 }, { n: "Filip Bradarić", p: "MID", r: 76 },
        { n: "Ante Rebić", p: "FWD", r: 81 }, { n: "Mario Mandžukić", p: "FWD", r: 85 }, { n: "Ivan Perišić", p: "FWD", r: 85 },
        { n: "Andrej Kramarić", p: "FWD", r: 82 }, { n: "Marko Pjaca", p: "FWD", r: 78 }, { n: "Nikola Kalinić", p: "FWD", r: 80 }
      ]
    }
  }
};
