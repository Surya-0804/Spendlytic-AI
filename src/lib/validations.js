import { z } from "zod";

export const budgetSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  icon: z.string().optional(),
});

export const incomeSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  icon: z.string().optional(),
});

export const expenseSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  budgetId: z.number().int().positive("Invalid budget"),
});

export const subscriptionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  frequency: z.enum(["Weekly", "Monthly", "Yearly"], {
    errorMap: () => ({ message: "Please select a valid frequency" })
  }),
  nextPaymentDate: z.string().or(z.date()),
});
