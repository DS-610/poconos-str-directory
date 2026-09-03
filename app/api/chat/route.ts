import { NextResponse } from "next/server";
import { getAllProviders, getProvidersByCategory, getProviderBySlug } from "@/lib/repository";
import type { Provider } from "@/lib/types";

const SITE_INFO = {
  name: "Poconos STR Directory",
  url: "poconossrt.com",
  description: "A directory connecting Poconos vacation rental hosts with trusted local service providers.",
  counties: ["Monroe", "Pike", "Carbon", "Wayne"],
  categories: {
    cleaning: "Turnover Cleaning — $125–$175/turnover. Same-day flips, linen handling, photo reports.",
    maintenance: "Maintenance & Handyman — $75–$150/hr. Repairs, drywall, furniture assembly, seasonal maintenance.",
    hvac: "HVAC — $150–$450/call. Furnace, heat pump, AC, duct servicing, winterization.",
    plumbing: "Plumbing — $150–$400/job. Leaks, water heaters, frozen pipes, repipes.",
    electrical: "Electrical — $150–$500/job. Wiring, EV chargers, hot tub hookups, panel work.",
    landscaping: "Landscaping — $200–$600/month. Lawn care, brush clearing, mulch, curb appeal.",
    "snow-removal": "Snow Removal — $100–$300/storm. Plowing, shoveling, ice treatment.",
    linens: "Linen Supply — $1.50–$4.00/bed set. Delivery and laundering on your turnover schedule.",
    photography: "Photography & Staging — $200–$500/shoot. Pro photography, virtual tours, staging.",
    suppliers: "Furniture & Supplies — Varies. Furniture, decor, smart-home devices, toiletries.",
    hottub: "Hot Tub Service — $80–$150/visit. Chemical balancing, drain/refill, cover care, winterization.",
    pest: "Pest Control — $150–$300/treatment. General pests, termites, bed bugs, wildlife.",
    trash: "Trash Valet — From $49/month. Weekly trash and recycling pickup and return.",
  },
  pricing: {
    provider: "Standard $75/mo, Premium $150/mo, Featured $250/mo. Annual plans save 2 months. Basic listing is free.",
    host: "Free Host is free forever. Pro Host $15/mo for full access. Property Manager $49/mo for teams.",
    oneTime: "Featured Boost $49 one-time for 7 days of homepage rotation. Verification Badge $99 one-time for the Verified STR Pro badge.",
  },
};

const GREETINGS = ["hi", "hello", "hey", "howdy", "sup", "yo", "good morning", "good afternoon", "good evening"];
const THANKS = ["thanks", "thank you", "thx", "appreciate", "perfect", "great", "awesome"];

