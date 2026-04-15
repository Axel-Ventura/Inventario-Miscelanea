# Guía de configuración para desarrollo local

## Requisitos previos

- Node.js (v18 o superior)
- npm o pnpm
- Cuenta en [Aiven.io](https://aiven.io/) (gratis) para base de datos en la nube
- Git

## Configuración de la base de datos en la nube (Aiven)

1. Crear cuenta en [Aiven.io](https://aiven.io/) (plan gratuito)
2. Crear un servicio MySQL con plan **Free**
3. Crear una base de datos llamada `inventario_db`
4. Anotar los datos de conexión:
   - Host
   - Puerto
   - Usuario
   - Contraseña

## Configuración del backend

### 1. Variables de entorno

Crear archivo `.env` en `src/backend/`:

```env
DB_HOST=tu-host.aivencloud.com
DB_PORT=tu-puerto
DB_USER=tu-usuario
DB_PASSWORD=tu-contraseña
DB_NAME=inventario_db

### Instalar y ejecutar Backend

cd src/backend
npm install
npm run seed
npm start

### Instalar y ejecutar frontend

cd src/frontend
npm install
npm run dev