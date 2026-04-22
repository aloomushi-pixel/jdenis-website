# Gestor Multimedia (Almacenamiento VPS Local)

Se implementará un módulo completo de administración de medios para que las imágenes y documentos de la plataforma se almacenen directamente en el disco duro del VPS (gestionado mediante volúmenes en Dokploy) en lugar de utilizar servicios en la nube de pago.

## Arquitectura de la Solución

Dado que el proyecto actual (`website`) es un frontend estático en React/Vite, no tiene capacidad nativa para escribir archivos en el disco duro del servidor. Por lo tanto, dividiremos la solución en dos partes:

1. **Nuevo Micro-Backend (Media API):** 
   - Crearemos una carpeta `media-server` en el repositorio.
   - Será un pequeño servidor en `Node.js + Express + Multer`.
   - Se encargará exclusivamente de recibir, listar, borrar y servir (mostrar) las imágenes de forma estática.
   - Implementará seguridad validando el token de sesión JWT (Supabase Auth) para asegurar que solo los administradores puedan subir/borrar archivos.

2. **Frontend (React Media Manager):**
   - Un nuevo componente en el panel administrativo (`/admin/media`).
   - Interfaz visual estilo "Carpetas" parecida a Google Drive o WordPress Media Library.
   - Capacidades: Subir archivos mediante drag & drop, explorar carpetas, visualizar miniaturas, borrar archivos y copiar las URLs públicas de las imágenes.

## User Review Required

> [!IMPORTANT]
> **Configuración requerida en Dokploy**
> Para que esto funcione, este nuevo `media-server` tendrá que desplegarse en Dokploy como un "Servicio Adicional" (o aplicación separada).
> Deberás mapear un Volumen (Volume) en Dokploy apuntando a `/app/uploads` para que los archivos no se pierdan si se reinicia el contenedor.
> ¿Estás de acuerdo con añadir un nuevo contenedor/servicio en Dokploy específicamente para esta API multimedia?

## Open Questions

> [!WARNING]
> 1. **URLs de los archivos:** ¿Tienes pensado usar un subdominio específico para tus imágenes (ejemplo: `media.jdenis.com`) o prefieres que vivan en una sub-ruta del dominio principal (ejemplo: `jdenis.com/api/uploads`) o simplemente usar la IP/Puerto como `api.jdenis.com`?
> 2. **Tipos de archivos:** El sistema permitirá subir imágenes (`.png, .jpg, .webp, .svg, .gif`) y videos (`.mp4`). ¿Hay algún otro tipo de archivo (ej. PDFs para fichas técnicas) que necesites incluir?

## Proposed Changes

### Media Server (Backend)
Se creará un nuevo directorio `media-server` con su propio entorno de Node.js.

#### [NEW] media-server/package.json
Dependencias: `express`, `multer`, `cors`, `@supabase/supabase-js`.

#### [NEW] media-server/index.js
Lógica principal del servidor. Definirá los endpoints:
- `POST /api/upload` (subir un archivo a un directorio)
- `GET /api/files` (listar directorios y archivos)
- `DELETE /api/files` (borrar un archivo)
- Servidor de estáticos: `app.use('/uploads', express.static('uploads'))`

#### [NEW] media-server/Dockerfile
Archivo de construcción Docker para que Dokploy pueda desplegarlo automáticamente.

---

### React Frontend (Dashboard)

#### [NEW] website/src/pages/admin/MediaManager.tsx
Interfaz principal del gestor multimedia. Componente React con navegación por carpetas, grilla de archivos, botón de subida y panel de previsualización.

#### [MODIFY] website/src/components/layouts/AdminLayout.tsx
Añadir el enlace al menú lateral del administrador apuntando a la nueva ruta `/admin/media`.

#### [MODIFY] website/src/App.tsx
Registrar la nueva ruta `/admin/media` dentro de las rutas protegidas de administración.

#### [MODIFY] website/.env.example / .env.dokploy.example
Añadir una nueva variable de entorno `VITE_MEDIA_API_URL` que indicará a React a dónde enviar los archivos.

## Verification Plan

### Automated Tests
- No aplica (se probará en el entorno local manualmente).

### Manual Verification
1. **Backend:** Se levantará el `media-server` localmente y se probarán los endpoints.
2. **Frontend:** Se probará la interfaz gráfica, confirmando la subida de una imagen de prueba, la creación de una carpeta, y se verificará que la imagen devuelva una URL pública accesible.
3. **Dokploy (Post-Implementación):** El usuario deberá desplegar en el VPS y probar que los archivos perduran después de hacer un "Redeploy" de la aplicación (gracias al Volumen configurado).
