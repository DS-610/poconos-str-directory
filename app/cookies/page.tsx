import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Poconos STR Directory uses cookies and similar technologies.",
};

export default function CookiesPage() {
  const lastUpdated = "September 2, 2026";
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-stone-500">
        <Link href="/" className="hover:text-pine-700">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-800">Cookie Policy</span>
      </nav>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">Cookie Policy</h1>
      <p className="mt-2 text-sm text-stone-500">Last updated: {lastUpdated}</p>

      <div className="prose-sm mt-8 space-y-6 leading-7 text-stone-700">
        <p>
          This Cookie Policy explains how Poconos STR Directory (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
          uses cookies and similar technologies when you visit{" "}
          <a href="https://poconossrt.com" className="text-pine-700 hover:underline">poconossrt.com</a>{" "}
          (the &quot;Site&quot;).
        </p>

        <h2 className="text-xl font-bold text-stone-900">1. What Are Cookies?</h2>
        <p>
          Cookies are small text files that are placed on your device when you visit a website. They
          are widely used to make websites work, improve efficiency, and provide reporting information.
          Similar technologies include web beacons, pixels, and local storage.
        </p>

        <h2 className="text-xl font-bold text-stone-900">2. How We Use Cookies</h2>
        <p>We use cookies for the following purposes:</p>

        <h3 className="text-lg font-semibold text-stone-900">Essential cookies (required)</h3>
        <p>
          These cookies are necessary for the Site to function. They enable core features like
          account authentication, session management, and security.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Session cookies:</strong> Keep you logged in as you browse pages</li>
          <li><strong>Authentication cookies:</strong> Verify your identity after login</li>
          <li><strong>Security cookies:</strong> Protect against cross-site request forgery (CSRF)</li>
        </ul>

        <h3 className="text-lg font-semibold text-stone-900">Functional cookies (optional)</h3>
        <p>
          These cookies remember your preferences and settings to improve your experience.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Preference cookies:</strong> Remember your search filters, language, and display preferences</li>
          <li><strong>Favorite providers:</strong> Store your saved/favorited providers locally</li>
        </ul>

        <h3 className="text-lg font-semibold text-stone-900">Analytics cookies (optional)</h3>
        <p>
          These cookies help us understand how visitors interact with the Site so we can improve it.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Analytics cookies:</strong> Track page views, referral sources, and usage patterns</li>
          <li><strong>Performance cookies:</strong> Measure page load times and errors</li>
        </ul>

        <h2 className="text-xl font-bold text-stone-900">3. Third-Party Cookies</h2>
        <p>Some cookies are placed by third-party services we use:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Stripe:</strong> Payment processing cookies for checkout and subscription management</li>
          <li><strong>Vercel Analytics:</strong> Performance and usage analytics (if enabled)</li>
          <li><strong>Google Analytics:</strong> Website usage analytics (if enabled)</li>
        </ul>
        <p>
          These third parties have their own privacy policies governing how they use data. We encourage
          you to review them.
        </p>

        <h2 className="text-xl font-bold text-stone-900">4. Managing Cookies</h2>
        <p>You can control and manage cookies in several ways:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Browser settings:</strong> Most browsers let you block or delete cookies. Check your browser&apos;s help menu for instructions.</li>
          <li><strong>Opt-out links:</strong> You can opt out of Google Analytics by installing the{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" className="text-pine-700 hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-Out Browser Add-on</a>.
          </li>
          <li><strong>Cookie banner:</strong> When you first visit the Site, you can choose which optional cookies to accept.</li>
        </ul>
        <p>
          <strong>Note:</strong> Disabling essential cookies may prevent the Site from functioning properly,
          including login and account features.
        </p>

        <h2 className="text-xl font-bold text-stone-900">5. Cookie Retention</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
          <li><strong>Persistent cookies:</strong> Remain on your device for up to 12 months or until you delete them</li>
          <li><strong>Authentication cookies:</strong> Expire after 30 days of inactivity</li>
        </ul>

        <h2 className="text-xl font-bold text-stone-900">6. Do Not Track</h2>
        <p>
          Some browsers offer a &quot;Do Not Track&quot; (DNT) signal. There is currently no universal standard
          for how websites should respond to DNT signals. We will honor DNT signals where technically
          feasible and update this policy if standards change.
        </p>

        <h2 className="text-xl font-bold text-stone-900">7. Changes to This Policy</h2>
        <p>
          We may update this Cookie Policy from time to time. Changes will be posted on this page with
          an updated &quot;Last updated&quot; date. If we make material changes, we will notify you through
          the Site or via email.
        </p>

        <h2 className="text-xl font-bold text-stone-900">8. Contact Us</h2>
        <p>
          Questions about our use of cookies? Contact us at:<br />
          Email:{" "}
          <a href="mailto:support@poconossrt.com" className="text-pine-700 hover:underline">support@poconossrt.com</a><br />
          Address: Poconos, Pennsylvania
        </p>
      </div>
    </div>
  );
}
