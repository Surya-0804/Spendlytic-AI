"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Loader, CircleDollarSign, Wallet, ReceiptText } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

import { getBudgetList, createBudget } from "../_actions/budgetActions";
import { createExpense } from "../_actions/expenseActions";
import { createIncome } from "../_actions/incomeActions";
import { expenseSchema, budgetSchema, incomeSchema } from "@/lib/validations";

function QuickAdd() {
  const [modalType, setModalType] = useState(null); // 'expense', 'budget', 'income'
  
  // Shared state
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [nameError, setNameError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [loading, setLoading] = useState(false);

  // Expense specific state
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState("");
  const [budgetError, setBudgetError] = useState("");

  // Budget/Income specific state
  const [emojiIcon, setEmojiIcon] = useState("😀");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  useEffect(() => {
    if (modalType === 'expense') {
      loadBudgets();
    }
    // Reset state on modal open
    setName("");
    setAmount("");
    setNameError("");
    setAmountError("");
    setBudgetError("");
    setEmojiIcon("😀");
    setOpenEmojiPicker(false);
  }, [modalType]);

  const loadBudgets = async () => {
    try {
      const data = await getBudgetList();
      setBudgets(data);
      if (data.length > 0) {
        setSelectedBudget(data[0].id.toString());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => setModalType(null);

  const onSubmit = async () => {
    setLoading(true);
    try {
      if (modalType === 'expense') {
        const result = expenseSchema.safeParse({ name, amount, budgetId: parseInt(selectedBudget) });
        if (!result.success) {
          const fieldErrors = result.error.flatten().fieldErrors;
          setNameError(fieldErrors.name?.[0] || "");
          setAmountError(fieldErrors.amount?.[0] || "");
          setBudgetError(fieldErrors.budgetId?.[0] || "");
          setLoading(false);
          return;
        }
        await createExpense({ name: name.trim(), amount: parseFloat(amount), budgetId: parseInt(selectedBudget) });
        toast.success("Expense Added successfully!");
      } 
      else if (modalType === 'budget') {
        const result = budgetSchema.safeParse({ name, amount, icon: emojiIcon });
        if (!result.success) {
          const fieldErrors = result.error.flatten().fieldErrors;
          setNameError(fieldErrors.name?.[0] || "");
          setAmountError(fieldErrors.amount?.[0] || "");
          setLoading(false);
          return;
        }
        await createBudget({ name: name.trim(), amount: parseFloat(amount), icon: emojiIcon });
        toast.success("New Budget Created!");
      }
      else if (modalType === 'income') {
        const result = incomeSchema.safeParse({ name, amount, icon: emojiIcon });
        if (!result.success) {
          const fieldErrors = result.error.flatten().fieldErrors;
          setNameError(fieldErrors.name?.[0] || "");
          setAmountError(fieldErrors.amount?.[0] || "");
          setLoading(false);
          return;
        }
        await createIncome({ name: name.trim(), amount: parseFloat(amount), icon: emojiIcon });
        toast.success("New Income Source Created!");
      }
      handleClose();
      // A page refresh might be needed to reflect new data on the dashboard.
      // But since we are likely on the dashboard, we can simply reload the page for now
      // to ensure all metrics update correctly since this is a global component.
      window.location.reload();
    } catch (error) {
      toast.error(`Failed to add ${modalType}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex gap-2 rounded-full font-semibold shadow-md transition-transform hover:scale-105 active:scale-95">
            <Plus className="w-5 h-5" /> Quick Add
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => setModalType('expense')}>
            <ReceiptText className="w-4 h-4 text-blue-500" /> Add Expense
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => setModalType('budget')}>
            <Wallet className="w-4 h-4 text-purple-500" /> Add Budget
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => setModalType('income')}>
            <CircleDollarSign className="w-4 h-4 text-green-500" /> Add Income
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={modalType !== null} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modalType === 'expense' ? 'Add New Expense' : 
               modalType === 'budget' ? 'Create New Budget' : 'Add Income Source'}
            </DialogTitle>
            <DialogDescription>
              <div className="mt-4 space-y-4">
                
                {/* Emoji Picker for Budget & Income */}
                {modalType !== 'expense' && (
                  <div>
                    <Button
                      variant="outline"
                      className="text-lg"
                      onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                    >
                      {emojiIcon}
                    </Button>
                    <div className="absolute z-20 mt-2">
                      <EmojiPicker
                        open={openEmojiPicker}
                        onEmojiClick={(e) => {
                          setEmojiIcon(e.emoji);
                          setOpenEmojiPicker(false);
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Budget Selection for Expense */}
                {modalType === 'expense' && (
                  <div>
                    <h2 className="text-black font-medium mb-1">Select Budget</h2>
                    {budgets.length > 0 ? (
                      <select 
                        className="w-full border rounded-md p-2" 
                        value={selectedBudget} 
                        onChange={(e) => setSelectedBudget(e.target.value)}
                      >
                        {budgets.map((b) => (
                          <option key={b.id} value={b.id}>{b.icon} {b.name}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-sm text-red-500">You need to create a budget first before adding expenses.</p>
                    )}
                    {budgetError && <p className="text-red-500 text-sm">{budgetError}</p>}
                  </div>
                )}

                {/* Name Input */}
                <div>
                  <h2 className="text-black font-medium mb-1">
                    {modalType === 'expense' ? 'Expense Name' : 
                     modalType === 'budget' ? 'Budget Name' : 'Source Name'}
                  </h2>
                  <Input
                    placeholder={modalType === 'expense' ? 'e.g. Groceries' : 'e.g. Youtube'}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setNameError("");
                    }}
                    className={nameError ? "border-red-500" : ""}
                  />
                  {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
                </div>

                {/* Amount Input */}
                <div>
                  <h2 className="text-black font-medium mb-1">Amount</h2>
                  <Input
                    type="number"
                    placeholder="e.g. 50"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setAmountError("");
                    }}
                    className={amountError ? "border-red-500" : ""}
                  />
                  {amountError && <p className="text-red-500 text-sm">{amountError}</p>}
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              disabled={loading || (modalType === 'expense' && budgets.length === 0)}
              onClick={onSubmit}
              className="w-full rounded-full"
            >
              {loading ? <Loader className="animate-spin w-4 h-4" /> : 
               modalType === 'expense' ? 'Add Expense' : 
               modalType === 'budget' ? 'Create Budget' : 'Add Income'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default QuickAdd;
