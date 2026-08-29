import Link from "next/link";
import type { Provider } from "@/lib/types";
import { CATEGORY_LABELS, TIER_LABELS, TIER_STYLES, formatPhone, formatRating } from "@/lib/utils";

export default function ProviderCard({ provider }: { provider: Provider }) {
  const displayTagline = provider.pricingNotes || provider.tagline;
  const displayPrice = provider.pricingNotes || provider.priceNote;

  return (
    <Link
      href={`/providers/${provider.slug}`}
      className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-pine-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-pine-600">
            {CATEGORY_LABELS[provider.category]}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-stone-900 group-hover:text-pine-800">
            {provider.name}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${TIER_STYLES[provider.tier]}`}
        >
          {TIER_LABELS[provider.tier]}
        </span>
      </div>

      <p className="mt-2 flex-1 text-sm leading-6 text-stone-600">{displayTagline}</p>

      {provider.featuredResorts && provider.featuredResorts.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {provider.featuredResorts.map((resort) => (
            <span key={resort} className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
              {resort}
            </span>
          ))}
        </div>
      )}

      {displayPrice && (
        <p className="mt-2 text-sm font-semibold text-stone-700">{displayPrice}</p>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 text-sm">
        <span className="flex items-center gap-1.5">
          <span className="text-amber-500">&#9733;</span>
          <span className="font-semibold text-stone-900">{formatRating(provider.rating)}</span>
          <span className="text-stone-400">({provider.reviewCount})</span>
        </span>
        <span className="flex items-center gap-1.5 text-stone-500">
          {provider.verified && (
            <span className="inline-flex items-center gap-1 text-pine-700">
              &#10003; Verified
            </span>
          )}
          {formatPhone(provider.phone)}
        </span>
      </div>
    </Link>
  );
}
