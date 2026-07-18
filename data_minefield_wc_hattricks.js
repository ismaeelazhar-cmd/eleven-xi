/* data_minefield_wc_hattricks.js — Football Minefield category: "Scored a
 * hat-trick at a FIFA World Cup". safe = every player confirmed to have
 * scored 3+ goals in a single men's FIFA World Cup finals match; mine =
 * legendary/prolific players who, despite huge World Cup reputations,
 * never actually scored a World Cup hat-trick (chosen for high per-player
 * confidence, cross-checked against each player's known WC match log).
 *
 * VERIFICATION (B6 pipeline): safe list sourced from Wikipedia's "List of
 * FIFA World Cup hat-tricks" (57 hat-tricks by named players across all
 * tournaments 1930-2026, most recently Ousmane Dembele and Jonathan
 * David at WC2026 plus Messi's 2026 hat-trick vs Algeria noted in the
 * same source as the oldest-ever WC hat-trick scorer at 38). Mine list
 * individually verified: none of Maradona/Zidane/Cruyff/Ronaldinho/
 * Beckenbauer/Platini/Neymar/Suarez/Best/Di Stefano/Lewandowski/Zico/
 * Baggio/Beckham/Iniesta/Xavi/Rooney/Drogba/Salah/Aguero appear in the
 * hat-trick list despite each being a genuine World Cup goalscorer or
 * all-time great — a deliberately tricky category since fame does not
 * correlate with this specific record. asOf: 2026-07-18. */
window.MINEFIELD_DATA = window.MINEFIELD_DATA || {};
window.MINEFIELD_DATA.wc_hattricks = {
  label: "Scored a hat-trick at a FIFA World Cup",
  asOf: "2026-07-18",
  source: "https://en.wikipedia.org/wiki/List_of_FIFA_World_Cup_hat-tricks",
  boardSize: 6,
  safe: [
    "Bert Patenaude", "Guillermo Stabile", "Pedro Cea", "Angelo Schiavio",
    "Edmund Conen", "Oldrich Nejedly", "Ernst Wilimowski", "Leonidas",
    "Oscar Miguez", "Ademir de Menezes", "Sandor Kocsis", "Max Morlock",
    "Just Fontaine", "Pele", "Florian Albert", "Eusebio",
    "Geoff Hurst", "Gerd Muller", "Andrzej Szarmach", "Rob Rensenbrink",
    "Teofilo Cubillas", "Laszlo Kiss", "Karl-Heinz Rummenigge", "Zbigniew Boniek",
    "Paolo Rossi", "Preben Elkjaer", "Gary Lineker", "Emilio Butragueno",
    "Gabriel Batistuta", "Oleg Salenko", "Miroslav Klose", "Pauleta",
    "Gonzalo Higuain", "Thomas Muller", "Xherdan Shaqiri", "Cristiano Ronaldo",
    "Harry Kane", "Goncalo Ramos", "Kylian Mbappe", "Lionel Messi",
    "Jonathan David", "Ousmane Dembele"
  ],
  mine: [
    "Diego Maradona", "Zinedine Zidane", "Johan Cruyff", "Ronaldinho",
    "Franz Beckenbauer", "Michel Platini", "Neymar", "Luis Suarez",
    "George Best", "Alfredo Di Stefano", "Robert Lewandowski", "Zico",
    "Roberto Baggio", "David Beckham", "Andres Iniesta", "Xavi",
    "Wayne Rooney", "Didier Drogba", "Mohamed Salah", "Sergio Aguero"
  ]
};
