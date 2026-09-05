import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions governing use of the Poconos STR Directory.",
};

export default function TermsPage() {
  const lastUpdated = "September 2, 2026";
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-stone-500">
        <Link href="/" className="hover:text-pine-700">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-800">Terms of Service</span>
      </nav>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">Terms of Service</h1>
      <p className="mt-2 text-sm text-stone-500">Last updated: {lastUpdated}</p>

      <div className="prose-sm mt-8 space-y-6 leading-7 text-stone-700">
        <p>
          Welcome to Poconos STR Directory. These Terms of Service (&quot;Terms&quot;) govern your access to
          and use of the website at{" "}
          <a href="https://poconosstr.com" className="text-pine-700 hover:underline">poconosstr.com</a>{" "}
          (the &quot;Site&quot;) and any services provided through it. By accessing or using the Site, you agree
          to be bound by these Terms.
        </p>

        <h2 className="text-xl font-bold text-stone-900">1. Acceptance of Terms</h2>
        <p>
          By creating an account, browsing the Site, or using any of our services, you acknowledge that
          you have read, understood, and agree to be bound by these Terms and our{" "}
          <Link href="/privacy" className="text-pine-700 hover:underline">Privacy Policy</Link>.
          If you do not agree, you may not use the Site.
        </p>

        <h2 className="text-xl font-bold text-stone-900">2. Description of Services</h2>
        <p>
          Poconos STR Directory is an online directory connecting short-term rental hosts with local
          service providers in the Pocono Mountains region. We provide:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>A searchable directory of vetted service providers</li>
          <li>Provider profiles with contact information, reviews, and service details</li>
          <li>Subscription-based listing tiers for providers</li>
          <li>Host access plans for full directory features</li>
        </ul>
        <p>
          <strong>We are a directory platform, not a service provider.</strong> We do not perform, guarantee,
          or take responsibility for any services provided by listed providers. Your engagement with any
          provider is a direct contract between you and that provider.
        </p>

        <h2 className="text-xl font-bold text-stone-900">3. Accounts</h2>
        <p>To access certain features, you must create an account. You agree to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Provide accurate, current, and complete information</li>
          <li>Maintain and promptly update your information</li>
          <li>Keep your account credentials confidential</li>
          <li>Accept responsibility for all activity under your account</li>
          <li>Notify us immediately of any unauthorized use</li>
        </ul>
        <p>
          We reserve the right to suspend or terminate accounts that violate these Terms or that we
          reasonably believe are used for fraudulent purposes.
        </p>

        <h2 className="text-xl font-bold text-stone-900">4. Subscriptions &amp; Payments</h2>
        <p>
          Paid plans are billed through Stripe on a recurring monthly basis. By subscribing, you
          authorize us to charge your payment method each month until you cancel.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>All prices are in US dollars</li>
          <li>Subscriptions automatically renew unless cancelled before the billing date</li>
          <li>You may cancel at any time through the billing portal or by contacting{" "}
            <a href="mailto:billing@poconosstr.com" className="text-pine-700 hover:underline">billing@poconosstr.com</a>
          </li>
          <li>Cancellation takes effect at the end of the current billing period — no partial refunds for unused time</li>
          <li>See our <Link href="/refunds" className="text-pine-700 hover:underline">Refund Policy</Link> for details</li>
        </ul>

        <h2 className="text-xl font-bold text-stone-900">5. Provider Listings</h2>
        <p>Providers who create listings agree to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Provide accurate business information, contact details, and service descriptions</li>
          <li>Maintain valid insurance and licensing as represented in their listing</li>
          <li>Respond to quote requests in a timely manner</li>
          <li>Not misrepresent services, pricing, or service areas</li>
          <li>Not post misleading, deceptive, or fraudulent content</li>
        </ul>
        <p>
          We reserve the right to modify, suspend, or remove any listing that violates these standards,
          at our sole discretion, with or without notice.
        </p>

        <h2 className="text-xl font-bold text-stone-900">6. User Conduct</h2>
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Use the Site for any unlawful purpose</li>
          <li>Scrape, crawl, or use automated tools to extract data from the Site</li>
          <li>Impersonate another person or business</li>
          <li>Post spam, fake reviews, or misleading content</li>
          <li>Interfere with or disrupt the Site or its infrastructure</li>
          <li>Attempt to access other users&apos; accounts without authorization</li>
        </ul>

        <h2 className="text-xl font-bold text-stone-900">7. Intellectual Property</h2>
        <p>
          All content on the Site — including text, graphics, logos, design, code, and software — is the
          property of Poconos STR Directory or its licensors and is protected by copyright and trademark
          laws. You may not copy, reproduce, distribute, or create derivative works without our written
          permission.
        </p>
        <p>
          Providers retain ownership of their business information, logos, and photos. By creating a
          listing, you grant us a non-exclusive, royalty-free license to display your information on the
          Site and in marketing materials for the duration of your listing.
        </p>

        <h2 className="text-xl font-bold text-stone-900">8. Disclaimers</h2>
        <p>
          THE SITE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
          EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SITE WILL BE UNINTERRUPTED, ERROR-FREE, OR
          SECURE.
        </p>
        <p>
          <strong>We do not vet, guarantee, or assume responsibility for any provider&apos;s work.</strong>
          We encourage users to verify insurance, licensing, and references independently before hiring
          any provider. Any dispute between a host and a provider must be resolved directly between them.
        </p>

        <h2 className="text-xl font-bold text-stone-900">9. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, POCONOS STR DIRECTORY AND ITS OWNERS, EMPLOYEES,
          AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
          PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR BUSINESS
          OPPORTUNITIES, ARISING FROM YOUR USE OF THE SITE.
        </p>
        <p>
          Our total liability to you for any claim arising from the Site shall not exceed the amount you
          paid us in the 12 months preceding the claim, or $100, whichever is greater.
        </p>

        <h2 className="text-xl font-bold text-stone-900">10. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless Poconos STR Directory and its owners from
          any claims, liabilities, damages, or expenses arising from your use of the Site, your violation
          of these Terms, or your violation of any rights of a third party.
        </p>

        <h2 className="text-xl font-bold text-stone-900">11. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the Commonwealth of Pennsylvania, without regard to
          its conflict of law provisions. Any disputes shall be resolved in the state or federal courts
          located in Monroe County, Pennsylvania.
        </p>

        <h2 className="text-xl font-bold text-stone-900">12. Changes to These Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. Changes will be posted on this page with
          an updated &quot;Last updated&quot; date. Your continued use of the Site after changes constitutes
          acceptance. For material changes, we will notify registered users via email.
        </p>

        <h2 className="text-xl font-bold text-stone-900">13. Contact</h2>
        <p>
          Questions about these Terms? Contact us at:<br />
          Email:{" "}
          <a href="mailto:support@poconosstr.com" className="text-pine-700 hover:underline">support@poconosstr.com</a><br />
          Address: Poconos, Pennsylvania
        </p>
      </div>
    </div>
  );
}
