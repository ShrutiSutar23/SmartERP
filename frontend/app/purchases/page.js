"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PurchaseVoucher() {
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [companyName, setCompanyName] = useState("");
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

    fetch(`http://127.0.0.1:5000/api/suppliers?company_id=${companyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setSuppliers(data); });

    fetch(`http://127.0.0.1:5000/api/items?company_id=${companyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setItems(data); });
  };

  const fetchPurchaseHistory = () => {
    const { token, companyId } = getAuth();
    fetch(`http://127.0.0.1:5000/api/purchase_history?company_id=${companyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setPurchases(data); });
  };

  useEffect(() => {
    setCompanyName(localStorage.getItem("selectedCompanyName") || "");
    fetchDropdownData();
    fetchPurchaseHistory();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { token, companyId } = getAuth();

    fetch("http://127.0.0.1:5000/api/purchase_voucher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        supplier_id: supplierId,
        item_id: itemId,
        quantity: quantity,
        company_id: companyId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setSupplierId("");
        setItemId("");
        setQuantity("");
        fetchDropdownData();
        fetchPurchaseHistory();
      });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">SmartERP - Purchase Voucher</h1>
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

      <form onSubmit={handleSubmit} className="mb-6 flex gap-2 flex-wrap">
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

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Create Purchase
        </button>
      </form>

      <h2 className="text-xl font-bold mb-2">Purchase History</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Supplier</th>
            <th className="border border-gray-300 p-2">Item</th>
            <th className="border border-gray-300 p-2">Quantity</th>
            <th className="border border-gray-300 p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((p) => (
            <tr key={p.id}>
              <td className="border border-gray-300 p-2">{p.supplier_name}</td>
              <td className="border border-gray-300 p-2">{p.item_name}</td>
              <td className="border border-gray-300 p-2">{p.quantity}</td>
              <td className="border border-gray-300 p-2">₹{p.total_amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}