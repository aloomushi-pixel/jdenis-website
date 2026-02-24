CREATE OR REPLACE FUNCTION get_resource_summary()
RETURNS TABLE (
  category_name text,
  total_items integer,
  total_value numeric,
  low_stock_count integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.name AS category_name,
    COALESCE(SUM(r.quantity)::integer, 0) AS total_items,
    COALESCE(SUM(r.quantity * r.unit_cost), 0) AS total_value,
    COALESCE(SUM(CASE WHEN r.quantity < r.min_quantity THEN 1 ELSE 0 END)::integer, 0) AS low_stock_count
  FROM resource_categories c
  LEFT JOIN resources r ON r.category_id = c.id AND r.is_active = true
  GROUP BY c.id, c.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_monthly_sales(target_month integer DEFAULT NULL, target_year integer DEFAULT NULL)
RETURNS numeric AS $$
DECLARE
  v_month integer := COALESCE(target_month, extract(month from current_date));
  v_year integer := COALESCE(target_year, extract(year from current_date));
  v_total numeric;
BEGIN
  SELECT COALESCE(SUM(total), 0) INTO v_total
  FROM sales_orders
  WHERE extract(month from created_at) = v_month
    AND extract(year from created_at) = v_year
    AND status != 'CANCELADO';
  RETURN v_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_monthly_purchases(target_month integer DEFAULT NULL, target_year integer DEFAULT NULL)
RETURNS numeric AS $$
DECLARE
  v_month integer := COALESCE(target_month, extract(month from current_date));
  v_year integer := COALESCE(target_year, extract(year from current_date));
  v_total numeric;
BEGIN
  SELECT COALESCE(SUM(total), 0) INTO v_total
  FROM purchase_orders
  WHERE extract(month from created_at) = v_month
    AND extract(year from created_at) = v_year
    AND status != 'CANCELADO';
  RETURN v_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_production_summary()
RETURNS TABLE (
  total_orders integer,
  pending_orders integer,
  in_progress integer,
  completed integer,
  total_loss numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::integer AS total_orders,
    SUM(CASE WHEN status = 'PENDIENTE' THEN 1 ELSE 0 END)::integer AS pending_orders,
    SUM(CASE WHEN status = 'EN_PROCESO' THEN 1 ELSE 0 END)::integer AS in_progress,
    SUM(CASE WHEN status = 'COMPLETADA' THEN 1 ELSE 0 END)::integer AS completed,
    COALESCE(SUM(actual_loss), 0) AS total_loss
  FROM production_orders;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
