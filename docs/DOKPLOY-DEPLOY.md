# 🚀 DEPLOY DOKPLOY - J-DENIS (Simplificado)

## Arquitectura
```
Website (Vite/React) → Supabase (directo)
```

---

## PASO 1: Crear Proyecto en Dokploy

1. Conectar GitHub: `aloomushi-pixel/jdenis-website`
2. Branch: `master`
3. Nombre: `jdenis`

---

## PASO 2: Configurar Servicio

| Campo | Valor |
|-------|-------|
| Source Path | `/website` |
| Build | Dockerfile |
| Port | `80` |

---

## PASO 3: Variables de Entorno

```
VITE_SUPABASE_URL=https://irdeiiichmanewpnuaml.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyZGVpaWljaG1hbmV3cG51YW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxODA3NDgsImV4cCI6MjA4NTc1Njc0OH0.vNzADcACLa_4VLw2iQzINUZcP3Hl7rcBKoKanB4aJ8Y
```

---

## PASO 4: Deploy

Click **Deploy** → Esperar 2-3 min

---

## Verificar

Dominio: `https://jdenis.store`

Supabase: ✅ `ACTIVE_HEALTHY`
