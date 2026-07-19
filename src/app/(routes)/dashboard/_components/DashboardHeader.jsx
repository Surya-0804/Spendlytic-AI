"use client";
import React, { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import QuickAdd from "./QuickAdd";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CurrencyToggle } from "@/components/CurrencyToggle";

function DashboardHeader() {
  const pathname = usePathname();
  const [pageName, setPageName] = useState("Dashboard");

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
    <div className="p-5 shadow-sm border-b flex justify-between items-center bg-white dark:bg-slate-900 dark:border-slate-800 sticky top-0 z-10">
      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{pageName}</div>
      <div className="flex items-center gap-4">
        <CurrencyToggle />
        <ThemeToggle />
        <QuickAdd />
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}

export default DashboardHeader;
