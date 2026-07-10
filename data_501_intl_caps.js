/* data_501_intl_caps.js — Football 501 category: most international caps
 * (men's football, all-time, any nation). Value = career caps for country.
 *
 * VERIFICATION (per plan's B6 data accuracy pipeline):
 *   Primary source:      Wikipedia — "List of men's footballers with 100 or
 *                         more international caps" (full ranked table)
 *   Cross-check source:  Guinness World Records + olympics.com independently
 *                         confirm Cristiano Ronaldo as the record holder,
 *                         though his exact figure varies by article date
 *                         (226 as of one Nov-2025 report vs 233 in the
 *                         Wikipedia table used here) — he's still an active
 *                         international as of asOf, so this is expected and
 *                         explicitly flagged for re-verify below, not hidden.
 *   asOf:                2026-07-11
 *   Re-verify:           Ronaldo, Messi, Modrić, and several others in this
 *                         top 30 were still active internationals as of
 *                         asOf — re-verify each international window
 *                         (every few months, not just yearly, since caps
 *                         accumulate faster than club-season stats).
 *
 * Shape mirrors every other data file in this app: {label, unit, asOf, rows}. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.intl_caps = {
  label: "Most international caps",
  unit: "caps",
  asOf: "2026-07-11",
  source: "https://en.wikipedia.org/wiki/List_of_men%27s_footballers_with_100_or_more_international_caps",
  rows: [
    { n: "Cristiano Ronaldo",  v: 233 }, /* active — re-verify frequently */
    { n: "Lionel Messi",       v: 204 }, /* active — re-verify frequently */
    { n: "Luka Modric",        v: 202 }, /* active — re-verify frequently */
    { n: "Bader Al-Mutawa",    v: 202 },
    { n: "Soh Chin Ann",       v: 195 },
    { n: "Ahmed Kano",         v: 193 },
    { n: "Hassan Al-Haydos",   v: 188 },
    { n: "Ahmed Hassan",       v: 184 },
    { n: "Maynor Figueroa",    v: 181 },
    { n: "Andres Guardado",    v: 180 },
    { n: "Sergio Ramos",       v: 180 },
    { n: "Claudio Suarez",     v: 178 },
    { n: "Hossam Hassan",      v: 177 },
    { n: "Gianluigi Buffon",   v: 176 },
    { n: "Mohamed Al-Deayea",  v: 173 },
    { n: "Amer Shafi",         v: 171 },
    { n: "Ivan Hurtado",       v: 168 },
    { n: "Alexis Sanchez",     v: 168 }, /* active — re-verify frequently */
    { n: "Iker Casillas",      v: 167 },
    { n: "Robert Lewandowski", v: 166 }, /* active — re-verify frequently */
    { n: "Vitalijs Astafjevs", v: 166 },
    { n: "Cobi Jones",         v: 164 },
    { n: "Sayed Mohammed Jaffer", v: 163 },
    { n: "Mohammed Al-Khilaiwi", v: 163 },
    { n: "Shukor Salleh",      v: 163 },
    { n: "Diego Godin",        v: 161 },
    { n: "Mohamed Husain",     v: 161 },
    { n: "Salman Isa",         v: 161 },
    { n: "Gary Medel",         v: 161 },
    { n: "Adnan Al-Talyani",   v: 161 }
  ]
};