function matchIntent(message: string): { intent: string; params: Record<string, string> } {
  const lower = message.toLowerCase();

  // Greeting
  if (GREETINGS.some((g) => lower.startsWith(g) || lower === g)) {
    return { intent: "greeting", params: {} };
  }

  // Thanks
  if (THANKS.some((t) => lower.startsWith(t))) {
    return { intent: "thanks", params: {} };
  }

  // Pricing questions
  if (lower.includes("price") || lower.includes("pricing") || lower.includes("cost") || lower.includes("how much") || lower.includes("plan") || lower.includes("subscribe") || lower.includes("upgrade")) {
    return { intent: "pricing", params: {} };
  }

  // List my business / claim
  if (lower.includes("list my") || lower.includes("claim") || lower.includes("add my") || lower.includes("sign up") || lower.includes("join") || lower.includes("register") || lower.includes("list your")) {
    return { intent: "list_business", params: {} };
  }

  // Partner / agency
  if (lower.includes("partner") || lower.includes("agency") || lower.includes("property manager") || lower.includes("travel agent") || lower.includes("referral")) {
    return { intent: "partner", params: {} };
  }

  // Contact
  if (lower.includes("contact") || lower.includes("email") || lower.includes("reach") || lower.includes("support") || lower.includes("help")) {
    return { intent: "contact", params: {} };
  }

  // Navigation
  if (lower.includes("where") || lower.includes("navigate") || lower.includes("find") || lower.includes("show me") || lower.includes("go to")) {
    return { intent: "navigate", params: { query: lower } };
  }

  // County-specific search
  const countyMatch = lower.match(/(monroe|pike|carbon|wayne)/i);
  if (countyMatch) {
    return { intent: "search_county", params: { county: countyMatch[1] } };
  }

  // Category search
  const categoryMap: Record<string, string> = {
    clean: "cleaning", cleaner: "cleaning", cleaning: "cleaning", turnover: "cleaning",
    hvac: "hvac", heating: "hvac", cooling: "hvac", furnace: "hvac", air: "hvac", ac: "hvac", winterization: "hvac",
    handyman: "maintenance", repair: "maintenance", maintenance: "maintenance", drywall: "maintenance", fix: "maintenance", deck: "maintenance",
    plumber: "plumbing", plumbing: "plumbing", pipe: "plumbing", "water heater": "plumbing",
    electrician: "electrical", electrical: "electrical", wiring: "electrical",
    landscap: "landscaping", lawn: "landscaping", mow: "landscaping", mulch: "landscaping",
    snow: "snow-removal", plow: "snow-removal", shoveling: "snow-removal",
    linen: "linens", sheet: "linens", towel: "linens",
    photo: "photography", photograph: "photography", staging: "photography", "virtual tour": "photography",
    "hot tub": "hottub", hottub: "hottub", spa: "hottub", jacuzzi: "hottub",
    pest: "pest", bug: "pest", insect: "pest", ant: "pest", mouse: "pest", termite: "pest", rodent: "pest",
    trash: "trash", garbage: "trash", waste: "trash", recycling: "trash", valet: "trash",
    furniture: "suppliers", supplies: "suppliers", decor: "suppliers",
  };

  for (const [keyword, category] of Object.entries(categoryMap)) {
    if (lower.includes(keyword)) {
      return { intent: "search_category", params: { category } };
    }
  }

  // General search
  return { intent: "search_general", params: { query: message } };
}

