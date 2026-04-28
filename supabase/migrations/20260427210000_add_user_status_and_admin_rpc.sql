-- 1. Añadir columna is_active a la tabla users para Soft Delete (si no existe)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 2. Función segura para que los administradores actualicen el rol o estado de un usuario
CREATE OR REPLACE FUNCTION admin_update_user(target_user_id text, new_role text, new_status boolean)
RETURNS void AS $$
DECLARE
  v_caller_role text;
BEGIN
  -- Obtener el rol del usuario que intenta hacer el cambio
  SELECT role INTO v_caller_role FROM public.users WHERE id::text = auth.uid()::text;
  
  -- Verificar que el ejecutor sea un ADMIN
  IF v_caller_role != 'ADMIN' THEN
    RAISE EXCEPTION 'Acceso denegado: solo los administradores pueden modificar usuarios.';
  END IF;

  -- Bloqueo Anti-Lockout: Un administrador no puede cambiarse su propio rol a uno menor ni desactivarse a sí mismo
  IF target_user_id::text = auth.uid()::text THEN
    IF new_role != 'ADMIN' THEN
      RAISE EXCEPTION 'Acción bloqueada: No puedes quitarte el rol de Administrador a ti mismo.';
    END IF;
    IF new_status = false THEN
      RAISE EXCEPTION 'Acción bloqueada: No puedes desactivar tu propia cuenta.';
    END IF;
  END IF;

  -- Actualizar el rol y el estado del usuario objetivo
  UPDATE public.users
  SET 
    role = new_role,
    is_active = new_status
  WHERE id::text = target_user_id::text;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
