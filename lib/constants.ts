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
