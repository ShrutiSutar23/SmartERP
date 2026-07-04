"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e) => {
      console.log("Key detected:", e.key);

      const tag = document.activeElement.tagName.toLowerCase();
      const isTyping = tag === "input" || tag === "textarea" || tag === "select";

      const ourFKeys = ["F6", "F7", "F8", "F9", "F10"];
      if (ourFKeys.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (isTyping && !e.key.startsWith("F")) return;

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

      if (e.ctrlKey) {
        switch (e.key) {
          case "h":
          case "H":
            e.preventDefault();
            router.push("/");
            break;

          case "q":
          case "Q":
            e.preventDefault();
            localStorage.removeItem("token");
            localStorage.removeItem("selectedCompanyId");
            localStorage.removeItem("selectedCompanyName");
            router.push("/login");
            break;

          case "i":
          case "I":
            e.preventDefault();
            router.push("/items");
            break;

          case "r":
          case "R":
            e.preventDefault();
            router.push("/reports");
            break;

          case "b":
          case "B":
            e.preventDefault();
            router.push("/payment");
            break;

          case "e":
          case "E":
            e.preventDefault();
            router.push("/receipt");
            break;

          case "j":
          case "J":
            e.preventDefault();
            router.push("/journal");
            break;
          
          case "n":
          case "N":
            e.preventDefault();
            router.push("/contra");
            break;

          case "t":
          case "T":
            e.preventDefault();
            router.push("/stock-summary");
            break;

          case "l":
          case "L":
            e.preventDefault();
            router.push("/ledgers");
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