"use server";
import { db } from "../../../../../utils/dbConfig";
import { Incomes } from "../../../../../utils/schema";
import { eq, desc, getTableColumns, and } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getIncomeList(month = null) {
  const user = await currentUser();
  if (!user || !user.primaryEmailAddress) throw new Error("Unauthorized");
  
  const email = user.primaryEmailAddress.emailAddress;
  
  let conditions = [eq(Incomes.createdBy, email)];
  if (month) {
    conditions.push(eq(Incomes.month, month));
  }

  const result = await db
    .select({
      ...getTableColumns(Incomes),
    })
    .from(Incomes)
    .where(and(...conditions))
    .orderBy(desc(Incomes.id));

  return result;
}

export async function createIncome(data) {
  const user = await currentUser();
  if (!user || !user.primaryEmailAddress) throw new Error("Unauthorized");
  
  const email = user.primaryEmailAddress.emailAddress;

  const result = await db.insert(Incomes).values({
    name: data.name,
    amount: data.amount,
    createdBy: email,
    icon: data.icon,
    month: data.month,
  }).returning({ insertedId: Incomes.id });

  revalidatePath("/dashboard/incomes");
  return result;
}

export async function deleteIncome(incomeId) {
  const user = await currentUser();
  if (!user || !user.primaryEmailAddress) throw new Error("Unauthorized");
  
  const email = user.primaryEmailAddress.emailAddress;

  const result = await db.delete(Incomes)
    .where(and(eq(Incomes.id, incomeId), eq(Incomes.createdBy, email)))
    .returning();

  revalidatePath("/dashboard/incomes");
  return result;
}

export async function editIncome(id, data) {
  const user = await currentUser();
  if (!user || !user.primaryEmailAddress) throw new Error("Unauthorized");
  
  const email = user.primaryEmailAddress.emailAddress;

  const result = await db.update(Incomes).set({
    name: data.name,
    amount: data.amount,
    icon: data.icon,
  })
  .where(and(eq(Incomes.id, id), eq(Incomes.createdBy, email)))
  .returning();

  revalidatePath("/dashboard/incomes");
  return result;
}

export async function clonePreviousMonthIncomes(currentMonth, previousMonth) {
  const user = await currentUser();
  if (!user || !user.primaryEmailAddress) throw new Error("Unauthorized");
  
  const email = user.primaryEmailAddress.emailAddress;

  const oldIncomes = await db.select().from(Incomes)
    .where(and(eq(Incomes.createdBy, email), eq(Incomes.month, previousMonth)));

  if (oldIncomes.length > 0) {
    const newIncomes = oldIncomes.map(i => ({
      name: i.name,
      amount: i.amount,
      icon: i.icon,
      createdBy: i.createdBy,
      month: currentMonth
    }));
    await db.insert(Incomes).values(newIncomes);
  }

  revalidatePath("/dashboard/incomes");
  return true;
}
