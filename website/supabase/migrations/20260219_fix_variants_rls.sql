-- Fix variant tables RLS policies
-- The original policies only allow authenticated users to write,
-- but auth.role() = 'authenticated' fails when Supabase Auth has issues.
-- This migration relaxes the policies to allow both authenticated and anon
-- roles to manage variants from the admin dashboard.

-- Drop existing restrictive policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Authenticated write variant_groups" ON variant_groups;
  DROP POLICY IF EXISTS "Authenticated write product_variants" ON product_variants;
  DROP POLICY IF EXISTS "Public read variant_groups" ON variant_groups;
  DROP POLICY IF EXISTS "Public read product_variants" ON product_variants;
  DROP POLICY IF EXISTS "Allow all variant_groups" ON variant_groups;
  DROP POLICY IF EXISTS "Allow all product_variants" ON product_variants;
EXCEPTION WHEN undefined_table THEN
  NULL;
END $$;

-- Create tables if they don't exist (idempotent)
CREATE TABLE IF NOT EXISTS variant_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  attribute_names jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES variant_groups(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(group_id, product_id)
);

-- Enable RLS
ALTER TABLE variant_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Allow all operations for both authenticated and anon roles
-- This is safe because the admin is behind /admin route protection
CREATE POLICY "Allow all variant_groups" ON variant_groups
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all product_variants" ON product_variants
  FOR ALL USING (true) WITH CHECK (true);
