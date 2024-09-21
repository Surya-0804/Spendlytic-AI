import React from "react";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, CircleDollarSign, PiggyBank, ReceiptIndianRupee, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const SideNav = () => {
  const menuList = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Incomes",
      icon: CircleDollarSign,
      path: "/dashboard/incomes",
    },
    {
      id: 4,
      name: "Budgets",
      icon: PiggyBank,
      path: "/dashboard/budgets",
    },
    {
      id: 5,
      name: "Expenses",
      icon: ReceiptIndianRupee,
      path: "/dashboard/expenses",
    },
    {
      id: 6,
      name: "Upgrade",
      icon: ShieldCheck,
      path: "/dashboard/upgrade",
    },
  ];

  const path = usePathname();

  return (
    <div className="h-screen p-5 border shadow-sm">
      <div className="flex flex-row items-center">
        <Image src={"/logo.png"} alt="logo" width={40} height={25} />
        <span className="text-blue-800 font-bold text-xl">Spendyltic AI</span>
      </div>
      <div className="mt-5">
        {menuList.map((menu, index) => (
          <Link href={menu.path} key={index}>
            <h2
              className={`flex gap-2 items-center
                    text-gray-500 font-medium
                    mb-2
                    p-4 cursor-pointer rounded-full
                    hover:text-primary hover:bg-blue-100
                    ${path == menu.path && "text-primary bg-blue-100"}
                    `}
            >
              <menu.icon />
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SideNav;
