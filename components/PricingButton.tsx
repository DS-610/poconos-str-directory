"use client";

import { useState } from "react";

interface PricingButtonProps {
  tier: string;
  label: string;
  variant?: "primary" | "secondary";
}

export default function PricingButton({ tier, label, variant = "secondary" }: PricingButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
        variant === "primary"
          ? "bg-pine-800 text-white hover:bg-pine-900"
          : "border border-pine-700 text-pine-800 hover:bg-pine-50"
      }`}
    >
      {loading ? "Redirecting..." : label}
    </button>
  );
}
