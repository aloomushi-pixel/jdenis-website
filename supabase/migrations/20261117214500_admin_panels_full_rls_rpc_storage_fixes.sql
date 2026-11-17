-- =============================================================================
-- J. DENIS — Reparación Integral de Backend Administrativo (RLS, Storage y RPCs)
-- Habilita operación 100% funcional en todos los paneles de /admin
-- =============================================================================

-- 0. Función auxiliar segura para validar staff administrativo (ADMIN / EJECUTIVO)
CREATE OR REPLACE FUNCTION public.is_admin_or_ejecutivo()
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid()::text
      AND u.role::text IN ('ADMIN', 'EJECUTIVO')
      AND COALESCE(u.is_active, TRUE) = TRUE
  );
$$;

-- 1. Bucket faltante product-images en Supabase Storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', TRUE)
ON CONFLICT (id) DO UPDATE SET public = TRUE;

-- Ampliar lectura/escritura de facturas en Storage también a EJECUTIVO (consistente con /admin/facturacion)
DROP POLICY IF EXISTS "Staff lee facturas" ON storage.objects;
CREATE POLICY "Staff lee facturas"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'invoices' AND public.is_admin_or_ejecutivo());

DROP POLICY IF EXISTS "Staff sube facturas" ON storage.objects;
CREATE POLICY "Staff sube facturas"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'invoices' AND public.is_admin_or_ejecutivo());

DROP POLICY IF EXISTS "Staff actualiza facturas" ON storage.objects;
CREATE POLICY "Staff actualiza facturas"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'invoices' AND public.is_admin_or_ejecutivo());

-- 2. Políticas RLS faltantes en paneles de /admin

-- 2A. /admin/blog (blog_posts tenía SÓLO SELECT, bloqueando crear/editar/eliminar artículos y noticias)
DROP POLICY IF EXISTS "Staff gestiona blog_posts" ON public.blog_posts;
CREATE POLICY "Staff gestiona blog_posts"
  ON public.blog_posts FOR ALL TO authenticated
  USING (public.is_admin_or_ejecutivo())
  WITH CHECK (public.is_admin_or_ejecutivo());

-- 2B. /admin/academy (academy_events tenía SÓLO SELECT y academy_courses excluía a EJECUTIVO)
DROP POLICY IF EXISTS "Staff gestiona academy_events" ON public.academy_events;
CREATE POLICY "Staff gestiona academy_events"
  ON public.academy_events FOR ALL TO authenticated
  USING (public.is_admin_or_ejecutivo())
  WITH CHECK (public.is_admin_or_ejecutivo());

DROP POLICY IF EXISTS "Staff gestiona academy_courses" ON public.academy_courses;
CREATE POLICY "Staff gestiona academy_courses"
  ON public.academy_courses FOR ALL TO authenticated
  USING (public.is_admin_or_ejecutivo())
  WITH CHECK (public.is_admin_or_ejecutivo());

-- 2C. /admin/catalog categorías y configuraciones promocionales
DROP POLICY IF EXISTS "Staff gestiona product_categories" ON public.product_categories;
CREATE POLICY "Staff gestiona product_categories"
  ON public.product_categories FOR ALL TO authenticated
  USING (public.is_catalog_staff())
  WITH CHECK (public.is_catalog_staff());

DROP POLICY IF EXISTS "Staff gestiona promo_configs" ON public.promo_configs;
CREATE POLICY "Staff gestiona promo_configs"
  ON public.promo_configs FOR ALL TO authenticated
  USING (public.is_admin_or_ejecutivo())
  WITH CHECK (public.is_admin_or_ejecutivo());

-- 2D. /admin/reviews, /admin/distributors, /admin/facturacion y /admin/emails (DELETE / UPDATE faltantes)
DROP POLICY IF EXISTS "Staff elimina product_reviews" ON public.product_reviews;
CREATE POLICY "Staff elimina product_reviews"
  ON public.product_reviews FOR DELETE TO authenticated
  USING (public.is_admin_or_ejecutivo());

DROP POLICY IF EXISTS "Staff elimina distributor_applications" ON public.distributor_applications;
CREATE POLICY "Staff elimina distributor_applications"
  ON public.distributor_applications FOR DELETE TO authenticated
  USING (public.is_admin_or_ejecutivo());

DROP POLICY IF EXISTS "Staff elimina invoice_requests" ON public.invoice_requests;
CREATE POLICY "Staff elimina invoice_requests"
  ON public.invoice_requests FOR DELETE TO authenticated
  USING (public.is_admin_or_ejecutivo());

DROP POLICY IF EXISTS "Staff actualiza email_campaigns" ON public.email_campaigns;
CREATE POLICY "Staff actualiza email_campaigns"
  ON public.email_campaigns FOR UPDATE TO authenticated
  USING (public.is_admin_or_ejecutivo())
  WITH CHECK (public.is_admin_or_ejecutivo());

