"use client";
import React, { useEffect, useState } from "react";
import CreateIncomes from "./CreateIncomes";
import { desc, eq, getTableColumns } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import IncomeItem from "./IncomeItem";
import { db } from "../../../../../../utils/dbConfig";
import { Incomes } from "../../../../../../utils/schema";

function IncomeList() {
  const [incomelist, setIncomelist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  useEffect(() => {
    user && getIncomelist();
  }, [user]);

  const getIncomelist = async () => {
    try {
      setLoading(true);
      console.log("Fetching incomes for user:", user?.primaryEmailAddress?.emailAddress);
      
      const result = await db
        .select({
          ...getTableColumns(Incomes),
        })
        .from(Incomes)
        .where(eq(Incomes.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(Incomes.id));

      console.log("Incomes fetched:", result);
      setIncomelist(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching incomes:", error);
      setIncomelist([]);
      setLoading(false);
    }
  };

  return (
    <div className="mt-7">
      <div
        className="grid grid-cols-1
        md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <CreateIncomes refreshData={() => getIncomelist()} />
        {loading
          ? [1, 2, 3, 4, 5].map((item, index) => (
              <div
                key={index}
                className="w-full bg-slate-200 rounded-lg
        h-[150px] animate-pulse"
              ></div>
            ))
          : incomelist?.length > 0
          ? incomelist.map((budget, index) => (
              <IncomeItem budget={budget} key={index} />
            ))
          : (
              <div className="col-span-2 text-center p-10">
                <div className="text-gray-400">
                  <h3 className="text-xl font-semibold mb-2">No Income Sources Yet</h3>
                  <p className="text-sm">Add your first income source to start tracking your earnings!</p>
                </div>
              </div>
            )}
      </div>
    </div>
  );
}

export default IncomeList;
