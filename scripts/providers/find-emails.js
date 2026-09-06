const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const { parse } = require("csv-parse/sync");
const { stringify } = require("csv-stringify/sync");

const INPUT_CSV = path.join(__dirname, "poconos-master-directory.csv");
const PROGRESS_FILE = path.join(__dirname, ".email-finder-progress.jsonl");
const OUTPUT_CSV = path.join(__dirname, "poconos-master-with-emails.csv");

const CONCURRENCY = 1;
const DELAY_MS = 1200;
const TIMEOUT_MS = 12000;
const MAX_PAGES = 3;

const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
const FALSE_POSITIVE_DOMAINS = new Set([
  "example.com", "yourdomain.com", "domain.com", "email.com",
  "sentry.io", "wixpress.com", "schema.org", "example.org",
  "test.com", "localhost", "yourwebsite.com", "website.com",
]);
const FALSE_POSITIVE_PREFIXES = [
  "noreply", "no-reply", "donotreply", "mailer-daemon",
  "postmaster", "hostmaster",
];

const CONTACT_PATHS = ["/", "/contact", "/contact-us", "/about"];

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

function loadProgress() {
  const done = new Map();
  if (fs.existsSync(PROGRESS_FILE)) {
    for (const line of fs.readFileSync(PROGRESS_FILE, "utf-8").split("\n")) {
      if (!line.trim()) continue;
      try {
        const r = JSON.parse(line);
        done.set(r.domain, r.emails);
      } catch {}
    }
  }
  return done;
}

function saveProgress(domain, emails) {
  fs.appendFileSync(PROGRESS_FILE, JSON.stringify({ domain, emails }) + "\n");
}

function extractEmails(html) {
  const found = new Set();
  const mailtoMatch = html.matchAll(/mailto:([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/gi);
  for (const m of mailtoMatch) found.add(m[1].toLowerCase());
  const textEmails = html.matchAll(EMAIL_REGEX);
  for (const m of textEmails) found.add(m[0].toLowerCase());
  return [...found].filter((e) => {
    const domain = e.split("@")[1];
    if (FALSE_POSITIVE_DOMAINS.has(domain)) return false;
    for (const p of FALSE_POSITIVE_PREFIXES) {
      if (e.startsWith(p)) return false;
    }
    if (/\.(png|jpg|jpeg|svg|webp|gif|css|js|woff|ttf)$/i.test(e)) return false;
    if (e.includes("@2x") || e.includes("@3x")) return false;
    return true;
  });
}

function classifyEmails(emails, siteDomain) {
  const result = { primary: "", secondary: "", all: [] };
  const siteBase = siteDomain.replace("www.", "").split(".")[0];
  for (const e of emails) {
    const emailDomain = e.split("@")[1].replace("www.", "").split(".")[0];
    const isDomainMatch = emailDomain === siteBase;
    result.all.push({ email: e, domainMatch: isDomainMatch });
  }
  const sorted = result.all.sort((a, b) => {
    if (a.domainMatch !== b.domainMatch) return a.domainMatch ? -1 : 1;
    const order = ["info", "contact", "hello", "office", "admin"];
    const ai = order.indexOf(a.email.split("@")[0]);
    const bi = order.indexOf(b.email.split("@")[0]);
    if (ai !== -1 && bi === -1) return -1;
    if (bi !== -1 && ai === -1) return 1;
    return ai - bi;
  });
  if (sorted.length > 0) result.primary = sorted[0].email;
  if (sorted.length > 1) result.secondary = sorted[1].email;
  return result;
}

function fetchPage(urlStr) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), TIMEOUT_MS);
    const url = new URL(urlStr);
    const mod = url.protocol === "https:" ? https : http;
    const opts = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      family: 4,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PoconosSTRBot/1.0)",
        "Accept": "text/html,*/*",
        "Accept-Encoding": "identity",
      },
      timeout: TIMEOUT_MS,
    };
    const req = mod.get(opts, (res) => {
      clearTimeout(timer);
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        try {
          const redir = new URL(res.headers.location, urlStr).toString();
          res.resume();
          fetchPage(redir).then(resolve);
        } catch { resolve(null); }
        return;
      }
      if (res.statusCode < 200 || res.statusCode >= 400) { res.resume(); resolve(null); return; }
      const ct = res.headers["content-type"] || "";
      if (!ct.includes("html") && !ct.includes("xml")) { res.resume(); resolve(null); return; }
      let data = "";
      res.on("data", (c) => { data += c; if (data.length > 120000) { res.destroy(); resolve(data); } });
      res.on("end", () => resolve(data));
      res.on("error", () => resolve(null));
    });
    req.on("error", () => { clearTimeout(timer); resolve(null); });
    req.on("timeout", () => { req.destroy(); clearTimeout(timer); resolve(null); });
  });
}

