"use client";
import { Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { deleteExpense as deleteExpenseAction } from "../../_actions/expenseActions";
import { useCurrency } from "@/components/CurrencyProvider";

function ExpenseListTable({ expensesList, refreshData }) {
  const { formatCurrency } = useCurrency();
  const deleteExpense = async (expense) => {
    try {
      const result = await deleteExpenseAction(expense.id);

      if (result && result.length > 0) {
        toast.success("Expense Deleted!");
        refreshData();
      } else {
        throw new Error("Failed to delete the expense.");
      }
    } catch (error) {
      toast.error("Error deleting expense: " + error.message);
    }
  };

  return (
    <div className="mt-3">
      <h2 className="font-bold text-lg">Latest Expenses</h2>
      {expensesList && expensesList.length > 0 ? (
        <>
          <div className="grid grid-cols-4 rounded-tl-xl rounded-tr-xl bg-slate-200 dark:bg-zinc-800 p-2 mt-3">
            <h2 className="font-bold">Name</h2>
            <h2 className="font-bold">Amount</h2>
            <h2 className="font-bold">Date</h2>
            <h2 className="font-bold">Action</h2>
          </div>
          <div className="max-h-[350px] overflow-y-auto custom-scrollbar rounded-bl-xl rounded-br-xl border border-t-0 dark:border-zinc-800">
            {expensesList.map((expenses) => (
              <div
                key={expenses.id} // Ensure each item has a unique key
                className="grid grid-cols-4 bg-slate-50 dark:bg-zinc-900 border-b dark:border-zinc-800 p-2 items-center last:border-b-0"
              >
                <h2>{expenses.name}</h2>
                <h2>{formatCurrency(expenses.amount)}</h2>
                <h2>{new Date(expenses.createdAt).toLocaleDateString()}</h2>
                <div
                  onClick={() => deleteExpense(expenses)}
                  className="text-red-500 cursor-pointer flex items-center gap-1 hover:text-red-700 transition-colors"
                >
                  <Trash className="w-4 h-4" /> Delete
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-3 p-6 text-center border-2 border-dashed rounded-lg">
          <p className="text-gray-400 text-sm">No expenses recorded yet</p>
        </div>
      )}
    </div>
  );
}

export default ExpenseListTable;
