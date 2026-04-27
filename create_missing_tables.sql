-- Script to create missing e-commerce tables: orders_b2b and order_items

CREATE TABLE IF NOT EXISTS public.orders_b2b (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number text NOT NULL,
    user_id uuid REFERENCES auth.users(id),
    status text NOT NULL DEFAULT 'pending',
    subtotal numeric NOT NULL DEFAULT 0,
    tax numeric DEFAULT 0,
    shipping numeric DEFAULT 0,
    total numeric NOT NULL DEFAULT 0,
    shipping_address jsonb,
    billing_address jsonb,
    payment_method text,
    payment_reference text,
    notes text,
    tracking_number text,
    shipped_at timestamp with time zone,
    queued_for_date date,
    packed_items jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id uuid REFERENCES public.orders_b2b(id) ON DELETE CASCADE,
    product_id uuid REFERENCES public.products(id),
    product_name text NOT NULL,
    quantity integer NOT NULL DEFAULT 1,
    unit_price numeric NOT NULL DEFAULT 0,
    total numeric NOT NULL DEFAULT 0
);

-- Habilitar RLS
ALTER TABLE public.orders_b2b ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Políticas para orders_b2b
CREATE POLICY "Users can view their own orders" ON public.orders_b2b FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON public.orders_b2b FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders_b2b FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('ADMIN', 'EJECUTIVO', 'FABRICA', 'ALMACEN_PF', 'TRANSPORTISTA'))
);
CREATE POLICY "Admins can update all orders" ON public.orders_b2b FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('ADMIN', 'EJECUTIVO', 'FABRICA', 'ALMACEN_PF', 'TRANSPORTISTA'))
);

-- Políticas para order_items
CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders_b2b WHERE id = order_items.order_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create their own order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders_b2b WHERE id = order_items.order_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can view all order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('ADMIN', 'EJECUTIVO', 'FABRICA', 'ALMACEN_PF', 'TRANSPORTISTA'))
);
CREATE POLICY "Admins can update all order items" ON public.order_items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('ADMIN', 'EJECUTIVO', 'FABRICA', 'ALMACEN_PF', 'TRANSPORTISTA'))
);
