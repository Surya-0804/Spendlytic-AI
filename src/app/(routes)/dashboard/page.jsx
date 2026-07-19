"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import CardInfo from "./_components/CardInfo";
import BarCharDashboard from "./_components/BarCharDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpensesListTable";
import WelcomeDialog from "./_components/WelcomeDialog";

import { getBudgetList } from "./_actions/budgetActions";
import { getIncomeList } from "./_actions/incomeActions";
import { getAllExpenses } from "./_actions/expenseActions";

const Dashboard = () => {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [budgets, incomes, expenses] = await Promise.all([
        getBudgetList(),
        getIncomeList(),
        getAllExpenses()
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
      const expenses = await getAllExpenses();
      setExpenseList(expenses);
    } catch(error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8">
      <h2 className="font-bold text-4xl">Hi, {user?.fullName}</h2>
      <p className="text-gray-500">
        Here's Whats happening with your money. Let's manage your money
      </p>
      
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
                  className="h-[180px] w-full bg-slate-200 rounded-lg animate-pulse"
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
                </div>
              )}
        </div>
      </div>
      <WelcomeDialog isOpen={showWelcome} onOpenChange={setShowWelcome} />
    </div>
  );
};

export default Dashboard;
