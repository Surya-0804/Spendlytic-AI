"use client";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "../../../../../utils/dbConfig";
import ExpenseListTable from "./_components/ExpensesListTable";
import { Budgets, Expenses } from "../../../../../utils/schema";
import AddExpense from "./_components/AddExpenses";

function ExpensesScreen() {
  const [expensesList, setExpensesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    user && getAllExpenses();
  }, [user]);
  /**
   * Used to get All expenses belong to users
   */
  const getAllExpenses = async () => {
    try {
      setLoading(true);
      console.log("Fetching expenses for user:", user?.primaryEmailAddress?.emailAddress);
      
      const result = await db
        .select({
          id: Expenses.id,
          name: Expenses.name,
          amount: Expenses.amount,
          createdAt: Expenses.createdAt,
        })
        .from(Budgets)
        .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
        .orderBy(desc(Expenses.id));
      
      console.log("Expenses fetched:", result);
      setExpensesList(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpensesList([]);
      setLoading(false);
    }
  };
  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl">My Expenses</h2>

      {loading ? (
        <div className="mt-7">
          {[1, 2, 3].map((item, index) => (
            <div
              key={index}
              className="w-full bg-slate-200 rounded-lg h-[60px] mb-3 animate-pulse"
            ></div>
          ))}
        </div>
      ) : expensesList?.length > 0 ? (
        <ExpenseListTable
          refreshData={() => getAllExpenses()}
          expensesList={expensesList}
        />
      ) : (
        <div className="mt-10 text-center p-10 border-2 border-dashed rounded-lg">
          <div className="text-gray-400">
            <h3 className="text-xl font-semibold mb-2">No Expenses Yet</h3>
            <p className="text-sm mb-4">Create a budget first, then start adding expenses to track your spending!</p>
            <a href="/dashboard/budgets" className="text-blue-600 hover:underline">
              Go to Budgets →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpensesScreen;
