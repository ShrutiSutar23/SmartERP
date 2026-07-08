"use client";

import API_URL from "../config";
import AppLayout from "../components/AppLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


const API_BASE = "API_URL/api";

export default function ContraVoucher() {
  const [companyId, setCompanyId] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [vouchers, setVouchers] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [partyName, setPartyName] = useState("");
  const router = useRouter();

  const fetchVouchers = (cid) => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    if (!cid) { router.push("/companies"); return; }

    fetch(`${API_BASE}/vouchers?company_id=${cid}&type=Contra`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setVouchers(data); })
      .catch((error) => {
        console.error("Failed to load vouchers", error);
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
    fetchVouchers(cid);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    fetch(`${API_BASE}/voucher`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        company_id: companyId,
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
        fetchVouchers(companyId);
      })
      .catch((error) => {
        console.error("Failed to save contra voucher", error);
        alert("Unable to connect to the server. Please make sure the backend is running.");
      });
  };

  return (
    <AppLayout currentPage="contra">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-2">Contra Voucher (Ctrl+N)</h1>
        <p className="text-gray-500 mb-4">
          Company: {companyName}{" "}
          <Link href="/companies" className="text-blue-600 underline">(Switch)</Link>
        </p>

        <div className="flex gap-4 mb-4 flex-wrap">
          <Link href="/" className="text-blue-600 underline">Dashboard</Link>
          <Link href="/suppliers" className="text-blue-600 underline">Suppliers</Link>
          <Link href="/items" className="text-blue-600 underline">Items</Link>
          <Link href="/sales" className="text-blue-600 underline">Sales Voucher</Link>
          <Link href="/purchases" className="text-blue-600 underline">Purchase Voucher</Link>
          <Link href="/payment" className="text-blue-600 underline">Payment</Link>
          <Link href="/receipt" className="text-blue-600 underline">Receipt</Link>
          <Link href="/journal" className="text-blue-600 underline">Journal</Link>
          <Link href="/contra" className="text-blue-600 underline">Contra</Link>
          <Link href="/reports" className="text-blue-600 underline">Reports</Link>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-6">
          <h2 className="text-lg font-bold mb-3 text-blue-700">Create Contra Voucher</h2>
          <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Bank Name (e.g. SBI Bank)"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            />
            <input
              type="text"
              placeholder="Description (e.g. Cash deposited)"
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
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Save Contra
            </button>
          </form>
        </div>

        <h2 className="text-xl font-bold mb-2">Contra History</h2>
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
                <td className="border border-gray-300 p-2">Rs.{v.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}