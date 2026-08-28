import Link from "next/link";
import CategoryCard from "@/components/CategoryCard";
import ProviderCard from "@/components/ProviderCard";
import { CATEGORIES } from "@/lib/data";
import { getAllProviders } from "@/lib/repository";

export default async function Home() {
  const allProviders = await getAllProviders();
  const featured = allProviders.filter((p) => p.tier === "featured");
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-pine-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #fff 0, transparent 40%), radial-gradient(circle at 80% 30%, #ffbe4a 0, transparent 35%), radial-gradient(circle at 50% 90%, #46845d 0, transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="inline-flex items-center gap-2 rounded-full border border-pine-400/40 bg-pine-900/60 px-3 py-1 text-xs font-medium text-pine-100">
            <span className="h-1.5 w-1.5 rounded-full bg-ember-400" />
            Serving Monroe · Pike · Carbon · Wayne counties
          </p>
          <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Find trusted service pros for your{" "}
            <span className="text-ember-400">Poconos vacation rental</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-pine-100">
            Cleaning, handymen, HVAC, plowing, linens, photography — one vetted
            directory built for short-term rental hosts. No more Facebook
            rabbit holes when a guest checks in tomorrow.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/providers"
              className="inline-flex items-center justify-center rounded-full bg-ember-500 px-6 py-3 text-sm font-semibold text-pine-950 shadow-md transition hover:bg-ember-400"
            >
              Browse Providers
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full border border-pine-400/50 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pine-900"
            >
              List Your Business
            </Link>
          </div>
          <div className="mt-14 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              ["300+", "Listed providers"],
              ["4", "Counties covered"],
              ["10", "Service categories"],
              ["24/7", "Emergency support"],
            ].map(([stat, label]) => (
              <div key={label}>
                <p className="text-2xl font-bold text-ember-400">{stat}</p>
                <p className="mt-1 text-sm text-pine-200">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-ember-600">
              What do you need?
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
              Browse by category
            </h2>
          </div>
          <Link
            href="/categories"
            className="hidden shrink-0 text-sm font-semibold text-pine-700 hover:text-pine-900 sm:block"
          >
            View all categories →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      {/* Featured providers */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-ember-600">
                Host favorites
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
                Featured providers
              </h2>
            </div>
            <Link
              href="/providers"
              className="hidden shrink-0 text-sm font-semibold text-pine-700 hover:text-pine-900 sm:block"
            >
              See all {allProviders.length} providers →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((provider) => (
              <ProviderCard key={provider.slug} provider={provider} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-ember-600">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
            From crisis to covered in three steps
          </h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "Find the right pro",
              body: "Search by service category, county, or town. Every listing shows ratings, response time, insurance, and service areas.",
            },
            {
              step: "2",
              title: "Reach out in minutes",
              body: "Call or request a quote directly. Providers on this directory answer fast — their whole business is STR work.",
            },
            {
              step: "3",
              title: "Build your bench",
              body: "Save favorites, book recurring services, and build the reliable provider bench your rentals run on.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pine-800 text-sm font-bold text-white">
                {item.step}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-stone-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="rounded-3xl bg-pine-900 px-6 py-12 text-center sm:px-12 sm:py-16">
          <h2 className="mx-auto max-w-xl text-3xl font-bold tracking-tight text-white">
            Are you a Poconos service provider?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-pine-200">
            Cleaning crews, handymen, HVAC techs, photographers — your next
            recurring client is hosting a rental right now. Claim a free
            listing today.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/pricing"
              className="rounded-full bg-ember-500 px-6 py-3 text-sm font-semibold text-pine-950 shadow-md transition hover:bg-ember-400"
            >
              Claim Your Free Listing
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-pine-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pine-800"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
