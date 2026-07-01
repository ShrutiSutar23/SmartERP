"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Vouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [voucherType, setVoucherType] = useState("Payment");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [partyName, setPartyName] = useState("");
  const [filterType, setFilterType] = useState("");
  const [companyName, setCompanyName] = useState("");
  const router = useRouter();

  const getAuth = () => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("selectedCompanyId");
    return { token, companyId };
  };

  const fetchVouchers = (type = "") => {
    const { token, companyId } = getAuth();
    if (!token) { router.push("/login"); return; }
    if (!companyId) { router.push("/companies"); return; }

    const url = type
      ? `http://127.0.0.1:5000/api/vouchers?company_id=${companyId}&type=${type}`
      : `http://127.0.0.1:5000/api/vouchers?company_id=${companyId}`;

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setVouchers(data);
      });
  };

  useEffect(() => {
    setCompanyName(localStorage.getItem("selectedCompanyName") || "");
    fetchVouchers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { token, companyId } = getAuth();

    fetch("http://127.0.0.1:5000/api/voucher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        company_id: companyId,
        voucher_type: voucherType,
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
        fetchVouchers(filterType);
      });
  };

  const handleFilter = (type) => {
    setFilterType(type);
    fetchVouchers(type);
  };

  const voucherColors = {
    Payment: "bg-red-100",
    Receipt: "bg-green-100",
    Journal: "bg-yellow-100",
    Contra: "bg-blue-100",
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">SmartERP - Vouchers</h1>
      <p className="text-gray-500 mb-4">
        Company: {companyName}{" "}
        <a href="/companies" className="text-blue-600 underline">(Switch)</a>
      </p>

      <div className="flex gap-4 mb-4">
        <a href="/" className="text-blue-600 underline">Customers</a>
        <a href="/suppliers" className="text-blue-600 underline">Suppliers</a>
        <a href="/items" className="text-blue-600 underline">Items</a>
        <a href="/sales" className="text-blue-600 underline">Sales Voucher</a>
        <a href="/purchases" className="text-blue-600 underline">Purchase Voucher</a>
        <a href="/vouchers" className="text-blue-600 underline">Other Vouchers</a>
      </div>

      <div className="bg-gray-50 p-4 rounded mb-6">
        <h2 className="text-lg font-bold mb-3">Create Voucher</h2>
        <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
          <select
            value={voucherType}
            onChange={(e) => setVoucherType(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="Payment">Payment</option>
            <option value="Receipt">Receipt</option>
            <option value="Journal">Journal</option>
            <option value="Contra">Contra</option>
          </select>

          <input
            type="text"
            placeholder="Party Name (e.g. Landlord, Customer)"
            value={partyName}
            onChange={(e) => setPartyName(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          />

          <input
            type="text"
            placeholder="Description (e.g. Monthly Rent)"
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
            Save Voucher
          </button>
        </form>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => handleFilter("")} className="border px-3 py-1 rounded">All</button>
        <button onClick={() => handleFilter("Payment")} className="border px-3 py-1 rounded bg-red-100">Payment</button>
        <button onClick={() => handleFilter("Receipt")} className="border px-3 py-1 rounded bg-green-100">Receipt</button>
        <button onClick={() => handleFilter("Journal")} className="border px-3 py-1 rounded bg-yellow-100">Journal</button>
        <button onClick={() => handleFilter("Contra")} className="border px-3 py-1 rounded bg-blue-100">Contra</button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Type</th>
            <th className="border border-gray-300 p-2">Party</th>
            <th className="border border-gray-300 p-2">Description</th>
            <th className="border border-gray-300 p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((v) => (
            <tr key={v.id} className={voucherColors[v.voucher_type] || ""}>
              <td className="border border-gray-300 p-2">{v.voucher_type}</td>
              <td className="border border-gray-300 p-2">{v.party_name}</td>
              <td className="border border-gray-300 p-2">{v.description}</td>
              <td className="border border-gray-300 p-2">₹{v.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}