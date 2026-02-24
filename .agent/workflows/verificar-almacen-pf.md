---
description: Workflow QA - Reactivación del Módulo Almacén PF
---
Este workflow guía el proceso de verificación interactiva para garantizar que el módulo de "Almacén PF" (que contempla las áreas de Embalaje y la Cola de Envíos) haya sido reactivado correctamente y funcione de manera esperada en el ERP.

**Pasos de la rutina de pruebas:**

1. **Configuración del Usuario de Prueba**:
   - Iniciar sesión en el portal con un usuario que tenga el rol `ALMACEN_PF`.
   - Si no cuentas con uno a la mano, pide al asistente modificar temporalmente un usuario de prueba en Supabase para otorgarle dicho rol.

2. **Navegación al Panel de Administración**:
   - Dirígete a `/admin`.
   - Comprueba visualmente que el sidebar muestre el menú correctamente renderizado. El usuario Almacén PF debería ver específicamente "Embalaje" y "Cola de Envíos", además de la vista base.

3. **Verificación de Embalaje**:
   - Hacer clic en la pestaña "Embalaje" (`/admin/packaging`).
   - Confirmar que la tabla o lista de registros de embalaje carga los datos sin errores de red o consola.
   - Probar la creación, actualización o gestión de un registro de embalaje para determinar si hay problemas de políticas *RLS* en la base de datos que impidan su funcionamiento.

4. **Verificación de Cola de Envíos**:
   - Hacer clic en la pestaña "Cola de Envíos" (`/admin/warehouse-queue`).
   - Confirmar que se muestre correctamente la cola de productos o envíos pendientes del almacén de Producto Terminado.
   - Probar cambiar el estado (mover/procesar) algún elemento en la cola.

5. **Ajustes y Correcciones Finales (si aplican)**:
   - Si alguno de los pasos anteriores genera *warnings* o *errors* en consola o en la interfaz, detente para analizar el registro de errores, notificar y resolver.
