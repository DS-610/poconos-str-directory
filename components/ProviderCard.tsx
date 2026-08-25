import Link from "next/link";
import type { Provider } from "@/lib/types";
import { CATEGORY_LABELS, TIER_LABELS, TIER_STYLES, formatPhone, formatRating } from "@/lib/utils";

export default function ProviderCard({ provider }: { provider: Provider }) {
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

      <p className="mt-2 flex-1 text-sm leading-6 text-stone-600">{provider.tagline}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {provider.services.slice(0, 3).map((s) => (
          <span
            key={s}
            className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600"
          >
            {s}
          </span>
        ))}
        {provider.services.length > 3 && (
          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-500">
            +{provider.services.length - 3} more
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 text-sm">
        <span className="flex items-center gap-1.5">
          <span className="text-amber-500">★</span>
          <span className="font-semibold text-stone-900">{formatRating(provider.rating)}</span>
          <span className="text-stone-400">({provider.reviewCount})</span>
        </span>
        <span className="flex items-center gap-1.5 text-stone-500">
          {provider.verified && (
            <span className="inline-flex items-center gap-1 text-pine-700">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
                  clipRule="evenodd"
                />
              </svg>
              Verified
            </span>
          )}
          {formatPhone(provider.phone)}
        </span>
      </div>
    </Link>
  );
}
