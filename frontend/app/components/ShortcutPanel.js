"use client";

export default function ShortcutPanel({ currentPage }) {
  const shortcuts = [
    { key: "Fn+F8", label: "Sales", active: currentPage === "sales" },
    { key: "Fn+F9", label: "Purchase", active: currentPage === "purchases" },
    { key: "Fn+F10", label: "All Vouchers", active: currentPage === "vouchers" },
    { key: "Ctrl+B", label: "Payment", active: currentPage === "payment" },
    { key: "Ctrl+E", label: "Receipt", active: currentPage === "receipt" },
    { key: "Ctrl+J", label: "Journal", active: currentPage === "journal" },
    { key: "Ctrl+N", label: "Contra", active: currentPage === "contra" },
 ];

  const globalShortcuts = [
    { key: "Ctrl+H", label: "Dashboard" },
    { key: "Ctrl+Q", label: "Logout" },
    { key: "Ctrl+I", label: "Inventory" },
    { key: "Ctrl+R", label: "Reports" },
    { key: "ESC", label: "Go Back" },
  ];

  const notes = [
    "Use Fn+F8, Fn+F9 etc.",
    "F6/F7 blocked by Chrome",
    "F1/F5/F11/F12 blocked",
  ];

  return (
    <div className="fixed right-0 top-0 h-full w-44 bg-gray-100 border-l border-gray-300 flex flex-col z-50">
      <div className="bg-gray-700 text-white text-xs p-2 font-bold text-center">
        SHORTCUTS
      </div>

      <div className="flex-1 overflow-y-auto">
        {shortcuts.map((s) => (
          <div
            key={s.key}
            className={`flex items-center border-b border-gray-300 px-2 py-1 ${
              s.active ? "bg-blue-600 text-white" : "hover:bg-gray-200"
            }`}
          >
            <span className={`text-xs font-bold w-16 ${
              s.active ? "text-white" : "text-blue-700"
            }`}>
              {s.key}
            </span>
            <span className="text-xs ml-1">{s.label}</span>
          </div>
        ))}

        <div className="bg-gray-300 text-gray-600 text-xs p-1 font-bold mt-2 text-center">
          GLOBAL
        </div>

        {globalShortcuts.map((s) => (
          <div
            key={s.key}
            className="flex items-center border-b border-gray-300 px-2 py-1 hover:bg-gray-200"
          >
            <span className="text-xs font-bold w-14 text-green-700">{s.key}</span>
            <span className="text-xs ml-1">{s.label}</span>
          </div>
        ))}

        <div className="bg-yellow-50 border-t border-yellow-300 p-2 mt-2">
          <p className="text-xs font-bold text-yellow-700 mb-1">Note:</p>
          {notes.map((n, i) => (
            <p key={i} className="text-xs text-yellow-600">{n}</p>
          ))}
        </div>
      </div>

      <div className="bg-gray-700 text-white text-xs p-2 text-center">
        SmartERP
      </div>
    </div>
  );
}