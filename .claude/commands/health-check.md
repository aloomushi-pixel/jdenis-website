---
description: Verifica el estado de salud del sistema J DENIS
---

# Health Check Completo

Ejecuta verificaciones de salud en todos los componentes del sistema.

## Instrucciones

### 1. Verificar Backend
```bash
curl -s http://localhost:4000/health | jq .
# Esperado: {"status":"OK","message":"J DENIS ERP/WMS API"}
```

### 2. Verificar Base de Datos
```bash
cd backend && npx prisma db execute --stdin <<< "SELECT 1;"
```

### 3. Verificar Frontend Build
```bash
cd frontend && npm run build 2>&1 | tail -10
```

### 4. Verificar TypeScript
```bash
cd frontend && npx tsc --noEmit
cd backend && npx tsc --noEmit
```

### 5. Verificar Supabase Connection
- Probar conexión a Supabase
- Verificar que las 30 tablas están accesibles

## Output

Tabla de estado con:
| Componente | Estado | Detalles |
|------------|--------|----------|
| Backend API | ✅/❌ | ... |
| Database | ✅/❌ | ... |
| Frontend | ✅/❌ | ... |
| TypeScript | ✅/❌ | ... |
