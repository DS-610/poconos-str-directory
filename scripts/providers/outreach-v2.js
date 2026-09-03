const https = require("https");
const RESEND_API_KEY = process.env.RESEND_API_KEY;

function sendEmail(to, subject, textBody) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      from: "Ryan Flanagan <partner@poconossrt.com>",
      to: [to],
      reply_to: "partner@poconossrt.com",
      subject: subject,
      text: textBody,
    });
    const req = https.request({
      hostname: "api.resend.com",
      path: "/emails",
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    }, (res) => {
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(true);
        } else {
          console.error(`  X Resend error (${res.statusCode}):`, body.substring(0, 200));
          resolve(false);
        }
      });
    });
    req.on("error", (e) => { console.error("  X Request error:", e.message); resolve(false); });
    req.write(data);
    req.end();
  });
}

function buildMessage(p) {
  const categoryIntro = {
    cleaning: "cleaning crews",
    hvac: "HVAC and plumbing techs",
    maintenance: "handyman and maintenance providers",
    hottub: "hot tub service providers",
    pest: "pest control companies",
    trash: "trash valet services",
  };
  const cats = categoryIntro[p.category] || "service providers";

  return `Hey ${p.name} team,

I run a local directory for vacation rental owners in the Poconos (poconossrt.com). We list ${cats} that specifically do STR work in Monroe, Pike, Carbon, and Wayne counties.

I came across ${p.name} while building out our directory. Hosts in your area are always looking for reliable ${cats}, and I wanted to make sure you show up when they search.

I set up a basic profile for you on the site. Free, no strings attached. If you want to claim it and update your info, just reply to this email and I'll set it up.

Either way, wanted to let you know it exists.

Ryan Flanagan
Poconos STR Directory
partner@poconossrt.com`;
}

const providers = [
  { name: "Blue Titan Plumbing & Heating", email: "info@bluetitanhvac.com", category: "hvac" },
  { name: "Explore Poconos", email: "explorepoconosnow@gmail.com", category: "cleaning" },
  { name: "Forteca Cleaning", email: "fortecacleaning@gmail.com", category: "cleaning" },
  { name: "Hot Tub Hygiene", email: "Contact@Hottubhygiene.com", category: "hottub" },
  { name: "KMB Plumbing Electrical & HVAC", email: "info@kmbplumbing.com", category: "hvac" },
  { name: "L&L Pest Control", email: "info@landlpestcontrol.com", category: "pest" },
  { name: "Mountain Cleaning Services LLC", email: "strcleaningpoconos@mountaincleaningservicesllc.com", category: "cleaning" },
  { name: "NE Handyman LLC", email: "info@nehandymanllc.com", category: "maintenance" },
  { name: "Palmway Pools", email: "info@palmwaypools.com", category: "hottub" },
  { name: "Pocono Pool & Spa", email: "info@poconopoolandspa.com", category: "hottub" },
  { name: "Poconos Pest Control", email: "info@poconospestcontrol.com", category: "pest" },
  { name: "SolidStem", email: "info@solidstem.company", category: "maintenance" },
  { name: "The Pest Rangers", email: "info@thepestrangers.com", category: "pest" },
  { name: "The Poconos Handyman", email: "ThePoconosHandyman@gmail.com", category: "maintenance" },
  { name: "The Tidy Bear", email: "info@thetidybear.com", category: "trash" },
  { name: "Ultimate Plumbing Heating & Air", email: "info@ultimateplumbingheatingair.com", category: "hvac" },
];

const isDryRun = process.argv.includes("--dry-run");

async function main() {
  if (!RESEND_API_KEY) { console.error("RESEND_API_KEY not found"); process.exit(1); }

  console.log(`\n=== Provider Outreach: ${isDryRun ? "DRY RUN" : "LIVE"} ===`);
  console.log(`From: Ryan Flanagan <partner@poconossrt.com>`);
  console.log(`Recipients: ${providers.length}\n`);

  let sent = 0, failed = 0;
  for (const p of providers) {
    const subject = `Poconos STR Directory -- ${p.name}`;
    const body = buildMessage(p);
    if (isDryRun) {
      console.log(`[DRY] ${p.email} (${p.name})`);
      sent++;
    } else {
      process.stdout.write(`${p.name} -> ${p.email}... `);
      const ok = await sendEmail(p.email, subject, body);
      if (ok) { sent++; console.log("OK"); } else { failed++; console.log("FAIL"); }
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  console.log(`\n=== Done: ${sent} sent, ${failed} failed ===\n`);
}

main();
