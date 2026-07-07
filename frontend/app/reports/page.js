"use client";

import AppLayout from "../components/AppLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "http://127.0.0.1:5000/api";

export default function Reports() {
  const [companyId, setCompanyId] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [activeReport, setActiveReport] = useState("sales");
  const [salesData, setSalesData] = useState({ sales: [], total: 0 });
  const [purchaseData, setPurchaseData] = useState({ purchases: [], total: 0 });
  const [stockData, setStockData] = useState({ items: [], total_stock_value: 0 });
  const [customerData, setCustomerData] = useState({ customers: [], total_outstanding: 0 });
  const router = useRouter();

  const fetchReport = (type, cid) => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    if (!cid) { router.push("/companies"); return; }

    fetch(`${API_BASE}/reports/${type}?company_id=${cid}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        if (type === "sales") setSalesData(data);
        if (type === "purchases") setPurchaseData(data);
        if (type === "stock") setStockData(data);
        if (type === "customers") setCustomerData(data);
      })
      .catch((error) => {
        console.error(`Failed to load ${type} report`, error);
        alert("Unable to connect to the server. Please make sure the backend is running.");
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const cid = localStorage.getItem("selectedCompanyId");
    const cname = localStorage.getItem("selectedCompanyName") || "";

    if (!token) { router.push("/login"); return; }
    if (!cid) { router.push("/companies"); return; }

    setCompanyId(cid);
    setCompanyName(cname);
    fetchReport("sales", cid);
    fetchReport("purchases", cid);
    fetchReport("stock", cid);
    fetchReport("customers", cid);
  }, []);

  const tabClass = (type) => "px-4 py-2 rounded-t font-semibold cursor-pointer " + (activeReport === type ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700");

  return (
    <AppLayout currentPage="reports">
      <div className="p-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Reports</h1>
          <button onClick={() => router.push("/")} className="bg-gray-600 text-white px-3 py-1 rounded text-sm">ESC: Gateway</button>
        </div>
        <p className="text-gray-500 mb-4">Company: {companyName}{" "}<a href="/companies" className="text-blue-600 underline">(Switch)</a></p>

        <div className="flex gap-1 mb-4">
          <button className={tabClass("sales")} onClick={() => setActiveReport("sales")}>Sales Report</button>
          <button className={tabClass("purchases")} onClick={() => setActiveReport("purchases")}>Purchase Report</button>
          <button className={tabClass("stock")} onClick={() => setActiveReport("stock")}>Stock Summary</button>
          <button className={tabClass("customers")} onClick={() => setActiveReport("customers")}>Customer Outstanding</button>
        </div>

        {activeReport === "sales" && (
          <div>
            <div className="bg-green-100 p-3 rounded mb-3"><strong>Total Sales: Rs.{salesData.total.toFixed(2)}</strong></div>
            <table className="w-full border-collapse border border-gray-300">
              <thead><tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Customer</th>
                <th className="border border-gray-300 p-2">Item</th>
                <th className="border border-gray-300 p-2">Qty</th>
                <th className="border border-gray-300 p-2">Amount</th>
              </tr></thead>
              <tbody>{salesData.sales.map((s) => (
                <tr key={s.id}>
                  <td className="border border-gray-300 p-2">{s.customer_name}</td>
                  <td className="border border-gray-300 p-2">{s.item_name}</td>
                  <td className="border border-gray-300 p-2 text-center">{s.quantity}</td>
                  <td className="border border-gray-300 p-2 text-center">Rs.{s.total_amount}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {activeReport === "purchases" && (
          <div>
            <div className="bg-red-100 p-3 rounded mb-3"><strong>Total Purchases: Rs.{purchaseData.total.toFixed(2)}</strong></div>
            <table className="w-full border-collapse border border-gray-300">
              <thead><tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Supplier</th>
                <th className="border border-gray-300 p-2">Item</th>
                <th className="border border-gray-300 p-2">Qty</th>
                <th className="border border-gray-300 p-2">Amount</th>
              </tr></thead>
              <tbody>{purchaseData.purchases.map((p) => (
                <tr key={p.id}>
                  <td className="border border-gray-300 p-2">{p.supplier_name}</td>
                  <td className="border border-gray-300 p-2">{p.item_name}</td>
                  <td className="border border-gray-300 p-2 text-center">{p.quantity}</td>
                  <td className="border border-gray-300 p-2 text-center">Rs.{p.total_amount}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {activeReport === "stock" && (
          <div>
            <div className="bg-blue-100 p-3 rounded mb-3"><strong>Total Stock Value: Rs.{stockData.total_stock_value.toFixed(2)}</strong></div>
            <table className="w-full border-collapse border border-gray-300">
              <thead><tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Item</th>
                <th className="border border-gray-300 p-2">Price</th>
                <th className="border border-gray-300 p-2">Qty</th>
                <th className="border border-gray-300 p-2">Stock Value</th>
                <th className="border border-gray-300 p-2">Status</th>
              </tr></thead>
              <tbody>{stockData.items.map((i) => (
                <tr key={i.id} className={i.status === "Low Stock" ? "bg-red-50" : ""}>
                  <td className="border border-gray-300 p-2">{i.name}</td>
                  <td className="border border-gray-300 p-2 text-center">Rs.{i.price}</td>
                  <td className="border border-gray-300 p-2 text-center">{i.quantity}</td>
                  <td className="border border-gray-300 p-2 text-center">Rs.{i.stock_value.toFixed(2)}</td>
                  <td className="border border-gray-300 p-2 text-center">
                    <span className={i.status === "Low Stock" ? "text-red-600 font-bold" : "text-green-600"}>{i.status}</span>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {activeReport === "customers" && (
          <div>
            <div className="bg-yellow-100 p-3 rounded mb-3"><strong>Total Outstanding: Rs.{customerData.total_outstanding.toFixed(2)}</strong></div>
            <table className="w-full border-collapse border border-gray-300">
              <thead><tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Customer</th>
                <th className="border border-gray-300 p-2">Phone</th>
                <th className="border border-gray-300 p-2">Balance</th>
              </tr></thead>
              <tbody>{customerData.customers.map((c) => (
                <tr key={c.id} className={c.balance > 0 ? "bg-yellow-50" : ""}>
                  <td className="border border-gray-300 p-2">{c.name}</td>
                  <td className="border border-gray-300 p-2">{c.phone}</td>
                  <td className="border border-gray-300 p-2 text-center">Rs.{c.balance}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}