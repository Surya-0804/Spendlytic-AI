"use client";
import React, { useEffect } from "react";
import { db } from "../../../../utils/dbConfig"; // Ensure dbConfig is correctly configured
import { Budgets } from "../../../../utils/schema"; // Schema should match your table
import { useUser } from "@clerk/nextjs"; // Clerk for user management
import { eq } from "drizzle-orm"; // Import necessary query methods
import { useRouter } from "next/navigation"; // For route navigation
import SideNav from "./_components/SideNav"; // SideNav component
import DashboardHeader from "./_components/DashboardHeader"; // Header component

const DashboardLayout = ({ children }) => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      checkUserBudget();
    }
  }, [user]);

  const checkUserBudget = async () => {
    try {
      // Ensure the select query is properly structured
      const result = await db
        .select() // Corrected this part
        .from(Budgets)
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress)); // Added safe checks for email

      if (result?.length === 0) {
        router.replace("/dashboard/budgets"); // Redirect if no budget found
      }
    } catch (error) {
      console.error("Error fetching budget:", error);
    }
  };

  return (
    <div>
      {/* Sidebar */}
      <div className="fixed md:w-64 hidden md:block">
        <SideNav />
      </div>
      {/* Main content */}
      <div className="md:ml-64">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
