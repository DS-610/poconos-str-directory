const https = require("https");

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "Ryan Flanagan <partner@poconossrt.com>";
const REPLY_TO = "partner@poconossrt.com";

function sendViaResend(to, subject, html) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      reply_to: REPLY_TO,
      subject: subject,
      html: html,
    });
    const req = https.request({
      hostname: "api.resend.com",
      path: "/emails",
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    }, (res) => {
      let body = "";
      res.on("data", (c) => body += c);
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(true);
        } else {
          console.error(`  ✗ Resend error (${res.statusCode}):`, body.substring(0, 200));
          resolve(false);
        }
      });
    });
    req.on("error", (e) => { console.error("  ✗ Request error:", e.message); resolve(false); });
    req.write(data);
    req.end();
  });
}

const SUBJECT = "List Your Business on the Poconos STR Directory — Free Listing";

function buildBody(provider) {
  return `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1c1917;">
  <p>Hi ${provider.name} team,</p>

  <p>I'm Ryan, founder of <a href="https://poconossrt.com" style="color: #46845d;">Poconos STR Directory</a> — a local directory connecting short-term rental hosts with trusted service providers across the Pocono Mountains.</p>

  <p>I found ${provider.name} while building our directory of vetted providers for vacation rental hosts in Monroe, Pike, Carbon, and Wayne counties. We're listing cleaning crews, handymen, HVAC techs, plumbers, pest control, and more — all specifically focused on STR operations.</p>

  <p><strong>Here's the offer:</strong> A <strong>free Basic listing</strong> on our directory. No credit card, no commitment. Your business gets exposed to hundreds of local STR hosts who are actively searching for exactly what you do.</p>

  <p>What a free listing includes:</p>
  <ul>
    <li>Business name, category, phone, and service area on the directory</li>
    <li>Visible to hosts searching for ${provider.category} services in your area</li>
    <li>Option to upgrade later for photos, reviews, and priority placement</li>
  </ul>

  <p>You can claim your free listing in 2 minutes here:<br/>
  <a href="https://poconossrt.com/pricing" style="display: inline-block; margin: 12px 0; padding: 10px 24px; background: #46845d; color: white; border-radius: 999px; text-decoration: none; font-weight: bold;">Claim Free Listing →</a></p>

  <p>Or just reply to this email with your business details and I'll set it up for you.</p>

  <p>Thanks for the work you do for Poconos hosts.</p>

  <p>Best,<br/>
  <strong>Ryan Flanagan</strong><br/>
  Founder, Poconos STR Directory<br/>
  <a href="https://poconossrt.com" style="color: #46845d;">poconossrt.com</a><br/>
  <a href="mailto:partner@poconossrt.com" style="color: #46845d;">partner@poconossrt.com</a></p>
</div>`;
}

const providers = [
  { name: "Blue Titan Plumbing & Heating", email: "info@bluetitanhvac.com", category: "HVAC" },
  { name: "Explore Poconos", email: "explorepoconosnow@gmail.com", category: "cleaning" },
  { name: "Forteca Cleaning", email: "fortecacleaning@gmail.com", category: "cleaning" },
  { name: "Hot Tub Hygiene", email: "Contact@Hottubhygiene.com", category: "hot tub" },
  { name: "KMB Plumbing Electrical & HVAC", email: "info@kmbplumbing.com", category: "plumbing & HVAC" },
  { name: "L&L Pest Control", email: "info@landlpestcontrol.com", category: "pest control" },
  { name: "Mountain Cleaning Services LLC", email: "strcleaningpoconos@mountaincleaningservicesllc.com", category: "cleaning" },
  { name: "NE Handyman LLC", email: "info@nehandymanllc.com", category: "handyman" },
  { name: "Palmway Pools", email: "info@palmwaypools.com", category: "pool & spa" },
  { name: "Pocono Pool & Spa", email: "info@poconopoolandspa.com", category: "pool & spa" },
  { name: "Poconos Pest Control", email: "info@poconospestcontrol.com", category: "pest control" },
  { name: "SolidStem", email: "info@solidstem.company", category: "handyman" },
  { name: "The Pest Rangers", email: "info@thepestrangers.com", category: "pest control" },
  { name: "The Poconos Handyman", email: "ThePoconosHandyman@gmail.com", category: "handyman" },
  { name: "The Tidy Bear", email: "info@thetidybear.com", category: "trash valet" },
  { name: "Ultimate Plumbing Heating & Air", email: "info@ultimateplumbingheatingair.com", category: "plumbing & HVAC" },
];

const isDryRun = process.argv.includes("--dry-run");

async function main() {
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY not found in environment");
    process.exit(1);
  }

  console.log(`\n=== Provider Outreach via Resend: ${isDryRun ? "DRY RUN" : "LIVE"} ===`);
  console.log(`From: ${FROM_EMAIL}`);
  console.log(`Recipients: ${providers.length}\n`);

  let sent = 0, failed = 0;

  for (const p of providers) {
    const body = buildBody(p);

    if (isDryRun) {
      console.log(`[DRY] → ${p.email} (${p.name})`);
      sent++;
    } else {
      process.stdout.write(`${p.name} → ${p.email}... `);
      const ok = await sendViaResend(p.email, SUBJECT, body);
      if (ok) { sent++; console.log("✓"); }
      else { failed++; console.log("✗"); }
      // Rate limit: 1.5 seconds between emails (Resend free tier = 1/sec, being safe)
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  console.log(`\n=== Done: ${sent} sent, ${failed} failed ===\n`);
}

main();
