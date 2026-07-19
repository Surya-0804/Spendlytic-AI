"use client";
import React, { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import QuickAdd from "./QuickAdd";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CurrencyToggle } from "@/components/CurrencyToggle";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import { useMonth } from "@/components/MonthContext";
import moment from "moment";

function DashboardHeader() {
  const pathname = usePathname();
  const [pageName, setPageName] = useState("Dashboard");
  const { resolvedTheme } = useTheme();
  const { selectedMonth, setSelectedMonth } = useMonth();

  useEffect(() => {
    // Get the page name from the route
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1] || "dashboard";
    
    // Format the page name nicely
    const formatted = lastSegment
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    
    setPageName(formatted);
  }, [pathname]);

  return (
    <div className="p-5 shadow-sm border-b flex justify-between items-center bg-white dark:bg-zinc-900 dark:border-zinc-800 sticky top-0 z-10">
      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{pageName}</div>
      <div className="flex items-center gap-4">
        {selectedMonth && (
          <input 
            type="month" 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="p-2 border rounded-md text-sm outline-none dark:bg-zinc-800 text-gray-700 dark:text-gray-200 cursor-pointer"
          />
        )}
        <CurrencyToggle />
        <ThemeToggle />
        <QuickAdd />
        <UserButton 
          afterSignOutUrl="/" 
          appearance={{
            baseTheme: resolvedTheme === "dark" ? dark : undefined,
          }}
        />
      </div>
    </div>
  );
}

export default DashboardHeader;
