"use server";
import { db } from "../../../../../utils/dbConfig";
import { Budgets, Expenses } from "../../../../../utils/schema";
import { eq, desc, sql, getTableColumns, and } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getBudgetList() {
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
    .where(eq(Budgets.createdBy, email))
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
