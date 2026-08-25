import type { Metadata } from "next";
import Link from "next/link";
import PricingButton from "@/components/PricingButton";

export const metadata: Metadata = {
  title: "Pricing & Listings",
  description:
    "Provider listing tiers and owner access plans for the Poconos STR Directory. Free listings for providers, free browsing for hosts.",
};

const PROVIDER_PLANS = [
  {
    tier: "",
    name: "Basic",
    price: "Free",
    cadence: "forever",
    features: [
      "Name, category & phone listing",
      "One county coverage",
      "Claim your profile in minutes",
    ],
    cta: "Claim Free Listing",
    featured: false,
  },
  {
    tier: "standard",
    name: "Standard",
    price: "$75",
    cadence: "/month",
    features: [
      "Everything in Basic",
      "Photo, description & reviews",
      "Contact form & service areas",
      "Priority search placement",
    ],
    cta: "Upgrade to Standard",
    featured: true,
  },
  {
    tier: "premium",
    name: "Premium",
    price: "$150",
    cadence: "/month",
    features: [
      "Everything in Standard",
      "Verified STR Pro badge",
      "Lead alerts when hosts request quotes",
      "Featured in category pages",
    ],
    cta: "Go Premium",
    featured: false,
  },
  {
    tier: "featured",
    name: "Featured",
    price: "$250",
    cadence: "/month",
    features: [
      "Everything in Premium",
      "Homepage rotation & Top Pick badge",
      "Guaranteed weekly lead delivery",
      "Sponsored placement in your county",
    ],
    cta: "Get Featured",
    featured: false,
  },
];

const OWNER_PLANS = [
  {
    tier: "",
    name: "Free Host",
    price: "$0",
    cadence: "forever",
    features: [
      "Browse limited provider info",
      "3 searches per month",
      "See top-rated providers",
    ],
    cta: "Start Browsing",
    featured: false,
  },
  {
    tier: "pro_host",
    name: "Pro Host",
    price: "$15",
    cadence: "/month",
    features: [
      "Full provider directory access",
      "Save favorite providers",
      "Request quotes from any provider",
      "Verified badge filters",
    ],
    cta: "Go Pro Host",
    featured: true,
  },
  {
    tier: "property_manager",
    name: "Property Manager",
    price: "$49",
    cadence: "/month",
    features: [
      "Unlimited access for your team",
      "Bulk provider matching",
      "Multi-property favorites",
      "Priority support",
    ],
    cta: "Get Manager Plan",
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-stone-500">
        <Link href="/" className="hover:text-pine-700">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-800">Pricing</span>
      </nav>

      <div className="mt-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Simple pricing that pays for itself
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-stone-600">
          Providers: one new recurring STR client covers a year of listings.
          Hosts: free to browse, upgrade when you need the full directory.
        </p>
      </div>

      <div className="mt-14">
        <h2 className="text-center text-xl font-bold text-stone-900">
          For service providers
        </h2>
        <p className="mt-1 text-center text-sm text-stone-500">
          Cleaning crews, handymen, HVAC, plumbers, landscapers, photographers & more
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROVIDER_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm ${
                plan.featured ? "border-pine-600 ring-2 ring-pine-600/20" : "border-stone-200"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-pine-800 px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-stone-900">{plan.name}</h3>
              <p className="mt-2">
                <span className="text-3xl font-bold text-stone-900">{plan.price}</span>
                <span className="text-sm text-stone-500"> {plan.cadence}</span>
              </p>
              <ul className="mt-4 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-stone-600">
                    <span className="text-pine-600">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
              {plan.tier ? (
                <PricingButton
                  tier={plan.tier}
                  label={plan.cta}
                  variant={plan.featured ? "primary" : "secondary"}
                />
              ) : (
                <a
                  href="mailto:providers@poconosstrdirectory.com?subject=Provider%20Listing%20Inquiry"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-pine-700 px-4 py-2.5 text-sm font-semibold text-pine-800 transition hover:bg-pine-50"
                >
                  {plan.cta}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-center text-xl font-bold text-stone-900">For hosts & property managers</h2>
        <p className="mt-1 text-center text-sm text-stone-500">
          Free to browse. Upgrade for full access and quote requests.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {OWNER_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm ${
                plan.featured ? "border-pine-600 ring-2 ring-pine-600/20" : "border-stone-200"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-pine-800 px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-stone-900">{plan.name}</h3>
              <p className="mt-2">
                <span className="text-3xl font-bold text-stone-900">{plan.price}</span>
                <span className="text-sm text-stone-500"> {plan.cadence}</span>
              </p>
              <ul className="mt-4 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-stone-600">
                    <span className="text-pine-600">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
              {plan.tier ? (
                <PricingButton
                  tier={plan.tier}
                  label={plan.cta}
                  variant={plan.featured ? "primary" : "secondary"}
                />
              ) : (
                <a
                  href="/providers"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                >
                  {plan.cta}
                </a>
              )}
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-stone-500">
          Payments via Stripe · Cancel anytime · First 30 days of Standard free for providers
        </p>
      </div>
    </div>
  );
}
