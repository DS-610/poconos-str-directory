import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Partner With Us",
  description: "Partner with Poconos STR Directory — referral program for travel agents, property managers, and local businesses.",
};

export default function PartnersPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-stone-500">
        <Link href="/" className="hover:text-pine-700">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-800">Partners</span>
      </nav>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
        Partner with Poconos STR Directory
      </h1>
      <p className="mt-3 max-w-xl text-stone-600">
        We connect short-term rental hosts with trusted local service providers.
        If you work with Poconos vacation rental owners, we want to work with you.
      </p>

      {/* Who this is for */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {[
          {
            icon: "🏡",
            title: "Property Managers",
            body: "Manage multiple rentals? Give your owners a vetted bench of providers. Bulk access, priority matching, and one dashboard for all your properties.",
          },
          {
            icon: "✈️",
            title: "Travel Agents & Booking Agencies",
            body: "Include our provider directory in your Poconos travel packages. Your clients get reliable local services, you get a referral bonus.",
          },
          {
            icon: "🔑",
            title: "Real Estate Agents",
            body: "Help your investor clients find service providers before they even close. A turnkey provider list adds value to every STR purchase.",
          },
          {
            icon: "🤝",
            title: "Local Businesses",
            body: "Cross-promote with us. We send hosts your way, you send clients ours. Partnership, not competition.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-2xl">{item.icon}</p>
            <h3 className="mt-2 text-lg font-semibold text-stone-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">{item.body}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="mt-14">
        <h2 className="text-2xl font-bold tracking-tight text-stone-900">How the referral program works</h2>
        <div className="mt-6 space-y-4">
          {[
            {
              step: "1",
              title: "Get your unique referral link",
              body: "We create a custom link for you (e.g. poconosstr.com/r/yourname). Every host that signs up through your link is tracked to you.",
            },
            {
              step: "2",
              title: "Share it with your clients",
              body: "Include the link in your Poconos welcome packets, email signatures, booking confirmations, or property guides.",
            },
            {
              step: "3",
              title: "Earn recurring revenue",
              body: "Earn $10 for every free host sign-up and 20% recurring commission on any paid host plan (Pro Host or Property Manager) for the life of their subscription.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pine-800 text-sm font-bold text-white">
                {item.step}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-stone-900">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-stone-600">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Partner tiers */}
      <div className="mt-14">
        <h2 className="text-2xl font-bold tracking-tight text-stone-900">Partner tiers</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-900">Referral Partner</h3>
            <p className="mt-1 text-sm text-stone-500">Free to join</p>
            <ul className="mt-4 space-y-2">
              <li className="flex gap-2 text-sm text-stone-600"><span className="text-pine-600">&#10003;</span> Unique referral link</li>
              <li className="flex gap-2 text-sm text-stone-600"><span className="text-pine-600">&#10003;</span> $10 per host sign-up</li>
              <li className="flex gap-2 text-sm text-stone-600"><span className="text-pine-600">&#10003;</span> 20% recurring on paid plans</li>
              <li className="flex gap-2 text-sm text-stone-600"><span className="text-pine-600">&#10003;</span> Monthly payout via Stripe</li>
            </ul>
          </div>
          <div className="relative rounded-2xl border border-pine-600 bg-white p-6 shadow-sm ring-2 ring-pine-600/20">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-pine-800 px-3 py-1 text-xs font-semibold text-white">
              Best value
            </span>
            <h3 className="text-lg font-semibold text-stone-900">Strategic Partner</h3>
            <p className="mt-1 text-sm text-stone-500">For PM companies managing 5+ properties</p>
            <ul className="mt-4 space-y-2">
              <li className="flex gap-2 text-sm text-stone-600"><span className="text-pine-600">&#10003;</span> Everything in Referral Partner</li>
              <li className="flex gap-2 text-sm text-stone-600"><span className="text-pine-600">&#10003;</span> Free Property Manager plan ($49/mo value)</li>
              <li className="flex gap-2 text-sm text-stone-600"><span className="text-pine-600">&#10003;</span> Co-branded provider lists for your properties</li>
              <li className="flex gap-2 text-sm text-stone-600"><span className="text-pine-600">&#10003;</span> Priority support &amp; custom matching</li>
              <li className="flex gap-2 text-sm text-stone-600"><span className="text-pine-600">&#10003;</span> Featured partner badge on directory</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-14 rounded-2xl bg-pine-900 p-8 text-center">
        <h2 className="text-2xl font-bold text-white">Ready to partner?</h2>
        <p className="mt-2 text-pine-200">
          Email us at{" "}
          <a href="mailto:partner@poconosstr.com" className="text-ember-400 underline">
            partner@poconosstr.com
          </a>{" "}
          with your name, company, and how many properties you manage. We&apos;ll set up your referral link within 24 hours.
        </p>
        <a
          href="mailto:partner@poconosstr.com?subject=Partnership%20Inquiry"
          className="mt-5 inline-flex rounded-full bg-ember-500 px-6 py-3 text-sm font-semibold text-pine-950 shadow-md transition hover:bg-ember-400"
        >
          Email partner@poconosstr.com
        </a>
      </div>
    </div>
  );
}
