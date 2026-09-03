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
    req.on("error", (e) => {
      console.error("  X Request error:", e.message);
      resolve(false);
    });
    req.write(data);
    req.end();
  });
}

// Personalized templates - plain text, conversational, no marketing words
function buildMessage(p) {
  const templates = {
    cleaning: `Hey ${p.name} team,

I run a local directory for short-term rental hosts in the Poconos (poconossrt.com). We list service providers that vacation rental owners actually use -- cleaners, HVAC, handyman, etc.

I came across ${p.name} while putting together our cleaning category for Monroe/Carbon counties. We already have hosts searching for turnover crews in your area.

I set up a basic profile for you on the site. Totally free, no catch -- just wanted to make sure you show up when local hosts search for cleaning services.

If you want to claim it and add your contact info, here's the link: poconossrt.com/pricing

No pressure either way. Just figured you'd want to know it exists.

Ryan Flanagan
Poconos STR Directory
partner@poconossrt.com`,

    hvac: `Hey ${p.name} team,

I run a local directory for short-term rental hosts in the Poconos (poconossrt.com). We list service providers that vacation rental owners rely on -- HVAC, plumbing, handyman, cleaners, etc.

I found ${p.name} while building out our HVAC category. There are a lot of vacation homes in Monroe/Carbon that need seasonal winterization and emergency service, and hosts are always looking for reliable HVAC techs.

I added a basic profile for you on the site. It's free -- just wanted to make sure you're visible when local STR owners search for heating and cooling help.

If you want to claim it and update your info: poconossrt.com/pricing

Totally fine if you're not interested. Just wanted to reach out.

Ryan Flanagan
Poconos STR Directory
partner@poconossrt.com`,

    maintenance: `Hey ${p.name} team,

I run a local directory for short-term rental hosts in the Poconos (poconossrt.com). We connect vacation rental owners with service providers -- handymen, cleaners, HVAC, plumbers, etc.

I came across ${p.name} while building our handyman/maintenance category for the area. Hosts constantly need repairs, drywall, furniture assembly -- the kind of stuff you probably do every week.

I put a basic listing together for you on the site. Free, no strings. Just wanted to make sure you show up when local STR owners look for maintenance help.

If you want to take ownership of it: poconossrt.com/pricing

Either way, thanks for the work you do out here.

Ryan Flanagan
Poconos STR Directory
partner@poconossrt.com`,

    pest: `Hey ${p.name} team,

I run a local directory for short-term rental hosts in the Poconos (poconossrt.com). We list service providers that vacation rental owners need -- cleaners, HVAC, handymen, pest control, etc.

I found ${p.name} while building our pest control category. Vacation homes in Monroe/Pike/Carbon always need seasonal treatments, and hosts are always hunting for someone reliable.

I set up a basic profile for you on the site. It's free -- just wanted to make sure you're visible when local STR owners search for pest control.

If you want to claim it and add your details: poconossrt.com/pricing

No pressure. Just thought you'd want to know.

Ryan Flanagan
Poconos STR Directory
partner@poconossrt.com`,

    hottub: `Hey ${p.name} team,

I run a local directory for short-term rental hosts in the Poconos (poconossrt.com). We connect vacation rental owners with service providers -- hot tub, cleaners, HVAC, handyman, etc.

I came across ${p.name} while building our hot tub service category. Almost every vacation rental in the Poconos has a hot tub, and hosts are always looking for someone who actually knows what they're doing with chemical balancing and maintenance.

I put a basic listing together for you on the site. Free, no catch. Just making sure you show up when local hosts search for hot tub service.

If you want to claim it: poconossrt.com/pricing

Either way, thanks.

Ryan Flanagan
Poconos STR Directory
partner@poconossrt.com`,

    trash: `Hey ${p.name} team,

I run a local directory for short-term rental hosts in the Poconos (poconossrt.com). We list service providers that vacation rental owners use -- trash valet, cleaners, HVAC, handyman, etc.

I found ${p.name} while building our trash valet category. Vacation rental hosts hate dealing with garbage day, and a service like yours is exactly what they're looking for.

I added a basic profile for you on the site. Totally free -- just wanted to make sure you're visible when local STR owners search for trash pickup help.

If you want to claim it: poconossrt.com/pricing

No pressure. Just thought it was worth a heads up.

Ryan Flanagan
Poconos STR Directory
partner@poconossrt.com`,
  };

  return templates[p.category] || templates.cleaning;
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
const singleTest = process.argv.includes("--test");

async function main() {
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY not found");
    process.exit(1);
  }

  const targets = singleTest ? [providers[0]] : providers;

  console.log(`\n=== Outreach v2 (plain text, 1-on-1 style): ${isDryRun ? "DRY RUN" : singleTest ? "TEST (1 email)" : "LIVE"} ===`);
  console.log(`From: Ryan Flanagan <partner@poconossrt.com>`);
  console.log(`Recipients: ${targets.length}\n`);

  let sent = 0, failed = 0;

  for (const p of targets) {
    const subject = `Poconos STR Directory -- ${p.name}`;
    const body = buildMessage(p);

    if (isDryRun) {
      console.log(`[DRY] ${p.email} (${p.name})`);
      console.log(`  Subject: ${subject}`);
      console.log(`  Preview: ${body.substring(0, 100)}...`);
      sent++;
    } else {
      process.stdout.write(`${p.name} -> ${p.email}... `);
      const ok = await sendEmail(p.email, subject, body);
      if (ok) { sent++; console.log("OK"); }
      else { failed++; console.log("FAIL"); }
      // 2 second gap between sends
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log(`\n=== Done: ${sent} sent, ${failed} failed ===\n`);
}

main();