function buildResponse(intent: string, params: Record<string, string>, providers: Provider[]): string {
  switch (intent) {
    case "greeting":
      return "Hey! 👋 Welcome to the Poconos STR Directory. I can help you find service providers for your vacation rental — whether you need cleaning, HVAC, handyman, pest control, or anything else. What are you looking for?";

    case "thanks":
      return "You're welcome! Let me know if there's anything else I can help with. 😊";

    case "pricing":
      return `**Pricing Overview:**\n\n**For Providers:**\n• Basic — Free forever\n• Standard — $75/mo (or $750/yr, save 2 months)\n• Premium — $150/mo (or $1,500/yr) — includes Verified badge\n• Featured — $250/mo (or $2,500/yr) — homepage rotation + lead delivery\n\n**For Hosts:**\n• Free Host — Free forever (limited browsing)\n• Pro Host — $15/mo (full access + quote requests)\n• Property Manager — $49/mo (team access + bulk matching)\n\n**One-time products:**\n• Featured Boost — $49 (7 days of top placement)\n• Verification Badge — $99 (one-time, never expires)\n\n👉 [View full pricing](/pricing)`;

    case "list_business":
      return `**Claiming your listing is easy:**\n\n1. Go to [poconossrt.com/pricing](/pricing)\n2. Start with the free Basic listing (no credit card needed)\n3. Your business will appear in search results for your county\n4. Upgrade anytime for photos, reviews, and priority placement\n\nThe Basic listing includes your name, category, phone, and service area. You can claim it in about 2 minutes.\n\n👉 [Claim your listing now](/pricing)`;

    case "partner":
      return `**We have a partner program for:**\n\n• Property Management Companies — bulk access for your properties\n• Travel Agents & Booking Agencies — include our directory in travel packages\n• Real Estate Agents — help your investor clients find providers\n\nPartners earn $10 per host sign-up and 20% recurring commission on paid plans.\n\n👉 [Learn more about partnering](/partners)`;

    case "contact":
      return `**Reach us here:**\n\n• General — contact@poconossrt.com\n• Support — support@poconossrt.com\n• Billing — billing@poconossrt.com\n• Partnerships — partner@poconossrt.com\n\nOr use the [contact form](/contact) and we'll get back to you within 1–2 business days.`;

    case "navigate":
      return `**Quick links:**\n\n• [Browse all providers](/providers) — search by category, county, or town\n• [Categories](/categories) — browse by service type\n• [Pricing](/pricing) — view plans and claim your listing\n• [Blog](/blog) — guides for Poconos STR hosts\n• [Partners](/partners) — referral program for agencies and PMs\n• [Contact](/contact) — get in touch\n\nWhat would you like to do?`;

    case "search_county": {
      const county = params.county.charAt(0).toUpperCase() + params.county.slice(1);
      const results = providers.filter((p) =>
        p.counties.some((c) => c.toLowerCase() === params.county.toLowerCase())
      );
      if (results.length === 0) {
        return `I couldn't find providers specifically listed for ${county} County yet. Try searching a nearby county — Monroe, Pike, Carbon, or Wayne — or browse [all providers](/providers).`;
      }
      const list = results.slice(0, 5).map((p) => `• **${p.name}** — ${p.tagline || p.description?.substring(0, 60)} [View →](/providers/${p.slug})`).join("\n");
      return `**Providers in ${county} County:** (${results.length} found)\n\n${list}\n\n👉 [Browse all ${county} providers →](/providers?county=${county})`;
    }

    case "search_category": {
      const catName = SITE_INFO.categories[params.category as keyof typeof SITE_INFO.categories] || params.category;
      const results = providers.filter((p) => p.category === params.category);
      if (results.length === 0) {
        return `I don't have any ${params.category} providers listed yet, but I'm adding new ones every week. Check back soon or [browse all categories](/categories).`;
      }
      const list = results.slice(0, 5).map((p) => `• **${p.name}** — ${p.counties.join(", ")} [View →](/providers/${p.slug})`).join("\n");
      return `**${catName.split("—")[0].trim()} providers:** (${results.length} found)\n\n${list}\n\n👉 [Browse all ${params.category} providers →](/providers?category=${params.category})`;
    }

    case "search_general": {
      const q = params.query.toLowerCase();
      const results = providers.filter((p) => {
        const haystack = [
          p.name, p.tagline || "", p.description || "", p.category,
          ...p.counties, ...p.serviceAreas, ...(p.services || []),
        ].join(" ").toLowerCase();
        return q.split(" ").some((word) => word.length > 2 && haystack.includes(word));
      });
      if (results.length === 0) {
        return `I couldn't find providers matching "${params.query}". Try searching by category (like cleaning, HVAC, handyman) or by county (Monroe, Pike, Carbon, Wayne). You can also [browse all providers](/providers).`;
      }
      const list = results.slice(0, 5).map((p) => `• **${p.name}** — ${p.category} | ${p.counties.join(", ")} [View →](/providers/${p.slug})`).join("\n");
      return `**Here's what I found:** (${results.length} matches)\n\n${list}\n\n👉 [See all results →](/providers)`;
    }

    default:
      return "I'm not sure I understand. Try asking about:\n• Finding a specific service (cleaning, HVAC, handyman, etc.)\n• Pricing plans\n• How to list your business\n• Contact information";
  }
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ reply: "Please type a message." });
    }

    const providers = await getAllProviders();
    const { intent, params } = matchIntent(message);
    const reply = buildResponse(intent, params, providers);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({
      reply: "Sorry, I hit an error. Try browsing directly at poconossrt.com/providers or contact us at support@poconossrt.com.",
    });
  }
}
