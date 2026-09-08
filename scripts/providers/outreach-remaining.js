const https = require('https');
const fs = require('fs');

// Load env
const env = {};
for (const line of fs.readFileSync('/root/Easton/.env.local', 'utf-8').split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const i = t.indexOf('=');
  if (i > 0) env[t.slice(0,i)] = t.slice(i+1).trim();
}

const RESEND_KEY = env.RESEND_API_KEY;
const SENT_LOG = '/root/Easton/scripts/providers/.sent-emails.log';

// Already sent
const sentEmails = new Set(
  fs.readFileSync(SENT_LOG, 'utf-8').split('\n').map(e => e.trim().toLowerCase()).filter(Boolean)
);

// Parse CSV
const csv = fs.readFileSync('/root/Easton/scripts/providers/outreach-targets-v2.csv', 'utf-8');
const lines = csv.split('\n');
const pending = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (const char of line) {
    if (char === '"') { inQuotes = !inQuotes; continue; }
    if (char === ',' && !inQuotes) { fields.push(current); current = ''; continue; }
    current += char;
  }
  fields.push(current);

  const category = fields[0]?.trim() || '';
  const hub = fields[1]?.trim() || '';
  const business = fields[2]?.trim() || '';
  const phone = fields[3]?.trim() || '';
  const email = fields[4]?.trim().toLowerCase() || '';
  const website = fields[5]?.trim() || '';

  if (!email || !email.includes('@') || sentEmails.has(email)) continue;

  // Map category to readable form
  let categoryReadable = category;
  if (category.includes('Cleaning') || category.includes('cleaning')) categoryReadable = 'cleaning';
  else if (category.includes('Hot Tub') || category.includes('hot tub')) categoryReadable = 'hot tub service';
  else if (category.includes('Handyman') || category.includes('handyman') || category.includes('property repairs')) categoryReadable = 'handyman';
  else if (category.includes('HVAC') || category.includes('plumbing')) categoryReadable = 'HVAC/plumbing';
  else if (category.includes('Pest')) categoryReadable = 'pest control';
  else if (category.includes('Trash') || category.includes('trash')) categoryReadable = 'trash/valet';
  else if (category.includes('Septic')) categoryReadable = 'septic service';
  else if (category.includes('Window') || category.includes('power wash')) categoryReadable = 'exterior cleaning';
  else if (category.includes('Property Management') || category.includes('Co-Hosting')) categoryReadable = 'property management';

  pending.push({ email, business, category: categoryReadable, hub, website, phone });
}

console.log('Pending emails to send:', pending.length);

function sendEmail(to, subject, html) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      from: 'partner@poconosstr.com',
      to,
      subject,
      html
    });
    const req = https.request({
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + RESEND_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.write(data);
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function buildEmail(target) {
  const town = target.hub.replace(/ PA$/, '');
  
  // PM companies get a different email
  if (target.category.includes('property management')) {
    return {
      subject: 'quick question about your Poconos properties',
      html: `<p>Hi ${target.business} team,</p>
<p>I run a local directory for vacation rental owners in the Poconos (<a href="https://poconosstr.com">poconosstr.com</a>). We list service providers — cleaners, HVAC, plumbers, handyman — that specifically do STR work in Monroe, Pike, Carbon, and Wayne counties.</p>
<p>I found ${target.business} while looking into property management in the ${town} area. I'm reaching out because I think there's a natural fit here.</p>
<p>We're building a partner program for PM companies that manage multiple rentals. The idea is simple: you get bulk access to our provider network for your properties, and we get exposure to your owner network through referrals.</p>
<p>Would love to chat for 10 minutes about what that could look like. No pitch — just want to see if it makes sense.</p>
<p>Ryan Flanagan<br>Poconos STR Directory<br><a href="mailto:partner@poconosstr.com">partner@poconosstr.com</a></p>`
    };
  }

  // Standard provider recruitment email
  return {
    subject: 'Your business on Poconos STR Directory',
    html: `<p>Hey ${target.business} team,</p>
<p>I run a local directory for vacation rental owners in the Poconos (<a href="https://poconosstr.com">poconosstr.com</a>). We list ${target.category} providers that specifically do STR work in Monroe, Pike, Carbon, and Wayne counties.</p>
<p>I came across ${target.business} while building out our directory. Hosts in ${town} are always looking for reliable help, and I wanted to make sure you show up when they search.</p>
<p>I set up a basic profile for you on the site. Free, no strings attached. If you want to claim it and update your info — add photos, reviews, and a fuller description — just reply to this email and I'll set it up.</p>
<p>Either way, wanted to let you know it exists. Check it out: <a href="https://poconosstr.com">poconosstr.com</a></p>
<p>Ryan Flanagan<br>Poconos STR Directory<br><a href="mailto:partner@poconosstr.com">partner@poconosstr.com</a></p>`
  };
}

async function main() {
  let sent = 0;
  const BATCH_LIMIT = 17; // Only send remaining, save room for replies
  
  for (const target of pending.slice(0, BATCH_LIMIT)) {
    const { subject, html } = buildEmail(target);
    const result = await sendEmail(target.email, subject, html);
    
    if (result.status === 200) {
      sent++;
      fs.appendFileSync(SENT_LOG, target.email + '\n');
      console.log('✅ Sent #' + sent + ':', target.email, '|', target.business);
    } else {
      console.log('❌ Failed:', target.email, '|', result.status, result.body.substring(0, 100));
    }
    
    // Rate limit: 1 email per second
    await sleep(1200);
  }
  
  console.log('\\n=== DONE: Sent ' + sent + ' of ' + Math.min(pending.length, BATCH_LIMIT) + ' ===');
}

main().catch(console.error);
