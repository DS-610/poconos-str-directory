import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

interface CsvRow {
  name: string;
  category: string;
  counties: string;
  service_areas: string;
  phone: string;
  email: string;
  website: string;
  tagline: string;
  description: string;
  services: string;
  response_time: string;
  insured: string;
  licensed: string;
  year_founded: string;
  price_note: string;
}

export async function POST(request: Request) {
  try {
    const { rows } = await request.json() as { rows: CsvRow[] };

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: "No rows provided" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const providers = rows.map((row) => {
      const slug = row.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      return {
        slug,
        name: row.name,
        category: row.category,
        counties: row.counties.split(",").map((s) => s.trim()),
        service_areas: row.service_areas.split(",").map((s) => s.trim()),
        phone: row.phone,
        email: row.email || null,
        website: row.website || null,
        tagline: row.tagline || "",
        description: row.description || "",
        services: row.services.split(",").map((s) => s.trim()),
        response_time: row.response_time || "Within 1 business day",
        insured: row.insured === "true" || row.insured === "yes",
        licensed: row.licensed === "true" || row.licensed === "yes",
        year_founded: row.year_founded ? parseInt(row.year_founded) : null,
        price_note: row.price_note || null,
        tier: "free",
        is_active: true,
      };
    });

    const { data, error } = await supabase
      .from("providers")
      .upsert(providers, { onConflict: "slug" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      imported: providers.length,
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Failed to import providers" },
      { status: 500 }
    );
  }
}
