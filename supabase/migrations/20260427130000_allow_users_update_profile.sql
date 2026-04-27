-- 1. Agregar columnas a public.users si no existen
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS rfc text,
ADD COLUMN IF NOT EXISTS business_name text,
ADD COLUMN IF NOT EXISTS postal_code text,
ADD COLUMN IF NOT EXISTS tax_regime text,
ADD COLUMN IF NOT EXISTS cfdi_use text,
ADD COLUMN IF NOT EXISTS email_facturacion text;

-- 2. Habilitar actualización de perfil para los usuarios (La solución al error)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON public.users;
CREATE POLICY "Usuarios pueden actualizar su propio perfil" 
ON public.users FOR UPDATE 
USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Usuarios pueden leer su propio perfil" ON public.users;
CREATE POLICY "Usuarios pueden leer su propio perfil" 
ON public.users FOR SELECT 
USING (auth.uid()::text = id::text);

-- 3. Modificar invoice_requests (quitamos la Foreign Key estricta para evitar conflictos de UUID/TEXT)
ALTER TABLE public.invoice_requests
ADD COLUMN IF NOT EXISTS id_cliente text,
ADD COLUMN IF NOT EXISTS id_pedido text,
ADD COLUMN IF NOT EXISTS ruta_pdf text,
ADD COLUMN IF NOT EXISTS ruta_xml text,
ADD COLUMN IF NOT EXISTS datos_fiscales_snapshot jsonb;

ALTER TABLE public.invoice_requests DROP CONSTRAINT IF EXISTS check_invoice_status;
ALTER TABLE public.invoice_requests ADD CONSTRAINT check_invoice_status CHECK (status IN ('Pendiente', 'Completada', 'Rechazada'));

-- 4. Políticas para invoice_requests con Cast explícito a ::text
ALTER TABLE public.invoice_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clientes ven sus propias solicitudes" ON public.invoice_requests;
CREATE POLICY "Clientes ven sus propias solicitudes" 
ON public.invoice_requests FOR SELECT USING (auth.uid()::text = id_cliente::text);

DROP POLICY IF EXISTS "Admins ven todas las solicitudes" ON public.invoice_requests;
CREATE POLICY "Admins ven todas las solicitudes" 
ON public.invoice_requests FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE users.id::text = auth.uid()::text AND users.role = 'ADMIN'));

DROP POLICY IF EXISTS "Clientes insertan sus solicitudes" ON public.invoice_requests;
CREATE POLICY "Clientes insertan sus solicitudes" 
ON public.invoice_requests FOR INSERT WITH CHECK (auth.uid()::text = id_cliente::text);

DROP POLICY IF EXISTS "Admins actualizan solicitudes" ON public.invoice_requests;
CREATE POLICY "Admins actualizan solicitudes" 
ON public.invoice_requests FOR UPDATE USING (EXISTS (SELECT 1 FROM public.users WHERE users.id::text = auth.uid()::text AND users.role = 'ADMIN'));

-- 5. Preparar Storage (Bucket) y Políticas con Cast
INSERT INTO storage.buckets (id, name, public) VALUES ('invoices', 'invoices', false) ON CONFLICT (id) DO UPDATE SET public = false;

DROP POLICY IF EXISTS "Clientes ven sus PDFs de facturas" ON storage.objects;
CREATE POLICY "Clientes ven sus PDFs de facturas" ON storage.objects FOR SELECT USING ( bucket_id = 'invoices' AND (auth.uid()::text = owner::text) );

DROP POLICY IF EXISTS "Admins pueden subir facturas" ON storage.objects;
CREATE POLICY "Admins pueden subir facturas" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'invoices' AND EXISTS (SELECT 1 FROM public.users WHERE users.id::text = auth.uid()::text AND users.role = 'ADMIN') );

DROP POLICY IF EXISTS "Admins leen facturas" ON storage.objects;
CREATE POLICY "Admins leen facturas" ON storage.objects FOR SELECT USING ( bucket_id = 'invoices' AND EXISTS (SELECT 1 FROM public.users WHERE users.id::text = auth.uid()::text AND users.role = 'ADMIN') );

DROP POLICY IF EXISTS "Admins pueden actualizar facturas" ON storage.objects;
CREATE POLICY "Admins pueden actualizar facturas" ON storage.objects FOR UPDATE USING ( bucket_id = 'invoices' AND EXISTS (SELECT 1 FROM public.users WHERE users.id::text = auth.uid()::text AND users.role = 'ADMIN') );
