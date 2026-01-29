---
description: Loop Maestro J-Denis ERP - Bucle infinito de QA, correcciones y deploy automático
---

# 🔄 J-DENIS ERP - LOOP MAESTRO

Workflow unificado que combina: auto-testing, permisos completos, QA de roles, deploy automático y mejora continua.

// turbo-all

---

## 🚀 AUTO-CONTINUAR (CRÍTICO)

**REGLA ABSOLUTA:** Cuando el usuario escribe "continuar", "continue", "sigue", "go":

1. **LEER** este workflow inmediatamente
2. **LEER** task.md para ver estado actual
3. **EJECUTAR** desde el paso pendiente
4. **CERO CONFIRMACIONES** - todo es automático

### Si el contexto se satura

1. Guardar estado en task.md
2. Hacer commit si hay cambios
3. Terminar: "Escribe **continuar** para reanudar"

---

## ⚡ PERMISOS AUTOMÁTICOS

Todos estos comandos se ejecutan SIN pedir confirmación (SafeToAutoRun=true):

### Git (incluyendo commits multi-línea)

```bash
git status | git add . | git commit -m "msg" | git push | git pull | git log -n 5 | git diff | git branch | git checkout | git merge

# Multi-line commits también son auto-ejecutables
git commit -m "fix: descripción

- detalle 1
- detalle 2"
```

### Build/Dev

```bash
npm run build | npm run dev | npm install | npm ci | tsc --noEmit | npx prisma generate | npx prisma migrate deploy | npx tsx | npm run prisma:seed
```

### Docker (TODOS los comandos docker son auto-ejecutables)

```bash
# Docker Compose - TODOS
docker compose up | docker compose down | docker compose build | docker compose logs | docker compose ps | docker compose restart | docker compose exec | docker compose up -d | docker compose up -d --build | docker compose build --no-cache | docker compose up -d --force-recreate

# Docker CLI - TODOS
docker info | docker ps | docker ps -a | docker logs | docker inspect | docker exec | docker cp | docker build | docker buildx | docker run | docker stop | docker start | docker rm | docker rmi

# Con cualquier flag o formato
docker compose ps --format | docker logs --tail | docker inspect --format | docker build --progress | docker buildx build
```

### PowerShell (TODOS auto-ejecutables)

```powershell
# Utilidades básicas
Start-Sleep | Get-Content | Select-Object | Select-String | Out-String | Tee-Object | Where-Object | ConvertFrom-Json | ConvertTo-Json

# HTTP Requests (incluyendo con variables y tokens)
Invoke-WebRequest | curl
$response = Invoke-WebRequest ...; $token = ($response.Content | ConvertFrom-Json).token
Invoke-WebRequest -Headers @{Authorization="Bearer $token"} ...

# Node inline
node -e "..." | docker compose exec -T backend node -e "..."
```

### Base de Datos

```bash
docker compose exec -T db psql -U jdenis -d jdenis_erp
```

---

## 🔧 FASE 1: PRE-VUELO

### 1.1 Verificar Docker

```bash
docker info
docker compose ps
```

### 1.2 Levantar Servicios (si no están corriendo)

```bash
docker compose up -d --build
```

Esperar 30 segundos para PostgreSQL:

```bash
Start-Sleep -Seconds 30
```

### 1.3 Ejecutar Migraciones y Seed

```bash
# Generar cliente Prisma
docker compose exec backend npx prisma generate

# Ejecutar migraciones
docker compose exec backend npx prisma migrate deploy

# Seed de base de datos (incluye usuario caballeroangela49@gmail.com)
docker compose exec backend npm run prisma:seed
```

---

## 🏗️ FASE 2: COMPILAR Y VERIFICAR

### 2.1 Backend (dentro del contenedor)

```bash
docker compose exec backend npm run build
```

### 2.2 Frontend (dentro del contenedor)

```bash
docker compose exec frontend npm run build
```

**Si hay errores de TypeScript → corregirlos automáticamente.**

---

## 🧪 FASE 3: TESTING DE ROLES

Acceder a <http://localhost> y probar CADA rol:

### 3.1 ADMIN PERSONAL (<caballeroangela49@gmail.com> / Darepamaxidi7)

- [ ] Login exitoso
- [ ] Dashboard Analytics (6 métricas)
- [ ] Gestión de Recursos (4 categorías)
- [ ] CRUD de usuarios
- [ ] Cotizaciones
- [ ] Timeline pedidos
- [ ] Logout

### 3.2 ADMIN DEMO (<admin@jdenis.com> / admin123)

