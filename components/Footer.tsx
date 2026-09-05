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
          <div className="mt-4 space-y-1 text-sm text-pine-200">
            <p>
              <a href="mailto:contact@poconosstr.com" className="hover:text-white">contact@poconosstr.com</a>
            </p>
            <p>
              <a href="mailto:support@poconosstr.com" className="hover:text-white">support@poconosstr.com</a>
            </p>
          </div>
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
            <li><Link className="hover:text-white" href="/blog">Blog</Link></li>
            <li><Link className="hover:text-white" href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-pine-300">
            For Providers
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/pricing">Listings &amp; Tiers</Link></li>
            <li><Link className="hover:text-white" href="/partners">Partner With Us</Link></li>
            <li><Link className="hover:text-white" href="/contact">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-pine-300">
            Legal
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/privacy">Privacy Policy</Link></li>
            <li><Link className="hover:text-white" href="/terms">Terms of Service</Link></li>
            <li><Link className="hover:text-white" href="/cookies">Cookie Policy</Link></li>
            <li><Link className="hover:text-white" href="/refunds">Refund Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-pine-900 px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-pine-300 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Poconos STR Directory. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/cookies" className="hover:text-white">Cookies</Link>
            <Link href="/refunds" className="hover:text-white">Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
