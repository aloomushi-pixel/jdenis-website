# Proyecto: J DENIS ERP/WMS

## 🎯 Principios de Desarrollo (Context Engineering)

### Design Philosophy
- **KISS**: Keep It Simple, Stupid - Prefiere soluciones simples
- **YAGNI**: You Aren't Gonna Need It - Implementa solo lo necesario  
- **DRY**: Don't Repeat Yourself - Evita duplicación de código
- **SOLID**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion

### Descripción del Proyecto
**J DENIS ERP/WMS** es un sistema integral de gestión empresarial (ERP) con módulo de gestión de almacenes (WMS) para la empresa J DENIS. Incluye gestión de inventarios, órdenes, transporte, producción y control de recursos.

**Características principales:**
- 7 roles de usuario diferenciados (Admin, Transportista, Almacén MP, Almacén PF, Fábrica, Ejecutivo, Cliente)
- Gestión de inventario multi-ubicación
- Control de producción y trazabilidad
- Sistema de cotizaciones y órdenes
- Control de transporte y entregas
- Dashboard personalizado por rol

## 🏗️ Tech Stack & Architecture

### Core Stack
- **Runtime**: Node.js 20+ + TypeScript
- **Frontend**: Vite + React 18 + TypeScript
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Supabase hosted)
- **ORM**: Prisma 5.x
- **Styling**: Vanilla CSS (custom design system)
- **State Management**: Zustand
- **Schema Validation**: Zod

### Database Connection
- **Project ID**: vqcjxzsibywdxpvkyysa
- **Host**: aws-0-us-west-2.pooler.supabase.com
- **Port**: 6543 (connection pooling)
- **Tables**: 30 core tables

### Architecture: Feature-First

**Enfoque: Arquitectura Feature-First optimizada para desarrollo asistido por IA**

#### Frontend: Feature-First
```
frontend/src/
├── features/                 # 🎯 Organizadas por funcionalidad
│   ├── auth/                # Feature: Autenticación
│   │   ├── components/      # LoginForm, etc.
│   │   ├── hooks/           # useAuth
│   │   └── services/        # authService.ts
│   │
│   ├── dashboard/           # Feature: Dashboard por rol
│   ├── inventory/           # Feature: Gestión de inventario
│   ├── orders/              # Feature: Pedidos y cotizaciones
│   ├── production/          # Feature: Fábrica y producción
│   ├── transport/           # Feature: Transportista
│   └── resources/           # Feature: Gestión de recursos
│
├── shared/                   # Código reutilizable
│   ├── components/          # UI genéricos (Button, Card, Modal)
│   ├── hooks/               # Hooks genéricos
│   ├── types/               # Tipos compartidos
│   ├── utils/               # Funciones utilitarias
│   └── lib/                 # Configuraciones (api client, auth)
│
└── app/                     # Entry points
    ├── App.tsx
    ├── main.tsx
    └── routes/
```

#### Backend: Clean Architecture
```
backend/src/
├── routes/                  # HTTP endpoints por dominio
│   ├── auth.ts             # /api/auth/*
│   ├── users.ts            # /api/users/*
│   ├── products.ts         # /api/products/*
│   ├── orders.ts           # /api/orders/*
│   └── ...
│
├── middleware/             # Cross-cutting concerns
│   ├── auth.ts             # JWT validation
│   └── roleAuth.ts         # Role-based access
│
├── prisma/                 # Database layer
│   ├── schema.prisma       # 30 models
│   └── seed.ts             # Initial data
│
└── utils/
```

## 🔐 Sistema de Roles (7 roles)

| Rol | Código | Permisos principales |
|-----|--------|---------------------|
| Admin | `ADMIN` | Acceso total, gestión de usuarios |
| Transportista | `TRANSPORTISTA` | Entregas, rutas, vehículos |
| Almacén MP | `ALMACEN_MATERIA_PRIMA` | Inventario materia prima |
| Almacén PF | `ALMACEN_PRODUCTO_FINAL` | Inventario producto final |
| Fábrica | `FABRICA` | Producción, protocolos |
| Ejecutivo | `EJECUTIVO` | Cotizaciones, órdenes, clientes |
| Cliente | `CLIENTE` | Ver estado pedidos, historial |

