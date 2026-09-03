import { getSupabaseAdmin } from "./supabase";
import { PROVIDERS as SEED_PROVIDERS } from "./data";
import type { Provider } from "./types";

const SUPABASE_CONFIGURED =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("supabase.co") &&
  process.env.SUPABASE_SERVICE_ROLE_KEY &&
  !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("YOUR_SERVICE_ROLE");

interface DbProviderRow {
  slug: string;
  name: string;
  category: Provider["category"];
  counties: string[];
  service_areas: string[];
  tier: Provider["tier"];
  phone: string | null;
  email: string | null;
  website: string | null;
  rating: number;
  review_count: number;
  verified: boolean;
  tagline: string | null;
  description: string | null;
  services: string[];
  response_time: string | null;
  insured: boolean;
  licensed: boolean;
  year_founded: number | null;
  price_note: string | null;
  pricing_notes: string | null;
  featured_resorts: string[];
  photo_url: string | null;
  boost_active: boolean;
  boosted_until: string | null;
  is_demo: boolean;
  is_active: boolean;
}

function rowToProvider(row: DbProviderRow): Provider {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    counties: row.counties as Provider["counties"],
    serviceAreas: row.service_areas,
    tier: row.tier,
    phone: row.phone || "",
    email: row.email || undefined,
    website: row.website || undefined,
    rating: Number(row.rating) || 0,
    reviewCount: row.review_count || 0,
    verified: row.verified,
    tagline: row.tagline || "",
    description: row.description || "",
    services: row.services,
    responseTime: row.response_time || "Within 1 business day",
    insured: row.insured,
    licensed: row.licensed,
    yearFounded: row.year_founded || 0,
    priceNote: row.price_note || undefined,
    pricingNotes: row.pricing_notes || undefined,
    featuredResorts: row.featured_resorts || [],
    photoUrl: row.photo_url || undefined,
    boostActive: row.boost_active || false,
  };
}

export async function getAllProviders(): Promise<Provider[]> {
  if (!SUPABASE_CONFIGURED) {
    return SEED_PROVIDERS;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error("Failed to load providers from Supabase:", error);
    return SEED_PROVIDERS;
  }

  const rows = data as unknown as DbProviderRow[];
  return rows.map(rowToProvider);
}

export async function getProvidersByCategory(slug: string): Promise<Provider[]> {
  const all = await getAllProviders();
  return all.filter((p) => p.category === slug);
}

export async function getProviderBySlug(slug: string): Promise<Provider | undefined> {
  const all = await getAllProviders();
  return all.find((p) => p.slug === slug);
}
