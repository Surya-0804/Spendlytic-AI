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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { editBudget } from "../../_actions/budgetActions";
import { budgetSchema } from "@/lib/validations";

function EditBudget({ budgetInfo, refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [nameError, setNameError] = useState("");
  const [amountError, setAmountError] = useState("");

  useEffect(() => {
    if (budgetInfo) {
      setEmojiIcon(budgetInfo?.icon);
      setAmount(budgetInfo.amount);
      setName(budgetInfo.name);
    }
  }, [budgetInfo]);

  const validate = () => {
    const result = budgetSchema.safeParse({ name, amount, icon: emojiIcon });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setNameError(fieldErrors.name?.[0] || "");
      setAmountError(fieldErrors.amount?.[0] || "");
      return false;
    }
    setNameError("");
    setAmountError("");
    return true;
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    setNameError("");
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    setAmountError("");
  };

  const onUpdateBudget = async () => {
    if (!validate()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      const result = await editBudget(budgetInfo.id, {
        name: name.trim(),
        amount: parseFloat(amount),
        icon: emojiIcon,
      });

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
                  <h2 className="text-black dark:text-white font-medium my-1">Budget Name</h2>
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
                  <h2 className="text-black dark:text-white font-medium my-1">Budget Amount</h2>
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
