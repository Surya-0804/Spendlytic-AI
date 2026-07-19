import {
  integer,
  numeric,
  varchar,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";

//schema for budget table
export const Budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull(),
  icon: varchar("icon"),
  createdBy: varchar("createdBy").notNull(),
});

//schema for income table
export const Incomes = pgTable("incomes", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull(),
  icon: varchar("icon"),
  createdBy: varchar("createdBy").notNull(),
});

//schema for expenses table
export const Expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull(),
  budgetId: integer("budgetId").references(() => Budgets.id),
  createdBy: varchar("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

//schema for subscriptions table
export const Subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull(),
  frequency: varchar("frequency").notNull(), // 'Weekly', 'Monthly', 'Yearly'
  nextPaymentDate: timestamp("nextPaymentDate").notNull(),
  createdBy: varchar("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
