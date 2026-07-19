"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import ExpenseListTable from "./_components/ExpensesListTable";
import { getAllExpenses } from "../_actions/expenseActions";

function ExpensesScreen() {
  const [expensesList, setExpensesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    user && loadExpenses();
  }, [user]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const result = await getAllExpenses();
      setExpensesList(result);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpensesList([]);
    } finally {
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
          refreshData={() => loadExpenses()}
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
