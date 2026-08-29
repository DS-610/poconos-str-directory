# Go-Live Checklist: Stripe Test Mode to Live + Custom Domain

## Phase 1: Stripe Account Verification (do in Stripe Dashboard only)

1. Stripe Dashboard → Settings → Business settings → **Complete every field**:
   - Business legal name
   - Business address
   - Business type (LLC, Sole Proprietorship, etc.)
   - Tax ID (EIN or SSN)
   - Website URL: `https://poconossrt.com`
   - Phone number
   - Bank account details (for payouts)
2. Stripe Dashboard → Settings → **Professional settings**:
   - Add a custom statement descriptor (e.g. "POCLSRT DIRECTORY")
   - Add customer service email/phone (shows on receipts)
3. Wait for Stripe to mark your account **Verified** ✓
   (This can take a few minutes. You can test products while pending.)

## Phase 2: Create Live Products in Stripe

1. Stripe Dashboard → toggle **Live** mode (top bar)
2. Go to **Developers → API keys → Live**
3. Copy the live keys:
   - `pk_live_...` (publishable)
   - `sk_live_...` (secret)
4. Go to **Products** → create the 5 live products:
   - Standard Provider - $75/mo
   - Premium Provider - $150/mo
   - Featured Provider - $250/mo
   - Pro Host - $15/mo
   - Property Manager - $49/mo
5. Each product creates its own Price ID in live mode (e.g. `price_1XYZ...live...`)
6. Write down these live price IDs — you'll need them

## Phase 3: Update Environment Variables

Update ALL of these in Vercel → Project → Settings → Environment Variables
(Set for Production AND you should keep separate test staging env too.)

### Stripe live keys
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_YOUR_KEY
STRIPE_SECRET_KEY = sk_live_YOUR_KEY
```

### Stripe live webhook secret (update after creating live webhook)
```
STRIPE_WEBHOOK_SECRET = whsec_YOUR_LIVE_SECRET
```

### Stripe live price IDs (replace test price IDs)
```
STRIPE_PRICE_STANDARD = price_live_...
STRIPE_PRICE_PREMIUM = price_live_...
STRIPE_PRICE_FEATURED = price_live_...
STRIPE_PRICE_PRO_HOST = price_live_...
STRIPE_PRICE_PROPERTY_MANAGER = price_live_...
```

### Site URL (for redirects + sitemap)
```
NEXT_PUBLIC_SITE_URL = https://poconossrt.com
```

### Supabase (if not already set)
```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key
```

7. **Save** → **Redeploy** in Vercel.

## Phase 4: Stripe Webhook (Live)

1. Stripe Dashboard → toggle **Live** mode
2. Developers → Webhooks → **Add endpoint**
3. Endpoint URL:
   ```
   https://poconossrt.com/api/webhooks
   ```
4. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **Add endpoint**
6. Copy the **Signing secret** and paste into
   `STRIPE_WEBHOOK_SECRET` env var in Vercel
7. Redeploy.

## Phase 5: DNS + Domain (Vercel + Cloudflare/Namecheap)

See the next file in this directory: `DOMAIN-CONNECTION.md`

## Phase 6: Final Verification

1. Visit `https://poconossrt.com/pricing`
2. Click "Upgrade to Standard"
3. Stripe Checkout should show the live checkout (green header, real price)
4. Use a real (non-test) card OR complete in test mode one more time
5. Check Stripe Dashboard → Developers → Webhooks → Logs → see the webhook fire
6. Visit `https://poconossrt.com/sitemap.xml` and verify URLs use your domain

---

## Test Mode Reminder

While testing in live mode is not possible, keep your test keys handy.
To switch back to test mode simply swap the env var values again and redeploy.
The price IDs, webhook secret, and keys are the only things that change —
no code changes are required.
