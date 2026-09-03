import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hot Tub Maintenance Between Guests: A Complete Guide for STR Hosts",
  description: "Chemical balancing, drain schedules, and filter service — keeping your rental hot tub guest-ready year-round.",
};

export default function BlogPost() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-stone-500">
        <Link href="/" className="hover:text-pine-700">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-pine-700">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-800">Hot Tub Maintenance</span>
      </nav>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
        Hot Tub Maintenance Between Guests: A Complete Guide for STR Hosts
      </h1>
      <p className="mt-2 text-sm text-stone-500">Updated September 2026</p>

      <div className="prose-sm mt-8 space-y-6 leading-7 text-stone-700">
        <p>
          A hot tub is one of the most requested amenities on Poconos Airbnb listings — but it&apos;s also one of the biggest maintenance headaches. Bad water chemistry leads to bad reviews, health complaints, and expensive equipment repairs.
        </p>

        <h2 className="text-xl font-bold text-stone-900">Between-Guest Checklist</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Test and balance pH (7.2–7.8), alkalinity (80–120 ppm), and sanitizer levels</li>
          <li>Skim surface debris and clean the filter</li>
          <li>Wipe down the cover and check the seal</li>
          <li>Check water temperature (100–102°F is standard)</li>
          <li>Run the jets for 15–20 minutes to circulate</li>
        </ul>

        <h2 className="text-xl font-bold text-stone-900">Drain and Refill Schedule</h2>
        <p>
          For rental hot tubs used multiple times per week, drain and refill every <strong>3–4 months</strong>. If usage is heavier (back-to-back bookings), go every 2 months. A full drain, clean, and refill typically costs $80–$150 through a professional service.
        </p>

        <h2 className="text-xl font-bold text-stone-900">Find a Hot Tub Service Provider</h2>
        <p>
          Instead of guessing with chemicals yourself, hire a professional. <Link href="/providers?category=hottub" className="text-pine-700 hover:underline">Browse hot tub service providers →</Link>
        </p>
        <p>
          Top-rated providers include <Link href="/providers/hot-tub-hygiene" className="text-pine-700 hover:underline">Hot Tub Hygiene</Link> ($80–$150/visit, East Stroudsburg/Lake Harmony area), <Link href="/providers/palmway-pools" className="text-pine-700 hover:underline">Palmway Pools</Link> (broad Poconos coverage), and <Link href="/providers/pocono-pool-and-spa" className="text-pine-700 hover:underline">Pocono Pool & Spa</Link>.
        </p>
      </div>
    </div>
  );
}