async function findEmailsForDomain(domain) {
  let allEmails = [];
  for (let i = 0; i < Math.min(MAX_PAGES, CONTACT_PATHS.length); i++) {
    const p = CONTACT_PATHS[i];
    const url = p === "/" ? `https://${domain}` : `https://${domain}${p}`;
    const html = await fetchPage(url);
    if (!html) continue;
    const found = extractEmails(html);
    allEmails.push(...found);
    if (allEmails.length >= 3) break;
  }
  const unique = [...new Set(allEmails)];
  return classifyEmails(unique, domain);
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function main() {
  loadEnv();
  const csvRaw = fs.readFileSync(INPUT_CSV, "utf-8");
  const records = parse(csvRaw, { columns: true, skip_empty_lines: true });
  const progress = loadProgress();

  console.log(`\n=== Email Finder ===`);
  console.log(`${records.length} businesses, ${progress.size} cached\n`);

  const domainMap = new Map();
  for (const r of records) {
    const website = (r.website || "").trim();
    if (!website) continue;
    try {
      const url = new URL(website.startsWith("http") ? website : `https://${website}`);
      const domain = url.hostname.replace("www.", "");
      if (!domainMap.has(domain)) domainMap.set(domain, []);
      domainMap.get(domain).push(r);
    } catch {}
  }

  const domains = [...domainMap.keys()];
  console.log(`Unique domains: ${domains.length}\n`);

  let processed = 0, emailsFound = 0, skipped = 0;

  for (let i = 0; i < domains.length; i += CONCURRENCY) {
    const batch = domains.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(async (domain) => {
      if (progress.has(domain)) { skipped++; return { domain, result: progress.get(domain) }; }
      const result = await findEmailsForDomain(domain);
      saveProgress(domain, result);
      processed++;
      if (result.primary) emailsFound++;
      return { domain, result };
    }));

    for (const { domain, result } of results) {
      for (const b of domainMap.get(domain)) {
        b._email = result.primary || "";
        b._secondary = result.secondary || "";
      }
    }

    if ((i + CONCURRENCY) % 25 === 0 || i + CONCURRENCY >= domains.length) {
      console.log(`  [${Math.min(i + CONCURRENCY, domains.length)}/${domains.length}] found: ${emailsFound} | cached: ${skipped}`);
    }
    await sleep(DELAY_MS);
  }

  console.log(`\nWriting output CSV...`);
  const enriched = records.map((r) => ({
    category: r.category,
    hub: r.hub,
    business: r.business,
    rating: r.rating,
    phone: r.phone,
    website: r.website,
    address: r.address,
    review_snippet: r.review_snippet,
    email: r._email || "",
    secondary_email: r._secondary || "",
  }));

  fs.writeFileSync(OUTPUT_CSV, stringify(enriched, { header: true }));

  const withEmail = enriched.filter((r) => r.email).length;
  console.log(`\nDone! ${processed} scanned, ${emailsFound} domains with email, ${withEmail}/${records.length} records have email.`);
  console.log(`Output: ${OUTPUT_CSV}\n`);
}

main().catch((e) => { console.error("Fatal:", e); process.exit(1); });
