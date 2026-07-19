"use server";
import { db } from "../../../../../utils/dbConfig";
import { Savings } from "../../../../../utils/schema";
import { eq, desc, and } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getSavings(month = null) {
  const user = await currentUser();
  if (!user || !user.primaryEmailAddress) throw new Error("Unauthorized");
  
  const email = user.primaryEmailAddress.emailAddress;
  
  let conditions = [eq(Savings.createdBy, email)];
  if (month) {
    conditions.push(eq(Savings.month, month));
  }

  const result = await db
    .select()
    .from(Savings)
    .where(and(...conditions))
    .orderBy(desc(Savings.createdAt));

  return result;
}

export async function addSavings(data) {
  const user = await currentUser();
  if (!user || !user.primaryEmailAddress) throw new Error("Unauthorized");
  
  const email = user.primaryEmailAddress.emailAddress;

  const result = await db.insert(Savings).values({
    name: data.name,
    amount: data.amount,
    createdBy: email,
    icon: data.icon || "💰",
    month: data.month,
  }).returning({ insertedId: Savings.id });

  revalidatePath("/dashboard/savings");
  revalidatePath("/dashboard");
  return result;
}
