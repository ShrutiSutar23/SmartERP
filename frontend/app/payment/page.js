"use client";

import API_URL from "../config";
import AppLayout from "../components/AppLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function PaymentVoucher() {
  const [companyName, setCompanyName] = useState("");
  const [vouchers, setVouchers] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [partyName, setPartyName] = useState("");
  const router = useRouter();

  const fetchVouchers = () => {
    const token = localStorage.getItem("token");
    const cid = localStorage.getItem("selectedCompanyId");
    if (!token) { router.push("/login"); return; }
    if (!cid) { router.push("/companies"); return; }

    fetch("API_URL/api/vouchers?company_id=" + cid + "&type=Payment", {
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
    const token = localStorage.getItem("token");
    const cid = localStorage.getItem("selectedCompanyId");

    fetch("API_URL/api/voucher", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({
        company_id: cid,
        voucher_type: "Payment",
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
    <AppLayout currentPage="payment">
      <div className="p-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Payment Voucher</h1>
          <button onClick={() => router.push("/")} className="bg-gray-600 text-white px-3 py-1 rounded text-sm">ESC: Gateway</button>
        </div>
        <p className="text-gray-500 mb-4">
          Company: {companyName}{" "}
          <a href="/companies" className="text-blue-600 underline">(Switch)</a>
        </p>

        <div className="bg-red-50 border border-red-200 p-4 rounded mb-6">
          <h2 className="font-bold text-red-700 mb-3">Create Payment</h2>
          <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
            <input type="text" placeholder="Party Name" value={partyName} onChange={(e) => setPartyName(e.target.value)} className="border border-gray-300 p-2 rounded" />
            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border border-gray-300 p-2 rounded" required />
            <input type="text" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="border border-gray-300 p-2 rounded" required />
            <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">Save Payment</button>
          </form>
        </div>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-red-100">
              <th className="border border-gray-300 p-2">Party</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((v) => (
              <tr key={v.id} className="bg-red-50">
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