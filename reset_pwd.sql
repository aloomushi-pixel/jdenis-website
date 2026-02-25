-- Enable pgcrypto if not already enabled (it usually is in Supabase)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Fix Angela's password to match Accesos.md
UPDATE auth.users 
SET encrypted_password = crypt('Darepamaxidi7', gen_salt('bf')) 
WHERE email = 'caballeroangela49@gmail.com';

-- Fix Juan's email and password to match Accesos.md
UPDATE auth.users 
SET email = 'juangarcia@aionia.com.mx',
    encrypted_password = crypt('E4ae5d6c0c', gen_salt('bf'))
WHERE email = 'juangarcia@ccurity.com.mx';

-- Ensure they have ADMIN role in our public.users table if it exists
UPDATE public.users SET role = 'ADMIN' WHERE email IN ('caballeroangela49@gmail.com', 'juangarcia@aionia.com.mx');
