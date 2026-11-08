-- ============================================================================
-- MIGRATION 006: Full Codebase & Database Audit Corrective Suite
-- Aligns ERP & Store PostgreSQL schema, Foreign Keys, RLS, RPCs & Storage Buckets
-- ============================================================================

-- 1. Upgrade public.users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone text;
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'fullName'
    ) THEN
        ALTER TABLE public.users ADD COLUMN "fullName" text GENERATED ALWAYS AS (full_name) STORED;
    END IF;
END $$;
ALTER TABLE public.users ALTER COLUMN updated_at DROP NOT NULL;
ALTER TABLE public.users ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;

-- 2. Upgrade public.resource_categories & public.resources
ALTER TABLE public.resource_categories ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE public.resource_categories ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.resource_categories ADD COLUMN IF NOT EXISTS icon text DEFAULT '📦';
ALTER TABLE public.resource_categories ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE public.resource_categories ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS resource_categories_slug_uidx ON public.resource_categories (slug);

INSERT INTO public.resource_categories (slug, name, description, icon, is_active, sort_order)
VALUES
    ('materia-prima', 'Materia Prima', 'Insumos químicos, activos y materias primas de laboratorio', '🧪', true, 1),
    ('embalaje', 'Material de Embalaje', 'Envases, frascos, cajas, etiquetas y blísteres', '📦', true, 2),
    ('producto-final', 'Producto Terminado', 'Lotes de producto final en almacén industrial', '✨', true, 3),
    ('vehiculos', 'Flotilla y Vehículos', 'Unidades de transporte y logística', '🚚', true, 4)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    is_active = EXCLUDED.is_active,
    sort_order = EXCLUDED.sort_order;

ALTER TABLE public.resources ALTER COLUMN id SET DEFAULT (gen_random_uuid())::text;
ALTER TABLE public.resources ALTER COLUMN category TYPE text USING category::text;
ALTER TABLE public.resources ALTER COLUMN category SET DEFAULT 'MATERIA_PRIMA';
ALTER TABLE public.resources ALTER COLUMN category DROP NOT NULL;
ALTER TABLE public.resources ALTER COLUMN format TYPE text USING format::text;
ALTER TABLE public.resources ALTER COLUMN format SET DEFAULT 'PIEZA';
ALTER TABLE public.resources ALTER COLUMN updated_at DROP NOT NULL;
ALTER TABLE public.resources ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;

-- 3. Upgrade public.production_orders
ALTER TABLE public.production_orders ADD COLUMN IF NOT EXISTS order_number text;
ALTER TABLE public.production_orders ADD COLUMN IF NOT EXISTS raw_materials jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.production_orders ADD COLUMN IF NOT EXISTS total_raw_input numeric DEFAULT 0;
ALTER TABLE public.production_orders ADD COLUMN IF NOT EXISTS finished_output jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.production_orders ADD COLUMN IF NOT EXISTS total_finished_output numeric DEFAULT 0;
ALTER TABLE public.production_orders ADD COLUMN IF NOT EXISTS tolerance_coefficient numeric DEFAULT 0.02;
ALTER TABLE public.production_orders ADD COLUMN IF NOT EXISTS loss_notes text;
ALTER TABLE public.production_orders ADD COLUMN IF NOT EXISTS linked_purchase_order_id text;
ALTER TABLE public.production_orders ADD COLUMN IF NOT EXISTS created_by text;
ALTER TABLE public.production_orders ADD COLUMN IF NOT EXISTS started_at timestamptz;
ALTER TABLE public.production_orders ADD COLUMN IF NOT EXISTS completed_at timestamptz;
ALTER TABLE public.production_orders ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE public.production_orders ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
ALTER TABLE public.production_orders ALTER COLUMN status SET DEFAULT 'PENDIENTE';
ALTER TABLE public.production_orders ALTER COLUMN actual_loss SET DEFAULT 0;

