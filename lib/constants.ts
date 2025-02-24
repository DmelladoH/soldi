import { Currency, Found } from "./types";

export const FundTypes: Record<Found, string> = {
  monetary: "Monetary",
  fixed: "Fixed",
  variable: "Variable",
  crypto: "Crypto",
};

export const CurrencyTypes: Record<Currency, string> = {
  Euro: "€",
  Dollar: "$",
};