- [ ] Login exitoso
- [ ] Dashboard Analytics (6 métricas)
- [ ] Gestión de Recursos (4 categorías)
- [ ] CRUD de usuarios
- [ ] Cotizaciones
- [ ] Timeline pedidos
- [ ] Logout

### 3.3 TRANSPORTISTA (<transportista@jdenis.com> / transportista123)

- [ ] Login → Dashboard → Pedidos asignados → Actualizar estado → Logout

### 3.4 ALMACEN MP (<almacenmp@jdenis.com> / almacenmp123)

- [ ] Login → Dashboard → Inventario MP → CRUD recursos → Logout

### 3.5 ALMACEN PF (<almacenpf@jdenis.com> / almacenpf123)

- [ ] Login → Dashboard → Inventario PF → CRUD recursos → Logout

### 3.6 FABRICA (<fabrica@jdenis.com> / fabrica123)

- [ ] Login → Dashboard → Órdenes producción → Actualizar estado → Logout

### 3.7 EJECUTIVO (<ejecutivo@jdenis.com> / ejecutivo123)

- [ ] Login → Dashboard → Crear cotización → Convertir a pedido → Analytics → Logout

### 3.8 CLIENTE (<cliente@jdenis.com> / cliente123)

- [ ] Login → Dashboard → Historial pedidos → Timeline blockchain → Logout

---

## 🔍 FASE 4: VERIFICAR APIs

```powershell
# Health check (Puerto 3000 para backend)
Invoke-WebRequest http://localhost:3000/api/health

# Login admin personal
$loginResponse = Invoke-WebRequest -Method POST -Uri "http://localhost:3000/api/auth/login" `
  -ContentType "application/json" `
  -Body '{"email":"caballeroangela49@gmail.com","password":"Darepamaxidi7"}'

# Extraer token
$token = ($loginResponse.Content | ConvertFrom-Json).token

# Con token: analytics, resources, orders
Invoke-WebRequest -Uri "http://localhost:3000/api/analytics/dashboard" `
  -Headers @{Authorization="Bearer $token"}

Invoke-WebRequest -Uri "http://localhost:3000/api/resources" `
  -Headers @{Authorization="Bearer $token"}
```

---

## 📝 FASE 5: REGISTRAR ERRORES

Actualizar task.md en artifacts:

```markdown
## Errores Encontrados
- [ ] Error: [descripción] - Archivo: [ruta] - Rol: [rol afectado]
```

---

## 🔧 FASE 6: CORREGIR

Para cada error:

1. Identificar archivo
2. Editar código (**automáticamente, sin confirmar**)
3. Compilar para verificar:
   ```bash
   docker compose exec backend npm run build
   # O
   docker compose exec frontend npm run build
   ```
4. Marcar como `[x]` en task.md

---

## 🚀 FASE 7: DEPLOY

### 7.1 Git Push

```bash
git add .
git commit -m "fix: correcciones automáticas QA Loop Maestro

- Corregidos errores detectados en testing
- Actualizados tipos y validaciones"

git push origin master
```

### 7.2 Dokploy (PRODUCCIÓN)

**Opción A - Manual desde Panel Web:**
1. Navegar a <http://72.62.162.99:3000>
2. Login con:
   - Email: `caballeroangela49@gmail.com`
   - Password: `Darepamaxidi7`
3. Proyecto "J DENIS ERP" o "jdenis-website" → **Redeploy**
4. Esperar status: Running/Success

**Opción B - SSH Directo:**
```bash
ssh root@72.62.162.99 "cd /path/to/project && git pull && docker compose up -d --build"
```

### 7.3 Ejecutar Seed en Producción (si es primer deploy)

```bash
ssh root@72.62.162.99
docker exec -it $(docker ps -qf "name=backend") npm run prisma:seed
```

---

## ✅ FASE 8: VERIFICACIÓN FINAL

