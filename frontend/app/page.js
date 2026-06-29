"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const router = useRouter();

  const fetchCustomers = () => {
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

    fetch(`http://127.0.0.1:5000/api/customers?company_id=${companyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCustomers(data);
        } else {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          router.push("/login");
        }
      });
  };

  useEffect(() => {
    setCompanyName(localStorage.getItem("selectedCompanyName") || "");
    fetchCustomers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("selectedCompanyId");

    fetch("http://127.0.0.1:5000/api/add_customer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: name, phone: phone, company_id: companyId }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        setName("");
        setPhone("");
        fetchCustomers();
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">SmartERP - Customers</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      <p className="text-gray-500 mb-2">
        Company: {companyName}{" "}
        <a href="/companies" className="text-blue-600 underline">(Switch)</a>
      </p>

      <div className="flex gap-4 mb-4">
        <a href="/" className="text-blue-600 underline">Customers</a>
        <a href="/suppliers" className="text-blue-600 underline">Suppliers</a>
        <a href="/items" className="text-blue-600 underline">Items</a>
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
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Customer
        </button>
      </form>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Phone</th>
            <th className="border border-gray-300 p-2">Balance</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td className="border border-gray-300 p-2">{c.name}</td>
              <td className="border border-gray-300 p-2">{c.phone}</td>
              <td className="border border-gray-300 p-2">₹{c.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}