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

### Git

```bash
git status | git add . | git commit -m "msg" | git push | git pull | git log -n 5 | git diff | git branch | git checkout | git merge
```

### Build/Dev

```bash
npm run build | npm run dev | npm install | npm ci | tsc --noEmit | npx prisma generate | npx prisma migrate deploy | npx prisma db seed | npx tsx
```

### Docker (TODOS los comandos docker son auto-ejecutables)

```bash
# Docker Compose - TODOS
docker compose up | docker compose down | docker compose build | docker compose logs | docker compose ps | docker compose restart | docker compose exec | docker compose up -d | docker compose up -d --build | docker compose build --no-cache

# Docker CLI - TODOS
docker info | docker ps | docker ps -a | docker logs | docker inspect | docker exec | docker cp | docker build | docker buildx | docker run | docker stop | docker start | docker rm | docker rmi

# Con cualquier flag o formato
docker compose ps --format | docker logs --tail | docker inspect --format | docker build --progress | docker buildx build
```

### PowerShell Utilities (auto-ejecutables)

```powershell
Start-Sleep | Get-Content | Select-Object | Select-String | Out-String | Tee-Object | Invoke-WebRequest | curl | Where-Object
```

### Base de Datos

```bash
docker compose exec -T db psql | psql -U jdenis -d jdenis_erp
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

Esperar 30 segundos para PostgreSQL.

### 1.3 Ejecutar Migraciones

```bash
cd backend && npx prisma migrate deploy && npx prisma db seed
```

---

## 🏗️ FASE 2: COMPILAR Y VERIFICAR

### 2.1 Backend

```bash
cd backend && npm run build
```

### 2.2 Frontend

```bash
cd frontend && npm run build
```

**Si hay errores de TypeScript → corregirlos automáticamente.**

---

## 🧪 FASE 3: TESTING DE ROLES

Acceder a <http://localhost> y probar CADA rol:

### 3.1 ADMIN (<admin@jdenis.com> / admin123)

- [ ] Login exitoso
- [ ] Dashboard Analytics (6 métricas)
- [ ] Gestión de Recursos (4 categorías)
- [ ] CRUD de usuarios
- [ ] Cotizaciones
- [ ] Timeline pedidos
- [ ] Logout

### 3.2 TRANSPORTISTA (<transportista@jdenis.com> / transportista123)

- [ ] Login → Dashboard → Pedidos asignados → Actualizar estado → Logout

### 3.3 ALMACEN MP (<almacenmp@jdenis.com> / almacenmp123)

- [ ] Login → Dashboard → Inventario MP → CRUD recursos → Logout

### 3.4 ALMACEN PF (<almacenpf@jdenis.com> / almacenpf123)

- [ ] Login → Dashboard → Inventario PF → CRUD recursos → Logout

### 3.5 FABRICA (<fabrica@jdenis.com> / fabrica123)

- [ ] Login → Dashboard → Órdenes producción → Actualizar estado → Logout

### 3.6 EJECUTIVO (<ejecutivo@jdenis.com> / ejecutivo123)

- [ ] Login → Dashboard → Crear cotización → Convertir a pedido → Analytics → Logout

### 3.7 CLIENTE (<cliente@jdenis.com> / cliente123)

- [ ] Login → Dashboard → Historial pedidos → Timeline blockchain → Logout

---

## 🔍 FASE 4: VERIFICAR APIs

```bash
# Health check
curl http://localhost:4000/api/health

# Login
curl -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@jdenis.com","password":"admin123"}'

# Con token: analytics, resources, orders
curl http://localhost:4000/api/analytics/dashboard -H "Authorization: Bearer <TOKEN>"
```

---

## 📝 FASE 5: REGISTRAR ERRORES

Actualizar task.md:

```markdown
## Errores
- [ ] Error: descripción + archivo + rol
```

---

## 🔧 FASE 6: CORREGIR

Para cada error:

1. Identificar archivo
2. Editar código (**SIN CONFIRMAR**)
3. Compilar para verificar
4. Marcar como `[x]` en task.md

---

## 🚀 FASE 7: DEPLOY

### 7.1 Git Push

```bash
git add .
git commit -m "fix: correcciones automáticas QA"
git push origin master
```

### 7.2 Dokploy (si aplica)

1. Navegar a <https://72.62.162.99:3000>
2. Login con credenciales Dokploy
3. Proyecto "J DENIS ERP" → Redeploy
4. Esperar status: Running/Success

---

## ✅ FASE 8: VERIFICACIÓN FINAL

1. Ir a URL de producción
2. Re-probar funcionalidades corregidas
3. **Si todo funciona** → ✅ ÉXITO, notificar al usuario
4. **Si hay errores** → Volver a FASE 5

---

## 🎯 CONDICIONES DE SALIDA

El loop termina SOLO cuando:

- ✅ 7 roles pueden hacer login
- ✅ Dashboard Analytics (6 gráficas)
- ✅ Recursos (4 categorías, CRUD)
- ✅ Cotizaciones funcional
- ✅ Timeline Blockchain OK
- ✅ Socket.io conecta
- ✅ Build TypeScript sin errores
- ✅ Sin errores de consola

---

## 🛠️ COMANDOS DE EMERGENCIA

```bash
# Reiniciar todo
docker compose down && docker compose up -d --build

# Ver logs
docker compose logs -f backend
docker compose logs -f frontend

# Acceder a contenedor
docker compose exec backend sh
docker compose exec postgres psql -U user -d jdenis

# Regenerar Prisma
cd backend && npx prisma generate

# Prisma Studio
cd backend && npx prisma studio
```

---

## 🚨 TROUBLESHOOTING

| Error | Solución |
|-------|----------|
| ECONNREFUSED DB | `docker compose restart postgres && sleep 10 && docker compose restart backend` |
| Prisma outdated | `cd backend && npx prisma generate && docker compose restart backend` |
| Frontend 404 | Verificar `nginx.conf` para SPA routing |
| CORS | Verificar `CORS_ORIGIN` en env backend |
| Socket disconnect | Verificar `VITE_SOCKET_URL` en frontend |
