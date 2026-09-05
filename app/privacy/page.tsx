import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Poconos STR Directory collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  const lastUpdated = "September 2, 2026";
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-stone-500">
        <Link href="/" className="hover:text-pine-700">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-800">Privacy Policy</span>
      </nav>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-stone-500">Last updated: {lastUpdated}</p>

      <div className="prose-sm mt-8 space-y-6 leading-7 text-stone-700">
        <p>
          Poconos STR Directory (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the website at{" "}
          <a href="https://poconosstr.com" className="text-pine-700 hover:underline">poconosstr.com</a>{" "}
          (the &quot;Site&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your
          information when you visit our Site or use our services.
        </p>

        <h2 className="text-xl font-bold text-stone-900">1. Information We Collect</h2>
        <h3 className="text-lg font-semibold text-stone-900">Information you provide directly:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Name, email address, phone number, and business information when you create an account or submit a contact form</li>
          <li>Payment information when you subscribe to a paid plan (processed securely through Stripe — we never store your credit card number)</li>
          <li>Provider listing details including business name, services, service areas, and photos</li>
          <li>Reviews, favorites, and quote requests</li>
        </ul>

        <h3 className="text-lg font-semibold text-stone-900">Information collected automatically:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Log data including IP address, browser type, pages visited, and time spent on pages</li>
          <li>Cookie and tracking data (see our <Link href="/cookies" className="text-pine-700 hover:underline">Cookie Policy</Link>)</li>
          <li>Device information and operating system</li>
        </ul>

        <h2 className="text-xl font-bold text-stone-900">2. How We Use Your Information</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>To provide, maintain, and improve our directory services</li>
          <li>To process subscriptions and payments through Stripe</li>
          <li>To send you service-related communications (account confirmations, subscription updates, security alerts)</li>
          <li>To respond to your inquiries and support requests</li>
          <li>To send marketing communications about new features or services (only with your consent; you can opt out at any time)</li>
          <li>To detect and prevent fraud, abuse, or security issues</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2 className="text-xl font-bold text-stone-900">3. How We Share Your Information</h2>
        <p>We do not sell your personal information. We may share information with:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Service providers:</strong> Stripe (payment processing), Vercel (hosting), Supabase (database), and email delivery services that help us operate the Site</li>
          <li><strong>Legal requirements:</strong> When required by law, court order, or governmental regulation</li>
          <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets, with notice to you</li>
          <li><strong>With your consent:</strong> For any other purpose with your explicit permission</li>
        </ul>

        <h2 className="text-xl font-bold text-stone-900">4. Data Retention</h2>
        <p>
          We retain your personal information for as long as your account is active or as needed to provide
          you services. If you delete your account, we will remove your personal data within 30 days, except
          where we need to retain certain information for legal, accounting, or legitimate business purposes.
        </p>

        <h2 className="text-xl font-bold text-stone-900">5. Data Security</h2>
        <p>
          We implement industry-standard security measures including encryption in transit (HTTPS/TLS),
          encrypted database storage, and access controls. However, no method of electronic transmission
          or storage is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2 className="text-xl font-bold text-stone-900">6. Your Rights</h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your personal data</li>
          <li>Object to or restrict processing of your data</li>
          <li>Data portability — receive your data in a structured, machine-readable format</li>
          <li>Withdraw consent at any time</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{" "}
          <a href="mailto:support@poconosstr.com" className="text-pine-700 hover:underline">support@poconosstr.com</a>.
        </p>

        <h2 className="text-xl font-bold text-stone-900">7. Children&apos;s Privacy</h2>
        <p>
          Our Site is not intended for children under 13. We do not knowingly collect personal information
          from children. If you believe we have collected information from a child, please contact us
          immediately.
        </p>

        <h2 className="text-xl font-bold text-stone-900">8. Third-Party Links</h2>
        <p>
          Our Site may contain links to provider websites or third-party services. We are not responsible
          for the privacy practices of these external sites. We encourage you to review the privacy policies
          of any third-party site you visit.
        </p>

        <h2 className="text-xl font-bold text-stone-900">9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any material changes
          by posting the new policy on this page and updating the &quot;Last updated&quot; date. Your continued
          use of the Site after changes constitutes acceptance of the updated policy.
        </p>

        <h2 className="text-xl font-bold text-stone-900">10. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at:<br />
          Email:{" "}
          <a href="mailto:support@poconosstr.com" className="text-pine-700 hover:underline">support@poconosstr.com</a><br />
          Address: Poconos, Pennsylvania<br />
          Website:{" "}
          <a href="https://poconosstr.com" className="text-pine-700 hover:underline">poconosstr.com</a>
        </p>
      </div>
    </div>
  );
}
