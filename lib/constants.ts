import { Currency, Found } from "./types";

export const FundTypes: Record<Found, string> = {
  monetary: "Monetary",
  fixed: "Fixed",
  variable: "Variable",
  crypto: "Crypto",
  EFT: "ETF",
};

export const CurrencyTypes: Record<Currency, string> = {
  Euro: "€",
  Dollar: "$",
};

export const MonthMap = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};
export const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

export const MovementsCategory = {
  rent: 1,
  payroll: 2,
  groceries: 3,
  restaurants: 4,
  other: [5, 6],
  freelance: 7,
  traveling: 8,
  home: 9,
  books: 10,
  tech: 11,
};
