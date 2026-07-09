/* data_501_index.js — Registry of active Football 501 categories.
 * football501.js reads this list instead of hardcoding dataset keys, so
 * adding a new category later (data_501_*.js) is just: author the data
 * file, add its key here, add its <script> tag in index.html.
 * All 7 categories from the original spec are now live — none shipped as
 * a locked "coming soon" placeholder. */
window.FB501_CATEGORIES = [
  { key: "pl_scorers",      locked: false },
  { key: "pl_appearances",  locked: false },
  { key: "transfer_fees",   locked: false },
  { key: "market_value",    locked: false },
  { key: "cl_goals",        locked: false },
  { key: "assists",         locked: false },
  { key: "clean_sheets",    locked: false }
];
