import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Refund policy for Poconos STR Directory subscriptions and listings.",
};

export default function RefundsPage() {
  const lastUpdated = "September 2, 2026";
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-stone-500">
        <Link href="/" className="hover:text-pine-700">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-800">Refund Policy</span>
      </nav>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">Refund Policy</h1>
      <p className="mt-2 text-sm text-stone-500">Last updated: {lastUpdated}</p>

      <div className="prose-sm mt-8 space-y-6 leading-7 text-stone-700">
        <p>
          This Refund Policy applies to all paid products and subscriptions on Poconos STR Directory,
          including provider listing tiers (Standard, Premium, Featured) and host access plans
          (Pro Host, Property Manager).
        </p>

        <h2 className="text-xl font-bold text-stone-900">1. Overview</h2>
        <p>
          Because our plans are digital subscription services that provide immediate access to directory
          features, listings, and lead generation, <strong>all purchases are generally final and
          non-refundable</strong> once the billing period has begun. However, we believe in being fair and
          transparent, and we will consider the refund situations described below.
        </p>

        <h2 className="text-xl font-bold text-stone-900">2. When Refunds Apply</h2>
        <p>We will provide a full refund in the following situations:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Duplicate or erroneous charges:</strong> If you were charged twice, or charged in error, we will refund the incorrect charge in full.</li>
          <li><strong>Service failure:</strong> If our platform fails to provide the subscribed service for an extended period (more than 7 consecutive days) due to our fault, and that failure significantly impacts your intended use.</li>
          <li><strong>New subscriber grace period:</strong> If you subscribed for the first time and request a cancellation within 48 hours of your first payment, we will process a full refund of that first payment.</li>
        </ul>

        <h2 className="text-xl font-bold text-stone-900">3. When Refunds Are Not Available</h2>
        <p>Refunds are <strong>not</strong> available in the following situations:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>You no longer need the service or changed your mind after the billing period began</li>
          <li>You were dissatisfied with the performance or response of service providers found on the directory</li>
          <li>You expected features that were not part of the plan you purchased</li>
          <li>Partial-month cancellation — you will have access until the end of the current billing period, but no refund is given for unused days</li>
          <li>Renewals — refunds are only considered for the most recent billing cycle payment</li>
        </ul>
        <p>
          <strong>Important:</strong> Your subscription fees cover access to the directory platform, not
          the work performed by any provider. Any disputes about the quality, cost, or outcome of work
          performed by a listed provider must be resolved directly between you and that provider.
        </p>

        <h2 className="text-xl font-bold text-stone-900">4. How to Request a Refund</h2>
        <p>To request a refund, please contact our billing team:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Email:{" "}
            <a href="mailto:billing@poconossrt.com" className="text-pine-700 hover:underline">billing@poconossrt.com</a>
          </li>
          <li>Please include: your account email, the subscription or charge in question, the date of the charge, and the reason for the request</li>
        </ul>
        <p>
          We will review all refund requests and respond within <strong>5 business days</strong>. Where a refund
          is approved, it will be issued to your original payment method within <strong>5–10 business days</strong>,
          depending on your bank.
        </p>

        <h2 className="text-xl font-bold text-stone-900">5. Chargebacks</h2>
        <p>
          If you believe you have been charged in error, we ask that you contact us first at{" "}
          <a href="mailto:billing@poconossrt.com" className="text-pine-700 hover:underline">billing@poconossrt.com</a>{" "}
          so we can resolve the issue directly. Filing a chargeback with your bank without first contacting
          us may delay resolution. If a chargeback is issued against a valid charge, your account may be
          suspended.
        </p>

        <h2 className="text-xl font-bold text-stone-900">6. Cancellation</h2>
        <p>
          You may cancel your subscription at any time:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Through your account&apos;s billing portal, or</li>
          <li>By emailing{" "}
            <a href="mailto:billing@poconossrt.com" className="text-pine-700 hover:underline">billing@poconossrt.com</a>{" "}
            with your account email
          </li>
        </ul>
        <p>
          Cancellation takes effect at the end of the current billing period. You will retain access to
          paid features until that date. We do not offer partial refunds for the unused portion of a
          billing period.
        </p>

        <h2 className="text-xl font-bold text-stone-900">7. Contact Us</h2>
        <p>
          For any questions about this Refund Policy, contact us at:<br />
          Email:{" "}
          <a href="mailto:billing@poconossrt.com" className="text-pine-700 hover:underline">billing@poconossrt.com</a><br />
          Address: Poconos, Pennsylvania
        </p>
      </div>
    </div>
  );
}
