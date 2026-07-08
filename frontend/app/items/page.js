"use client";

import API_URL from "../config";
import AppLayout from "../components/AppLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Items() {
  const [companyName, setCompanyName] = useState("");
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [hsnCode, setHsnCode] = useState("");
  const [unitSymbol, setUnitSymbol] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [gstPercentage, setGstPercentage] = useState("0");
  const router = useRouter();

  const fetchItems = () => {
    const token = localStorage.getItem("token");
    const cid = localStorage.getItem("selectedCompanyId");
    if (!token) { router.push("/login"); return; }
    if (!cid) { router.push("/companies"); return; }

    fetch("API_URL/api/items?company_id=" + cid, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
      })
      .catch((err) => console.error("Failed to load items", err.message));
  };

  useEffect(() => {
    const name = localStorage.getItem("selectedCompanyName");
    setCompanyName(name || "");
    fetchItems();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const cid = localStorage.getItem("selectedCompanyId");

    console.log("Submitting unit:", unitSymbol);

    fetch("API_URL/api/add_item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        name: name,
        hsn_code: hsnCode,
        unit_id: unitSymbol,
        purchase_price: purchasePrice,
        selling_price: sellingPrice,
        quantity: quantity || 0,
        gst_percentage: gstPercentage,
        company_id: cid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setName(""); setHsnCode(""); setUnitSymbol("");
        setPurchasePrice(""); setSellingPrice("");
        setQuantity(""); setGstPercentage("0");
        fetchItems();
      });
  };

  return (
    <AppLayout currentPage="items">
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Stock Items (Alt+S)</h1>
          <button onClick={() => router.push("/")} className="bg-gray-600 text-white px-3 py-1 rounded text-sm">ESC: Gateway</button>
        </div>
        <p className="text-gray-500 mb-4">
          Company: {companyName}{" "}
          <a href="/companies" className="text-blue-600 underline">(Switch)</a>
        </p>

        <div className="bg-gray-50 border p-4 rounded mb-6">
          <h2 className="font-bold mb-3 text-blue-800">Create Stock Item</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 max-w-2xl">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Item Name *</label>
              <input type="text" placeholder="sugar, rice, gold etc." value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-300 p-2 rounded w-full" required />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">HSN Code</label>
              <input type="text" placeholder="7113" value={hsnCode} onChange={(e) => setHsnCode(e.target.value)} className="border border-gray-300 p-2 rounded w-full" />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Unit of Measure</label>
              <select value={unitSymbol} onChange={(e) => setUnitSymbol(e.target.value)} className="border border-gray-300 p-2 rounded w-full">
                <option value="">Not Applicable</option>
                <option value="Kg">Kg — Kilogram</option>
                <option value="Ltr">Ltr — Litre</option>
                <option value="Mtr">Mtr — Metre</option>
                <option value="Pairs">Pairs — Pair</option>
                <option value="PCS">PCS — Pieces</option>
                <option value="Gm">Gm — Gram</option>
                <option value="BOX">BOX — Box</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">GST %</label>
              <select value={gstPercentage} onChange={(e) => setGstPercentage(e.target.value)} className="border border-gray-300 p-2 rounded w-full">
                <option value="0">0% (Exempt)</option>
                <option value="3">3%</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Purchase Price *</label>
              <input type="text" placeholder="Price you buy at" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} className="border border-gray-300 p-2 rounded w-full" required />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Selling Price *</label>
              <input type="text" placeholder="Price you sell at" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} className="border border-gray-300 p-2 rounded w-full" required />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Opening Quantity</label>
              <input
                type="number"
                placeholder="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full"
                min="0"
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded w-full">Create Item</button>
            </div>
          </form>
        </div>

        <h2 className="font-bold mb-2">Stock Items List</h2>
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="border border-gray-300 p-2 text-left">Item Name</th>
              <th className="border border-gray-300 p-2">HSN</th>
              <th className="border border-gray-300 p-2">Unit</th>
              <th className="border border-gray-300 p-2">Purchase Price</th>
              <th className="border border-gray-300 p-2">Selling Price</th>
              <th className="border border-gray-300 p-2">Stock Qty</th>
              <th className="border border-gray-300 p-2">GST%</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className={i.quantity < 10 ? "bg-red-50" : "hover:bg-gray-50"}>
                <td className="border border-gray-300 p-2 font-semibold">{i.name}</td>
                <td className="border border-gray-300 p-2 text-center text-gray-500">{i.hsn_code || "-"}</td>
                <td className="border border-gray-300 p-2 text-center font-mono">{i.unit_symbol || "-"}</td>
                <td className="border border-gray-300 p-2 text-center text-blue-700">Rs.{i.purchase_price}</td>
                <td className="border border-gray-300 p-2 text-center text-green-700">Rs.{i.selling_price}</td>
                <td className="border border-gray-300 p-2 text-center font-bold">
                  <span className={i.quantity < 10 ? "text-red-600" : "text-green-700"}>
                    {i.quantity} {i.unit_symbol || ""}
                  </span>
                </td>
                <td className="border border-gray-300 p-2 text-center">{i.gst_percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}