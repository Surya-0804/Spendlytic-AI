"use client"
import React, { createContext, useContext, useState, useEffect } from "react";

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState("₹"); // Default

  useEffect(() => {
    const savedCurrency = localStorage.getItem("spendlytic_currency");
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem("spendlytic_currency", newCurrency);
  };

  const formatCurrency = (num, exact = false) => {
    if (num === undefined || num === null) return "";
    
    const formattedNumber = Number(num).toLocaleString("en-US", {
      maximumFractionDigits: exact ? 2 : 1,
    });

    if (!exact) {
      if (num >= 1e9) {
        return `${currency}${(num / 1e9).toFixed(1).replace(/\.0$/, "")}B`;
      }
      if (num >= 1e6) {
        return `${currency}${(num / 1e6).toFixed(1).replace(/\.0$/, "")}M`;
      }
      if (num >= 1e3) {
        return `${currency}${(num / 1e3).toFixed(1).replace(/\.0$/, "")}K`;
      }
    }
    return `${currency}${formattedNumber}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
