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

  useEffect(() => {
    if (user) {
      (async () => {
        await getBudgetList();
      })();
    }
  }, [user]);

  const getBudgetList = async () => {
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

    setBudgetList(response);
    getAllExpenses();
    getIncomeList();
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

      // console.log("Expenses fetched:", JSON.stringify(response, null, 2)); // Add this detailed log
      setExpenseList(response);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };
  const getIncomeList = async () => {
    try {
      const response = await db
        .select({
          ...getTableColumns(Incomes),
          totalAmount: sql`sum(cast(${Incomes.amount} as numeric))`.mapWith(
            Number
          ),
        })
        .from(Incomes)
        .groupBy(Incomes.id);

      setIncomeList(response);
    } catch (error) {
      console.log("Error in fetching the income list:", error);
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
          {budgetList?.length > 0
            ? budgetList.map((budget, index) => (
                <BudgetItem budget={budget} key={index} />
              ))
            : [1, 2, 3, 4].map((items, index) => (
                <div
                  key={index}
                  className="h-[180px] w-full bg-slate-200 lg animate-pulse"
                ></div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
