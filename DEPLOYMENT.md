# Guía de Despliegue en Dokploy - J DENIS ERP/WMS

## Pasos para Desplegar en Dokploy

### 1. Preparación del Repositorio Git

Primero, sube todo el código a un repositorio Git (GitHub, GitLab, Bitbucket):

```bash
cd j-denis-erp
git init
git add .
git commit -m "Initial commit: J DENIS ERP/WMS Platform"
git remote add origin <tu-url-de-repositorio>
git push -u origin main
```

### 2. Configuración en Dokploy

1. **Accede a tu panel de Dokploy**
   - Ve a https://tu-dominio-dokploy.com

2. **Crear Nuevo Proyecto**
   - Click en "New Project"
   - Nombre: `j-denis-erp`
   - Tipo: "Docker Compose"

3. **Conectar Repositorio**
   - Conecta tu repositorio Git
   - Selecciona la rama `main`
   - Dokploy detectará automáticamente el `docker-compose.yml`

4. **Configurar Variables de Entorno**

   En la sección de "Environment Variables", agrega:

   ```
   # Base de datos
   POSTGRES_DB=jdenis_erp
   POSTGRES_USER=jdenis
   POSTGRES_PASSWORD=<contraseña-segura>

   # Backend
   DATABASE_URL=postgresql://jdenis:<contraseña>@db:5432/jdenis_erp?schema=public
   JWT_SECRET=<genera-secreto-jwt-seguro>
   PORT=3000
   NODE_ENV=production
   FRONTEND_URL=https://tu-dominio.com

   # Frontend
   VITE_API_URL=https://api.tu-dominio.com/api
   VITE_SOCKET_URL=https://api.tu-dominio.com
   ```

   **⚠️ IMPORTANTE**: Cambia las contraseñas y secretos por valores seguros.

### 3. Configuración de Dominios

En Dokploy, configura los dominios:

- **Frontend**: `https://jdenis.tu-dominio.com` → Puerto 80
- **Backend API**: `https://api.jdenis.tu-dominio.com` → Puerto 3000

Dokploy configurará automáticamente SSL con Let's Encrypt.

### 4. Desplegar la Aplicación

1. Click en el botón **"Deploy"**
2. Dokploy ejecutará:
   - `docker-compose build` para construir las imágenes
   - `docker-compose up -d` para iniciar los contenedores
   - Las migraciones de base de datos se ejecutan automáticamente
   - El seed de datos iniciales se carga en el primer despliegue

3. **Monitorear el Despliegue**
   - Verifica los logs en tiempo real en Dokploy
   - Asegúrate de que los 3 servicios estén "running":
     - `jdenis-db`
     - `jdenis-backend`
     - `jdenis-frontend`

### 5. Verificación Post-Despliegue

1. **Accede a la aplicación**
   - Ve a `https://jdenis.tu-dominio.com`
   - Deberías ver la pantalla de login

2. **Prueba con usuarios de prueba**
   - Admin: admin@jdenis.com / admin123
   - Fábrica: fabrica@jdenis.com / factory123
   - Almacén: almacen@jdenis.com / warehouse123
   - Transporte: transporte@jdenis.com / transport123

3. **Verifica funcionalidades clave**
   - ✅ Login funciona
   - ✅ Dashboard carga con datos
   - ✅ Inventario en tiempo real se actualiza
   - ✅ PWA se puede instalar en móvil

### 6. Configuración de Volúmenes Persistentes

Dokploy maneja automáticamente el volumen de PostgreSQL definido en docker-compose:

```yaml
volumes:
  postgres_data:
    driver: local
```

**⚠️ IMPORTANTE**: Configura backups automáticos en Dokploy para el volumen `postgres_data`.

### 7. Actualizaciones Futuras

Para actualizar la aplicación:

1. Haz push de tus cambios al repositorio:
   ```bash
   git add .
   git commit -m "Actualización de funcionalidades"
   git push
   ```

2. En Dokploy:
   - Click en "Redeploy"
   - Dokploy reconstruirá las imágenes y reiniciará los servicios
   - Zero-downtime deployment si configuras "Rolling Updates"

### 8. Monitoreo y Logs

En Dokploy puedes:

- **Ver logs en tiempo real** de cada servicio
- **Métricas de uso** (CPU, RAM, almacenamiento)
- **Estado de salud** de los contenedores
- **Alertas** ante fallos

### 9. Seguridad Adicional

1. **Firewall**: Asegúrate de que solo los puertos 80 y 443 estén expuestos públicamente
2. **Base de datos**: El puerto 5432 debe estar accesible SOLO internamente entre contenedores
3. **Secretos**: Nunca commitees archivos `.env` al repositorio
4. **HTTPS**: Dokploy configura SSL automáticamente, verifica que esté activo

### 10. Solución de Problemas Comunes

#### Backend no inicia
```bash
# Ver logs del backend
docker logs jdenis-backend

# Verificar conexión a DB
docker exec -it jdenis-backend sh
node -e "require('./dist/config/database').default.$connect().then(() => console.log('DB OK'))"
```

#### Frontend muestra pantalla en blanco
- Verifica que las variables `VITE_API_URL` y `VITE_SOCKET_URL` apunten a tu dominio de backend
- Revisa la consola del navegador para errores de CORS

#### Base de datos no tiene datos
```bash
# Re-ejecutar seed
docker exec -it jdenis-backend npm run prisma:seed
```

## 🎉 ¡Listo!

Tu plataforma J DENIS ERP/WMS está desplegada en producción con Dokploy.

---

**Soporte Técnico**: Contacta al equipo de desarrollo para asistencia.
