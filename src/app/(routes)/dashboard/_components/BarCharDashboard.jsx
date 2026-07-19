"use client";
import React from "react";
import { useTheme } from "next-themes";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BarCharDashboard = ({ budgetList }) => {
  // Convert amount and totalSpend to numbers
  const formattedBudgetList = budgetList?.map((budget) => ({
    ...budget,
    amount: Number(budget.amount),
    totalSpend: Number(budget.totalSpend),
  })) || [];

  const { resolvedTheme } = useTheme();

  return (
    <div className="border rounded-2xl p-5 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="font-bold text-lg">Activity</h2>
      {formattedBudgetList.length > 0 ? (
        <ResponsiveContainer width={"100%"} height={300}>
          <BarChart data={formattedBudgetList} margin={{ top: 7 }}>
            <XAxis dataKey="name" stroke={resolvedTheme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={resolvedTheme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
            <Tooltip 
              cursor={{ fill: resolvedTheme === "dark" ? "#334155" : "#f1f5f9" }}
              contentStyle={{
                backgroundColor: resolvedTheme === "dark" ? "#0f172a" : "#fff",
                border: "1px solid",
                borderColor: resolvedTheme === "dark" ? "#1e293b" : "#e2e8f0",
                borderRadius: "8px",
                color: resolvedTheme === "dark" ? "#f8fafc" : "#0f172a",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
              }}
              itemStyle={{ color: resolvedTheme === "dark" ? "#f8fafc" : "#0f172a" }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="totalSpend" name="Total Spend" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
            <Bar dataKey="amount" name="Remaining Amount" stackId="b" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-center text-gray-400">
            <p className="text-sm">No budget data to display</p>
            <p className="text-xs mt-1">Create a budget to see activity</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarCharDashboard;
