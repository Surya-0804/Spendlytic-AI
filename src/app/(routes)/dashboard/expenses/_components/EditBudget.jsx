"use client";
import { Button } from "@/components/ui/button";
import { PenBox } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmojiPicker from "emoji-picker-react";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import { db } from "../../../../../../utils/dbConfig";
import { Budgets } from "../../../../../../utils/schema";

function EditBudget({ budgetInfo, refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [nameError, setNameError] = useState("");
  const [amountError, setAmountError] = useState("");

  const { user } = useUser();

  useEffect(() => {
    if (budgetInfo) {
      setEmojiIcon(budgetInfo?.icon);
      setAmount(budgetInfo.amount);
      setName(budgetInfo.name);
    }
  }, [budgetInfo]);

  /**
   * Validate budget name
   */
  const validateName = (value) => {
    if (!value || value.trim() === "") {
      setNameError("Budget name is required");
      return false;
    }
    if (value.length > 50) {
      setNameError("Budget name must be less than 50 characters");
      return false;
    }
    setNameError("");
    return true;
  };

  /**
   * Validate budget amount
   */
  const validateAmount = (value) => {
    if (!value || value.trim() === "") {
      setAmountError("Budget amount is required");
      return false;
    }
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setAmountError("Please enter a valid number");
      return false;
    }
    if (numValue <= 0) {
      setAmountError("Amount must be greater than 0");
      return false;
    }
    if (numValue > 99999999) {
      setAmountError("Amount is too large");
      return false;
    }
    setAmountError("");
    return true;
  };

  /**
   * Handle name input change
   */
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (value) validateName(value);
  };

  /**
   * Handle amount input change
   */
  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    if (value) validateAmount(value);
  };

  const onUpdateBudget = async () => {
    // Final validation before submission
    const isNameValid = validateName(name);
    const isAmountValid = validateAmount(amount);

    if (!isNameValid || !isAmountValid) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      const result = await db
        .update(Budgets)
        .set({
          name: name.trim(),
          amount: amount,
          icon: emojiIcon,
        })
        .where(eq(Budgets.id, budgetInfo.id))
        .returning();

      if (result) {
        refreshData();
        toast.success("Budget Updated!");
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      toast.error("Failed to update budget. Please try again.");
    }
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex space-x-2 gap-2 rounded-full">
            {" "}
            <PenBox className="w-4" /> Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Budget</DialogTitle>
            <DialogDescription>
              <div className="mt-5">
                <Button
                  variant="outline"
                  className="text-lg"
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                >
                  {emojiIcon}
                </Button>
                <div className="absolute z-20">
                  <EmojiPicker
                    open={openEmojiPicker}
                    onEmojiClick={(e) => {
                      setEmojiIcon(e.emoji);
                      setOpenEmojiPicker(false);
                    }}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Name</h2>
                  <Input
                    placeholder="e.g. Home Decor"
                    value={name}
                    onChange={handleNameChange}
                    className={nameError ? "border-red-500" : ""}
                  />
                  {nameError && (
                    <p className="text-red-500 text-sm mt-1">{nameError}</p>
                  )}
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Amount</h2>
                  <Input
                    type="number"
                    value={amount}
                    placeholder="e.g. 5000"
                    onChange={handleAmountChange}
                    className={amountError ? "border-red-500" : ""}
                    min="0"
                    step="0.01"
                  />
                  {amountError && (
                    <p className="text-red-500 text-sm mt-1">{amountError}</p>
                  )}
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(name && amount) || nameError || amountError}
                onClick={() => onUpdateBudget()}
                className="mt-5 w-full rounded-full"
              >
                Update Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditBudget;
