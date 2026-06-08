/* Real granular positions per player (name -> "POS" or "POS1,POS2").
 * Positions: GK, RB, LB, CB, RWB, LWB, CDM, CM, CAM, RM, LM, RW, LW, ST.
 * Players not listed here fall back to broad-line eligibility.
 * Extend this freely as squads with positions are added.
 */
window.PLAYER_POSITIONS = {
  /* ---- Goalkeepers ---- */
  "Pelé": "ST", "Garrincha": "RW", "Gilmar": "GK", "Taffarel": "GK", "Marcos": "GK", "Dida": "GK",
  "Júlio César": "GK", "Alisson": "GK", "Ederson": "GK", "Iker Casillas": "GK", "Gianluigi Buffon": "GK",
  "Dino Zoff": "GK", "Manuel Neuer": "GK", "Oliver Kahn": "GK", "Gordon Banks": "GK", "Peter Shilton": "GK",
  "Jordan Pickford": "GK", "Hugo Lloris": "GK", "Fabien Barthez": "GK", "Emiliano Martínez": "GK",
  "Ubaldo Fillol": "GK", "Sergio Romero": "GK", "Sepp Maier": "GK", "Bodo Illgner": "GK",
  "Thibaut Courtois": "GK", "Marc-André ter Stegen": "GK", "Mike Maignan": "GK", "Unai Simón": "GK",
  "Diogo Costa": "GK", "Yassine Bounou": "GK", "Guillermo Ochoa": "GK", "Matt Turner": "GK",
  "Bart Verbruggen": "GK", "Dominik Livaković": "GK", "Fernando Muslera": "GK", "Sergio Rochet": "GK",
  "Jan Jongbloed": "GK", "Maarten Stekelenburg": "GK", "Ricardo": "GK", "Waldir Peres": "GK", "Nery Pumpido": "GK",

  /* ---- Brazil ---- */
  "Carlos Alberto": "RB", "Brito": "CB", "Piazza": "CB", "Everaldo": "LB", "Clodoaldo": "CDM",
  "Gérson": "CM", "Rivelino": "CAM,LM", "Jairzinho": "RW", "Tostão": "ST", "Roberto Carlos": "LB",
  "Cafu": "RB", "Lúcio": "CB", "Roque Júnior": "CB", "Edmílson": "CDM,CB", "Gilberto Silva": "CDM",
  "Ronaldinho": "LW,CAM", "Ronaldo": "ST", "Rivaldo": "CAM,LW", "Romário": "ST", "Bebeto": "ST",
  "Dunga": "CDM", "Leonardo": "LM,CAM", "Thiago Silva": "CB", "David Luiz": "CB", "Dani Alves": "RB",
  "Marcelo": "LB", "Maicon": "RB", "Dante": "CB", "Luiz Gustavo": "CDM", "Fernandinho": "CDM",
  "Paulinho": "CM", "Oscar": "CAM", "Willian": "RW,LW", "Neymar": "LW", "Hulk": "RW", "Fred": "ST",
  "Zico": "CAM", "Sócrates": "CM", "Falcão": "CM", "Júnior": "LB", "Éder": "LW", "Careca": "ST",
  "Alisson": "GK", "Danilo": "RB", "Marquinhos": "CB", "Gabriel Magalhães": "CB", "Éder Militão": "CB",
  "Bruno Guimarães": "CM", "Lucas Paquetá": "CAM", "Vinícius Júnior": "LW", "Rodrygo": "RW",
  "Raphinha": "RW", "Endrick": "ST", "Gabriel Jesus": "ST", "Savinho": "RW", "Nílton Santos": "LB",
  "Djalma Santos": "RB", "Bellini": "CB", "Didi": "CM", "Zagallo": "LM", "Vavá": "ST",

  /* ---- Argentina ---- */
  "Daniel Passarella": "CB", "Alberto Tarantini": "LB", "Osvaldo Ardiles": "CM", "Mario Kempes": "ST",
  "Leopoldo Luque": "ST", "Daniel Bertoni": "RW", "Diego Maradona": "CAM,ST", "Jorge Valdano": "ST",
  "Jorge Burruchaga": "CAM", "Oscar Ruggeri": "CB", "Sergio Batista": "CDM", "Lionel Messi": "RW,CAM",
  "Ángel Di María": "RW,LW", "Javier Mascherano": "CDM,CB", "Sergio Agüero": "ST", "Gonzalo Higuaín": "ST",
  "Pablo Zabaleta": "RB", "Marcos Rojo": "CB", "Ezequiel Garay": "CB", "Cristian Romero": "CB",
  "Nicolás Otamendi": "CB", "Nahuel Molina": "RB", "Nicolás Tagliafico": "LB", "Lisandro Martínez": "CB",
  "Rodrigo De Paul": "CM", "Enzo Fernández": "CM", "Alexis Mac Allister": "CM", "Leandro Paredes": "CDM",
  "Julián Álvarez": "ST", "Lautaro Martínez": "ST", "Marcos Acuña": "LB", "Claudio Caniggia": "ST",

  /* ---- France ---- */
  "Lilian Thuram": "RB,CB", "Marcel Desailly": "CB", "Laurent Blanc": "CB", "Bixente Lizarazu": "LB",
  "Didier Deschamps": "CDM", "Emmanuel Petit": "CM", "Patrick Vieira": "CM", "Zinedine Zidane": "CAM",
  "Youri Djorkaeff": "CAM,ST", "Thierry Henry": "ST,LW", "David Trezeguet": "ST", "Robert Pirès": "LM",
  "Claude Makélélé": "CDM", "Franck Ribéry": "LW", "Raphaël Varane": "CB", "Samuel Umtiti": "CB",
  "Benjamin Pavard": "RB", "Lucas Hernández": "LB", "Theo Hernández": "LB", "N'Golo Kanté": "CDM",
  "Paul Pogba": "CM", "Blaise Matuidi": "CM", "Antoine Griezmann": "ST,CAM", "Kylian Mbappé": "LW,ST",
  "Olivier Giroud": "ST", "Ousmane Dembélé": "RW", "Aurélien Tchouaméni": "CDM", "Eduardo Camavinga": "CM",
  "Jules Koundé": "RB,CB", "William Saliba": "CB", "Dayot Upamecano": "CB", "Michel Platini": "CAM",
  "Jean Tigana": "CM", "Alain Giresse": "CM", "Michael Olise": "RW", "Bradley Barcola": "LW",

  /* ---- Germany ---- */
  "Franz Beckenbauer": "CB", "Paul Breitner": "LB,CM", "Gerd Müller": "ST", "Lothar Matthäus": "CM,CB",
  "Jürgen Klinsmann": "ST", "Rudi Völler": "ST", "Andreas Brehme": "LB", "Philipp Lahm": "RB,LB",
  "Jérôme Boateng": "CB", "Mats Hummels": "CB", "Bastian Schweinsteiger": "CM", "Toni Kroos": "CM",
  "Sami Khedira": "CM", "Mesut Özil": "CAM", "Thomas Müller": "CAM,RW", "Mario Götze": "CAM",
  "Miroslav Klose": "ST", "Lukas Podolski": "LW", "Michael Ballack": "CM", "Joshua Kimmich": "RB,CDM",
  "Antonio Rüdiger": "CB", "Jamal Musiala": "CAM", "Florian Wirtz": "CAM", "Kai Havertz": "ST,CAM",
  "Leroy Sané": "RW", "Serge Gnabry": "RW", "İlkay Gündoğan": "CM",

  /* ---- Italy ---- */
  "Paolo Rossi": "ST", "Marco Tardelli": "CM", "Bruno Conti": "RW", "Gaetano Scirea": "CB",
  "Claudio Gentile": "CB,RB", "Antonio Cabrini": "LB", "Fabio Cannavaro": "CB", "Marco Materazzi": "CB",
  "Gianluca Zambrotta": "RB,LB", "Fabio Grosso": "LB", "Alessandro Nesta": "CB", "Andrea Pirlo": "CDM,CM",
  "Gennaro Gattuso": "CDM", "Daniele De Rossi": "CM", "Francesco Totti": "CAM,ST", "Luca Toni": "ST",
  "Alessandro Del Piero": "ST,CAM", "Filippo Inzaghi": "ST", "Mauro Camoranesi": "RM",

  /* ---- England ---- */
  "Bobby Moore": "CB", "Bobby Charlton": "CM", "Geoff Hurst": "ST", "Gordon Banks": "GK",
  "Jack Charlton": "CB", "Alan Ball": "CM", "Martin Peters": "CM", "Gary Lineker": "ST",
  "Paul Gascoigne": "CAM", "John Barnes": "LW", "Chris Waddle": "RW", "David Platt": "CM",
  "Harry Kane": "ST", "Raheem Sterling": "LW,RW", "Marcus Rashford": "LW,ST", "Kyle Walker": "RB",
  "John Stones": "CB", "Harry Maguire": "CB", "Kieran Trippier": "RB", "Jordan Henderson": "CM",
  "Dele Alli": "CAM", "Declan Rice": "CDM", "Jude Bellingham": "CM,CAM", "Phil Foden": "CAM,LW",
  "Bukayo Saka": "RW", "Cole Palmer": "CAM,RW", "Trent Alexander-Arnold": "RB", "Marc Guéhi": "CB",

  /* ---- Netherlands ---- */
  "Johan Cruyff": "ST,CAM", "Johan Neeskens": "CM", "Ruud Krol": "LB,CB", "Rob Rensenbrink": "LW",
  "Johnny Rep": "RW", "Arie Haan": "CM,CB", "Wim van Hanegem": "CM", "Wesley Sneijder": "CAM",
  "Arjen Robben": "RW", "Robin van Persie": "ST", "Dirk Kuyt": "RW,ST", "Mark van Bommel": "CDM",
  "Nigel de Jong": "CDM", "Giovanni van Bronckhorst": "LB", "Virgil van Dijk": "CB", "Frenkie de Jong": "CM",
  "Memphis Depay": "ST", "Cody Gakpo": "LW,ST", "Nathan Aké": "CB", "Denzel Dumfries": "RB",
  "Matthijs de Ligt": "CB", "Xavi Simons": "CAM", "Ryan Gravenberch": "CM", "Tijjani Reijnders": "CM",

  /* ---- Spain ---- */
  "Sergio Ramos": "CB,RB", "Gerard Piqué": "CB", "Carles Puyol": "CB", "Joan Capdevila": "LB",
  "Sergio Busquets": "CDM", "Xabi Alonso": "CM", "Xavi": "CM", "Andrés Iniesta": "CM,CAM",
  "David Silva": "CAM,LW", "David Villa": "ST,LW", "Fernando Torres": "ST", "Pedro": "RW,LW",
  "Iker Casillas": "GK", "Cesc Fàbregas": "CM", "Rodri": "CDM", "Pedri": "CM", "Gavi": "CM",
  "Lamine Yamal": "RW", "Nico Williams": "LW", "Dani Carvajal": "RB", "Aymeric Laporte": "CB",
  "Álvaro Morata": "ST", "Mikel Oyarzabal": "ST,LW", "Dani Olmo": "CAM", "Marc Cucurella": "LB",

  /* ---- Portugal ---- */
  "Cristiano Ronaldo": "ST,LW", "Luís Figo": "RW", "Deco": "CAM", "Ricardo Carvalho": "CB",
  "Pauleta": "ST", "Nuno Gomes": "ST", "Maniche": "CM", "Simão Sabrosa": "LW,RW", "Rúben Dias": "CB",
  "Bruno Fernandes": "CAM", "Bernardo Silva": "RW,CAM", "Vitinha": "CM", "João Cancelo": "RB,LB",
  "Nuno Mendes": "LB", "Rafael Leão": "LW", "Diogo Jota": "ST,LW", "João Neves": "CM", "Pedro Neto": "RW",
  "Gonçalo Ramos": "ST", "Gonçalo Inácio": "CB",

  /* ---- Uruguay ---- */
  "Diego Forlán": "ST", "Luis Suárez": "ST", "Edinson Cavani": "ST", "Diego Godín": "CB",
  "Diego Lugano": "CB", "Maxi Pereira": "RB", "Federico Valverde": "CM,RW", "Ronald Araújo": "CB",
  "José María Giménez": "CB", "Darwin Núñez": "ST", "Rodrigo Bentancur": "CM", "Manuel Ugarte": "CDM",
  "Nicolás de la Cruz": "CAM", "Mathías Olivera": "LB",

  /* ---- Croatia ---- */
  "Luka Modrić": "CM,CAM", "Ivan Rakitić": "CM", "Mario Mandžukić": "ST", "Ivan Perišić": "LW,LM",
  "Marcelo Brozović": "CDM", "Mateo Kovačić": "CM", "Dejan Lovren": "CB", "Šime Vrsaljko": "RB",
  "Domagoj Vida": "CB", "Andrej Kramarić": "ST", "Joško Gvardiol": "CB,LB", "Lovro Majer": "CAM",

  /* ---- Belgium / others ---- */
  "Kevin De Bruyne": "CAM", "Romelu Lukaku": "ST", "Jérémy Doku": "LW", "Leandro Trossard": "LW,ST",
  "Youri Tielemans": "CM", "Amadou Onana": "CDM", "Wout Faes": "CB", "Timothy Castagne": "RB",
  "Christian Pulisic": "LW,RW", "Weston McKennie": "CM", "Tyler Adams": "CDM", "Folarin Balogun": "ST",
  "Sergiño Dest": "RB,LB", "Antonee Robinson": "LB", "Gio Reyna": "CAM",
  "Achraf Hakimi": "RB", "Hakim Ziyech": "RW,CAM", "Youssef En-Nesyri": "ST", "Sofyan Amrabat": "CDM",
  "Brahim Díaz": "CAM,RW", "Nayef Aguerd": "CB", "Noussair Mazraoui": "RB",
  "Santiago Giménez": "ST", "Hirving Lozano": "LW,RW", "Edson Álvarez": "CDM", "Raúl Jiménez": "ST",

  /* ===== Expanded — remaining players ===== */
  /* Brazil */
  "Orlando": "CB", "Zito": "CM", "Félix": "GK", "Ado": "GK", "Marco Antônio": "LB", "Fontana": "CB",
  "Paulo Cézar": "LM", "Edu": "LW", "Roberto": "ST", "Paulo Sérgio": "GK", "Leandro": "RB", "Luizinho": "CB",
  "Edinho": "CB", "Cerezo": "CM", "Dirceu": "CM", "Serginho": "ST", "Jorginho": "RB", "Aldair": "CB",
  "Márcio Santos": "CB", "Branco": "LB", "Mauro Silva": "CDM", "Mazinho": "CM", "Zinho": "LM", "Raí": "CAM",
  "Carlos Germano": "GK", "Júnior Baiano": "CB", "Gonçalves": "CB", "Zé Carlos": "RB", "Zé Roberto": "LM,LB",
  "César Sampaio": "CDM", "Doriva": "CDM", "Emerson": "CDM", "Denílson": "LW", "Edmundo": "ST",
  "Rogério Ceni": "GK", "Anderson Polga": "CB", "Belletti": "RB", "Kléberson": "CM", "Juninho Paulista": "CAM",
  "Ricardinho": "CM", "Vampeta": "CDM", "Edílson": "RW", "Luizão": "ST", "Jefferson": "GK", "Victor": "GK",
  "Maxwell": "LB", "Ramires": "CM", "Hernanes": "CM", "Jô": "ST", "Bernard": "RW", "Wendell": "LB",
  "Vanderson": "RB", "André": "CDM", "Joelinton": "CM",
  /* Argentina */
  "Héctor Baley": "GK", "Luis Galván": "CB", "Jorge Olguín": "RB", "Miguel Oviedo": "LB", "Américo Gallego": "CM",
  "Daniel Valencia": "CM", "Rubén Galván": "CDM", "Omar Larrosa": "CM", "René Houseman": "RW", "Oscar Ortiz": "LW",
  "Luis Islas": "GK", "José Luis Cuciuffo": "RB", "José Luis Brown": "CB", "Julio Olarticoechea": "LB",
  "Néstor Clausen": "RB", "Oscar Garré": "LB", "Ricardo Giusti": "CM", "Héctor Enrique": "CM",
  "Ricardo Bochini": "CAM", "Carlos Tapia": "CM", "Pedro Pasculli": "ST", "Claudio Borghi": "CAM",
  "Sergio Goycochea": "GK", "Juan Simón": "CB", "Roberto Sensini": "CB", "José Basualdo": "CM",
  "Pedro Troglio": "CM", "Gustavo Dezotti": "ST", "Mariano Andújar": "GK", "Agustín Orion": "GK",
  "Federico Fernández": "CB", "Martín Demichelis": "CB", "Hugo Campagnaro": "CB", "José Basanta": "LB",
  "Lucas Biglia": "CDM", "Fernando Gago": "CM", "Maxi Rodríguez": "RM,RW", "Enzo Pérez": "CM",
  "Ezequiel Lavezzi": "LW", "Rodrigo Palacio": "ST", "Franco Armani": "GK", "Gerónimo Rulli": "GK",
  "Gonzalo Montiel": "RB", "Germán Pezzella": "CB", "Guido Rodríguez": "CDM", "Alejandro Gómez": "CAM",
  "Nicolás González": "LW", "Paulo Dybala": "CAM", "Giovani Lo Celso": "CAM", "Alejandro Garnacho": "LW",
  /* France */
  "Joël Bats": "GK", "Maxime Bossis": "CB", "Patrick Battiston": "CB", "Manuel Amoros": "RB", "William Ayache": "RB",
  "Luis Fernández": "CM", "Dominique Rocheteau": "RW", "Jean-Pierre Papin": "ST", "Yannick Stopyra": "ST",
  "Bernard Lama": "GK", "Lionel Charbonnier": "GK", "Vincent Candela": "LB", "Frank Lebœuf": "CB",
  "Christian Karembeu": "CM", "Alain Boghossian": "CM", "Bernard Diomède": "LW", "Stéphane Guivarc'h": "ST",
  "Christophe Dugarry": "ST", "Grégory Coupet": "GK", "Mickaël Landreau": "GK", "William Gallas": "CB",
  "Willy Sagnol": "RB", "Éric Abidal": "LB", "Jean-Alain Boumsong": "CB", "Mikaël Silvestre": "CB",
  "Florent Malouda": "LM", "Alou Diarra": "CDM", "Vikash Dhorasoo": "CM", "Sylvain Wiltord": "RW", "Louis Saha": "ST",
  "Steve Mandanda": "GK", "Alphonse Areola": "GK", "Presnel Kimpembe": "CB", "Djibril Sidibé": "RB",
  "Benjamin Mendy": "LB", "Adil Rami": "CB", "Corentin Tolisso": "CM", "Steven N'Zonzi": "CDM", "Thomas Lemar": "LM",
  "Nabil Fekir": "CAM", "Florian Thauvin": "RW,RM", "Ibrahima Konaté": "CB", "Adrien Rabiot": "CM",
  "Youssouf Fofana": "CDM", "Marcus Thuram": "ST", "Randal Kolo Muani": "ST", "Kingsley Coman": "LW,RW",
  "Brice Samba": "GK", "Lucas Digne": "LB", "Warren Zaïre-Emery": "CM",
  /* Germany */
  "Berti Vogts": "RB", "Hans-Georg Schwarzenbeck": "CB", "Uli Hoeneß": "CM", "Wolfgang Overath": "CM",
  "Rainer Bonhof": "CM", "Jürgen Grabowski": "RW", "Bernd Hölzenbein": "LW", "Raimond Aumann": "GK",
  "Klaus Augenthaler": "CB", "Guido Buchwald": "CB", "Jürgen Kohler": "CB", "Thomas Berthold": "RB",
  "Stefan Reuter": "RB", "Olaf Thon": "CM", "Pierre Littbarski": "RW", "Thomas Häßler": "RM", "Uwe Bein": "CAM",
  "Karl-Heinz Riedle": "ST", "Jens Lehmann": "GK", "Christoph Metzelder": "CB", "Thomas Linke": "CB",
  "Carsten Ramelow": "CDM", "Marko Rehmer": "CB", "Frank Baumann": "CDM", "Dietmar Hamann": "CDM",
  "Bernd Schneider": "RM", "Jens Jeremies": "CDM", "Torsten Frings": "CM", "Sebastian Kehl": "CM",
  "Oliver Neuville": "ST", "Carsten Jancker": "ST", "Marco Bode": "LW", "Roman Weidenfeller": "GK",
  "Ron-Robert Zieler": "GK", "Benedikt Höwedes": "CB", "Per Mertesacker": "CB", "Shkodran Mustafi": "CB",
  "Erik Durm": "LB", "Christoph Kramer": "CDM", "Julian Draxler": "LM", "André Schürrle": "LW",
  "Oliver Baumann": "GK", "Jonathan Tah": "CB", "Nico Schlotterbeck": "CB", "David Raum": "LB",
  "Waldemar Anton": "CB", "Robert Andrich": "CDM", "Pascal Groß": "CM", "Niclas Füllkrug": "ST",
  /* Italy */
  "Ivano Bordon": "GK", "Fulvio Collovati": "CB", "Giuseppe Bergomi": "RB", "Pietro Vierchowod": "CB",
  "Gabriele Oriali": "CDM", "Giancarlo Antognoni": "CAM", "Giampiero Marini": "CM", "Francesco Graziani": "ST",
  "Alessandro Altobelli": "ST", "Angelo Peruzzi": "GK", "Marco Amelia": "GK", "Gianluca Zaccardo": "RB",
  "Massimo Oddo": "RB", "Simone Perrotta": "CM", "Massimo Ambrosini": "CM", "Alberto Gilardino": "ST",
  "Vincenzo Iaquinta": "ST",
  /* England */
  "Ron Springett": "GK", "George Cohen": "RB", "Ray Wilson": "LB", "George Eastham": "CM", "Nobby Stiles": "CDM",
  "Roger Hunt": "ST", "Jimmy Greaves": "ST", "Ian Callaghan": "RW", "Chris Woods": "GK", "Stuart Pearce": "LB",
  "Des Walker": "CB", "Terry Butcher": "CB", "Mark Wright": "CB", "Paul Parker": "RB", "Gary Stevens": "RB",
  "Trevor Steven": "RM", "Steve McMahon": "CM", "Peter Beardsley": "CAM", "Steve Bull": "ST", "Jack Butland": "GK",
  "Nick Pope": "GK", "Ashley Young": "LB", "Danny Rose": "LB", "Gary Cahill": "CB", "Phil Jones": "CB",
  "Jesse Lingard": "CAM", "Eric Dier": "CDM", "Ruben Loftus-Cheek": "CM", "Jamie Vardy": "ST", "Danny Welbeck": "ST",
  "Dean Henderson": "GK", "Ezri Konsa": "CB", "Levi Colwill": "CB", "Kobbie Mainoo": "CM", "Anthony Gordon": "LW",
  "Ollie Watkins": "ST",
  /* Netherlands */
  "Piet Schrijvers": "GK", "Wim Suurbier": "RB", "Wim Rijsbergen": "CB", "Theo de Jong": "CM", "Wim Jansen": "CM",
  "René van de Kerkhof": "RM", "Willy van de Kerkhof": "CM", "Ernie Brandts": "CB", "Jan Poortvliet": "LB",
  "Michel Vorm": "GK", "Sander Boschker": "GK", "Gregory van der Wiel": "RB", "John Heitinga": "CB",
  "Joris Mathijsen": "CB", "Khalid Boulahrouz": "CB", "André Ooijer": "CB", "Rafael van der Vaart": "CAM",
  "Demy de Zeeuw": "CM", "Eljero Elia": "LW", "Ryan Babel": "LW", "Klaas-Jan Huntelaar": "ST", "Mark Flekken": "GK",
  "Micky van de Ven": "CB", "Lutsharel Geertruida": "RB", "Donyell Malen": "RW", "Wout Weghorst": "ST",
  /* Spain */
  "Pepe Reina": "GK", "Víctor Valdés": "GK", "Carlos Marchena": "CB", "Raúl Albiol": "CB", "Álvaro Arbeloa": "RB",
  "Javi Martínez": "CDM", "Fernando Llorente": "ST", "Jesús Navas": "RW,RM", "David Raya": "GK",
  "Robin Le Normand": "CB", "Pau Cubarsí": "CB", "Dani Vivian": "CB", "Fabián Ruiz": "CM", "Martín Zubimendi": "CDM",
  /* Portugal */
  "Quim": "GK", "Paulo Santos": "GK", "Miguel": "RB", "Fernando Meira": "CB", "Nuno Valente": "LB",
  "Paulo Ferreira": "RB", "Ricardo Costa": "CB", "Costinha": "CDM", "Petit": "CDM", "Tiago": "CM", "Hugo Viana": "CM",
  "Hélder Postiga": "ST", "José Sá": "GK", "António Silva": "CB", "Diogo Dalot": "RB", "Rúben Neves": "CDM",
  /* Uruguay */
  "Juan Castillo": "GK", "Martín Silva": "GK", "Álvaro Pereira": "LB", "Mauricio Victorino": "CB",
  "Jorge Fucile": "RB", "Egidio Arévalo Ríos": "CDM", "Diego Pérez": "CDM", "Walter Gargano": "CDM",
  "Álvaro Fernández": "LM", "Ignacio González": "CM", "Nicolás Lodeiro": "CAM", "Sebastián Abreu": "ST",
  "Santiago Mele": "GK", "Nahitan Nández": "RB", "Sebastián Cáceres": "CB", "Facundo Pellistri": "RW",
  "Maxi Araújo": "LM",
  /* Croatia */
  "Danijel Subašić": "GK", "Lovre Kalinić": "GK", "Ivan Strinić": "LB", "Vedran Ćorluka": "CB",
  "Josip Pivarić": "LB", "Tin Jedvaj": "RB", "Milan Badelj": "CDM", "Filip Bradarić": "CM", "Ante Rebić": "LW",
  "Marko Pjaca": "LW", "Nikola Kalinić": "ST", "Ivica Ivušić": "GK", "Josip Stanišić": "RB", "Josip Šutalo": "CB",
  "Borna Sosa": "LB", "Marin Pongračić": "CB", "Luka Sučić": "CM", "Ante Budimir": "ST", "Igor Matanović": "ST",
  /* Belgium / USA / Mexico / Morocco */
  "Koen Casteels": "GK", "Zeno Debast": "CB", "Arthur Theate": "CB", "Maxim De Cuyper": "LB", "Orel Mangala": "CM",
  "Charles De Ketelaere": "CAM", "Dodi Lukébakio": "RW", "Patrick Schulte": "GK", "Chris Richards": "CB",
  "Tim Ream": "CB", "Cameron Carter-Vickers": "CB", "Yunus Musah": "CM", "Tim Weah": "RW", "Ricardo Pepi": "ST",
  "Luis Malagón": "GK", "Jorge Sánchez": "RB", "César Montes": "CB", "Johan Vásquez": "CB", "Jesús Gallardo": "LB",
  "Israel Reyes": "CB", "Luis Chávez": "CM", "Orbelín Pineda": "CAM", "Diego Lainez": "LW", "Alexis Vega": "LW",
  "Munir Mohamedi": "GK", "Romain Saïss": "CB", "Jawad El Yamiq": "CB", "Azzedine Ounahi": "CM",
  "Bilal El Khannouss": "CAM", "Amine Adli": "LW", "Sofiane Boufal": "LW"
};
