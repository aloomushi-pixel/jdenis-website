---
description: Escanear redes sociales de J. Denis y actualizar cursos en Academy.tsx
---

# 🔄 Actualizar Cursos desde Redes Sociales

Workflow para escanear las redes sociales de J. Denis y actualizar la sección de cursos del sitio web.

// turbo-all

---

## PASO 1: Escanear Redes Sociales

Usar el browser para visitar estas 3 fuentes y buscar información de cursos nuevos:

1. **Instagram**: https://www.instagram.com/jdenismx/
   - Buscar posts sobre cursos, fechas, inscripciones
   - Buscar stories destacadas de "Cursos" o "Academia"

2. **Facebook**: https://www.facebook.com/JDenisMexico
   - Buscar posts recientes sobre cursos presenciales
   - Buscar Lives programados o recientes
   - Buscar eventos

3. **YouTube**: https://www.youtube.com/@JDenismexico
   - Buscar nuevos Lives o Streams
   - Buscar nuevos shorts de técnicas
   - Buscar videos de cursos/masterclasses

Para cada curso encontrado, anotar:
- Título del curso
- Tipo: presencial / online / replay
- Fecha y horario
- Precio (o si es gratuito)
- Descripción y temario
- URL relacionada (video, post, etc.)

---

## PASO 2: Comparar con Cursos Actuales

Leer el archivo `website/src/pages/Academy.tsx` y comparar:
- ¿Hay cursos con fechas ya expiradas? → Actualizar o eliminar
- ¿Hay cursos nuevos no listados? → Agregar
- ¿Hay cambios de precio o fechas? → Actualizar
- ¿Hay nuevos eventos? → Agregar a la lista de events

---

## PASO 3: Actualizar Academy.tsx

Editar `website/src/pages/Academy.tsx`:

### Para cursos PRESENCIALES:
```typescript
{
    id: [número],
    title: '[Título del curso]',
    duration: '[duración]',
    price: [precio],
    description: '[descripción]',
    topics: ['tema1', 'tema2', 'tema3', 'tema4'],
    nextDate: '[fecha próxima]',
    badge: 'presencial',
    link: 'https://wa.me/525565116087?text=Hola! Quiero inscribirme al curso: [nombre]',
}
```

### Para cursos ONLINE/REPLAY:
```typescript
{
    id: [número],
    title: '[Título del curso]',
    duration: '[duración]',
    price: 0,
    description: '¡GRATIS! [descripción]',
    topics: ['tema1', 'tema2', 'tema3', 'tema4'],
    nextDate: '[fecha o "Disponible en replay"]',
    badge: 'online' | 'replay',
    link: '[URL del video en YouTube o Facebook]',
}
```

### Para EVENTOS:
```typescript
{
    title: '[Nombre del evento]',
    date: '[fecha]',
    location: '[ubicación o "Online"]',
    description: '[descripción]',
    type: 'congreso' | 'live' as const,
}
```

---

## PASO 4: Build y Deploy

```bash
cd website
npm run build
```

Si el build pasa:

```bash
cd ..
git add -A
git commit -m "feat: actualización de cursos Academy desde redes sociales"
git push origin master
```

Dokploy auto-desplegará los cambios.

---

## PASO 5: Verificar en Producción

Abrir el sitio en el navegador y verificar:
- [ ] Los cursos actualizados se muestran correctamente
- [ ] Los botones de CTA redireccionan correctamente
- [ ] Los badges (presencial/online/replay) son correctos
- [ ] Los precios están bien (GRATIS para online/replay)
- [ ] Los eventos están actualizados
