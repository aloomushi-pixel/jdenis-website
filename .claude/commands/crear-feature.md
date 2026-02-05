---
description: Crear una nueva feature siguiendo la arquitectura Feature-First
---

# Crear Nueva Feature

Genera la estructura completa para una nueva feature en el proyecto.

## Parámetros

- `$FEATURE_NAME` - Nombre de la feature (ej: "reports", "notifications")

## Instrucciones

1. **Crear estructura de directorios**:
   ```
   frontend/src/features/$FEATURE_NAME/
   ├── components/
   │   └── index.ts
   ├── hooks/
   │   └── index.ts
   ├── services/
   │   └── ${FEATURE_NAME}Service.ts
   ├── types/
   │   └── index.ts
   └── index.ts
   ```

2. **Crear archivo barrel** (`index.ts`):
   ```typescript
   // Re-export all public API
   export * from './components';
   export * from './hooks';
   export * from './services/${FEATURE_NAME}Service';
   export * from './types';
   ```

3. **Crear service template**:
   ```typescript
   import { api } from '@/shared/lib/api';
   
   export const ${FEATURE_NAME}Service = {
     // Add service methods here
   };
   ```

4. **Crear types template**:
   ```typescript
   export interface ${PascalCase(FEATURE_NAME)}Item {
     id: string;
     // Add properties
   }
   ```

5. **Actualizar rutas** si es necesario en `frontend/src/App.tsx`

6. **Verificar** que la feature compila sin errores

## Output

Confirmar creación de todos los archivos y estructura lista para desarrollo.