## 🛠️ Comandos Importantes

### Development
```bash
# Frontend (puerto 3001)
cd frontend && npm run dev

# Backend (puerto 4000)
cd backend && npm run dev

# Ambos con Docker Compose
docker-compose up
```

### Database
```bash
# Generar cliente Prisma
cd backend && npx prisma generate

# Aplicar migraciones
cd backend && npx prisma migrate deploy

# Seed de datos
cd backend && npx tsx prisma/seed.ts

# Prisma Studio (GUI)
cd backend && npx prisma studio
```

### Production
```bash
# Build producción
docker-compose -f docker-compose.prod.yml build

# Deploy (Dokploy)
git push origin master  # Webhook triggers deployment
```

## 📝 Convenciones de Código

### File & Function Limits
- **Archivos**: Máximo 500 líneas
- **Funciones**: Máximo 50 líneas
- **Componentes**: Una responsabilidad clara

### Naming Conventions
- **Variables/Functions**: `camelCase`
- **Components**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Files**: `kebab-case.extension` o `PascalCase.tsx` para componentes
- **Database tables**: `snake_case` (via Prisma @@map)

### TypeScript Guidelines
- **Siempre usar type hints** para function signatures
- **Interfaces** para object shapes (Props, API responses)
- **Types** para unions y primitives
- **Evitar `any`** - usar `unknown` si es necesario
- **Zod schemas** para validación de entrada

### API Response Format
```typescript
// Success
{ data: T, message?: string }

// Error
{ error: string, details?: unknown }

// Paginated
{ data: T[], total: number, page: number, pageSize: number }
```

## 🔒 Security Best Practices

### Authentication
- JWT tokens con expiración (24h por defecto)
- Passwords hasheados con bcrypt (10 rounds)
- Role-based access control en cada endpoint

### Input Validation
- Zod schemas en backend para todas las rutas
- Sanitización de inputs antes de DB queries
- Prisma ORM previene SQL injection

### API Security
- CORS configurado para frontend específico
- Rate limiting recomendado para producción
- HTTPS en producción (Dokploy/Traefik)

## ❌ No Hacer (Critical)

### Code Quality
- ❌ No usar `any` en TypeScript
- ❌ No omitir manejo de errores (try/catch)
- ❌ No hardcodear configuraciones (usar env vars)
- ❌ No crear archivos mayores a 500 líneas

### Security  
- ❌ No exponer secrets en código (usar .env)
- ❌ No loggear información sensible (passwords, tokens)
- ❌ No saltarse validación de entrada
- ❌ No usar HTTP en producción

### Architecture
- ❌ No mezclar lógica de negocio en componentes UI
- ❌ No crear dependencias circulares
- ❌ No duplicar código entre features (mover a shared/)

## 🤖 AI Assistant Guidelines

### When Suggesting Code
- Siempre incluir types en TypeScript
- Seguir principles de CLAUDE.md
- Implementar error handling completo
- Respetar el sistema de roles existente

### When Reviewing Code  
- Verificar adherencia a Feature-First architecture
- Validar security best practices
- Verificar role-based access en endpoints
- Sugerir mejoras en organización

### Context Priority
1. **CLAUDE.md rules** (highest priority)
2. **Existing patterns** en el código
3. **Prisma schema** para modelos de datos
4. **General best practices**

## 📚 Referencias Importantes

### Project Files
- `backend/prisma/schema.prisma` - Modelos de base de datos
- `backend/src/routes/` - Endpoints de API
- `frontend/src/App.tsx` - Router principal
- `DEPLOYMENT.md` - Guía de deployment Dokploy

### URLs
- **Backend Health**: http://72.62.162.99:4000/health
- **Supabase Dashboard**: https://supabase.com/dashboard/project/vqcjxzsibywdxpvkyysa

---

*Este archivo es la fuente de verdad para desarrollo en este proyecto. Todas las decisiones de código deben alinearse con estos principios.*
