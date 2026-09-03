import type { Metadata } from "next";
import PricingSection from "@/components/PricingSection";

export const metadata: Metadata = {
  title: "Pricing & Listings",
  description: "Provider listing tiers and owner access plans for the Poconos STR Directory. Free listings for providers, free browsing for hosts.",
};

export default function PricingPage() {
  return <PricingSection />;
}
