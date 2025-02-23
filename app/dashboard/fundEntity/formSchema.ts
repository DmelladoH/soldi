import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  ISIN: z.string().min(1, {
    message: "ISIN is required",
  }),
  currency: z.string().min(1, {
    message: "Currency is required",
  }),
  type: z.string().min(1, {
    message: "Type is required",
  }),
});
