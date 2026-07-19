"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import moment from "moment";

export const MonthContext = createContext();

export function MonthProvider({ children }) {
  // Default to current month: YYYY-MM format
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    // Only set on client to avoid hydration mismatch
    setSelectedMonth(moment().format("YYYY-MM"));
  }, []);

  return (
    <MonthContext.Provider value={{ selectedMonth, setSelectedMonth }}>
      {children}
    </MonthContext.Provider>
  );
}

export const useMonth = () => useContext(MonthContext);
