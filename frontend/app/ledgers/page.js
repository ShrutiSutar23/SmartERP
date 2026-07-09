"use client";

import API_URL from "../config";
import AppLayout from "../components/AppLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Ledgers() {
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [activeTab, setActiveTab] = useState("customers");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [ledgerType, setLedgerType] = useState("Customer");
  const [companyName, setCompanyName] = useState("");
  const router = useRouter();

  const getAuth = () => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("selectedCompanyId");
    return { token, companyId };
  };

  const fetchAll = () => {
    const { token, companyId } = getAuth();
    if (!token) { router.push("/login"); return; }
    if (!companyId) { router.push("/companies"); return; }

    fetch(`${API_URL}/api/customers?company_id=${companyId}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setCustomers(data); });

    fetch(`${API_URL}/api/suppliers?company_id=${companyId}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setSuppliers(data); });
  };

  useEffect(() => {
    setCompanyName(localStorage.getItem("selectedCompanyName") || "");
    fetchAll();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { token, companyId } = getAuth();

    const url = ledgerType === "Customer"
      ? `${API_URL}/api/add_customer`
      : `${API_URL}/api/add_supplier`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ name, phone, company_id: companyId }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setName("");
        setPhone("");
        fetchAll();
      });
  };

  const tabClass = (tab) =>
    "px-4 py-2 font-semibold text-sm cursor-pointer " +
    (activeTab === tab
      ? "bg-blue-700 text-white"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300");

  return (
    <AppLayout currentPage="ledgers">
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Ledger Management</h1>
          <button onClick={() => router.push("/")}
            className="bg-gray-600 text-white px-3 py-1 rounded text-sm">
            ESC: Gateway
          </button>
        </div>

        <p className="text-gray-500 mb-4">
          Company: {companyName}{" "}
          <a href="/companies" className="text-blue-600 underline">(Switch)</a>
        </p>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-6">
          <h2 className="font-bold text-blue-800 mb-3">Create Ledger (Alt+L)</h2>
          <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap items-end">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Ledger Type</label>
              <select
                value={ledgerType}
                onChange={(e) => setLedgerType(e.target.value)}
                className="border border-gray-300 p-2 rounded"
              >
                <option value="Customer">Customer (Debtor)</option>
                <option value="Supplier">Supplier (Creditor)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Name</label>
              <input
                type="text"
                placeholder="Ledger Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Phone</label>
              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border border-gray-300 p-2 rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-700 text-white px-4 py-2 rounded"
            >
              Create Ledger
            </button>
          </form>
        </div>

        <div className="flex gap-1 mb-0">
          <button className={tabClass("customers")}
            onClick={() => setActiveTab("customers")}>
            Customer Ledgers ({customers.length})
          </button>
          <button className={tabClass("suppliers")}
            onClick={() => setActiveTab("suppliers")}>
            Supplier Ledgers ({suppliers.length})
          </button>
        </div>

        {activeTab === "customers" && (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="border border-gray-300 p-2 text-left">Name</th>
                <th className="border border-gray-300 p-2">Phone</th>
                <th className="border border-gray-300 p-2">Outstanding Balance</th>
                <th className="border border-gray-300 p-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-blue-50">
                  <td className="border border-gray-300 p-2">{c.name}</td>
                  <td className="border border-gray-300 p-2 text-center">{c.phone}</td>
                  <td className="border border-gray-300 p-2 text-center">
                    <span className={c.balance > 0 ? "text-red-600 font-bold" : "text-green-600"}>
                      Rs.{c.balance}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <span className="bg-blue-100 text-blue-700 px-2 py-0 rounded text-xs">
                      Debtor
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "suppliers" && (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-green-700 text-white">
                <th className="border border-gray-300 p-2 text-left">Name</th>
                <th className="border border-gray-300 p-2">Phone</th>
                <th className="border border-gray-300 p-2">Amount Payable</th>
                <th className="border border-gray-300 p-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-green-50">
                  <td className="border border-gray-300 p-2">{s.name}</td>
                  <td className="border border-gray-300 p-2 text-center">{s.phone}</td>
                  <td className="border border-gray-300 p-2 text-center">
                    <span className={s.balance_due > 0 ? "text-red-600 font-bold" : "text-green-600"}>
                      Rs.{s.balance_due}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <span className="bg-green-100 text-green-700 px-2 py-0 rounded text-xs">
                      Creditor
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppLayout>
  );
}