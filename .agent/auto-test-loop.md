---
description: Bucle infinito de revisión, corrección y verificación automática de la web
---

# Workflow: Auto-Test & Fix Loop

Este workflow ejecuta un ciclo continuo de pruebas y correcciones hasta que todo funcione.

// turbo-all

---

## 🚀 AUTO-CONTINUAR (CRÍTICO)

**REGLA ABSOLUTA:** Cuando el usuario escribe "continuar", "continue", "sigue", o cualquier variante:

1. **LEER** el workflow `/auto-test-loop` inmediatamente
2. **LEER** el task.md para ver el estado actual
3. **EJECUTAR** el bucle principal desde el paso pendiente
4. **CERO CONFIRMACIONES** - todo es automático

### Si el contexto se satura o hay error

1. Guardar estado en task.md
2. Hacer commit si hay cambios
3. Terminar diciendo: "Escribe **continuar** para reanudar"

### Cuando el usuario escribe "continuar"

**SIN PREGUNTAS. SIN CONFIRMACIONES. SOLO EJECUTAR.**

---

## 🔄 Bucle Principal

### Paso 1: Compilar y Verificar Build

```bash
cd frontend && node node_modules/typescript/bin/tsc --noEmit
```

```bash
cd backend && npm run build
```

Si hay errores de compilación → corregirlos automáticamente.

---

### Paso 2: Entrar a la Web y Verificar

Usar el navegador para:

1. Ir a <https://elevamex.com.mx/login>
2. Login como ADMIN (<juangarcia@ccurity.com.mx> / E4ae5d6c0c.)
3. Navegar por TODAS las secciones del dashboard
4. Documentar cualquier error visual o funcional
5. Logout

6. Login como CLIENTE (<ciudadjazz@gmail.com> / ciudadjazz)
7. Navegar por todas sus secciones
8. Probar chat con técnico
9. Documentar errores
10. Logout

11. Login como TECNICO (<juangarcia@elevamex.com.mx> / aDMIN123.)
12. Navegar por su agenda
13. Probar iniciar servicio
14. Probar chat con cliente
15. Documentar errores

---

### Paso 3: Crear Lista de Errores

Actualizar task.md con errores encontrados:

- [ ] Error 1: Descripción + archivo
- [ ] Error 2: Descripción + archivo

---

### Paso 4: Ejecutar Correcciones

Para cada error:

1. Identificar archivo
2. Editar código (SIN CONFIRMAR)
3. Compilar para verificar
4. Marcar como corregido en task.md

---

### Paso 5: Git Push y Deploy

```bash
git add .
git commit -m "fix: correcciones automáticas de testing"
git push
```

Después del push → **IR A DOKPLOY** para trigger del deploy (ver sección abajo).

---

## 🚢 DOKPLOY - Deploy en Producción

### Credenciales Dokploy

- **URL:** <https://72.62.162.99:3000> (o el puerto que use Dokploy)
- **Email:** <juangarcia@ccurity.com.mx>
- **Password:** E4ae5d6c0c..

### Ubicación del Proyecto

```
Projects → elevamex.com.mx → App
```

**IMPORTANTE:** Solo tocar el proyecto ELEVAMEX, NO modificar otros proyectos.

### Acciones en Dokploy

1. **Navegar a:** <https://72.62.162.99:3000>
2. **Login** con las credenciales de arriba
3. **Buscar proyecto:** elevamex.com.mx
4. **Entrar a:** App (el servicio backend/frontend)
5. **Hacer click en:** "Redeploy" o "Deploy" para trigger manual
6. **Esperar** a que el deploy termine (status: Running/Success)
7. **Verificar logs** si hay errores

### Comprobar Estado del Deploy

- ✅ **Running/Success:** Deploy completado, continuar con verificación
- ❌ **Failed:** Revisar logs, corregir errores, volver a Paso 4
- ⏳ **Building:** Esperar y refrescar

### Si hay error de certificado SSL

El browser puede mostrar advertencia por HTTPS. Aceptar y continuar.

---

### Paso 6: Verificar en Producción

Después del deploy exitoso:

1. Volver a <https://elevamex.com.mx/login>
2. Re-probar las funcionalidades corregidas
3. Si todo funciona → ✅ Completado
4. Si hay nuevos errores → Volver a Paso 3

---

## 📋 Checklist por Rol

### ADMIN

- [ ] Login funciona
- [ ] Dashboard carga estadísticas
- [ ] Lista de clientes muestra datos
- [ ] Lista de equipos funciona
- [ ] Lista de técnicos funciona
- [ ] Visitas: crear, editar, eliminar
- [ ] Calendario de visitas
- [ ] Reportes de servicio visibles
- [ ] Usuarios: CRUD
- [ ] Conversaciones visibles

### TECNICO

- [ ] Login funciona
- [ ] Dashboard muestra próximas visitas
- [ ] Widget de servicios en progreso
- [ ] Botón "Iniciar Servicio" funciona
- [ ] Modal de reporte abre correctamente
- [ ] Checklist 16 items funciona
- [ ] Fotos se pueden subir
- [ ] Guardar progreso funciona
- [ ] Completar reporte funciona
- [ ] Chat con clientes funciona

### CLIENTE

- [ ] Login funciona
- [ ] Dashboard personalizado
- [ ] Ver técnico asignado
- [ ] Ver sus equipos
- [ ] Ver sus visitas
- [ ] Ver reportes de servicio
- [ ] Chat con técnicos funciona

---

## ⚙️ Condición de Salida

El bucle termina SOLO cuando:

1. ✅ Todos los checklists están completos
2. ✅ No hay errores de consola
3. ✅ No hay errores visuales
4. ✅ Todas las funcionalidades responden

→ Commit final + Push + Deploy + Notificación de éxito
