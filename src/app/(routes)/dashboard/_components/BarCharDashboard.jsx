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
  return (
    <div className="border rounded-2xl p-5">
      <h2 className="font-bold text-lg">Activity</h2>
      <ResponsiveContainer width={"80%"} height={"300px"}>
        <BarChart data={budgetList} margin={{ top: 7 }}>
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
