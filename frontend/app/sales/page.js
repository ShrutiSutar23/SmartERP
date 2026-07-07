"use client";

import AppLayout from "../components/AppLayout";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SalesVoucher() {
  const [companyName, setCompanyName] = useState("");
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [sales, setSales] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [voucherDate, setVoucherDate] = useState(new Date().toISOString().split("T")[0]);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const router = useRouter();

  const getToken = () => localStorage.getItem("token");
  const getCid = () => companyId || localStorage.getItem("selectedCompanyId");

  const fetchAll = () => {
    const token = getToken();
    const cid = getCid();
    if (!token) { router.push("/login"); return; }
    if (!cid) { router.push("/companies"); return; }

    fetch("http://127.0.0.1:5000/api/customers?company_id=" + cid, { headers: { Authorization: "Bearer " + token } })
      .then((res) => res.json()).then((data) => { if (Array.isArray(data)) setCustomers(data); });

    fetch("http://127.0.0.1:5000/api/items?company_id=" + cid, { headers: { Authorization: "Bearer " + token } })
      .then((res) => res.json()).then((data) => { if (Array.isArray(data)) setItems(data); });

    fetch("http://127.0.0.1:5000/api/sales_history?company_id=" + cid, { headers: { Authorization: "Bearer " + token } })
      .then((res) => res.json()).then((data) => { if (Array.isArray(data)) setSales(data); });
  };

  useEffect(() => {
    setCompanyName(localStorage.getItem("selectedCompanyName") || "");
    fetchAll();
    const handleF2 = (e) => { if (e.key === "F2") { e.preventDefault(); document.getElementById("voucherDate")?.focus(); } };
    window.addEventListener("keydown", handleF2);
    return () => window.removeEventListener("keydown", handleF2);
  }, [companyId]);

  const handleAddCustomer = (e) => {
    e.preventDefault();
    const token = getToken(); const cid = getCid();
    fetch("http://127.0.0.1:5000/api/add_customer", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ name: newCustomerName, phone: newCustomerPhone, company_id: cid }),
    })
      .then((res) => res.json())
      .then((data) => { alert(data.message); setNewCustomerName(""); setNewCustomerPhone(""); fetchAll(); });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = getToken(); const cid = getCid();
    fetch("http://127.0.0.1:5000/api/sales_voucher", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ customer_id: customerId, item_id: itemId, quantity, company_id: cid }),
    })
      .then((res) => res.json())
      .then((data) => { alert(data.message); setCustomerId(""); setItemId(""); setQuantity(""); fetchAll(); });
  };

  const handleDownloadPDF = (saleId) => { window.open("http://127.0.0.1:5000/api/invoice/" + saleId, "_blank"); };

  return (
    <AppLayout currentPage="sales">
      <div className="p-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Sales Voucher (Fn+F8)</h1>
          <button onClick={() => router.push("/")} className="bg-gray-600 text-white px-3 py-1 rounded text-sm">ESC: Gateway</button>
        </div>
        <p className="text-gray-500 mb-4">Company: {companyName}{" "}<a href="/companies" className="text-blue-600 underline">(Switch)</a></p>

        <div className="bg-gray-50 border p-4 rounded mb-4">
          <div className="flex items-center gap-3 mb-3">
            <label className="text-sm font-semibold">Date (F2):</label>
            <input id="voucherDate" type="date" value={voucherDate} onChange={(e) => setVoucherDate(e.target.value)} className="border border-gray-300 p-1 rounded text-sm" />
          </div>

          <div className="mb-3 border p-3 rounded bg-white">
            <h3 className="font-semibold text-sm mb-2">New Customer</h3>
            <form onSubmit={handleAddCustomer} className="flex gap-2">
              <input type="text" placeholder="Customer name" value={newCustomerName} onChange={(e) => setNewCustomerName(e.target.value)} className="border p-2 rounded text-sm flex-1" required />
              <input type="text" placeholder="Phone" value={newCustomerPhone} onChange={(e) => setNewCustomerPhone(e.target.value)} className="border p-2 rounded text-sm w-32" />
              <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Add Customer</button>
            </form>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
            <div>
              <p className="text-xs text-gray-500 mb-1">Select Existing Customer</p>
              <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="border border-gray-300 p-2 rounded" required>
                <option value="">Select Customer</option>
                {customers.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Select Item</p>
              <select value={itemId} onChange={(e) => setItemId(e.target.value)} className="border border-gray-300 p-2 rounded" required>
                <option value="">Select Item</option>
                {items.map((i) => (<option key={i.id} value={i.id}>{i.name} (Stock: {i.quantity})</option>))}
              </select>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Quantity</p>
              <input type="text" placeholder="Qty" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="border border-gray-300 p-2 rounded w-24" required />
            </div>
            <div className="flex items-end">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Create Sale (Enter)</button>
            </div>
          </form>
        </div>

        <h2 className="text-xl font-bold mb-2">Sales History</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Customer</th>
              <th className="border border-gray-300 p-2">Item</th>
              <th className="border border-gray-300 p-2">Qty</th>
              <th className="border border-gray-300 p-2">Total</th>
              <th className="border border-gray-300 p-2">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.id}>
                <td className="border border-gray-300 p-2 text-center text-gray-500">{s.date || "-"}</td>
                <td className="border border-gray-300 p-2">{s.customer_name}</td>
                <td className="border border-gray-300 p-2">{s.item_name}</td>
                <td className="border border-gray-300 p-2 text-center">{s.quantity}</td>
                <td className="border border-gray-300 p-2 text-center">Rs.{s.total_amount}</td>
                <td className="border border-gray-300 p-2 text-center">
                  <button onClick={() => handleDownloadPDF(s.id)} className="bg-blue-600 text-white px-2 py-1 rounded text-sm">PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}