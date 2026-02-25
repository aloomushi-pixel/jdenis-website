-- Cart Promotion Configuration table
-- Stores configurable promotion rules for the shopping cart.
-- Run this SQL in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vqcjxzsibywdxpvkyysa/sql/new

CREATE TABLE IF NOT EXISTS cart_promo_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL DEFAULT 'Promoción del Carrito',
    is_active BOOLEAN NOT NULL DEFAULT true,
    min_amount NUMERIC NOT NULL DEFAULT 2000,
    min_items INTEGER NOT NULL DEFAULT 0,
    eval_mode TEXT NOT NULL DEFAULT 'OR' CHECK (eval_mode IN ('OR', 'AND')),
    discount_percent NUMERIC NOT NULL DEFAULT 0,
    free_shipping BOOLEAN NOT NULL DEFAULT true,
    standard_shipping_cost NUMERIC NOT NULL DEFAULT 200,
    activation_message TEXT NOT NULL DEFAULT '¡Excelente! Tu compra supera los $2,000 MXN y acabamos de activar Envío Gratis en tu carrito 🎉',
    deactivation_message TEXT NOT NULL DEFAULT 'El envío gratis se ha retirado porque tu carrito ya no alcanza los $2,000 MXN.',
    progress_label TEXT NOT NULL DEFAULT 'Agrega ${remaining} MXN más para desbloquear Envío Gratis 🚚',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default config row
INSERT INTO cart_promo_config (name, is_active, min_amount, min_items, eval_mode, discount_percent, free_shipping, standard_shipping_cost)
VALUES ('Envío Gratis +$2,000', true, 2000, 0, 'OR', 0, true, 200);

-- Allow public read-only access (frontend needs to fetch the active config)
ALTER TABLE cart_promo_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON cart_promo_config
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated write" ON cart_promo_config
    FOR ALL USING (true) WITH CHECK (true);
