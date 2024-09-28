import { eq } from "drizzle-orm";
import { Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { db } from "../../../../../../utils/dbConfig";
import { Expenses } from "../../../../../../utils/schema";

function ExpenseListTable({ expensesList, refreshData }) {
  console.log(expensesList);
  const deleteExpense = async (expense) => {
    try {
      const result = await db
        .delete(Expenses)
        .where(eq(Expenses.id, expense.id))
        .returning();

      if (result.length > 0) {
        toast.success("Expense Deleted!");
        refreshData(); // Refresh data after deletion
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
      <div className="grid grid-cols-4 rounded-tl-xl rounded-tr-xl bg-slate-200 p-2 mt-3">
        <h2 className="font-bold">Name</h2>
        <h2 className="font-bold">Amount</h2>
        <h2 className="font-bold">Date</h2>
        <h2 className="font-bold">Action</h2>
      </div>
      {expensesList?.map((expenses) => (
        <div
          key={expenses.id} // Ensure each item has a unique key
          className="grid grid-cols-4 bg-slate-50 rounded-bl-xl rounded-br-xl p-2"
        >
          <h2>{expenses.name}</h2>
          <h2>{expenses.amount}</h2>
          {/* <h2>{new Date(expenses.createdAt).toLocaleDateString()}</h2> */}
          <div
            onClick={() => deleteExpense(expenses)}
            className="text-red-500 cursor-pointer"
          >
            <Trash className="inline-block" /> Delete
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExpenseListTable;
