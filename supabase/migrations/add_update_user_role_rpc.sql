-- Function to securely update user roles
-- This function runs with SECURITY DEFINER privileges to bypass RLS,
-- but it first checks if the calling user is an ADMIN.

CREATE OR REPLACE FUNCTION update_user_role_admin(target_user_id text, new_role text)
RETURNS void AS $$
DECLARE
  v_caller_role text;
BEGIN
  -- Get the role of the user attempting to make the change
  SELECT role INTO v_caller_role FROM public.users WHERE id::text = auth.uid()::text;
  
  -- Check if the caller is an ADMIN
  IF v_caller_role != 'ADMIN' THEN
    RAISE EXCEPTION 'Unauthorized: only admins can change user roles';
  END IF;

  -- Update the target user's role
  UPDATE public.users
  SET role = new_role
  WHERE id::text = target_user_id::text;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
