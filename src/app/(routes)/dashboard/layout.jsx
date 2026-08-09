"use client";
import React from "react";
import SideNav from "./_components/SideNav";
import DashboardHeader from "./_components/DashboardHeader";
import { MonthProvider } from "@/components/MonthContext";

const DashboardLayout = ({ children }) => {
  return (
    <MonthProvider>
      <div>
        {/* Sidebar */}
        <div className="fixed md:w-64 hidden md:block z-50">
          <SideNav />
        </div>
        {/* Main content */}
        <div className="md:ml-64">
          <DashboardHeader />
          {children}
        </div>
      </div>
    </MonthProvider>
  );
};

export default DashboardLayout;
