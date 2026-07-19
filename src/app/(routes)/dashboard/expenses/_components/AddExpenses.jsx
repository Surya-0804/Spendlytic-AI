import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { createExpense } from "../../_actions/expenseActions";
import { expenseSchema } from "@/lib/validations";

function AddExpense({ budgetId, user, refreshData }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [nameError, setNameError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const result = expenseSchema.safeParse({ name, amount, budgetId });
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

  const addNewExpense = async () => {
    if (!validate()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);
    try {
      const result = await createExpense({
        name: name.trim(),
        amount: parseFloat(amount),
        budgetId,
      });

      if (result) {
        refreshData();
        toast.success("New Expense Added!");
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
