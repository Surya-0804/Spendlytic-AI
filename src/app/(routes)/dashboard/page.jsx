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
  const [daysFilter, setDaysFilter] = useState(""); // empty string means All Time

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, daysFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const days = daysFilter ? parseInt(daysFilter) : null;
      const [budgets, incomes, expenses] = await Promise.all([
        getBudgetList(days),
        getIncomeList(),
        getAllExpenses(days)
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
      const days = daysFilter ? parseInt(daysFilter) : null;
      const expenses = await getAllExpenses(days);
      setExpenseList(expenses);
    } catch(error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h2 className="font-bold text-4xl">Hi, {user?.fullName}</h2>
          <p className="text-gray-500">
            Here's What's happening with your money. Let's manage your money
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <label className="text-sm font-medium text-gray-500">Filter:</label>
          <select 
            className="p-2 border rounded-md text-sm outline-none dark:bg-slate-800"
            value={daysFilter}
            onChange={(e) => setDaysFilter(e.target.value)}
          >
            <option value="">All Time</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last Year</option>
          </select>
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
                  className="h-[180px] w-full bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"
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
