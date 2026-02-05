# 🚀 Guía de Deployment - J DENIS ERP/WMS

## 🚨 SOLUCIÓN RÁPIDA: Error "can't cd to docker-compose.prod.yml"

**Si ves este error en los logs de Dokploy (después de configurar Docker Compose):**
```
/bin/sh: cd: can't cd to /etc/dokploy/.../docker-compose.prod.yml
❌ The path .../docker-compose.prod.yml does not exist
```

**Causa**: El campo de configuración en Dokploy está mal configurado. Dokploy intenta hacer `cd` al archivo compose como si fuera un directorio.

**Solución Inmediata:**

1. **Ir a Dokploy** → http://72.62.162.99:3000
2. **Login** con caballeroangela49@gmail.com / Darepamaxidi7
3. **Seleccionar el proyecto** "jdenis-website"
4. **Click en Settings/Configuración**
5. **Buscar la sección de Docker Compose:**
   - ✅ **Compose File**: `docker-compose.prod.yml` (solo el nombre del archivo)
   - ✅ **Working Directory**: `.` o dejar vacío (NO poner la ruta del archivo compose)
   - ✅ **Command**: `up -d --build` o dejar vacío
6. **Click en "Save"**
7. **Click en "Redeploy"**

> ⚠️ **CRÍTICO**: El compose file debe ser SOLO el nombre del archivo, no una ruta completa. Dokploy ejecutará: `docker compose -f docker-compose.prod.yml up -d` desde el directorio del código.

---

## 🚨 SOLUCIÓN RÁPIDA: Error "Dockerfile not found" en Dokploy

**Si ves este error en los logs de Dokploy:**
```
ERROR: failed to build: failed to solve: failed to read dockerfile: open Dockerfile: no such file or directory
❌ Docker build failed
```

**Causa**: Dokploy está configurado en modo "Dockerfile" pero el proyecto usa Docker Compose.

**Solución Inmediata:**

1. **Ir a Dokploy** → http://72.62.162.99:3000
2. **Login** con caballeroangela49@gmail.com / Darepamaxidi7
3. **Seleccionar el proyecto** "jdenis-website"
4. **Click en Settings/Configuración**
5. **En la sección "Build":**
   - ✅ **Build Type**: Cambiar de "Dockerfile" a **"Docker Compose"**
   - ✅ **Compose Path**: Escribir `docker-compose.prod.yml`
   - ✅ **Compose Command**: Dejar vacío o usar `up -d`
6. **Click en "Save"**
7. **Click en "Redeploy"**

> ⚠️ **CRÍTICO**: El proyecto NO tiene un Dockerfile en la raíz. Usa docker-compose.prod.yml con múltiples servicios (db, backend, frontend).

---

## 📋 Pasos para publicar en GitHub y deploy en Dokploy

### 1️⃣ Publicar en GitHub (SI NO TIENES REMOTE CONFIGURADO)

```bash
# Crear repositorio en GitHub primero en: https://github.com/new
# Nombre sugerido: j-denis-erp

# Luego ejecutar:
cd "c:\Users\Usuario\OneDrive\Documentos\J. DENIS\j-denis-erp"

# Si ya tienes origin configurado, solo push:
git push origin master

# Si NO tienes origin:
git remote add origin https://github.com/TU_USUARIO/j-denis-erp.git
git branch -M main
git push -u origin main
```

### 2️⃣ Configurar en Dokploy

#### Acceso:
- **URL**: http://72.62.162.99:3000
- **Usuario**: caballeroangela49@gmail.com
- **Password**: Darepamaxidi7

#### Pasos en Dokploy:

1. **Login** en http://72.62.162.99:3000/dashboard

2. **Ir al proyecto existente** o crear uno nuevo:
   - Click en "New Project" → "J DENIS ERP"

3. **Conectar GitHub Repository**:
   - Click en "New Application" → "From GitHub"
   - Seleccionar repositorio `j-denis-erp`
   - Branch: `main` o `master`

4. **Configurar Build Settings** (⚠️ **MUY IMPORTANTE**):
   - **Build Type**: Seleccionar **"Docker Compose"** (NO "Dockerfile")
   - **Compose Path**: Escribir exactamente: `docker-compose.prod.yml`
   - **Compose Command**: Dejar vacío o escribir `up -d`
   
   > 🚨 **ERROR COMÚN**: Si seleccionas "Dockerfile" en Build Type, el deploy fallará con:
   > ```
   > ERROR: failed to read dockerfile: open Dockerfile: no such file or directory
   > ```
   > **Solución**: Cambiar a "Docker Compose" y especificar `docker-compose.prod.yml`

