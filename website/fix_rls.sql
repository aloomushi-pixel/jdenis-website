-- Drop the infinite recursive policy
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- Create a secure bypass function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid() AND role = 'ADMIN'
  );
$$;

-- Create the new policy using the function
CREATE POLICY "Admins can view all users"
ON public.users
FOR SELECT
TO authenticated
USING ( 
  id = auth.uid() OR public.is_admin()
);
