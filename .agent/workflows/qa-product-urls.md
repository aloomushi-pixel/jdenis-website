---
description: Auditoría de URLs de productos - Verifica que cada producto redireccione correctamente al dar clic
---

# QA: Verificación de URLs de Productos

Este workflow verifica que **todas las URLs de productos** redireccionan correctamente al hacer clic. Revisa tanto la tienda (`/tienda`) como la página de detalle de cada producto (`/producto/:id`).

## Pre-requisitos

// turbo
1. Instalar dependencias del sitio web:
```bash
cd C:\Users\info\.gemini\antigravity\scratch\jdenis-website\website && npm install
```

// turbo
2. Iniciar el servidor de desarrollo:
```bash
cd C:\Users\info\.gemini\antigravity\scratch\jdenis-website\website && npm run dev
```

3. Esperar a que el servidor esté listo (usualmente en `http://localhost:5173`). Verificar que esté accesible abriendo la URL en el navegador.

## Fase 1: Inventario de Productos

4. Leer el archivo de datos de productos para obtener la lista completa de IDs:
   - Archivo: `website/src/data/products.ts`
   - Extraer todos los valores de `id` del array `products`
   - Extraer los `parentId` de `variantGroups` para identificar productos con variantes
   - Contar el total de productos únicos

5. Leer el archivo `website/src/App.tsx` para confirmar la ruta de producto:
   - La ruta debe ser `/producto/:id` (línea 69)
   - Verificar que el componente `ProductDetailWrapper` use `useParams` correctamente

## Fase 2: Verificación de la Tienda (/tienda)

6. Abrir la página de la tienda (`/tienda`) en el navegador:
   - Verificar que la página carga correctamente
   - Capturar screenshot de la página de tienda

7. Verificar que los productos se muestran en la grilla:
   - Los productos con variantes solo muestran el producto padre (función `getDisplayProducts()`)
   - Cada tarjeta de producto debe ser un `<a>` con href `/producto/{id}`

## Fase 3: Verificación de URLs de Productos (Muestra representativa)

Probar al menos **10 productos de diferentes categorías** haciendo clic en cada uno desde la tienda:

8. **Lash Lifting** - Hacer clic en "Kit Lash Lifting Profesional" (id: `kit-lash-lifting-profesional`):
   - Verificar que la URL cambia a `/producto/kit-lash-lifting-profesional`
   - Verificar que la página de detalle muestra el nombre, precio, imagen y descripción del producto
   - Verificar que el breadcrumb muestra: Inicio > Tienda > [Nombre del producto]
   - Capturar screenshot

9. **Brow Henna** - Navegar a `/producto/kit-brow-henna`:
   - Verificar que la página carga correctamente
   - Verificar nombre y precio correctos ($1,200 MXN)

10. **Extensiones** - Navegar a `/producto/pestana-mink-curva-c`:
    - Verificar que la página carga y muestra el selector de variantes (Curva C / Curva D)
    - Verificar que al cambiar de variante, la URL se actualiza a `/producto/pestana-mink-curva-d`
    - Capturar screenshot

11. **Adhesivos** - Navegar a `/producto/adhesivo-supreme-g4`:
    - Verificar carga correcta
    - Verificar precio ($450 MXN) y precio original tachado ($550 MXN)

12. **Tratamientos** - Navegar a `/producto/tratamiento-alargador`:
    - Verificar carga correcta
    - Verificar badge de rendimiento ("Resultados visibles en 4 semanas")

13. **Herramientas** - Navegar a `/producto/godete-cristal`:
    - Verificar carga correcta

14. **Accesorios** - Navegar a `/producto/lampara-media-luna`:
    - Verificar carga correcta con precio de oferta

15. **Higiene** - Navegar a `/producto/lash-shampoo`:
    - Verificar carga correcta

16. **Pestañas en Tira** - Navegar a `/producto/pestana-americana-tira`:
    - Verificar selector de variantes (Americana / Europea / Decorada)

17. **Microblading** - Navegar a `/producto/maniqui-microblading`:
    - Verificar carga correcta

## Fase 4: Verificación de Productos Relacionados

18. En cualquier página de producto, hacer scroll hasta la sección "Productos Relacionados":
    - Verificar que se muestran productos de la misma categoría
    - Hacer clic en un producto relacionado
    - Verificar que la URL cambia y la nueva página de producto se carga correctamente
    - **CLAVE**: verificar que el contenido de la página cambia (no se queda mostrando el producto anterior)

## Fase 5: Verificación de Producto No Encontrado

19. Navegar a una URL de producto inexistente: `/producto/este-producto-no-existe`:
    - Verificar que se muestra el mensaje "Producto no encontrado"
    - Verificar que existe el botón "Volver a la Tienda"
    - Hacer clic en "Volver a la Tienda" y verificar que redirige a `/tienda`

## Fase 6: Verificación de Navegación desde Home

20. Abrir la página principal (`/`):
    - Buscar la sección de bestsellers
    - Hacer clic en un producto bestseller
    - Verificar que redirige correctamente a `/producto/{id}`
    - Capturar screenshot

## Fase 7: Reporte de Resultados

21. Crear un reporte con:
    - Total de productos verificados
    - Lista de URLs que **NO** funcionan (si hay alguna)
    - Lista de URLs que **SÍ** funcionan correctamente
    - Screenshots de evidencia
    - Recomendaciones de corrección (si aplica)

## Criterios de Éxito

- ✅ Todas las URLs de productos deben cargar la página de detalle correcta
- ✅ La URL en el navegador debe coincidir con el id del producto
- ✅ El contenido de la página (nombre, precio, imagen) debe corresponder al producto seleccionado
- ✅ Los selectores de variantes deben actualizar la URL y el contenido
- ✅ Los productos relacionados deben navegar correctamente
- ✅ El flujo desde la tienda y desde Home debe funcionar sin errores
