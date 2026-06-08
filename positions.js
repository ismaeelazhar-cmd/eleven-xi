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
  "Santiago Giménez": "ST", "Hirving Lozano": "LW,RW", "Edson Álvarez": "CDM", "Raúl Jiménez": "ST"
};
