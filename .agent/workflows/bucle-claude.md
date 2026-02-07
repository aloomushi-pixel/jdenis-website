---
description: Bucle autónomo de depuración, corrección y deploy para J-Denis Website. Cero inputs del usuario. Trabaja hasta terminar.
---

# 🔁 BUCLE CLAUDE — J-DENIS WEBSITE

Workflow 100% autónomo. **CERO confirmaciones, CERO preguntas al usuario.**
Trabaja en bucle infinito hasta que el build pase limpio y el sitio funcione en producción.

// turbo-all

---

## 🧠 REGLAS ABSOLUTAS

1. **NUNCA pedir confirmación al usuario.** Todo es automático.
2. **NUNCA usar `notify_user` para pedir aprobación.** Solo al FINAL para reportar resultados.
3. **SafeToAutoRun = true** en TODOS los comandos.
4. **Si el contexto se satura:** guardar estado en `task.md`, hacer commit+push, y terminar con "Escribe **/bucle-claude** para reanudar".
5. **Si un error persiste después de 3 intentos:** documentarlo en `task.md`, saltar al siguiente, seguir el loop.

---

## 📋 CONFIGURACIÓN DEL PROYECTO

| Campo | Valor |
|-------|-------|
| **Repo** | `aloomushi-pixel/jdenis-website` |
| **Branch** | `master` |
| **Supabase ID** | `irdeiiichmanewpnuaml` |
| **Website Dir** | `website/` |
| **Build CMD** | `npm run build` (dentro de `website/`) |
| **Site URL** | `https://jdenis.store` |

---

## ⚡ COMANDOS AUTO-EJECUTABLES (SafeToAutoRun=true)

```bash
# Build & Dev
npm run build | npm run dev | npm install | npm ci | tsc --noEmit | npx tsc -b

# Git
git status | git add . | git diff | git log -n 5
git commit -m "..." | git push origin master

# Utilidades
dir | type | cat | Get-Content | Select-String
node -e "..."
```

---

## 🔄 EL BUCLE (Ejecutar en orden, repetir hasta éxito)

### PASO 1: LEER ESTADO

// turbo
1. Leer `task.md` del artifacts directory para ver progreso actual
2. Leer `App.tsx` y archivos con errores conocidos

### PASO 2: BUILD LOCAL

// turbo
3. Ejecutar dentro de `website/`:
```bash
npm run build
```

4. **Si el build PASA (exit code 0):** ir a PASO 5
5. **Si el build FALLA (exit code 1):** ir a PASO 3

### PASO 3: DIAGNOSTICAR ERRORES

// turbo
6. Leer la salida completa del build para identificar errores
7. Para CADA error de TypeScript:
   - Abrir el archivo indicado con `view_file`
   - Identificar la línea y el tipo de error
   - Clasificar: import faltante, tipo incorrecto, propiedad inexistente, sintaxis

### PASO 4: CORREGIR ERRORES

// turbo
8. Para CADA error identificado:
   - Usar `replace_file_content` o `multi_replace_file_content` para corregir
   - **Imports faltantes:** agregar la línea de import correcta
   - **Tipos incorrectos:** actualizar interface o cast
   - **Propiedad inexistente:** verificar la interface y usar la propiedad correcta
   - **Función no exportada:** agregarla al archivo fuente
   - **Variables no usadas:** eliminarlas o prefixar con `_`

9. **VOLVER A PASO 2** (rebuild para verificar fix)

### PASO 5: COMMIT Y PUSH

// turbo
10. Dentro del directorio raíz del proyecto:
```bash
git add .
git commit -m "fix: correcciones automáticas bucle-claude

- [lista de archivos corregidos]
- Build verificado localmente"
git push origin master
```

### PASO 6: VERIFICAR PRODUCCIÓN

// turbo
11. Esperar 2 minutos para que Dokploy construya:
```bash
Start-Sleep -Seconds 120
```

12. Verificar con browser_subagent:
    - Navegar a `https://jdenis.store`
    - Verificar que la página carga correctamente
    - Navegar a `https://jdenis.store/tienda` - verificar productos
    - Navegar a `https://jdenis.store/login` - verificar formulario

