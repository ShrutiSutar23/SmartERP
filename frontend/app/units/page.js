"use client";

import API_URL from "../config";
import AppLayout from "../components/AppLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Units() {
  const [companyName, setCompanyName] = useState("");
  const [units, setUnits] = useState([]);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [unitType, setUnitType] = useState("Simple");
  const router = useRouter();

  const fetchUnits = () => {
    const token = localStorage.getItem("token");
    const cid = localStorage.getItem("selectedCompanyId");
    if (!token) { router.push("/login"); return; }
    if (!cid) { router.push("/companies"); return; }

    fetch("API_URL/api/units?company_id=" + cid, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setUnits(data); });
  };

  useEffect(() => {
    setCompanyName(localStorage.getItem("selectedCompanyName") || "");
    fetchUnits();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const cid = localStorage.getItem("selectedCompanyId");

    fetch("API_URL/api/add_unit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        name: name,
        symbol: symbol,
        unit_type: unitType,
        company_id: cid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setName("");
        setSymbol("");
        fetchUnits();
      });
  };

  const defaultUnits = [
    { name: "Pieces", symbol: "PCS", type: "Simple" },
    { name: "Kilograms", symbol: "KG", type: "Simple" },
    { name: "Grams", symbol: "Gm", type: "Simple" },
    { name: "Litres", symbol: "Ltr", type: "Simple" },
    { name: "Box", symbol: "BOX", type: "Simple" },
    { name: "Pairs", symbol: "Pairs", type: "Simple" },
    { name: "Metres", symbol: "Mtr", type: "Simple" },
  ];

  const addDefaultUnit = (u) => {
    const token = localStorage.getItem("token");
    const cid = localStorage.getItem("selectedCompanyId");

    fetch("API_URL/api/add_unit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        name: u.name,
        symbol: u.symbol,
        unit_type: u.type,
        company_id: cid,
      }),
    })
      .then((res) => res.json())
      .then(() => fetchUnits());
  };

  return (
    <AppLayout currentPage="units">
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Units of Measure (Alt+U)</h1>
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

        <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-4">
          <h2 className="font-bold text-blue-800 mb-3">Quick Add Default Units</h2>
          <div className="flex gap-2 flex-wrap">
            {defaultUnits.map((u) => (
              <button
                key={u.symbol}
                onClick={() => addDefaultUnit(u)}
                className="bg-white border border-blue-300 px-3 py-1 rounded text-sm hover:bg-blue-100"
              >
                {u.symbol} ({u.name})
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 border p-4 rounded mb-6">
          <h2 className="font-bold mb-3">Create Custom Unit</h2>
          <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap items-end">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Unit Name</label>
              <input
                type="text"
                placeholder="e.g. Dozen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Symbol</label>
              <input
                type="text"
                placeholder="e.g. Doz"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="border border-gray-300 p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Type</label>
              <select
                value={unitType}
                onChange={(e) => setUnitType(e.target.value)}
                className="border border-gray-300 p-2 rounded"
              >
                <option value="Simple">Simple</option>
                <option value="Compound">Compound</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-700 text-white px-4 py-2 rounded"
            >
              Create Unit
            </button>
          </form>
        </div>

        <h2 className="font-bold mb-2">Created Units</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="border border-gray-300 p-2 text-left">Unit Name</th>
              <th className="border border-gray-300 p-2">Symbol</th>
              <th className="border border-gray-300 p-2">Type</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{u.name}</td>
                <td className="border border-gray-300 p-2 text-center font-mono font-bold">{u.symbol}</td>
                <td className="border border-gray-300 p-2 text-center">
                  <span className="bg-green-100 text-green-700 px-2 rounded text-xs">{u.unit_type}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}