import Link from "next/link";
import React from "react";
import EditIncome from "./EditIncome";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteIncome } from "../../_actions/incomeActions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useCurrency } from "@/components/CurrencyProvider";

function IncomeItem({ income, refreshData }) {
  const { formatCurrency } = useCurrency();
  const onDeleteIncome = async () => {
    try {
      await deleteIncome(income.id);
      toast.success("Income deleted successfully!");
      if (refreshData) refreshData();
    } catch (error) {
      toast.error("Failed to delete income");
    }
  };

  return (
    <div
      className="p-5 border rounded-2xl flex flex-col justify-between
    hover:shadow-md h-[170px] dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <h2
            className="text-2xl p-3 px-4
              bg-slate-100 rounded-full 
              "
          >
            {income?.icon}
          </h2>
          <div>
            <h2 className="font-bold">{income.name}</h2>
          </div>
        </div>
        <h2 className="font-bold text-primary text-lg"> {formatCurrency(income.amount)}</h2>
      </div>

      <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
        <EditIncome incomeInfo={income} refreshData={refreshData} />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full flex gap-2">
              <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Delete</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                income stream.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDeleteIncome} className="bg-red-500 hover:bg-red-600">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default IncomeItem;
