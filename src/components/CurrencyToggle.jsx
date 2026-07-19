"use client"

import * as React from "react"
import { useCurrency } from "@/components/CurrencyProvider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function CurrencyToggle() {
  const { currency, changeCurrency } = useCurrency()

  const currencies = [
    { label: "USD ($)", value: "$" },
    { label: "EUR (€)", value: "€" },
    { label: "GBP (£)", value: "£" },
    { label: "INR (₹)", value: "₹" },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full w-9 h-9 font-bold text-sm">
          {currency}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencies.map((curr) => (
          <DropdownMenuItem 
            key={curr.value} 
            onClick={() => changeCurrency(curr.value)}
            className={currency === curr.value ? "bg-accent" : ""}
          >
            {curr.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
