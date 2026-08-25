import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="text-6xl">🏔️</p>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-stone-900">
        This trail doesn&apos;t exist
      </h1>
      <p className="mt-3 text-stone-600">
        The page you&apos;re looking for was moved, renamed, or never made it to
        the summit.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-pine-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-pine-900"
      >
        Back to Home
      </Link>
    </div>
  );
}
