# Stack Tecnológico y Justificación por Capas  
**Inventory Management System**

Este documento describe el **stack tecnológico** del sistema, organizado por **capas (layers)**, indicando la **tecnología**, **versión/herramienta** y la **función con su justificación técnica**.

---

## 1. Frontend (Cliente)

| Tecnología | Versión / Herramienta | Función y Justificación Técnica |
|-----------|----------------------|----------------------------------|
| **React** | 18+ (con Vite) | Biblioteca de UI basada en componentes. Permite crear una **SPA (Single Page Application)** rápida, modular y altamente reactiva, mejorando la experiencia de usuario y el rendimiento. |
| **Tailwind CSS** | 3.4+ | Framework de estilos *utility-first*. Facilita la creación de interfaces consistentes, accesibles y responsivas. Permite manejar estados como `focus:ring`, esenciales para accesibilidad y navegación por teclado. |
| **React Router DOM** | 6+ | Manejo de rutas en el frontend. Permite definir claramente **rutas públicas y privadas**, navegación sin recarga y control de acceso basado en autenticación. |
| **Axios** | Latest | Cliente HTTP para consumir la API REST. Maneja **interceptores** para adjuntar automáticamente el JWT en cada request autenticado. |
| **Zustand** | Latest | Gestión de estado global ligera. Ideal para manejar sesión de usuario, token y datos compartidos sin la complejidad de Redux. |

---

## 2. Backend (Servidor)

| Tecnología | Versión / Herramienta | Función y Justificación Técnica |
|-----------|----------------------|----------------------------------|
| **Node.js** | LTS (20 o 22) | Entorno de ejecución para JavaScript en el servidor. Unifica el lenguaje en todo el proyecto y mejora la mantenibilidad. |
| **Express.js** | 4.x | Framework web minimalista para crear la **API REST**. Gestiona rutas, middlewares, validaciones y lógica de negocio. |
| **JWT (jsonwebtoken)** | Latest | Autenticación **stateless**. No requiere sesiones en servidor, lo que lo hace seguro y altamente escalable. |
| **Bcrypt (bcryptjs)** | Latest | Seguridad obligatoria. Hasheo de contraseñas antes de almacenarlas en la base de datos. |

---

## 3. Base de Datos

| Tecnología | Versión / Herramienta | Función y Justificación Técnica |
|-----------|----------------------|----------------------------------|
| **MySQL / MariaDB** | 8.0+ / 10+ | Base de datos relacional. Ideal para sistemas de inventario donde la **integridad de datos y transacciones** es crítica. |
| **Prisma ORM** | Latest | Capa de abstracción de base de datos con **tipado seguro**, consultas claras y **migraciones automatizadas**. |

---

## 4. DevOps & Infraestructura

| Tecnología | Versión / Herramienta | Función y Justificación Técnica |
|-----------|----------------------|----------------------------------|
| **Docker** | Latest | Contenerización de la aplicación. Permite empaquetar frontend, backend y base de datos usando `Dockerfile` y `docker-compose.yml`. |
| **Git** | GitHub / GitLab | Control de versiones. Fundamental para trabajo en equipo, trazabilidad y entregables del proyecto. |
| **GitHub Actions** | CI/CD | Integración Continua. Automatiza pruebas, builds y despliegues, asegurando calidad y consistencia. |

---

## Notas Finales

- Stack moderno, **escalable y seguro**
- Preparado para:
  - Roles y permisos
  - Crecimiento del sistema
  - Despliegue en la nube
- Alineado con buenas prácticas profesionales

---

**Documento técnico – Inventory Management System**
