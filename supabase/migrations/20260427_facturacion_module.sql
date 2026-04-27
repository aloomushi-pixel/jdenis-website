-- Migración para el Módulo de Facturación
-- Agrega soporte para el dashboard del cliente y restringe seguridad mediante RLS

-- 1. Asegurar que public.users tenga los datos fiscales (opcional, pues auth.users metadata ya lo guarda, pero lo agregaremos para facilidad relacional)
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS rfc text,
ADD COLUMN IF NOT EXISTS business_name text,
ADD COLUMN IF NOT EXISTS postal_code text,
ADD COLUMN IF NOT EXISTS tax_regime text,
ADD COLUMN IF NOT EXISTS cfdi_use text,
ADD COLUMN IF NOT EXISTS email_facturacion text;

-- 2. Modificar invoice_requests para la integración bidireccional
ALTER TABLE public.invoice_requests
ADD COLUMN IF NOT EXISTS id_cliente uuid REFERENCES public.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS id_pedido uuid, -- Puede apuntar a orders si existe
ADD COLUMN IF NOT EXISTS ruta_pdf text,
ADD COLUMN IF NOT EXISTS ruta_xml text,
ADD COLUMN IF NOT EXISTS datos_fiscales_snapshot jsonb;

-- Asegurar validación estricta de estado
ALTER TABLE public.invoice_requests DROP CONSTRAINT IF EXISTS check_invoice_status;
ALTER TABLE public.invoice_requests ADD CONSTRAINT check_invoice_status CHECK (status IN ('Pendiente', 'Completada', 'Rechazada'));

-- 3. Habilitar RLS en invoice_requests
ALTER TABLE public.invoice_requests ENABLE ROW LEVEL SECURITY;

-- Política: Clientes ven sus propias solicitudes
DROP POLICY IF EXISTS "Clientes ven sus propias solicitudes" ON public.invoice_requests;
CREATE POLICY "Clientes ven sus propias solicitudes" 
ON public.invoice_requests FOR SELECT 
USING (auth.uid() = id_cliente);

-- Política: Administradores ven todas las solicitudes
DROP POLICY IF EXISTS "Admins ven todas las solicitudes" ON public.invoice_requests;
CREATE POLICY "Admins ven todas las solicitudes" 
ON public.invoice_requests FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'ADMIN'));

-- Política: Clientes insertan sus propias solicitudes
DROP POLICY IF EXISTS "Clientes insertan sus solicitudes" ON public.invoice_requests;
CREATE POLICY "Clientes insertan sus solicitudes" 
ON public.invoice_requests FOR INSERT 
WITH CHECK (auth.uid() = id_cliente);

-- Política: Administradores actualizan solicitudes
DROP POLICY IF EXISTS "Admins actualizan solicitudes" ON public.invoice_requests;
CREATE POLICY "Admins actualizan solicitudes" 
ON public.invoice_requests FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'ADMIN'));

-- 4. Storage para Facturas (invoices bucket)
-- Si no existe el bucket, se debe crear (insert_storage_bucket es una func auxiliar o manual)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('invoices', 'invoices', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Storage RLS: Propietario (o admin) puede ver el archivo
DROP POLICY IF EXISTS "Clientes ven sus PDFs de facturas" ON storage.objects;
CREATE POLICY "Clientes ven sus PDFs de facturas"
ON storage.objects FOR SELECT
USING ( bucket_id = 'invoices' AND (auth.uid() = owner) );

-- Admins pueden subir y leer todo en invoices
DROP POLICY IF EXISTS "Admins pueden subir facturas" ON storage.objects;
CREATE POLICY "Admins pueden subir facturas"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'invoices' AND EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'ADMIN') );

DROP POLICY IF EXISTS "Admins leen facturas" ON storage.objects;
CREATE POLICY "Admins leen facturas"
ON storage.objects FOR SELECT
USING ( bucket_id = 'invoices' AND EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'ADMIN') );

DROP POLICY IF EXISTS "Admins pueden actualizar facturas" ON storage.objects;
CREATE POLICY "Admins pueden actualizar facturas"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'invoices' AND EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'ADMIN') );
