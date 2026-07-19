"use client"
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getSubscriptionList, deleteSubscription } from "../_actions/subscriptionActions";
import CreateSubscription from "./_components/CreateSubscription";
import { useCurrency } from "@/components/CurrencyProvider";
import { CalendarDays, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function SubscriptionsPage() {
  const { user } = useUser();
  const { formatCurrency } = useCurrency();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubscriptions();
    }
  }, [user]);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await getSubscriptionList();
      setSubscriptions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSubscription(id);
      toast.success("Subscription deleted");
      loadSubscriptions();
    } catch (error) {
      toast.error("Failed to delete subscription");
    }
  };

  return (
    <div className="p-8">
      <h2 className="font-bold text-3xl mb-4">My Subscriptions</h2>
      <p className="text-gray-500 mb-8">Manage your recurring bills and subscriptions</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CreateSubscription refreshData={loadSubscriptions} />
        
        {loading ? (
          [1, 2, 3].map((item) => (
            <div key={item} className="h-[180px] w-full bg-slate-200 dark:bg-zinc-800 animate-pulse rounded-2xl"></div>
          ))
        ) : subscriptions.length > 0 ? (
          subscriptions.map((sub) => (
            <div key={sub.id} className="p-5 border rounded-2xl hover:shadow-md h-[180px] flex flex-col justify-between dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-bold text-xl">{sub.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{sub.frequency}</p>
                </div>
                <h2 className="font-bold text-primary text-xl">{formatCurrency(sub.amount)}</h2>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t dark:border-zinc-700">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <CalendarDays className="w-4 h-4" />
                  <span>Next: {new Date(sub.nextPaymentDate).toLocaleDateString()}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(sub.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center p-10 border-2 border-dashed rounded-lg">
            <h3 className="text-lg font-semibold text-gray-400">No Subscriptions Found</h3>
            <p className="text-sm text-gray-500">Add a subscription to keep track of it here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubscriptionsPage;
