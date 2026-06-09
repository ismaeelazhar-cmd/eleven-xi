/* data_patches.js — Fix missing players in existing squads & add critical missing squads.
 * Runs after all data files. Direct array mutation patches entries with missing stars.
 */
(function () {
  var D = window.WORLD_CUP_DATA;
  if (!D) return;

  /* ── add player to squad if not already present ─────────────────── */
  function inject(country, year, players) {
    if (!D[country] || !D[country].years[year]) return;
    var squad = D[country].years[year];
    var names = squad.map(function (p) { return p.n; });
    players.forEach(function (p) {
      if (names.indexOf(p.n) < 0) squad.push(p);
    });
  }

  /* ── add brand-new squad only if not already present ────────────── */
  function addSquad(country, flag, year, players) {
    if (!D[country]) D[country] = { flag: flag, years: {} };
    if (!D[country].years[year]) D[country].years[year] = players;
  }

  /* ═══════════════════════════════════════════════════════════════════
     1.  PATCH EXISTING SQUADS — add missing star players
     ═══════════════════════════════════════════════════════════════════ */

  /* Argentina 2006 — Messi played 3 games, scored vs Serbia & Montenegro */
  inject("Argentina", "2006", [
    {n:"Lionel Messi",         p:"FWD", r:91, gp:"RW"},
    {n:"Gabriel Heinze",       p:"DEF", r:81, gp:"LB"}
  ]);

  /* Argentina 2010 — Messi was the captain and the star */
  inject("Argentina", "2010", [
    {n:"Lionel Messi",         p:"FWD", r:94, gp:"RW"},
    {n:"Gabriel Heinze",       p:"DEF", r:80, gp:"LB"},
    {n:"Nicolás Otamendi",     p:"DEF", r:79, gp:"CB"},
    {n:"Neri Cardozo",         p:"MID", r:78, gp:"CM"}
  ]);

  /* Brazil 2006 — Ronaldinho was reigning world player of the year */
  inject("Brazil", "2006", [
    {n:"Ronaldinho",           p:"MID", r:93, gp:"CAM"}
  ]);

  /* Brazil 2022 — Neymar, Vinicius and Richarlison were the main stars */
  inject("Brazil", "2022", [
    {n:"Neymar",               p:"FWD", r:91, gp:"LW"},
    {n:"Vinicius Júnior",      p:"FWD", r:91, gp:"LW"},
    {n:"Richarlison",          p:"FWD", r:87, gp:"ST"},
    {n:"Rodrygo",              p:"FWD", r:87, gp:"RW"},
    {n:"Antony",               p:"FWD", r:84, gp:"RW"},
    {n:"Gabriel Martinelli",   p:"FWD", r:85, gp:"LW"}
  ]);

  /* France 2002 — Henry, Wiltord and Pires were all in the squad */
  inject("France", "2002", [
    {n:"Thierry Henry",        p:"FWD", r:89, gp:"ST"},
    {n:"Robert Pirès",         p:"MID", r:85, gp:"LW"},
    {n:"Sylvain Wiltord",      p:"FWD", r:83, gp:"LW"}
  ]);

  /* Portugal 2014 — Cristiano Ronaldo was the undisputed captain and star */
  inject("Portugal", "2014", [
    {n:"Cristiano Ronaldo",    p:"FWD", r:95, gp:"LW"},
    {n:"Pepe",                 p:"DEF", r:88, gp:"CB"},
    {n:"Rui Patrício",         p:"GK",  r:87, gp:"GK"},
    {n:"João Moutinho",        p:"MID", r:85, gp:"CM"},
    {n:"William Carvalho",     p:"MID", r:82, gp:"CDM"},
    {n:"Raphaël Guerreiro",    p:"DEF", r:82, gp:"LB"}
  ]);

  /* Senegal 2022 — Mané was called up despite being injured */
  inject("Senegal", "2022", [
    {n:"Sadio Mané",           p:"FWD", r:91, gp:"LW"}
  ]);

  /* Germany 2010 — Lahm was the captain */
  inject("Germany", "2010", [
    {n:"Philipp Lahm",         p:"DEF", r:90, gp:"LB"}
  ]);

  /* Germany 2014 — Lahm, Hummels and Götze (scored the winning goal) */
  inject("Germany", "2014", [
    {n:"Philipp Lahm",         p:"DEF", r:92, gp:"RB"},
    {n:"Mats Hummels",         p:"DEF", r:89, gp:"CB"},
    {n:"Mario Götze",          p:"FWD", r:87, gp:"CAM"}
  ]);

  /* Spain 2010 — Villa won the golden boot; Puyol was the rock in defence */
  inject("Spain", "2010", [
    {n:"David Villa",          p:"FWD", r:90, gp:"ST"},
    {n:"Carles Puyol",         p:"DEF", r:89, gp:"CB"},
    {n:"Gerard Piqué",         p:"DEF", r:88, gp:"CB"},
    {n:"Fernando Torres",      p:"FWD", r:86, gp:"ST"},
    {n:"Pedro",                p:"FWD", r:84, gp:"RW"}
  ]);

  /* Italy 2006 — Pirlo, Del Piero and Totti starring in the WC-winning squad */
  inject("Italy", "2006", [
    {n:"Andrea Pirlo",         p:"MID", r:91, gp:"CM"},
    {n:"Alessandro Del Piero", p:"FWD", r:89, gp:"ST"},
    {n:"Francesco Totti",      p:"FWD", r:89, gp:"CAM"},
    {n:"Alberto Gilardino",    p:"FWD", r:84, gp:"ST"}
  ]);

  /* Ivory Coast 2006 — add Kolo Touré and Eboué */
  inject("Ivory Coast", "2006", [
    {n:"Kolo Touré",           p:"DEF", r:86, gp:"CB"},
    {n:"Emmanuel Eboué",       p:"DEF", r:82, gp:"RB"}
  ]);

  /* Belgium 2014 — add Courtois */
  inject("Belgium", "2014", [
    {n:"Thibaut Courtois",     p:"GK",  r:89, gp:"GK"}
  ]);

  /* England 2018 — Harry Kane won the golden boot */
  inject("England", "2018", [
    {n:"Harry Kane",           p:"FWD", r:90, gp:"ST"},
    {n:"Kieran Trippier",      p:"DEF", r:84, gp:"RB"},
    {n:"Raheem Sterling",      p:"FWD", r:87, gp:"LW"},
    {n:"Dele Alli",            p:"MID", r:85, gp:"CAM"},
    {n:"Jordan Henderson",     p:"MID", r:84, gp:"CM"},
    {n:"Jordan Pickford",      p:"GK",  r:85, gp:"GK"},
    {n:"Kyle Walker",          p:"DEF", r:85, gp:"RB"},
    {n:"John Stones",          p:"DEF", r:85, gp:"CB"},
    {n:"Jesse Lingard",        p:"MID", r:80, gp:"CAM"},
    {n:"Marcus Rashford",      p:"FWD", r:85, gp:"RW"}
  ]);

  /* ═══════════════════════════════════════════════════════════════════
     2.  ADD CRITICAL MISSING SQUADS
     ═══════════════════════════════════════════════════════════════════ */

  /* Portugal 2018 — CR7 hat-trick vs Spain, eliminated R16 by Uruguay */
  addSquad("Portugal", "🇵🇹", "2018", [
    {n:"Rui Patrício",         p:"GK",  r:87, gp:"GK"},
    {n:"Beto",                 p:"GK",  r:76, gp:"GK"},
    {n:"Anthony Lopes",        p:"GK",  r:83, gp:"GK"},
    {n:"Cédric Soares",        p:"DEF", r:82, gp:"RB"},
    {n:"Pepe",                 p:"DEF", r:87, gp:"CB"},
    {n:"José Fonte",           p:"DEF", r:82, gp:"CB"},
    {n:"Bruno Alves",          p:"DEF", r:81, gp:"CB"},
    {n:"Raphaël Guerreiro",    p:"DEF", r:84, gp:"LB"},
    {n:"Ricardo Pereira",      p:"DEF", r:83, gp:"RB"},
    {n:"Mário Rui",            p:"DEF", r:81, gp:"LB"},
    {n:"João Cancelo",         p:"DEF", r:84, gp:"RB"},
    {n:"William Carvalho",     p:"MID", r:85, gp:"CDM"},
    {n:"Adrien Silva",         p:"MID", r:82, gp:"CM"},
    {n:"João Moutinho",        p:"MID", r:85, gp:"CM"},
    {n:"Manuel Fernandes",     p:"MID", r:78, gp:"CM"},
    {n:"Bernardo Silva",       p:"FWD", r:88, gp:"RW"},
    {n:"Cristiano Ronaldo",    p:"FWD", r:95, gp:"LW"},
    {n:"Ricardo Quaresma",     p:"FWD", r:82, gp:"RW"},
    {n:"Gonçalo Guedes",       p:"FWD", r:84, gp:"LW"},
    {n:"André Silva",          p:"FWD", r:82, gp:"ST"},
    {n:"Gelson Martins",       p:"FWD", r:82, gp:"RW"},
    {n:"Éder",                 p:"FWD", r:80, gp:"ST"},
    {n:"Nani",                 p:"FWD", r:82, gp:"LW"}
  ]);

  /* Portugal 2010 — CR7's first WC as undisputed star, lost to Spain */
  addSquad("Portugal", "🇵🇹", "2010", [
    {n:"Eduardo",              p:"GK",  r:82, gp:"GK"},
    {n:"Beto",                 p:"GK",  r:76, gp:"GK"},
    {n:"Daniel Fernandes",     p:"GK",  r:76, gp:"GK"},
    {n:"Ricardo Carvalho",     p:"DEF", r:86, gp:"CB"},
    {n:"Bruno Alves",          p:"DEF", r:84, gp:"CB"},
    {n:"Paulo Ferreira",       p:"DEF", r:80, gp:"RB"},
    {n:"Fábio Coentrão",       p:"DEF", r:82, gp:"LB"},
    {n:"Rolando",              p:"DEF", r:79, gp:"CB"},
    {n:"Miguel Veloso",        p:"MID", r:80, gp:"CM"},
    {n:"Raúl Meireles",        p:"MID", r:83, gp:"CM"},
    {n:"Tiago",                p:"MID", r:83, gp:"CM"},
    {n:"Deco",                 p:"MID", r:87, gp:"CAM"},
    {n:"Nani",                 p:"FWD", r:84, gp:"LW"},
    {n:"Simão",                p:"FWD", r:83, gp:"RW"},
    {n:"Hugo Almeida",         p:"FWD", r:80, gp:"ST"},
    {n:"Danny",                p:"FWD", r:83, gp:"CAM"},
    {n:"Liedson",              p:"FWD", r:81, gp:"ST"},
    {n:"Cristiano Ronaldo",    p:"FWD", r:93, gp:"LW"},
    {n:"Pedro Mendes",         p:"MID", r:79, gp:"CM"},
    {n:"Hélder Postiga",       p:"FWD", r:78, gp:"ST"},
    {n:"Ricardo Quaresma",     p:"FWD", r:83, gp:"RW"}
  ]);

  /* England 2022 — quarter-finalists (lost to France) */
  addSquad("England", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "2022", [
    {n:"Jordan Pickford",      p:"GK",  r:86, gp:"GK"},
    {n:"Nick Pope",            p:"GK",  r:84, gp:"GK"},
    {n:"Aaron Ramsdale",       p:"GK",  r:82, gp:"GK"},
    {n:"Trent Alexander-Arnold",p:"DEF",r:88, gp:"RB"},
    {n:"Kieran Trippier",      p:"DEF", r:85, gp:"RB"},
    {n:"John Stones",          p:"DEF", r:86, gp:"CB"},
    {n:"Harry Maguire",        p:"DEF", r:83, gp:"CB"},
    {n:"Luke Shaw",            p:"DEF", r:84, gp:"LB"},
    {n:"Ben White",            p:"DEF", r:83, gp:"RB"},
    {n:"Conor Coady",          p:"DEF", r:79, gp:"CB"},
    {n:"Eric Dier",            p:"DEF", r:80, gp:"CB"},
    {n:"Kyle Walker",          p:"DEF", r:85, gp:"RB"},
    {n:"Declan Rice",          p:"MID", r:87, gp:"CDM"},
    {n:"Jude Bellingham",      p:"MID", r:88, gp:"CM"},
    {n:"Mason Mount",          p:"MID", r:85, gp:"CAM"},
    {n:"Phil Foden",           p:"FWD", r:89, gp:"LW"},
    {n:"Conor Gallagher",      p:"MID", r:81, gp:"CM"},
    {n:"Jordan Henderson",     p:"MID", r:83, gp:"CM"},
    {n:"Kalvin Phillips",      p:"MID", r:82, gp:"CDM"},
    {n:"Harry Kane",           p:"FWD", r:91, gp:"ST"},
    {n:"Raheem Sterling",      p:"FWD", r:86, gp:"RW"},
    {n:"Bukayo Saka",          p:"FWD", r:88, gp:"RW"},
    {n:"Marcus Rashford",      p:"FWD", r:87, gp:"LW"},
    {n:"Jack Grealish",        p:"FWD", r:84, gp:"LW"},
    {n:"Callum Wilson",        p:"FWD", r:81, gp:"ST"},
    {n:"James Maddison",       p:"MID", r:84, gp:"CAM"}
  ]);

  /* Belgium 2018 — 3rd place (golden generation's best WC run) */
  addSquad("Belgium", "🇧🇪", "2018", [
    {n:"Thibaut Courtois",     p:"GK",  r:90, gp:"GK"},
    {n:"Simon Mignolet",       p:"GK",  r:82, gp:"GK"},
    {n:"Koen Casteels",        p:"GK",  r:81, gp:"GK"},
    {n:"Toby Alderweireld",    p:"DEF", r:87, gp:"CB"},
    {n:"Vincent Kompany",      p:"DEF", r:88, gp:"CB"},
    {n:"Jan Vertonghen",       p:"DEF", r:87, gp:"CB"},
    {n:"Thomas Meunier",       p:"DEF", r:83, gp:"RB"},
    {n:"Dedryck Boyata",       p:"DEF", r:79, gp:"CB"},
    {n:"Thomas Vermaelen",     p:"DEF", r:82, gp:"CB"},
    {n:"Kevin De Bruyne",      p:"MID", r:91, gp:"CM"},
    {n:"Axel Witsel",          p:"MID", r:86, gp:"CDM"},
    {n:"Yannick Carrasco",     p:"FWD", r:84, gp:"LW"},
    {n:"Nacer Chadli",         p:"FWD", r:82, gp:"LW"},
    {n:"Mousa Dembélé",        p:"MID", r:85, gp:"CDM"},
    {n:"Marouane Fellaini",    p:"MID", r:83, gp:"CM"},
    {n:"Dries Mertens",        p:"FWD", r:86, gp:"ST"},
    {n:"Eden Hazard",          p:"FWD", r:90, gp:"LW"},
    {n:"Romelu Lukaku",        p:"FWD", r:88, gp:"ST"},
    {n:"Michy Batshuayi",      p:"FWD", r:82, gp:"ST"},
    {n:"Leander Dendoncker",   p:"MID", r:80, gp:"CM"},
    {n:"Thorgan Hazard",       p:"FWD", r:82, gp:"LW"},
    {n:"Youri Tielemans",      p:"MID", r:85, gp:"CM"},
    {n:"Christian Benteke",    p:"FWD", r:82, gp:"ST"}
  ]);

  /* Brazil 2018 — quarter-finalists (Neymar's last great WC run) */
  addSquad("Brazil", "🇧🇷", "2018", [
    {n:"Alisson Becker",       p:"GK",  r:91, gp:"GK"},
    {n:"Éderson",              p:"GK",  r:87, gp:"GK"},
    {n:"Cássio",               p:"GK",  r:81, gp:"GK"},
    {n:"Danilo",               p:"DEF", r:83, gp:"RB"},
    {n:"Marcelo",              p:"DEF", r:88, gp:"LB"},
    {n:"Thiago Silva",         p:"DEF", r:89, gp:"CB"},
    {n:"Miranda",              p:"DEF", r:84, gp:"CB"},
    {n:"Fagner",               p:"DEF", r:82, gp:"RB"},
    {n:"Pedro Geromel",        p:"DEF", r:79, gp:"CB"},
    {n:"Filipe Luís",          p:"DEF", r:84, gp:"LB"},
    {n:"Marquinhos",           p:"DEF", r:87, gp:"CB"},
    {n:"Casemiro",             p:"MID", r:88, gp:"CDM"},
    {n:"Fernandinho",          p:"MID", r:85, gp:"CDM"},
    {n:"Paulinho",             p:"MID", r:83, gp:"CM"},
    {n:"Renato Augusto",       p:"MID", r:82, gp:"CM"},
    {n:"Fred",                 p:"MID", r:76, gp:"CDM"},
    {n:"Allan",                p:"MID", r:81, gp:"CDM"},
    {n:"Neymar",               p:"FWD", r:92, gp:"LW"},
    {n:"Philippe Coutinho",    p:"FWD", r:88, gp:"CAM"},
    {n:"Gabriel Jesus",        p:"FWD", r:85, gp:"ST"},
    {n:"Roberto Firmino",      p:"FWD", r:87, gp:"ST"},
    {n:"Douglas Costa",        p:"FWD", r:85, gp:"RW"},
    {n:"Willian",              p:"FWD", r:84, gp:"RW"},
    {n:"Taison",               p:"FWD", r:79, gp:"LW"}
  ]);

  /* France 2010 — Ribéry, Henry and Anelka; infamously went out in groups */
  addSquad("France", "🇫🇷", "2010", [
    {n:"Hugo Lloris",          p:"GK",  r:85, gp:"GK"},
    {n:"Steve Mandanda",       p:"GK",  r:83, gp:"GK"},
    {n:"Cédric Carrasso",      p:"GK",  r:76, gp:"GK"},
    {n:"Bacary Sagna",         p:"DEF", r:83, gp:"RB"},
    {n:"Éric Abidal",          p:"DEF", r:83, gp:"LB"},
    {n:"William Gallas",       p:"DEF", r:83, gp:"CB"},
    {n:"Gaël Clichy",          p:"DEF", r:80, gp:"LB"},
    {n:"Patrice Evra",         p:"DEF", r:84, gp:"LB"},
    {n:"Marc Planus",          p:"DEF", r:78, gp:"CB"},
    {n:"Sébastien Squillaci",  p:"DEF", r:79, gp:"CB"},
    {n:"Franck Ribéry",        p:"FWD", r:88, gp:"LW"},
    {n:"Yoann Gourcuff",       p:"MID", r:82, gp:"CAM"},
    {n:"Thierry Henry",        p:"FWD", r:84, gp:"ST"},
    {n:"Nicolas Anelka",       p:"FWD", r:83, gp:"ST"},
    {n:"Florent Malouda",      p:"MID", r:83, gp:"LM"},
    {n:"Samir Nasri",          p:"MID", r:83, gp:"CAM"},
    {n:"Jérémy Toulalan",      p:"MID", r:82, gp:"CDM"},
    {n:"Lassana Diarra",       p:"MID", r:82, gp:"CDM"},
    {n:"Sidney Govou",         p:"FWD", r:79, gp:"RW"},
    {n:"Mathieu Valbuena",     p:"FWD", r:81, gp:"CAM"},
    {n:"André-Pierre Gignac",  p:"FWD", r:81, gp:"ST"},
    {n:"Alou Diarra",          p:"MID", r:78, gp:"CDM"}
  ]);

  /* Ivory Coast 2010 — Drogba's group of death squad */
  addSquad("Ivory Coast", "🇨🇮", "2010", [
    {n:"Boubacar Barry",       p:"GK",  r:81, gp:"GK"},
    {n:"Daniel Yeboah",        p:"GK",  r:75, gp:"GK"},
    {n:"Aristide Zogbo",       p:"GK",  r:74, gp:"GK"},
    {n:"Emmanuel Eboué",       p:"DEF", r:82, gp:"RB"},
    {n:"Kolo Touré",           p:"DEF", r:87, gp:"CB"},
    {n:"Abdoulaye Méïté",      p:"DEF", r:79, gp:"CB"},
    {n:"Souleymane Bamba",     p:"DEF", r:76, gp:"CB"},
    {n:"Benjamin Angoua",      p:"DEF", r:76, gp:"RB"},
    {n:"Siaka Tiéné",          p:"DEF", r:78, gp:"LB"},
    {n:"Arthur Boka",          p:"DEF", r:80, gp:"LB"},
    {n:"Didier Zokora",        p:"MID", r:83, gp:"CDM"},
    {n:"Cheick Tioté",         p:"MID", r:84, gp:"CDM"},
    {n:"Yaya Touré",           p:"MID", r:87, gp:"CM"},
    {n:"Gervinho",             p:"FWD", r:83, gp:"RW"},
    {n:"Salomon Kalou",        p:"FWD", r:83, gp:"ST"},
    {n:"Romaric N'Dri",        p:"MID", r:78, gp:"CM"},
    {n:"Seydou Doumbia",       p:"FWD", r:81, gp:"ST"},
    {n:"Lacina Traoré",        p:"FWD", r:80, gp:"ST"},
    {n:"Bakari Koné",          p:"FWD", r:77, gp:"RW"},
    {n:"Marc Zoro",            p:"DEF", r:76, gp:"CB"},
    {n:"Didier Drogba",        p:"FWD", r:89, gp:"ST"},
    {n:"Aruna Dindane",        p:"FWD", r:79, gp:"ST"},
    {n:"Boubacar Sanogo",      p:"FWD", r:77, gp:"ST"}
  ]);

  /* Ivory Coast 2014 — Drogba's final World Cup */
  addSquad("Ivory Coast", "🇨🇮", "2014", [
    {n:"Boubacar Barry",       p:"GK",  r:81, gp:"GK"},
    {n:"Daniel Yeboah",        p:"GK",  r:75, gp:"GK"},
    {n:"Sylvain Gbohouo",      p:"GK",  r:76, gp:"GK"},
    {n:"Serge Aurier",         p:"DEF", r:83, gp:"RB"},
    {n:"Kolo Touré",           p:"DEF", r:85, gp:"CB"},
    {n:"Souleymane Bamba",     p:"DEF", r:79, gp:"CB"},
    {n:"Ousmane Viera",        p:"DEF", r:75, gp:"CB"},
    {n:"Arthur Boka",          p:"DEF", r:78, gp:"LB"},
    {n:"Emmanuel Eboué",       p:"DEF", r:80, gp:"RB"},
    {n:"Didier Zokora",        p:"MID", r:82, gp:"CDM"},
    {n:"Cheick Tioté",         p:"MID", r:83, gp:"CDM"},
    {n:"Yaya Touré",           p:"MID", r:88, gp:"CM"},
    {n:"Gervinho",             p:"FWD", r:84, gp:"RW"},
    {n:"Salomon Kalou",        p:"FWD", r:83, gp:"ST"},
    {n:"Max Gradel",           p:"FWD", r:81, gp:"LW"},
    {n:"Seydou Doumbia",       p:"FWD", r:81, gp:"ST"},
    {n:"Wilfried Bony",        p:"FWD", r:83, gp:"ST"},
    {n:"Lacina Traoré",        p:"FWD", r:79, gp:"ST"},
    {n:"Giovanni Sio",         p:"DEF", r:76, gp:"RB"},
    {n:"Didier Drogba",        p:"FWD", r:87, gp:"ST"},
    {n:"Éric Bailly",          p:"DEF", r:82, gp:"CB"},
    {n:"Romaric N'Dri",        p:"MID", r:78, gp:"CM"},
    {n:"Blaise Kouassi",       p:"MID", r:76, gp:"CM"}
  ]);

})();
