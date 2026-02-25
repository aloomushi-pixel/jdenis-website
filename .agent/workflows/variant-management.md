---
description: Workflow para gestionar variantes de productos en el dashboard admin de J.Denis
---

# Workflow: Gestión de Variantes de Productos

Este workflow documenta cómo realizar cambios en el módulo de variantes del dashboard admin y cómo crear nuevas variantes para productos que son iguales pero tienen diferencias en color, tamaño, número de piezas, etc.

## Contexto del Sistema

El sistema de variantes tiene **dos capas**:

1. **Hardcoded (archivo `products.ts`)**: 17 grupos de variantes definidos como código en `website/src/data/products.ts` (líneas 1061-1280). Estos se usan en la tienda pública y en el Editor de Catálogo.
2. **Base de datos (Supabase)**: Tablas `variant_groups` y `product_variants` gestionadas desde la pestaña "Variantes" del Editor de Catálogo (`VariantManager.tsx`).

### Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `website/src/data/products.ts` | Catálogo de productos y grupos de variantes hardcoded |
| `website/src/pages/admin/ProductEditor.tsx` | Dashboard admin con tabs Catálogo/Variantes |
| `website/src/pages/admin/VariantManager.tsx` | UI para CRUD de variantes en Supabase |
| `website/src/hooks/useVariants.ts` | Hook para leer/escribir variantes de Supabase |
| `website/src/components/VariantSelector.tsx` | Selector de variantes en la tienda pública |
| `website/supabase/migrations/20260218_variants.sql` | Schema de tablas en Supabase |

---

## Paso 1: Identificar productos candidatos a variantes

Revisar el catálogo en `products.ts` y buscar productos que:
- Tengan el **mismo nombre base** pero con sufijo diferente (ej. "Rulos Desechables Curva Media M" y "Rulos Desechables Curva Corta CH")
- Compartan la **misma imagen** o imagen similar
- Tengan el **mismo precio** o precio muy cercano
- Difieran solo en atributos como: **Color, Curva, Grosor, Tamaño, Largo, Tono, Presentación, Modelo, Diseño**

### Ejemplos de grupos existentes

Los 17 grupos ya definidos en `variantGroups` son:
1. Extensiones Mink (Curva: C, D)
2. Extensiones Individuales Mixtas (Curva + Grosor: 7 variantes)
3. Extensiones Easy Fan (Curva + Grosor: 3 variantes)
4. Abanicos Pre-hechos (Dimensión + Curva + Grosor + Largo: 18 variantes)
5. Extensiones en Colores (Curva: C, D)
6. Rulos Desechables (Tamaño: CH, M, G)
7. Rulos Adhesivos (Curva: G, M/CH)
8. Tintura Tópica (Tono: Castaño Medio, Castaño Oscuro, Negro)
9. Pestañas en Grupo/Racimo (Color: Negro, Azul, Café)
10. Crema Lash Lifting (Paso: 1, 2)
11. Limpiador de Impurezas (Tipo de Piel: Mixta/Grasa, Normal/Seca)
12. Adhesivo Bálsamo (Presentación: 20 gr, Butter 30 gr)
13. Pinzas Profesionales (Modelo: 9 variantes)
14. Pads para Lash Lifting (Diseño: 14 variantes)
15. Pestañas de Tira (Tipo: Americana, Europea, Decorada)
16. Mini Cepillos (Uso: 3 variantes)
17. Cepillos para Pestañas (Presentación: 4 variantes)

---

## Paso 2: Crear un nuevo grupo de variantes (en código)

Para agregar un nuevo grupo en `products.ts`:

1. Asegurar que todos los productos individuales ya existan en el array `products[]`
2. Agregar una nueva entrada al array `variantGroups[]` al final del archivo, siguiendo este formato:

```typescript
// N. Nombre del Grupo
{
    parentId: 'id-del-producto-principal',   // El producto que se muestra en la tienda
    parentName: 'Nombre del Grupo J.Denis',
    attributeNames: ['NombreAtributo1', 'NombreAtributo2'],
    variants: [
        { productId: 'id-producto-1', attributes: { NombreAtributo1: 'Valor1' } },
        { productId: 'id-producto-2', attributes: { NombreAtributo1: 'Valor2' } },
    ],
},
```

3. El `parentId` debe coincidir con un `productId` en la lista de variants
4. Los `productId` deben coincidir con el `id` de un producto en el array `products[]`

---

## Paso 3: Crear variantes en el Dashboard (Supabase)

Para usar la interfaz gráfica del dashboard:

1. Navegar al admin: `http://localhost:5173/admin`
2. Ir a **Editor de Catálogo**
3. Hacer click en la pestaña **"Variantes"**
4. En "Crear Nuevo Grupo de Variantes":
   - Nombre del Grupo: ej. "Guantes de Nitrilo"
   - Atributos: ej. "Talla" (separados por coma si son múltiples)
5. Click en "Crear Grupo"
6. Expandir el grupo creado
7. Click en "+ Agregar Producto a este Grupo"
8. Seleccionar el producto del dropdown y llenar los atributos
9. Repetir para cada variante

---

## Paso 4: Verificar la integración

// turbo
1. Iniciar el servidor de desarrollo:
```bash
cd C:\Users\info\.gemini\antigravity\scratch\jdenis-website\website && npm run dev
```

2. Verificar en el admin (`/admin`) que:
   - La pestaña "Variantes" muestre los grupos DB
   - Los grupos hardcoded se vean en la tabla del catálogo (columna "V")
   - Al expandir un grupo se vean todas las variantes con sus atributos

3. Verificar en la tienda pública que:
   - Los productos con variantes muestren el `VariantSelector`
   - Al cambiar variante, el producto, precio e imagen cambien correctamente

---

## Paso 5: Productos candidatos a nuevos grupos de variantes

Productos que aún NO están agrupados y podrían beneficiarse:

| Productos | Atributo sugerido | 
|-----------|-------------------|
| Guantes de Nitrilo | Talla (Chica, Mediana, Grande) |
| Henna Directa (hay dos: `henna-directa-brown` y `henna-directa-2`) | Tono |
| Adhesivo Supreme G4 + Adhesivo Volumen | Tipo |
| After Care + After Care Microblading | Uso |
| Maniquí Microblading + Repuesto de Maniquí | Tipo (Kit, Repuesto) |

---

## Notas Importantes

- Los productos que pertenecen a un grupo de variantes **no se muestran individualmente** en la tienda; solo se muestra el `parentId` como representante
- Los `attributeNames` deben ser descriptivos y en español
- El `VariantSelector` automáticamente busca el mejor match al cambiar un atributo
- La función `getDisplayProducts()` en `products.ts` filtra los productos que son variantes no-parent
