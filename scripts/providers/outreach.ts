import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";
// Lazy import to avoid requiring Supabase config in dry-run mode

// ---------------------------------------------------------------------------
// Provider outreach tool
//
// Reads a CSV of local Poconos service providers and emails each one using
// either:
//   (A) Composio's Gmail toolkit (requires COMPOSIO_API_KEY + Gmail connection), or
//   (B) A direct SMTP transport (needs SMTP_HOST, SMTP_USER, SMTP_PASS, etc.)
//
// Set EMAIL_METHOD=smtp or EMAIL_METHOD=composio (defaults to smtp).
// Use --dry-run to see what _would_ be sent without sending.
// ---------------------------------------------------------------------------

interface Target {
  business_name: string;
  contact_name: string;
  category: string;
  town: string;
  phone: string;
  email: string;
  website: string;
  notes: string;
}

const CSV_PATH = path.resolve(
  process.cwd(),
  "scripts/providers/outreach-targets.csv"
);

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://poconossrt.com";

function getTargets(): Target[] {
  const file = fs.readFileSync(CSV_PATH, "utf-8");
  const records = parse(file, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
  }) as Target[];
  return records;
}

function renderTemplate(target: Target): { subject: string; body: string } {
  const firstName = target.contact_name.split(" ")[0] || target.business_name;
  const subject = `Free listing for ${target.business_name} on the Poconos STR Directory`;

  const body = `
Hi ${firstName},

I'm building a directory that connects Poconos short-term rental hosts with trusted local service providers — no lead fees, no commissions.

We currently list ${target.category.replace(
    /^./,
    (c) => c.toUpperCase()
  )} crews serving ${target.town} and nearby towns.

Your business fits exactly what hosts are searching for.

Your listing is complimentary and takes under a minute to claim:
${SITE_URL}/auth/signup

No catch — just a free profile so local hosts can find you for turnover cleaning,
handyman work, hot tub service, HVAC, pest control, landscaping, plumbing, and more.

If you'd rather I add your listing for you, just reply with your business name,
phone number, and service areas. I'll set it up and send you a confirmation link.

Best,
[Your Name]
Poconos STR Directory
${SITE_URL}
`;
  return { subject, body };
}

// ──────────────────────────────────────────────────────────────────────────
// SMTP transport (fallback / default)
// ──────────────────────────────────────────────────────────────────────────
async function sendViaSmtp(
  target: Target,
  subject: string,
  body: string
): Promise<boolean> {
  // @ts-ignore - nodemailer is a runtime-only dependency
  const nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const to = target.email || `find@${target.website}`.replace("//", "");

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      text: body,
    });
    return true;
  } catch (err) {
    console.error(`  ✗ SMTP send failed to ${target.business_name}:`, (err as Error).message);
    return false;
  }
}

// ──────────────────────────────────────────────────────────────────────────
// Composio Gmail transport
// ──────────────────────────────────────────────────────────────────────────
let composioClient: any | null = null;

async function getComposioClient() {
  if (composioClient) return composioClient;

  // @ts-ignore - composio is optional, only needed if EMAIL_METHOD=composio
  const { Composio } = await import("composio");
  composioClient = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
  await composioClient.init();
  return composioClient;
}

async function sendViaComposio(
  target: Target,
  subject: string,
  body: string
): Promise<boolean> {
  const client = await getComposioClient();
  const to = target.email || `find@${target.website}`.replace("//", "");

  try {
    const result = await client.getTool("gmail_send_email").execute({
      to,
      subject,
      body,
    });
    return result?.success !== false;
  } catch (err) {
    console.error(
      `  ✗ Composio send failed to ${target.business_name}:`,
      (err as Error).message
    );
    return false;
  }
}

// ──────────────────────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────────────────────
async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const emailMethod = process.env.EMAIL_METHOD || "smtp";

  const targets = getTargets();
  console.log(`Loaded ${targets.length} targets from CSV`);
  console.log(`Mode: ${dryRun ? "DRY RUN (no emails sent)" : "SENDING"}`);
  console.log(`Email method: ${emailMethod}`);
  console.log("");

  let supabase: any = null;
  if (!dryRun) {
    const mod = await import("../../lib/supabase");
    supabase = mod.getSupabaseAdmin();
  }

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const target of targets) {
    const { data: existing } = supabase
      ? await supabase
          .from("providers")
          .select("outreach_email_count")
          .eq("slug", toSlug(target.business_name))
          .single()
      : { data: { outreach_email_count: 0 } };

    if (existing && existing.outreach_email_count > 0 && !dryRun) {
      console.log(`  ⊘ ${target.business_name} — already contacted (${existing.outreach_email_count} emails)`);
      skipped++;
      continue;
    }

    const { subject, body } = renderTemplate(target);

    console.log(`→ ${target.business_name} (${target.category}, ${target.town})`);
    console.log(`  Subject: ${subject}`);

    if (dryRun) {
      console.log(`  Body preview: ${body.substring(0, 120)}...`);
      console.log(`  (dry-run — skip send)`);
      skipped++;
      continue;
    }

    let success = false;
    if (emailMethod === "composio") {
      success = await sendViaComposio(target, subject, body);
    } else {
      success = await sendViaSmtp(target, subject, body);
    }

    if (success) {
      sent++;
      if (supabase) {
      await supabase.from("providers").upsert({
        slug: toSlug(target.business_name),
        name: target.business_name,
        category: target.category,
        counties: ["Monroe"],
        service_areas: [target.town],
        tier: "free",
        phone: target.phone || null,
        email: target.email || null,
        website: target.website || null,
        rating: 0,
        review_count: 0,
        verified: false,
        tagline: "",
        description: "",
        services: [],
        response_time: "",
        insured: false,
        licensed: false,
        year_founded: null,
        price_note: null,
        pricing_notes: null,
        featured_resorts: [],
        is_demo: false,
        is_active: true,
        outreach_status: "emailed",
        outreach_contacted_at: new Date().toISOString(),
        outreach_email_count: (existing?.outreach_email_count || 0) + 1,
      });
      }
      console.log(`  ✅ Email sent`);
    } else {
      failed++;
      console.log(`  ✗ Failed`);
    }
    console.log("");
  }

  console.log(`──── Summary ────`);
  console.log(`Sent:   ${sent}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed:  ${failed}`);
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
