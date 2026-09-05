import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why the Poconos STR Directory exists: a vetted local marketplace connecting short-term rental hosts with trusted Poconos service providers.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-stone-500">
        <Link href="/" className="hover:text-pine-700">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-800">About</span>
      </nav>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
        The Poconos&apos; STR service directory
      </h1>

      <div className="prose-sm mt-6 space-y-5 leading-8 text-stone-700">
        <p>
          There are 5,000–8,000 short-term rentals across Monroe, Pike, Carbon,
          and Wayne counties. Every one of them needs a rotating bench of
          trusted pros — cleaners, handymen, HVAC techs, plumbers, plow crews,
          linen suppliers, and photographers.
        </p>
        <p>
          Today, hosts find those people the hard way: chaotic Facebook groups,
          paid lead-generation sites built for residential homeowners, and
          word-of-mouth that disappears when the person you relied on retires
          or moves away.
        </p>
        <p>
          The Poconos STR Directory fixes that. One local, searchable,
          review-backed directory built specifically for short-term rental
          operations — where every provider understands turnovers, guest
          deadlines, and what it takes to keep a 5-star listing running.
        </p>
      </div>

      <h2 className="mt-12 text-2xl font-bold tracking-tight text-stone-900">What we verify</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          "Insurance & licensing status",
          "STR-specific experience",
          "Response-time performance",
          "Host reviews after real work",
          "Service area accuracy",
          "Seasonal availability",
        ].map((item) => (
          <div key={item} className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700">
            <span className="text-pine-600">✓</span> {item}
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-bold tracking-tight text-stone-900">For providers</h2>
      <p className="mt-3 leading-8 text-stone-700">
        If you serve Poconos vacation rentals, your listing is free. Upgrade for
        placement, verified badges, and lead alerts when local hosts search for
        exactly what you do. One recurring client typically pays for a year of
        Premium.
      </p>
      <Link
        href="/pricing"
        className="mt-4 inline-flex items-center justify-center rounded-full bg-pine-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-pine-900"
      >
        See Listing Options
      </Link>

      <h2 className="mt-12 text-2xl font-bold tracking-tight text-stone-900">Contact</h2>
      <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-6">
        <p className="text-sm leading-7 text-stone-700">
          <strong className="text-stone-900">General:</strong>{" "}
          <a href="mailto:contact@poconosstr.com" className="text-pine-700 hover:underline">
            contact@poconosstr.com
          </a>
        </p>
        <p className="mt-2 text-sm leading-7 text-stone-700">
          <strong className="text-stone-900">Support:</strong>{" "}
          <a href="mailto:support@poconosstr.com" className="text-pine-700 hover:underline">
            support@poconosstr.com
          </a>
        </p>
        <p className="mt-2 text-sm leading-7 text-stone-700">
          <strong className="text-stone-900">Billing:</strong>{" "}
          <a href="mailto:billing@poconosstr.com" className="text-pine-700 hover:underline">
            billing@poconosstr.com
          </a>
        </p>
        <p className="mt-2 text-sm leading-7 text-stone-700">
          <strong className="text-stone-900">Partnerships &amp; sponsorships:</strong>{" "}
          <a href="mailto:partner@poconosstr.com" className="text-pine-700 hover:underline">
            partner@poconosstr.com
          </a>
        </p>
        <p className="mt-4 border-t border-stone-100 pt-4 text-sm leading-7 text-stone-700">
          Or use our{" "}
          <Link href="/contact" className="text-pine-700 hover:underline">contact form</Link>{" "}
          and we&apos;ll get back to you.
        </p>
      </div>
    </div>
  );
}
