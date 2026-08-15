-- Run this in Supabase SQL Editor.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  price numeric(12,2) not null,
  image_url text not null,
  product_url text not null,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Public product browsing:
create policy "public can read products"
on public.products for select
to anon, authenticated
using (true);

-- IMPORTANT:
-- The demo admin page uses the publishable key, so INSERT/DELETE policies below
-- would make the admin password bypassable. Do NOT add public INSERT/DELETE policies
-- in production. Use a Supabase Edge Function/server endpoint with real admin auth.
--
-- For a quick local demo only, you may temporarily create policies, then remove them:
-- create policy "demo insert" on public.products for insert to anon, authenticated with check (true);
-- create policy "demo delete" on public.products for delete to anon, authenticated using (true);
