"use client";

import API_URL from "../config";
import AppLayout from "../components/AppLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function JournalVoucher() {
  const [companyName, setCompanyName] = useState("");
  const [vouchers, setVouchers] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [partyName, setPartyName] = useState("");
  
  const router = useRouter();

  const getAuth = () => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("selectedCompanyId");
    return { token, companyId };
  };

  const fetchVouchers = () => {
    const { token, companyId } = getAuth();
    if (!token) { router.push("/login"); return; }
    if (!companyId) { router.push("/companies"); return; }

    fetch("API_URL/api/vouchers?company_id=" + companyId + "&type=Journal", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setVouchers(data); });
  };

  useEffect(() => {
    setCompanyName(localStorage.getItem("selectedCompanyName") || "");
    fetchVouchers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { token, companyId } = getAuth();

    fetch("API_URL/api/voucher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        company_id: companyId,
        voucher_type: "Journal",
        description: description,
        amount: amount,
        party_name: partyName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setDescription("");
        setAmount("");
        setPartyName("");
        fetchVouchers();
      });
  };

  return (
    <AppLayout currentPage="journal">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-2">Journal Voucher (Ctrl+J)</h1>
        <p className="text-gray-500 mb-4">
          Company: {companyName}{" "}
          <a href="/companies" className="text-blue-600 underline">(Switch)</a>
        </p>

        <div className="flex gap-4 mb-4 flex-wrap">
          <a href="/" className="text-blue-600 underline">Dashboard</a>
          <a href="/suppliers" className="text-blue-600 underline">Suppliers</a>
          <a href="/items" className="text-blue-600 underline">Items</a>
          <a href="/sales" className="text-blue-600 underline">Sales Voucher</a>
          <a href="/purchases" className="text-blue-600 underline">Purchase Voucher</a>
          <a href="/payment" className="text-blue-600 underline">Payment</a>
          <a href="/receipt" className="text-blue-600 underline">Receipt</a>
          <a href="/journal" className="text-blue-600 underline">Journal</a>
          <a href="/contra" className="text-blue-600 underline">Contra</a>
          <a href="/reports" className="text-blue-600 underline">Reports</a>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-6">
          <h2 className="text-lg font-bold mb-3 text-yellow-700">Create Journal Voucher</h2>
          <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Party Name (e.g. Internal)"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            />
            <input
              type="text"
              placeholder="Description (e.g. Balance correction)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border border-gray-300 p-2 rounded"
              required
            />
            <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded">
              Save Journal
            </button>
          </form>
        </div>

        <h2 className="text-xl font-bold mb-2">Journal History</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-yellow-100">
              <th className="border border-gray-300 p-2">Party</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((v) => (
              <tr key={v.id} className="bg-yellow-50">
                <td className="border border-gray-300 p-2">{v.party_name}</td>
                <td className="border border-gray-300 p-2">{v.description}</td>
                <td className="border border-gray-300 p-2">Rs.{v.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}