-- Migration: create_distributor_applications
-- Project: JDenis (irdeiiichmanewpnuaml)
-- Date: 2026-02-06

-- Tabla para solicitudes de distribuidores
CREATE TABLE IF NOT EXISTS distributor_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    business_name TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    has_experience BOOLEAN DEFAULT false,
    interests TEXT[] DEFAULT '{}',
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índice para búsquedas por email
CREATE INDEX IF NOT EXISTS idx_distributor_applications_email ON distributor_applications(email);

-- Índice para filtrar por estado
CREATE INDEX IF NOT EXISTS idx_distributor_applications_status ON distributor_applications(status);

-- Habilitar RLS
ALTER TABLE distributor_applications ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserciones públicas (formulario)
CREATE POLICY "Anyone can submit application" ON distributor_applications
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Política para que usuarios autenticados lean todas las solicitudes
CREATE POLICY "Authenticated users can view all applications" ON distributor_applications
    FOR SELECT
    TO authenticated
    USING (true);
