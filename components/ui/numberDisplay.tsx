"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const numberVariants = cva("text-sm font-semibold ", {
  variants: {
    variant: {
      positive: "text-green-500",
      negative: "text-red-500",
      neutral: "text-gray-500",
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});
const NumberDisplay = ({
  className,
  amount,
  currency,
  ...props
}: {
  className?: string;
  amount: number;
  currency: string;
}) => {
  const variant = amount > 0 ? "positive" : amount < 0 ? "negative" : "neutral";
  return (
    <span className={cn(numberVariants({ variant }), className)} {...props}>
      {amount} {currency}
    </span>
  );
};

export default NumberDisplay;
