const https = require('https');
const fs = require('fs');

const env = {};
for (const line of fs.readFileSync('/root/Easton/.env.local', 'utf-8').split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const i = t.indexOf('=');
  if (i > 0) env[t.slice(0,i)] = t.slice(i+1).trim();
}

const RESEND_KEY = env.RESEND_API_KEY;

const POSTS = [
  {
    title: 'Post 1: Value-First (Poconos Airbnb Hosts Group)',
    group: 'Poconos Airbnb Hosts / Vacation Rental Owners',
    content: "Hey everyone 👋\n\nI've been managing a rental in the Poconos for a while now and one thing that always annoyed me was finding reliable service providers. Facebook groups are great but you end up asking the same questions over and over.\n\nSo I built a free directory specifically for us: poconosstr.com\n\nIt's a searchable list of vetted local providers — cleaners, handymen, HVAC, plumbers, pest control, hot tub service, trash valet — all focused for STR work in Monroe/Pike/Carbon/Wayne counties.\n\nIt's free to use — no account needed. Check it out and let me know if any of your favorite providers are missing, I'll add them."
  },
  {
    title: 'Post 2: Casual Question',
    group: 'Pocono Real Estate / STR Investors',
    content: "Question for everyone here — when you need a last-minute cleaner for a same-day turnover, where do you find them?\n\nI've been building poconosstr.com, a local directory of service providers that specifically do STR work in the Poconos.\n\nRight now it has about 20 local providers listed with their service areas, response times, and whether they're insured. Free to browse.\n\nIf any of your go-to providers aren't on there, drop their name in the comments and I'll add them."
  },
  {
    title: 'Post 3: Problem-Solution',
    group: 'Monroe County Short Term Rentals',
    content: "Every Poconos host knows the Sunday 4pm panic — guest checks in tomorrow, cleaner just canceled, need someone NOW.\n\nI got tired of that scramble so I built poconosstr.com — a directory of local providers that actually understand STR timelines.\n\nYou can filter by county, category, or town. No sign-up needed to browse.\n\nWould love feedback from other hosts — what providers are missing?"
  },
  {
    title: 'Post 4: Blog — Best Cleaning Services',
    group: 'Any Poconos Host Group',
    content: "New blog post: Best Cleaning Services in the Poconos for Airbnb Turnovers — covering what to look for, red flags, and vetted cleaners who do same-day turnovers.\n\nRead: poconosstr.com/blog/best-cleaning-services-poconos-airbnb\n\nIf you have a cleaner you love that's not on the list, let me know and I'll add them."
  },
  {
    title: 'Post 5: Blog — HVAC Winterization',
    group: 'Poconos Property Management',
    content: "Winter is coming — here's my guide to HVAC winterization for Poconos vacation rentals: poconosstr.com/blog/poconos-hvac-winterization-guide\n\nCovers pipes, heating systems, and emergency contacts if something goes wrong mid-season."
  },
  {
    title: 'Post 6: Blog — Hot Tub Maintenance',
    group: 'Poconos Airbnb Hosts',
    content: "Hot tub maintenance between guests — here's what you need to know: poconosstr.com/blog/hot-tub-maintenance-vacation-rental\n\nChemical balancing, drain/refill schedules, and local hot tub services that do STR work."
  },
  {
    title: 'Post 7: Direct Call-to-Action',
    group: 'Pocono Vacation Rental Owners',
    content: "POCONOS HOSTS — I made something for us.\n\npoconosstr.com is a free directory of local service providers that do STR work. No more digging through Facebook comments to find a plumber.\n\nSearch by category or county. Every provider shows coverage area and response time.\n\nBookmark it. You'll need it next time a guest texts about a broken water heater at 9pm."
  },
  {
    title: 'Post 8: Reddit Cross-post',
    group: 'r/AirBnB + r/shorttermrentals',
    content: "I manage a short-term rental in the Poconos and got frustrated finding reliable local service providers.\n\nSo I built poconosstr.com — a searchable directory of vetted local providers for STR hosts in the Pocono Mountains.\n\nLists: Turnover cleaning, HVAC/plumbing, Handyman, Hot tub service, Pest control, Trash valet.\n\nFree to browse. Would love feedback — what providers or categories are we missing?"
  }
];

const STATE_FILE = '/root/Easton/scripts/marketing/.fb-reminder-state.json';
let state = { nextPost: 0, lastSent: null };
try { state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8')); } catch {}

const postIndex = state.nextPost % POSTS.length;
const post = POSTS[postIndex];

function sendEmail(to, subject, html) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ from: 'partner@poconosstr.com', to, subject, html });
    const req = https.request({
      hostname: 'api.resend.com', path: '/emails', method: 'POST',
      headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, res => { let body = ''; res.on('data', c => body += c); res.on('end', () => resolve({ status: res.statusCode, body })); });
    req.write(data); req.end();
  });
}

async function main() {
  console.log('Post #' + (postIndex + 1) + ': ' + post.title);
  console.log('Group: ' + post.group);
  const html = '<h2>Facebook Post Reminder — #' + (postIndex + 1) + '</h2><p><b>Target:</b> ' + post.group + '</p><p><b>' + post.title + '</b></p><hr><div style="background:#f5f5f5;padding:20px;border-radius:8px;white-space:pre-wrap;font-family:monospace;font-size:14px;">' + post.content + '</div><hr><p>Copy the text above, go to <b>' + post.group + '</b> on Facebook, and paste it as a new post.</p>';
  const result = await sendEmail('flanaganr610@gmail.com', '[ACTION] Facebook Post Today: ' + post.title, html);
  console.log('Result:', result.status, result.body.substring(0, 100));
  state.nextPost = postIndex + 1;
  state.lastSent = new Date().toISOString();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  console.log('Next post will be #' + ((state.nextPost % POSTS.length) + 1));
}
main().catch(console.error);
