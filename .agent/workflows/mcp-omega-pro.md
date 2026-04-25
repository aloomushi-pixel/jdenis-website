---
description: Workflow MCP-Omega-Pro - GitHub + Supabase MCP integrados, NPX sin Docker
---

# 🚀 MCP-OMEGA-PRO WORKFLOW

Workflow zero-touch que usa **MCPs exclusivamente** para GitOps y base de datos. Cero Docker, desarrollo con NPX.

// turbo-all

---

## 📊 CONFIGURACIÓN MCP

### GitHub
- **Owner**: `aloomushi-pixel`
- **Repo**: `jdenis-website`
- **Branch default**: `master`

### Supabase
- **Project ID**: `zdciwzeokkrwcxvsgusc`
- **Organization**: `otlflptzfgrhfahpunkl`
- **Region**: `us-west-2`
- **Status**: `ACTIVE_HEALTHY`
- **Note**: ESTE ES EL ENTORNO PRO DE PRODUCCIÓN. El entorno FREE antiguo (`kxoitidsrfeqxwvxjwsd`) ha sido deprecado. Nunca usar el free.

---

## ⚡ PERMISOS AUTOMÁTICOS

### NPX (SafeToAutoRun=true)
```bash
npx prisma generate | npx prisma migrate dev | npx prisma studio
npx tsx | npx tsc --noEmit
npx vite | npx vite build | npx vite preview
```

### NPM (SafeToAutoRun=true)
```bash
npm run dev | npm run build | npm install | npm ci | npm run lint
```

### PowerShell (SafeToAutoRun=true)
```powershell
Start-Sleep | Get-Content | Invoke-WebRequest | curl
node -e "..." | npx tsx
```

---

## 🔧 FASE 1: ESTADO DEL PROYECTO

### 1.1 Verificar GitHub (via MCP)

**Usar:**
- `mcp_github-mcp-server_list_pull_requests` - PRs abiertos
- `mcp_github-mcp-server_list_issues` - Issues pendientes
- `mcp_github-mcp-server_list_commits` - Últimos commits

### 1.2 Verificar Supabase (via MCP)

**Usar:**
- `mcp_supabase-mcp-server_get_project` con id: `zdciwzeokkrwcxvsgusc`
- `mcp_supabase-mcp-server_list_tables` con schemas: `["public"]`
- `mcp_supabase-mcp-server_get_advisors` - Alertas de seguridad

### 1.3 Desarrollo Local

```bash
# Instalar dependencias
cd backend && npm install
cd ../frontend && npm install

# Ejecutar dev servers
npm run dev  # Cada directorio
```

---

## 🏗️ FASE 2: DESARROLLO

### 2.1 Editar Código Localmente

Usar herramientas de edición estándar (`replace_file_content`, `write_to_file`, etc.)

### 2.2 Verificar Build

```bash
# Backend
cd backend && npm run build

# Frontend  
cd frontend && npm run build
```

### 2.3 Tipos de Supabase

**Generar types automáticamente:**
```
mcp_supabase-mcp-server_generate_typescript_types
  project_id: "zdciwzeokkrwcxvsgusc"
```

Copiar output a `src/types/supabase.ts`

---

## 💾 FASE 3: MIGRACIONES (Supabase MCP)

### 3.1 Crear Migración

```
mcp_supabase-mcp-server_apply_migration
  project_id: "zdciwzeokkrwcxvsgusc"
  name: "nombre_en_snake_case"
  query: "CREATE TABLE... / ALTER TABLE..."
```

### 3.2 Verificar Migración

```
mcp_supabase-mcp-server_list_migrations
  project_id: "zdciwzeokkrwcxvsgusc"
```

### 3.3 Revisar Seguridad RLS

```
mcp_supabase-mcp-server_get_advisors
  project_id: "zdciwzeokkrwcxvsgusc"
  type: "security"
```

---

## 🚀 FASE 4: DEPLOY (GitHub MCP - NO git CLI)

### 4.1 Push de Cambios

**Para archivos individuales:**
```
mcp_github-mcp-server_create_or_update_file
  owner: "aloomushi-pixel"
  repo: "jdenis-website"
  path: "ruta/al/archivo.ts"
  content: "[contenido del archivo]"
  message: "fix: descripción del cambio"
  branch: "master"
```

**Para múltiples archivos (recomendado):**
```
mcp_github-mcp-server_push_files
  owner: "aloomushi-pixel"
  repo: "jdenis-website"
  branch: "master"
  message: "feat: descripción de cambios"
  files: [
    {"path": "archivo1.ts", "content": "..."},
    {"path": "archivo2.ts", "content": "..."}
  ]
```

### 4.2 Crear PR (Opcional pero recomendado)

```
mcp_github-mcp-server_create_branch
  owner: "aloomushi-pixel"
  repo: "jdenis-website"
  branch: "feature/nombre-feature"
  from_branch: "master"
```

