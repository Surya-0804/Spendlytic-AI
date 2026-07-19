"use client";
import React, { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

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
    <div className="p-5 shadow-sm border-b flex justify-between">
      <div className="text-xl font-bold pt-1 text-blue-500">{pageName}</div>
      <div>
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}

export default DashboardHeader;
