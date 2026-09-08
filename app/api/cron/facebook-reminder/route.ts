import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';

const RESEND_KEY = process.env.RESEND_API_KEY;

const POSTS = [
  { title: 'Post 1: Value-First', group: 'Poconos Airbnb Hosts', content: "Hey everyone 👋\n\nI've been managing a rental in the Poconos for a while now and one thing that always annoyed me was finding reliable service providers. Facebook groups are great but you end up asking the same questions over and over.\n\nSo I built a free directory specifically for us: poconosstr.com\n\nIt's a searchable list of vetted local providers — cleaners, handymen, HVAC, plumbers, pest control, hot tub service, trash valet — all focused for STR work in Monroe/Pike/Carbon/Wayne counties.\n\nIt's free to use — no account needed. Check it out and let me know if any of your favorite providers are missing, I'll add them." },
  { title: 'Post 2: Casual Question', group: 'Pocono Real Estate / STR Investors', content: "Question for everyone here — when you need a last-minute cleaner for a same-day turnover, where do you find them?\n\nI've been building poconosstr.com, a local directory of service providers that specifically do STR work in the Poconos.\n\nRight now it has about 20 local providers listed with their service areas, response times, and whether they're insured. Free to browse.\n\nIf any of your go-to providers aren't on there, drop their name in the comments and I'll add them." },
  { title: 'Post 3: Problem-Solution', group: 'Monroe County Short Term Rentals', content: "Every Poconos host knows the Sunday 4pm panic — guest checks in tomorrow, cleaner just canceled, need someone NOW.\n\nI got tired of that scramble so I built poconosstr.com — a directory of local providers that actually understand STR timelines.\n\nYou can filter by county, category, or town. No sign-up needed to browse.\n\nWould love feedback from other hosts — what providers are missing?" },
  { title: 'Post 4: Blog — Best Cleaning Services', group: 'Any Poconos Host Group', content: "New blog post: Best Cleaning Services in the Poconos for Airbnb Turnovers.\n\nRead: poconosstr.com/blog/best-cleaning-services-poconos-airbnb\n\nIf you have a cleaner you love that's not on the list, let me know and I'll add them." },
  { title: 'Post 5: Blog — HVAC Winterization', group: 'Poconos Property Management', content: "Winter is coming — here's my guide to HVAC winterization for Poconos vacation rentals: poconosstr.com/blog/poconos-hvac-winterization-guide\n\nCovers pipes, heating systems, and emergency contacts." },
  { title: 'Post 6: Blog — Hot Tub Maintenance', group: 'Poconos Airbnb Hosts', content: "Hot tub maintenance between guests: poconosstr.com/blog/hot-tub-maintenance-vacation-rental\n\nChemical balancing, drain/refill schedules, and local hot tub services." },
  { title: 'Post 7: Direct CTA', group: 'Pocono Vacation Rental Owners', content: "POCONOS HOSTS — I made something for us.\n\npoconosstr.com is a free directory of local service providers that do STR work. Search by category or county. Bookmark it." },
  { title: 'Post 8: Reddit Cross-post', group: 'r/AirBnB + r/shorttermrentals', content: "I built poconosstr.com — a searchable directory of vetted local providers for STR hosts in the Pocono Mountains. Free to browse. Would love feedback." }
];

const STATE_FILE = '/tmp/.fb-reminder-state.json';

function getNextPostIndex(): number {
  try { const s = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8')); return s.nextPost || 0; } catch { return 0; }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const postIndex = getNextPostIndex();
  const post = POSTS[postIndex % POSTS.length];

  const html = `<h2>Facebook Post Reminder — #${(postIndex % POSTS.length) + 1}</h2><p><b>Target:</b> ${post.group}</p><p><b>${post.title}</b></p><hr><div style="background:#f5f5f5;padding:20px;border-radius:8px;white-space:pre-wrap;font-family:monospace;font-size:14px;">${post.content}</div><hr><p>Copy the text above, go to <b>${post.group}</b> on Facebook, and paste it as a new post.</p>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'partner@poconosstr.com', to: 'flanaganr610@gmail.com', subject: `[ACTION] Facebook Post Today: ${post.title}`, html })
  });

  const data = await res.json();
  fs.writeFileSync(STATE_FILE, JSON.stringify({ nextPost: postIndex + 1, lastSent: new Date().toISOString() }));

  return NextResponse.json({ success: true, post: post.title, emailId: data.id });
}
