"use client";

import AppLayout from "./components/AppLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [customers, setCustomers] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const router = useRouter();

  const getAuth = () => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("selectedCompanyId");
    return { token, companyId };
  };

  const fetchDashboard = () => {
    const { token, companyId } = getAuth();
    if (!token) { router.push("/login"); return; }
    if (!companyId) { router.push("/companies"); return; }

    fetch("http://127.0.0.1:5000/api/dashboard?company_id=" + companyId, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.total_sales !== undefined) {
          setDashboard(data);
        }
      });
  };

  const fetchCustomers = () => {
    const { token, companyId } = getAuth();

    fetch("http://127.0.0.1:5000/api/customers?company_id=" + companyId, {
      headers: { Authorization: "Bearer " + token },
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
    fetchDashboard();
    fetchCustomers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { token, companyId } = getAuth();

    fetch("http://127.0.0.1:5000/api/add_customer", {
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
        fetchCustomers();
        fetchDashboard();
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <AppLayout currentPage="dashboard">
      <div className="p-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">SmartERP Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>

        <p className="text-gray-500 mb-4">
          Company: {companyName}{" "}
          <a href="/companies" className="text-blue-600 underline">(Switch)</a>
        </p>

        <div className="flex gap-4 mb-6 flex-wrap">
          <a href="/" className="text-blue-600 underline">Customers</a>
          <a href="/suppliers" className="text-blue-600 underline">Suppliers</a>
          <a href="/items" className="text-blue-600 underline">Items</a>
          <a href="/sales" className="text-blue-600 underline">Sales Voucher</a>
          <a href="/purchases" className="text-blue-600 underline">Purchase Voucher</a>
          <a href="/vouchers" className="text-blue-600 underline">Other Vouchers</a>
          <a href="/reports" className="text-blue-600 underline">Reports</a>
        </div>

        {dashboard && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3">Business Summary</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-green-100 p-4 rounded">
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold">Rs.{dashboard.total_sales.toFixed(2)}</p>
              </div>
              <div className="bg-red-100 p-4 rounded">
                <p className="text-sm text-gray-600">Total Purchases</p>
                <p className="text-2xl font-bold">Rs.{dashboard.total_purchases.toFixed(2)}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded">
                <p className="text-sm text-gray-600">Outstanding (Receivable)</p>
                <p className="text-2xl font-bold">Rs.{dashboard.outstanding_balance.toFixed(2)}</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded">
                <p className="text-sm text-gray-600">Total Payable</p>
                <p className="text-2xl font-bold">Rs.{dashboard.total_payable.toFixed(2)}</p>
              </div>
              <div className="bg-purple-100 p-4 rounded">
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold">{dashboard.total_customers}</p>
              </div>
              <div className="bg-orange-100 p-4 rounded">
                <p className="text-sm text-gray-600">Total Suppliers</p>
                <p className="text-2xl font-bold">{dashboard.total_suppliers}</p>
              </div>
            </div>

            {dashboard.low_stock_items.length > 0 && (
              <div className="bg-red-50 border border-red-300 p-4 rounded">
                <h3 className="font-bold text-red-600 mb-2">
                  Low Stock Alert ({dashboard.low_stock_items.length} items)
                </h3>
                <ul>
                  {dashboard.low_stock_items.map((item, index) => (
                    <li key={index} className="text-sm text-red-700">
                      {item.name} — only {item.quantity} units left
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <h2 className="text-xl font-bold mb-3">Customers</h2>

        <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
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
                <td className="border border-gray-300 p-2">Rs.{c.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}