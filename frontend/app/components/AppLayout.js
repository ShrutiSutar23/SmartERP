"use client";

import API_URL from "../config";
import KeyboardShortcuts from "./KeyboardShortcuts";
import ShortcutPanel from "./ShortcutPanel";

export default function AppLayout({ children, currentPage }) {
  return (
    <div className="flex min-h-screen">
      <KeyboardShortcuts />
      <div className="flex-1 mr-44">
        {children}
      </div>
      <ShortcutPanel currentPage={currentPage} />
    </div>
  );
}