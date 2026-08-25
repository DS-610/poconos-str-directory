import type { Category, ProviderTier } from "./types";

export const CATEGORY_LABELS: Record<Category, string> = {
  cleaning: "Turnover Cleaning",
  maintenance: "Maintenance & Handyman",
  hvac: "HVAC",
  plumbing: "Plumbing",
  electrical: "Electrical",
  landscaping: "Landscaping",
  "snow-removal": "Snow Removal",
  linens: "Linen Supply",
  photography: "Photography & Staging",
  suppliers: "Furniture & Supplies",
};

export const TIER_LABELS: Record<ProviderTier, string> = {
  free: "Basic Listing",
  standard: "Standard",
  premium: "Premium",
  featured: "Featured",
};

export const TIER_STYLES: Record<ProviderTier, string> = {
  free: "bg-stone-100 text-stone-600 ring-stone-200",
  standard: "bg-sky-50 text-sky-700 ring-sky-200",
  premium: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  featured: "bg-amber-50 text-amber-800 ring-amber-300",
};

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) return phone;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}
