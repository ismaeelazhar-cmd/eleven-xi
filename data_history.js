/* data_history.js — Historical seasons (99/00 → 25/26) for La Liga, Serie A, Bundesliga
 * Extends clubs already defined in data_mp.js by merging extra years.
 */
(function(){
  "use strict";
  function ext(data, club, years){
    if(data && data[club]) Object.assign(data[club].years, years);
  }

  /* ═══════════════════════════════════════
     LA LIGA HISTORICAL SEASONS
  ═══════════════════════════════════════ */
  var LL = window.LALIGA_DATA;

  /* ── Real Madrid ── */
  ext(LL, "Real Madrid", {
    "2000": [
      {n:"Iker Casillas",          p:"GK",  r:83, gp:"GK"},
      {n:"Bodo Illgner",           p:"GK",  r:79, gp:"GK"},
      {n:"Michel Salgado",         p:"DEF", r:82, gp:"RB"},
      {n:"Fernando Hierro",        p:"DEF", r:87, gp:"CB"},
      {n:"Fernando Morientes",     p:"FWD", r:82, gp:"ST"},
      {n:"Ivan Helguera",          p:"DEF", r:82, gp:"CB"},
      {n:"Roberto Carlos",         p:"DEF", r:89, gp:"LB"},
      {n:"Geremi",                 p:"MID", r:79, gp:"CM"},
      {n:"Steve McManaman",        p:"MID", r:82, gp:"CM"},
      {n:"Redondo",                p:"MID", r:87, gp:"CDM"},
      {n:"Nicolás Anelka",         p:"FWD", r:85, gp:"ST"},
      {n:"Raúl González",          p:"FWD", r:89, gp:"ST"},
      {n:"Flávio Conceição",       p:"MID", r:78, gp:"CM"},
      {n:"Luis Figo",              p:"FWD", r:91, gp:"RW"},
      {n:"Pedrag Mijatovic",       p:"FWD", r:82, gp:"ST"}
    ],
    "2002": [
      {n:"Iker Casillas",          p:"GK",  r:88, gp:"GK"},
      {n:"César Sánchez",          p:"GK",  r:80, gp:"GK"},
      {n:"Michel Salgado",         p:"DEF", r:82, gp:"RB"},
      {n:"Fernando Hierro",        p:"DEF", r:85, gp:"CB"},
      {n:"Ivan Helguera",          p:"DEF", r:82, gp:"CB"},
      {n:"Roberto Carlos",         p:"DEF", r:90, gp:"LB"},
      {n:"Claude Makélélé",        p:"MID", r:89, gp:"CDM"},
      {n:"Zinedine Zidane",        p:"MID", r:96, gp:"CM"},
      {n:"Steve McManaman",        p:"MID", r:81, gp:"CM"},
      {n:"Luis Figo",              p:"FWD", r:92, gp:"RW"},
      {n:"Ronaldo Nazário",        p:"FWD", r:96, gp:"ST"},
      {n:"Raúl González",          p:"FWD", r:90, gp:"ST"},
      {n:"Fernando Morientes",     p:"FWD", r:84, gp:"ST"},
      {n:"Guti",                   p:"MID", r:82, gp:"CAM"},
      {n:"Flávio Conceição",       p:"MID", r:78, gp:"CM"}
    ],
    "2004": [
      {n:"Iker Casillas",          p:"GK",  r:89, gp:"GK"},
      {n:"Michel Salgado",         p:"DEF", r:80, gp:"RB"},
      {n:"Fernando Hierro",        p:"DEF", r:84, gp:"CB"},
      {n:"Ivan Helguera",          p:"DEF", r:81, gp:"CB"},
      {n:"Roberto Carlos",         p:"DEF", r:88, gp:"LB"},
      {n:"David Beckham",          p:"MID", r:87, gp:"CM"},
      {n:"Zinedine Zidane",        p:"MID", r:94, gp:"CM"},
      {n:"Luis Figo",              p:"FWD", r:90, gp:"RW"},
      {n:"Ronaldo Nazário",        p:"FWD", r:92, gp:"ST"},
      {n:"Raúl González",          p:"FWD", r:89, gp:"ST"},
      {n:"Michael Owen",           p:"FWD", r:86, gp:"ST"},
      {n:"Guti",                   p:"MID", r:83, gp:"CAM"},
      {n:"Gravesen Thomas",        p:"MID", r:80, gp:"CDM"},
      {n:"Ronaldo Salgado",        p:"DEF", r:80, gp:"RB"},
      {n:"Álvaro Arbeloa",         p:"DEF", r:76, gp:"RB"}
    ],
    "2012": [
      {n:"Iker Casillas",          p:"GK",  r:92, gp:"GK"},
      {n:"Diego López",            p:"GK",  r:82, gp:"GK"},
      {n:"Álvaro Arbeloa",         p:"DEF", r:80, gp:"RB"},
      {n:"Sergio Ramos",           p:"DEF", r:90, gp:"CB"},
      {n:"Raphaël Varane",         p:"DEF", r:83, gp:"CB"},
      {n:"Pepe",                   p:"DEF", r:88, gp:"CB"},
      {n:"Marcelo",                p:"DEF", r:88, gp:"LB"},
      {n:"Xabi Alonso",            p:"MID", r:91, gp:"CDM"},
      {n:"Sami Khedira",           p:"MID", r:86, gp:"CM"},
      {n:"Mesut Özil",             p:"MID", r:89, gp:"CAM"},
      {n:"Ángel Di María",         p:"FWD", r:87, gp:"LW"},
      {n:"Cristiano Ronaldo",      p:"FWD", r:96, gp:"LW"},
      {n:"Karim Benzema",          p:"FWD", r:87, gp:"ST"},
      {n:"Gonzalo Higuaín",        p:"FWD", r:86, gp:"ST"},
      {n:"Luka Modrić",            p:"MID", r:88, gp:"CM"}
    ],
    "2022": [
      {n:"Thibaut Courtois",       p:"GK",  r:92, gp:"GK"},
      {n:"Andriy Lunin",           p:"GK",  r:79, gp:"GK"},
      {n:"Dani Carvajal",          p:"DEF", r:86, gp:"RB"},
      {n:"Éder Militão",           p:"DEF", r:86, gp:"CB"},
      {n:"David Alaba",            p:"DEF", r:87, gp:"CB"},
      {n:"Ferland Mendy",          p:"DEF", r:85, gp:"LB"},
      {n:"Casemiro",               p:"MID", r:90, gp:"CDM"},
      {n:"Luka Modrić",            p:"MID", r:91, gp:"CM"},
      {n:"Toni Kroos",             p:"MID", r:91, gp:"CM"},
      {n:"Eduardo Camavinga",      p:"MID", r:83, gp:"CM"},
      {n:"Vinícius Júnior",        p:"FWD", r:89, gp:"LW"},
      {n:"Rodrygo",                p:"FWD", r:85, gp:"RW"},
      {n:"Karim Benzema",          p:"FWD", r:93, gp:"ST"},
      {n:"Fede Valverde",          p:"MID", r:85, gp:"CM"},
      {n:"Marco Asensio",          p:"FWD", r:83, gp:"RW"}
    ]
  });

  /* ── Barcelona ── */
  ext(LL, "Barcelona", {
    "2000": [
      {n:"Ruud Hesp",              p:"GK",  r:79, gp:"GK"},
      {n:"Michael Reiziger",       p:"DEF", r:83, gp:"RB"},
      {n:"Sergi Barjuan",          p:"DEF", r:80, gp:"LB"},
      {n:"Carles Puyol",           p:"DEF", r:81, gp:"CB"},
      {n:"Laurent Blanc",          p:"DEF", r:85, gp:"CB"},
      {n:"Pep Guardiola",          p:"MID", r:86, gp:"CDM"},
      {n:"Xavi Hernández",         p:"MID", r:82, gp:"CM"},
      {n:"Luis Enrique",           p:"MID", r:84, gp:"CM"},
      {n:"Rivaldo",                p:"FWD", r:93, gp:"LW"},
      {n:"Patrick Kluivert",       p:"FWD", r:87, gp:"ST"},
      {n:"Luis Figo",              p:"FWD", r:91, gp:"RW"},
      {n:"Simão Sabrosa",          p:"FWD", r:82, gp:"RW"},
      {n:"Dani García",            p:"MID", r:78, gp:"CM"},
      {n:"Alfonso Pérez",          p:"FWD", r:79, gp:"ST"},
      {n:"Oscar García",           p:"MID", r:78, gp:"CM"}
    ],
    "2006": [
      {n:"Víctor Valdés",          p:"GK",  r:87, gp:"GK"},
      {n:"Carles Puyol",           p:"DEF", r:89, gp:"CB"},
      {n:"Rafael Márquez",         p:"DEF", r:84, gp:"CB"},
      {n:"Oleguer",                p:"DEF", r:78, gp:"RB"},
      {n:"Gianluca Zambrotta",     p:"DEF", r:85, gp:"RB"},
      {n:"Sylvinho",               p:"DEF", r:80, gp:"LB"},
      {n:"Mark van Bommel",        p:"MID", r:84, gp:"CDM"},
      {n:"Edmilson",               p:"MID", r:82, gp:"CDM"},
      {n:"Xavi Hernández",         p:"MID", r:89, gp:"CM"},
      {n:"Andrés Iniesta",         p:"MID", r:87, gp:"CM"},
      {n:"Deco",                   p:"MID", r:87, gp:"CAM"},
      {n:"Ronaldinho",             p:"FWD", r:95, gp:"LW"},
      {n:"Lionel Messi",           p:"FWD", r:86, gp:"RW"},
      {n:"Samuel Eto'o",           p:"FWD", r:89, gp:"ST"},
      {n:"Ludovic Giuly",          p:"FWD", r:82, gp:"RW"}
    ],
    "2012": [
      {n:"Víctor Valdés",          p:"GK",  r:88, gp:"GK"},
      {n:"Dani Alves",             p:"DEF", r:90, gp:"RB"},
      {n:"Carles Puyol",           p:"DEF", r:88, gp:"CB"},
      {n:"Gerard Piqué",           p:"DEF", r:88, gp:"CB"},
      {n:"Jordi Alba",             p:"DEF", r:85, gp:"LB"},
      {n:"Sergio Busquets",        p:"MID", r:91, gp:"CDM"},
      {n:"Xavi Hernández",         p:"MID", r:93, gp:"CM"},
      {n:"Andrés Iniesta",         p:"MID", r:94, gp:"CM"},
      {n:"Cesc Fàbregas",          p:"MID", r:87, gp:"CAM"},
      {n:"Lionel Messi",           p:"FWD", r:99, gp:"RW"},
      {n:"Alexis Sánchez",         p:"FWD", r:86, gp:"LW"},
      {n:"David Villa",            p:"FWD", r:88, gp:"ST"},
      {n:"Pedro Rodríguez",        p:"FWD", r:83, gp:"LW"},
      {n:"Ibrahim Afellay",        p:"FWD", r:79, gp:"LW"},
      {n:"Eric Abidal",            p:"DEF", r:83, gp:"LB"}
    ],
    "2015": [
      {n:"Marc-André ter Stegen",  p:"GK",  r:86, gp:"GK"},
      {n:"Claudio Bravo",          p:"GK",  r:83, gp:"GK"},
      {n:"Dani Alves",             p:"DEF", r:89, gp:"RB"},
      {n:"Gerard Piqué",           p:"DEF", r:88, gp:"CB"},
      {n:"Javier Mascherano",      p:"DEF", r:87, gp:"CB"},
      {n:"Jordi Alba",             p:"DEF", r:86, gp:"LB"},
      {n:"Sergio Busquets",        p:"MID", r:91, gp:"CDM"},
      {n:"Xavi Hernández",         p:"MID", r:90, gp:"CM"},
      {n:"Andrés Iniesta",         p:"MID", r:93, gp:"CM"},
      {n:"Lionel Messi",           p:"FWD", r:98, gp:"RW"},
      {n:"Luis Suárez",            p:"FWD", r:94, gp:"ST"},
      {n:"Neymar",                 p:"FWD", r:93, gp:"LW"},
      {n:"Ivan Rakitić",           p:"MID", r:87, gp:"CM"},
      {n:"Pedro Rodríguez",        p:"FWD", r:84, gp:"RW"},
      {n:"Munir El Haddadi",       p:"FWD", r:79, gp:"ST"}
    ],
    "2019": [
      {n:"Marc-André ter Stegen",  p:"GK",  r:89, gp:"GK"},
      {n:"Nelson Semedo",          p:"DEF", r:82, gp:"RB"},
      {n:"Gerard Piqué",           p:"DEF", r:88, gp:"CB"},
      {n:"Clément Lenglet",        p:"DEF", r:83, gp:"CB"},
      {n:"Jordi Alba",             p:"DEF", r:87, gp:"LB"},
      {n:"Sergio Busquets",        p:"MID", r:90, gp:"CDM"},
      {n:"Arturo Vidal",           p:"MID", r:85, gp:"CM"},
      {n:"Ivan Rakitić",           p:"MID", r:87, gp:"CM"},
      {n:"Lionel Messi",           p:"FWD", r:97, gp:"RW"},
      {n:"Luis Suárez",            p:"FWD", r:91, gp:"ST"},
      {n:"Ousmane Dembélé",        p:"FWD", r:85, gp:"LW"},
      {n:"Philippe Coutinho",      p:"MID", r:86, gp:"CAM"},
      {n:"Malcom",                 p:"FWD", r:80, gp:"RW"},
      {n:"Kevin-Prince Boateng",   p:"FWD", r:79, gp:"ST"},
      {n:"Sergi Roberto",          p:"DEF", r:82, gp:"RB"}
    ]
  });

  /* ── Atlético Madrid ── */
  ext(LL, "Atlético Madrid", {
    "2004": [
      {n:"Germán Burgos",          p:"GK",  r:79, gp:"GK"},
      {n:"Carlos Aguilera",        p:"DEF", r:78, gp:"RB"},
      {n:"Pablo Ibáñez",           p:"DEF", r:79, gp:"CB"},
      {n:"Carlos Secretario",      p:"DEF", r:78, gp:"CB"},
      {n:"Antonio Ufarte",         p:"DEF", r:77, gp:"LB"},
      {n:"Pernía",                 p:"DEF", r:79, gp:"LB"},
      {n:"Movilla",                p:"MID", r:79, gp:"CDM"},
      {n:"Serna",                  p:"MID", r:78, gp:"CM"},
      {n:"Luis García",            p:"MID", r:82, gp:"CM"},
      {n:"Fernando Torres",        p:"FWD", r:83, gp:"ST"},
      {n:"José Antonio Reyes",     p:"FWD", r:82, gp:"LW"},
      {n:"Luís Figo",              p:"FWD", r:78, gp:"RW"},
      {n:"Jorge",                  p:"MID", r:77, gp:"CM"},
      {n:"Musampa",                p:"FWD", r:78, gp:"LW"},
      {n:"José Mari",              p:"FWD", r:79, gp:"ST"}
    ],
    "2021": [
      {n:"Jan Oblak",              p:"GK",  r:92, gp:"GK"},
      {n:"Kieran Trippier",        p:"DEF", r:83, gp:"RB"},
      {n:"José Giménez",           p:"DEF", r:84, gp:"CB"},
      {n:"Stefan Savić",           p:"DEF", r:85, gp:"CB"},
      {n:"Renan Lodi",             p:"DEF", r:82, gp:"LB"},
      {n:"Marcos Llorente",        p:"MID", r:84, gp:"CM"},
      {n:"Koke",                   p:"MID", r:86, gp:"CM"},
      {n:"Thomas Partey",          p:"MID", r:87, gp:"CDM"},
      {n:"Saúl Ñíguez",            p:"MID", r:84, gp:"CM"},
      {n:"João Félix",             p:"FWD", r:87, gp:"CAM"},
      {n:"Ángel Correa",           p:"FWD", r:83, gp:"LW"},
      {n:"Luis Suárez",            p:"FWD", r:88, gp:"ST"},
      {n:"Yannick Carrasco",       p:"FWD", r:84, gp:"LW"},
      {n:"Geoffrey Kondogbia",     p:"MID", r:82, gp:"CDM"},
      {n:"Mario Hermoso",          p:"DEF", r:81, gp:"LB"}
    ]
  });

  /* ── Valencia ── */
  ext(LL, "Valencia", {
    "2002": [
      {n:"Santiago Cañizares",     p:"GK",  r:86, gp:"GK"},
      {n:"David Albelda",          p:"MID", r:83, gp:"CDM"},
      {n:"Rubén Baraja",           p:"MID", r:84, gp:"CM"},
      {n:"Pablo Aimar",            p:"MID", r:87, gp:"CAM"},
      {n:"Vicente Rodríguez",      p:"FWD", r:85, gp:"LW"},
      {n:"John Carew",             p:"FWD", r:82, gp:"ST"},
      {n:"Mista",                  p:"FWD", r:81, gp:"ST"},
      {n:"Miguel Ángel Angulo",    p:"FWD", r:82, gp:"RW"},
      {n:"Amadeo Carboni",         p:"DEF", r:80, gp:"LB"},
      {n:"Carlos Marchena",        p:"DEF", r:81, gp:"CB"},
      {n:"Roberto Ayala",          p:"DEF", r:85, gp:"CB"},
      {n:"Emilio Zubizarreta",     p:"DEF", r:79, gp:"RB"},
      {n:"Rufete",                 p:"MID", r:79, gp:"RW"},
      {n:"Fabio Cannavaro",        p:"DEF", r:87, gp:"CB"},
      {n:"Miguel Palanca",         p:"FWD", r:78, gp:"ST"}
    ],
    "2004": [
      {n:"Santiago Cañizares",     p:"GK",  r:85, gp:"GK"},
      {n:"David Albelda",          p:"MID", r:84, gp:"CDM"},
      {n:"Rubén Baraja",           p:"MID", r:85, gp:"CM"},
      {n:"Pablo Aimar",            p:"MID", r:86, gp:"CAM"},
      {n:"Vicente Rodríguez",      p:"FWD", r:86, gp:"LW"},
      {n:"Fernando Morientes",     p:"FWD", r:84, gp:"ST"},
      {n:"Mista",                  p:"FWD", r:82, gp:"ST"},
      {n:"Miguel Ángel Angulo",    p:"FWD", r:82, gp:"RW"},
      {n:"Amadeo Carboni",         p:"DEF", r:79, gp:"LB"},
      {n:"Carlos Marchena",        p:"DEF", r:82, gp:"CB"},
      {n:"Roberto Ayala",          p:"DEF", r:85, gp:"CB"},
      {n:"Curro Torres",           p:"DEF", r:78, gp:"RB"},
      {n:"Rufete",                 p:"MID", r:79, gp:"RW"},
      {n:"Edu",                    p:"MID", r:80, gp:"CDM"},
      {n:"Miguel Ángel Ferrer",    p:"FWD", r:78, gp:"LW"}
    ]
  });

  /* ── Deportivo La Coruña ── */
  ext(LL, "Deportivo Alavés", {}); // placeholder — Deportivo not in current 24-25 La Liga

  /* ── Sevilla ── */
  ext(LL, "Sevilla", {
    "2007": [
      {n:"Andres Palop",           p:"GK",  r:82, gp:"GK"},
      {n:"Dani Alves",             p:"DEF", r:87, gp:"RB"},
      {n:"Julien Escudé",          p:"DEF", r:81, gp:"CB"},
      {n:"Daniel Alves",           p:"DEF", r:87, gp:"RB"},
      {n:"Adriano",                p:"DEF", r:80, gp:"LB"},
      {n:"Javi Navarro",           p:"DEF", r:82, gp:"CB"},
      {n:"Poulsen",                p:"MID", r:79, gp:"CDM"},
      {n:"Renato",                 p:"MID", r:82, gp:"CM"},
      {n:"Jesús Navas",            p:"FWD", r:84, gp:"RW"},
      {n:"Freddie Kanouté",        p:"FWD", r:87, gp:"ST"},
      {n:"Luis Fabiano",           p:"FWD", r:87, gp:"ST"},
      {n:"José Antonio Reyes",     p:"FWD", r:83, gp:"LW"},
      {n:"Enzo Maresca",           p:"MID", r:81, gp:"CM"},
      {n:"Ivan Rakitic",           p:"MID", r:80, gp:"CM"},
      {n:"Frédéric Kanouté",       p:"FWD", r:87, gp:"ST"}
    ],
    "2016": [
      {n:"Sergio Rico",            p:"GK",  r:81, gp:"GK"},
      {n:"Coke",                   p:"DEF", r:79, gp:"RB"},
      {n:"Daniel Carriço",         p:"DEF", r:79, gp:"CB"},
      {n:"Timothée Kolodziejczak", p:"DEF", r:78, gp:"CB"},
      {n:"Mariano",                p:"DEF", r:78, gp:"LB"},
      {n:"Grzegorz Krychowiak",    p:"MID", r:84, gp:"CDM"},
      {n:"Ivan Rakitić",           p:"MID", r:83, gp:"CM"},
      {n:"Éver Banega",            p:"MID", r:83, gp:"CAM"},
      {n:"Jesús Navas",            p:"FWD", r:83, gp:"RW"},
      {n:"Kevin Gameiro",          p:"FWD", r:83, gp:"ST"},
      {n:"Fernando Llorente",      p:"FWD", r:83, gp:"ST"},
      {n:"Carlos Bacca",           p:"FWD", r:83, gp:"ST"},
      {n:"Vitolo",                 p:"FWD", r:82, gp:"LW"},
      {n:"Michael Krohn-Dehli",    p:"MID", r:79, gp:"CM"},
      {n:"Aleix Vidal",            p:"DEF", r:80, gp:"RB"}
    ]
  });

  /* ── Celta Vigo ── */
  ext(LL, "Celta Vigo", {
    "2001": [
      {n:"Antúnez",               p:"GK",  r:79, gp:"GK"},
      {n:"Vagner",                p:"DEF", r:78, gp:"RB"},
      {n:"Mjallby",               p:"DEF", r:79, gp:"CB"},
      {n:"Juanfran",              p:"DEF", r:78, gp:"CB"},
      {n:"Catanha",               p:"DEF", r:77, gp:"LB"},
      {n:"Sylvinho",              p:"DEF", r:79, gp:"LB"},
      {n:"Gustavo López",         p:"MID", r:80, gp:"CDM"},
      {n:"Mauro Silva",           p:"MID", r:83, gp:"CDM"},
      {n:"Karpin",                p:"MID", r:80, gp:"CM"},
      {n:"Mostovoi",              p:"MID", r:83, gp:"CAM"},
      {n:"Claude Makélélé",       p:"MID", r:86, gp:"CDM"},
      {n:"Revivo",                p:"MID", r:79, gp:"CM"},
      {n:"Jesuli",                p:"FWD", r:79, gp:"RW"},
      {n:"Éduardo Camavinga",     p:"FWD", r:78, gp:"LW"},
      {n:"Sávio",                 p:"FWD", r:84, gp:"ST"}
    ]
  });

  /* ── Real Sociedad (early 2000s La Liga title contenders) ── */
  ext(LL, "Real Sociedad", {
    "2003": [
      {n:"Sander Westerveld",     p:"GK",  r:79, gp:"GK"},
      {n:"López Rekarte",         p:"DEF", r:78, gp:"RB"},
      {n:"Javier de Pedro",       p:"MID", r:80, gp:"CM"},
      {n:"Xabi Alonso",           p:"MID", r:85, gp:"CM"},
      {n:"Alberto de la Bella",   p:"DEF", r:77, gp:"LB"},
      {n:"Aurtenetxe",            p:"DEF", r:77, gp:"CB"},
      {n:"Igor Gabilondo",        p:"DEF", r:78, gp:"CB"},
      {n:"Nihat Kahveci",         p:"FWD", r:84, gp:"ST"},
      {n:"Darko Kovacevic",       p:"FWD", r:83, gp:"ST"},
      {n:"John Toshack",          p:"FWD", r:77, gp:"LW"},
      {n:"Kovacevic Darko",       p:"FWD", r:83, gp:"ST"},
      {n:"Llorente Fernando",     p:"FWD", r:79, gp:"ST"},
      {n:"Aranburu",              p:"MID", r:78, gp:"RW"},
      {n:"Gracia",                p:"MID", r:78, gp:"CDM"},
      {n:"Arzu",                  p:"DEF", r:77, gp:"RB"}
    ]
  });

  /* ═══════════════════════════════════════
     SERIE A HISTORICAL SEASONS
  ═══════════════════════════════════════ */
  var SA = window.SERIEA_DATA;

  /* ── Inter Milan ── */
  ext(SA, "Inter Milan", {
    "2003": [
      {n:"Toldo Francesco",        p:"GK",  r:85, gp:"GK"},
      {n:"Júlio César",            p:"GK",  r:80, gp:"GK"},
      {n:"Javier Zanetti",         p:"DEF", r:88, gp:"RB"},
      {n:"Iván Córdoba",           p:"DEF", r:84, gp:"CB"},
      {n:"Marco Materazzi",        p:"DEF", r:82, gp:"CB"},
      {n:"Fabio Cannavaro",        p:"DEF", r:88, gp:"CB"},
      {n:"Emre",                   p:"MID", r:80, gp:"CM"},
      {n:"Esteban Cambiasso",      p:"MID", r:85, gp:"CDM"},
      {n:"Christian Vieri",        p:"FWD", r:91, gp:"ST"},
      {n:"Álvaro Recoba",          p:"FWD", r:85, gp:"CAM"},
      {n:"Hernán Crespo",          p:"FWD", r:88, gp:"ST"},
      {n:"Andy van der Meyde",     p:"FWD", r:79, gp:"RW"},
      {n:"Sérgio Conceição",       p:"FWD", r:80, gp:"LW"},
      {n:"Francesco Coco",         p:"DEF", r:78, gp:"LB"},
      {n:"Obafemi Martins",        p:"FWD", r:79, gp:"ST"}
    ],
    "2007": [
      {n:"Júlio César",            p:"GK",  r:86, gp:"GK"},
      {n:"Javier Zanetti",         p:"DEF", r:86, gp:"RB"},
      {n:"Maicon",                 p:"DEF", r:87, gp:"RB"},
      {n:"Iván Córdoba",           p:"DEF", r:83, gp:"CB"},
      {n:"Marco Materazzi",        p:"DEF", r:81, gp:"CB"},
      {n:"Esteban Cambiasso",      p:"MID", r:86, gp:"CDM"},
      {n:"Zlatan Ibrahimović",     p:"FWD", r:92, gp:"ST"},
      {n:"Adriano",                p:"FWD", r:88, gp:"ST"},
      {n:"Hernán Crespo",          p:"FWD", r:85, gp:"ST"},
      {n:"Dejan Stanković",        p:"MID", r:84, gp:"CM"},
      {n:"Patrick Vieira",         p:"MID", r:86, gp:"CM"},
      {n:"Luis Figo",              p:"FWD", r:84, gp:"RW"},
      {n:"Maxwell",                p:"DEF", r:80, gp:"LB"},
      {n:"Sulley Muntari",         p:"MID", r:80, gp:"CM"},
      {n:"Cruz Julio",             p:"FWD", r:82, gp:"ST"}
    ]
  });

  /* ── Juventus ── */
  ext(SA, "Juventus", {
    "2000": [
      {n:"Edwin van der Sar",      p:"GK",  r:87, gp:"GK"},
      {n:"Ciro Ferrara",           p:"DEF", r:84, gp:"CB"},
      {n:"Mark Iuliano",           p:"DEF", r:79, gp:"CB"},
      {n:"Lilian Thuram",          p:"DEF", r:87, gp:"RB"},
      {n:"Paolo Montero",          p:"DEF", r:82, gp:"CB"},
      {n:"Edgar Davids",           p:"MID", r:88, gp:"CDM"},
      {n:"Zinedine Zidane",        p:"MID", r:96, gp:"CM"},
      {n:"Antonio Conte",          p:"MID", r:83, gp:"CM"},
      {n:"Alessandro Del Piero",   p:"FWD", r:92, gp:"CAM"},
      {n:"Filippo Inzaghi",        p:"FWD", r:88, gp:"ST"},
      {n:"Thierry Henry",          p:"FWD", r:87, gp:"LW"},
      {n:"Didier Deschamps",       p:"MID", r:84, gp:"CDM"},
      {n:"Nicola Amoruso",         p:"FWD", r:78, gp:"ST"},
      {n:"Mauro German Camoranesi",p:"FWD", r:80, gp:"RW"},
      {n:"Darko Kovacevic",        p:"FWD", r:80, gp:"ST"}
    ],
    "2003": [
      {n:"Gianluigi Buffon",       p:"GK",  r:91, gp:"GK"},
      {n:"Lilian Thuram",          p:"DEF", r:86, gp:"RB"},
      {n:"Marcello Zambrotta",     p:"DEF", r:84, gp:"LB"},
      {n:"Ciro Ferrara",           p:"DEF", r:83, gp:"CB"},
      {n:"Paolo Montero",          p:"DEF", r:82, gp:"CB"},
      {n:"Edgar Davids",           p:"MID", r:86, gp:"CDM"},
      {n:"Pavel Nedvěd",           p:"MID", r:91, gp:"CM"},
      {n:"Claudio Marchisio",      p:"MID", r:80, gp:"CM"},
      {n:"Alessandro Del Piero",   p:"FWD", r:93, gp:"CAM"},
      {n:"David Trezeguet",        p:"FWD", r:89, gp:"ST"},
      {n:"Mauro Camoranesi",       p:"FWD", r:82, gp:"RW"},
      {n:"Allessio Tacchinardi",   p:"MID", r:80, gp:"CDM"},
      {n:"Emerson",                p:"MID", r:83, gp:"CDM"},
      {n:"Mark Iuliano",           p:"DEF", r:79, gp:"CB"},
      {n:"Ciro Ferrara",           p:"DEF", r:83, gp:"CB"}
    ],
    "2013": [
      {n:"Gianluigi Buffon",       p:"GK",  r:91, gp:"GK"},
      {n:"Giorgio Chiellini",      p:"DEF", r:88, gp:"CB"},
      {n:"Leonardo Bonucci",       p:"DEF", r:87, gp:"CB"},
      {n:"Andrea Barzagli",        p:"DEF", r:86, gp:"CB"},
      {n:"Stephan Lichtsteiner",   p:"DEF", r:84, gp:"RB"},
      {n:"Kwadwo Asamoah",         p:"DEF", r:82, gp:"LB"},
      {n:"Arturo Vidal",           p:"MID", r:90, gp:"CM"},
      {n:"Andrea Pirlo",           p:"MID", r:92, gp:"CDM"},
      {n:"Claudio Marchisio",      p:"MID", r:86, gp:"CM"},
      {n:"Paul Pogba",             p:"MID", r:85, gp:"CM"},
      {n:"Alessandro Del Piero",   p:"FWD", r:88, gp:"CAM"},
      {n:"Carlos Tévez",           p:"FWD", r:90, gp:"ST"},
      {n:"Mirko Vucinic",          p:"FWD", r:83, gp:"ST"},
      {n:"Alessandro Matri",       p:"FWD", r:80, gp:"ST"},
      {n:"Simone Padoin",          p:"MID", r:76, gp:"CM"}
    ],
    "2019": [
      {n:"Wojciech Szczęsny",      p:"GK",  r:86, gp:"GK"},
      {n:"Mattia Perin",           p:"GK",  r:79, gp:"GK"},
      {n:"João Cancelo",           p:"DEF", r:85, gp:"RB"},
      {n:"Giorgio Chiellini",      p:"DEF", r:90, gp:"CB"},
      {n:"Leonardo Bonucci",       p:"DEF", r:89, gp:"CB"},
      {n:"Alex Sandro",            p:"DEF", r:85, gp:"LB"},
      {n:"Rodrigo Bentancur",      p:"MID", r:82, gp:"CM"},
      {n:"Sami Khedira",           p:"MID", r:84, gp:"CM"},
      {n:"Miralem Pjanić",         p:"MID", r:88, gp:"CDM"},
      {n:"Cristiano Ronaldo",      p:"FWD", r:95, gp:"LW"},
      {n:"Paulo Dybala",           p:"FWD", r:90, gp:"CAM"},
      {n:"Mario Mandžukić",        p:"FWD", r:84, gp:"ST"},
      {n:"Federico Bernardeschi",  p:"FWD", r:82, gp:"RW"},
      {n:"Blaise Matuidi",         p:"MID", r:84, gp:"CM"},
      {n:"Douglas Costa",          p:"FWD", r:84, gp:"RW"}
    ]
  });

  /* ── AC Milan ── */
  ext(SA, "AC Milan", {
    "2004": [
      {n:"Dida",                   p:"GK",  r:87, gp:"GK"},
      {n:"Cafu",                   p:"DEF", r:87, gp:"RB"},
      {n:"Alessandro Nesta",       p:"DEF", r:91, gp:"CB"},
      {n:"Paolo Maldini",          p:"DEF", r:88, gp:"LB"},
      {n:"Jaap Stam",              p:"DEF", r:86, gp:"CB"},
      {n:"Gennaro Gattuso",        p:"MID", r:85, gp:"CDM"},
      {n:"Andrea Pirlo",           p:"MID", r:91, gp:"CDM"},
      {n:"Clarence Seedorf",       p:"MID", r:87, gp:"CM"},
      {n:"Kaká",                   p:"MID", r:92, gp:"CAM"},
      {n:"Andriy Shevchenko",      p:"FWD", r:93, gp:"ST"},
      {n:"Filippo Inzaghi",        p:"FWD", r:84, gp:"ST"},
      {n:"Rui Costa",              p:"MID", r:85, gp:"CAM"},
      {n:"Jon Dahl Tomasson",      p:"FWD", r:80, gp:"ST"},
      {n:"Rivaldo",                p:"FWD", r:85, gp:"LW"},
      {n:"Kakha Kaladze",          p:"DEF", r:80, gp:"LB"}
    ],
    "2007": [
      {n:"Dida",                   p:"GK",  r:85, gp:"GK"},
      {n:"Cafu",                   p:"DEF", r:83, gp:"RB"},
      {n:"Alessandro Nesta",       p:"DEF", r:90, gp:"CB"},
      {n:"Paolo Maldini",          p:"DEF", r:85, gp:"LB"},
      {n:"Massimo Oddo",           p:"DEF", r:81, gp:"RB"},
      {n:"Gennaro Gattuso",        p:"MID", r:86, gp:"CDM"},
      {n:"Andrea Pirlo",           p:"MID", r:92, gp:"CDM"},
      {n:"Clarence Seedorf",       p:"MID", r:85, gp:"CM"},
      {n:"Kaká",                   p:"MID", r:95, gp:"CAM"},
      {n:"Andriy Shevchenko",      p:"FWD", r:90, gp:"ST"},
      {n:"Filippo Inzaghi",        p:"FWD", r:84, gp:"ST"},
      {n:"Alberto Gilardino",      p:"FWD", r:82, gp:"ST"},
      {n:"Serginho",               p:"FWD", r:80, gp:"LW"},
      {n:"Vogel Johann",           p:"MID", r:79, gp:"CDM"},
      {n:"Giuseppe Favalli",       p:"DEF", r:78, gp:"LB"}
    ]
  });

  /* ── Roma ── */
  ext(SA, "Roma", {
    "2001": [
      {n:"Francesco Antonioli",    p:"GK",  r:82, gp:"GK"},
      {n:"Cafu",                   p:"DEF", r:89, gp:"RB"},
      {n:"Jonathan Zebina",        p:"DEF", r:79, gp:"CB"},
      {n:"Walter Samuel",          p:"DEF", r:86, gp:"CB"},
      {n:"Aldair",                 p:"DEF", r:84, gp:"CB"},
      {n:"Vincent Candela",        p:"DEF", r:81, gp:"LB"},
      {n:"Emerson",                p:"MID", r:84, gp:"CDM"},
      {n:"Damiano Tommasi",        p:"MID", r:83, gp:"CM"},
      {n:"Francesco Totti",        p:"FWD", r:93, gp:"CAM"},
      {n:"Gabriel Batistuta",      p:"FWD", r:92, gp:"ST"},
      {n:"Vincenzo Montella",      p:"FWD", r:86, gp:"ST"},
      {n:"Philippe Mexès",         p:"DEF", r:81, gp:"CB"},
      {n:"Cafú cafu",              p:"DEF", r:89, gp:"RB"},
      {n:"Amedeo Carboni",         p:"DEF", r:80, gp:"LB"},
      {n:"Antonio Cassano",        p:"FWD", r:83, gp:"LW"}
    ]
  });

  /* ── Lazio ── */
  ext(SA, "Lazio", {
    "2000": [
      {n:"Angelo Peruzzi",         p:"GK",  r:85, gp:"GK"},
      {n:"Siniša Mihajlović",      p:"DEF", r:86, gp:"LB"},
      {n:"Fernando Couto",         p:"DEF", r:84, gp:"CB"},
      {n:"Alessandro Nesta",       p:"DEF", r:88, gp:"CB"},
      {n:"Jaap Stam",              p:"DEF", r:87, gp:"CB"},
      {n:"Diego Simeone",          p:"MID", r:86, gp:"CDM"},
      {n:"Juan Verón",             p:"MID", r:90, gp:"CM"},
      {n:"Dejan Stanković",        p:"MID", r:83, gp:"CM"},
      {n:"Marcelo Salas",          p:"FWD", r:86, gp:"ST"},
      {n:"Hernán Crespo",          p:"FWD", r:89, gp:"ST"},
      {n:"Pavel Nedvěd",           p:"MID", r:89, gp:"LW"},
      {n:"Roberto Mancini",        p:"FWD", r:82, gp:"CAM"},
      {n:"Sérgio Conceição",       p:"FWD", r:81, gp:"RW"},
      {n:"Giuseppe Pancaro",       p:"DEF", r:78, gp:"LB"},
      {n:"Matías Almeyda",         p:"MID", r:79, gp:"CM"}
    ]
  });

  /* ── Napoli ── */
  ext(SA, "Napoli", {
    "2011": [
      {n:"Morgan De Sanctis",      p:"GK",  r:83, gp:"GK"},
      {n:"Christian Maggio",       p:"DEF", r:81, gp:"RB"},
      {n:"Giorgio Cannavaro",      p:"DEF", r:81, gp:"CB"},
      {n:"Paolo Cannavaro",        p:"DEF", r:80, gp:"CB"},
      {n:"Juan Zuniga",            p:"DEF", r:79, gp:"LB"},
      {n:"Gokhan Inler",           p:"MID", r:83, gp:"CDM"},
      {n:"Marek Hamšík",           p:"MID", r:88, gp:"CM"},
      {n:"Walter Gargano",         p:"MID", r:80, gp:"CDM"},
      {n:"Edinson Cavani",         p:"FWD", r:89, gp:"ST"},
      {n:"Ezequiel Lavezzi",       p:"FWD", r:86, gp:"LW"},
      {n:"Blerim Dzemaili",        p:"MID", r:79, gp:"CM"},
      {n:"Slovenian Pandev",       p:"FWD", r:82, gp:"LW"},
      {n:"Salvatore Aronica",      p:"DEF", r:77, gp:"CB"},
      {n:"Fabio Quagliarella",     p:"FWD", r:82, gp:"ST"},
      {n:"Roberto Insigne",        p:"FWD", r:78, gp:"LW"}
    ]
  });

  /* ── Atalanta ── */
  ext(SA, "Atalanta", {
    "2020": [
      {n:"Pierluigi Gollini",      p:"GK",  r:80, gp:"GK"},
      {n:"Hans Hateboer",          p:"DEF", r:81, gp:"RWB"},
      {n:"José Palomino",          p:"DEF", r:80, gp:"CB"},
      {n:"Cristian Romero",        p:"DEF", r:83, gp:"CB"},
      {n:"Berat Djimsiti",         p:"DEF", r:79, gp:"CB"},
      {n:"Robin Gosens",           p:"DEF", r:83, gp:"LWB"},
      {n:"Marten de Roon",         p:"MID", r:82, gp:"CDM"},
      {n:"Remo Freuler",           p:"MID", r:82, gp:"CM"},
      {n:"Mario Pašalić",          p:"MID", r:81, gp:"CM"},
      {n:"Alejandro Gómez",        p:"FWD", r:88, gp:"CAM"},
      {n:"Duván Zapata",           p:"FWD", r:87, gp:"ST"},
      {n:"Luis Muriel",            p:"FWD", r:84, gp:"ST"},
      {n:"Josip Iličić",           p:"FWD", r:87, gp:"CAM"},
      {n:"Ruslan Malinovskyi",     p:"MID", r:82, gp:"CM"},
      {n:"Timothy Castagne",       p:"DEF", r:79, gp:"RB"}
    ]
  });

  /* ═══════════════════════════════════════
     BUNDESLIGA HISTORICAL SEASONS
  ═══════════════════════════════════════ */
  var BL = window.BUNDESLIGA_DATA;

  /* ── Bayern Munich ── */
  ext(BL, "Bayern Munich", {
    "2001": [
      {n:"Oliver Kahn",            p:"GK",  r:94, gp:"GK"},
      {n:"Sven Ulreich",           p:"GK",  r:74, gp:"GK"},
      {n:"Bixente Lizarazu",       p:"DEF", r:87, gp:"LB"},
      {n:"Thomas Linke",           p:"DEF", r:81, gp:"CB"},
      {n:"Samuel Kuffour",         p:"DEF", r:82, gp:"CB"},
      {n:"Willy Sagnol",           p:"DEF", r:84, gp:"RB"},
      {n:"Stefan Effenberg",       p:"MID", r:90, gp:"CM"},
      {n:"Mehmet Scholl",          p:"MID", r:85, gp:"CAM"},
      {n:"Owen Hargreaves",        p:"MID", r:82, gp:"CDM"},
      {n:"Paulo Sérgio",           p:"FWD", r:80, gp:"LW"},
      {n:"Giovane Élber",          p:"FWD", r:87, gp:"ST"},
      {n:"Carsten Jancker",        p:"FWD", r:81, gp:"ST"},
      {n:"Patrik Andersson",       p:"DEF", r:81, gp:"CB"},
      {n:"Niko Kovač",             p:"MID", r:79, gp:"CM"},
      {n:"Alexander Zickler",      p:"FWD", r:79, gp:"ST"}
    ],
    "2014": [
      {n:"Manuel Neuer",           p:"GK",  r:92, gp:"GK"},
      {n:"Sven Ulreich",           p:"GK",  r:78, gp:"GK"},
      {n:"Philipp Lahm",           p:"DEF", r:92, gp:"RB"},
      {n:"Jérôme Boateng",         p:"DEF", r:88, gp:"CB"},
      {n:"Dante",                  p:"DEF", r:83, gp:"CB"},
      {n:"David Alaba",            p:"DEF", r:86, gp:"LB"},
      {n:"Bastian Schweinsteiger", p:"MID", r:89, gp:"CM"},
      {n:"Toni Kroos",             p:"MID", r:90, gp:"CM"},
      {n:"Xabi Alonso",            p:"MID", r:88, gp:"CDM"},
      {n:"Thomas Müller",          p:"FWD", r:88, gp:"CAM"},
      {n:"Arjen Robben",           p:"FWD", r:90, gp:"RW"},
      {n:"Franck Ribéry",          p:"FWD", r:90, gp:"LW"},
      {n:"Robert Lewandowski",     p:"FWD", r:89, gp:"ST"},
      {n:"Mario Götze",            p:"FWD", r:86, gp:"CAM"},
      {n:"Rafinha",                p:"DEF", r:79, gp:"RB"}
    ],
    "2020": [
      {n:"Manuel Neuer",           p:"GK",  r:93, gp:"GK"},
      {n:"Sven Ulreich",           p:"GK",  r:78, gp:"GK"},
      {n:"Benjamin Pavard",        p:"DEF", r:84, gp:"RB"},
      {n:"Jérôme Boateng",         p:"DEF", r:86, gp:"CB"},
      {n:"David Alaba",            p:"DEF", r:88, gp:"CB"},
      {n:"Alphonso Davies",        p:"DEF", r:87, gp:"LB"},
      {n:"Joshua Kimmich",         p:"MID", r:90, gp:"CDM"},
      {n:"Leon Goretzka",          p:"MID", r:86, gp:"CM"},
      {n:"Thiago Alcântara",       p:"MID", r:90, gp:"CM"},
      {n:"Thomas Müller",          p:"FWD", r:88, gp:"CAM"},
      {n:"Serge Gnabry",           p:"FWD", r:87, gp:"RW"},
      {n:"Kingsley Coman",         p:"FWD", r:86, gp:"LW"},
      {n:"Robert Lewandowski",     p:"FWD", r:95, gp:"ST"},
      {n:"Philippe Coutinho",      p:"MID", r:85, gp:"CAM"},
      {n:"Ivan Perišić",           p:"FWD", r:83, gp:"LW"}
    ]
  });

  /* ── Borussia Dortmund ── */
  ext(BL, "Borussia Dortmund", {
    "2002": [
      {n:"Jens Lehmann",           p:"GK",  r:85, gp:"GK"},
      {n:"Stefan Reuter",          p:"DEF", r:82, gp:"RB"},
      {n:"Christoph Metzelder",    p:"DEF", r:82, gp:"CB"},
      {n:"Jan Koller",             p:"FWD", r:86, gp:"ST"},
      {n:"Jürgen Kohler",          p:"DEF", r:84, gp:"CB"},
      {n:"Dede",                   p:"DEF", r:83, gp:"LB"},
      {n:"Tomáš Rosický",          p:"MID", r:87, gp:"CAM"},
      {n:"Lars Ricken",            p:"MID", r:81, gp:"CM"},
      {n:"Christian Wörns",        p:"DEF", r:82, gp:"CB"},
      {n:"Victor Ikpeba",          p:"FWD", r:80, gp:"ST"},
      {n:"Marcio Amoroso",         p:"FWD", r:87, gp:"ST"},
      {n:"Sven Bender",            p:"MID", r:79, gp:"CDM"},
      {n:"Evanilson",              p:"DEF", r:78, gp:"CB"},
      {n:"Ewerthon",               p:"FWD", r:83, gp:"LW"},
      {n:"Fredi Bobic",            p:"FWD", r:80, gp:"ST"}
    ],
    "2019": [
      {n:"Roman Bürki",            p:"GK",  r:82, gp:"GK"},
      {n:"Marwin Hitz",            p:"GK",  r:76, gp:"GK"},
      {n:"Achraf Hakimi",          p:"DEF", r:83, gp:"RB"},
      {n:"Manuel Akanji",          p:"DEF", r:81, gp:"CB"},
      {n:"Łukasz Piszczek",        p:"DEF", r:82, gp:"RB"},
      {n:"Dan-Axel Zagadou",       p:"DEF", r:78, gp:"CB"},
      {n:"Abdou Diallo",           p:"DEF", r:79, gp:"CB"},
      {n:"Thomas Delaney",         p:"MID", r:80, gp:"CDM"},
      {n:"Axel Witsel",            p:"MID", r:84, gp:"CDM"},
      {n:"Mario Götze",            p:"MID", r:83, gp:"CAM"},
      {n:"Marco Reus",             p:"FWD", r:89, gp:"CAM"},
      {n:"Jadon Sancho",           p:"FWD", r:87, gp:"RW"},
      {n:"Paco Alcácer",           p:"FWD", r:83, gp:"ST"},
      {n:"Raphaël Guerreiro",      p:"DEF", r:81, gp:"LB"},
      {n:"Jacob Bruun Larsen",     p:"FWD", r:78, gp:"LW"}
    ]
  });

  /* ── Bayer Leverkusen ── */
  ext(BL, "Bayer Leverkusen", {
    "2002": [
      {n:"Hans-Jörg Butt",         p:"GK",  r:83, gp:"GK"},
      {n:"Lúcio",                  p:"DEF", r:88, gp:"CB"},
      {n:"Jens Nowotny",           p:"DEF", r:83, gp:"CB"},
      {n:"Zé Roberto",             p:"DEF", r:85, gp:"LB"},
      {n:"Carsten Ramelow",        p:"DEF", r:82, gp:"CB"},
      {n:"Marko Babić",            p:"MID", r:79, gp:"CDM"},
      {n:"Yildiray Bastürk",       p:"MID", r:82, gp:"CM"},
      {n:"Bernd Schneider",        p:"MID", r:84, gp:"CM"},
      {n:"Michael Ballack",        p:"MID", r:91, gp:"CM"},
      {n:"Dimitar Berbatov",       p:"FWD", r:87, gp:"ST"},
      {n:"Ulf Kirsten",            p:"FWD", r:82, gp:"ST"},
      {n:"Oliver Neuville",        p:"FWD", r:82, gp:"LW"},
      {n:"Jan Simák",              p:"MID", r:78, gp:"CM"},
      {n:"Andrés D'Alessandro",    p:"MID", r:80, gp:"CM"},
      {n:"Thomas Brdarić",         p:"FWD", r:79, gp:"ST"}
    ]
  });

  /* ── Schalke 04 ── */
  ext(BL, "VfL Wolfsburg", {
    "2009": [
      {n:"Edin Džeko",             p:"FWD", r:86, gp:"ST"},
      {n:"Grafite",                p:"FWD", r:87, gp:"ST"},
      {n:"Misimović Zvjezdan",     p:"MID", r:85, gp:"CAM"},
      {n:"Diego Benaglio",         p:"GK",  r:83, gp:"GK"},
      {n:"Facundo Quiñones",       p:"DEF", r:78, gp:"CB"},
      {n:"Jan Polák",              p:"MID", r:79, gp:"CM"},
      {n:"Marcel Schäfer",         p:"DEF", r:79, gp:"LB"},
      {n:"Andrea Barzagli",        p:"DEF", r:84, gp:"CB"},
      {n:"Cristian Zaccardo",      p:"DEF", r:79, gp:"RB"},
      {n:"Sascha Riether",         p:"DEF", r:78, gp:"RB"},
      {n:"Alexander Madlung",      p:"DEF", r:78, gp:"CB"},
      {n:"Patrick Ochs",           p:"DEF", r:77, gp:"LB"},
      {n:"Bas Dost",               p:"FWD", r:79, gp:"ST"},
      {n:"Thomas Kahlenberg",      p:"MID", r:79, gp:"CM"},
      {n:"Josué",                  p:"MID", r:83, gp:"CDM"}
    ]
  });

  /* ── Werder Bremen (2004 Champions) ── */
  ext(BL, "Werder Bremen", {
    "2004": [
      {n:"Tim Wiese",              p:"GK",  r:80, gp:"GK"},
      {n:"Frank Baumann",          p:"MID", r:81, gp:"CDM"},
      {n:"Johan Micoud",           p:"MID", r:84, gp:"CAM"},
      {n:"Torsten Frings",         p:"MID", r:85, gp:"CDM"},
      {n:"Ivan Klasnić",           p:"FWD", r:84, gp:"ST"},
      {n:"Aílton",                 p:"FWD", r:87, gp:"ST"},
      {n:"Andreas Herzog",         p:"MID", r:80, gp:"CM"},
      {n:"Markus Daun",            p:"DEF", r:78, gp:"CB"},
      {n:"Chidi Odiah",            p:"DEF", r:78, gp:"RB"},
      {n:"Dusko Tosic",            p:"DEF", r:78, gp:"LB"},
      {n:"Christian Schulz",       p:"DEF", r:79, gp:"LB"},
      {n:"Naldo",                  p:"DEF", r:82, gp:"CB"},
      {n:"Valérien Ismaël",        p:"DEF", r:80, gp:"CB"},
      {n:"Danijel Ljuboja",        p:"FWD", r:80, gp:"ST"},
      {n:"Fabian Ernst",           p:"MID", r:80, gp:"CM"}
    ]
  });

  /* ── SC Freiburg (Streich era) ── */
  ext(BL, "SC Freiburg", {
    "2022": [
      {n:"Mark Flekken",           p:"GK",  r:82, gp:"GK"},
      {n:"Lukas Kübler",           p:"DEF", r:78, gp:"RB"},
      {n:"Nico Schlotterbeck",     p:"DEF", r:83, gp:"CB"},
      {n:"Philipp Lienhart",       p:"DEF", r:78, gp:"CB"},
      {n:"Christian Günter",       p:"DEF", r:80, gp:"LB"},
      {n:"Nicolas Höfler",         p:"MID", r:79, gp:"CDM"},
      {n:"Maximilian Eggestein",   p:"MID", r:79, gp:"CM"},
      {n:"Ritsu Doan",             p:"FWD", r:81, gp:"CAM"},
      {n:"Vincenzo Grifo",         p:"FWD", r:82, gp:"LW"},
      {n:"Roland Sallai",          p:"FWD", r:80, gp:"RW"},
      {n:"Michael Gregoritsch",    p:"FWD", r:81, gp:"ST"},
      {n:"Lucas Höler",            p:"FWD", r:79, gp:"ST"},
      {n:"Nils Petersen",          p:"FWD", r:81, gp:"ST"},
      {n:"Kiliann Sildillia",      p:"DEF", r:78, gp:"RB"},
      {n:"Woo-Yeong Jeong",        p:"MID", r:79, gp:"CM"}
    ]
  });

})();
