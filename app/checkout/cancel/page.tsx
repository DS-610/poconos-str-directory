import Link from "next/link";

export default function CheckoutCancel() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl">
        ✕
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-stone-900">
        Checkout canceled
      </h1>
      <p className="mt-3 max-w-md text-stone-600">
        No worries — you weren&apos;t charged. Your free listing is still
        active. Upgrade anytime when you&apos;re ready.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/pricing"
          className="rounded-full bg-pine-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-pine-900"
        >
          View Plans
        </Link>
        <Link
          href="/"
          className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