5. **Variables de Entorno** (⚠️ **CRÍTICO** - Agregar TODAS en la pestaña "Environment"):

```env
# Backend - Supabase PostgreSQL (Managed Cloud Database)
# Obtener la contraseña desde: https://supabase.com/dashboard/project/vqcjxzsibywdxpvkyysa/settings/database
DATABASE_URL=postgresql://postgres.vqcjxzsibywdxpvkyysa:[YOUR-PASSWORD]@aws-0-us-west-2.pooler.supabase.com:6543/postgres

# JWT Secret (CAMBIAR EN PRODUCCIÓN)
JWT_SECRET=jdenis-production-secret-2026-super-seguro-cambiar

# Backend port
PORT=4000

# Node environment
NODE_ENV=production

# CORS - Frontend URL
FRONTEND_URL=http://72.62.162.99

# Frontend Build Args (build-time)
VITE_API_URL=http://72.62.162.99:4000/api
VITE_SOCKET_URL=http://72.62.162.99:4000
```

> 📝 **Nota Importante**: 
> - La base de datos está hospedada en **Supabase** (PostgreSQL cloud-managed)
> - Reemplaza `[YOUR-PASSWORD]` con la contraseña de tu proyecto Supabase
> - Para obtener la contraseña: Supabase Dashboard → Settings → Database → Database Password
> - Las variables `VITE_*` deben apuntar a la URL pública del backend
> - **NO necesitas crear un servicio PostgreSQL local**, la base de datos está en la nube

6. ~~**Crear Base de Datos PostgreSQL**~~ (YA NO NECESARIO):
   - ✅ **La base de datos está hospedada en Supabase** (proyecto: J DENIS)
   - Todas las tablas y esquemas ya están migrados a Supabase
   - Solo necesitas configurar la `DATABASE_URL` con tus credenciales de Supabase

7. **Deploy**:
   - Click en "Deploy"
   - Esperar ~5-8 minutos para build completo

### 3️⃣ Post-Deploy: Ejecutar Migraciones

Una vez desplegado, necesitas ejecutar las migraciones:

#### Opción A: Desde la UI de Dokploy
1. Ir al servicio del compose → pestaña "Logs"
2. Buscar el contenedor `jdenis-backend`
3. Click en "Console" o "Terminal"
4. Ejecutar:
```bash
npx prisma migrate deploy
npx prisma db seed
```

#### Opción B: Desde SSH
```bash
# Conectar al servidor
ssh root@72.62.162.99

# Encontrar el contenedor backend
docker ps | grep jdenis-backend

# Ejecutar comandos
docker exec -it jdenis-backend npx prisma migrate deploy
docker exec -it jdenis-backend npx prisma db seed
```

### 4️⃣ Verificar Deployment

1. **Backend API**: http://72.62.162.99:4000/api/health
   - Debería retornar: `{"status":"OK","message":"J DENIS ERP/WMS API"}`

2. **Frontend**: http://72.62.162.99
   - Debería cargar la página de login

3. **Login con credenciales:**

   **Usuario Administrador Personal:**
   - Email: `caballeroangela49@gmail.com`
   - Password: `Darepamaxidi7`
   - Rol: ADMIN

   **Usuario Administrador Demo:**
   - Email: `admin@jdenis.com`
   - Password: `admin123`
   - Rol: ADMIN

   **Otros usuarios de prueba:**
   - Transportista: `transportista@jdenis.com` / `transportista123`
   - Almacén MP: `almacenmp@jdenis.com` / `almacenmp123`
   - Almacén PF: `almacenpf@jdenis.com` / `almacenpf123`
   - Fábrica: `fabrica@jdenis.com` / `fabrica123`
   - Ejecutivo: `ejecutivo@jdenis.com` / `ejecutivo123`
   - Cliente: `cliente@jdenis.com` / `cliente123`

   > 📝 **Nota**: Estas credenciales se crean automáticamente al ejecutar `npx prisma db seed`

4. **Database Connection**:
   - Verificar que el backend se conectó a PostgreSQL
   - Ver logs en Dokploy → pestaña "Logs" → filtrar por `jdenis-backend`

### 5️⃣ Configurar Dominio (Opcional)

En Dokploy, en la configuración del servicio:
1. Pestaña "Domains"
2. Agregar dominio custom: `jdenis.tudominio.com`
3. Dokploy configurará automáticamente SSL con Let's Encrypt

---

## 🐛 Troubleshooting

### Error: "npm ci" Failed During Build

**Síntoma**: El frontend falla con `npm error Usage: npm ci` en los logs de build.

**Causa**: El repositorio no tiene `package-lock.json` o está desactualizado.

