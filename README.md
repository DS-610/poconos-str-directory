# Poconos STR Directory

A vetted directory connecting short-term rental hosts with trusted local
service providers across Monroe, Pike, Carbon, and Wayne counties in the
Pocono Mountains. Built on Next.js (App Router), with seed data that can be
swapped for a Supabase-backed database.

## Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Data**: Local seed data in `lib/data.ts` (32 sample providers) — Supabase-ready
- **Payments**: Stripe-ready (see `.env.example`)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  page.tsx                  # Landing page
  providers/page.tsx        # Directory browse + search/filters
  providers/[slug]/page.tsx # Provider profile
  categories/page.tsx       # Category index
  categories/[slug]/page.tsx
  pricing/page.tsx          # Provider & host tiers
  about/page.tsx
components/
  Header.tsx  Footer.tsx  ProviderCard.tsx  ProviderFilters.tsx  CategoryCard.tsx
lib/
  types.ts    # Provider / Category / Tier types
  data.ts     # Categories + 32 seeded providers
  utils.ts    # Labels, formatting helpers
```

## Roadmap (needs accounts)

1. **Supabase**: replace `lib/data.ts` with a `providers` table + auth
   (provider accounts claim/upgrade listings; host accounts save favorites).
2. **Stripe**: subscriptions for the tiers on `app/pricing/page.tsx` with
   webhook-driven access.
3. **Deploy**: push to GitHub, import into Vercel, add env vars, point domain.

## Useful commands

```bash
npm run dev    # local dev server
npm run build  # production build
npm run lint   # eslint
```
