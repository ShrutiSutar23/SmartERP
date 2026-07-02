"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Items() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [companyName, setCompanyName] = useState("");
  const router = useRouter();

  const fetchItems = () => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("selectedCompanyId");

    if (!token) {
      router.push("/login");
      return;
    }
    if (!companyId) {
      router.push("/companies");
      return;
    }

    fetch(`http://127.0.0.1:5000/api/items?company_id=${companyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          router.push("/login");
        }
      });
  };

  useEffect(() => {
    setCompanyName(localStorage.getItem("selectedCompanyName") || "");
    fetchItems();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("selectedCompanyId");

    fetch("http://127.0.0.1:5000/api/add_item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        price: price,
        quantity: quantity,
        company_id: companyId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        setName("");
        setPrice("");
        setQuantity("");
        fetchItems();
      });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">SmartERP - Items</h1>
      <p className="text-gray-500 mb-4">
        Company: {companyName}{" "}
        <a href="/companies" className="text-blue-600 underline">(Switch)</a>
      </p>
      
      <div className="flex gap-4 mb-4">
        <a href="/" className="text-blue-600 underline">Customers</a>
        <a href="/suppliers" className="text-blue-600 underline">Suppliers</a>
        <a href="/items" className="text-blue-600 underline">Items</a>
        <a href="/vouchers" className="text-blue-600 underline">Other Vouchers</a>
        <a href="/reports" className="text-blue-600 underline">Reports</a>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border border-gray-300 p-2 rounded"
          required
        />
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
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Item
        </button>
      </form>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Item Name</th>
            <th className="border border-gray-300 p-2">Price</th>
            <th className="border border-gray-300 p-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td className="border border-gray-300 p-2">{i.name}</td>
              <td className="border border-gray-300 p-2">₹{i.price}</td>
              <td className="border border-gray-300 p-2">{i.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}