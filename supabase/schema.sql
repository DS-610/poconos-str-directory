-- Poconos STR Directory Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text check (role in ('provider', 'host', 'admin')) default 'host',
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_tier text,
  subscription_status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Providers table
create table public.providers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  slug text unique not null,
  name text not null,
  category text not null,
  counties text[] not null default '{}',
  service_areas text[] not null default '{}',
  tier text check (tier in ('free', 'standard', 'premium', 'featured')) default 'free',
  phone text,
  email text,
  website text,
  rating numeric(3,2) default 0,
  review_count integer default 0,
  verified boolean default false,
  tagline text,
  description text,
  services text[] not null default '{}',
  response_time text,
  insured boolean default false,
  licensed boolean default false,
  year_founded integer,
  price_note text,
  pricing_notes text,
  photo_url text,
  is_demo boolean default false,
  featured_resorts text[] default ARRAY[]::text[],
  is_active boolean default true,
  outreach_status text check (outreach_status in ('pending', 'emailed', 'responded', 'claimed')) default 'pending',
  outreach_contacted_at timestamptz,
  outreach_notes text,
  outreach_email_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Host favorites
create table public.host_favorites (
  id uuid primary key default uuid_generate_v4(),
  host_id uuid references public.profiles(id) on delete cascade,
  provider_id uuid references public.providers(id) on delete cascade,
  created_at timestamptz default now(),
  unique(host_id, provider_id)
);

-- Quote requests
create table public.quote_requests (
  id uuid primary key default uuid_generate_v4(),
  host_id uuid references public.profiles(id) on delete set null,
  provider_id uuid references public.providers(id) on delete cascade,
  message text,
  property_address text,
  service_needed text,
  preferred_date date,
  status text check (status in ('pending', 'responded', 'completed', 'declined')) default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Reviews
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  provider_id uuid references public.providers(id) on delete cascade,
  reviewer_name text not null,
  rating integer check (rating between 1 and 5) not null,
  comment text,
  created_at timestamptz default now()
);

-- Indexes
create index idx_providers_category on public.providers(category);
create index idx_providers_counties on public.providers using gin(counties);
create index idx_providers_tier on public.providers(tier);
create index idx_providers_outreach_status on public.providers(outreach_status);
create index idx_providers_slug on public.providers(slug);
create index idx_host_favorites_host on public.host_favorites(host_id);
create index idx_quote_requests_provider on public.quote_requests(provider_id);
create index idx_reviews_provider on public.reviews(provider_id);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.providers enable row level security;
alter table public.host_favorites enable row level security;
alter table public.quote_requests enable row level security;
alter table public.reviews enable row level security;

-- Profiles: users can read/update their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Providers: anyone can read, only owner/admin can update
create policy "Anyone can view active providers" on public.providers
  for select using (is_active = true);
create policy "Provider owner can update" on public.providers
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    or user_id = auth.uid()
  );
create policy "Provider owner can insert" on public.providers
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    or user_id = auth.uid()
  );

-- Host favorites: users can manage their own
create policy "Users can view own favorites" on public.host_favorites
  for select using (auth.uid() = host_id);
create policy "Users can add favorites" on public.host_favorites
  for insert with check (auth.uid() = host_id);
create policy "Users can remove favorites" on public.host_favorites
  for delete using (auth.uid() = host_id);

-- Quote requests: hosts can create, providers can view/respond
create policy "Hosts can create quotes" on public.quote_requests
  for insert with check (auth.uid() = host_id);
create policy "Hosts can view own quotes" on public.quote_requests
  for select using (auth.uid() = host_id);
create policy "Providers can view quotes for them" on public.quote_requests
  for select using (
    exists (select 1 from public.providers where id = provider_id and user_id = auth.uid())
  );
create policy "Providers can update quotes" on public.quote_requests
  for update using (
    exists (select 1 from public.providers where id = provider_id and user_id = auth.uid())
  );

-- Reviews: anyone can read, authenticated users can create
create policy "Anyone can view reviews" on public.reviews
  for select using (true);
create policy "Authenticated users can create reviews" on public.reviews
  for insert with check (auth.uid() is not null);

-- Function to auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function update_updated_at();
create trigger providers_updated_at before update on public.providers
  for each row execute function update_updated_at();
create trigger quote_requests_updated_at before update on public.quote_requests
  for each row execute function update_updated_at();

-- Function to update provider rating when reviews change
create or replace function update_provider_rating()
returns trigger as $$
begin
  update public.providers
  set rating = (select round(avg(rating), 2) from public.reviews where provider_id = coalesce(new.provider_id, old.provider_id)),
      review_count = (select count(*) from public.reviews where provider_id = coalesce(new.provider_id, old.provider_id))
  where id = coalesce(new.provider_id, old.provider_id);
  return coalesce(new, old);
end;
$$ language plpgsql;

create trigger reviews_rating_update after insert or update or delete on public.reviews
  for each row execute function update_provider_rating();
