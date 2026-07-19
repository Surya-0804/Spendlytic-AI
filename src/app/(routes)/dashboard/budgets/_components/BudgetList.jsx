"use client";
import React, { useEffect, useState } from "react";
import CreateBudget from "./CreateBudget";
import { useUser } from "@clerk/nextjs";
import BudgetItem from "./BudgetItem";
import { getBudgetList } from "../../_actions/budgetActions";

function BudgetList() {
  const [budgetList, setBudgetList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  useEffect(() => {
    user && loadBudgets();
  }, [user]);

  const loadBudgets = async () => {
    try {
      setLoading(true);
      const result = await getBudgetList();
      setBudgetList(result);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      setBudgetList([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-7">
      <div
        className="grid grid-cols-1
        md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <CreateBudget refreshData={() => loadBudgets()} />
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
