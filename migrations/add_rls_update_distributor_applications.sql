-- Migration: add_rls_update_distributor_applications
-- Description: Add UPDATE policy to allow authenticated admins to update application status.

-- Política para que usuarios autenticados puedan actualizar las solicitudes (por ejemplo, cambiar el status)
CREATE POLICY "Authenticated users can update applications" ON distributor_applications
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);
