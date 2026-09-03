import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import ChatBot from "@/components/ChatBot";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Poconos STR Directory — Trusted Service Pros for Vacation Rentals",
    template: "%s | Poconos STR Directory",
  },
  description:
    "The Poconos' vetted directory of short-term rental service providers: turnover cleaning, handymen, HVAC, plumbing, snow removal, linens, and more.",
  keywords: [
    "Poconos short-term rental services",
    "Poconos Airbnb cleaning",
    "vacation rental handyman Poconos",
    "STR service providers",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-cream text-stone-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
        <ChatBot />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