Luego:
```
mcp_github-mcp-server_create_pull_request
  owner: "aloomushi-pixel"
  repo: "jdenis-website"
  title: "feat: Título del PR"
  head: "feature/nombre-feature"
  base: "master"
  body: "Descripción de cambios"
```

### 4.3 Merge PR

```
mcp_github-mcp-server_merge_pull_request
  owner: "aloomushi-pixel"
  repo: "jdenis-website"
  pull_number: [número]
  merge_method: "squash"
```

---

## 🌐 FASE 5: EDGE FUNCTIONS (Supabase MCP)

### 5.1 Deploy Edge Function

```
mcp_supabase-mcp-server_deploy_edge_function
  project_id: "zdciwzeokkrwcxvsgusc"
  name: "mi-funcion"
  entrypoint_path: "index.ts"
  verify_jwt: true
  files: [
    {
      "name": "index.ts",
      "content": "import { ... }"
    }
  ]
```

### 5.2 Ver Logs

```
mcp_supabase-mcp-server_get_logs
  project_id: "zdciwzeokkrwcxvsgusc"
  service: "edge-function"
```

---

## 📝 FASE 6: TRACKING (GitHub Issues MCP)

### 6.1 Crear Issue para Bug

```
mcp_github-mcp-server_create_issue
  owner: "aloomushi-pixel"
  repo: "jdenis-website"
  title: "bug: Descripción del bug"
  body: "## Descripción\n\n## Pasos para reproducir\n\n## Resultado esperado"
  labels: ["bug"]
```

### 6.2 Actualizar Issue

```
mcp_github-mcp-server_update_issue
  owner: "aloomushi-pixel"
  repo: "jdenis-website"
  issue_number: [número]
  state: "closed"
```

### 6.3 Comentar Issue

```
mcp_github-mcp-server_add_issue_comment
  owner: "aloomushi-pixel"
  repo: "jdenis-website"
  issue_number: [número]
  body: "Corregido en commit abc123"
```

---

## ✅ FASE 7: VERIFICACIÓN

### 7.1 Supabase Health

```
mcp_supabase-mcp-server_get_project
  id: "zdciwzeokkrwcxvsgusc"
```

Verificar: `status: "ACTIVE_HEALTHY"`

### 7.2 Seguridad

```
mcp_supabase-mcp-server_get_advisors
  project_id: "irdeiiichmanewpnuaml"
  type: "security"

mcp_supabase-mcp-server_get_advisors
  project_id: "irdeiiichmanewpnuaml"
  type: "performance"
```

### 7.3 GitHub Status

```
mcp_github-mcp-server_list_pull_requests
  owner: "aloomushi-pixel"
  repo: "jdenis-website"
  state: "open"
```

---

## 🔁 LOOP INFINITO

```
MIENTRAS hay_trabajo:
  1. Revisar Issues abiertos → GitHub MCP
  2. Seleccionar issue prioritario
  3. Implementar fix localmente
  4. Build local → npm run build
  5. Push cambios → GitHub MCP (push_files)
  6. Migraciones si aplica → Supabase MCP
  7. Cerrar issue → GitHub MCP
  8. Verificar seguridad → Supabase advisors
  9. GOTO 1
```

---

## 🛠️ COMANDOS DE EMERGENCIA

### Consulta SQL Directa
```
mcp_supabase-mcp-server_execute_sql
  project_id: "irdeiiichmanewpnuaml"
  query: "SELECT * FROM users LIMIT 10;"
```

### Ver Archivo en GitHub
```
mcp_github-mcp-server_get_file_contents
  owner: "aloomushi-pixel"
  repo: "jdenis-website"
  path: "backend/package.json"
```

### Buscar en Código
```
mcp_github-mcp-server_search_code
  q: "repo:aloomushi-pixel/jdenis-website función_buscada"
```

### Documentación Supabase
```
mcp_supabase-mcp-server_search_docs
  graphql_query: "{ searchDocs(query: \"RLS policies\", limit: 5) { nodes { title href content } } }"
```

---

## 📊 CHECKLIST MCP-OMEGA-PRO

### Pre-vuelo
- [ ] GitHub MCP responde (list_issues)
- [ ] Supabase MCP responde (get_project)
- [ ] NPM dependencias instaladas

### Desarrollo
- [ ] Código editado localmente
- [ ] Build sin errores
- [ ] Types de Supabase actualizados

### Deploy
- [ ] Cambios pushed via MCP (NO git CLI)
- [ ] Migraciones aplicadas via MCP
- [ ] Edge Functions deployed via MCP

### Verificación
- [ ] Proyecto ACTIVE_HEALTHY
- [ ] Sin advisors de seguridad críticos
- [ ] Issues actualizados
