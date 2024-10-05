"use client";
import React, { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation"; // Use this instead of useRouter

function DashboardHeader({ pageName }) {
  return (
    <div className="p-5 shadow-sm border-b flex justify-between">
      <div className="text-xl font-bold pt-1 text-blue-500">{pageName}</div>{" "}
      {/* Display the page name */}
      <div>
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}

function Page() {
  const pathname = usePathname(); // Get the current pathname
  const [pageName, setPageName] = useState("Home");

  useEffect(() => {
    // Get the page name from the route
    const name = pathname.split("/").pop() || "Home"; // Fallback to 'Home' if no page name
    setPageName(name.charAt(0).toUpperCase() + name.slice(1)); // Capitalize the first letter
  }, [pathname]); // Depend on pathname

  return (
    <div>
      <DashboardHeader pageName={pageName} />
      {/* Other page content goes here */}
    </div>
  );
}

export default Page;
