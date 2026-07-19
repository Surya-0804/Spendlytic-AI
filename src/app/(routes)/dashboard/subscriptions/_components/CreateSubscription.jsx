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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createSubscription } from "../../_actions/subscriptionActions";
import { subscriptionSchema } from "@/lib/validations";

function CreateSubscription({ refreshData }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("Monthly");
  const [nextPaymentDate, setNextPaymentDate] = useState("");

  const [errors, setErrors] = useState({});

  const onCreate = async () => {
    const result = subscriptionSchema.safeParse({ name, amount, frequency, nextPaymentDate });
    
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        amount: fieldErrors.amount?.[0],
        frequency: fieldErrors.frequency?.[0],
        nextPaymentDate: fieldErrors.nextPaymentDate?.[0],
      });
      toast.error("Please fix the validation errors");
      return;
    }
    setErrors({});

    try {
      await createSubscription({
        name: name.trim(),
        amount: parseFloat(amount),
        frequency,
        nextPaymentDate,
      });
      refreshData();
      toast.success("Subscription created!");
      setName("");
      setAmount("");
      setNextPaymentDate("");
    } catch (error) {
      toast.error("Failed to create subscription");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-slate-100 dark:bg-slate-800 p-10 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed dark:border-slate-700 cursor-pointer hover:shadow-md h-[180px]">
          <h2 className="text-3xl font-bold text-gray-500 dark:text-gray-400">+</h2>
          <h2 className="text-gray-500 dark:text-gray-400 font-medium">New Subscription</h2>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Subscription</DialogTitle>
          <DialogDescription>
            <div className="mt-5 space-y-4">
              <div>
                <h2 className="text-black dark:text-white font-medium my-1">Name (e.g. Netflix, Gym)</h2>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <h2 className="text-black dark:text-white font-medium my-1">Amount</h2>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={errors.amount ? "border-red-500" : ""}
                />
                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
              </div>

              <div>
                <h2 className="text-black dark:text-white font-medium my-1">Frequency</h2>
                <select 
                  className={`w-full p-2 border rounded-md dark:bg-slate-900 dark:border-slate-700 ${errors.frequency ? "border-red-500" : ""}`}
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
                {errors.frequency && <p className="text-red-500 text-sm mt-1">{errors.frequency}</p>}
              </div>

              <div>
                <h2 className="text-black dark:text-white font-medium my-1">Next Payment Date</h2>
                <Input
                  type="date"
                  value={nextPaymentDate}
                  onChange={(e) => setNextPaymentDate(e.target.value)}
                  className={errors.nextPaymentDate ? "border-red-500" : ""}
                />
                {errors.nextPaymentDate && <p className="text-red-500 text-sm mt-1">{errors.nextPaymentDate}</p>}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              disabled={!(name && amount && frequency && nextPaymentDate)}
              onClick={onCreate}
              className="mt-5 w-full rounded-full"
            >
              Add Subscription
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateSubscription;