DROP POLICY IF EXISTS "Staff elimina email_campaigns" ON public.email_campaigns;
CREATE POLICY "Staff elimina email_campaigns"
  ON public.email_campaigns FOR DELETE TO authenticated
  USING (public.is_admin_or_ejecutivo());

DROP POLICY IF EXISTS "Staff elimina newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Staff elimina newsletter_subscribers"
  ON public.newsletter_subscribers FOR DELETE TO authenticated
  USING (public.is_admin_or_ejecutivo());

-- 3. Unificar RPC send_transactional_email para soportar TODOS los paneles administrativos
--    (/admin/emails individual y masivo, /admin/users invitaciones, /admin/facturacion CFDI,
--     /admin/distributors bienvenida, /admin/warehouse-queue guías de envío y /admin/sales cotizaciones)
CREATE OR REPLACE FUNCTION public.send_transactional_email(payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
DECLARE
  v_settings       public.store_payment_settings%ROWTYPE;
  v_type           text := COALESCE(payload->>'type', 'custom');
  v_recipient_type text := COALESCE(payload->>'recipientType', '');
  v_subject        text := COALESCE(NULLIF(trim(payload->>'subject'), ''), 'Notificación J. Denis');
  v_html           text := COALESCE(NULLIF(payload->>'htmlContent', ''), NULLIF(payload->>'html', ''), '<p>Notificación J. Denis</p>');
  v_to             jsonb := '[]'::jsonb;
  v_req_id         bigint;
  v_batch          jsonb;
  v_sent_batches   integer := 0;
BEGIN
  SELECT * INTO v_settings FROM public.store_payment_settings WHERE id = 'default';
  IF v_settings.resend_api_key IS NULL OR length(trim(v_settings.resend_api_key)) < 10 THEN
    RETURN jsonb_build_object(
      'success', true,
      'status', 'simulated',
      'message', 'Envío simulado (API key de Resend no configurada)'
    );
  END IF;

  IF v_type = 'contact' THEN
    v_subject := format('Nuevo mensaje de contacto de: %s', COALESCE(payload->>'name', 'Visitante'));
    v_html := format(
      '<h2>Nuevo Mensaje de Contacto Web</h2><p><strong>Nombre:</strong> %s</p><p><strong>Email:</strong> %s</p><p><strong>Teléfono:</strong> %s</p><p><strong>Mensaje:</strong><br/>%s</p>',
      COALESCE(payload->>'name', ''),
      COALESCE(payload->>'email', ''),
      COALESCE(payload->>'phone', 'N/A'),
      COALESCE(payload->>'message', 'N/A')
    );
    v_to := to_jsonb(v_settings.notification_emails);

  ELSIF v_type = 'distributor' THEN
    v_subject := format('Nueva solicitud de distribuidor: %s', COALESCE(payload->>'name', 'Solicitante'));
    v_html := format(
      '<h2>Nueva Solicitud de Distribuidor</h2><p><strong>Nombre:</strong> %s</p><p><strong>Email:</strong> %s</p><p><strong>Teléfono:</strong> %s</p><p><strong>Negocio:</strong> %s</p><p><strong>Ubicación:</strong> %s, %s</p><p><strong>Mensaje:</strong><br/>%s</p>',
      COALESCE(payload->>'name', ''),
      COALESCE(payload->>'email', ''),
      COALESCE(payload->>'phone', 'N/A'),
      COALESCE(payload->>'business_name', 'N/A'),
      COALESCE(payload->>'city', 'N/A'),
      COALESCE(payload->>'state', 'N/A'),
      COALESCE(payload->>'message', 'N/A')
    );
    v_to := to_jsonb(v_settings.notification_emails);

  ELSIF v_type = 'quotation' THEN
    v_subject := COALESCE(NULLIF(trim(payload->>'subject'), ''), 'Nueva Cotización B2B - J. Denis');
    IF payload->>'htmlContent' IS NULL AND payload->>'html' IS NULL THEN
      v_html := format(
        '<h2>Nueva Cotización B2B — J. Denis</h2><p>Hola <strong>%s</strong>,</p><p>Total de cotización: <strong>$%s MXN</strong></p><p>Notas: %s</p>',
        COALESCE(payload->>'name', 'Cliente'),
        COALESCE(payload->'quotationData'->>'total', '0.00'),
        COALESCE(payload->'quotationData'->>'notes', '')
      );
    END IF;
    IF payload->>'toEmail' IS NOT NULL AND length(trim(payload->>'toEmail')) > 3 THEN
      v_to := to_jsonb(v_settings.notification_emails) || jsonb_build_array(trim(payload->>'toEmail'));
    ELSE
      v_to := to_jsonb(v_settings.notification_emails);
    END IF;

  ELSIF v_recipient_type = 'all_subscribers' THEN
    -- Envío de campaña a suscriptores activos en bloques de hasta 45 destinatarios (límite seguro Resend)
    FOR v_batch IN
      WITH active_subs AS (
        SELECT DISTINCT lower(trim(email)) AS email,
               row_number() OVER (ORDER BY lower(trim(email))) AS rn
        FROM public.newsletter_subscribers
        WHERE COALESCE(is_active, TRUE) = TRUE
          AND email IS NOT NULL
          AND position('@' in email) > 1
      )
      SELECT jsonb_agg(email) AS emails
      FROM active_subs
      GROUP BY ((rn - 1) / 45)
    LOOP
      IF v_batch IS NOT NULL AND jsonb_array_length(v_batch) > 0 THEN
        SELECT net.http_post(
          url := 'https://api.resend.com/emails',
          headers := jsonb_build_object(
            'Authorization', 'Bearer ' || trim(v_settings.resend_api_key),
            'Content-Type', 'application/json'
          ),
          body := jsonb_build_object(
            'from', v_settings.from_email,
            'to', jsonb_build_array(v_settings.from_email),
            'bcc', v_batch,
            'subject', v_subject,
            'html', v_html
          )
        ) INTO v_req_id;
        v_sent_batches := v_sent_batches + 1;
      END IF;
    END LOOP;

    -- Si aún no hay suscriptores registrados, enviar copia de verificación a correos administrativos
    IF v_sent_batches = 0 THEN
      SELECT net.http_post(
        url := 'https://api.resend.com/emails',
        headers := jsonb_build_object(
          'Authorization', 'Bearer ' || trim(v_settings.resend_api_key),
          'Content-Type', 'application/json'
        ),
        body := jsonb_build_object(
          'from', v_settings.from_email,
          'to', to_jsonb(v_settings.notification_emails),
          'subject', v_subject,
          'html', v_html
        )
      ) INTO v_req_id;
    END IF;

    RETURN jsonb_build_object(
      'success', true,
      'status', 'queued',
      'batches', GREATEST(1, v_sent_batches),
      'request_id', v_req_id,
      'message', 'Campaña encolada correctamente'
    );

  ELSE
    -- Soporte universal: payload.to (array o string), payload.targetEmail o payload.toEmail
    IF jsonb_typeof(payload->'to') = 'array' AND jsonb_array_length(payload->'to') > 0 THEN
      v_to := payload->'to';
    ELSIF payload->>'to' IS NOT NULL AND length(trim(payload->>'to')) > 3 AND jsonb_typeof(payload->'to') = 'string' THEN
      v_to := jsonb_build_array(trim(payload->>'to'));
    ELSIF payload->>'targetEmail' IS NOT NULL AND length(trim(payload->>'targetEmail')) > 3 THEN
      v_to := jsonb_build_array(trim(payload->>'targetEmail'));
    ELSIF payload->>'toEmail' IS NOT NULL AND length(trim(payload->>'toEmail')) > 3 THEN
      v_to := jsonb_build_array(trim(payload->>'toEmail'));
    ELSE
      v_to := to_jsonb(v_settings.notification_emails);
    END IF;
  END IF;

  SELECT net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || trim(v_settings.resend_api_key),
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', v_settings.from_email,
      'to', v_to,
      'subject', v_subject,
      'html', v_html
    )
  ) INTO v_req_id;

  RETURN jsonb_build_object(
    'success', true,
    'status', 'queued',
    'request_id', v_req_id,
    'message', 'Correo enviado exitosamente'
  );