-- 4. Upgrade public.purchase_orders
ALTER TABLE public.purchase_orders ALTER COLUMN id SET DEFAULT (gen_random_uuid())::text;
ALTER TABLE public.purchase_orders ALTER COLUMN supplier_id DROP NOT NULL;
ALTER TABLE public.purchase_orders ALTER COLUMN status TYPE text USING status::text;
ALTER TABLE public.purchase_orders ALTER COLUMN status SET DEFAULT 'BORRADOR';
ALTER TABLE public.purchase_orders ALTER COLUMN updated_at DROP NOT NULL;
ALTER TABLE public.purchase_orders ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.purchase_orders ADD COLUMN IF NOT EXISTS order_number text;
ALTER TABLE public.purchase_orders ADD COLUMN IF NOT EXISTS supplier_name text;
ALTER TABLE public.purchase_orders ADD COLUMN IF NOT EXISTS supplier_contact text;
ALTER TABLE public.purchase_orders ADD COLUMN IF NOT EXISTS items jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.purchase_orders ADD COLUMN IF NOT EXISTS subtotal numeric DEFAULT 0;
ALTER TABLE public.purchase_orders ADD COLUMN IF NOT EXISTS tax numeric DEFAULT 0;
ALTER TABLE public.purchase_orders ADD COLUMN IF NOT EXISTS total numeric DEFAULT 0;
ALTER TABLE public.purchase_orders ADD COLUMN IF NOT EXISTS created_by text;
ALTER TABLE public.purchase_orders ADD COLUMN IF NOT EXISTS approved_by text;

-- 5. Upgrade public.sales_orders
ALTER TABLE public.sales_orders ALTER COLUMN customer_id DROP NOT NULL;
ALTER TABLE public.sales_orders ALTER COLUMN status TYPE text USING status::text;
ALTER TABLE public.sales_orders ALTER COLUMN status SET DEFAULT 'PENDIENTE';
ALTER TABLE public.sales_orders ADD COLUMN IF NOT EXISTS order_number text;
ALTER TABLE public.sales_orders ADD COLUMN IF NOT EXISTS client_id text REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE public.sales_orders ADD COLUMN IF NOT EXISTS status_history jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.sales_orders ADD COLUMN IF NOT EXISTS items jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.sales_orders ADD COLUMN IF NOT EXISTS subtotal numeric DEFAULT 0;
ALTER TABLE public.sales_orders ADD COLUMN IF NOT EXISTS tax numeric DEFAULT 0;
ALTER TABLE public.sales_orders ADD COLUMN IF NOT EXISTS total numeric DEFAULT 0;
ALTER TABLE public.sales_orders ADD COLUMN IF NOT EXISTS delivery_address text;
ALTER TABLE public.sales_orders ADD COLUMN IF NOT EXISTS created_by text;

-- 6. Ensure UNIQUE constraint on public.abandoned_carts(email) for upsert onConflict: 'email'
DELETE FROM public.abandoned_carts a
USING public.abandoned_carts b
WHERE a.id < b.id AND a.email = b.email;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conrelid = 'public.abandoned_carts'::regclass AND conname = 'abandoned_carts_email_key'
    ) THEN
        ALTER TABLE public.abandoned_carts ADD CONSTRAINT abandoned_carts_email_key UNIQUE (email);
    END IF;
END $$;

