"use client";
import React from "react";
import SideNav from "./_components/SideNav";
import DashboardHeader from "./_components/DashboardHeader";

const DashboardLayout = ({ children }) => {
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
