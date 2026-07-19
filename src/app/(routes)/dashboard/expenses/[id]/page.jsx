"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import BudgetItem from "../../budgets/_components/BudgetItem";
import ExpensesListTable from "../_components/ExpensesListTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import EditBudget from "../_components/EditBudget";
import AddExpense from "../_components/AddExpenses";

import { getBudgetInfo, deleteBudget } from "../../_actions/budgetActions";
import { getExpensesByBudget } from "../../_actions/expenseActions";

function ExpensesScreen({ params }) {
  const { user } = useUser();
  const [budgetInfo, setbudgetInfo] = useState();
  const [expensesList, setExpensesList] = useState([]);
  const route = useRouter();

  useEffect(() => {
    if (user) {
      loadBudgetInfo();
    }
  }, [user]);

  const loadBudgetInfo = async () => {
    try {
      const budget = await getBudgetInfo(Number(params.id));
      if (budget) {
        setbudgetInfo(budget);
        loadExpenses();
      } else {
        console.warn("No budget information found");
      }
    } catch (error) {
      console.error("Error fetching budget info:", error);
    }
  };

  const loadExpenses = async () => {
    try {
      const expenses = await getExpensesByBudget(Number(params.id));
      setExpensesList(expenses);
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteBudget = async () => {
    try {
      await deleteBudget(Number(params.id));
      toast.success("Budget Deleted !");
      route.replace("/dashboard/budgets");
    } catch (error) {
      toast.error("Failed to delete budget");
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold gap-2 flex justify-between items-center">
        <span className="flex gap-2 items-center">
          <ArrowLeft onClick={() => route.back()} className="cursor-pointer" />
          My Expenses
        </span>
        <div className="flex gap-2 items-center">
          <EditBudget
            budgetInfo={budgetInfo}
            refreshData={() => loadBudgetInfo()}
          />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="flex gap-2 rounded-full" variant="destructive">
                <Trash2 className="w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your current budget along with expenses and remove your data
                  from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDeleteBudget()}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </h2>
      <div
        className="grid grid-cols-1 
        md:grid-cols-2 mt-6 gap-5"
      >
        {budgetInfo ? (
          <BudgetItem budget={budgetInfo} />
        ) : (
          <div
            className="h-[150px] w-full bg-slate-200 dark:bg-slate-800
            rounded-lg animate-pulse"
          ></div>
        )}
        <AddExpense
          budgetId={Number(params.id)}
          user={user}
          refreshData={() => loadBudgetInfo()}
        />
      </div>
      <div className="mt-4">
        <ExpensesListTable
          expensesList={expensesList}
          refreshData={() => loadBudgetInfo()}
        />
      </div>
    </div>
  );
}

export default ExpensesScreen;
