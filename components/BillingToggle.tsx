"use client";

import { useState } from "react";

interface BillingToggleProps {
  onToggle: (billing: "monthly" | "annual") => void;
}

export default function BillingToggle({ onToggle }: BillingToggleProps) {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  function handleChange(value: "monthly" | "annual") {
    setBilling(value);
    onToggle(value);
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={() => handleChange("monthly")}
        className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
          billing === "monthly"
            ? "bg-pine-800 text-white shadow-sm"
            : "text-stone-600 hover:bg-stone-100"
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => handleChange("annual")}
        className={`relative rounded-full px-5 py-2 text-sm font-semibold transition ${
          billing === "annual"
            ? "bg-pine-800 text-white shadow-sm"
            : "text-stone-600 hover:bg-stone-100"
        }`}
      >
        Annual
        <span className="absolute -right-2 -top-2 rounded-full bg-ember-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
          SAVE 2MO
        </span>
      </button>
    </div>
  );
}
