import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tips, guides, and resources for Poconos short-term rental hosts and local service providers.",
};

const POSTS = [
  {
    slug: "best-cleaning-services-poconos-airbnb",
    title: "Best Cleaning Services for Poconos Airbnb Rentals (2026)",
    excerpt: "A vetted list of turnover cleaning crews serving Monroe, Pike, Carbon, and Wayne counties — with response times, pricing notes, and STR-specific experience.",
    category: "Cleaning",
    date: "September 2026",
  },
  {
    slug: "poconos-hvac-winterization-guide",
    title: "Poconos HVAC Winterization: What Every Vacation Rental Owner Needs to Know",
    excerpt: "Frozen pipes are the #1 winter emergency for Poconos rentals. Here's when to winterize, who to call, and what it costs.",
    category: "HVAC",
    date: "September 2026",
  },
  {
    slug: "hot-tub-maintenance-vacation-rental",
    title: "Hot Tub Maintenance Between Guests: A Complete Guide for STR Hosts",
    excerpt: "Chemical balancing, drain schedules, and filter service — everything you need to keep your rental hot tub guest-ready.",
    category: "Hot Tub",
    date: "September 2026",
  },
  {
    slug: "poconos-trash-valet-vacation-rentals",
    title: "Trash Valet Services for Poconos Vacation Rentals",
    excerpt: "Why more hosts are switching to weekly trash pickup, and how to find a reliable valet service in the Poconos.",
    category: "Trash",
    date: "September 2026",
  },
  {
    slug: "finding-reliable-handyman-poconos",
    title: "How to Find a Reliable Handyman for Your Poconos Rental Property",
    excerpt: "Drywall repairs, furniture assembly, deck fixes — the maintenance every STR needs and how to find someone who shows up.",
    category: "Handyman",
    date: "September 2026",
  },
  {
    slug: "poconos-pest-control-vacation-rentals",
    title: "Pest Control for Vacation Rentals: Poconos Seasonal Guide",
    excerpt: "Ants in summer, mice in winter — seasonal pest control strategies for Poconos rental properties.",
    category: "Pest Control",
    date: "September 2026",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-stone-500">
        <Link href="/" className="hover:text-pine-700">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-800">Blog</span>
      </nav>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
        Blog
      </h1>
      <p className="mt-3 text-stone-600">
        Guides, tips, and resources for Poconos vacation rental hosts and local service providers.
      </p>

      <div className="mt-8 space-y-6">
        {POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-pine-300 hover:shadow-md"
          >
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-pine-50 px-3 py-1 text-xs font-semibold text-pine-800">
                {post.category}
              </span>
              <span className="text-xs text-stone-400">{post.date}</span>
            </div>
            <h2 className="mt-3 text-lg font-semibold text-stone-900 group-hover:text-pine-800">
              {post.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
