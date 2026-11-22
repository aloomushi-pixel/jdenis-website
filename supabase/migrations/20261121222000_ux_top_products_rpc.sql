-- RPC: Ranking dinámico de "Favoritos de la Marca" basado en telemetría real de usuarios (vistas, búsquedas y carritos)
CREATE OR REPLACE FUNCTION public.get_ux_top_products(p_limit integer DEFAULT 12)
RETURNS SETOF public.products
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH recent_events AS (
    SELECT
      event_name,
      path,
      metadata
    FROM public.analytics_events
    WHERE is_bot = false
      AND created_at >= (now() - interval '60 days')
      AND event_name IN ('product_view', 'page_view', 'add_to_cart', 'product_search')
  ),
  direct_signals AS (
    SELECT
      COALESCE(
        NULLIF(metadata->>'product_id', ''),
        NULLIF(metadata->>'id', '')
      ) AS raw_id,
      CASE
        WHEN path LIKE '/producto/%' THEN
          CASE lower(regexp_replace(path, '^/producto/([^/?#]+).*$', '\1'))
            WHEN 'laminado-cejas' THEN 'laminado'
            WHEN 'laminado-de-cejas' THEN 'laminado'
            WHEN 'godete-cristal' THEN 'godete-de-cristal'
            WHEN 'activador-henna' THEN 'activador-de-henna'
            WHEN 'kit-brow-henna' THEN 'brow-henna1'
            WHEN 'brow-henna' THEN 'brow-henna1'
            WHEN 'kit-lash-lifting' THEN 'lash-lifting'
            WHEN 'agua-micelar' THEN 'aguami'
            WHEN 'desmaquillante-bifasico' THEN 'desmaquillante'
            WHEN 'tratamiento-alargador' THEN 'tratamiento-alargador-para-cejas-y-pestanas'
            WHEN 'anillo-10-contenedores' THEN 'anillodiez'
            ELSE lower(regexp_replace(path, '^/producto/([^/?#]+).*$', '\1'))
          END
        ELSE NULL
      END AS norm_slug,
      CASE
        WHEN event_name = 'add_to_cart' THEN 10
        WHEN event_name = 'product_view' THEN 4
        WHEN event_name = 'page_view' AND path LIKE '/producto/%' THEN 2
        ELSE 0
      END AS pts
    FROM recent_events
    WHERE event_name IN ('add_to_cart', 'product_view')
       OR (event_name = 'page_view' AND path LIKE '/producto/%')
  ),
  product_direct_scores AS (
    SELECT
      p.product_id,
      COALESCE(SUM(ds.pts), 0) AS direct_pts
    FROM public.products p
    LEFT JOIN direct_signals ds
      ON ds.raw_id = p.product_id::text
      OR (ds.norm_slug IS NOT NULL AND ds.norm_slug = lower(p.slug))
    WHERE p.is_active = true
    GROUP BY p.product_id
  ),
  top_search_terms AS (
    SELECT
      lower(trim(COALESCE(metadata->>'query', ''))) AS term,
      COUNT(*)::integer AS freq
    FROM recent_events
    WHERE event_name = 'product_search'
      AND length(trim(COALESCE(metadata->>'query', ''))) >= 3
      AND lower(trim(COALESCE(metadata->>'query', ''))) NOT IN ('j denis', 'jdenis', 'j. denis', 'todo', 'todos')
    GROUP BY 1
    ORDER BY 2 DESC
    LIMIT 25
  ),
  product_search_scores AS (
    SELECT
      p.product_id,
      COALESCE(SUM(LEAST(st.freq, 12) * 3), 0) AS search_pts
    FROM public.products p
    LEFT JOIN top_search_terms st
      ON lower(p.name) LIKE '%' || st.term || '%'
      OR lower(COALESCE(p.category, '')) LIKE '%' || st.term || '%'
    WHERE p.is_active = true
    GROUP BY p.product_id
  )
  SELECT p.*
  FROM public.products p
  LEFT JOIN product_direct_scores d ON d.product_id = p.product_id
  LEFT JOIN product_search_scores s ON s.product_id = p.product_id
  WHERE p.is_active = true
    AND COALESCE(p.total_stock, 0) > 0
    AND p.image_url IS NOT NULL
  ORDER BY
    (COALESCE(d.direct_pts, 0) + COALESCE(s.search_pts, 0)) DESC,
    p.is_featured DESC,
    p.sort_order ASC NULLS LAST,
    p.product_id ASC
  LIMIT GREATEST(1, LEAST(COALESCE(p_limit, 12), 40));
$$;

GRANT EXECUTE ON FUNCTION public.get_ux_top_products(integer) TO anon, authenticated;
