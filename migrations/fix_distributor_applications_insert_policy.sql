-- Drop the existing restricted policy
DROP POLICY IF EXISTS "Anyone can submit application" ON distributor_applications;

-- Create a new policy that allows anyone (both anon and authenticated) to insert
CREATE POLICY "Anyone can submit application" ON distributor_applications
    FOR INSERT
    TO public
    WITH CHECK (true);
