import type { Metadata } from "next";
import Link from "next/link";
import ProviderCard from "@/components/ProviderCard";
import ProviderFilters from "@/components/ProviderFilters";
import { getAllProviders } from "@/lib/repository";
import type { Provider } from "@/lib/types";

export const metadata: Metadata = {
  title: "Browse Providers",
  description:
    "Search the Poconos STR Directory for vetted cleaning crews, handymen, HVAC techs, plumbers, electricians, landscapers, snow removal, linens, and photographers.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function asString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function matches(provider: Provider, q: string, category: string, county: string, tier: string, verifiedOnly: boolean): boolean {
  if (category && provider.category !== category) return false;
  if (county && !provider.counties.includes(county as Provider["counties"][number])) return false;
  if (tier && provider.tier !== tier) return false;
  if (verifiedOnly && !provider.verified) return false;
  if (q) {
    const haystack = [
      provider.name,
      provider.tagline,
      provider.description,
      provider.category,
      ...provider.counties,
      ...provider.serviceAreas,
      ...provider.services,
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(q.toLowerCase())) return false;
  }
  return true;
}

export default async function ProvidersPage({ searchParams }: { searchParams: SearchParams }) {
  const [params, allProviders] = await Promise.all([searchParams, getAllProviders()]);
  const q = asString(params.q).trim();
  const category = asString(params.category);
  const county = asString(params.county);
  const tier = asString(params.tier);
  const verifiedOnly = asString(params.verified) === "1";

  const filtered = allProviders.filter((p) => matches(p, q, category, county, tier, verifiedOnly));
  const sorted = [...filtered].sort((a, b) => b.rating - a.rating);
  const hasFilters = Boolean(q || category || county || tier || verifiedOnly);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-stone-500">
        <Link href="/" className="hover:text-pine-700">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-800">Providers</span>
      </nav>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
        Browse providers
      </h1>
      <p className="mt-2 max-w-2xl text-stone-600">
        {allProviders.length} service providers vetted for short-term rental work
        across the Poconos. Filter by category, county, or listing tier.
      </p>

      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        <ProviderFilters />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-stone-600">
          {sorted.length} {sorted.length === 1 ? "provider" : "providers"}
          {hasFilters && " found"}
        </p>
        {hasFilters && (
          <Link href="/providers" className="text-sm font-semibold text-pine-700 hover:text-pine-900">
            Clear filters
          </Link>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <p className="text-2xl">🔍</p>
          <h2 className="mt-3 text-lg font-semibold text-stone-900">No providers match</h2>
          <p className="mt-1 text-sm text-stone-600">
            Try a different search or clear your filters. New providers are added weekly.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((provider) => (
            <ProviderCard key={provider.slug} provider={provider} />
          ))}
        </div>
      )}
    </div>
  );
}
