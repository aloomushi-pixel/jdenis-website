---
name: E-commerce Manager
description: Skill para gestionar tiendas en línea con Supabase MCP - productos, categorías, órdenes, inventario y analytics
---

# 🛒 E-commerce Manager Skill

Este skill proporciona capacidades completas para gestionar una tienda en línea B2B/B2C usando **Supabase MCP**.

## 🎯 Capacidades

### 1. Gestión de Productos
- Crear, actualizar, eliminar productos
- Gestión de variantes y SKUs
- Control de precios y descuentos
- Imágenes y multimedia

### 2. Gestión de Categorías
- Crear jerarquías de categorías
- Orden personalizado
- SEO metadata

### 3. Gestión de Órdenes
- Procesamiento de pedidos
- Estados de orden (pending, processing, shipped, delivered)
- Historial de transacciones

### 4. Inventario
- Control de stock
- Alertas de bajo inventario
- Tracking de movimientos

### 5. Analytics
- Reportes de ventas
- Productos más vendidos
- Métricas de conversión

---

## 🛠️ Herramientas MCP Utilizadas

| Herramienta | Uso |
|-------------|-----|
| `mcp_supabase-mcp-server_execute_sql` | Queries de productos, órdenes, inventario |
| `mcp_supabase-mcp-server_apply_migration` | Crear/modificar tablas |
| `mcp_supabase-mcp-server_list_tables` | Auditar schema |
| `mcp_supabase-mcp-server_generate_typescript_types` | Type-safety |
| `mcp_supabase-mcp-server_deploy_edge_function` | Webhooks de pago |

---

## 📋 Comandos Disponibles

### Productos

```sql
-- Listar productos activos
SELECT * FROM products WHERE is_active = true ORDER BY sort_order;

-- Crear producto
INSERT INTO products (slug, name, description, price, category, stock, is_active)
VALUES ($1, $2, $3, $4, $5, $6, true);

-- Actualizar stock
UPDATE products SET stock = stock - $1, updated_at = now() WHERE id = $2;

-- Productos destacados
SELECT * FROM products WHERE is_featured = true AND is_active = true LIMIT 4;
```

### Categorías

```sql
-- Listar categorías
SELECT * FROM product_categories WHERE is_active = true ORDER BY sort_order;

-- Crear categoría
INSERT INTO product_categories (slug, name, icon, description, sort_order)
VALUES ($1, $2, $3, $4, $5);
```

### Órdenes

```sql
-- Órdenes pendientes
SELECT o.*, u.name as customer_name, u.email 
FROM orders_b2b o 
JOIN users u ON o.user_id = u.id 
WHERE o.status = 'pending' 
ORDER BY o.created_at DESC;

-- Actualizar estado de orden
UPDATE orders_b2b SET status = $1, updated_at = now() WHERE id = $2;

-- Items de una orden
SELECT oi.*, p.name, p.image_url 
FROM order_items oi 
JOIN products p ON oi.product_id = p.id 
WHERE oi.order_id = $1;
```

### Inventario

```sql
-- Productos con bajo stock
SELECT id, name, stock FROM products WHERE stock < 10 AND is_active = true;

-- Valor total de inventario
SELECT SUM(stock * price) as inventory_value FROM products WHERE is_active = true;
```

### Analytics

```sql
-- Ventas del mes
SELECT 
  DATE_TRUNC('day', created_at) as fecha,
  COUNT(*) as ordenes,
  SUM(total) as ingresos
FROM orders_b2b 
WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY fecha;

-- Top 5 productos más vendidos
SELECT 
  p.name,
  SUM(oi.quantity) as unidades_vendidas,
  SUM(oi.total) as ingresos
FROM order_items oi
JOIN products p ON oi.product_id = p.id
GROUP BY p.id, p.name
ORDER BY unidades_vendidas DESC
LIMIT 5;
```

---

## 🚀 Flujos de Trabajo

### Agregar Nuevo Producto

1. Verificar que la categoría existe
2. Generar slug único desde el nombre
3. Insertar producto con `execute_sql`
4. Subir imagen a Supabase Storage
5. Actualizar `image_url` del producto

### Procesar Orden

1. Validar stock disponible
2. Crear orden en `orders_b2b`
3. Crear items en `order_items`
4. Decrementar stock de productos
5. Enviar email de confirmación (Edge Function)
6. Actualizar estado a 'processing'

### Reporte de Ventas

1. Ejecutar query de ventas del período
2. Calcular métricas: total, promedio, growth
3. Generar visualización o export

---

## 📦 Schema Esperado

```sql
-- Tablas requeridas
products (id, slug, name, description, price, compare_at_price, image_url, category, sku, stock, is_active, is_featured, sort_order)
product_categories (id, slug, name, icon, description, sort_order, is_active)
orders_b2b (id, order_number, user_id, status, subtotal, tax, shipping, total, shipping_address, billing_address)
order_items (id, order_id, product_id, product_name, quantity, unit_price, total)
carts (id, user_id, session_id)
cart_items (id, cart_id, product_id, quantity)
```

---

## ⚙️ Configuración

### Variables de Entorno Requeridas
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Project ID para MCP
```
project_id: irdeiiichmanewpnuaml
```

---

## 🔒 Seguridad

- Todas las tablas deben tener **RLS habilitado**
- Políticas de lectura pública para productos/categorías
- Políticas autenticadas para órdenes/carrito
- Admin-only para gestión de productos

### Funciones de supabase.ts Implementadas

```typescript
// Productos
getProducts(category?)
getProductBySlug(slug)
getProductById(id)
getFeaturedProducts()

// Categorías  
getCategories()
getCategoryBySlug(slug)

// Inventario
getLowStockProducts(threshold?)
updateProductStock(productId, newStock)
decrementStock(productId, quantity)
getInventoryValue()

// Órdenes
getOrders(status?)
getPendingOrders()
getOrderById(orderId)
getOrderItems(orderId)
updateOrderStatus(orderId, status)
createOrder(orderData)

// Analytics
getSalesMetrics()
getTopSellingProducts(limit?)

// Carrito
getOrCreateCart(userId?, sessionId?)
getCartItems(cartId)
addToCart(cartId, productId, quantity?)
updateCartItemQuantity(cartItemId, quantity)
removeFromCart(cartItemId)
clearCart(cartId)
```

---

*Skill creado para JDenis B2B Professional Cosmetics - Feb 2026*
