import { Currency, Found } from "./types";

export const FundTypes: Record<Found, string> = {
  monetary: "monetary",
  fixed: "fixed",
  variable: "variable",
};

export const CurrencyTypes: Record<Currency, string> = {
  Euro: "€",
  Dollar: "$",
};
