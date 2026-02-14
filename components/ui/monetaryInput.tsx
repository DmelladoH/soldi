import React from "react";
import CurrencyInput, { CurrencyInputProps } from "react-currency-input-field";
import { cn } from "@/lib/utils";

export default function MonetaryInput({
  className,
  onChange,
  ...props
}: CurrencyInputProps) {
  return (
    <CurrencyInput
      decimalsLimit={2}
      groupSeparator="."
      decimalSeparator=","
      intlConfig={{ locale: "es-ES", currency: "EUR" }}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      onValueChange={onChange}
      {...props}
    />
  );
}
