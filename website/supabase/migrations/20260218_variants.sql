-- Create table for Variant Groups (e.g., "Extensiones Mink", "Rulos Desechables")
create table if not exists variant_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  attribute_names jsonb not null default '[]'::jsonb, -- e.g., ["Curva", "Grosor"]
  created_at timestamptz default now()
);

-- Create table for Product Variants (linking a product to a group with specific attributes)
create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references variant_groups(id) on delete cascade,
  product_id text not null, -- Maps to products.ts ID or Supabase slug
  attributes jsonb not null default '{}'::jsonb, -- e.g., {"Curva": "C", "Grosor": "0.10"}
  created_at timestamptz default now(),
  unique(group_id, product_id)
);

-- Enable Row Level Security (RLS)
alter table variant_groups enable row level security;
alter table product_variants enable row level security;

-- Policies for public read access (so the store can fetch them)
create policy "Public read variant_groups" on variant_groups for select using (true);
create policy "Public read product_variants" on product_variants for select using (true);

-- Policies for authenticated write access (for the Admin Dashboard)
create policy "Authenticated write variant_groups" on variant_groups for all using (auth.role() = 'authenticated');
create policy "Authenticated write product_variants" on product_variants for all using (auth.role() = 'authenticated');
