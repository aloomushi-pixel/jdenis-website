---
description: Scrape todos los productos de jdenis.com, copiar imágenes/precios/descripciones y agregarlos a nuestra tienda verificando duplicados
---

# 🛒 SCRAPE PRODUCTOS JDENIS.COM → TIENDA LOCAL

Workflow para extraer TODOS los productos de https://www.jdenis.com/ y sincronizarlos con nuestra tienda (data/products.ts + Supabase).

// turbo-all

---

## 📋 CONFIGURACIÓN

| Campo | Valor |
|-------|-------|
| **Fuente** | `https://www.jdenis.com/productos/` |
| **CDN de imágenes** | `acdn-us.mitiendanube.com/stores/694/809/products/` |
| **Archivo local** | `website/src/data/products.ts` |
| **Supabase Project** | `vqcjxzsibywdxpvkyysa` |
| **Tabla Supabase** | `products` |
| **Directorio proyecto** | `C:\Users\info\.gemini\antigravity\scratch\jdenis-website` |

---

## 🏗️ CATEGORÍAS A SCRAPEAR

Navegar a cada URL de categoría para obtener la lista completa de productos:

1. Lash Lifting → `https://www.jdenis.com/lifting/`
2. Brow Henna → `https://www.jdenis.com/brow-henna/`
3. Diseño de Cejas → `https://www.jdenis.com/cejas/`
4. Pigmentos → `https://www.jdenis.com/tinte/`
5. Lash Curling - Rizado → `https://www.jdenis.com/rizado/`
6. Extensiones para pestañas → `https://www.jdenis.com/extensiones-de-pestanas/`
7. Lash Botox y tratamientos → `https://www.jdenis.com/mascaras-para-pestanas/`
8. Máscaras → `https://www.jdenis.com/mascaras/`
9. Microblading → `https://www.jdenis.com/microblading/`
10. Pestañas en tira → `https://www.jdenis.com/pestanas/`
11. Tintura cejas/pestañas → `https://www.jdenis.com/tintura-para-cejas-y-pestanas/`
12. Página general → `https://www.jdenis.com/productos/`

---

## 🔄 EL BUCLE DE SCRAPING

### PASO 1: INVENTARIAR PRODUCTOS EXISTENTES

1. Leer el archivo `website/src/data/products.ts` completo
2. Extraer todos los `id` de productos existentes en un array
3. Consultar Supabase para obtener todos los `slug` existentes:
```sql
SELECT slug, name FROM products ORDER BY name;
```
4. Crear un set unificado de IDs/slugs ya existentes para verificar duplicados

### PASO 2: NAVEGAR CATEGORÍA Y LISTAR PRODUCTOS

5. Usar `browser_subagent` para navegar a la primera categoría pendiente
6. En la página de categoría, recopilar:
   - **URL** de cada producto (formato: `https://www.jdenis.com/productos/{slug}/`)
   - **Nombre** visible en el listado
   - **Precio** visible en el listado
   - Si hay paginación, navegar a todas las páginas
7. Guardar la lista de URLs encontradas

### PASO 3: VERIFICAR DUPLICADOS

8. Para cada producto encontrado, extraer el `slug` de su URL:
   - Ejemplo: `https://www.jdenis.com/productos/lash-lifting/` → slug = `lash-lifting`
9. Comparar slug contra los IDs/slugs del PASO 1
10. **Si ya existe:** marcar como "existente, omitir" y pasar al siguiente
11. **Si NO existe:** marcarlo como "nuevo, procesar" y continuar al PASO 4

### PASO 4: SCRAPEAR DETALLE DEL PRODUCTO

12. Usar `browser_subagent` para navegar a la URL del producto
13. Extraer la siguiente información de la página del producto:
    - **Nombre completo** del producto
    - **Precio actual** (número)
    - **Precio original** (si tiene tachado/descuento)
    - **Descripción completa** del producto
    - **Beneficios** (lista de bullets si existen)
    - **¿Qué incluye?** (lista de contenido del kit si existe)
    - **Rendimiento** (ej: "Hasta 35 aplicaciones")
    - **Especificaciones** técnicas
    - **Imagen principal** (URL del CDN de mitiendanube)
    - **Galería de imágenes** (todas las URLs de imágenes adicionales)
    - **Categoría** a la que pertenece

14. Formatear los datos como objeto TypeScript compatible con la interface `Product`:

```typescript
{
    id: '{slug-del-producto}',
    name: '{nombre completo}',
    price: {precio},
    originalPrice: {precio_original_si_tiene},
    image: '{url_imagen_principal}',
    category: '{categoria}',
    description: '{descripcion_completa}',
    benefits: ['{beneficio1}', '{beneficio2}', ...],
    includes: ['{item1}', '{item2}', ...],
    specifications: ['{spec1}', '{spec2}', ...],
    performance: '{rendimiento}',
    gallery: ['{url_img1}', '{url_img2}', ...],
    relatedCategories: ['{cat1}', '{cat2}'],
    isFeatured: false,
}
```

