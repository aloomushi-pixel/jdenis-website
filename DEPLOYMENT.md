# 🚀 Guía de Deployment - J DENIS ERP/WMS

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

4. **Configurar Build Settings**:
   - Build Type: `docker-compose`
   - Docker Compose Path: `docker-compose.yml`

5. **Variables de Entorno** (muy importante):

```env
# Database (Dokploy PostgreSQL)
DATABASE_URL=postgresql://postgres:postgres@postgres-jdenis:5432/jdenis

# Backend
JWT_SECRET=jdenis-production-secret-2026-super-seguro-cambiar
NODE_ENV=production
PORT=4000

# Frontend Build Args
VITE_API_URL=http://72.62.162.99:4000
VITE_SOCKET_URL=http://72.62.162.99:4000
```

6. **Crear Base de Datos PostgreSQL** (si no existe):
   - En Dokploy: "New Database" → PostgreSQL
   - Name: `postgres-jdenis`
   - User: `postgres`
   - Password: `postgres`
   - Database: `jdenis`

7. **Deploy**:
   - Click en "Deploy"
   - Esperar ~5 minutos para build completo

### 3️⃣ Post-Deploy: Ejecutar Migraciones

Una vez desplegado, necesitas ejecutar las migraciones:

#### Opción A: Desde la UI de Dokploy
1. Ir al contenedor `backend`
2. Click en "Console" o "Terminal"
3. Ejecutar:
```bash
npx prisma migrate deploy
npx prisma db seed
```

#### Opción B: Desde SSH
```bash
# Conectar al servidor
ssh root@72.62.162.99

# Encontrar el contenedor
docker ps | grep backend

# Ejecutar comandos
docker exec -it <container-id> npx prisma migrate deploy
docker exec -it <container-id> npx prisma db seed
```

### 4️⃣ Verificar Deployment

1. **Backend API**: http://72.62.162.99:4000/health
   - Debería retornar: `{"status":"OK","message":"J DENIS ERP/WMS API"}`

2. **Frontend**: http://72.62.162.99
   - Login con: `admin@jdenis.com` / `admin123`

3. **Database Connection**:
   - Verificar que el backend se conectó a PostgreSQL
   - Ver logs en Dokploy

### 5️⃣ Configurar Dominio (Opcional)

En Dokploy, en la configuración del proyecto:
1. Agregar dominio custom: `jdenis.tudominio.com`
2. Dokploy configurará automáticamente SSL con Let's Encrypt

### 🐛 ¿Qué hacer si algo falla?

#### Error: "Cannot connect to database"
```bash
# Verificar que PostgreSQL esté corriendo
docker ps | grep postgres

# Ver logs
docker logs <postgres-container-id>

# Verificar DATABASE_URL en variables de entorno
```

#### Error: "Prisma Client not generated"
```bash
# En el contenedor backend
docker exec -it <backend-container-id> npx prisma generate
```

#### Frontend muestra "Cannot connect to server"
- Verificar que `VITE_API_URL` esté correctamente configurado
- Verificar que el backend esté corriendo: `http://72.62.162.99:4000/health`

#### Error 502 Bad Gateway
- El backend probablemente no está corriendo
- Ver logs del contenedor backend en Dokploy
- Verificar que el PORT=4000 esté configurado

### 📊 Monitoreo

En Dokploy puedes ver:
- **Logs** en tiempo real
- **Métricas** de CPU/RAM
- **Deployments** históricos
- **Reiniciar** servicios si es necesario

### 🔄 Actualizar la App

Cada vez que hagas cambios:

```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
```

Dokploy detectará automáticamente el push y redespleará la aplicación.

---

## ✅ Checklist Final

- [ ] Repositorio publicado en GitHub
- [ ] Dokploy conectado al repositorio
- [ ] Variables de entorno configuradas
- [ ] Base de datos PostgreSQL creada
- [ ] Migraciones ejecutadas
- [ ] Seed ejecutado (usuarios de prueba)
- [ ] Backend responde en /health
- [ ] Frontend carga correctamente
- [ ] Login funciona con admin@jdenis.com

---

**¡Listo! La plataforma J DENIS ERP/WMS está en producción** 🎉
