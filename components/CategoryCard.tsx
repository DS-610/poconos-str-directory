import Link from "next/link";
import type { CategoryMeta } from "@/lib/types";
import { getProvidersByCategory } from "@/lib/data";

export default function CategoryCard({ category }: { category: CategoryMeta }) {
  const count = getProvidersByCategory(category.slug).length;
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-pine-300 hover:shadow-md"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pine-50 text-2xl">
        {category.icon}
      </div>
      <h3 className="mt-3 text-base font-semibold text-stone-900 group-hover:text-pine-800">
        {category.label}
      </h3>
      <p className="mt-1.5 flex-1 text-sm leading-6 text-stone-600">{category.description}</p>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="font-medium text-pine-700">{count} providers</span>
        <span className="text-stone-400 group-hover:text-pine-600">
          Browse →
        </span>
      </div>
    </Link>
  );
}
