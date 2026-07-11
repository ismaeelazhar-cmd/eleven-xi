/* data_501_index.js — Registry of active Football 501 categories.
 * football501.js reads this list instead of hardcoding dataset keys, so
 * adding a new category later (data_501_*.js) is just: author the data
 * file, add its key here, add its <script> tag in index.html.
 * The original 7 categories are all live; more are being added
 * incrementally in verified batches per the "clubs, leagues, appearances"
 * content-expansion pass — each batch commit adds a few keys here. */
window.FB501_CATEGORIES = [
  { key: "pl_scorers",         locked: false },
  { key: "pl_appearances",     locked: false },
  { key: "transfer_fees",      locked: false },
  { key: "market_value",       locked: false },
  { key: "cl_goals",           locked: false },
  { key: "assists",            locked: false },
  { key: "clean_sheets",       locked: false },
  { key: "real_madrid_scorers", locked: false },
  { key: "barcelona_scorers",   locked: false },
  { key: "man_utd_scorers",     locked: false },
  { key: "laliga_scorers",      locked: false },
  { key: "seriea_scorers",      locked: false },
  { key: "bundesliga_scorers",  locked: false },
  { key: "cl_appearances",      locked: false },
  { key: "intl_caps",           locked: false },
  { key: "intl_goals",          locked: false },
  { key: "bayern_scorers",      locked: false },
  { key: "liverpool_scorers",   locked: false },
  { key: "juventus_scorers",    locked: false },
  { key: "arsenal_scorers",     locked: false },
  { key: "chelsea_scorers",     locked: false },
  { key: "man_city_scorers",    locked: false },
  { key: "psg_scorers",         locked: false },
  { key: "dortmund_scorers",    locked: false },
  { key: "ac_milan_scorers",    locked: false }
];
