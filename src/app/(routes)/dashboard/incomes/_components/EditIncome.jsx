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
import { editIncome } from "../../_actions/incomeActions";
import { incomeSchema } from "@/lib/validations";

function EditIncome({ incomeInfo, refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState(incomeInfo?.icon);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [nameError, setNameError] = useState("");
  const [amountError, setAmountError] = useState("");

  useEffect(() => {
    if (incomeInfo) {
      setEmojiIcon(incomeInfo?.icon);
      setAmount(incomeInfo.amount);
      setName(incomeInfo.name);
    }
  }, [incomeInfo]);

  const validate = () => {
    const result = incomeSchema.safeParse({ name, amount, icon: emojiIcon });
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

  const onUpdateIncome = async () => {
    if (!validate()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      const result = await editIncome(incomeInfo.id, {
        name: name.trim(),
        amount: parseFloat(amount),
        icon: emojiIcon,
      });

      if (result) {
        refreshData();
        toast.success("Income Updated!");
      }
    } catch (error) {
      console.error("Error updating income:", error);
      toast.error("Failed to update income. Please try again.");
    }
  };
  
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex space-x-2 gap-2 rounded-full">
            <PenBox className="w-4 h-4 text-blue-500" /> 
            <span className="hidden sm:inline">Edit</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Income Source</DialogTitle>
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
                  <h2 className="text-black font-medium my-1">Source Name</h2>
                  <Input
                    placeholder="e.g. Freelance"
                    value={name}
                    onChange={handleNameChange}
                    className={nameError ? "border-red-500" : ""}
                  />
                  {nameError && (
                    <p className="text-red-500 text-sm mt-1">{nameError}</p>
                  )}
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Amount</h2>
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
                onClick={() => onUpdateIncome()}
                className="mt-5 w-full rounded-full"
              >
                Update Income
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditIncome;
