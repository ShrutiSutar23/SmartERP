"use client";

import AppLayout from "../components/AppLayout";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Vouchers() {
  const [companyName, setCompanyName] = useState("");
  const [vouchers, setVouchers] = useState([]);
  const [voucherType, setVoucherType] = useState("Payment");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [partyName, setPartyName] = useState("");
  const [filterType, setFilterType] = useState("");
  const router = useRouter();

  const fetchVouchers = (type) => {
    const token = localStorage.getItem("token");
    const cid = companyId || localStorage.getItem("selectedCompanyId");
    if (!token) { router.push("/login"); return; }
    if (!cid) { router.push("/companies"); return; }

    let url = "http://127.0.0.1:5000/api/vouchers?company_id=" + cid;
    if (type) url = url + "&type=" + type;

    fetch(url, { headers: { Authorization: "Bearer " + token } })
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setVouchers(data); });
  };

  useEffect(() => { 
    setCompanyName(localStorage.getItem("selectedCompanyName") || "");
    fetchVouchers(""); }, [companyId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const cid = companyId || localStorage.getItem("selectedCompanyId");

    fetch("http://127.0.0.1:5000/api/voucher", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ company_id: cid, voucher_type: voucherType, description, amount, party_name: partyName }),
    })
      .then((res) => res.json())
      .then((data) => { alert(data.message); setDescription(""); setAmount(""); setPartyName(""); fetchVouchers(filterType); });
  };

  const voucherColors = { Payment: "bg-red-100", Receipt: "bg-green-100", Journal: "bg-yellow-100", Contra: "bg-blue-100" };

  return (
    <AppLayout currentPage="vouchers">
      <div className="p-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Vouchers</h1>
          <button onClick={() => router.push("/")} className="bg-gray-600 text-white px-3 py-1 rounded text-sm">ESC: Gateway</button>
        </div>
        <p className="text-gray-500 mb-4">Company: {companyName}{" "}<a href="/companies" className="text-blue-600 underline">(Switch)</a></p>

        <div className="bg-gray-50 p-4 rounded mb-6 border">
          <h2 className="text-lg font-bold mb-3">Create Voucher</h2>
          <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
            <select value={voucherType} onChange={(e) => setVoucherType(e.target.value)} className="border border-gray-300 p-2 rounded">
              <option value="Payment">F5 - Payment</option>
              <option value="Receipt">F6 - Receipt</option>
              <option value="Journal">F7 - Journal</option>
              <option value="Contra">F4 - Contra</option>
            </select>
            <input type="text" placeholder="Party Name" value={partyName} onChange={(e) => setPartyName(e.target.value)} className="border border-gray-300 p-2 rounded" />
            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border border-gray-300 p-2 rounded" required />
            <input type="text" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="border border-gray-300 p-2 rounded" required />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Voucher</button>
          </form>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => { setFilterType(""); fetchVouchers(""); }} className="border px-3 py-1 rounded">All</button>
          <button onClick={() => { setFilterType("Payment"); fetchVouchers("Payment"); }} className="border px-3 py-1 rounded bg-red-100">Payment</button>
          <button onClick={() => { setFilterType("Receipt"); fetchVouchers("Receipt"); }} className="border px-3 py-1 rounded bg-green-100">Receipt</button>
          <button onClick={() => { setFilterType("Journal"); fetchVouchers("Journal"); }} className="border px-3 py-1 rounded bg-yellow-100">Journal</button>
          <button onClick={() => { setFilterType("Contra"); fetchVouchers("Contra"); }} className="border px-3 py-1 rounded bg-blue-100">Contra</button>
        </div>

        <table className="w-full border-collapse border border-gray-300">
          <thead><tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Type</th>
            <th className="border border-gray-300 p-2">Party</th>
            <th className="border border-gray-300 p-2">Description</th>
            <th className="border border-gray-300 p-2">Amount</th>
          </tr></thead>
          <tbody>
            {vouchers.map((v) => (
              <tr key={v.id} className={voucherColors[v.voucher_type] || ""}>
                <td className="border border-gray-300 p-2">{v.voucher_type}</td>
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