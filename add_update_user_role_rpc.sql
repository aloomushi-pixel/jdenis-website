CREATE OR REPLACE FUNCTION update_user_role_admin(target_user_id text, new_role text)
RETURNS void AS $$
BEGIN
  -- Update the user role in the public.users table securely
  UPDATE public.users
  SET role = new_role
  WHERE id = target_user_id::uuid;

  -- Also update the raw_user_meta_data if role is stored there, optional but good practice
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', to_jsonb(new_role))
  WHERE id = target_user_id::uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
