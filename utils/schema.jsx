import {
    integer, numeric, varchar, pgTable, serial
} from 'drizzle-orm/pg-core'


//schema for budget table
export const Budgets=  pgTable("budgets",{
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    amount: varchar('amount').notNull(),
    icon: varchar('icon'),
    createdBy: varchar('createdBy').notNull(),
})

//schema for income table
export const Incomes=  pgTable("incomes",{
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    amount: varchar('amount').notNull(),
    icon: varchar('icon'),
    createdBy: varchar('createdBy').notNull(),
})

//schema for expenses table
export const Expenses=  pgTable("expenses",{
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    amount: varchar('amount').notNull(),
    budgetId: integer('budgetId').references(()=>Budgets.id),
    createdBy: varchar('createdBy').notNull(),
})