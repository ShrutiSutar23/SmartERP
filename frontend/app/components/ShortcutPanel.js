"use client";

import { useRouter } from "next/navigation";

export default function ShortcutPanel({ currentPage }) {
  const router = useRouter();

  const shortcuts = [
    { key: "Fn+F8", label: "Sales", path: "/sales", active: currentPage === "sales" },
    { key: "Fn+F9", label: "Purchase", path: "/purchases", active: currentPage === "purchases" },
    { key: "Fn+F10", label: "All Vouchers", path: "/vouchers", active: currentPage === "vouchers" },
    { key: "Ctrl+⇧+B", label: "Payment", path: "/payment", active: currentPage === "payment" },
    { key: "Ctrl+⇧+E", label: "Receipt", path: "/receipt", active: currentPage === "receipt" },
    { key: "Ctrl+⇧+J", label: "Journal", path: "/journal", active: currentPage === "journal" },
    { key: "Ctrl+⇧+N", label: "Contra", path: "/contra", active: currentPage === "contra" },
  ];

  const globalShortcuts = [
    { key: "Ctrl+⇧+D", label: "Dashboard", path: "/" },
    { key: "Ctrl+⇧+C", label: "Companies", path: "/companies" },
    { key: "Ctrl+⇧+S", label: "Sales", path: "/sales" },
    { key: "Ctrl+⇧+P", label: "Purchase", path: "/purchases" },
    { key: "Ctrl+⇧+I", label: "Items", path: "/items" },
    { key: "Ctrl+⇧+U", label: "Suppliers", path: "/suppliers" },
    { key: "Ctrl+⇧+R", label: "Reports", path: "/reports" },
    { key: "Ctrl+⇧+L", label: "Ledgers", path: "/ledgers" },
    { key: "Ctrl+⇧+T", label: "Stock Summary", path: "/stock-summary" },
    { key: "Ctrl+⇧+Q", label: "Logout", path: "/login" },
    { key: "ESC", label: "Gateway", path: "/" },
  ];

  const handleClick = (path, isLogout) => {
    if (isLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("selectedCompanyId");
      localStorage.removeItem("selectedCompanyName");
    }
    router.push(path);
  };

  return (
    <div className="fixed right-0 top-0 h-full w-48 bg-gray-100 border-l border-gray-300 flex flex-col z-50">
      <div className="bg-gray-700 text-white text-xs p-2 font-bold text-center">
        SHORTCUTS
      </div>

      <div className="flex-1 overflow-y-auto">
        {shortcuts.map((s) => (
          <div
            key={s.key}
            onClick={() => handleClick(s.path, false)}
            className={"flex items-center border-b border-gray-300 px-2 py-1 cursor-pointer " +
              (s.active ? "bg-blue-600 text-white" : "hover:bg-blue-100")}
          >
            <span className={"text-xs font-bold w-20 " +
              (s.active ? "text-white" : "text-blue-700")}>
              {s.key}
            </span>
            <span className="text-xs ml-1">{s.label}</span>
          </div>
        ))}

        <div className="bg-gray-300 text-gray-600 text-xs p-1 font-bold mt-1 text-center">
          GLOBAL
        </div>

        {globalShortcuts.map((s) => (
          <div
            key={s.key}
            onClick={() => handleClick(s.path, s.label === "Logout")}
            className="flex items-center border-b border-gray-300 px-2 py-1 cursor-pointer hover:bg-green-100"
          >
            <span className="text-xs font-bold w-20 text-green-700">{s.key}</span>
            <span className="text-xs ml-1">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-gray-700 text-white text-xs p-2 text-center">
        SmartERP
      </div>
    </div>
  );
}