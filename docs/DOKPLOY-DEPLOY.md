# 🚀 GUÍA DEPLOY DOKPLOY - J-DENIS

## Prerrequisitos
- Acceso a Dokploy en `http://72.62.162.99:3000`
- Repo conectado: `aloomushi-pixel/jdenis-website`

---

## PASO 1: Crear Proyecto en Dokploy

1. Login en Dokploy
2. Click **"New Project"** → Nombre: `jdenis-platform`
3. **Source**: GitHub → `aloomushi-pixel/jdenis-website`
4. Branch: `master`

---

## PASO 2: Configurar WEBSITE (E-commerce)

### Settings
| Campo | Valor |
|-------|-------|
| Name | `jdenis-website` |
| Source Path | `/website` |
| Build | Dockerfile |
| Port | `80` |
| Domain | `jdenis.com` o subdomain |

### Environment Variables
```plaintext
VITE_SUPABASE_URL=https://irdeiiichmanewpnuaml.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyZGVpaWljaG1hbmV3cG51YW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxODA3NDgsImV4cCI6MjA4NTc1Njc0OH0.vNzADcACLa_4VLw2iQzINUZcP3Hl7rcBKoKanB4aJ8Y
```

### Deploy
Click **"Deploy"** → Esperar build (~2-3 min)

---

## PASO 3: Configurar BACKEND (ERP API)

### Settings
| Campo | Valor |
|-------|-------|
| Name | `jdenis-backend` |
| Source Path | `/backend` |
| Build | Dockerfile |
| Port | `4000` |
| Domain | `api.jdenis.com` |

### Environment Variables
```plaintext
DATABASE_URL=postgresql://postgres.irdeiiichmanewpnuaml:[PASSWORD]@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.irdeiiichmanewpnuaml:[PASSWORD]@aws-0-us-west-2.pooler.supabase.com:5432/postgres
JWT_SECRET=jdenis-production-secret-2026
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://jdenis.com
```

> ⚠️ Reemplaza `[PASSWORD]` con la contraseña de Supabase

### Deploy
Click **"Deploy"** → Esperar build (~3-4 min)

---

## PASO 4: Configurar Dominios (Traefik)

En Dokploy → Project → Domains:

```
jdenis.com → jdenis-website:80
api.jdenis.com → jdenis-backend:4000
```

Enable HTTPS con Let's Encrypt automático ✅

---

## PASO 5: Verificar

### Website
```
curl https://jdenis.com
```

### Backend Health
```
curl https://api.jdenis.com/health
```

### Supabase
Ya verificado: `ACTIVE_HEALTHY` ✅

---

## 🔄 Auto-Deploy

Cada push a `master` en GitHub dispara redeploy automático.

---

## 📊 Estado Esperado

| Servicio | URL | Status |
|----------|-----|--------|
| Website | `jdenis.com` | ✅ Running |
| API | `api.jdenis.com` | ✅ Running |
| Supabase | `irdeiiichmanewpnuaml.supabase.co` | ✅ ACTIVE_HEALTHY |
