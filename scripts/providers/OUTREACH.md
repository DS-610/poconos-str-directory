# Provider Outreach Tool

Automates emailing local Poconos STR service providers to build your directory.

## Quick Start

```bash
# 1. Preview what emails would be sent (no sending, no DB needed)
npm run outreach:dry

# 2. Send for real (requires Supabase + SMTP or Composio)
npm run outreach:send
```

## Files

| File | Purpose |
|---|---|
| `outreach-targets.csv` | List of 18 target providers to email |
| `outreach.ts` | The outreach script |
| `provider-import-template.csv` | Template for manually importing providers (existing) |
| `seed.ts` | Seed demo providers into Supabase (existing) |

## Environment Variables

### Option A — SMTP (default, simplest)
```env
EMAIL_METHOD=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@email.com
SMTP_PASS=your-app-password
SMTP_FROM=your@email.com
```

### Option B — Composio Gmail
```env
EMAIL_METHOD=composio
COMPOSIO_API_KEY=your-composio-key
```
Then connect your Gmail account:
```bash
composio link gmail
```

### Required (always)
```env
NEXT_PUBLIC_SITE_URL=https://poconossrt.com
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## CSV Columns

- `business_name` — Company name
- `contact_name` — Individual contact (optional, used for personalization)
- `category` — cleaning, hottub, maintenance, hvac, pest, electrical, plumbing, landscaping, snow-removal, trash
- `town` — Primary service town
- `phone` — Business phone
- `email` — Contact email (or leave empty to email via website domain)
- `website` — Company website
- `notes` — Internal notes (not sent)

## How It Works

1. Reads providers from `outreach-targets.csv`
2. Renders a personalized email template for each
3. Sends via SMTP or Composio Gmail
4. Upserts the provider into Supabase with `outreach_status: 'emailed'`
5. Skips providers already contacted (tracked via `outreach_email_count`)

## Email Template

Subject: `Free listing for [Business Name] on the Poconos STR Directory`

Body: Personalized with the contact's name, business name, category, and town. Explains the free directory, includes a 30-second signup link, and offers to add the listing manually if they prefer.

## Expanding the Target List

Add rows to `outreach-targets.csv` — the script will pick them up automatically.
