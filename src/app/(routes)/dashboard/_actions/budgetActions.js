"use server";
import { db } from "../../../../../utils/dbConfig";
import { Budgets, Expenses, Incomes } from "../../../../../utils/schema";
import { eq, desc, sql, getTableColumns, and } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getBudgetList(month = null) {
  const user = await currentUser();
  if (!user || !user.primaryEmailAddress) throw new Error("Unauthorized");
  
  const email = user.primaryEmailAddress.emailAddress;
  
  let expensesCondition = eq(Budgets.id, Expenses.budgetId);
  
  let conditions = [eq(Budgets.createdBy, email)];
  if (month) {
    conditions.push(eq(Budgets.month, month));
  }

  const result = await db
    .select({
      ...getTableColumns(Budgets),
      totalSpend: sql`sum(CAST(${Expenses.amount} AS numeric))`.mapWith(Number),
      totalItem: sql`count(${Expenses.id})`.mapWith(Number),
    })
    .from(Budgets)
    .leftJoin(Expenses, expensesCondition)
    .where(and(...conditions))
    .groupBy(Budgets.id)
    .orderBy(desc(Budgets.id));

  return result;
}

export async function getBudgetInfo(budgetId) {
  const user = await currentUser();
  if (!user || !user.primaryEmailAddress) throw new Error("Unauthorized");
  
  const email = user.primaryEmailAddress.emailAddress;

  const result = await db
    .select({
      ...getTableColumns(Budgets),
      totalSpend: sql`sum(CAST(${Expenses.amount} AS numeric))`.mapWith(Number),
      totalItem: sql`count(${Expenses.id})`.mapWith(Number),
    })
    .from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(and(eq(Budgets.createdBy, email), eq(Budgets.id, budgetId)))
    .groupBy(Budgets.id);

  return result.length > 0 ? result[0] : null;
}

export async function createBudget(data) {
  const user = await currentUser();
  if (!user || !user.primaryEmailAddress) throw new Error("Unauthorized");
  
  const email = user.primaryEmailAddress.emailAddress;

  const result = await db.insert(Budgets).values({
    name: data.name,
    amount: data.amount,
    createdBy: email,
    icon: data.icon,
    month: data.month,
  }).returning({ insertedId: Budgets.id });

  revalidatePath("/dashboard/budgets");
  return result;
}

export async function editBudget(budgetId, data) {
  const user = await currentUser();
  if (!user || !user.primaryEmailAddress) throw new Error("Unauthorized");
  
  const email = user.primaryEmailAddress.emailAddress;

  const result = await db.update(Budgets)
    .set({
      name: data.name,
      amount: data.amount,
      icon: data.icon,
    })
    .where(and(eq(Budgets.id, budgetId), eq(Budgets.createdBy, email)))
    .returning();

  revalidatePath(`/dashboard/expenses/${budgetId}`);
  revalidatePath("/dashboard/budgets");
  return result;
}

export async function deleteBudget(budgetId) {
  const user = await currentUser();
  if (!user || !user.primaryEmailAddress) throw new Error("Unauthorized");
  
  const email = user.primaryEmailAddress.emailAddress;

  // Make sure to delete related expenses first, assuming no cascade deletion is set up
  await db.delete(Expenses).where(eq(Expenses.budgetId, budgetId)).returning();
  
  const result = await db.delete(Budgets)
    .where(and(eq(Budgets.id, budgetId), eq(Budgets.createdBy, email)))
    .returning();

  revalidatePath("/dashboard/budgets");
  return result;
}

export async function clonePreviousMonthBudgets(currentMonth, previousMonth) {
  const user = await currentUser();
  if (!user || !user.primaryEmailAddress) throw new Error("Unauthorized");
  
  const email = user.primaryEmailAddress.emailAddress;

  // Clone budgets
  const oldBudgets = await db.select().from(Budgets)
    .where(and(eq(Budgets.createdBy, email), eq(Budgets.month, previousMonth)));

  if (oldBudgets.length > 0) {
    const newBudgets = oldBudgets.map(b => ({
      name: b.name,
      amount: b.amount,
      icon: b.icon,
      createdBy: b.createdBy,
      month: currentMonth
    }));
    await db.insert(Budgets).values(newBudgets);
  }

  revalidatePath("/dashboard/budgets");
  return true;
}

export async function getLeftoverBalance(month) {
  const user = await currentUser();
  if (!user || !user.primaryEmailAddress) return 0;
  
  const email = user.primaryEmailAddress.emailAddress;

  // Get total income for the month
  const incomeResult = await db.select({
    total: sql`sum(CAST(${Incomes.amount} AS numeric))`.mapWith(Number)
  }).from(Incomes).where(and(eq(Incomes.createdBy, email), eq(Incomes.month, month)));
  
  const totalIncome = incomeResult[0]?.total || 0;

  // Get total expenses for the month by joining expenses to budgets of that month
  const expensesResult = await db.select({
    total: sql`sum(CAST(${Expenses.amount} AS numeric))`.mapWith(Number)
  }).from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(and(eq(Budgets.createdBy, email), eq(Budgets.month, month)));
    
  const totalExpenses = expensesResult[0]?.total || 0;

  return totalIncome - totalExpenses;
}
