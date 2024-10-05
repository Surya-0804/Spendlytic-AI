import React from "react";
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
  const formattedBudgetList = budgetList.map((budget) => ({
    ...budget,
    amount: Number(budget.amount),
    totalSpend: Number(budget.totalSpend),
  }));

  return (
    <div className="border rounded-2xl p-5">
      <h2 className="font-bold text-lg">Activity</h2>
      <ResponsiveContainer width={"100%"} height={300}>
        <BarChart data={formattedBudgetList} margin={{ top: 7 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalSpend" stackId="a" fill="#4845d2" />
          <Bar dataKey="amount" stackId="b" fill="#c3c2ff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarCharDashboard;
