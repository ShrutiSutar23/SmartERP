"use client";

import API_URL from "../config";
import AppLayout from "../components/AppLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function PurchaseVoucher() {
  const [companyName, setCompanyName] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [voucherDate, setVoucherDate] = useState(new Date().toISOString().split("T")[0]);
  const [newSupplierName, setNewSupplierName] = useState("");
  const [newSupplierPhone, setNewSupplierPhone] = useState("");
  const router = useRouter();

  const getToken = () => localStorage.getItem("token");
  const getCid = () => localStorage.getItem("selectedCompanyId");

  const fetchAll = () => {
    const token = getToken();
    const cid = getCid();
    if (!token) { router.push("/login"); return; }
    if (!cid) { router.push("/companies"); return; }

    fetch("API_URL/api/suppliers?company_id=" + cid, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setSuppliers(data); });

    fetch("API_URL/api/items?company_id=" + cid, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setItems(data); });

    fetch("API_URL/api/purchase_history?company_id=" + cid, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setPurchases(data); });
  };

  useEffect(() => {
    setCompanyName(localStorage.getItem("selectedCompanyName") || "");
    fetchAll();
    const handleF2 = (e) => {
      if (e.key === "F2") {
        e.preventDefault();
        document.getElementById("voucherDate")?.focus();
      }
    };
    window.addEventListener("keydown", handleF2);
    return () => window.removeEventListener("keydown", handleF2);
  }, []);

  const handleAddSupplier = (e) => {
    e.preventDefault();
    const token = getToken();
    const cid = getCid();
    fetch("API_URL/api/add_supplier", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ name: newSupplierName, phone: newSupplierPhone, company_id: cid }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setNewSupplierName("");
        setNewSupplierPhone("");
        fetchAll();
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = getToken();
    const cid = getCid();

    const finalPaymentMethod = isPaid ? paymentMethod : "Unpaid";

    console.log("isPaid:", isPaid);
    console.log("paymentMethod:", paymentMethod);
    console.log("finalPaymentMethod:", finalPaymentMethod);

    fetch("API_URL/api/purchase_voucher", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({
        supplier_id: supplierId,
        item_id: itemId,
        quantity: quantity,
        payment_method: finalPaymentMethod,
        company_id: cid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setSupplierId("");
        setItemId("");
        setQuantity("");
        setIsPaid(false);
        setPaymentMethod("Cash");
        fetchAll();
      });
  };

  return (
    <AppLayout currentPage="purchases">
      <div className="p-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Purchase Voucher (Fn+F9)</h1>
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

        <div className="bg-gray-50 border p-4 rounded mb-4">
          <div className="flex items-center gap-3 mb-3">
            <label className="text-sm font-semibold">Date (F2):</label>
            <input
              id="voucherDate"
              type="date"
              value={voucherDate}
              onChange={(e) => setVoucherDate(e.target.value)}
              className="border border-gray-300 p-1 rounded text-sm"
            />
          </div>

          <div className="mb-3 border p-3 rounded bg-white">
            <h3 className="font-semibold text-sm mb-2">New Supplier</h3>
            <form onSubmit={handleAddSupplier} className="flex gap-2">
              <input
                type="text"
                placeholder="Supplier name"
                value={newSupplierName}
                onChange={(e) => setNewSupplierName(e.target.value)}
                className="border p-2 rounded text-sm flex-1"
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={newSupplierPhone}
                onChange={(e) => setNewSupplierPhone(e.target.value)}
                className="border p-2 rounded text-sm w-32"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Add Supplier
              </button>
            </form>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap items-end">
            <div>
              <p className="text-xs text-gray-500 mb-1">Select Supplier</p>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="border border-gray-300 p-2 rounded"
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Select Item</p>
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
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Quantity</p>
              <input
                type="number"
                placeholder="Qty"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border border-gray-300 p-2 rounded w-24"
                required
                min="1"
              />
            </div>

            <div className="flex flex-col">
              <p className="text-xs text-gray-500 mb-1">Payment</p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPaid}
                  onChange={(e) => setIsPaid(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-semibold">Mark as Paid</span>
              </label>
            </div>

            {isPaid && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="border border-gray-300 p-2 rounded"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Card">Card</option>
                </select>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Create Purchase
              </button>
            </div>
          </form>
        </div>

        <h2 className="text-xl font-bold mb-2">Purchase History</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Supplier</th>
              <th className="border border-gray-300 p-2">Item</th>
              <th className="border border-gray-300 p-2">Qty</th>
              <th className="border border-gray-300 p-2">Total</th>
              <th className="border border-gray-300 p-2">Method</th>
              <th className="border border-gray-300 p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p.id}>
                <td className="border border-gray-300 p-2 text-center text-gray-500">{p.date || "-"}</td>
                <td className="border border-gray-300 p-2">{p.supplier_name}</td>
                <td className="border border-gray-300 p-2">{p.item_name}</td>
                <td className="border border-gray-300 p-2 text-center">{p.quantity}</td>
                <td className="border border-gray-300 p-2 text-center">Rs.{p.total_amount}</td>
                <td className="border border-gray-300 p-2 text-center">{p.payment_method || "-"}</td>
                <td className="border border-gray-300 p-2 text-center">
                  <span className={
                    "px-2 py-1 rounded text-xs font-bold " +
                    (p.payment_status === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700")
                  }>
                    {p.payment_status || "Unpaid"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}