import { INITIAL_POCONOS_PROVIDERS } from "@/lib/seed-providers";
import { getSupabaseAdmin } from "@/lib/supabase";
import * as fs from "fs";

// Manually load .env.local (tsx doesn't auto-load)
const envContent = fs.readFileSync(".env.local", "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx <= 0) continue;
  const key = trimmed.slice(0, eqIdx);
  const value = trimmed.slice(eqIdx + 1).trim();
  if (!process.env[key]) process.env[key] = value;
}

async function main() {
  const supabase = getSupabaseAdmin();
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || url.includes("YOUR_PROJECT")) {
    console.error("Supabase URL not configured properly");
    process.exit(1);
  }

  console.log("Connecting to Supabase:", url.slice(0, 40));

  const rows = INITIAL_POCONOS_PROVIDERS.map((p) => ({
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

  const { error } = await supabase.from("providers").upsert(rows, {
    onConflict: "slug",
  });

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
  console.log(`Seeded ${rows.length} demo providers into Supabase.`);

  // Verify
  const { count } = await supabase
    .from("providers")
    .select("*", { count: "exact", head: true });
  console.log("Total providers now in DB:", count);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
