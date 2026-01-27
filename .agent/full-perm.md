---
description: Permisos completos - Auto-ejecuta TODOS los comandos de desarrollo sin pedir confirmación
---

# Workflow: Full Permissions (full-perm)

Este workflow otorga permisos para ejecutar automáticamente TODOS los comandos comunes de desarrollo.

// turbo-all

---

## 🔄 Git - Control de Versiones

```bash
git status
```

```bash
git add .
```

```bash
git commit -m "mensaje"
```

```bash
git push
```

```bash
git pull
```

```bash
git log -n 5
```

```bash
git diff
```

```bash
git branch
```

```bash
git checkout
```

```bash
git merge
```

---

## 🏗️ Build - Compilación

```bash
cd frontend && node node_modules/typescript/bin/tsc --noEmit
```

```bash
cd backend && npm run build
```

```bash
npm run build
```

---

## 📦 NPM - Gestión de Paquetes

```bash
npm install
```

```bash
npm ci
```

```bash
npm update
```

---

## 🚀 Desarrollo

```bash
npm run dev
```

```bash
npm start
```

```bash
npm run lint
```

```bash
npm test
```

---

## 📁 Archivos y Directorios

```bash
mkdir
```

```bash
cp
```

```bash
mv
```

```bash
rm (archivos de código únicamente)
```

---

## 🔍 Búsqueda y Navegación

```bash
ls
```

```bash
dir
```

```bash
cat
```

```bash
type
```

```bash
find
```

```bash
grep
```

---

## Comportamiento Automático

Con este workflow activo, el agente:

1. ✅ Compila automáticamente después de editar código
2. ✅ Hace commit y push automáticamente después de completar cambios
3. ✅ Instala dependencias sin preguntar
4. ✅ Crea/mueve/copia archivos sin confirmación
5. ✅ Ejecuta comandos de verificación automáticamente

---

## ⚠️ Exclusiones (siempre pide permiso)

- `rm -rf` en directorios importantes
- Comandos que afecten configuración del sistema
- Instalación de herramientas globales del sistema
- Comandos destructivos en base de datos
