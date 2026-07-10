"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement.tagName.toLowerCase();
      const isTyping = tag === "input" || tag === "textarea" || tag === "select";

      const ourFKeys = ["F6", "F7", "F8", "F9", "F10"];
      if (ourFKeys.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (isTyping && !e.key.startsWith("F") && e.key !== "Escape") return;

      switch (e.key) {
        case "F8":
          router.push("/sales");
          break;

        case "F9":
          router.push("/purchases");
          break;

        case "F10":
          router.push("/vouchers");
          break;

        case "Escape":
          if (!isTyping) {
            e.preventDefault();
            router.push("/");
          }
          break;

        default:
          break;
      }

      if (e.ctrlKey && e.shiftKey) {
        switch (e.key.toUpperCase()) {
          case "D":
            e.preventDefault();
            router.push("/");
            break;

          case "C":
            e.preventDefault();
            router.push("/companies");
            break;

          case "S":
            e.preventDefault();
            router.push("/sales");
            break;

          case "P":
            e.preventDefault();
            router.push("/purchases");
            break;

          case "I":
            e.preventDefault();
            router.push("/items");
            break;

          case "U":
            e.preventDefault();
            router.push("/suppliers");
            break;

          case "R":
            e.preventDefault();
            router.push("/reports");
            break;

          case "B":
            e.preventDefault();
            router.push("/payment");
            break;

          case "E":
            e.preventDefault();
            router.push("/receipt");
            break;

          case "J":
            e.preventDefault();
            router.push("/journal");
            break;

          case "N":
            e.preventDefault();
            router.push("/contra");
            break;

          case "T":
            e.preventDefault();
            router.push("/stock-summary");
            break;

          case "L":
            e.preventDefault();
            router.push("/ledgers");
            break;

          case "Q":
            e.preventDefault();
            localStorage.removeItem("token");
            localStorage.removeItem("selectedCompanyId");
            localStorage.removeItem("selectedCompanyName");
            router.push("/login");
            break;

          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [router]);

  return null;
}