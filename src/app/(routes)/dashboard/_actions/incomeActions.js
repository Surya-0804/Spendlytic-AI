"use server";
import { db } from "../../../../../utils/dbConfig";
import { Incomes } from "../../../../../utils/schema";
import { eq, desc, getTableColumns, and } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getIncomeList() {
  const user = await currentUser();
  if (!user || !user.primaryEmailAddress) throw new Error("Unauthorized");
  
  const email = user.primaryEmailAddress.emailAddress;
  
  const result = await db
    .select({
      ...getTableColumns(Incomes),
    })
    .from(Incomes)
    .where(eq(Incomes.createdBy, email))
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
