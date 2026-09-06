const https = require("https");
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

let RESEND_API_KEY = "";
const TARGETS_CSV = path.join(__dirname, "outreach-targets-v2.csv");
const SENT_LOG = path.join(__dirname, ".sent-emails.log");

function loadEnv() {
  const envPath = path.join(__dirname, "../../.env.local");
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i <= 0) continue;
      process.env[t.slice(0, i)] = t.slice(i + 1).trim();
    }
  }
}

function getSentEmails() {
  if (!fs.existsSync(SENT_LOG)) return new Set();
  return new Set(fs.readFileSync(SENT_LOG, "utf-8").split("\n").map(l => l.trim()).filter(Boolean));
}

function markSent(email) {
  fs.appendFileSync(SENT_LOG, email + "\n");
}

function sendEmail(to, subject, textBody) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      from: "Ryan Flanagan <partner@poconosstr.com>",
      to: [to],
      reply_to: "partner@poconosstr.com",
      subject: subject,
      text: textBody,
    });
    const req = https.request({
      hostname: "api.resend.com",
      path: "/emails",
      method: "POST",
      family: 4,
      headers: {
        Authorization: "Bearer " + RESEND_API_KEY,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    }, (res) => {
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(true);
        else { console.error("  X Resend " + res.statusCode + ": " + body.substring(0, 200)); resolve(false); }
      });
    });
    req.on("error", (e) => { console.error("  X Error: " + e.message); resolve(false); });
    req.write(data);
    req.end();
  });
}

function buildMessage(target) {
  const catMap = {
    "Turnover Cleaning Services": "cleaning crews",
    "HVAC and plumbing emergency service": "HVAC and plumbing techs",
    "Handyman and property repairs": "handyman and maintenance providers",
    "Hot Tub Maintenance service": "hot tub service providers",
    "Pest control services": "pest control companies",
    "Trash valet garbage removal": "trash valet services",
    "Property Management and Co-Hosting": "property management partners",
    "Septic pumping and inspection": "septic service providers",
    "Window cleaning and power washing": "window cleaning and pressure washing pros",
    "Chimney sweep and fireplace service": "chimney and fireplace specialists",
  };
  const catFriendly = catMap[target.category] || "service providers";
  const town = target.hub.replace(" PA", "");

  return "Hey " + target.business + " team,\n\n" +
    "I run a local directory for vacation rental owners in the Poconos (poconosstr.com). We list " + catFriendly + " that specifically do STR work in Monroe, Pike, Carbon, and Wayne counties.\n\n" +
    "I came across " + target.business + " while building out our directory. Hosts in " + town + " are always looking for reliable help, and I wanted to make sure you show up when they search.\n\n" +
    "I set up a basic profile for you on the site. Free, no strings attached. If you want to claim it and update your info \u2014 add photos, reviews, and a fuller description \u2014 just reply to this email and I'll set it up.\n\n" +
    "Either way, wanted to let you know it exists. Check it out: poconosstr.com/providers\n\n" +
    "Ryan Flanagan\nPoconos STR Directory\npartner@poconosstr.com";
}

async function main() {
  loadEnv();
  RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) { console.error("RESEND_API_KEY not found in .env.local"); process.exit(1); }

  const csvRaw = fs.readFileSync(TARGETS_CSV, "utf-8");
  const targets = parse(csvRaw, { columns: true, skip_empty_lines: true });
  const withEmail = targets.filter((t) => t.email && t.email.includes("@"));

  const sent = getSentEmails();
  const unsent = withEmail.filter((t) => !sent.has(t.email.toLowerCase()));

  const isDryRun = process.argv.includes("--dry-run");
  const limit = parseInt(process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1] || "0", 10);
  const category = process.argv.find((a) => a.startsWith("--category="))?.split("=")[1];

  let filtered = unsent;
  if (category) filtered = filtered.filter((t) => t.category.toLowerCase().includes(category.toLowerCase()));
  if (limit > 0) filtered = filtered.slice(0, limit);

  console.log("\n=== Provider Outreach v3: " + (isDryRun ? "DRY RUN" : "LIVE") + " ===");
  console.log("From: Ryan Flanagan <partner@poconosstr.com>");
  console.log("Already sent: " + sent.size + " | Remaining: " + unsent.length + " | This batch: " + filtered.length + "\n");

  let sentCount = 0, failed = 0;
  for (const t of filtered) {
    const subject = "Your business on Poconos STR Directory";
    const body = buildMessage(t);
    if (isDryRun) {
      console.log("[DRY] " + t.email + " | " + t.business + " (" + t.category + ")");
      sentCount++;
    } else {
      process.stdout.write(t.business.substring(0, 30).padEnd(30) + " -> " + t.email.substring(0, 35).padEnd(35) + "... ");
      const ok = await sendEmail(t.email, subject, body);
      if (ok) { sentCount++; markSent(t.email.toLowerCase()); console.log("OK"); }
      else { failed++; console.log("FAIL"); }
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  console.log("\n=== Done: " + sentCount + " sent, " + failed + " failed ===\n");
}

main();
