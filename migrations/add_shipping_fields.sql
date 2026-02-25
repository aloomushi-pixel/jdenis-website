-- Migration: Add shipping/queue fields to orders_b2b for Almacén PF workflow
-- These fields support the warehouse order queue and tracking system

ALTER TABLE orders_b2b
ADD COLUMN IF NOT EXISTS tracking_number text,
ADD COLUMN IF NOT EXISTS shipped_at timestamptz,
ADD COLUMN IF NOT EXISTS queued_for_date date,
ADD COLUMN IF NOT EXISTS packed_items jsonb DEFAULT '{}';

-- Index for efficient queue queries by date
CREATE INDEX IF NOT EXISTS idx_orders_b2b_queued_for_date
ON orders_b2b(queued_for_date)
WHERE queued_for_date IS NOT NULL;
