# J DENIS ERP/WMS Platform

Sistema integral de gestión empresarial (ERP) y gestión de almacén (WMS) para J DENIS, una Progressive Web Application con arquitectura moderna.

## 🚀 Características Principales

### **Tres Módulos de Negocio**
- **Administración Central**: Gestión de compras, ventas, inventario global, RR.HH. y flota de transporte
- **Fábrica**: Control de producción, entrada de materiales, balance de stock y salida de productos
- **Almacén**: Recepción de productos, optimización de espacio (racks), despacho y protocolos de entrega

### **Cuatro Roles de Usuario**
1. **Administrador**: Vista completa con analytics y métricas de negocio
2. **Encargado de Fábrica**: Dashboard de producción y protocolos técnicos
3. **Encargado de Almacén**: Logística de almacenamiento y despacho
4. **Transportista**: Interfaz móvil simplificada para entregas

### **Funcionalidades Destacadas**
- ✅ **Inventario en Tiempo Real** con WebSocket (Socket.IO)
- ✅ **PWA (Progressive Web App)** con soporte offline
- ✅ **Autenticación JWT** con control de acceso basado en roles (RBAC)
- ✅ **Protocolos Técnicos** con checklists paso a paso
- ✅ **Mobile-First Design** optimizado para tabletas y smartphones
- ✅ **Dashboards Personalizados** según el rol del usuario

## 📦 Stack Tecnológico

### **Frontend**
- React 18 + TypeScript
- Vite (Build tool)
- Tailwind CSS
- Zustand (State management)
- Socket.IO Client (Real-time)
- React Router (Navigation)
- Vite PWA Plugin

### **Backend**
- Node.js 20 + Express
- TypeScript
- Prisma ORM
- PostgreSQL 16
- Socket.IO Server
- JWT Authentication
- Bcrypt (Password hashing)
- Zod (Validation)

### **DevOps**
- Docker + Docker Compose
- Nginx (Reverse proxy)
- Multi-stage builds

## 🛠️ Instalación y Despliegue

### **Requisitos Previos**
- Docker y Docker Compose instalados
- Git
- Cuenta en Dokploy (para producción)

### **Despliegue con Docker Compose**

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd j-denis-erp
```

2. **Construir y ejecutar los contenedores**
```bash
docker-compose up --build -d
```

3. **Verificar que todo está corriendo**
```bash
docker-compose ps
```

Deberías ver 3 servicios corriendo:
- `jdenis-db` (PostgreSQL en puerto 5432)
- `jdenis-backend` (API en puerto 3000)
- `jdenis-frontend` (Nginx en puerto 80)

4. **Acceder a la aplicación**
- Frontend: http://localhost
- Backend API: http://localhost:3000
- Database: localhost:5432

### **Primer Inicio - Datos de Prueba**

El backend ejecuta automáticamente las migraciones y el seed de la base de datos en el primer inicio. Se crean los siguientes usuarios de prueba:

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | admin@jdenis.com | admin123 |
| Encargado de Fábrica | fabrica@jdenis.com | factory123 |
| Encargado de Almacén | almacen@jdenis.com | warehouse123 |
| Transportista | transporte@jdenis.com | transport123 |

### **Despliegue en Dokploy**

1. **Preparar el repositorio**
   - Sube todo el código a un repositorio Git (GitHub, GitLab, etc.)

2. **En Dokploy**
   - Crea un nuevo proyecto
   - Conecta tu repositorio
   - Selecciona "Docker Compose" como método de despliegue
   - Apunta al archivo `docker-compose.yml`

3. **Variables de Entorno (Importante)**
   
   En Dokploy, configura estas variables de entorno:
   
   **Backend:**
   ```
   DATABASE_URL=postgresql://jdenis:jdenis123@db:5432/jdenis_erp?schema=public
   JWT_SECRET=<genera-un-secreto-seguro>
   PORT=3000
   NODE_ENV=production
   ```

4. **Desplegar**
   - Haz clic en "Deploy"
   - Dokploy construirá las imágenes y ejecutará los contenedores

## 📱 Uso de la Aplicación

### **Panel de Administración**
- Vista general de inventario en tiempo real
- Gestión de órdenes de compra y venta
- Administración de empleados (RR.HH.)
- Control de flota de transporte
- Analytics y métricas de negocio

### **Panel de Fábrica**
- Creación de lotes de producción
- Registro de consumo de materiales
- Registro de productos terminados
- Ejecución de protocolos de calidad
- Balance de stock (materiales vs productos)

### **Panel de Almacén**
- Recepción de productos desde fábrica
- Gestión de ubicaciones (racks)
- Optimización de espacio
- Preparación de despachos
- Módulo de transición a transportista

### **App de Transportista (Móvil)**
- Lista de entregas asignadas
- Confirmación de entregas
- Registro de firmas
- Historial de entregas completadas

## 🔧 Desarrollo Local

### **Backend**
```bash
cd backend
npm install
npm run dev
```

### **Frontend**
```bash
cd frontend
npm install
npm run dev
```

### **Base de Datos**
```bash
# Ejecutar migraciones
cd backend
npx prisma migrate dev

# Seed de datos
npx prisma db seed

# Abrir Prisma Studio
npx prisma studio
```

## 📊 Estructura del Proyecto

```
j-denis-erp/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuración (DB, etc.)
│   │   ├── middleware/      # Auth, validación
│   │   ├── routes/          # Endpoints API
│   │   └── index.ts         # Servidor Express
│   ├── prisma/
│   │   ├── schema.prisma    # Modelo de datos
│   │   └── seed.ts          # Datos iniciales
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/           # Páginas por rol
│   │   ├── services/        # API y Socket.IO
│   │   ├── store/           # Zustand stores
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Autenticación JWT con expiración de tokens
- ✅ RBAC (Control de acceso basado en roles)
- ✅ Validación de requests con Zod
- ✅ CORS configurado
- ✅ SQL Injection prevention (Prisma ORM)

## 🌐 API Endpoints

### **Auth**
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión

### **Inventory**
- `GET /api/inventory` - Obtener inventario global
- `GET /api/inventory/locations` - Ubicaciones de inventario
- `GET /api/inventory/products` - Listar productos

### **Factory**
- `GET /api/factory/batches` - Lotes de producción
- `POST /api/factory/batches` - Crear lote
- `POST /api/factory/batches/:id/materials` - Registrar consumo
- `POST /api/factory/batches/:id/output` - Registrar producción

### **Warehouse**
- `GET /api/warehouse/racks` - Racks de almacenamiento
- `GET /api/warehouse/receiving` - Logs de recepción
- `POST /api/warehouse/receiving` - Recibir productos
- `POST /api/warehouse/dispatch` - Despachar productos
- `POST /api/warehouse/handoff` - Entrega a transportista

### **Sales & Purchases**
- `GET /api/sales` - Órdenes de venta
- `POST /api/sales` - Crear orden de venta
- `GET /api/purchases` - Órdenes de compra
- `GET /api/purchases/suppliers` - Proveedores

### **Assets**
- `GET /api/assets` - Flota de vehículos
- `GET /api/assets/deliveries` - Entregas
- `PATCH /api/assets/deliveries/:id/complete` - Completar entrega

### **Protocols**
- `GET /api/protocols/templates` - Plantillas de protocolos
- `POST /api/protocols/execute` - Ejecutar protocolo
- `PATCH /api/protocols/execute/:id` - Actualizar ejecución

## 📞 Soporte

Para preguntas o soporte, contacta al equipo de J DENIS.

---

**Desarrollado para J DENIS** | Sistema ERP/WMS Integral