1. Ir a URL de producción (http://72.62.162.99 o dominio configurado)
2. Re-probar funcionalidades corregidas
3. **Si todo funciona** → ✅ ÉXITO, notificar al usuario con resumen
4. **Si hay errores** → Volver a FASE 5

---

## 🎯 CONDICIONES DE SALIDA

El loop termina SOLO cuando:

- ✅ 8 usuarios pueden hacer login (7 demo + 1 personal)
- ✅ Dashboard Analytics (6 gráficas) funciona
- ✅ Recursos (4 categorías, CRUD completo)
- ✅ Cotizaciones funcional
- ✅ Timeline Blockchain OK
- ✅ Socket.io conecta
- ✅ Build TypeScript sin errores
- ✅ Sin errores críticos de consola

---

## 🛠️ COMANDOS DE EMERGENCIA

### Local (Docker Compose)

```bash
# Reiniciar todo desde cero
docker compose down -v
docker compose up -d --build
Start-Sleep -Seconds 30
docker compose exec backend npm run prisma:generate
docker compose exec backend npm run prisma:migrate
docker compose exec backend npm run prisma:seed

# Ver logs en tiempo real
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db

# Acceder a contenedor
docker compose exec backend sh
docker compose exec db psql -U jdenis -d jdenis_erp

# Regenerar Prisma
docker compose exec backend npx prisma generate

# Prisma Studio (requiere puerto expuesto)
docker compose exec backend npx prisma studio
```

### Verificación de Base de Datos

```bash
# Ver usuarios en DB
docker compose exec db psql -U jdenis -d jdenis_erp -c "SELECT email, full_name, role FROM users;"

# Verificar usuario personal
docker compose exec db psql -U jdenis -d jdenis_erp -c "SELECT email, role FROM users WHERE email='caballeroangela49@gmail.com';"

# Contar recursos
docker compose exec db psql -U jdenis -d jdenis_erp -c "SELECT category, COUNT(*) FROM resources GROUP BY category;"
```

---

## 🚨 TROUBLESHOOTING

| Error | Solución | Comando |
|-------|----------|---------|
| **ECONNREFUSED DB** | Reiniciar postgres y backend | `docker compose restart db && Start-Sleep -Seconds 10 && docker compose restart backend` |
| **Prisma Client Outdated** | Regenerar cliente | `docker compose exec backend npx prisma generate && docker compose restart backend` |
| **Frontend 404 en rutas** | Verificar nginx.conf para SPA | Revisar `try_files` en nginx |
| **CORS Error** | Verificar FRONTEND_URL en backend | Debe estar en variables de entorno |
| **Socket disconnect** | Verificar VITE_SOCKET_URL | En frontend .env: `VITE_SOCKET_URL=http://localhost:3000` |
| **Build falla** | Limpiar node_modules | `docker compose down && docker compose build --no-cache` |
| **Puerto ya en uso** | Matar proceso o cambiar puerto | `docker compose down` primero |
| **Usuario no existe** | Re-ejecutar seed | `docker compose exec backend npm run prisma:seed` |

---

## 📊 CHECKLIST COMPLETO DE VALIDACIÓN

Antes de dar por terminado el loop, verificar:

### Backend
- [ ] API Health endpoint responde
- [ ] Login funciona para los 8 usuarios
- [ ] JWT se genera correctamente
- [ ] CORS configurado para frontend
- [ ] Socket.IO acepta conexiones
- [ ] Prisma Client actualizado
- [ ] Migraciones aplicadas

### Frontend
- [ ] Builds sin errores TypeScript
- [ ] Rutas SPA funcionan (refresh en /dashboard)
- [ ] Socket conecta en tiempo real
- [ ] Formularios validan correctamente
- [ ] Imágenes/assets cargan
- [ ] PWA manifest válido

### Database
- [ ] 8 usuarios creados
- [ ] Productos de ejemplo existen
- [ ] Recursos en 4 categorías
- [ ] Ubicaciones de inventario creadas
- [ ] Vehicles disponibles

### Deploy
- [ ] Código en GitHub actualizado
- [ ] Docker images construyen
- [ ] Contenedores corren sin crashes
- [ ] Producción accesible vía HTTP
- [ ] Logs sin errores críticos

---

## 🎓 NOTAS IMPORTANTES

1. **Puertos Correctos:**
   - Backend API: `3000`
   - Frontend: `80`
   - PostgreSQL: `5432`
   - Dokploy Panel: `3000` (en servidor remoto)

2. **Nombres de Contenedores:**
   - `jdenis-backend`
   - `jdenis-frontend`
   - `jdenis-db` (NO "postgres")

3. **Usuario Administrador Personal:**
   - Email: `caballeroangela49@gmail.com`
   - Password: `Darepamaxidi7`
   - Este usuario se crea automáticamente con el seed

4. **Scripts NPM Backend:**
   - `npm run prisma:seed` (NO `npx prisma db seed`)
   - `npm run prisma:migrate` (para migrate deploy)
   - `npm run build` (compila TypeScript)

5. **Variables de Entorno Críticas:**
   - `DATABASE_URL` - Conexión PostgreSQL
   - `JWT_SECRET` - Para tokens
   - `FRONTEND_URL` - Para CORS
   - `PORT` - Puerto del backend (3000)
