import React, { useEffect, useState } from "react";
import {
  PiggyBank,
  ReceiptIndianRupee,
  Wallet,
  Sparkles,
  CircleDollarSign,
  ReceiptText,
  RefreshCcw,
} from "lucide-react";
import { useCurrency } from "@/components/CurrencyProvider";
import { Scale } from "lucide-react";

const CardInfo = ({ budgetList, incomeList }) => {
  const { formatCurrency } = useCurrency();
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [financialAdvice, setFinancialAdvice] = useState("");

  useEffect(() => {
    if (budgetList.length > 0 || incomeList.length > 0) {
      CalculateCardInfo();
    }
  }, [budgetList, incomeList]);

  useEffect(() => {
  const fetchFinancialAdvice = async (forceRefresh = false) => {
    if (totalBudget > 0 || totalIncome > 0 || totalSpend > 0) {
      try {
        const CACHE_KEY = "spendlytic_ai_advice";
        const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

        if (!forceRefresh) {
          const cachedData = localStorage.getItem(CACHE_KEY);
          if (cachedData) {
            const parsedCache = JSON.parse(cachedData);
            const { advice, timestamp, budget, income, spend } = parsedCache;

            const isExpired = Date.now() - timestamp > CACHE_EXPIRY;
            const hasTotalsChanged = 
              Math.abs(budget - totalBudget) > 50 ||
              Math.abs(income - totalIncome) > 50 ||
              Math.abs(spend - totalSpend) > 50;

            if (!isExpired && !hasTotalsChanged) {
              setFinancialAdvice(advice);
              return;
            }
          }
        }

        setFinancialAdvice(""); // triggers loading state
        const response = await fetch("/api/financial-advice", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              totalBudget,
              totalIncome,
              totalSpend,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setFinancialAdvice(data.advice);
            localStorage.setItem(CACHE_KEY, JSON.stringify({
              advice: data.advice,
              timestamp: Date.now(),
              budget: totalBudget,
              income: totalIncome,
              spend: totalSpend
            }));
          } else {
            setFinancialAdvice("Unable to fetch financial advice at this time.");
          }
        } catch (error) {
          console.error("Error fetching financial advice:", error);
          setFinancialAdvice("Unable to fetch financial advice at this time.");
        }
      };

      fetchFinancialAdvice();
    }
  }, [totalBudget, totalIncome, totalSpend]);

  const CalculateCardInfo = () => {
    let totalBudget_ = 0;
    let totalSpend_ = 0;
    let totalIncome_ = 0;
    budgetList.forEach((budget) => {
      totalBudget_ += Number(budget.amount);
      totalSpend_ += Number(budget.totalSpend);
    });
    incomeList.forEach((income) => {
      totalIncome_ += Number(income.amount);
    });

    setTotalBudget(totalBudget_);
    setTotalIncome(totalIncome_);
    setTotalSpend(totalSpend_);
  };

  return (
    <div>
      {budgetList?.length > 0 ? (
        <div>
          <div className="p-7 mt-4 -mb-1 rounded-2xl flex items-center justify-between bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-900 shadow-sm border border-indigo-100 dark:border-zinc-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
            
            <div className="w-full relative z-10">
              <div className="flex mb-3 flex-row space-x-2 items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-300">Spendlytic AI</h2>
                  <Sparkles
                    className="rounded-full text-white w-8 h-8 p-1.5
                    bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md background-animate"
                  />
                </div>
                
                <button 
                  onClick={() => fetchFinancialAdvice(true)}
                  className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1 text-sm bg-indigo-100 hover:bg-indigo-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-full transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
              
              {financialAdvice ? (
                <h2 className="font-medium text-slate-700 dark:text-zinc-300 leading-relaxed text-sm md:text-base">
                  {financialAdvice}
                </h2>
              ) : (
                <div className="space-y-2 w-full mt-2">
                  <div className="h-4 bg-indigo-100 dark:bg-zinc-800 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-indigo-100 dark:bg-zinc-800 rounded animate-pulse w-5/6"></div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-7 border rounded-2xl flex items-center justify-between dark:border-zinc-800 dark:bg-zinc-900">
              <div>
                <h2 className="text-sm">Total Budget</h2>
                <h2 className="font-bold text-2xl">
                  {formatCurrency(totalBudget)}
                </h2>
              </div>
              <PiggyBank className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between dark:border-zinc-800 dark:bg-zinc-900">
              <div>
                <h2 className="text-sm">Total Spend</h2>
                <h2 className="font-bold text-2xl">
                  {formatCurrency(totalSpend)}
                </h2>
              </div>
              <ReceiptText className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between dark:border-zinc-800 dark:bg-zinc-900">
              <div>
                <h2 className="text-sm">No. Of Budget</h2>
                <h2 className="font-bold text-2xl">{budgetList?.length}</h2>
              </div>
              <Wallet className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between dark:border-zinc-800 dark:bg-zinc-900">
              <div>
                <h2 className="text-sm">Sum of Income Streams</h2>
                <h2 className="font-bold text-2xl">
                  {formatCurrency(totalIncome)}
                </h2>
              </div>
              <CircleDollarSign className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between bg-blue-50 dark:bg-zinc-800 dark:border-zinc-800">
              <div>
                <h2 className="text-sm">Remaining Balance</h2>
                <h2 className={`font-bold text-2xl ${totalIncome - totalSpend < 0 ? 'text-red-500' : 'text-green-600'}`}>
                  {formatCurrency(totalIncome - totalSpend)}
                </h2>
              </div>
              <Scale className={`p-3 h-12 w-12 rounded-full text-white ${totalIncome - totalSpend < 0 ? 'bg-red-500' : 'bg-green-600'}`} />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((item, index) => (
            <div
              className="h-[110px] w-full bg-slate-200 dark:bg-zinc-800 animate-pulse rounded-lg"
              key={index}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardInfo;