### PASO 5: AGREGAR AL ARCHIVO LOCAL

15. Abrir `website/src/data/products.ts`
16. Agregar el nuevo producto al array `products` en la sección de categoría correspondiente
17. Si la categoría no existe, crear una nueva sección con el comentario separador:
```typescript
// ═══════════════════════════════════════════════════════════════════
// {NOMBRE DE CATEGORÍA}
// ═══════════════════════════════════════════════════════════════════
```

### PASO 6: SINCRONIZAR CON SUPABASE

18. Insertar el producto en la tabla `products` de Supabase:
```sql
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, description, stock, is_active, is_featured, sort_order)
VALUES ('{slug}', '{nombre}', {precio}, {precio_original_o_null}, '{url_imagen}', '{categoria}', '{descripcion}', 0, true, false, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM products));
```

19. Verificar la inserción:
```sql
SELECT id, slug, name, price FROM products WHERE slug = '{slug}';
```

### PASO 7: REPETIR O FINALIZAR

20. **Si quedan productos nuevos en la categoría actual:** volver a PASO 4
21. **Si se terminó la categoría actual:** pasar a la siguiente categoría y volver a PASO 2
22. **Si se terminaron TODAS las categorías:** ir a PASO 8

---

## ✅ PASO 8: VERIFICACIÓN FINAL

23. Contar productos en `products.ts`:
```bash
Select-String -Path "website\src\data\products.ts" -Pattern "id: '" | Measure-Object
```

24. Contar productos en Supabase:
```sql
SELECT COUNT(*) as total, COUNT(CASE WHEN is_active THEN 1 END) as activos FROM products;
```

25. Verificar build local:
```bash
cd website && npm run build
```

26. Con `browser_subagent`, navegar al dashboard local (`/admin/editor`) y verificar que los nuevos productos aparecen en el catálogo

---

## 📊 REPORTE FINAL

Usar `notify_user` con:

```
✅ SCRAPING JDENIS.COM COMPLETADO

## Resumen
- Productos encontrados en jdenis.com: [N]
- Productos ya existentes (omitidos): [M]
- Productos nuevos agregados: [K]
- Build local: ✅ PASS

## Nuevos Productos
| # | Nombre | Precio | Categoría |
|---|--------|--------|-----------|
| 1 | ... | $... | ... |

## Categorías Procesadas
- [x] Lash Lifting (N productos)
- [x] Brow Henna (N productos)
- ...
```

---

## 🛠️ NOTAS TÉCNICAS

### Estructura de datos dual
El sistema usa **dos fuentes de datos**:
1. **`data/products.ts`** → Datos completos (imágenes, descripciones, beneficios, incluye, specs, galería)
2. **Supabase `products`** → Campos editables dinámicamente (precio, nombre, stock, destacado, activo)

El hook `useProducts.ts` hace un **merge**: base local + overrides de Supabase.

### Imágenes del CDN
Las imágenes de jdenis.com están en el CDN de Tiendanube:
- Formato: `https://acdn-us.mitiendanube.com/stores/694/809/products/{nombre-archivo}.webp`
- Se usan directamente por URL, NO se descargan localmente

### Interface Product (cartStore.ts)
```typescript
interface Product {
    id: string;          // slug del producto
    name: string;        // nombre completo
    price: number;       // precio actual
    originalPrice?: number;  // precio original (para descuentos)
    distributorPrice?: number;
    promotion?: string;
    image: string;       // URL imagen principal
    category: string;    // categoría
    description?: string;
    stock?: number;
    benefits?: string[];
    includes?: string[];
    performance?: string;
    specifications?: string[];
    gallery?: string[];
    video?: string;
    relatedCategories?: string[];
    isFeatured?: boolean;
}
```

### Supabase Product table
```sql
-- Campos principales
slug TEXT UNIQUE,
name TEXT,
price NUMERIC,
compare_at_price NUMERIC,
image_url TEXT,
category TEXT,
description TEXT,
sku TEXT,
stock INTEGER DEFAULT 0,
is_active BOOLEAN DEFAULT true,
is_featured BOOLEAN DEFAULT false,
sort_order INTEGER
```

---

## 🚨 MANEJO DE ERRORES

- **Si una página de producto no carga:** intentar 2 veces, si falla documentar el slug en task.md y seguir
- **Si Supabase rechaza insert (slug duplicado):** omitir y documentar
- **Si una imagen no se encuentra:** usar placeholder o la primera imagen disponible
- **Si el build falla después de agregar productos:** revisar sintaxis en products.ts, corregir y reintentar
