# Custom Domain Connection Guide (poconossrt.com)

## Where to manage DNS

The domain is registered at whichever registrar you bought
`poconossrt.com` from. Common registrars:
- Cloudflare (recommended — also free DNS + proxy)
- Namecheap
- GoDaddy
- Google Domains

You can check your registrar:
```bash
whois poconossrt.com
```

## Step 1 — Add the domain in Vercel

1. Go to [vercel.com](https://vercel.com) → your `poconos-str-directory` project
2. **Settings → Domains** → **Add Domain**
3. Type `poconossrt.com` (apex/root) and `www.poconossrt.com` (subdomain)
4. Vercel will show you a **verification record** to add in your DNS:

   For the apex domain (`poconossrt.com`) Vercel assigns either:
   - An **A (ALIAS/ANAME)** record, OR
   - A **CNAME flatten** record

   Example Vercel-assigned records (exact values vary — use what Vercel tells you):
   | Type  | Name        | Value                       |
   |-------|-------------|-----------------------------|
   | CNAME | `www`       | `cname.vercel-dns.com`      |
   | A     | `@` (or blank) | 76.223.115.108 (or ALIAS → cname.vercel-dns.com) |

## Step 2 — Add DNS records at your registrar

### Option A: Cloudflare (fastest, with proxy)

1. Log in to Cloudflare → select your domain
2. **DNS** tab → **Add record** for each:

   | Type | Name | Content                  | Proxy status |
   |------|-------|--------------------------|--------------|
   | CNAME | www  | cname.vercel-dns.com     | Proxied (orange) |
   | CNAME | @    | cname.vercel-dns.com     | Proxied (orange) |
   | (optional A record if Cloudflare forces it) |

   (Using `CNAME` to CNAME `cname.vercel-dns.com` for both `@` and `www`
   works because Cloudflare supports CNAME flattening at the apex.)

3. Set SSL/TLS → Overview → **Full (strict)** — not Full or Off.

### Option B: Namecheap (using ALIAS/ANAME)

1. **Account → Domain List → poconossrt.com → Manage → Advanced DNS**

   For the **root domain (apex)**:
   - Create an **A (ALIAS/ANAME/ANAME)** record:
     | Host | Value |
     |------|-------|
     | @    | `cname.vercel-dns.com` |
   (If ALIAS/ANAME is not available, Namecheap usually offers the Vercel IPs. Ask Vercel support.)

   For the **www subdomain**:
   - Create a **CNAME**:
     | Host | Value | TTL |
     |------|-------|-----|
     | www  | `cname.vercel-dns.com` | Automatic |

### Option C: GoDaddy, Google Domains, etc.

   | Type | Host/Name | Points to / Value |
   |------|-----------|-------------------|
   | CNAME | www       | cname.vercel-dns.com |
   | ALIAS (or A/ANAME) | @ (root) | cname.vercel-dns.com |

## Step 3 — Force HTTPS

1. Vercel → Settings → **Domains** → click the domain → toggle **Force HTTPS** ON
2. After DNS propagates, all visitors get HTTPS automatically.
3. Visit `https://www.poconossrt.com` to confirm.

## Step 4 — Stripe verification uses the domain

In Stripe Dashboard → Settings → Business settings → set **Website URL**
to `https://poconossrt.com`.

## Optional: www → root redirect

Vercel handles this by default. In Vercel → Settings → Domains
→ click the `www` domain → check **Redirect → poconossrt.com**.

## What you should NOT do

- Do NOT use a simple `A` record to a single IP at the apex.
  Use ALIAS/ANAME/CNAME flattening or Vercel's assigned IPs.
- Do NOT point DNS to the old `*.vercel.app` URL — let Vercel verify
  the custom domain directly.
- Do NOT set a CNAME at the root (`@`) on registrars that don't
  support CNAME flattening — it creates a DNS conflict.

## Verify everything works

```bash
curl -s -o /dev/null -w "%{http_code}" https://poconossrt.com
# Should return 200

dig poconossrt.com +short
# Should show a Vercel edge IP (e.g. 76.223.115.108)

curl -s https://poconossrt.com/sitemap.xml
# Should return XML with https://poconossrt.com URLs
```

---

Vercel's edge IPs (in case your registrar asks):
  76.223.115.108
  216.150.14.1
  206.248.85.160
  146.202.72.11
