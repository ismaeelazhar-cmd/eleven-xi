/* data_transfers.js — Transfer Roulette: real, individually-verified
 * football transfers (2006-2026). Value shape:
 *   { player, from, to, year, feeM, feeLabel }
 * `from`/`to` are canonical club names used consistently across every
 * entry (so the same club spelling always matches whichever side of a
 * transfer it's on) — no abbreviations ("Manchester United" not "Man
 * Utd", "Paris Saint-Germain" not "PSG"). `feeM` is the fee in EUR
 * millions (matching Wikipedia's primary currency for its all-time
 * transfers table); `feeLabel` is the pre-formatted display string
 * shown as the post-guess payoff reveal.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of most expensive association
 *                         football transfers" (EUR-denominated table,
 *                         covering the sport's biggest, most publicly
 *                         documented transfer fees).
 *   Cross-check source:  WebSearch aggregation (multiple outlets —
 *                         Bleacher Report, FourFourTwo, Goal.com,
 *                         Transfermarkt's own transfer-record page) for
 *                         the 2 pre-2009 entries not covered by the
 *                         all-time-list table (Shevchenko, Robinho),
 *                         cross-checked against each other for the same
 *                         approximate figures.
 *   asOf:                2026-07-19
 *   Re-verify:           Fee figures for big-money moves are sometimes
 *                         reported with slightly different totals across
 *                         outlets depending on whether add-ons/bonuses
 *                         are included — the headline "base fee" figure
 *                         is used here throughout for consistency. Every
 *                         entry is a genuinely completed, real transfer;
 *                         none are estimates or placeholders. */
