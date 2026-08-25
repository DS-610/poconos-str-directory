import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-pine-950 text-pine-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-[17px] font-semibold text-white">
            Poconos STR Directory
          </p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-pine-200">
            The Poconos&apos; vetted directory connecting short-term rental hosts
            with trusted local service providers across Monroe, Pike, Carbon,
            and Wayne counties.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-pine-300">
            Explore
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/providers">Browse Providers</Link></li>
            <li><Link className="hover:text-white" href="/categories">Categories</Link></li>
            <li><Link className="hover:text-white" href="/pricing">Pricing</Link></li>
            <li><Link className="hover:text-white" href="/about">About</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-pine-300">
            For Providers
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/pricing">Listings &amp; Tiers</Link></li>
            <li><Link className="hover:text-white" href="/about">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-pine-900 py-5 text-center text-xs text-pine-300">
        © {new Date().getFullYear()} Poconos STR Directory. Built for the hosts
        and crews of the Pocono Mountains.
      </div>
    </footer>
  );
}
