import * as fs from "fs";

// Load .env.local first
const envContent = fs.readFileSync(".env.local", "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx <= 0) continue;
  const key = trimmed.slice(0, eqIdx);
  const value = trimmed.slice(eqIdx + 1).trim();
  process.env[key] = value;
}

import { createClient } from "@supabase/supabase-js";
const { INITIAL_POCONOS_PROVIDERS } = require("../../lib/seed-providers");

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!url || url.includes("YOUR_PROJECT")) {
    console.error("Supabase URL not configured properly");
    process.exit(1);
  }

  console.log("Connecting to:", url.slice(0, 40));
  const supabase = createClient(url, key);

  const rows = INITIAL_POCONOS_PROVIDERS.map((p: any) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    counties: p.counties,
    service_areas: p.serviceAreas,
    tier: p.tier,
    phone: p.phone,
    email: p.email || null,
    website: p.website || null,
    rating: p.rating,
    review_count: p.reviewCount,
    verified: p.verified,
    tagline: p.tagline,
    description: p.description,
    services: p.services,
    response_time: p.responseTime,
    insured: p.insured,
    licensed: p.licensed,
    year_founded: p.yearFounded,
    price_note: p.priceNote || null,
    pricing_notes: p.pricingNotes || null,
    featured_resorts: p.featuredResorts || [],
    is_demo: true,
    is_active: true,
  }));

  console.log("Seeding " + rows.length + " providers...");
  
  const { error } = await supabase.from("providers").upsert(rows, {
    onConflict: "slug",
  });

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log("Seeded " + rows.length + " providers successfully!");
  
  const { count } = await supabase
    .from("providers")
    .select("*", { count: "exact", head: true });
  console.log("Total providers in DB:", count);
}

main().catch((err: any) => {
  console.error("Error:", err.message);
  process.exit(1);
});
