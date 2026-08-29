import { INITIAL_POCONOS_PROVIDERS } from "@/lib/seed-providers";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function importDemoProviders() {
  const supabase = getSupabaseAdmin();
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
    console.error("Import failed:", error.message);
    return { success: false, error: error.message };
  }
  return { success: true, count: rows.length };
}
