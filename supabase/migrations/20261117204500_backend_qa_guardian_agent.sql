-- =============================================================================
-- J. DENIS — Agente Autónomo de QA y Auto-Rectificación en Backend (100% Administrativo)
-- Corre exclusivamente en Supabase PostgreSQL + pg_cron (invisible en el frontend público)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 1. Bitácora privada de auditorías y auto-rectificaciones (acceso exclusivo ADMIN / service_role)
CREATE TABLE IF NOT EXISTS public.backend_qa_reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  trigger_source  TEXT NOT NULL DEFAULT 'pg_cron',
  overall_status  TEXT NOT NULL CHECK (overall_status IN ('HEALTHY', 'AUTO_HEALED', 'WARNING', 'CRITICAL')),
  checks          JSONB NOT NULL DEFAULT '{}'::jsonb,
  auto_fixes      JSONB NOT NULL DEFAULT '[]'::jsonb,
  metrics         JSONB NOT NULL DEFAULT '{}'::jsonb,
  duration_ms     INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_backend_qa_reports_created_at
  ON public.backend_qa_reports (created_at DESC);

ALTER TABLE public.backend_qa_reports ENABLE ROW LEVEL SECURITY;

-- Ninguna política para anon ni clientes: únicamente ADMIN y service_role pueden leer o escribir
DROP POLICY IF EXISTS "Solo ADMIN lee backend_qa_reports" ON public.backend_qa_reports;
CREATE POLICY "Solo ADMIN lee backend_qa_reports"
  ON public.backend_qa_reports
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()::text
        AND u.role::text = 'ADMIN'
        AND COALESCE(u.is_active, TRUE) = TRUE
    )
  );

DROP POLICY IF EXISTS "Service role acceso total backend_qa_reports" ON public.backend_qa_reports;
CREATE POLICY "Service role acceso total backend_qa_reports"
  ON public.backend_qa_reports
  FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- 2. Motor Backend Autónomo de Verificación y Auto-Rectificación Segura
