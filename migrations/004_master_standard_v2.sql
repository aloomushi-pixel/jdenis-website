-- =====================================================================================
-- J. DENIS — ESTÁNDAR MAESTRO v2.0 MIGRATION
-- 1. Asegurar columnas completas en public.analytics_events (is_pwa, bot_category, scroll_depth)
-- 2. Tabla Controladora de Versiones IA: public.autonomous_evolution_logs
-- 3. Vistas de Compatibilidad Cero-Duplicación: public.ux_events y public.ux_sessions
-- =====================================================================================

ALTER TABLE public.analytics_events
    ADD COLUMN IF NOT EXISTS is_pwa BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS bot_category TEXT,
    ADD COLUMN IF NOT EXISTS scroll_depth INTEGER;

CREATE TABLE IF NOT EXISTS public.autonomous_evolution_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name TEXT NOT NULL DEFAULT 'J. Denis Cosméticos',
    version_tag TEXT NOT NULL,
    cycle_number INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL CHECK (status IN ('IMPLEMENTED', 'POSTPONED', 'ACTION_REQUIRED', 'TEST_SYNC')),
    short_summary TEXT,
    telemetry_findings TEXT,
    changes_applied JSONB DEFAULT '[]'::jsonb,
    postponed_reason TEXT,
    human_action_required TEXT,
    commit_hash TEXT,
    deployment_uuid TEXT,
    next_timer_seconds INTEGER DEFAULT 14400,
    email_sent BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_autonomous_evolution_logs_created_at
    ON public.autonomous_evolution_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_autonomous_evolution_logs_status
    ON public.autonomous_evolution_logs (status);

ALTER TABLE public.autonomous_evolution_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'autonomous_evolution_logs' AND policyname = 'Allow public read autonomous_evolution_logs'
    ) THEN
        CREATE POLICY "Allow public read autonomous_evolution_logs"
            ON public.autonomous_evolution_logs FOR SELECT
            USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'autonomous_evolution_logs' AND policyname = 'Allow insert autonomous_evolution_logs'
    ) THEN
        CREATE POLICY "Allow insert autonomous_evolution_logs"
            ON public.autonomous_evolution_logs FOR INSERT
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'autonomous_evolution_logs' AND policyname = 'Allow update autonomous_evolution_logs'
    ) THEN
        CREATE POLICY "Allow update autonomous_evolution_logs"
            ON public.autonomous_evolution_logs FOR UPDATE
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;

-- Vistas de compatibilidad Estándar Maestro v2.0 sobre public.analytics_events (Cero Duplicación)
CREATE OR REPLACE VIEW public.ux_events AS
SELECT
    id,
    created_at,
    session_id,
    visitor_id,
    user_id,
    user_role,
    app_context,
    event_name,
    event_category,
    path,
    referrer,
    utm_source,
    utm_medium,
    utm_campaign,
    device_type,
    viewport_w,
    viewport_h,
    is_pwa,
    is_bot,
    bot_name,
    bot_category,
    duration_ms,
    scroll_depth,
    scroll_pct,
    element_tag,
    element_id,
    element_text,
    metadata->>'attribution_channel' AS attribution_channel,
    metadata->>'ai_engine' AS ai_engine,
    metadata->>'geo_country' AS country,
    metadata->>'geo_region' AS region,
    metadata->>'geo_city' AS city,
    (metadata->>'active_time_ms')::bigint AS active_time_ms,
    (metadata->>'hidden_time_ms')::bigint AS hidden_time_ms,
    metadata
FROM public.analytics_events;

CREATE OR REPLACE VIEW public.ux_sessions AS
SELECT
    session_id,
    MAX(visitor_id) AS visitor_id,
    MAX(user_id::text) AS user_id,
    MAX(user_role) AS user_role,
    MAX(app_context) AS app_context,
    MIN(created_at) AS session_start,
    MAX(created_at) AS session_end,
    COUNT(*) AS total_events,
    COUNT(*) FILTER (WHERE event_name = 'page_view') AS page_views,
    COUNT(*) FILTER (WHERE event_name = 'rage_click') AS rage_clicks,
    COUNT(*) FILTER (WHERE event_name = 'dead_click') AS dead_clicks,
    COUNT(*) FILTER (WHERE event_name = 'text_copy') AS text_copies,
    COUNT(*) FILTER (WHERE event_name = 'scroll_return_prices') AS scroll_return_prices,
    MAX(scroll_pct) AS max_scroll_pct,
    SUM(COALESCE((metadata->>'active_time_ms')::bigint, duration_ms, 0)) FILTER (WHERE event_name = 'page_leave') AS total_active_time_ms,
    SUM(COALESCE((metadata->>'hidden_time_ms')::bigint, 0)) FILTER (WHERE event_name = 'page_leave') AS total_hidden_time_ms,
    MAX(metadata->>'attribution_channel') AS attribution_channel,
    MAX(metadata->>'ai_engine') AS ai_engine,
    MAX(metadata->>'geo_country') AS country,
    MAX(metadata->>'geo_region') AS region,
    MAX(metadata->>'geo_city') AS city,
    MAX(device_type) AS device_type,
    BOOL_OR(is_pwa) AS is_pwa,
    BOOL_OR(is_bot) AS is_bot,
    MAX(bot_name) AS bot_name
FROM public.analytics_events
GROUP BY session_id;

GRANT SELECT, INSERT, UPDATE ON public.autonomous_evolution_logs TO anon, authenticated, service_role;
GRANT SELECT ON public.ux_events TO anon, authenticated, service_role;
GRANT SELECT ON public.ux_sessions TO anon, authenticated, service_role;

NOTIFY pgrst, 'reload schema';
