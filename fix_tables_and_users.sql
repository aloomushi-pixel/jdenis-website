CREATE TABLE IF NOT EXISTS resource_categories (id uuid primary key default gen_random_uuid(), name text);

CREATE TABLE IF NOT EXISTS resources (id uuid primary key default gen_random_uuid(), category_id uuid, quantity int, min_quantity int, unit_cost numeric, is_active boolean);

CREATE TABLE IF NOT EXISTS sales_orders (id uuid primary key default gen_random_uuid(), total numeric, created_at timestamp, status text);

CREATE TABLE IF NOT EXISTS purchase_orders (id uuid primary key default gen_random_uuid(), total numeric, created_at timestamp, status text);

CREATE TABLE IF NOT EXISTS production_orders (id uuid primary key default gen_random_uuid(), status text, actual_loss numeric);

INSERT INTO public.users (id, email, first_name, last_name, role)
SELECT id, email, 'Admin', 'User', 'ADMIN'
FROM auth.users
WHERE email IN ('caballeroangela49@gmail.com', 'juangarcia@aionia.com.mx', 'juangarcia@ccurity.com.mx')
ON CONFLICT (id) DO UPDATE SET role = 'ADMIN';
