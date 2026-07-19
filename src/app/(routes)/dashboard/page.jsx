"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import CardInfo from "./_components/CardInfo";
import BarCharDashboard from "./_components/BarCharDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpensesListTable";
import WelcomeDialog from "./_components/WelcomeDialog";

import { getBudgetList, clonePreviousMonthBudgets } from "./_actions/budgetActions";
import { getIncomeList, clonePreviousMonthIncomes } from "./_actions/incomeActions";
import { getAllExpenses } from "./_actions/expenseActions";
import { useMonth } from "@/components/MonthContext";
import moment from "moment";
import { CopyPlus } from "lucide-react";

const Dashboard = () => {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [cloning, setCloning] = useState(false);
  const { selectedMonth } = useMonth();

  useEffect(() => {
    if (user && selectedMonth) {
      loadData();
    }
  }, [user, selectedMonth]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [budgets, incomes, expenses] = await Promise.all([
        getBudgetList(selectedMonth),
        getIncomeList(selectedMonth),
        getAllExpenses(selectedMonth)
      ]);
      setBudgetList(budgets);
      setIncomeList(incomes);
      setExpenseList(expenses);
      
      // Check if user has no data to show the welcome dialog
      if (budgets.length === 0 && incomes.length === 0) {
        setShowWelcome(true);
      }
    } catch (error) {
      console.error("Dashboard - Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshExpenses = async () => {
    try {
      const expenses = await getAllExpenses(selectedMonth);
      setExpenseList(expenses);
    } catch(error) {
      console.error(error);
    }
  };

  const cloneFromPrevious = async () => {
    try {
      setCloning(true);
      const prevMonth = moment(selectedMonth, "YYYY-MM").subtract(1, 'months').format("YYYY-MM");
      await clonePreviousMonthBudgets(selectedMonth, prevMonth);
      await clonePreviousMonthIncomes(selectedMonth, prevMonth);
      await loadData();
    } catch (error) {
      console.error(error);
    } finally {
      setCloning(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h2 className="font-bold text-4xl">Hi, {user?.fullName}</h2>
          <p className="text-gray-500">
            Here's What's happening with your money in {selectedMonth ? moment(selectedMonth).format("MMMM YYYY") : ''}.
          </p>
        </div>
      </div>
      
      <CardInfo budgetList={budgetList} incomeList={incomeList} />

      <div className="grid grid-cols-1 lg:grid-cols-3 mt-6 gap-5">
        <div className="lg:col-span-2">
          <BarCharDashboard budgetList={budgetList} />
          <ExpenseListTable
            refreshData={refreshExpenses}
            expensesList={expenseList}
          />
        </div>
        <div className="grid gap-5">
          <h2 className="font-bold text-lg">Latest Budgets</h2>
          {loading
            ? [1, 2, 3, 4].map((items, index) => (
                <div
                  key={index}
                  className="h-[180px] w-full bg-slate-200 dark:bg-zinc-800 rounded-lg animate-pulse"
                ></div>
              ))
            : budgetList?.length > 0
            ? budgetList.map((budget, index) => (
                <BudgetItem budget={budget} key={index} />
              ))
            : (
                <div className="text-center p-8 border-2 border-dashed rounded-lg">
                  <div className="text-gray-400">
                    <h3 className="text-lg font-semibold mb-1">No Budgets</h3>
                    <p className="text-xs mb-3">Create your first budget!</p>
                    <a
                      href="/dashboard/budgets"
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Create Budget →
                    </a>
                  </div>
                  {selectedMonth && (
                    <button
                      onClick={cloneFromPrevious}
                      disabled={cloning}
                      className="mt-4 flex items-center gap-2 justify-center w-full py-2 px-4 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-sm font-medium transition-colors"
                    >
                      <CopyPlus className="w-4 h-4" />
                      {cloning ? "Cloning..." : "Clone from Prev Month"}
                    </button>
                  )}
                </div>
              )}
        </div>
      </div>
      <WelcomeDialog isOpen={showWelcome} onOpenChange={setShowWelcome} />
    </div>
  );
};

export default Dashboard;
