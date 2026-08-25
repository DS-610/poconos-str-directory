import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROVIDERS, getProviderBySlug } from "@/lib/data";
import { CATEGORY_LABELS, TIER_LABELS, TIER_STYLES, formatPhone, formatRating } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return PROVIDERS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const provider = getProviderBySlug(slug);
  if (!provider) return { title: "Provider Not Found" };
  return {
    title: provider.name,
    description: `${provider.tagline} — ${CATEGORY_LABELS[provider.category]} in the Poconos.`,
  };
}

export default async function ProviderPage({ params }: { params: Params }) {
  const { slug } = await params;
  const provider = getProviderBySlug(slug);
  if (!provider) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-stone-500">
        <Link href="/" className="hover:text-pine-700">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/providers" className="hover:text-pine-700">Providers</Link>
        <span className="mx-2">/</span>
        <Link href={`/categories/${provider.category}`} className="hover:text-pine-700">
          {CATEGORY_LABELS[provider.category]}
        </Link>
      </nav>

      <div className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-pine-50 px-3 py-1 text-xs font-semibold text-pine-800">
                {CATEGORY_LABELS[provider.category]}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${TIER_STYLES[provider.tier]}`}>
                {TIER_LABELS[provider.tier]}
              </span>
              {provider.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                  ✓ Verified STR Pro
                </span>
              )}
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              {provider.name}
            </h1>
            <p className="mt-2 text-lg text-stone-600">{provider.tagline}</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-2xl bg-amber-50 px-4 py-3 ring-1 ring-amber-200">
            <span className="text-2xl text-amber-500">★</span>
            <div>
              <p className="text-xl font-bold text-stone-900">{formatRating(provider.rating)}</p>
              <p className="text-xs text-stone-500">{provider.reviewCount} host reviews</p>
            </div>
          </div>
        </div>

        <p className="mt-6 leading-8 text-stone-700">{provider.description}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-stone-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Response time</p>
            <p className="mt-1 font-semibold text-stone-900">{provider.responseTime}</p>
          </div>
          <div className="rounded-2xl bg-stone-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Coverage</p>
            <p className="mt-1 font-semibold text-stone-900">{provider.counties.join(" · ")} Counties</p>
          </div>
          <div className="rounded-2xl bg-stone-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Typical pricing</p>
            <p className="mt-1 font-semibold text-stone-900">{provider.priceNote ?? "Contact for quote"}</p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">Services</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {provider.services.map((s) => (
              <span key={s} className="rounded-full bg-pine-50 px-3 py-1.5 text-sm font-medium text-pine-800">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">Service areas</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {provider.serviceAreas.map((area) => (
              <span key={area} className="rounded-full bg-stone-100 px-3 py-1.5 text-sm text-stone-700">
                {area}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-stone-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-stone-900">
              {provider.name}
              <span className="ml-2 text-xs font-normal text-stone-500">
                {provider.licensed && "Licensed"} {provider.licensed && provider.insured && "· "}
                {provider.insured && "Insured"} · Est. {provider.yearFounded}
              </span>
            </p>
            <p className="mt-1 text-sm text-stone-600">{formatPhone(provider.phone)}</p>
            {provider.email && (
              <p className="text-sm text-stone-600">
                <a href={`mailto:${provider.email}`} className="text-pine-700 hover:underline">
                  {provider.email}
                </a>
              </p>
            )}
            {provider.website && (
              <p className="text-sm text-stone-600">
                <a href={`https://${provider.website}`} target="_blank" rel="noopener noreferrer" className="text-pine-700 hover:underline">
                  {provider.website}
                </a>
              </p>
            )}
          </div>
          <a
            href={provider.email ? `mailto:${provider.email}?subject=STR%20Service%20Request%20via%20Poconos%20STR%20Directory` : `tel:${provider.phone}`}
            className="inline-flex items-center justify-center rounded-full bg-pine-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-pine-900"
          >
            Request a Quote
          </a>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-stone-700">
        <strong className="text-amber-800">Hosts:</strong> Don&apos;t see what you need?{" "}
        <Link href="/providers" className="font-semibold text-pine-700 underline">
          Browse all {PROVIDERS.length} providers
        </Link>{" "}
        or{" "}
        <Link href="/about" className="font-semibold text-pine-700 underline">
          tell us what you&apos;re looking for
        </Link>
        .
      </div>
    </div>
  );
}
