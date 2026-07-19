"use server";
import { db } from "../../../../../utils/dbConfig";
import { Subscriptions } from "../../../../../utils/schema";
import { eq, desc, getTableColumns, and } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getSubscriptionList() {
  const user = await currentUser();
  if (!user || !user.primaryEmailAddress) throw new Error("Unauthorized");
  
  const email = user.primaryEmailAddress.emailAddress;
  
  const result = await db
    .select({
      ...getTableColumns(Subscriptions),
    })
    .from(Subscriptions)
    .where(eq(Subscriptions.createdBy, email))
    .orderBy(desc(Subscriptions.nextPaymentDate));

  return result;
}

export async function createSubscription(data) {
  const user = await currentUser();
  if (!user || !user.primaryEmailAddress) throw new Error("Unauthorized");
  
  const email = user.primaryEmailAddress.emailAddress;

  const result = await db.insert(Subscriptions).values({
    name: data.name,
    amount: data.amount,
    frequency: data.frequency,
    nextPaymentDate: new Date(data.nextPaymentDate),
    createdBy: email,
  }).returning({ insertedId: Subscriptions.id });

  revalidatePath("/dashboard/subscriptions");
  return result;
}

export async function deleteSubscription(id) {
  const user = await currentUser();
  if (!user || !user.primaryEmailAddress) throw new Error("Unauthorized");
  
  const email = user.primaryEmailAddress.emailAddress;

  const result = await db.delete(Subscriptions)
    .where(and(eq(Subscriptions.id, id), eq(Subscriptions.createdBy, email)))
    .returning();

  revalidatePath("/dashboard/subscriptions");
  return result;
}
