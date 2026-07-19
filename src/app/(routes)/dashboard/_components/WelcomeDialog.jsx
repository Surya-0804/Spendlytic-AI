"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Sparkles, PiggyBank, CircleDollarSign } from "lucide-react";

function WelcomeDialog({ isOpen, onOpenChange }) {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            Welcome to Spendlytic AI!
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            It looks like you're new here. Let's get you started on your journey to better financial health.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-start gap-4 p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-900/20 dark:border-blue-800/50">
            <PiggyBank className="w-8 h-8 text-blue-500 mt-1" />
            <div>
              <h3 className="font-semibold text-black dark:text-blue-100">1. Create a Budget</h3>
              <p className="text-sm text-gray-500 dark:text-blue-200/70">Set limits for your spending categories like Groceries, Rent, and Entertainment.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border rounded-lg bg-green-50/50 dark:bg-green-900/20 dark:border-green-800/50">
            <CircleDollarSign className="w-8 h-8 text-green-500 mt-1" />
            <div>
              <h3 className="font-semibold text-black dark:text-green-100">2. Add Incomes</h3>
              <p className="text-sm text-gray-500 dark:text-green-200/70">Track your earning sources like Salary, Freelance work, and Investments.</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              onOpenChange(false);
              router.push("/dashboard/incomes");
            }}
            className="w-full"
          >
            Add Incomes First
          </Button>
          <Button 
            onClick={() => {
              onOpenChange(false);
              router.push("/dashboard/budgets");
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create Budget First
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default WelcomeDialog;
