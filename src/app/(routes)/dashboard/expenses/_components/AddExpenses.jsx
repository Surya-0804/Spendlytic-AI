import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { toast } from "sonner";
import { db } from "../../../../../../utils/dbConfig";
import { Budgets, Expenses } from "../../../../../../utils/schema";

function AddExpense({ budgetId, user, refreshData }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [nameError, setNameError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Validate expense name
   */
  const validateName = (value) => {
    if (!value || value.trim() === "") {
      setNameError("Expense name is required");
      return false;
    }
    if (value.length > 50) {
      setNameError("Expense name must be less than 50 characters");
      return false;
    }
    setNameError("");
    return true;
  };

  /**
   * Validate expense amount
   */
  const validateAmount = (value) => {
    if (!value || value.trim() === "") {
      setAmountError("Expense amount is required");
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
   * Used to Add New Expense
   */
  const addNewExpense = async () => {
    // Final validation before submission
    const isNameValid = validateName(name);
    const isAmountValid = validateAmount(amount);

    if (!isNameValid || !isAmountValid) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);
    try {
      const result = await db
        .insert(Expenses)
        .values({
          name: name.trim(),
          amount: amount,
          budgetId: budgetId,
          createdBy: user.primaryEmailAddress?.emailAddress,
        })
        .returning({ insertedId: Budgets.id });

      if (result) {
        refreshData();
        toast.success("New Expense Added!");
        // Reset form
        setAmount("");
        setName("");
        setNameError("");
        setAmountError("");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="border p-5 rounded-2xl">
      <h2 className="font-bold text-lg">Add Expense</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Name</h2>
        <Input
          placeholder="e.g. Bedroom Decor"
          value={name}
          onChange={handleNameChange}
          className={nameError ? "border-red-500" : ""}
        />
        {nameError && (
          <p className="text-red-500 text-sm mt-1">{nameError}</p>
        )}
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <Input
          type="number"
          placeholder="e.g. 1000"
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
      {/* <div className="mt-2">
        <h2 className="text-black font-medium my-1">Budget Id</h2>
        <Input
          placeholder="e.g. 1000"
          value={budgetId}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div> */}
      <Button
        disabled={!(name && amount) || nameError || amountError || loading}
        onClick={() => addNewExpense()}
        className="mt-3 w-full rounded-full"
      >
        {loading ? <Loader className="animate-spin" /> : "Add New Expense"}
      </Button>
    </div>
  );
}

export default AddExpense;
