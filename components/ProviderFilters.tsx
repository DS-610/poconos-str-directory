"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { CATEGORIES } from "@/lib/data";
import { COUNTIES } from "@/lib/data";

const TIERS = [
  { value: "featured", label: "Featured" },
  { value: "premium", label: "Premium" },
  { value: "standard", label: "Standard" },
  { value: "free", label: "Basic" },
];

export default function ProviderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.replace(`/providers?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const county = searchParams.get("county") ?? "";
  const tier = searchParams.get("tier") ?? "";
  const verified = searchParams.get("verified") === "1";

  const selectClass =
    "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 shadow-sm focus:border-pine-500 focus:outline-none focus:ring-2 focus:ring-pine-200";

  return (
    <div className="space-y-4">
      <input
        type="search"
        defaultValue={q}
        placeholder="Search providers, services, or towns…"
        onChange={(e) => update("q", e.target.value)}
        className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-pine-500 focus:outline-none focus:ring-2 focus:ring-pine-200"
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <select
          value={category}
          onChange={(e) => update("category", e.target.value)}
          className={selectClass}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>

        <select
          value={county}
          onChange={(e) => update("county", e.target.value)}
          className={selectClass}
          aria-label="Filter by county"
        >
          <option value="">All counties</option>
          {COUNTIES.map((c) => (
            <option key={c} value={c}>
              {c} County
            </option>
          ))}
        </select>

        <select
          value={tier}
          onChange={(e) => update("tier", e.target.value)}
          className={selectClass}
          aria-label="Filter by listing tier"
        >
          <option value="">Any listing tier</option>
          {TIERS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm">
          <input
            type="checkbox"
            checked={verified}
            onChange={(e) => update("verified", e.target.checked ? "1" : "")}
            className="h-4 w-4 rounded border-stone-300 accent-pine-700"
          />
          Verified STR Pros only
        </label>
      </div>
    </div>
  );
}
