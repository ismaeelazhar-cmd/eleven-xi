/* Additional legacy (pre-1998) World Cup squads — real rosters, curated ratings + positions. */
(function () {
  var D = window.WORLD_CUP_DATA;
  function add(c, flag, y, pl) { if (!D[c]) D[c] = { flag: flag, years: {} }; if (!D[c].years[y]) D[c].years[y] = pl; }

  add("Brazil", "🇧🇷", "1962", [
    { n: "Gilmar", p: "GK", r: 84, gp: "GK" }, { n: "Djalma Santos", p: "DEF", r: 84, gp: "RB" },
    { n: "Mauro Ramos", p: "DEF", r: 82, gp: "CB" }, { n: "Zózimo", p: "DEF", r: 80, gp: "CB" },
    { n: "Nílton Santos", p: "DEF", r: 86, gp: "LB" }, { n: "Zito", p: "MID", r: 84, gp: "CM" },
    { n: "Didi", p: "MID", r: 89, gp: "CM" }, { n: "Garrincha", p: "FWD", r: 94, gp: "RW" },
    { n: "Vavá", p: "FWD", r: 85, gp: "ST" }, { n: "Amarildo", p: "FWD", r: 84, gp: "ST" },
    { n: "Zagallo", p: "FWD", r: 85, gp: "LW" }
  ]);
  add("Italy", "🇮🇹", "1970", [
    { n: "Enrico Albertosi", p: "GK", r: 84, gp: "GK" }, { n: "Tarcisio Burgnich", p: "DEF", r: 83, gp: "RB" },
    { n: "Roberto Rosato", p: "DEF", r: 81, gp: "CB" }, { n: "Pierluigi Cera", p: "DEF", r: 80, gp: "CB" },
    { n: "Giacinto Facchetti", p: "DEF", r: 88, gp: "LB" }, { n: "Mario Bertini", p: "MID", r: 80, gp: "CM" },
    { n: "Giancarlo De Sisti", p: "MID", r: 83, gp: "CM" }, { n: "Sandro Mazzola", p: "MID", r: 87, gp: "CAM" },
    { n: "Gianni Rivera", p: "MID", r: 88, gp: "CAM" }, { n: "Angelo Domenghini", p: "FWD", r: 82, gp: "RW" },
    { n: "Roberto Boninsegna", p: "FWD", r: 84, gp: "ST" }, { n: "Luigi Riva", p: "FWD", r: 89, gp: "ST" }
  ]);
  add("Germany", "🇩🇪", "1966", [
    { n: "Hans Tilkowski", p: "GK", r: 83, gp: "GK" }, { n: "Horst-Dieter Höttges", p: "DEF", r: 80, gp: "RB" },
    { n: "Willi Schulz", p: "DEF", r: 82, gp: "CB" }, { n: "Wolfgang Weber", p: "DEF", r: 80, gp: "CB" },
    { n: "Karl-Heinz Schnellinger", p: "DEF", r: 84, gp: "LB" }, { n: "Franz Beckenbauer", p: "MID", r: 90, gp: "CM" },
    { n: "Wolfgang Overath", p: "MID", r: 84, gp: "CM" }, { n: "Helmut Haller", p: "MID", r: 84, gp: "CAM" },
    { n: "Uwe Seeler", p: "FWD", r: 88, gp: "ST" }, { n: "Sigfried Held", p: "FWD", r: 81, gp: "LW" },
    { n: "Lothar Emmerich", p: "FWD", r: 81, gp: "LW" }
  ]);
  add("England", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "1970", [
    { n: "Gordon Banks", p: "GK", r: 89, gp: "GK" }, { n: "Keith Newton", p: "DEF", r: 79, gp: "RB" },
    { n: "Brian Labone", p: "DEF", r: 81, gp: "CB" }, { n: "Bobby Moore", p: "DEF", r: 91, gp: "CB" },
    { n: "Terry Cooper", p: "DEF", r: 80, gp: "LB" }, { n: "Alan Mullery", p: "MID", r: 81, gp: "CM" },
    { n: "Bobby Charlton", p: "MID", r: 90, gp: "CM" }, { n: "Alan Ball", p: "MID", r: 84, gp: "RM" },
    { n: "Martin Peters", p: "MID", r: 84, gp: "LM" }, { n: "Francis Lee", p: "FWD", r: 83, gp: "ST" },
    { n: "Geoff Hurst", p: "FWD", r: 86, gp: "ST" }
  ]);
  add("Hungary", "🇭🇺", "1954", [
    { n: "Gyula Grosics", p: "GK", r: 85, gp: "GK" }, { n: "Jenő Buzánszky", p: "DEF", r: 80, gp: "RB" },
    { n: "Gyula Lóránt", p: "DEF", r: 82, gp: "CB" }, { n: "Mihály Lantos", p: "DEF", r: 80, gp: "LB" },
    { n: "József Bozsik", p: "MID", r: 86, gp: "CM" }, { n: "József Zakariás", p: "MID", r: 80, gp: "CDM" },
    { n: "Nándor Hidegkuti", p: "MID", r: 88, gp: "CAM" }, { n: "Sándor Kocsis", p: "FWD", r: 90, gp: "ST" },
    { n: "Ferenc Puskás", p: "FWD", r: 93, gp: "ST" }, { n: "Zoltán Czibor", p: "FWD", r: 85, gp: "LW" },
    { n: "László Budai", p: "FWD", r: 81, gp: "RW" }
  ]);
  add("Portugal", "🇵🇹", "1966", [
    { n: "José Pereira", p: "GK", r: 81, gp: "GK" }, { n: "João Morais", p: "DEF", r: 79, gp: "RB" },
    { n: "Vicente Lucas", p: "DEF", r: 80, gp: "CB" }, { n: "Germano", p: "DEF", r: 81, gp: "CB" },
    { n: "Hilário", p: "DEF", r: 79, gp: "LB" }, { n: "Jaime Graça", p: "MID", r: 81, gp: "CM" },
    { n: "Mário Coluna", p: "MID", r: 85, gp: "CM" }, { n: "José Augusto", p: "FWD", r: 82, gp: "RW" },
    { n: "Eusébio", p: "FWD", r: 92, gp: "ST" }, { n: "José Torres", p: "FWD", r: 83, gp: "ST" },
    { n: "António Simões", p: "FWD", r: 81, gp: "LW" }
  ]);
  add("Poland", "🇵🇱", "1974", [
    { n: "Jan Tomaszewski", p: "GK", r: 84, gp: "GK" }, { n: "Antoni Szymanowski", p: "DEF", r: 80, gp: "RB" },
    { n: "Władysław Żmuda", p: "DEF", r: 83, gp: "CB" }, { n: "Jerzy Gorgoń", p: "DEF", r: 81, gp: "CB" },
    { n: "Adam Musiał", p: "DEF", r: 79, gp: "LB" }, { n: "Henryk Kasperczak", p: "MID", r: 81, gp: "RM" },
    { n: "Kazimierz Deyna", p: "MID", r: 88, gp: "CM" }, { n: "Zygmunt Maszczyk", p: "MID", r: 79, gp: "CM" },
    { n: "Grzegorz Lato", p: "FWD", r: 86, gp: "RW" }, { n: "Andrzej Szarmach", p: "FWD", r: 84, gp: "ST" },
    { n: "Robert Gadocha", p: "FWD", r: 82, gp: "LW" }
  ]);
  add("Denmark", "🇩🇰", "1986", [
    { n: "Troels Rasmussen", p: "GK", r: 79, gp: "GK" }, { n: "John Sivebæk", p: "DEF", r: 79, gp: "RB" },
    { n: "Søren Busk", p: "DEF", r: 80, gp: "CB" }, { n: "Morten Olsen", p: "DEF", r: 84, gp: "CB" },
    { n: "Ivan Nielsen", p: "DEF", r: 80, gp: "CB" }, { n: "Klaus Berggreen", p: "MID", r: 81, gp: "RM" },
    { n: "Søren Lerby", p: "MID", r: 84, gp: "CM" }, { n: "Jan Mølby", p: "MID", r: 82, gp: "CM" },
    { n: "Frank Arnesen", p: "MID", r: 84, gp: "CAM" }, { n: "Michael Laudrup", p: "MID", r: 88, gp: "CAM" },
    { n: "Jesper Olsen", p: "FWD", r: 82, gp: "LW" }, { n: "Preben Elkjær", p: "FWD", r: 87, gp: "ST" }
  ]);
  add("Cameroon", "🇨🇲", "1990", [
    { n: "Thomas N'Kono", p: "GK", r: 83, gp: "GK" }, { n: "Stephen Tataw", p: "DEF", r: 79, gp: "RB" },
    { n: "Emmanuel Kundé", p: "DEF", r: 81, gp: "CB" }, { n: "Benjamin Massing", p: "DEF", r: 79, gp: "CB" },
    { n: "Bertin Ebwelle", p: "DEF", r: 78, gp: "LB" }, { n: "Emile Mbouh", p: "MID", r: 80, gp: "CDM" },
    { n: "Louis-Paul Mfede", p: "MID", r: 79, gp: "CM" }, { n: "Cyrille Makanaky", p: "MID", r: 81, gp: "CAM" },
    { n: "François Omam-Biyik", p: "FWD", r: 83, gp: "ST" }, { n: "Roger Milla", p: "FWD", r: 86, gp: "ST" },
    { n: "Emmanuel Maboang", p: "FWD", r: 79, gp: "RW" }
  ]);
})();