CREATE OR REPLACE FUNCTION public.run_backend_qa_audit(
  p_trigger TEXT DEFAULT 'pg_cron',
  p_send_alert BOOLEAN DEFAULT TRUE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
DECLARE
  v_start_ts          TIMESTAMPTZ := clock_timestamp();
  v_caller_uid        UUID := auth.uid();
  v_auto_fixes        JSONB := '[]'::jsonb;
  v_checks            JSONB := '{}'::jsonb;
  v_metrics           JSONB := '{}'::jsonb;
  v_status            TEXT := 'HEALTHY';
  v_rows_affected     INTEGER := 0;
  v_active_products   INTEGER := 0;
  v_active_variants   INTEGER := 0;
  v_zero_stock_prods  INTEGER := 0;
  v_zero_stock_vars   INTEGER := 0;
  v_invalid_prices    INTEGER := 0;
  v_short_descs       INTEGER := 0;
  v_missing_var_imgs  INTEGER := 0;
  v_js_errors_6h      INTEGER := 0;
  v_mp_ready          BOOLEAN := FALSE;
  v_resend_ready      BOOLEAN := FALSE;
  v_http_health       INTEGER := 0;
  v_http_tienda       INTEGER := 0;
  v_http_sw           INTEGER := 0;
  v_sw_no_store       BOOLEAN := FALSE;
  v_http_merchant     INTEGER := 0;
  v_resp              extensions.http_response;
  v_sw_cc             TEXT := '';
  v_settings          public.store_payment_settings%ROWTYPE;
  v_last_critical_at  TIMESTAMPTZ;
  v_report_id         UUID;
  v_duration_ms       INTEGER;
BEGIN
  -- Seguridad: Si es invocado desde sesión autenticada HTTP, exigir rol ADMIN
  IF v_caller_uid IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = v_caller_uid::text
        AND u.role::text = 'ADMIN'
        AND COALESCE(u.is_active, TRUE) = TRUE
    ) THEN
      RAISE EXCEPTION 'Acceso denegado: función exclusiva de administración backend.';
    END IF;
  END IF;

  -- =========================================================================
  -- FASE A: AUTO-RECTIFICACIÓN SEGURA EN BACKEND (0 cambios de precios/borrados)
  -- =========================================================================

  -- A1. Sincronizar variants_count, has_variants y total_stock en products si hubo desajuste
  WITH agg AS (
    SELECT
      p.product_id,
      GREATEST(1, COUNT(v.variant_id) FILTER (WHERE v.is_active = TRUE))::int AS expected_count,
      (COUNT(v.variant_id) FILTER (WHERE v.is_active = TRUE) > 1) AS expected_has_vars,
      COALESCE(SUM(v.stock) FILTER (WHERE v.is_active = TRUE), p.total_stock, 0)::int AS expected_stock
    FROM public.products p
    LEFT JOIN public.product_variants v ON v.product_id = p.product_id
    GROUP BY p.product_id, p.total_stock
  )
  UPDATE public.products p
  SET variants_count = a.expected_count,
      has_variants = a.expected_has_vars,
      total_stock = a.expected_stock,
      updated_at = NOW()
  FROM agg a
  WHERE p.product_id = a.product_id
    AND (
      p.variants_count IS DISTINCT FROM a.expected_count
      OR p.has_variants IS DISTINCT FROM a.expected_has_vars
      OR p.total_stock IS DISTINCT FROM a.expected_stock
    );
  GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
  IF v_rows_affected > 0 THEN
    v_auto_fixes := v_auto_fixes || jsonb_build_array(
      format('Sincronizados agregados (stock/variantes) en %s productos padre', v_rows_affected)
    );
  END IF;

  -- A2. Heredar imagen del producto padre en variantes activas que no tengan imagen propia
  UPDATE public.product_variants v
  SET image_url = p.image_url,
      updated_at = NOW()
  FROM public.products p
  WHERE p.product_id = v.product_id
    AND (v.image_url IS NULL OR btrim(v.image_url) = '')
    AND p.image_url IS NOT NULL
    AND btrim(p.image_url) <> '';
  GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
  IF v_rows_affected > 0 THEN
    v_auto_fixes := v_auto_fixes || jsonb_build_array(
      format('Asignada imagen representativa heredada en %s variantes', v_rows_affected)
    );
  END IF;

  -- A3. Cerrar carritos abandonados cuyos correos ya completaron un pedido reciente
  UPDATE public.abandoned_carts ac
  SET status = 'converted',
      last_updated = NOW()
  WHERE ac.status IN ('active', 'pending')
    AND EXISTS (
      SELECT 1 FROM public.website_orders wo
      WHERE lower(wo.user_email) = lower(ac.email)
        AND wo.created_at >= ac.last_updated - INTERVAL '2 hours'
    );
  GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
  IF v_rows_affected > 0 THEN
    v_auto_fixes := v_auto_fixes || jsonb_build_array(
      format('Cerrados %s carritos abandonados que ya tenían pedido registrado', v_rows_affected)
    );
  END IF;

  -- A4. Desactivar automáticamente cupones vencidos
  UPDATE public.coupons
  SET is_active = FALSE,
      updated_at = NOW()
  WHERE is_active = TRUE
    AND expiration_date IS NOT NULL
    AND expiration_date < NOW();
  GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
  IF v_rows_affected > 0 THEN
    v_auto_fixes := v_auto_fixes || jsonb_build_array(
      format('Desactivados %s cupones con fecha expirada', v_rows_affected)
    );
  END IF;

  -- A5. Limpiar reportes antiguos (> 60 días) para mantener ligera la tabla administrativa
  DELETE FROM public.backend_qa_reports
  WHERE created_at < NOW() - INTERVAL '60 days';

  -- =========================================================================
  -- FASE B: AUDITORÍA PROFUNDA DE CATÁLOGO, TRANSACCIONES Y CONFIGURACIÓN
  -- =========================================================================
  SELECT
    COUNT(*) FILTER (WHERE is_active = TRUE),
    COUNT(*) FILTER (WHERE is_active = TRUE AND COALESCE(total_stock, 0) <= 0),
    COUNT(*) FILTER (WHERE is_active = TRUE AND COALESCE(base_price_mxn, 0) <= 0),
    COUNT(*) FILTER (WHERE is_active = TRUE AND length(btrim(COALESCE(description, ''))) < 10)
  INTO v_active_products, v_zero_stock_prods, v_invalid_prices, v_short_descs
  FROM public.products;

  SELECT
    COUNT(*) FILTER (WHERE is_active = TRUE),
    COUNT(*) FILTER (WHERE is_active = TRUE AND COALESCE(stock, 0) <= 0),
    COUNT(*) FILTER (WHERE is_active = TRUE AND (image_url IS NULL OR btrim(image_url) = ''))
  INTO v_active_variants, v_zero_stock_vars, v_missing_var_imgs
  FROM public.product_variants;

  SELECT COUNT(*)
  INTO v_js_errors_6h
  FROM public.ux_events
  WHERE event_name = 'js_exception'
    AND created_at >= NOW() - INTERVAL '6 hours';

  SELECT * INTO v_settings FROM public.store_payment_settings WHERE id = 'default';
  v_mp_ready := (v_settings.mercadopago_access_token IS NOT NULL AND length(btrim(v_settings.mercadopago_access_token)) > 15);
  v_resend_ready := (v_settings.resend_api_key IS NOT NULL AND length(btrim(v_settings.resend_api_key)) > 10);

  -- =========================================================================
  -- FASE C: VERIFICACIÓN HTTP EN VIVO DE https://jdenis.store DESDE BACKEND
  -- =========================================================================
  BEGIN
    SELECT * INTO v_resp FROM extensions.http_get('https://jdenis.store/health');
    v_http_health := v_resp.status;
  EXCEPTION WHEN OTHERS THEN
    v_http_health := 0;
  END;

  BEGIN
    SELECT * INTO v_resp FROM extensions.http_get('https://jdenis.store/tienda');
    v_http_tienda := v_resp.status;
  EXCEPTION WHEN OTHERS THEN
    v_http_tienda := 0;
  END;

  BEGIN
    SELECT * INTO v_resp FROM extensions.http_get('https://jdenis.store/sw.js');
    v_http_sw := v_resp.status;
    SELECT COALESCE(string_agg(h.value, ', '), '')
    INTO v_sw_cc
    FROM unnest(v_resp.headers) AS h
    WHERE lower(h.field) = 'cache-control';
    v_sw_no_store := (position('no-store' in lower(v_sw_cc)) > 0 OR position('no-cache' in lower(v_sw_cc)) > 0);
  EXCEPTION WHEN OTHERS THEN
    v_http_sw := 0;
    v_sw_no_store := FALSE;
  END;

  BEGIN
    SELECT * INTO v_resp FROM extensions.http_get('https://jdenis.store/google-merchant-feed.xml');
    v_http_merchant := v_resp.status;
  EXCEPTION WHEN OTHERS THEN
    v_http_merchant := 0;
  END;

  -- Evaluar estado global
  IF v_http_health <> 200 OR v_http_tienda <> 200 OR v_active_products < 180 OR v_invalid_prices > 0 THEN
    v_status := 'CRITICAL';
  ELSIF NOT v_sw_no_store OR v_http_merchant <> 200 OR v_zero_stock_prods > 0 OR v_js_errors_6h > 10 THEN
    v_status := 'WARNING';
  ELSIF jsonb_array_length(v_auto_fixes) > 0 THEN
    v_status := 'AUTO_HEALED';
  ELSE
    v_status := 'HEALTHY';
  END IF;

  v_checks := jsonb_build_object(
    'storefront_health_200', (v_http_health = 200),
    'tienda_route_200', (v_http_tienda = 200),
    'service_worker_no_store', (v_http_sw = 200 AND v_sw_no_store),
    'merchant_feed_200', (v_http_merchant = 200),
    'all_products_in_stock', (v_zero_stock_prods = 0 AND v_zero_stock_vars = 0),
    'all_prices_valid', (v_invalid_prices = 0),
    'all_descriptions_legible', (v_short_descs = 0),
    'mercadopago_configured', v_mp_ready,
    'resend_email_configured', v_resend_ready,
    'js_exceptions_low_6h', (v_js_errors_6h <= 10)
  );

  v_metrics := jsonb_build_object(
    'active_products', v_active_products,
    'active_variants', v_active_variants,
    'zero_stock_products', v_zero_stock_prods,
    'zero_stock_variants', v_zero_stock_vars,
    'invalid_prices', v_invalid_prices,
    'short_descriptions', v_short_descs,
    'variants_without_image', v_missing_var_imgs,
    'js_exceptions_last_6h', v_js_errors_6h,
    'http_health_status', v_http_health,
    'http_tienda_status', v_http_tienda,
    'http_sw_status', v_http_sw,
    'sw_cache_control', v_sw_cc,
    'http_merchant_status', v_http_merchant
  );

  v_duration_ms := GREATEST(1, EXTRACT(MILLISECONDS FROM (clock_timestamp() - v_start_ts))::int);

  INSERT INTO public.backend_qa_reports (
    trigger_source,
    overall_status,
    checks,
    auto_fixes,
    metrics,
    duration_ms
  ) VALUES (
    COALESCE(p_trigger, 'pg_cron'),
    v_status,
    v_checks,
    v_auto_fixes,
    v_metrics,
    v_duration_ms
  )
  RETURNING id INTO v_report_id;

  -- Alerta por correo SÓLO en estado CRITICAL (anti-spam: máx 1 cada 12 horas)
  IF p_send_alert AND v_status = 'CRITICAL' AND v_resend_ready THEN
    SELECT MAX(created_at)
    INTO v_last_critical_at
    FROM public.backend_qa_reports
    WHERE overall_status = 'CRITICAL'
      AND id <> v_report_id
      AND created_at >= NOW() - INTERVAL '12 hours';

    IF v_last_critical_at IS NULL THEN
      BEGIN
        PERFORM net.http_post(
          url := 'https://api.resend.com/emails',
          headers := jsonb_build_object(
            'Authorization', 'Bearer ' || btrim(v_settings.resend_api_key),
            'Content-Type', 'application/json'
          ),
          body := jsonb_build_object(
            'from', v_settings.from_email,
            'to', to_jsonb(v_settings.notification_emails),
            'subject', '🚨 [QA Guardián Backend] Alerta Crítica en J. Denis Store',
            'html', format(
              '<div style="font-family:Arial,sans-serif;max-width:600px;padding:20px;border:1px solid #fecaca;border-radius:12px;">' ||
              '<h2 style="color:#991b1b;margin-top:0;">Alerta Crítica Detectada por Guardián QA Backend</h2>' ||
              '<p>El agente autónomo de backend detectó una anomalía crítica:</p>' ||
              '<pre style="background:#f8fafc;padding:12px;border-radius:8px;font-size:12px;">%s</pre>' ||
              '</div>',
              jsonb_pretty(v_metrics)
            )
          )
        );
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END;
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'report_id', v_report_id,
    'overall_status', v_status,
    'duration_ms', v_duration_ms,
    'auto_fixes', v_auto_fixes,
    'checks', v_checks,
    'metrics', v_metrics
  );
END;
$$;

-- Revocar ejecución a usuarios anónimos; permitir sólo a autenticados (validado ADMIN adentro) y service_role/postgres
REVOKE ALL ON FUNCTION public.run_backend_qa_audit(TEXT, BOOLEAN) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.run_backend_qa_audit(TEXT, BOOLEAN) FROM anon;
GRANT EXECUTE ON FUNCTION public.run_backend_qa_audit(TEXT, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.run_backend_qa_audit(TEXT, BOOLEAN) TO service_role;

-- 3. Programación automática en Backend con pg_cron (3 cortes diurnos CDMX: 09:00, 15:00 y 20:00 CST = 15:00, 21:00 y 02:00 UTC)
DO $$
DECLARE
  v_job_id BIGINT;
BEGIN
  FOR v_job_id IN
    SELECT jobid FROM cron.job WHERE jobname = 'jdenis-backend-qa-guardian'
  LOOP
    PERFORM cron.unschedule(v_job_id);
  END LOOP;

  PERFORM cron.schedule(
    'jdenis-backend-qa-guardian',
    '0 15,21,2 * * *',
    $cron$SELECT public.run_backend_qa_audit('pg_cron', true);$cron$
  );
END;
$$;
