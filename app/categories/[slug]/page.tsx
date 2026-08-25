import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProviderCard from "@/components/ProviderCard";
import { CATEGORIES, getProvidersByCategory } from "@/lib/data";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  return {
    title: category ? `${category.label} Providers` : "Category Not Found",
    description: category?.description,
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  const providers = getProvidersByCategory(slug);
  const sorted = [...providers].sort((a, b) => b.rating - a.rating);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-stone-500">
        <Link href="/" className="hover:text-pine-700">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/categories" className="hover:text-pine-700">Categories</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-800">{category.label}</span>
      </nav>

      <div className="mt-6 flex items-start gap-5">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-pine-50 text-3xl">
          {category.icon}
        </span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            {category.label} providers
          </h1>
          <p className="mt-2 max-w-2xl text-stone-600">{category.description}</p>
          <p className="mt-2 text-sm font-medium text-pine-700">
            {providers.length} providers · Typical cost: {category.typicalCost}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((provider) => (
          <ProviderCard key={provider.slug} provider={provider} />
        ))}
      </div>
    </div>
  );
}
