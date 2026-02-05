# Patrones de Inventario - J DENIS

## Stock Movement Pattern

### Entrada de Inventario
```typescript
// 1. Validar producto existe
// 2. Validar ubicación existe
// 3. Crear movimiento con tipo ENTRADA
// 4. Actualizar stock en ubicación
// 5. Registrar log con usuario
```

### Salida de Inventario
```typescript
// 1. Validar stock disponible >= cantidad
// 2. Crear movimiento con tipo SALIDA
// 3. Decrementar stock
// 4. Registrar log
```

### Transferencia entre Ubicaciones
```typescript
// 1. Validar stock origen >= cantidad
// 2. Crear movimiento SALIDA en origen
// 3. Crear movimiento ENTRADA en destino
// 4. Todo en transacción Prisma
```

## Product Types

| Tipo | Código Prisma | Descripción |
|------|---------------|-------------|
| Materia Prima | `RAW_MATERIAL` | Inputs de producción |
| Producto Final | `FINISHED_PRODUCT` | Outputs de producción |
| Packaging | `PACKAGING` | Materiales de embalaje |

## Location Types

| Tipo | Código | Uso |
|------|--------|-----|
| Almacén | `WAREHOUSE` | Stock general |
| Fábrica | `FACTORY` | Producción |
| Oficina | `OFFICE` | Muestras/Admin |
| Tránsito | `IN_TRANSIT` | En camino |

## Queries Comunes

### Stock por ubicación
```sql
SELECT p.name, s.quantity, l.name as location
FROM "Stock" s
JOIN "Product" p ON s."productId" = p.id
JOIN "InventoryLocation" l ON s."locationId" = l.id
WHERE l.id = $locationId;
```

### Movimientos recientes
```sql
SELECT * FROM "StockMovement"
WHERE "createdAt" > NOW() - INTERVAL '7 days'
ORDER BY "createdAt" DESC;
```
