"use client";

import API_URL from "./config";
import AppLayout from "./components/AppLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Gateway() {
  const [companyName, setCompanyName] = useState("");
  const [financialYear, setFinancialYear] = useState("2025-26");
  const [dashboard, setDashboard] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const cid = localStorage.getItem("selectedCompanyId");
    const name = localStorage.getItem("selectedCompanyName");

    console.log("token:", token);
    console.log("cid:", cid);
    console.log("name:", name);

    if (!token) { 
      console.log("No token - going to login");
      router.push("/login"); 
      return; 
    }
    if (!cid) { 
      console.log("No company - going to companies");
      router.push("/companies"); 
      return; 
    }
    // rest of code...
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("selectedCompanyId");
    localStorage.removeItem("selectedCompanyName");
    router.push("/login");
  };

  const menuItems = [
    {
      section: "MASTERS",
      color: "bg-blue-700",
      lightColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100",
      borderColor: "border-blue-200",
      items: [
        { label: "Ledgers (Customers/Suppliers)", path: "/ledgers", key: "Alt+L" },
        { label: "Stock Items", path: "/items", key: "Alt+S" },
        { label: "Units of Measure", path: "/units", key: "Alt+U" },
        { label: "Groups", path: "/groups", key: "Alt+G" },
      ],
    },
    {
      section: "TRANSACTIONS",
      color: "bg-green-700",
      lightColor: "bg-green-50",
      hoverColor: "hover:bg-green-100",
      borderColor: "border-green-200",
      items: [
        { label: "Sales Voucher", path: "/sales", key: "Fn+F8" },
        { label: "Purchase Voucher", path: "/purchases", key: "Fn+F9" },
        { label: "Payment Voucher", path: "/payment", key: "Ctrl+⇧+B" },
        { label: "Receipt Voucher", path: "/receipt", key: "Ctrl+⇧+E" },
        { label: "Journal Voucher", path: "/journal", key: "Ctrl+⇧+J" },
        { label: "Contra Voucher", path: "/contra", key: "Ctrl+⇧+N" },
      ],
    },
    {
      section: "INVENTORY",
      color: "bg-orange-700",
      lightColor: "bg-orange-50",
      hoverColor: "hover:bg-orange-100",
      borderColor: "border-orange-200",
      items: [
        { label: "Stock Summary", path: "/stock-summary", key: "Ctrl+⇧+T" },
        { label: "Stock Items", path: "/items", key: "Ctrl+I" },
      ],
    },
    {
      section: "REPORTS",
      color: "bg-purple-700",
      lightColor: "bg-purple-50",
      hoverColor: "hover:bg-purple-100",
      borderColor: "border-purple-200",
      items: [
        { label: "Sales Report", path: "/reports", key: "Ctrl+⇧+R" },
        { label: "Purchase Report", path: "/reports", key: "Ctrl+⇧+R" },
        { label: "Customer Outstanding", path: "/reports", key: "Ctrl+⇧+R" },
        { label: "Stock Report", path: "/reports", key: "Ctrl+⇧+R" },
      ],
    },
  ];

  return (
    <AppLayout currentPage="gateway">
      <div className="min-h-screen bg-gray-200">
        <div className="bg-blue-900 text-white flex justify-between items-center px-4 py-1 text-xs">
          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-yellow-300" onClick={() => router.push("/companies")}>K: Company</span>
            <span className="cursor-pointer hover:text-yellow-300" onClick={() => router.push("/reports")}>Y: Data</span>
          </div>
          <div className="font-bold text-sm">{companyName}</div>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-yellow-300" onClick={handleLogout}>Ctrl+Q: Logout</span>
          </div>
        </div>

        <div className="bg-blue-800 text-white text-center py-2">
          <div className="text-lg font-bold">{companyName}</div>
          <div className="text-xs text-blue-200">Financial Year: {financialYear}</div>
        </div>

        <div className="bg-gray-700 text-white text-center py-1 text-sm font-bold tracking-widest">
          GATEWAY OF SMARTERP
        </div>

        {dashboard && (
          <div className="bg-gray-800 text-white flex justify-around py-2 text-xs">
            <span>Total Sales: <strong className="text-green-400">Rs.{dashboard.total_sales.toFixed(2)}</strong></span>
            <span>Total Purchases: <strong className="text-red-400">Rs.{dashboard.total_purchases.toFixed(2)}</strong></span>
            <span>Customers: <strong className="text-blue-400">{dashboard.total_customers}</strong></span>
            <span>Suppliers: <strong className="text-yellow-400">{dashboard.total_suppliers}</strong></span>
            {dashboard.low_stock_items.length > 0 && (
              <span className="text-red-400 animate-pulse">⚠ {dashboard.low_stock_items.length} Low Stock</span>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 p-4">
          {menuItems.map((menu) => (
            <div key={menu.section} className={"rounded border " + menu.borderColor}>
              <div className={"text-white text-sm font-bold px-3 py-2 " + menu.color}>{menu.section}</div>
              <div className={menu.lightColor}>
                {menu.items.map((item) => (
                  <div
                    key={item.label}
                    onClick={() => router.push(item.path)}
                    className={"flex justify-between items-center px-4 py-2 cursor-pointer border-b border-gray-200 " + menu.hoverColor}
                  >
                    <span className="text-sm">{item.label}</span>
                    <span className="text-xs text-gray-400 font-mono">{item.key}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-44 bg-gray-700 text-white flex justify-between px-4 py-1 text-xs">
          <span className="cursor-pointer hover:text-yellow-300" onClick={handleLogout}>Q: Quit</span>
          <span>SmartERP — {companyName}</span>
          <span className="cursor-pointer hover:text-yellow-300" onClick={() => router.push("/companies")}>F1: Select Company</span>
        </div>
        <div className="h-8"></div>
      </div>
    </AppLayout>
  );
}