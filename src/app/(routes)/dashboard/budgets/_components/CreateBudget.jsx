"use client";
import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { db } from "../../../../../../utils/dbConfig";
import { Budgets } from "../../../../../../utils/schema";

function CreateBudget({ refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState("😀");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [nameError, setNameError] = useState("");
  const [amountError, setAmountError] = useState("");

  const { user } = useUser();

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

  /**
   * Used to Create New Budget
   */
  const onCreateBudget = async () => {
    // Final validation before submission
    const isNameValid = validateName(name);
    const isAmountValid = validateAmount(amount);

    if (!isNameValid || !isAmountValid) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      const result = await db
        .insert(Budgets)
        .values({
          name: name.trim(),
          amount: amount,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          icon: emojiIcon,
        })
        .returning({ insertedId: Budgets.id });

      if (result) {
        refreshData();
        toast.success("New Budget Created!");
        // Reset form
        setName("");
        setAmount("");
        setNameError("");
        setAmountError("");
      }
    } catch (error) {
      console.error("Error creating budget:", error);
      toast.error("Failed to create budget. Please try again.");
    }
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div
            className="bg-slate-100 p-10 rounded-2xl
            items-center flex flex-col border-2 border-dashed
            cursor-pointer hover:shadow-md"
          >
            <h2 className="text-3xl">+</h2>
            <h2>Create New Budget</h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
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
                    placeholder="e.g. 5000"
                    value={amount}
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
                onClick={() => onCreateBudget()}
                className="mt-5 w-full rounded-full"
              >
                Create Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateBudget;
