import Link from "next/link";

export default function CheckoutSuccess() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
        ✓
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-stone-900">
        Payment successful
      </h1>
      <p className="mt-3 max-w-md text-stone-600">
        Your listing is now live. You&apos;ll receive a confirmation email with
        details on how to manage your account and update your profile.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-full bg-pine-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-pine-900"
        >
          Back to Home
        </Link>
        <Link
          href="/providers"
          className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
        >
          Browse Providers
        </Link>
      </div>
    </div>
  );
}
