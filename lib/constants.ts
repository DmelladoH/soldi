import { Currency, Found } from "./types";

export const fundTypes: Record<Found, string> = {
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
