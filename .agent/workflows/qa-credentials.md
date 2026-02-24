---
description: Realiza una auditoría de credenciales, roles y permisos en el sistema para cada tipo de usuario
---

# Workflow: QA de Credenciales y Roles

Este workflow está diseñado para verificar que cada rol dentro del sistema ERP de J. Denis tenga acceso únicamente a las vistas y módulos correspondientes a sus permisos, manteniendo la visibilidad total y control absoluto para el rol de Administrador.

## Configuración y Preparación
1. Asegúrate de tener los servidores de desarrollo en funcionamiento (`npm run dev` en frontend y backend) o los servicios en Dokploy activos.
2. Limpia el almacenamiento local del navegador (o usa modo incógnito/perfiles distintos) para asegurar que ninguna sesión previa interfiera con las pruebas.

## Paso 1: Verificación de Administrador (Todas las vistas)
> **Objetivo:** Comprobar que el administrador tiene acceso sin restricciones a todos los módulos y configuraciones habilitadas.
1. Ingresa a la URL de inicio de sesión: `/login`
2. **Credenciales:**
   - Correo: `admin@jdenis.com`
   - Contraseña: `admin123`
3. **Validación:**
   - [ ] Redirección exitosa a `/admin` (Dashboard).
   - [ ] Confirmar la existencia de todos los elementos en el menú lateral:
     - Dashboard (`/admin`)
     - Usuarios (`/admin/users`)
     - Ventas (`/admin/sales`)
     - Embalaje (`/admin/packaging`)
     - Cola de Envíos (`/admin/warehouse-queue`)
     - Pedidos B2B (`/admin/orders`)
     - Reseñas (`/admin/reviews`)
     - Academia (`/admin/academy`)
     - Blog (`/admin/blog`)
     - Reels (`/admin/reels`)
     - Solicitudes Dist. (`/admin/distributors`)
     - Editor Catálogo (`/admin/catalog`)
     - Promos Carrito (`/admin/cart-promos`)
   - [ ] Hacer clic en cada uno y confirmar que las vistas cargan correctamente sin errores de permisos.
4. Finaliza la sesión desde el botón "Cerrar Sesión".

## Paso 2: Verificación de Ejecutivo
> **Objetivo:** Comprobar acceso a módulos de contenido, ventas y pedidos; bloqueando el resto.
1. Ingresa con:
   - Correo: `ejecutivo@jdenis.com`
   - Contraseña: `ejecutivo123`
2. **Validación:**
   - [ ] Solo debe mostrar: Dashboard, Ventas, Pedidos B2B, Academia, Blog, Reels, Solicitudes Dist.
   - [ ] Intenta acceder manualmente por URL a `/admin/users` o `/admin/catalog`. Debe rechazar el acceso o mostrar vista vacía dependiente de la lógica de ruteo.
3. Finaliza la sesión.

## Paso 3: Verificación de Fábrica
> **Objetivo:** Comprobar acceso únicamente a módulos de producción/embalaje.
1. Ingresa con:
   - Correo: `fabrica@jdenis.com`
   - Contraseña: `fabrica123`
2. **Validación:**
   - [ ] Solo debe mostrar: Dashboard, Embalaje (`/admin/packaging`).
   - [ ] Intenta forzar URL a `/admin/sales` o `/admin/orders`, el sistema debe bloquear el acceso.
3. Finaliza la sesión.

## Paso 4: Verificación de Almacén Producto Final (PF)
> **Objetivo:** Comprobar acceso a operaciones de logística y empaque.
1. Ingresa con:
   - Correo: `almacenpf@jdenis.com`
   - Contraseña: `almacenpf123`
2. **Validación:**
   - [ ] Solo debe mostrar: Dashboard, Embalaje (`/admin/packaging`), Cola de Envíos (`/admin/warehouse-queue`).
   - [ ] Resto de módulos invisibles en el menú y bloqueados por URL.
3. Finaliza la sesión.

## Paso 5: Verificación de Almacén Materia Prima (MP)
> **Objetivo:** Comprobar que solo ve el Dashboard (los recursos están en construcción y ocultos actualmente).
1. Ingresa con:
   - Correo: `almacenmp@jdenis.com`
   - Contraseña: `almacenmp123`
2. **Validación:**
   - [ ] Solo debe mostrar: Dashboard.
   - [ ] (Nota: Cuando el módulo de `Recursos` se active nuevamente, deberá validarse aquí).
3. Finaliza la sesión.

## Paso 6: Verificación de Transportista
> **Objetivo:** Comprobar que solo acceda al seguimiento básico.
1. Ingresa con:
   - Correo: `transportista@jdenis.com`
   - Contraseña: `transportista123`
2. **Validación:**
   - [ ] Solo debe mostrar: Dashboard.
   - [ ] (Nota: Cuando el módulo de `Transporte` se active nuevamente, deberá validarse aquí).
3. Finaliza la sesión.

## Reporte Final
- En caso de presentarse algún error en la navegación o visibilidad indebida de menú, documentarlo con una captura de pantalla e informar inmediatamente al equipo de desarrollo para actualizar `AdminLayout.tsx` o las reglas de base de datos.
