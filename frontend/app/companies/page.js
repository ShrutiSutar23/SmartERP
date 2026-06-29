"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [financialYear, setFinancialYear] = useState("");
  const [contact, setContact] = useState("");
  const [state, setState] = useState("");
  const router = useRouter();

  const fetchCompanies = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://127.0.0.1:5000/api/companies", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCompanies(data);
        }
      });
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:5000/api/companies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name, address, gst_number: gstNumber,
        financial_year: financialYear, contact, state
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setName(""); setAddress(""); setGstNumber("");
        setFinancialYear(""); setContact(""); setState("");
        fetchCompanies();
      });
  };

  const handleDelete = (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this company?");
  if (!confirmDelete) {
    return;
  }

  const token = localStorage.getItem("token");
  fetch(`http://127.0.0.1:5000/api/companies/${id}`, {  
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || data.msg || "Something went wrong");
        fetchCompanies();
      });
  };

  const handleSelect = (company) => {
    localStorage.setItem("selectedCompanyId", company.id);
    localStorage.setItem("selectedCompanyName", company.name);
    router.push("/");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Select or Create a Company</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {companies.map((c) => (
          <div key={c.id} className="border rounded p-4">
            <h2 className="font-bold text-lg">{c.name}</h2>
            <p className="text-sm text-gray-600">{c.address}</p>
            <p className="text-sm text-gray-600">GST: {c.gst_number}</p>
            <p className="text-sm text-gray-600">State: {c.state}</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleSelect(c)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Select
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-3">Create New Company</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 max-w-xl">
        <input placeholder="Company Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded" required />
        <input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="border p-2 rounded" />
        <input placeholder="GST Number" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} className="border p-2 rounded" />
        <input placeholder="Financial Year (e.g. 2025-26)" value={financialYear} onChange={(e) => setFinancialYear(e.target.value)} className="border p-2 rounded" />
        <input placeholder="Contact Number" value={contact} onChange={(e) => setContact(e.target.value)} className="border p-2 rounded" />
        <input placeholder="State" value={state} onChange={(e) => setState(e.target.value)} className="border p-2 rounded" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded col-span-2">
          Create Company
        </button>
      </form>
    </div>
  );
}