"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import CardInfo from "./_components/CardInfo";
import BarCharDashboard from "./_components/BarCharDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpensesListTable";
import WelcomeDialog from "./_components/WelcomeDialog";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getBudgetList, clonePreviousMonthBudgets, getLeftoverBalance } from "./_actions/budgetActions";
import { getIncomeList, clonePreviousMonthIncomes, createIncome } from "./_actions/incomeActions";
import { getAllExpenses } from "./_actions/expenseActions";
import { addSavings } from "./_actions/savingsActions";
import { useMonth } from "@/components/MonthContext";
import moment from "moment";
import { CopyPlus, PiggyBank, RefreshCcw, XCircle } from "lucide-react";

const Dashboard = () => {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [cloning, setCloning] = useState(false);
  const [showLeftoverDialog, setShowLeftoverDialog] = useState(false);
  const [leftoverAmount, setLeftoverAmount] = useState(0);
  const { selectedMonth } = useMonth();

  useEffect(() => {
    if (user && selectedMonth) {
      loadData();
    }
  }, [user, selectedMonth]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [budgets, incomes, expenses] = await Promise.all([
        getBudgetList(selectedMonth),
        getIncomeList(selectedMonth),
        getAllExpenses(selectedMonth)
      ]);
      setBudgetList(budgets);
      setIncomeList(incomes);
      setExpenseList(expenses);
      
      // Check if user has no data to show the welcome dialog
      if (budgets.length === 0 && incomes.length === 0) {
        setShowWelcome(true);
      }
    } catch (error) {
      console.error("Dashboard - Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshExpenses = async () => {
    try {
      const expenses = await getAllExpenses(selectedMonth);
      setExpenseList(expenses);
    } catch(error) {
      console.error(error);
    }
  };

  const handleCloneClick = async () => {
    setCloning(true);
    const prevMonth = moment(selectedMonth, "YYYY-MM").subtract(1, 'months').format("YYYY-MM");
    
    try {
      const leftover = await getLeftoverBalance(prevMonth);
      if (leftover > 0) {
        setLeftoverAmount(leftover);
        setShowLeftoverDialog(true);
        setCloning(false);
      } else {
        await executeClone(prevMonth);
      }
    } catch (error) {
      console.error(error);
      setCloning(false);
    }
  };

  const executeClone = async (prevMonth, leftoverAction = null) => {
    try {
      setCloning(true);
      if (!prevMonth) {
        prevMonth = moment(selectedMonth, "YYYY-MM").subtract(1, 'months').format("YYYY-MM");
      }
      
      await clonePreviousMonthBudgets(selectedMonth, prevMonth);
      await clonePreviousMonthIncomes(selectedMonth, prevMonth);
      
      if (leftoverAction === 'rollover') {
         await createIncome({
            name: `Rollover from ${moment(prevMonth).format("MMM YYYY")}`,
            amount: leftoverAmount,
            icon: "♻️",
            month: selectedMonth
         });
      } else if (leftoverAction === 'savings') {
         await addSavings({
            name: `Savings from ${moment(prevMonth).format("MMM YYYY")}`,
            amount: leftoverAmount,
            icon: "🏦",
            month: selectedMonth
         });
      }

      await loadData();
    } catch (error) {
      console.error(error);
    } finally {
      setCloning(false);
      setShowLeftoverDialog(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h2 className="font-bold text-4xl">Hi, {user?.fullName}</h2>
          <p className="text-gray-500">
            Here's What's happening with your money in {selectedMonth ? moment(selectedMonth).format("MMMM YYYY") : ''}.
          </p>
        </div>
      </div>
      
      <CardInfo budgetList={budgetList} incomeList={incomeList} />

      <div className="grid grid-cols-1 lg:grid-cols-3 mt-6 gap-5">
        <div className="lg:col-span-2">
          <BarCharDashboard budgetList={budgetList} />
          <ExpenseListTable
            refreshData={refreshExpenses}
            expensesList={expenseList}
          />
        </div>
        <div className="flex flex-col gap-5">
          <h2 className="font-bold text-lg">Latest Budgets</h2>
          <div className="flex flex-col gap-5 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
            {loading
              ? [1, 2, 3, 4].map((items, index) => (
                  <div
                    key={index}
                    className="h-[180px] w-full bg-slate-200 dark:bg-zinc-800 rounded-lg animate-pulse min-h-[180px]"
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
                    {selectedMonth && (
                      <button
                        onClick={handleCloneClick}
                        disabled={cloning}
                        className="mt-4 flex items-center gap-2 justify-center w-full py-2 px-4 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-sm font-medium transition-colors"
                      >
                        <CopyPlus className="w-4 h-4" />
                        {cloning ? "Cloning..." : "Clone from Prev Month"}
                      </button>
                    )}
                  </div>
                )}
          </div>
        </div>
      </div>
      <WelcomeDialog isOpen={showWelcome} onOpenChange={setShowWelcome} />
      
      {/* Leftover Dialog */}
      <Dialog open={showLeftoverDialog} onOpenChange={setShowLeftoverDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>You had money left over! 🎉</DialogTitle>
            <DialogDescription>
              Last month, you had an unspent balance of <strong>${leftoverAmount.toFixed(2)}</strong>. 
              How would you like to handle this money?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button 
              className="w-full flex items-center justify-start gap-3 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => executeClone(null, 'rollover')}
            >
              <RefreshCcw className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Rollover to this month</div>
                <div className="text-xs opacity-80">Add as a new income stream for {moment(selectedMonth).format("MMM")}</div>
              </div>
            </Button>

            <Button 
              className="w-full flex items-center justify-start gap-3 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => executeClone(null, 'savings')}
            >
              <PiggyBank className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Add to Savings Bucket</div>
                <div className="text-xs opacity-80">Lock it away in your long-term savings</div>
              </div>
            </Button>

            <Button 
              variant="outline"
              className="w-full flex items-center justify-start gap-3"
              onClick={() => executeClone(null, 'ignore')}
            >
              <XCircle className="w-5 h-5 text-gray-500" />
              <div className="text-left">
                <div className="font-semibold text-gray-700 dark:text-gray-300">Ignore</div>
                <div className="text-xs text-gray-500">Don't bring the money forward</div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