END;
$$;

-- 4. Actualizar get_monthly_sales para reflejar tanto sales_orders como cotizaciones B2B convertidas/aceptadas sin duplicar
CREATE OR REPLACE FUNCTION public.get_monthly_sales(
  target_month integer DEFAULT NULL::integer,
  target_year integer DEFAULT NULL::integer
)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  m integer := COALESCE(target_month, EXTRACT(MONTH FROM CURRENT_DATE)::integer);
  y integer := COALESCE(target_year, EXTRACT(YEAR FROM CURRENT_DATE)::integer);
  v_sales_orders numeric := 0;
  v_quotes_only  numeric := 0;
BEGIN
  SELECT COALESCE(SUM(COALESCE(total, total_amount, 0)), 0)
  INTO v_sales_orders
  FROM public.sales_orders
  WHERE status NOT IN ('CANCELLED', 'CANCELADO', 'Cancelado')
    AND EXTRACT(MONTH FROM created_at) = m
    AND EXTRACT(YEAR FROM created_at) = y;

  SELECT COALESCE(SUM(COALESCE(q.total_amount, 0)), 0)
  INTO v_quotes_only
  FROM public.quotations q
  WHERE q.status IN ('ACCEPTED', 'CONVERTED')
    AND EXTRACT(MONTH FROM q.created_at) = m
    AND EXTRACT(YEAR FROM q.created_at) = y
    AND NOT EXISTS (
      SELECT 1 FROM public.sales_orders so
      WHERE so.quotation_id = q.id
    );

  RETURN COALESCE(v_sales_orders, 0) + COALESCE(v_quotes_only, 0);
END;
$$;
