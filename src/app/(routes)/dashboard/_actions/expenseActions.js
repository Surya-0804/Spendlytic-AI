"use server";
import { db } from "../../../../../utils/dbConfig";
import { Budgets, Expenses } from "../../../../../utils/schema";
import { eq, desc, and } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getAllExpenses() {
  const user = await currentUser();
  if (!user || !user.primaryEmailAddress) throw new Error("Unauthorized");
  
  const email = user.primaryEmailAddress.emailAddress;
  
  // Gets all expenses across all budgets for the user
  const result = await db
    .select({
      id: Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      createdAt: Expenses.createdAt,
      budgetId: Expenses.budgetId,
    })
    .from(Budgets)
    .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, email))
    .orderBy(desc(Expenses.id));

  return result;
}

export async function getExpensesByBudget(budgetId) {
  const result = await db
    .select()
    .from(Expenses)
    .where(eq(Expenses.budgetId, budgetId))
    .orderBy(desc(Expenses.id));
    
  return result;
}

export async function createExpense(data) {
  const user = await currentUser();
  if (!user || !user.primaryEmailAddress) throw new Error("Unauthorized");
  
  const email = user.primaryEmailAddress.emailAddress;

  // First verify the budget belongs to the user
  const budgetCheck = await db.select().from(Budgets).where(and(eq(Budgets.id, data.budgetId), eq(Budgets.createdBy, email)));
  if (budgetCheck.length === 0) throw new Error("Unauthorized or Budget not found");

  const result = await db.insert(Expenses).values({
    name: data.name,
    amount: data.amount,
    budgetId: data.budgetId,
    createdBy: email,
  }).returning({ insertedId: Expenses.id });

  revalidatePath(`/dashboard/expenses/${data.budgetId}`);
  revalidatePath("/dashboard/expenses");
  revalidatePath("/dashboard");
  return result;
}

export async function deleteExpense(expenseId) {
  const user = await currentUser();
  if (!user || !user.primaryEmailAddress) throw new Error("Unauthorized");
  
  const email = user.primaryEmailAddress.emailAddress;

  // Fetch expense first to check if the user is authorized (check via budget's createdBy or expense's createdBy)
  const expenseCheck = await db.select().from(Expenses).where(and(eq(Expenses.id, expenseId), eq(Expenses.createdBy, email)));
  if (expenseCheck.length === 0) throw new Error("Unauthorized or Expense not found");

  const result = await db.delete(Expenses)
    .where(eq(Expenses.id, expenseId))
    .returning();

  revalidatePath(`/dashboard/expenses/${expenseCheck[0].budgetId}`);
  revalidatePath("/dashboard/expenses");
  revalidatePath("/dashboard");
  return result;
}
