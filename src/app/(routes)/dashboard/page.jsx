"use client";
import React, { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import CardInfo from "./_components/CardInfo";
import { getTableColumns, sql, eq, desc } from "drizzle-orm";
import { Budgets, Expenses, Incomes } from "../../../../utils/schema";
import { db } from "../../../../utils/dbConfig";
import BarCharDashboard from "./_components/BarCharDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpensesListTable";
// import CardInfo
const Dashboard = () => {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      (async () => {
        await getBudgetList();
      })();
    }
  }, [user]);

  const getBudgetList = async () => {
    try {
      setLoading(true);
      console.log("Dashboard - Fetching budgets for user:", user?.primaryEmailAddress?.emailAddress);
      
      const response = await db
        .select({
          ...getTableColumns(Budgets),
          // Cast amount to numeric type before summing
          totalSpend: sql`sum(CAST(${Expenses.amount} AS numeric))`.mapWith(
            Number
          ),
          totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));

      console.log("Dashboard - Budgets fetched:", response);
      setBudgetList(response);
      getAllExpenses();
      getIncomeList();
      setLoading(false);
    } catch (error) {
      console.error("Dashboard - Error fetching budgets:", error);
      setBudgetList([]);
      setLoading(false);
    }
  };

  const getAllExpenses = async () => {
    if (
      !user ||
      !user.primaryEmailAddress ||
      !user.primaryEmailAddress.emailAddress
    ) {
      console.error("User email address not available.");
      return;
    }

    try {
      console.log("Dashboard - Fetching expenses for user:", user.primaryEmailAddress.emailAddress);
      
      const response = await db
        .select({
          id: Expenses.id,
          name: Expenses.name,
          amount: Expenses.amount,
          createdAt: Expenses.createdAt,
        })
        .from(Expenses)
        .where(eq(Expenses.createdBy, user.primaryEmailAddress.emailAddress))
        .orderBy(desc(Expenses.id));

      console.log("Dashboard - Expenses fetched:", response);
      setExpenseList(response);
    } catch (error) {
      console.error("Dashboard - Error fetching expenses:", error);
    }
  };
  const getIncomeList = async () => {
    try {
      console.log("Dashboard - Fetching incomes for user:", user?.primaryEmailAddress?.emailAddress);
      
      const response = await db
        .select({
          ...getTableColumns(Incomes),
        })
        .from(Incomes)
        .where(eq(Incomes.createdBy, user?.primaryEmailAddress.emailAddress))
        .orderBy(desc(Incomes.id));

      console.log("Dashboard - Incomes fetched:", response);
      setIncomeList(response);
    } catch (error) {
      console.log("Dashboard - Error in fetching the income list:", error);
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
            refreshData={() => getAllExpenses()}
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
    </div>
  );
};

export default Dashboard;