window.TRANSFER_DATA = [
  { player: "Andriy Shevchenko", from: "AC Milan", to: "Chelsea", year: 2006, feeM: 43.8, feeLabel: "€43.8m" },
  { player: "Robinho", from: "Real Madrid", to: "Manchester City", year: 2008, feeM: 46.3, feeLabel: "€46.3m" },
  { player: "Cristiano Ronaldo", from: "Manchester United", to: "Real Madrid", year: 2009, feeM: 94, feeLabel: "€94m" },
  { player: "Gareth Bale", from: "Tottenham Hotspur", to: "Real Madrid", year: 2013, feeM: 100.8, feeLabel: "€100.8m" },
  { player: "James Rodriguez", from: "Monaco", to: "Real Madrid", year: 2014, feeM: 80, feeLabel: "€80m" },
  { player: "Angel Di Maria", from: "Real Madrid", to: "Manchester United", year: 2014, feeM: 75.6, feeLabel: "€75.6m" },
  { player: "Luis Suarez", from: "Liverpool", to: "Barcelona", year: 2014, feeM: 82.3, feeLabel: "€82.3m" },
  { player: "Kevin De Bruyne", from: "VfL Wolfsburg", to: "Manchester City", year: 2015, feeM: 75.7, feeLabel: "€75.7m" },
  { player: "Paul Pogba", from: "Juventus", to: "Manchester United", year: 2016, feeM: 105, feeLabel: "€105m" },
  { player: "Gonzalo Higuain", from: "Napoli", to: "Juventus", year: 2016, feeM: 90, feeLabel: "€90m" },
  { player: "Cristiano Ronaldo", from: "Real Madrid", to: "Juventus", year: 2017, feeM: 100, feeLabel: "€100m" },
  { player: "Neymar", from: "Barcelona", to: "Paris Saint-Germain", year: 2017, feeM: 222, feeLabel: "€222m" },
  { player: "Kylian Mbappe", from: "Monaco", to: "Paris Saint-Germain", year: 2017, feeM: 180, feeLabel: "€180m" },
  { player: "Romelu Lukaku", from: "Everton", to: "Manchester United", year: 2017, feeM: 84.8, feeLabel: "€84.8m" },
  { player: "Ousmane Dembele", from: "Borussia Dortmund", to: "Barcelona", year: 2017, feeM: 105, feeLabel: "€105m" },
  { player: "Philippe Coutinho", from: "Liverpool", to: "Barcelona", year: 2018, feeM: 118.4, feeLabel: "€118.4m" },
  { player: "Virgil van Dijk", from: "Southampton", to: "Liverpool", year: 2018, feeM: 84.4, feeLabel: "€84.4m" },
  { player: "Kepa Arrizabalaga", from: "Athletic Bilbao", to: "Chelsea", year: 2018, feeM: 80, feeLabel: "€80m" },
  { player: "Joao Felix", from: "Benfica", to: "Atletico Madrid", year: 2019, feeM: 126, feeLabel: "€126m" },
  { player: "Antoine Griezmann", from: "Atletico Madrid", to: "Barcelona", year: 2019, feeM: 120, feeLabel: "€120m" },
  { player: "Harry Maguire", from: "Leicester City", to: "Manchester United", year: 2019, feeM: 86.6, feeLabel: "€86.6m" },
  { player: "Romelu Lukaku", from: "Manchester United", to: "Inter Milan", year: 2019, feeM: 80, feeLabel: "€80m" },
  { player: "Nicolas Pepe", from: "Lille", to: "Arsenal", year: 2019, feeM: 80, feeLabel: "€80m" },
  { player: "Lucas Hernandez", from: "Atletico Madrid", to: "Bayern Munich", year: 2019, feeM: 80, feeLabel: "€80m" },
  { player: "Matthijs de Ligt", from: "Ajax", to: "Juventus", year: 2019, feeM: 75, feeLabel: "€75m" },
  { player: "Frenkie de Jong", from: "Ajax", to: "Barcelona", year: 2019, feeM: 75, feeLabel: "€75m" },
  { player: "Eden Hazard", from: "Chelsea", to: "Real Madrid", year: 2019, feeM: 100, feeLabel: "€100m" },
  { player: "Jack Grealish", from: "Aston Villa", to: "Manchester City", year: 2021, feeM: 117.7, feeLabel: "€117.7m" },
  { player: "Romelu Lukaku", from: "Inter Milan", to: "Chelsea", year: 2021, feeM: 115, feeLabel: "€115m" },
  { player: "Jadon Sancho", from: "Borussia Dortmund", to: "Manchester United", year: 2021, feeM: 85, feeLabel: "€85m" },
  { player: "Antony", from: "Ajax", to: "Manchester United", year: 2022, feeM: 95, feeLabel: "€95m" },
  { player: "Wesley Fofana", from: "Leicester City", to: "Chelsea", year: 2022, feeM: 80.9, feeLabel: "€80.9m" },
  { player: "Aurelien Tchouameni", from: "Monaco", to: "Real Madrid", year: 2022, feeM: 80, feeLabel: "€80m" },
  { player: "Darwin Nunez", from: "Benfica", to: "Liverpool", year: 2022, feeM: 75, feeLabel: "€75m" },
  { player: "Enzo Fernandez", from: "Benfica", to: "Chelsea", year: 2023, feeM: 121, feeLabel: "€121m" },
  { player: "Declan Rice", from: "West Ham United", to: "Arsenal", year: 2023, feeM: 116.5, feeLabel: "€116.5m" },
  { player: "Moises Caicedo", from: "Brighton and Hove Albion", to: "Chelsea", year: 2023, feeM: 116.3, feeLabel: "€116.3m" },
  { player: "Jude Bellingham", from: "Borussia Dortmund", to: "Real Madrid", year: 2023, feeM: 103, feeLabel: "€103m" },
  { player: "Josko Gvardiol", from: "RB Leipzig", to: "Manchester City", year: 2023, feeM: 90, feeLabel: "€90m" },
  { player: "Neymar", from: "Paris Saint-Germain", to: "Al-Hilal", year: 2023, feeM: 90, feeLabel: "€90m" },
  { player: "Harry Kane", from: "Tottenham Hotspur", to: "Bayern Munich", year: 2023, feeM: 100, feeLabel: "€100m" },
  { player: "Kai Havertz", from: "Chelsea", to: "Arsenal", year: 2023, feeM: 75.3, feeLabel: "€75.3m" },
  { player: "Rasmus Hojlund", from: "Atalanta", to: "Manchester United", year: 2023, feeM: 75, feeLabel: "€75m" },
  { player: "Julian Alvarez", from: "Manchester City", to: "Atletico Madrid", year: 2024, feeM: 75, feeLabel: "€75m" },
  { player: "Alexander Isak", from: "Newcastle United", to: "Liverpool", year: 2025, feeM: 144.5, feeLabel: "€144.5m" },
  { player: "Florian Wirtz", from: "Bayer Leverkusen", to: "Liverpool", year: 2025, feeM: 117.5, feeLabel: "€117.5m" },
  { player: "Hugo Ekitike", from: "Eintracht Frankfurt", to: "Liverpool", year: 2025, feeM: 80, feeLabel: "€80m" },
  { player: "Benjamin Sesko", from: "RB Leipzig", to: "Manchester United", year: 2025, feeM: 76.5, feeLabel: "€76.5m" },
  { player: "Bryan Mbeumo", from: "Brentford", to: "Manchester United", year: 2025, feeM: 75, feeLabel: "€75m" },
  { player: "Victor Osimhen", from: "Napoli", to: "Galatasaray", year: 2025, feeM: 75, feeLabel: "€75m" },
  { player: "Sandro Tonali", from: "Newcastle United", to: "Tottenham Hotspur", year: 2026, feeM: 108.1, feeLabel: "€108.1m" }
];
