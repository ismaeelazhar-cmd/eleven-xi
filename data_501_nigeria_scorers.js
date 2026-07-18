/* data_501_nigeria_scorers.js — Football 501 category: Nigeria men's
 * national team all-time top scorers. Value = career goals for Nigeria.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "Nigeria national football team
 *                         records and statistics" (Top goalscorers table)
 *                         for the top 10; RSSSF — "Nigeria - Record
 *                         International Players" for the ranks 11+
 *                         extension.
 *   Cross-check source:  RSSSF's own top-10 snapshot confirms the same
 *                         order and totals as Wikipedia exactly.
 *   asOf:                2026-07-18
 *   Re-verify:           Osimhen, Ighalo (through 2019), Musa, Iheanacho,
 *                         Lookman, Simon, and Chukwueze were still
 *                         plausibly active internationals as of asOf —
 *                         re-verify their totals frequently. Note: this
 *                         category needed 50 rows down to 2-goal players
 *                         before the total sum cleared 501 with a clean
 *                         subset-sum — Nigeria's scoring pool is unusually
 *                         thin below the top 2 (Yekini/Osimhen), similar
 *                         to Wales/Scotland/Ireland's low-ceiling problem.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.nigeria_scorers = {
  label: "Nigeria all-time top scorers",
  unit: "goals",
  asOf: "2026-07-18",
  source: "https://www.rsssf.org/miscellaneous/nig-recintlp.html",
  rows: [
    { n: "Rashidi Yekini", v: 37 },
    { n: "Victor Osimhen", v: 35 }, /* active — re-verify frequently */
    { n: "Segun Odegbami", v: 22 },
    { n: "Yakubu Aiyegbeni", v: 21 },
    { n: "Ikechukwu Uche", v: 19 },
    { n: "Obafemi Martins", v: 18 },
    { n: "Samson Siasia", v: 17 },
    { n: "Odion Ighalo", v: 16 },
    { n: "Ahmed Musa", v: 16 }, /* active — re-verify frequently */
    { n: "Julius Aghahowa", v: 14 },
    { n: "Asuquo Ekpe", v: 14 },
    { n: "Kelechi Iheanacho", v: 14 }, /* active — re-verify frequently */
    { n: "Jay-Jay Okocha", v: 14 },
    { n: "Thompson Usiyen", v: 14 },
    { n: "Daniel Amokachi", v: 13 },
    { n: "Christian Kanu", v: 13 },
    { n: "Victor Obinna", v: 13 },
    { n: "Sunny Oyarekhua", v: 13 },
    { n: "Victor Moses", v: 12 },
    { n: "Kenneth Olayombo", v: 12 },
    { n: "Paul Hamilton", v: 11 },
    { n: "Muda Lawal", v: 11 },
    { n: "Ademola Lookman", v: 11 }, /* active — re-verify frequently */
    { n: "Peter Odemwingie", v: 11 },
    { n: "Alex Iwobi", v: 10 }, /* active — re-verify frequently */
    { n: "Moses Simon", v: 10 }, /* active — re-verify frequently */
    { n: "Joseph Yobo", v: 7 },
    { n: "Samuel Chukwueze", v: 7 }, /* active — re-verify frequently */
    { n: "Victor Ikpeba", v: 7 },
    { n: "Aloysius Atuegbu", v: 7 },
    { n: "Finidi George", v: 6 },
    { n: "Garba Lawal", v: 6 },
    { n: "Henry Nwosu", v: 6 },
    { n: "Mutiu Adepoju", v: 5 },
    { n: "Peter Anieke", v: 5 },
    { n: "Adokiye Amiesimaka", v: 5 },
    { n: "Ademola Adeshina", v: 5 },
    { n: "Tijani Babangida", v: 5 },
    { n: "Taye Taiwo", v: 5 },
    { n: "Efetobore Ambrose", v: 4 },
    { n: "Ebere Onuachu", v: 4 },
    { n: "Chidozie Awaziem", v: 4 },
    { n: "Godwin Achebe", v: 3 },
    { n: "Godwin Odiye", v: 3 },
    { n: "Humphrey Edobor", v: 3 },
    { n: "Tony Igwe", v: 3 },
    { n: "Semi Ajayi", v: 2 },
    { n: "Sunday Oliseh", v: 2 },
    { n: "Joe Aribo", v: 2 },
    { n: "Thompson Oliha", v: 2 }
  ]
};
