import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Poconos STR Directory team for host, provider, billing, or partnership inquiries.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-stone-500">
        <Link href="/" className="hover:text-pine-700">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-800">Contact</span>
      </nav>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">Contact Us</h1>
      <p className="mt-3 max-w-xl text-stone-600">
        Have a question about your listing, a billing issue, or want to partner with us?
        Fill out the form below and we&apos;ll get back to you within 1–2 business days.
      </p>

      <div className="mt-8">
        <ContactForm />
      </div>

      <div className="mt-12 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-stone-900">Other ways to reach us</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-stone-900">General inquiries</p>
            <a href="mailto:contact@poconosstr.com" className="text-sm text-pine-700 hover:underline">
              contact@poconosstr.com
            </a>
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-900">Support &amp; help</p>
            <a href="mailto:support@poconosstr.com" className="text-sm text-pine-700 hover:underline">
              support@poconosstr.com
            </a>
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-900">Billing &amp; refunds</p>
            <a href="mailto:billing@poconosstr.com" className="text-sm text-pine-700 hover:underline">
              billing@poconosstr.com
            </a>
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-900">Partnerships</p>
            <a href="mailto:partner@poconosstr.com" className="text-sm text-pine-700 hover:underline">
              partner@poconosstr.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
