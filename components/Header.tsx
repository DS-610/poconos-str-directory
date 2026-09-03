import Link from "next/link";

const NAV = [
  { href: "/providers", label: "Browse Providers" },
  { href: "/categories", label: "Categories" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/partners", label: "Partners" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-pine-800 text-lg shadow-sm">
            🏔️
          </span>
          <span className="text-[17px] font-semibold tracking-tight text-pine-950">
            Poconos STR <span className="text-ember-600">Directory</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-pine-100 hover:text-pine-900"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/pricing"
            className="ml-2 rounded-full bg-pine-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-pine-900"
          >
            List Your Business
          </Link>
        </nav>
        <nav className="md:hidden">
          <Link
            href="/providers"
            className="rounded-full bg-pine-800 px-4 py-2 text-sm font-semibold text-white"
          >
            Browse
          </Link>
        </nav>
      </div>
    </header>
  );
}