13. **Si hay errores visuales o de consola:** documentar, volver a PASO 3
14. **Si todo funciona:** ir a PASO 7

### PASO 7: VERIFICAR ADMIN (si aplica)

// turbo
15. Con browser_subagent:
    - Login con admin: `juangarcia@aionia.com.mx` / `E4ae5d6c0c..`
    - Navegar a `/admin`
    - Verificar dashboard carga métricas
    - Verificar sidebar y navegación

16. **Si hay errores:** documentar, volver a PASO 3

### PASO 8: VERIFICACIÓN MCP

// turbo
17. Verificar Supabase:
```
mcp_supabase-mcp-server_get_project → id: "irdeiiichmanewpnuaml"
→ Verificar status: "ACTIVE_HEALTHY"
```

18. Verificar seguridad:
```
mcp_supabase-mcp-server_get_advisors → type: "security"
→ Documentar advisories críticos
```

19. Verificar GitHub:
```
mcp_github-mcp-server_list_commits → últimos 3 commits
→ Confirmar que el push llegó
```

### PASO 9: ACTUALIZAR TASK.MD

// turbo
20. Marcar tareas completadas en `task.md`
21. Documentar errores encontrados y corregidos

### PASO 10: SIGUIENTE TAREA O FIN

// turbo
22. Revisar `task.md` para tareas pendientes `[ ]`
23. **Si hay tareas pendientes:** implementar la siguiente, volver a PASO 2
24. **Si NO hay tareas pendientes:** ir a REPORTE FINAL

---

## 📊 REPORTE FINAL

Solo al terminar TODO el bucle, usar `notify_user` UNA SOLA VEZ con:

```
✅ BUCLE CLAUDE COMPLETADO

## Resumen
- Errores corregidos: [N]
- Archivos modificados: [lista]
- Commits realizados: [N]
- Build status: ✅ PASS
- Producción: ✅ LIVE

## Cambios Principales
- [lista de cambios significativos]

## Advisories de Seguridad
- [lista si hay]
```

---

## 🛠️ PATRONES DE CORRECCIÓN COMUNES

### Import faltante
```tsx
// Error: Cannot find name 'X'
// Fix: Agregar import al inicio del archivo
import X from './path/to/X';
```

### Tipo void vs boolean
```tsx
// Error: Type 'void' is not assignable to type 'boolean'
// Fix: Usar try/catch en lugar de verificar retorno
try {
    await functionThatReturnsVoid();
    // success path
} catch (err) {
    // error path
}
```

### Propiedad inexistente en interface
```tsx
// Error: Property 'X' does not exist on type 'Y'
// Fix: Verificar la interface Y y usar la propiedad correcta
// O agregar la propiedad a la interface
```

### Variable no usada
```tsx
// Error: 'X' is declared but its value is never read
// Fix: Eliminar la variable o prefixar con _
const _unusedVar = value;
```

### Argumento incorrecto
```tsx
// Error: Expected N arguments, but got M
// Fix: Verificar la firma de la función y ajustar los argumentos
```

---

## 🚨 MANEJO DE ERRORES PERSISTENTES

Si un error NO se puede resolver después de 3 intentos:

1. Documentar en `task.md`:
```markdown
## ⚠️ Error No Resuelto
- Archivo: [ruta]
- Error: [descripción]
- Intentos: 3
- Notas: [qué se intentó]
```

2. **Comentar el código problemático** con `// TODO: fix this`
3. Continuar con el siguiente error/tarea
4. Incluir en el reporte final

---

## 🔄 REANUDACIÓN

Si el contexto se satura o se interrumpe:

1. Guardar todo el estado en `task.md`
2. Hacer commit + push de cambios parciales
3. Terminar con: "Escribe **/bucle-claude** para reanudar desde donde quedé"

Al reanudar:
1. Leer `task.md` → identificar última tarea `[/]` (en progreso)
2. Continuar desde esa tarea
3. NO repetir trabajo ya completado `[x]`
