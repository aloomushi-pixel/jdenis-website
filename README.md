# J DENIS ERP/WMS Platform

Sistema integral de gestión empresarial (ERP/WMS) para J DENIS con tracking blockchain, analytics en tiempo real, y gestión completa de recursos.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-Proprietary-red)

## 🚀 Características Principales

### Backend
- ✅ **7 Roles de Usuario**: Admin, Transportista, Almacén MP, Almacén PF, Fábrica, Ejecutivo, Cliente
- ✅ **Sistema Blockchain**: Tracking inmutable de pedidos
- ✅ **Analytics Dashboard**: 6 métricas clave en tiempo real
- ✅ **Gestión de Recursos**: 4 categorías (Materia Prima, Embalaje, Producto Final, Vehículos)
- ✅ **Cotizaciones y Ventas**: Módulo ejecutivo completo
- ✅ **Event Logging**: Auditoría completa de operaciones

### Frontend
- ✅ **Dashboard Responsive**: Gráficas Recharts (Pie, Bar, Line)
- ✅ **Gestor de Recursos**: Tabs por categoría con CRUD
- ✅ **Timeline Blockchain**: Visualización de historial de pedidos
- ✅ **PWA Ready**: Instalable en móviles y tablets

## 📦 Stack Tecnológico

### Backend
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- Socket.io para real-time
- JWT Authentication
- Docker ready

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS
- Recharts para analytics
- React Router v6
- Zustand para state management

## 🔐 Usuarios de Prueba

Después del seed, estos usuarios estarán disponibles:

| Email | Password | Rol |
|-------|----------|-----|
| admin@jdenis.com | admin123 | ADMIN |
| transportista@jdenis.com | transportista123 | TRANSPORTISTA |
| almacenmp@jdenis.com | almacenmp123 | ALMACEN_MATERIA_PRIMA |
| almacenpf@jdenis.com | almacenpf123 | ALMACEN_PRODUCTO_FINAL |
| fabrica@jdenis.com | fabrica123 | FABRICA |
| ejecutivo@jdenis.com | ejecutivo123 | EJECUTIVO |
| cliente@jdenis.com | cliente123 | CLIENTE |

## 🛠️ Instalación Local

### Opción 1: Docker (Recomendado)

```bash
# Clonar repositorio
git clone <tu-repo-url>
cd j-denis-erp

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus credenciales
# Importante: Cambiar DATABASE_URL, JWT_SECRET

# Levantar servicios
docker compose up -d --build

# Esperar ~30 segundos para que Postgres inicie
# La app estará en http://localhost
```

### Opción 2: Manual

```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

## 🌐 Deployment en Dokploy

### 1. Crear Repositorio en GitHub
```bash
# Conectar a tu repositorio
git remote add origin https://github.com/TU_USUARIO/j-denis-erp.git
git branch -M main
git push -u origin main
```

### 2. Configurar en Dokploy

1. **Login en Dokploy**: http://72.62.162.99:3000
2. **Crear nuevo proyecto**: "J DENIS ERP"
3. **Conectar GitHub**: Autorizar acceso al repositorio
4. **Configurar Variables de Entorno**:

```env
# Base de datos (Dokploy creará automáticamente)
DATABASE_URL=postgresql://user:password@postgres:5432/jdenis

# Backend
JWT_SECRET=tu-secret-super-seguro-cambiar-en-produccion
NODE_ENV=production
PORT=4000

# Frontend
VITE_API_URL=http://72.62.162.99:4000
VITE_SOCKET_URL=http://72.62.162.99:4000
```

5. **Deploy**: Hacer clic en "Deploy"

### 3. Ejecutar Migraciones Post-Deploy

Una vez desplegado, ejecutar en la consola del contenedor:

```bash
npx prisma migrate deploy
npx prisma db seed
```

## 📊 Estructura del Proyecto

```
j-denis-erp/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Schema con 7 roles y 8 nuevos modelos
│   │   └── seed.ts            # Seed con datos de prueba
│   └── src/
│       ├── routes/
│       │   ├── resources.routes.ts    # Gestión de recursos
│       │   ├── quotations.routes.ts   # Sistema de cotizaciones
│       │   ├── orders.routes.ts       # Pedidos con blockchain
│       │   └── analytics.routes.ts    # Dashboard analytics
│       └── middleware/
│           └── auth.ts        # Autenticación JWT
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── DashboardAnalytics.tsx  # 6 gráficas analytics
│       │   ├── ResourceManager.tsx     # Gestor de recursos
│       │   ├── QuotationModule.tsx     # Cotizaciones
│       │   └── OrderTimeline.tsx       # Timeline blockchain
│       └── store/
│           └── authStore.ts   # 7 roles
└── docker-compose.yml
```

## 🔄 Workflow de Desarrollo

```bash
# 1. Crear rama para feature
git checkout -b feature/nueva-funcionalidad

# 2. Hacer cambios y commit
git add .
git commit -m "feat: descripción del cambio"

# 3. Push a GitHub
git push origin feature/nueva-funcionalidad

# 4. Merge a main
# Dokploy detectará el cambio y redesplegaraá automáticamente
```

## 📚 API Endpoints

### Recursos
- `GET /api/resources` - Listar recursos
- `POST /api/resources` - Crear recurso
- `PUT /api/resources/:id` - Actualizar
- `DELETE /api/resources/:id` - Eliminar

### Cotizaciones
- `GET /api/quotations` - Listar cotizaciones
- `POST /api/quotations` - Crear cotización
- `PUT /api/quotations/:id/convert` - Convertir a pedido

### Pedidos (Blockchain)
- `GET /api/orders` - Listar pedidos
- `PUT /api/orders/:id/status` - Actualizar status (agrega a blockchain)
- `GET /api/orders/:id/timeline` - Ver timeline completo

### Analytics
- `GET /api/analytics/dashboard` - Métricas principales
- `GET /api/analytics/charts` - Datos para gráficas

## 🔐 Seguridad

- ✅ JWT Authentication
- ✅ Role-Based Access Control (RBAC)
- ✅ Protected routes en frontend
- ✅ Validación de permisos en backend
- ✅ CORS configurado
- ✅ Helmet.js para security headers

## 🐛 Troubleshooting

### Error: Cannot connect to database
```bash
# Verificar que Postgres esté corriendo
docker compose ps

# Ver logs
docker compose logs postgres
```

### Error: Prisma Client not generated
```bash
cd backend
npx prisma generate
```

### Frontend no conecta con backend
Verificar que `VITE_API_URL` en `.env` apunte a la URL correcta del backend.

## 📝 Changelog

### v2.0.0 (2026-01-23)
- ✨ Implementación completa de 7 roles de usuario
- ✨ Sistema blockchain para tracking de pedidos
- ✨ Dashboard analytics con 6 métricas
- ✨ Gestor de recursos con 4 categorías
- ✨ Módulo ejecutivo (cotizaciones y ventas)
- ✨ Timeline visual de pedidos
- 🎨 Diseño responsive completo
- 🔧 Mejoras en autenticación y permisos

## 📄 Licencia

Proprietary - © 2026 J DENIS

## 👨‍💻 Autor

Desarrollado para J DENIS

---

**¿Necesitas ayuda?** Contacta al equipo de desarrollo.
