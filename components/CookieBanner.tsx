"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_KEY = "poconos-cookie-consent";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) setShow(true);
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setShow(false);
  }

  function decline() {
    localStorage.setItem(COOKIE_KEY, "declined");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-stone-200 bg-white p-5 shadow-xl sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-stone-900">🍪 We use cookies</p>
            <p className="mt-1 text-sm leading-6 text-stone-600">
              We use essential cookies to keep you logged in and optional cookies to improve your
              experience and analyze site traffic. You can choose which optional cookies to accept.
              Read our{" "}
              <Link href="/cookies" className="text-pine-700 hover:underline">Cookie Policy</Link>{" "}
              for details.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              onClick={decline}
              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              Decline
            </button>
            <button
              onClick={accept}
              className="rounded-full bg-pine-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pine-900"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
