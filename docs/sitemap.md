# Inventory Management System – Mapa General de Navegación

Este documento describe la **estructura general de navegación** del *Inventory Management System*, separando las secciones **pública** y **privada**, así como los módulos principales del sistema.

---

## Visión General

El sistema se divide en dos grandes áreas:

- **Public Section**: accesible sin autenticación.
- **Private Section**: accesible únicamente con sesión iniciada.

Desde la sección privada, el usuario puede gestionar inventario, ventas y configuración del sistema.

---

## Sección Pública

### `/login`
- Punto de entrada al sistema.
- Permite al usuario autenticarse.
- Tras login exitoso redirige al **Dashboard**.

---

## Sección Privada

### `/dashboard` (Inicio)
Pantalla principal del sistema. Incluye widgets informativos:

- **Resumen de ventas** (Widget)
- **Alertas de stock** (Widget)

Desde aquí el usuario puede navegar a los módulos principales.

---

### `/inventario` – Gestión de Productos

Funciones disponibles:

- **Ver lista de productos**
  - Buscador
  - Filtros
- **Crear producto**
  - Ruta: `/inventario/nuevo`
- **Detalle / edición de producto**
  - Ruta: `/inventario/:id`

---

### `/ventas` – Registro de Salidas

Funciones disponibles:

- **Nueva venta**
  - Carrito de compra rápido
  - Actualización automática de stock

---

### `/configuracion` – Ajustes del Sistema

Funciones disponibles:

- **Perfil de usuario**
- **Cerrar sesión**

---

## Diagrama de Navegación (Mermaid)

```mermaid
flowchart TD
    A[Inventory Management System]

    A --> B[Public Section]
    A --> C[Private Section]

    B --> D[/login]

    C --> E[/dashboard]
    E --> E1[Resumen ventas<br/>(Widget)]
    E --> E2[Alertas de stock<br/>(Widget)]

    C --> F[/inventario<br/>(Gestión de Productos)]
    F --> F1[Lista de productos<br/>(Buscador + Filtros)]
    F --> F2[/inventario/nuevo<br/>(Crear Producto)]
    F --> F3[/inventario/:id<br/>(Detalle / Editar)]

    C --> G[/ventas<br/>(Registro de Salidas)]
    G --> G1[Nueva Venta<br/>(Carrito rápido)]

    C --> H[/configuracion<br/>(Ajustes)]
    H --> H1[Perfil de Usuario]
    H --> H2[Cerrar Sesión]
```

---

## Consideraciones de Arquitectura

- Todas las rutas privadas deben estar protegidas con **JWT**.
- El sidebar debe reflejar:
  - Dashboard
  - Inventario
  - Ventas
  - Configuración
- El sistema está preparado para escalar con:
  - Roles (admin / usuario)
  - Permisos por módulo
  - Auditoría de acciones

---

## Tecnologías Sugeridas

- **Frontend:** JavaScript / React
- **Backend:** Node.js (API REST)
- **Base de datos:** MongoDB o MySQL
- **Autenticación:** JWT