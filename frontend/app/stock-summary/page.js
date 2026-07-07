"use client";

import AppLayout from "../components/AppLayout";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StockSummary() {
  const [companyName, setCompanyName] = useState("");
  const [stocks, setStocks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setCompanyName(localStorage.getItem("selectedCompanyName") || "");
    const token = localStorage.getItem("token");
    const cid = companyId || localStorage.getItem("selectedCompanyId");
    if (!token) { router.push("/login"); return; }
    if (!cid) { router.push("/companies"); return; }

    fetch("http://127.0.0.1:5000/api/stock_summary?company_id=" + cid, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setStocks(data); });
  }, [companyId]);

  return (
    <AppLayout currentPage="stock-summary">
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Stock Summary</h1>
          <button onClick={() => router.push("/")} className="bg-gray-600 text-white px-3 py-1 rounded text-sm">ESC: Gateway</button>
        </div>
        <p className="text-gray-500 mb-6">Company: {companyName}{" "}<a href="/companies" className="text-blue-600 underline">(Switch)</a></p>

        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="border border-gray-400 p-2 text-left">Item Name</th>
              <th className="border border-gray-400 p-2 text-center">Inwards</th>
              <th className="border border-gray-400 p-2 text-center">Outwards</th>
              <th className="border border-gray-400 p-2 text-center">Closing Balance</th>
              <th className="border border-gray-400 p-2 text-center">Purchase Value</th>
              <th className="border border-gray-400 p-2 text-center">Sale Value</th>
              <th className="border border-gray-400 p-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((s, i) => (
              <tr key={i} className={s.closing < 10 ? "bg-red-50" : "hover:bg-gray-50"}>
                <td className="border border-gray-300 p-2 font-semibold">{s.name}</td>
                <td className="border border-gray-300 p-2 text-center text-blue-700">{s.inwards} units</td>
                <td className="border border-gray-300 p-2 text-center text-orange-700">{s.outwards} units</td>
                <td className="border border-gray-300 p-2 text-center font-bold">
                  <span className={s.closing < 10 ? "text-red-600" : "text-green-700"}>{s.closing} units</span>
                </td>
                <td className="border border-gray-300 p-2 text-center text-blue-600">Rs.{s.purchase_value.toFixed(2)}</td>
                <td className="border border-gray-300 p-2 text-center text-green-600">Rs.{s.sale_value.toFixed(2)}</td>
                <td className="border border-gray-300 p-2 text-center">
                  <span className={"px-2 py-0 rounded text-xs font-bold " + (s.closing < 10 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700")}>
                    {s.closing < 10 ? "Low Stock" : "OK"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-200 font-bold">
              <td className="border border-gray-300 p-2">TOTAL</td>
              <td className="border border-gray-300 p-2 text-center text-blue-700">{stocks.reduce((sum, s) => sum + s.inwards, 0)} units</td>
              <td className="border border-gray-300 p-2 text-center text-orange-700">{stocks.reduce((sum, s) => sum + s.outwards, 0)} units</td>
              <td className="border border-gray-300 p-2 text-center">{stocks.reduce((sum, s) => sum + s.closing, 0)} units</td>
              <td className="border border-gray-300 p-2 text-center text-blue-600">Rs.{stocks.reduce((sum, s) => sum + s.purchase_value, 0).toFixed(2)}</td>
              <td className="border border-gray-300 p-2 text-center text-green-600">Rs.{stocks.reduce((sum, s) => sum + s.sale_value, 0).toFixed(2)}</td>
              <td className="border border-gray-300 p-2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </AppLayout>
  );
}