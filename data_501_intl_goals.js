/* data_501_intl_goals.js — Football 501 category: most international goals
 * (men's football, all-time, any nation). Value = career goals for country.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of men's footballers with 50 or
 *                         more international goals" (full ranked table)
 *   Cross-check source:  olympics.com's own "most goals in international
 *                         football" reporting independently confirms the
 *                         top 3 (Ronaldo 146, Messi 125, Ali Daei 108).
 *   asOf:                2026-07-11
 *   Re-verify:           Ronaldo, Messi, Kane, Lukaku, Mbappé-adjacent
 *                         active internationals in this list will keep
 *                         climbing — re-verify every international window.
 *   Every row here is ≤180, so — unusually for this app's categories —
 *   EVERY row is always throwable under the 180-max-throw rule, no
 *   permanently-unthrowable "always OVER" entries at all.
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.intl_goals = {
  label: "Most international goals",
  unit: "goals",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_men%27s_footballers_with_50_or_more_international_goals",
  rows: [
    { n: "Cristiano Ronaldo",   v: 146 }, /* active — re-verify frequently */
    { n: "Lionel Messi",        v: 125 }, /* active — re-verify frequently */
    { n: "Ali Daei",            v: 108 },
    { n: "Sunil Chhetri",       v: 95  },
    { n: "Romelu Lukaku",       v: 93  }, /* active — re-verify frequently */
    { n: "Mokhtar Dahari",      v: 89  },
    { n: "Robert Lewandowski",  v: 89  }, /* active — re-verify frequently */
    { n: "Ali Mabkhout",        v: 85  },
    { n: "Harry Kane",          v: 85  }, /* active — re-verify frequently */
    { n: "Ferenc Puskas",       v: 84  },
    { n: "Neymar",              v: 80  }, /* active — re-verify frequently */
    { n: "Godfrey Chitalu",     v: 79  },
    { n: "Hussein Saeed",       v: 78  },
    { n: "Pele",                v: 77  },
    { n: "Vivian Woodward",     v: 75  },
    { n: "Sandor Kocsis",       v: 75  },
    { n: "Kunishige Kamamoto",  v: 75  },
    { n: "Bashar Abdullah",     v: 75  },
    { n: "Edin Dzeko",          v: 73  },
    { n: "Majed Abdullah",      v: 72  },
    { n: "Kinnah Phiri",        v: 71  },
    { n: "Kiatisuk Senamuang",  v: 71  },
    { n: "Miroslav Klose",      v: 71  },
    { n: "Piyapong Pue-on",     v: 70  },
    { n: "Abdul Kadir",         v: 70  },
    { n: "Stern John",          v: 70  },
    { n: "Luis Suarez",         v: 69  },
    { n: "Hossam Hassan",       v: 69  },
    { n: "Gerd Muller",         v: 68  },
    { n: "Mohamed Salah",       v: 68  } /* active — re-verify frequently */
  ]
};
