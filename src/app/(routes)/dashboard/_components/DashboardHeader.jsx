"use client";
import React, { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import QuickAdd from "./QuickAdd";

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
    <div className="p-5 shadow-sm border-b flex justify-between items-center bg-white sticky top-0 z-10">
      <div className="text-xl font-bold text-blue-600">{pageName}</div>
      <div className="flex items-center gap-4">
        <QuickAdd />
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}

export default DashboardHeader;
