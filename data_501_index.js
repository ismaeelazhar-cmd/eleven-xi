/* data_501_index.js — Registry of active Football 501 categories.
 * football501.js reads this list instead of hardcoding dataset keys, so
 * adding a new category later (data_501_*.js) is just: author the data
 * file, add its key here, add its <script> tag in index.html. Categories
 * not yet authored can be listed with locked:true for a "coming soon" card. */
window.FB501_CATEGORIES = [
  { key: "pl_scorers",      locked: false },
  { key: "pl_appearances",  locked: false },
  { key: "transfer_fees",   locked: true, label: "Transfer fees",              unit: "£m" },
  { key: "market_value",    locked: true, label: "Market value",               unit: "£m" },
  { key: "cl_goals",        locked: true, label: "Champions League goals",     unit: "goals" },
  { key: "assists",         locked: true, label: "Career assists",             unit: "assists" },
  { key: "clean_sheets",    locked: true, label: "Clean sheets",               unit: "clean sheets" }
];
