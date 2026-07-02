"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Reports() {
  const [activeReport, setActiveReport] = useState("sales");
  const [salesData, setSalesData] = useState({ sales: [], total: 0 });
  const [purchaseData, setPurchaseData] = useState({ purchases: [], total: 0 });
  const [stockData, setStockData] = useState({ items: [], total_stock_value: 0 });
  const [customerData, setCustomerData] = useState({ customers: [], total_outstanding: 0 });
  const [companyName, setCompanyName] = useState("");
  const router = useRouter();

  const getAuth = () => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("selectedCompanyId");
    return { token, companyId };
  };

  const fetchReport = (type) => {
    const { token, companyId } = getAuth();
    if (!token) { router.push("/login"); return; }
    if (!companyId) { router.push("/companies"); return; }

    fetch(`http://127.0.0.1:5000/api/reports/${type}?company_id=${companyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (type === "sales") setSalesData(data);
        if (type === "purchases") setPurchaseData(data);
        if (type === "stock") setStockData(data);
        if (type === "customers") setCustomerData(data);
      });
  };

  useEffect(() => {
    setCompanyName(localStorage.getItem("selectedCompanyName") || "");
    fetchReport("sales");
    fetchReport("purchases");
    fetchReport("stock");
    fetchReport("customers");
  }, []);

  const handleTabChange = (type) => {
    setActiveReport(type);
  };

  const tabClass = (type) =>
    `px-4 py-2 rounded-t font-semibold cursor-pointer ${
      activeReport === type
        ? "bg-blue-600 text-white"
        : "bg-gray-200 text-gray-700"
    }`;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">SmartERP - Reports</h1>
      <p className="text-gray-500 mb-4">
        Company: {companyName}{" "}
        <a href="/companies" className="text-blue-600 underline">(Switch)</a>
      </p>

      <div className="flex gap-4 mb-6 flex-wrap">
        <a href="/" className="text-blue-600 underline">Dashboard</a>
        <a href="/suppliers" className="text-blue-600 underline">Suppliers</a>
        <a href="/items" className="text-blue-600 underline">Items</a>
        <a href="/sales" className="text-blue-600 underline">Sales Voucher</a>
        <a href="/purchases" className="text-blue-600 underline">Purchase Voucher</a>
        <a href="/vouchers" className="text-blue-600 underline">Other Vouchers</a>
        <a href="/reports" className="text-blue-600 underline">Reports</a>
      </div>

      <div className="flex gap-1 mb-4">
        <button className={tabClass("sales")} onClick={() => handleTabChange("sales")}>
          Sales Report
        </button>
        <button className={tabClass("purchases")} onClick={() => handleTabChange("purchases")}>
          Purchase Report
        </button>
        <button className={tabClass("stock")} onClick={() => handleTabChange("stock")}>
          Stock Summary
        </button>
        <button className={tabClass("customers")} onClick={() => handleTabChange("customers")}>
          Customer Outstanding
        </button>
      </div>

      {activeReport === "sales" && (
        <div>
          <div className="bg-green-100 p-3 rounded mb-3">
            <strong>Total Sales: ₹{salesData.total.toFixed(2)}</strong>
          </div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Customer</th>
                <th className="border border-gray-300 p-2">Item</th>
                <th className="border border-gray-300 p-2">Qty</th>
                <th className="border border-gray-300 p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {salesData.sales.map((s) => (
                <tr key={s.id}>
                  <td className="border border-gray-300 p-2">{s.customer_name}</td>
                  <td className="border border-gray-300 p-2">{s.item_name}</td>
                  <td className="border border-gray-300 p-2">{s.quantity}</td>
                  <td className="border border-gray-300 p-2">₹{s.total_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeReport === "purchases" && (
        <div>
          <div className="bg-red-100 p-3 rounded mb-3">
            <strong>Total Purchases: ₹{purchaseData.total.toFixed(2)}</strong>
          </div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Supplier</th>
                <th className="border border-gray-300 p-2">Item</th>
                <th className="border border-gray-300 p-2">Qty</th>
                <th className="border border-gray-300 p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {purchaseData.purchases.map((p) => (
                <tr key={p.id}>
                  <td className="border border-gray-300 p-2">{p.supplier_name}</td>
                  <td className="border border-gray-300 p-2">{p.item_name}</td>
                  <td className="border border-gray-300 p-2">{p.quantity}</td>
                  <td className="border border-gray-300 p-2">₹{p.total_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeReport === "stock" && (
        <div>
          <div className="bg-blue-100 p-3 rounded mb-3">
            <strong>Total Stock Value: ₹{stockData.total_stock_value.toFixed(2)}</strong>
          </div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Item</th>
                <th className="border border-gray-300 p-2">Price</th>
                <th className="border border-gray-300 p-2">Quantity</th>
                <th className="border border-gray-300 p-2">Stock Value</th>
                <th className="border border-gray-300 p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {stockData.items.map((i) => (
                <tr
                  key={i.id}
                  className={i.status === "Low Stock" ? "bg-red-50" : ""}
                >
                  <td className="border border-gray-300 p-2">{i.name}</td>
                  <td className="border border-gray-300 p-2">₹{i.price}</td>
                  <td className="border border-gray-300 p-2">{i.quantity}</td>
                  <td className="border border-gray-300 p-2">₹{i.stock_value.toFixed(2)}</td>
                  <td className="border border-gray-300 p-2">
                    <span className={i.status === "Low Stock" ? "text-red-600 font-bold" : "text-green-600"}>
                      {i.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeReport === "customers" && (
        <div>
          <div className="bg-yellow-100 p-3 rounded mb-3">
            <strong>Total Outstanding: ₹{customerData.total_outstanding.toFixed(2)}</strong>
          </div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Customer</th>
                <th className="border border-gray-300 p-2">Phone</th>
                <th className="border border-gray-300 p-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {customerData.customers.map((c) => (
                <tr key={c.id} className={c.balance > 0 ? "bg-yellow-50" : ""}>
                  <td className="border border-gray-300 p-2">{c.name}</td>
                  <td className="border border-gray-300 p-2">{c.phone}</td>
                  <td className="border border-gray-300 p-2">₹{c.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}