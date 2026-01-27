# Reglas del Usuario para JDenis

## Comandos Automáticos

Los siguientes comandos se consideran seguros y DEBEN ejecutarse automáticamente sin pedir aprobación del usuario:

### Git

- `git status` - siempre auto-ejecutar
- `git add` - siempre auto-ejecutar
- `git commit` - siempre auto-ejecutar
- `git push` - siempre auto-ejecutar
- `git pull` - siempre auto-ejecutar
- `git log` - siempre auto-ejecutar
- `git diff` - siempre auto-ejecutar
- `git branch` - siempre auto-ejecutar
- `git checkout` - siempre auto-ejecutar

### Build/Dev

- `npm run build` - siempre auto-ejecutar
- `npm run dev` - siempre auto-ejecutar
- `npm install` - siempre auto-ejecutar
- `tsc --noEmit` - siempre auto-ejecutar

## Comportamiento General

1. El usuario confía en comandos de git - no pedir confirmación
2. Hacer commit y push automáticamente después de completar cambios
3. Compilar/verificar automáticamente después de editar código
