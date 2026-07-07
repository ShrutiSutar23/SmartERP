"use client";

import AppLayout from "../components/AppLayout";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ContraVoucher() {
  const [companyName, setCompanyName] = useState("");
  const [vouchers, setVouchers] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [partyName, setPartyName] = useState("");
  const router = useRouter();

  const fetchVouchers = () => {
    const token = localStorage.getItem("token");
    const cid = companyId || localStorage.getItem("selectedCompanyId");
    if (!token) { router.push("/login"); return; }
    if (!cid) { router.push("/companies"); return; }

    fetch("http://127.0.0.1:5000/api/vouchers?company_id=" + cid + "&type=Contra", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setVouchers(data); });
  };

  useEffect(() => { 
    setCompanyName(localStorage.getItem("selectedCompanyName") || "");
    fetchVouchers(); }, [companyId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const cid = companyId || localStorage.getItem("selectedCompanyId");

    fetch("http://127.0.0.1:5000/api/voucher", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({
        company_id: cid,
        voucher_type: "Contra",
        description,
        amount,
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
    <AppLayout currentPage="contra">
      <div className="p-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Contra Voucher</h1>
          <button
            onClick={() => router.push("/")}
            className="bg-gray-600 text-white px-3 py-1 rounded text-sm"
          >
            ESC: Gateway
          </button>
        </div>
        <p className="text-gray-500 mb-4">
          Company: {companyName}{" "}
          <a href="/companies" className="text-blue-600 underline">(Switch)</a>
        </p>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-6">
          <h2 className="font-bold text-blue-700 mb-3">Create Contra Entry</h2>
          <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Bank Name"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            />
            <input
              type="text"
              placeholder="Description"
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
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save Contra
            </button>
          </form>
        </div>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-100">
              <th className="border border-gray-300 p-2">Party</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((v) => (
              <tr key={v.id} className="bg-blue-50">
                <td className="border border-gray-300 p-2">{v.party_name}</td>
                <td className="border border-gray-300 p-2">{v.description}</td>
                <td className="border border-gray-300 p-2 text-center">Rs.{v.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}