**Solución**: 
- ✅ **Ya corregido**: Los Dockerfiles ahora usan `npm install --legacy-peer-deps` en lugar de `npm ci`.
- Asegúrate de hacer `git pull` del repositorio actualizado.
- En Dokploy, haz clic en "Rebuild" para usar los Dockerfiles actualizados.

### Error: Faltan Variables de Entorno

**Síntoma**: La aplicación no arranca o muestra errores de conexión.

**Causa**: Las variables de entorno no están configuradas en Dokploy.

**Solución**:
1. Ve a la pestaña **"Environment"** del servicio compose en Dokploy
2. Agrega **TODAS** las variables listadas en la sección 2, paso 5
3. Haz clic en **"Save"**
4. Haz clic en **"Redeploy"**

### Error de Conexión a Base de Datos

**Síntoma**: Backend muestra `Error: Can't reach database server` o `Connection timeout`

**Causa**: Las credenciales de Supabase son incorrectas o la URL de conexión está mal formada.

**Solución**:
1. Verifica que la `DATABASE_URL` esté correctamente configurada en Dokploy:
   ```
   postgresql://postgres.vqcjxzsibywdxpvkyysa:[PASSWORD]@aws-0-us-west-2.pooler.supabase.com:6543/postgres
   ```
2. Obtén la contraseña correcta desde el Dashboard de Supabase:
   - Ir a https://supabase.com/dashboard/project/vqcjxzsibywdxpvkyysa/settings/database
   - Copiar la contraseña del proyecto
3. Reemplaza `[PASSWORD]` en `DATABASE_URL` con la contraseña real
4. Asegúrate de no tener espacios o caracteres especiales mal escapados
5. Guarda las variables de entorno en Dokploy y redeploy
6. Verifica los logs del backend para confirmar la conexión exitosa

### Frontend muestra "Cannot connect to server"

**Síntoma**: La interfaz no carga datos o muestra errores de red en la consola del navegador.

**Causa**: Variables `VITE_API_URL` o `VITE_SOCKET_URL` mal configuradas.

**Solución**:
1. Verifica las variables de entorno en Dokploy:
   ```
   VITE_API_URL=http://72.62.162.99:4000/api
   VITE_SOCKET_URL=http://72.62.162.99:4000
   ```
2. **Importante**: Estas variables se usan en **build time**, así que necesitas **rebuild** completo:
   - Dokploy → Servicio → "Rebuild"
3. Verifica que el backend esté corriendo: `curl http://72.62.162.99:4000/api/health`

### Error 502 Bad Gateway

**Síntoma**: Nginx muestra "502 Bad Gateway"

**Causa**: El backend no está corriendo o el puerto es incorrecto.

**Solución**:
1. Ver logs del contenedor backend en Dokploy → "Logs"
2. Verificar que `BACKEND_PORT=4000` esté configurado
3. Verificar que el backend arrancó correctamente (buscar "Server running on port 4000" en logs)
4. Reiniciar el servicio si es necesario

### Error: "Prisma Client not generated"

**Síntoma**: Backend falla con error `@prisma/client did not initialize yet`

**Solución**:
```bash
# En el contenedor backend
docker exec -it jdenis-backend npx prisma generate
docker exec -it jdenis-backend npm start
```

---

## 📊 Monitoreo

En Dokploy puedes ver:
- **Logs** en tiempo real (pestaña "Logs")
- **Métricas** de CPU/RAM (pestaña "Metrics" si disponible)
- **Deployments** históricos (pestaña "Deployments")
- **Reiniciar** servicios (botón "Restart" en cada servicio)

---

## 🔄 Actualizar la App

Cada vez que hagas cambios:

```bash
cd "c:\Users\Usuario\OneDrive\Documentos\J. DENIS\j-denis-erp"
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
```

Dokploy puede detectar automáticamente el push y redesplegar, o puedes hacer clic manualmente en "Deploy" en la interfaz.

---

## ✅ Checklist Final

- [ ] Repositorio publicado en GitHub
- [ ] Dokploy conectado al repositorio
- [ ] Docker Compose Path apunta a `docker-compose.prod.yml`
- [ ] **TODAS** las variables de entorno configuradas (8 variables)
- [ ] Base de datos PostgreSQL creada
- [ ] Build completado exitosamente (sin errores de `npm ci`)
- [ ] Migraciones ejecutadas (`npx prisma migrate deploy`)
- [ ] Seed ejecutado (`npx prisma db seed`)
- [ ] Backend responde en http://72.62.162.99:4000/api/health
- [ ] Frontend carga correctamente en http://72.62.162.99
- [ ] Login funciona con admin@jdenis.com / admin123

---

**¡Listo! La plataforma J DENIS ERP/WMS está en producción** 🎉
