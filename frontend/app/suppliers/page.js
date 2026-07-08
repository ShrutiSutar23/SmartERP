"use client";

import API_URL from "../config";
import AppLayout from "../components/AppLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "API_URL/api";

export default function Suppliers() {
  const [companyId, setCompanyId] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();

  const fetchSuppliers = (cid) => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    if (!cid) { router.push("/companies"); return; }

    fetch(`${API_BASE}/suppliers?company_id=${cid}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setSuppliers(data); })
      .catch((error) => {
        console.error("Failed to load suppliers", error);
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
    fetchSuppliers(cid);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    fetch(`${API_BASE}/add_supplier`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ name, phone, company_id: companyId }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setName("");
        setPhone("");
        fetchSuppliers(companyId);
      })
      .catch((error) => {
        console.error("Failed to add supplier", error);
        alert("Unable to connect to the server. Please make sure the backend is running.");
      });
  };

  return (
    <AppLayout currentPage="suppliers">
      <div className="p-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Suppliers</h1>
          <button onClick={() => router.push("/")} className="bg-gray-600 text-white px-3 py-1 rounded text-sm">ESC: Gateway</button>
        </div>
        <p className="text-gray-500 mb-4">Company: {companyName}{" "}<a href="/companies" className="text-blue-600 underline">(Switch)</a></p>

        <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
          <input type="text" placeholder="Supplier Name" value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-300 p-2 rounded" required />
          <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="border border-gray-300 p-2 rounded" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Supplier</button>
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