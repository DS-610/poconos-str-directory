import type { Metadata } from "next";
import Link from "next/link";
import CategoryCard from "@/components/CategoryCard";
import { CATEGORIES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Every service category a Poconos short-term rental host needs: cleaning, maintenance, HVAC, plumbing, electrical, landscaping, snow removal, linens, photography, and supplies.",
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-stone-500">
        <Link href="/" className="hover:text-pine-700">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-800">Categories</span>
      </nav>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
        Service categories
      </h1>
      <p className="mt-2 max-w-2xl text-stone-600">
        Everything your rentals need to run — from turnover cleaning to
        snow-plow contracts. Browse by category to find the right local provider.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </div>
  );
}
