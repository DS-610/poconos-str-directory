"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const CATEGORIES = [
  { value: "cleaning", label: "Turnover Cleaning" },
  { value: "maintenance", label: "Maintenance & Handyman" },
  { value: "hvac", label: "HVAC" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "landscaping", label: "Landscaping" },
  { value: "snow-removal", label: "Snow Removal" },
  { value: "linens", label: "Linen Supply" },
  { value: "photography", label: "Photography & Staging" },
  { value: "suppliers", label: "Furniture & Supplies" },
];

const COUNTIES = ["Monroe", "Pike", "Carbon", "Wayne"];

export default function ClaimPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    category: "cleaning",
    counties: [] as string[],
    serviceAreas: "",
    phone: "",
    email: "",
    website: "",
    tagline: "",
    description: "",
    services: "",
    responseTime: "",
    insured: false,
    licensed: false,
    yearFounded: "",
    priceNote: "",
  });

  function updateField(field: string, value: string | boolean | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleCounty(county: string) {
    setForm((prev) => ({
      ...prev,
      counties: prev.counties.includes(county)
        ? prev.counties.filter((c) => c !== county)
        : [...prev.counties, county],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const slug = form.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const { error: insertError } = await supabase.from("providers").insert({
      user_id: user.id,
      slug,
      name: form.name,
      category: form.category,
      counties: form.counties,
      service_areas: form.serviceAreas.split(",").map((s) => s.trim()).filter(Boolean),
      phone: form.phone,
      email: form.email || user.email,
      website: form.website || null,
      tagline: form.tagline,
      description: form.description,
      services: form.services.split(",").map((s) => s.trim()).filter(Boolean),
      response_time: form.responseTime || "Within 1 business day",
      insured: form.insured,
      licensed: form.licensed,
      year_founded: form.yearFounded ? parseInt(form.yearFounded) : null,
      price_note: form.priceNote || null,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">
        Create Your Listing
      </h1>
      <p className="mt-2 text-stone-600">
        Add your business to the Poconos STR Directory. Start with a free listing and upgrade anytime.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-stone-900">Business Info</h2>

          <div>
            <label className="block text-sm font-medium text-stone-700">Business Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm shadow-sm focus:border-pine-500 focus:outline-none focus:ring-2 focus:ring-pine-200"
              placeholder="e.g. Pocono Peak Clean"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">Category *</label>
            <select
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm shadow-sm focus:border-pine-500 focus:outline-none focus:ring-2 focus:ring-pine-200"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">Counties Served *</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {COUNTIES.map((county) => (
                <button
                  key={county}
                  type="button"
                  onClick={() => toggleCounty(county)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    form.counties.includes(county)
                      ? "bg-pine-800 text-white"
                      : "border border-stone-300 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {county}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">Service Areas (comma-separated)</label>
            <input
              type="text"
              value={form.serviceAreas}
              onChange={(e) => updateField("serviceAreas", e.target.value)}
              className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm shadow-sm focus:border-pine-500 focus:outline-none focus:ring-2 focus:ring-pine-200"
              placeholder="e.g. Stroudsburg, Tannersville, Lake Harmony"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-stone-900">Contact & Details</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-stone-700">Phone *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm shadow-sm focus:border-pine-500 focus:outline-none focus:ring-2 focus:ring-pine-200"
                placeholder="(570) 555-0100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm shadow-sm focus:border-pine-500 focus:outline-none focus:ring-2 focus:ring-pine-200"
                placeholder="Uses your account email if blank"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">Website</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => updateField("website", e.target.value)}
              className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm shadow-sm focus:border-pine-500 focus:outline-none focus:ring-2 focus:ring-pine-200"
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">Tagline *</label>
            <input
              type="text"
              required
              value={form.tagline}
              onChange={(e) => updateField("tagline", e.target.value)}
              className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm shadow-sm focus:border-pine-500 focus:outline-none focus:ring-2 focus:ring-pine-200"
              placeholder="e.g. Turnover-ready cleaning trusted by 30+ hosts"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">Description *</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm shadow-sm focus:border-pine-500 focus:outline-none focus:ring-2 focus:ring-pine-200"
              placeholder="Tell hosts about your experience, what makes you reliable, and how you serve STR properties..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">Services (comma-separated) *</label>
            <input
              type="text"
              required
              value={form.services}
              onChange={(e) => updateField("services", e.target.value)}
              className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm shadow-sm focus:border-pine-500 focus:outline-none focus:ring-2 focus:ring-pine-200"
              placeholder="e.g. Same-day turnover, Deep cleans, Restocking"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-stone-700">Response Time</label>
              <input
                type="text"
                value={form.responseTime}
                onChange={(e) => updateField("responseTime", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm shadow-sm focus:border-pine-500 focus:outline-none focus:ring-2 focus:ring-pine-200"
                placeholder="e.g. Under 2 hours"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">Year Founded</label>
              <input
                type="number"
                min="1900"
                max="2026"
                value={form.yearFounded}
                onChange={(e) => updateField("yearFounded", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm shadow-sm focus:border-pine-500 focus:outline-none focus:ring-2 focus:ring-pine-200"
                placeholder="e.g. 2019"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">Pricing Note</label>
            <input
              type="text"
              value={form.priceNote}
              onChange={(e) => updateField("priceNote", e.target.value)}
              className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm shadow-sm focus:border-pine-500 focus:outline-none focus:ring-2 focus:ring-pine-200"
              placeholder="e.g. From $140 / turnover"
            />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={form.insured}
                onChange={(e) => updateField("insured", e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 accent-pine-700"
              />
              Insured
            </label>
            <label className="flex items-center gap-2 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={form.licensed}
                onChange={(e) => updateField("licensed", e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 accent-pine-700"
              />
              Licensed
            </label>
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-pine-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-pine-900 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Free Listing"}
          </button>
          <a
            href="/dashboard"
            className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