-- 7. Create Missing ERP & Cart Tables with Foreign Keys and RLS
CREATE TABLE IF NOT EXISTS public.resource_movements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id text REFERENCES public.resources(id) ON DELETE CASCADE,
    movement_type text NOT NULL,
    quantity numeric NOT NULL DEFAULT 0,
    previous_quantity numeric NOT NULL DEFAULT 0,
    new_quantity numeric NOT NULL DEFAULT 0,
    origin text,
    destination text,
    reference_id text,
    reference_type text,
    notes text,
    photo_urls text[],
    performed_by text REFERENCES public.users(id) ON DELETE SET NULL,
    confirmed_by text REFERENCES public.users(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.finished_products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    custom_id text,
    title text NOT NULL,
    description text,
    price numeric NOT NULL DEFAULT 0,
    sat_code text,
    image_url text,
    raw_material_cost numeric NOT NULL DEFAULT 0,
    packaging_cost numeric NOT NULL DEFAULT 0,
    total_cost numeric NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.transport_assignments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sales_order_id text REFERENCES public.sales_orders(id) ON DELETE SET NULL,
    driver_id text REFERENCES public.users(id) ON DELETE SET NULL,
    vehicle_resource_id text REFERENCES public.resources(id) ON DELETE SET NULL,
    status text NOT NULL DEFAULT 'PROGRAMADO',
    scheduled_date timestamptz NOT NULL DEFAULT now(),
    pickup_confirmed boolean NOT NULL DEFAULT false,
    pickup_photo_urls text[],
    pickup_weight numeric,
    pickup_packing_list text,
    delivery_confirmed boolean NOT NULL DEFAULT false,
    delivery_photo_urls text[],
    delivery_weight numeric,
    notes text,
    confirmed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.packaging_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sales_order_id text REFERENCES public.sales_orders(id) ON DELETE SET NULL,
    production_order_id uuid REFERENCES public.production_orders(id) ON DELETE SET NULL,
    status text NOT NULL DEFAULT 'PENDIENTE',
    items jsonb NOT NULL DEFAULT '[]'::jsonb,
    total_packages integer NOT NULL DEFAULT 0,
    packing_list text,
    photo_urls text[],
    weight numeric,
    packaged_by text REFERENCES public.users(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.event_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type text NOT NULL,
    module text NOT NULL,
    action text NOT NULL,
    entity_type text,
    entity_id text,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    performed_by text REFERENCES public.users(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.carts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id text UNIQUE NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cart_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id uuid NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
    product_id text NOT NULL,
    quantity integer NOT NULL DEFAULT 1,
    variant text,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (cart_id, product_id, variant)
);

-- Enable RLS and create policies for new & existing ERP tables
DO $$
DECLARE
    tbl text;
BEGIN
    FOREACH tbl IN ARRAY ARRAY[
        'resource_categories', 'resources', 'resource_movements',
        'finished_products', 'production_orders', 'purchase_orders',
        'sales_orders', 'transport_assignments', 'packaging_records',
        'event_log', 'carts', 'cart_items'
    ]
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
        EXECUTE format('DROP POLICY IF EXISTS "Authenticated users full access on %I" ON public.%I;', tbl, tbl);
        EXECUTE format('CREATE POLICY "Authenticated users full access on %I" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true);', tbl, tbl);
    END LOOP;
END $$;

-- Allow users to update their own profile in public.users
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid()::text = id)
WITH CHECK (auth.uid()::text = id);

-- 8. Fix & Create PostgreSQL RPCs

-- 8a. Remove overloaded update_user_role_admin(uuid, text) and unify on (text, text)
DROP FUNCTION IF EXISTS public.update_user_role_admin(uuid, text);
CREATE OR REPLACE FUNCTION public.update_user_role_admin(target_user_id text, new_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid()::text AND role::text IN ('ADMIN', 'EJECUTIVO')
    ) THEN
        RAISE EXCEPTION 'No tienes permisos para cambiar roles de usuario.';
    END IF;

    UPDATE public.users
    SET role = new_role::"UserRole",
        updated_at = CURRENT_TIMESTAMP
    WHERE id = target_user_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.update_user_role_admin(text, text) TO authenticated;

-- 8b. Create admin_update_user(target_user_id text, new_role text, new_status boolean)
DROP FUNCTION IF EXISTS public.admin_update_user(uuid, text, boolean);
DROP FUNCTION IF EXISTS public.admin_update_user(text, text, boolean);
CREATE OR REPLACE FUNCTION public.admin_update_user(
    target_user_id text,
    new_role text,
    new_status boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid()::text AND role::text IN ('ADMIN', 'EJECUTIVO')
    ) THEN
        RAISE EXCEPTION 'No tienes permisos de administrador para modificar usuarios.';
    END IF;

    UPDATE public.users
    SET role = COALESCE(new_role::"UserRole", role),
        is_active = COALESCE(new_status, is_active),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = target_user_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.admin_update_user(text, text, boolean) TO authenticated;

-- 8c. Create admin_manage_users(payload jsonb) to replace missing Edge Function
CREATE OR REPLACE FUNCTION public.admin_manage_users(payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_action text := payload->>'action';
    v_sub jsonb := COALESCE(payload->'payload', '{}'::jsonb);
    v_target_id text := v_sub->>'target_user_id';
    v_is_banned boolean := COALESCE((v_sub->>'is_banned')::boolean, false);
    v_email text := lower(trim(COALESCE(v_sub->>'email', '')));
    v_full_name text := trim(COALESCE(v_sub->>'fullName', ''));
    v_role text := COALESCE(v_sub->>'role', 'CLIENTE');
    v_user_id text;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid()::text AND role::text IN ('ADMIN', 'EJECUTIVO')
    ) THEN
        RETURN jsonb_build_object('error', 'No tienes permisos para administrar usuarios.');
    END IF;

    IF v_action = 'ban_user' THEN
        UPDATE public.users
        SET is_active = NOT v_is_banned,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = v_target_id;

        RETURN jsonb_build_object('success', true, 'user_id', v_target_id, 'is_active', NOT v_is_banned);

    ELSIF v_action = 'invite_user' THEN
        IF v_email = '' THEN
            RETURN jsonb_build_object('error', 'El correo electrónico es obligatorio.');
        END IF;

        SELECT id INTO v_user_id FROM public.users WHERE lower(email) = v_email LIMIT 1;

        IF v_user_id IS NULL THEN
            v_user_id := (gen_random_uuid())::text;
            INSERT INTO public.users (id, email, full_name, role, is_active, created_at, updated_at)
            VALUES (v_user_id, v_email, COALESCE(NULLIF(v_full_name, ''), split_part(v_email, '@', 1)), v_role::"UserRole", true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        ELSE
            UPDATE public.users
            SET full_name = COALESCE(NULLIF(v_full_name, ''), full_name),
                role = v_role::"UserRole",
                is_active = true,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = v_user_id;
        END IF;

        PERFORM public.send_transactional_email(jsonb_build_object(
            'to', jsonb_build_array(v_email),
            'subject', 'Invitación a J. Denis Profesional — Tu cuenta ha sido habilitada',
            'html', format(
                '<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">' ||
                '<h2 style="color:#0F172A;margin-top:0;">¡Bienvenido(a) a J. Denis, %s!</h2>' ||
                '<p style="color:#334155;line-height:1.6;">Se ha habilitado tu acceso en la plataforma de <strong>J. Denis</strong> con el rol de <strong>%s</strong>.</p>' ||
                '<p style="color:#334155;line-height:1.6;">Puedes ingresar o crear tu contraseña con tu correo <strong>%s</strong> en el siguiente enlace:</p>' ||
                '<p style="margin:24px 0;"><a href="https://jdenis.store/login" style="background:#1E293B;color:#D4AF37;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;">Ingresar a J. Denis</a></p>' ||
                '</div>',
                COALESCE(NULLIF(v_full_name, ''), v_email),
                v_role,
                v_email
            )
        ));

        RETURN jsonb_build_object('success', true, 'user_id', v_user_id);
    ELSE
        RETURN jsonb_build_object('error', 'Acción no reconocida: ' || COALESCE(v_action, 'null'));
    END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION public.admin_manage_users(jsonb) TO authenticated;

-- 8d. Create public.increment(table_name text, column_name text, row_id uuid) for coupon/promo usage
CREATE OR REPLACE FUNCTION public.increment(table_name text, column_name text, row_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF table_name = 'coupons' AND column_name = 'usage_count' THEN
        UPDATE public.coupons SET usage_count = COALESCE(usage_count, 0) + 1, updated_at = now() WHERE id = row_id;
    ELSIF table_name = 'promotions' AND column_name = 'current_uses' THEN
        UPDATE public.promotions SET current_uses = COALESCE(current_uses, 0) + 1, updated_at = now() WHERE id = row_id;
    ELSE
        RAISE EXCEPTION 'Increment not allowed on %.%', table_name, column_name;
    END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION public.increment(text, text, uuid) TO anon, authenticated;

-- 8e. Upgrade Dashboard RPCs
DROP FUNCTION IF EXISTS public.get_monthly_sales(integer, integer);
CREATE OR REPLACE FUNCTION public.get_monthly_sales(target_month integer DEFAULT NULL, target_year integer DEFAULT NULL)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    m integer := COALESCE(target_month, EXTRACT(MONTH FROM CURRENT_DATE)::integer);
    y integer := COALESCE(target_year, EXTRACT(YEAR FROM CURRENT_DATE)::integer);
    v_b2b numeric := 0;
BEGIN
    SELECT COALESCE(SUM(COALESCE(total, total_amount, 0)), 0)
    INTO v_b2b
    FROM public.sales_orders
    WHERE status NOT IN ('CANCELLED', 'CANCELADO', 'Cancelado')
      AND EXTRACT(MONTH FROM created_at) = m
      AND EXTRACT(YEAR FROM created_at) = y;

    RETURN COALESCE(v_b2b, 0);
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_monthly_sales(integer, integer) TO authenticated;

DROP FUNCTION IF EXISTS public.get_monthly_purchases(integer, integer);
CREATE OR REPLACE FUNCTION public.get_monthly_purchases(target_month integer DEFAULT NULL, target_year integer DEFAULT NULL)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    m integer := COALESCE(target_month, EXTRACT(MONTH FROM CURRENT_DATE)::integer);
    y integer := COALESCE(target_year, EXTRACT(YEAR FROM CURRENT_DATE)::integer);
    v_total numeric := 0;
BEGIN
    SELECT COALESCE(SUM(COALESCE(total, total_amount, 0)), 0)
    INTO v_total
    FROM public.purchase_orders
    WHERE status NOT IN ('CANCELLED', 'CANCELADA', 'Cancelada')
      AND EXTRACT(MONTH FROM created_at) = m
      AND EXTRACT(YEAR FROM created_at) = y;

    RETURN COALESCE(v_total, 0);
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_monthly_purchases(integer, integer) TO authenticated;

DROP FUNCTION IF EXISTS public.get_production_summary();
CREATE OR REPLACE FUNCTION public.get_production_summary()
RETURNS TABLE(total_orders bigint, pending_orders bigint, in_progress bigint, completed bigint, total_loss numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::bigint AS total_orders,
        COALESCE(SUM(CASE WHEN status = 'PENDIENTE' THEN 1 ELSE 0 END), 0)::bigint AS pending_orders,
        COALESCE(SUM(CASE WHEN status = 'EN_PROCESO' THEN 1 ELSE 0 END), 0)::bigint AS in_progress,
        COALESCE(SUM(CASE WHEN status = 'COMPLETADA' THEN 1 ELSE 0 END), 0)::bigint AS completed,
        COALESCE(SUM(actual_loss), 0)::numeric AS total_loss
    FROM public.production_orders;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_production_summary() TO authenticated;

DROP FUNCTION IF EXISTS public.get_resource_summary();
CREATE OR REPLACE FUNCTION public.get_resource_summary()
RETURNS TABLE(category_name text, total_items bigint, total_value numeric, low_stock_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(rc.name, r.category::text, 'Sin Categoría') AS category_name,
        COUNT(r.id)::bigint AS total_items,
        COALESCE(SUM(r.quantity * COALESCE(r.unit_cost, 0)), 0)::numeric AS total_value,
        COALESCE(SUM(CASE WHEN r.quantity <= COALESCE(r.min_quantity, 10) THEN 1 ELSE 0 END), 0)::bigint AS low_stock_count
    FROM public.resources r
    LEFT JOIN public.resource_categories rc ON rc.id = r.category_id
    WHERE COALESCE(r.is_active, true) = true
    GROUP BY COALESCE(rc.name, r.category::text, 'Sin Categoría');
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_resource_summary() TO authenticated;

-- 9. Create Missing Supabase Storage Buckets & Policies
INSERT INTO storage.buckets (id, name, public)
VALUES
    ('blog-images', 'blog-images', true),
    ('reels', 'reels', true),
    ('media-library', 'media-library', true),
    ('invoices', 'invoices', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read access for store media buckets" ON storage.objects;
CREATE POLICY "Public read access for store media buckets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id IN ('blog-images', 'reels', 'media-library', 'invoices', 'academy-images', 'academy', 'product-images', 'distributor_documents'));

DROP POLICY IF EXISTS "Authenticated users can upload to store media buckets" ON storage.objects;
CREATE POLICY "Authenticated users can upload to store media buckets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id IN ('blog-images', 'reels', 'media-library', 'invoices', 'academy-images', 'academy', 'product-images', 'distributor_documents'));

DROP POLICY IF EXISTS "Authenticated users can update store media buckets" ON storage.objects;
CREATE POLICY "Authenticated users can update store media buckets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id IN ('blog-images', 'reels', 'media-library', 'invoices', 'academy-images', 'academy', 'product-images', 'distributor_documents'));

DROP POLICY IF EXISTS "Authenticated users can delete from store media buckets" ON storage.objects;
CREATE POLICY "Authenticated users can delete from store media buckets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id IN ('blog-images', 'reels', 'media-library', 'invoices', 'academy-images', 'academy', 'product-images', 'distributor_documents'));

-- 10. Fix invoice_requests RLS for guest autofacturacion & EJECUTIVO role
DROP POLICY IF EXISTS "Clientes insertan sus solicitudes" ON public.invoice_requests;
CREATE POLICY "Clientes insertan sus solicitudes"
ON public.invoice_requests FOR INSERT
TO public
WITH CHECK (id_cliente IS NULL OR (auth.uid())::text = id_cliente);

DROP POLICY IF EXISTS "Admins ven todas las solicitudes" ON public.invoice_requests;
CREATE POLICY "Admins ven todas las solicitudes"
ON public.invoice_requests FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = (auth.uid())::text AND users.role::text IN ('ADMIN', 'EJECUTIVO')
));

DROP POLICY IF EXISTS "Admins actualizan solicitudes" ON public.invoice_requests;
CREATE POLICY "Admins actualizan solicitudes"
ON public.invoice_requests FOR UPDATE
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = (auth.uid())::text AND users.role::text IN ('ADMIN', 'EJECUTIVO')
));

-- Allow EJECUTIVO to also view/update distributor_applications
DROP POLICY IF EXISTS "Admins ven solicitudes de distribuidor" ON public.distributor_applications;
CREATE POLICY "Admins ven solicitudes de distribuidor"
ON public.distributor_applications FOR SELECT
TO authenticated
USING (get_user_role(auth.uid()) IN ('ADMIN', 'EJECUTIVO'));

DROP POLICY IF EXISTS "Admins actualizan solicitudes de distribuidor" ON public.distributor_applications;
CREATE POLICY "Admins actualizan solicitudes de distribuidor"
ON public.distributor_applications FOR UPDATE
TO authenticated
USING (get_user_role(auth.uid()) IN ('ADMIN', 'EJECUTIVO'));

-- Fix carts user_id nullable for guest session carts and add session_id + added_at
ALTER TABLE public.carts ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.carts ADD COLUMN IF NOT EXISTS session_id text;
ALTER TABLE public.cart_items ADD COLUMN IF NOT EXISTS added_at timestamptz DEFAULT now();

NOTIFY pgrst, 'reload schema';
