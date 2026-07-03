"use client";

import AppLayout from "../components/AppLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const router = useRouter();

  const getAuth = () => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("selectedCompanyId");
    return { token, companyId };
  };

  const fetchSuppliers = () => {
    const { token, companyId } = getAuth();
    if (!token) { router.push("/login"); return; }
    if (!companyId) { router.push("/companies"); return; }

    fetch("http://127.0.0.1:5000/api/suppliers?company_id=" + companyId, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSuppliers(data);
        } else {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          router.push("/login");
        }
      });
  };

  useEffect(() => {
    setCompanyName(localStorage.getItem("selectedCompanyName") || "");
    fetchSuppliers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { token, companyId } = getAuth();

    fetch("http://127.0.0.1:5000/api/add_supplier", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ name: name, phone: phone, company_id: companyId }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        setName("");
        setPhone("");
        fetchSuppliers();
      });
  };

  return (
    <AppLayout currentPage="suppliers">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-2">SmartERP - Suppliers</h1>
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

        <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Supplier
          </button>
        </form>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Phone</th>
              <th className="border border-gray-300 p-2">Balance Due</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id}>
                <td className="border border-gray-300 p-2">{s.name}</td>
                <td className="border border-gray-300 p-2">{s.phone}</td>
                <td className="border border-gray-300 p-2">Rs.{s.balance_due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}