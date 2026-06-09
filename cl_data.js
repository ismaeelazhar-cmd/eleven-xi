/* Champions League draftable squads — starter seed (iconic winners). Same shape as WORLD_CUP_DATA.
 * window.CL_DATA = { "Club": { flag, years: { "season": [ {n,p,r,gp} ] } } }
 * Expand freely from a pasted CL squad document. */
window.CL_DATA = {
  "Real Madrid": { flag: "🇪🇸", years: {
    "2002": [
      { n: "Iker Casillas", p: "GK", r: 88, gp: "GK" }, { n: "Míchel Salgado", p: "DEF", r: 82, gp: "RB" },
      { n: "Roberto Carlos", p: "DEF", r: 90, gp: "LB" }, { n: "Fernando Hierro", p: "DEF", r: 85, gp: "CB" },
      { n: "Iván Helguera", p: "DEF", r: 83, gp: "CB" }, { n: "Aitor Karanka", p: "DEF", r: 80, gp: "CB" },
      { n: "Claude Makélélé", p: "MID", r: 86, gp: "CDM" }, { n: "Zinedine Zidane", p: "MID", r: 95, gp: "CAM" },
      { n: "Luís Figo", p: "MID", r: 90, gp: "RW" }, { n: "Steve McManaman", p: "MID", r: 82, gp: "CM" },
      { n: "Santiago Solari", p: "FWD", r: 81, gp: "LW" }, { n: "Raúl", p: "FWD", r: 89, gp: "ST" },
      { n: "Fernando Morientes", p: "FWD", r: 84, gp: "ST" }, { n: "Guti", p: "MID", r: 82, gp: "CAM" }
    ],
    "2014": [
      { n: "Iker Casillas", p: "GK", r: 85, gp: "GK" }, { n: "Dani Carvajal", p: "DEF", r: 82, gp: "RB" },
      { n: "Sergio Ramos", p: "DEF", r: 89, gp: "CB" }, { n: "Pepe", p: "DEF", r: 85, gp: "CB" },
      { n: "Marcelo", p: "DEF", r: 86, gp: "LB" }, { n: "Xabi Alonso", p: "MID", r: 86, gp: "CDM" },
      { n: "Luka Modrić", p: "MID", r: 89, gp: "CM" }, { n: "Toni Kroos", p: "MID", r: 88, gp: "CM" },
      { n: "Ángel Di María", p: "MID", r: 87, gp: "LM" }, { n: "Gareth Bale", p: "FWD", r: 89, gp: "RW" },
      { n: "Cristiano Ronaldo", p: "FWD", r: 94, gp: "LW" }, { n: "Karim Benzema", p: "FWD", r: 88, gp: "ST" },
      { n: "Isco", p: "MID", r: 84, gp: "CAM" }
    ]
  }},
  "Barcelona": { flag: "🇪🇸", years: {
    "2011": [
      { n: "Víctor Valdés", p: "GK", r: 85, gp: "GK" }, { n: "Dani Alves", p: "DEF", r: 87, gp: "RB" },
      { n: "Gerard Piqué", p: "DEF", r: 87, gp: "CB" }, { n: "Carles Puyol", p: "DEF", r: 86, gp: "CB" },
      { n: "Eric Abidal", p: "DEF", r: 83, gp: "LB" }, { n: "Sergio Busquets", p: "MID", r: 86, gp: "CDM" },
      { n: "Xavi", p: "MID", r: 91, gp: "CM" }, { n: "Andrés Iniesta", p: "MID", r: 91, gp: "CM" },
      { n: "Seydou Keita", p: "MID", r: 80, gp: "CM" }, { n: "Lionel Messi", p: "FWD", r: 95, gp: "RW" },
      { n: "David Villa", p: "FWD", r: 88, gp: "LW" }, { n: "Pedro", p: "FWD", r: 84, gp: "RW" },
      { n: "Javier Mascherano", p: "DEF", r: 84, gp: "CB" }
    ]
  }},
  "Bayern Munich": { flag: "🇩🇪", years: {
    "2020": [
      { n: "Manuel Neuer", p: "GK", r: 90, gp: "GK" }, { n: "Joshua Kimmich", p: "DEF", r: 88, gp: "RB" },
      { n: "Benjamin Pavard", p: "DEF", r: 82, gp: "RB" }, { n: "David Alaba", p: "DEF", r: 86, gp: "CB" },
      { n: "Jérôme Boateng", p: "DEF", r: 84, gp: "CB" }, { n: "Alphonso Davies", p: "DEF", r: 85, gp: "LB" },
      { n: "Thiago", p: "MID", r: 86, gp: "CM" }, { n: "Leon Goretzka", p: "MID", r: 84, gp: "CM" },
      { n: "Thomas Müller", p: "MID", r: 86, gp: "CAM" }, { n: "Robert Lewandowski", p: "FWD", r: 92, gp: "ST" },
      { n: "Serge Gnabry", p: "FWD", r: 85, gp: "RW" }, { n: "Kingsley Coman", p: "FWD", r: 84, gp: "LW" },
      { n: "Ivan Perišić", p: "FWD", r: 82, gp: "LW" }
    ]
  }},
  "Liverpool": { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", years: {
    "2019": [
      { n: "Alisson", p: "GK", r: 89, gp: "GK" }, { n: "Trent Alexander-Arnold", p: "DEF", r: 85, gp: "RB" },
      { n: "Virgil van Dijk", p: "DEF", r: 90, gp: "CB" }, { n: "Joël Matip", p: "DEF", r: 82, gp: "CB" },
      { n: "Andrew Robertson", p: "DEF", r: 85, gp: "LB" }, { n: "Fabinho", p: "MID", r: 85, gp: "CDM" },
      { n: "Jordan Henderson", p: "MID", r: 83, gp: "CM" }, { n: "Georginio Wijnaldum", p: "MID", r: 83, gp: "CM" },
      { n: "Mohamed Salah", p: "FWD", r: 90, gp: "RW" }, { n: "Roberto Firmino", p: "FWD", r: 86, gp: "ST" },
      { n: "Sadio Mané", p: "FWD", r: 88, gp: "LW" }, { n: "James Milner", p: "MID", r: 80, gp: "CM" }
    ]
  }},
  "AC Milan": { flag: "🇮🇹", years: {
    "2007": [
      { n: "Dida", p: "GK", r: 84, gp: "GK" }, { n: "Cafu", p: "DEF", r: 84, gp: "RB" },
      { n: "Paolo Maldini", p: "DEF", r: 88, gp: "CB" }, { n: "Alessandro Nesta", p: "DEF", r: 88, gp: "CB" },
      { n: "Marek Jankulovski", p: "DEF", r: 80, gp: "LB" }, { n: "Gennaro Gattuso", p: "MID", r: 84, gp: "CDM" },
      { n: "Andrea Pirlo", p: "MID", r: 89, gp: "CM" }, { n: "Massimo Ambrosini", p: "MID", r: 81, gp: "CM" },
      { n: "Clarence Seedorf", p: "MID", r: 86, gp: "CM" }, { n: "Kaká", p: "MID", r: 92, gp: "CAM" },
      { n: "Filippo Inzaghi", p: "FWD", r: 85, gp: "ST" }, { n: "Alberto Gilardino", p: "FWD", r: 81, gp: "ST" }
    ]
  }},
  "Manchester United": { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", years: {
    "2008": [
      { n: "Edwin van der Sar", p: "GK", r: 86, gp: "GK" }, { n: "Gary Neville", p: "DEF", r: 82, gp: "RB" },
      { n: "Rio Ferdinand", p: "DEF", r: 88, gp: "CB" }, { n: "Nemanja Vidić", p: "DEF", r: 87, gp: "CB" },
      { n: "Patrice Evra", p: "DEF", r: 84, gp: "LB" }, { n: "Owen Hargreaves", p: "MID", r: 82, gp: "CDM" },
      { n: "Michael Carrick", p: "MID", r: 84, gp: "CM" }, { n: "Paul Scholes", p: "MID", r: 86, gp: "CM" },
      { n: "Ryan Giggs", p: "MID", r: 85, gp: "LM" }, { n: "Cristiano Ronaldo", p: "FWD", r: 92, gp: "RW" },
      { n: "Wayne Rooney", p: "FWD", r: 88, gp: "ST" }, { n: "Carlos Tévez", p: "FWD", r: 85, gp: "ST" },
      { n: "Park Ji-sung", p: "MID", r: 80, gp: "RM" }
    ]
  }},
  "Inter Milan": { flag: "🇮🇹", years: {
    "2010": [
      { n: "Júlio César", p: "GK", r: 87, gp: "GK" }, { n: "Maicon", p: "DEF", r: 85, gp: "RB" },
      { n: "Lúcio", p: "DEF", r: 85, gp: "CB" }, { n: "Walter Samuel", p: "DEF", r: 84, gp: "CB" },
      { n: "Cristian Chivu", p: "DEF", r: 80, gp: "LB" }, { n: "Javier Zanetti", p: "DEF", r: 85, gp: "RB" },
      { n: "Esteban Cambiasso", p: "MID", r: 84, gp: "CDM" }, { n: "Thiago Motta", p: "MID", r: 82, gp: "CM" },
      { n: "Wesley Sneijder", p: "MID", r: 88, gp: "CAM" }, { n: "Goran Pandev", p: "FWD", r: 80, gp: "LW" },
      { n: "Diego Milito", p: "FWD", r: 86, gp: "ST" }, { n: "Samuel Eto'o", p: "FWD", r: 88, gp: "RW" }
    ]
  }},
  "Ajax": { flag: "🇳🇱", years: {
    "1995": [
      { n: "Edwin van der Sar", p: "GK", r: 84, gp: "GK" }, { n: "Michael Reiziger", p: "DEF", r: 82, gp: "RB" },
      { n: "Danny Blind", p: "DEF", r: 83, gp: "CB" }, { n: "Frank de Boer", p: "DEF", r: 84, gp: "CB" },
      { n: "Frank Rijkaard", p: "MID", r: 86, gp: "CDM" }, { n: "Edgar Davids", p: "MID", r: 83, gp: "CM" },
      { n: "Clarence Seedorf", p: "MID", r: 84, gp: "CM" }, { n: "Ronald de Boer", p: "MID", r: 82, gp: "CAM" },
      { n: "Marc Overmars", p: "FWD", r: 85, gp: "LW" }, { n: "Finidi George", p: "FWD", r: 81, gp: "RW" },
      { n: "Jari Litmanen", p: "MID", r: 86, gp: "CAM" }, { n: "Patrick Kluivert", p: "FWD", r: 84, gp: "ST" },
      { n: "Nwankwo Kanu", p: "FWD", r: 80, gp: "ST" }
    ]
  }}
};
