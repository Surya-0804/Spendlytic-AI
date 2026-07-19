"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getSavings } from "../_actions/savingsActions";
import { PiggyBank, Target, CalendarDays, Wallet } from "lucide-react";
import { useCurrency } from "@/components/CurrencyProvider";
import moment from "moment";

const SavingsPage = () => {
  const { user } = useUser();
  const { formatCurrency } = useCurrency();
  const [savingsList, setSavingsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSavings();
    }
  }, [user]);

  const loadSavings = async () => {
    try {
      setLoading(true);
      const data = await getSavings(); // no month filter, we want ALL savings
      setSavingsList(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const totalSavings = savingsList.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="font-bold text-4xl">Savings & Goals</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track your long-term savings and rollover funds.
          </p>
        </div>
      </div>

      {/* Hero Card */}
      <div className="relative overflow-hidden p-8 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 text-white shadow-xl mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 -z-10"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
            <PiggyBank className="w-12 h-12 text-white" />
          </div>
          <div>
            <p className="text-green-100 font-medium text-lg">Total Accumulated Savings</p>
            <h1 className="text-5xl font-bold mt-1 tracking-tight">{formatCurrency(totalSavings)}</h1>
          </div>
        </div>
      </div>

      {/* Savings List */}
      <h3 className="font-bold text-xl mb-4">Savings History</h3>
      
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="h-20 bg-slate-200 dark:bg-zinc-800 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : savingsList.length > 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
          {savingsList.map((item, index) => (
            <div 
              key={item.id} 
              className={`p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors ${
                index !== savingsList.length - 1 ? 'border-b border-gray-100 dark:border-zinc-800' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</h4>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" /> Allocated for {item.month}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" /> {moment(item.createdAt).format('MMM DD, YYYY')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-lg text-green-600 dark:text-green-400">
                  +{formatCurrency(item.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700">
          <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No savings yet</h3>
          <p className="text-gray-500">Your leftover money from previous months will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default SavingsPage;
