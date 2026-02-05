---
description: Explora y analiza la estructura del proyecto J DENIS ERP/WMS
---

# Explorador J DENIS

Analiza la estructura actual del proyecto y proporciona un resumen de:

## Instrucciones

1. **Listar estructura de directorios** principales:
   ```bash
   tree -L 2 --noreport
   ```

2. **Analizar Frontend**:
   - Componentes principales en `frontend/src/`
   - Páginas y rutas
   - Estado global (stores)

3. **Analizar Backend**:
   - Rutas de API en `backend/src/routes/`
   - Middleware de autenticación
   - Schema de Prisma (`backend/prisma/schema.prisma`)

4. **Verificar Feature-First adoption**:
   - ¿Existe directorio `features/`?
   - ¿Código organizado por funcionalidad o por tipo?

5. **Generar reporte** con:
   - Estado actual de la arquitectura
   - Componentes pendientes de migrar a Feature-First
   - Sugerencias de mejora

## Output esperado

Markdown con secciones claras para cada área analizada.
