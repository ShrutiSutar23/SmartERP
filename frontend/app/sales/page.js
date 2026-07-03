"use client";

import AppLayout from "../components/AppLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SalesVoucher() {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [sales, setSales] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [voucherDate, setVoucherDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const router = useRouter();

  const getAuth = () => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("selectedCompanyId");
    return { token, companyId };
  };

  const fetchDropdownData = () => {
    const { token, companyId } = getAuth();
    if (!token) { router.push("/login"); return; }
    if (!companyId) { router.push("/companies"); return; }

    fetch("http://127.0.0.1:5000/api/customers?company_id=" + companyId, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setCustomers(data); });

    fetch("http://127.0.0.1:5000/api/items?company_id=" + companyId, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setItems(data); });
  };

  const fetchSalesHistory = () => {
    const { token, companyId } = getAuth();
    fetch("http://127.0.0.1:5000/api/sales_history?company_id=" + companyId, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setSales(data); });
  };

  useEffect(() => {
    setCompanyName(localStorage.getItem("selectedCompanyName") || "");
    fetchDropdownData();
    fetchSalesHistory();

    const handleF2 = (e) => {
      if (e.key === "F2") {
        e.preventDefault();
        document.getElementById("voucherDate").focus();
      }
    };
    window.addEventListener("keydown", handleF2);
    return () => window.removeEventListener("keydown", handleF2);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { token, companyId } = getAuth();

    fetch("http://127.0.0.1:5000/api/sales_voucher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        customer_id: customerId,
        item_id: itemId,
        quantity: quantity,
        company_id: companyId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setCustomerId("");
        setItemId("");
        setQuantity("");
        fetchDropdownData();
        fetchSalesHistory();
      });
  };

  const handleDownloadPDF = (saleId) => {
    window.open("http://127.0.0.1:5000/api/invoice/" + saleId, "_blank");
  };

  return (
    <AppLayout currentPage="sales">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-2">SmartERP - Sales Voucher (F8)</h1>
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
          <a href="/vouchers" className="text-blue-600 underline">Other Vouchers</a>
          <a href="/reports" className="text-blue-600 underline">Reports</a>
        </div>

        <div className="bg-gray-50 p-4 rounded mb-4 border">
          <div className="flex items-center gap-3 mb-4">
            <label className="text-sm font-semibold w-32">
              Date (F2 to focus):
            </label>
            <input
              id="voucherDate"
              type="date"
              value={voucherDate}
              onChange={(e) => setVoucherDate(e.target.value)}
              className="border border-gray-300 p-1 rounded text-sm"
            />
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="border border-gray-300 p-2 rounded"
              required
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="border border-gray-300 p-2 rounded"
              required
            >
              <option value="">Select Item</option>
              {items.map((i) => (
                <option key={i.id} value={i.id}>{i.name} (Stock: {i.quantity})</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border border-gray-300 p-2 rounded"
              required
            />

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Create Sale (Enter)
            </button>
          </form>
        </div>

        <h2 className="text-xl font-bold mb-2">Sales History</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Customer</th>
              <th className="border border-gray-300 p-2">Item</th>
              <th className="border border-gray-300 p-2">Quantity</th>
              <th className="border border-gray-300 p-2">Total</th>
              <th className="border border-gray-300 p-2">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.id}>
                <td className="border border-gray-300 p-2">{s.customer_name}</td>
                <td className="border border-gray-300 p-2">{s.item_name}</td>
                <td className="border border-gray-300 p-2">{s.quantity}</td>
                <td className="border border-gray-300 p-2">Rs.{s.total_amount}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleDownloadPDF(s.id)}
                    className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}