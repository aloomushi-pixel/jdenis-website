---
name: Dokploy Auto-Deploy
description: Flujo de trabajo para desplegar cambios a producción utilizando el navegador interno para automatizar Dokploy en el VPS de Hostinger.
---
# Flujo de Despliegue en Dokploy

Este flujo asegura que los cambios locales sean subidos a la rama master y desplegados exitosamente en el servidor VPS de Hostinger (`jdenis.store`) utilizando la instancia de Dokploy.

## 1. Verificación Local
Asegúrate de que no haya errores de compilación de TypeScript para evitar que Dokploy cancele el despliegue a la mitad.

## 2. Subir Código a GitHub
Sube todos los cambios pendientes a la rama principal:

```bash
git add .
git commit -m "Descripción de los cambios a desplegar"
git push origin master
```

## 3. Despliegue Automatizado en Dokploy
Utiliza tu herramienta `browser_subagent` para ingresar automáticamente al panel administrativo del VPS y desencadenar el despliegue.

**Prompt Estándar para el Subagente:**
```text
Navigate to `http://187.124.86.20:3000`. Log in with Email `juangarcia@ccurity.com.mx` and Password `E4ae5d6c0c.`. Click on the 'JDENIS' project, then click on the 'FrontEnd' service. Go to the General tab and click 'Deploy' (or 'Rebuild'). Confirm the action. Wait for the deployment to start and check the logs tab to verify it passes the `npm run build` step successfully.
```

## Detalles de Infraestructura y Credentials
- **VPS Dokploy:** `http://187.124.86.20:3000`
- **Usuario:** `juangarcia@ccurity.com.mx`
- **Contraseña:** `E4ae5d6c0c.` (Nota el punto al final).
- **Entorno de Producción:** `https://jdenis.store`
- **Proyecto/Aplicación:** `JDENIS / FrontEnd`

## Configuración de Producción (Supabase PRO)
Actualmente la producción apunta al entorno Supabase PRO:
- **Project ID (PRO):** `zdciwzeokkrwcxvsgusc`
- **Supabase URL:** `https://zdciwzeokkrwcxvsgusc.supabase.co`
- *(Nota: El entorno Free antiguo ha quedado deprecado).*

Si alguna vez necesitas actualizar variables de entorno en producción:
1. Pídele al subagente que vaya a la pestaña **Environment** en Dokploy.
2. Actualiza los valores (como `VITE_SUPABASE_URL` o `VITE_SUPABASE_ANON_KEY`).
3. Guarda y realiza un nuevo Deploy.

## Cuentas de Prueba para QA en Producción
Siempre que se requiera validar funcionalidades o reproducir errores en el sitio en vivo, utiliza la siguiente cuenta administrativa:
- **Usuario:** `caballeroangela49@gmail.com`
- **Contraseña:** `E4ae5d6c0c.` (Nota el punto al final).

**Regla estricta:** Todas las comprobaciones visuales y de renderizado (QA) deben realizarse utilizando estas credenciales directamente en el entorno de producción (`https://jdenis.store`).
