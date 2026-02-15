"use client";
import React, { useEffect, useState } from "react";
import CreateBudget from "./CreateBudget";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import BudgetItem from "./BudgetItem";
import { db } from "../../../../../../utils/dbConfig";
import { Budgets, Expenses } from "../../../../../../utils/schema";

function BudgetList() {
  const [budgetList, setBudgetList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  useEffect(() => {
    user && getBudgetList();
  }, [user]);
  /**
   * used to get budget List
   */
  const getBudgetList = async () => {
    try {
      setLoading(true);
      console.log("Fetching budgets for user:", user?.primaryEmailAddress?.emailAddress);
      
      const result = await db
        .select({
          ...getTableColumns(Budgets),
          // Casting Expenses.amount to numeric before summing
          totalSpend: sql`SUM(CAST(${Expenses.amount} AS numeric))`.mapWith(
            Number
          ),
          totalItem: sql`COUNT(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));

      console.log("Budgets fetched:", result);
      setBudgetList(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      setBudgetList([]);
      setLoading(false);
    }
  };

  return (
    <div className="mt-7">
      <div
        className="grid grid-cols-1
        md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <CreateBudget refreshData={() => getBudgetList()} />
        {loading
          ? [1, 2, 3, 4, 5].map((item, index) => (
              <div
                key={index}
                className="w-full bg-slate-200 rounded-lg
        h-[150px] animate-pulse"
              ></div>
            ))
          : budgetList?.length > 0
          ? budgetList.map((budget, index) => (
              <BudgetItem budget={budget} key={index} />
            ))
          : (
              <div className="col-span-2 text-center p-10">
                <div className="text-gray-400">
                  <h3 className="text-xl font-semibold mb-2">No Budgets Yet</h3>
                  <p className="text-sm">Create your first budget to start tracking expenses!</p>
                </div>
              </div>
            )}
      </div>
    </div>
  );
}

export default BudgetList;
