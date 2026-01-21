# Inventory Management System – Flujo de Autenticación y Navegación

Este documento describe el flujo mostrado en el diagrama del sistema de **Inventory Management System**, enfocado en la validación de sesión mediante token y la navegación inicial del usuario.

---

## Flujo General

1. El sistema inicia en **Inventory Management System**.
2. Se valida si el usuario **tiene un token válido**.
3. Si **NO** tiene token:
   - Se redirige a `/login`.
   - El usuario ingresa sus credenciales.
   - El backend valida las credenciales (Node.js / MySQL).
   - El sistema devuelve un **JWT** y lo guarda en el storage.
4. Si **SÍ** tiene token:
   - Se omite el login.
5. En ambos casos exitosos:
   - Se redirige a `/dashboard`.
   - El usuario se encuentra en el dashboard.
   - El usuario hace clic en **Inventario** desde el sidebar.

---

## Diagrama de Flujo (Mermaid)

```mermaid
flowchart TD
    A[Inventory Management System] --> B{¿Tiene token válido?}

    B -- NO --> C[Redirige a /login]
    C --> D[Usuario ingresa credenciales]
    D --> E[Valida con Backend (Node/MySQL)]
    E --> F[Recibe JWT y guarda en Storage]
    F --> G[Redirige a /dashboard]

    B -- SÍ --> G

    G --> H[Usuario en /dashboard]
    H --> I[Usuario hace clic en Inventario (Sidebar)]
```

---

## Notas Técnicas

- El **JWT** se recomienda almacenarlo en:
  - `httpOnly cookies` (más seguro), o
  - `localStorage` / `sessionStorage` (más simple).
- El middleware del backend debe validar el token en cada request protegida.
- El frontend puede usar **guards** o **middlewares de ruta** para proteger `/dashboard`.

---

## Flujo General

1. El sistema carga la vista `/inventario` (lista de productos).
2. El usuario presiona el botón **"Nuevo Producto"**.
3. El sistema navega a `/inventario/nuevo`.
4. El usuario llena el formulario con:
   - Nombre
   - Precio
   - Stock
5. El usuario presiona **"Guardar"**.
6. El sistema envía una petición **POST** a la API.
7. Se valida la respuesta del backend:
   - **Si es OK**:
     - Se muestra la notificación **"Guardado"**.
     - Se redirige a `/inventario` (lista).
     - Fin del flujo.
   - **Si NO es OK**:
     - Se muestra un error.
     - Se regresa al formulario para corrección.

---

## Diagrama de Flujo (Mermaid)

```mermaid
flowchart TD
    A[Sistema carga /inventario (Lista)] --> B[Usuario presiona "Nuevo Producto"]
    B --> C[Sistema navega a /inventario/nuevo]
    C --> D[Usuario llena formulario<br/>(Nombre, Precio, Stock)]
    D --> E[Usuario presiona "Guardar"]
    E --> F[Sistema envía POST a API]
    F --> G{¿Respuesta OK?}

    G -- Sí --> H[Muestra notificación "Guardado"]
    H --> I[Redirige a /inventario (Lista)]
    I --> J[Fin del flujo]

    G -- No --> K[Muestra error]
    K --> D
```

---

## Consideraciones Técnicas

- Validar campos en frontend **antes** de enviar el POST.
- El backend debe:
  - Validar datos
  - Retornar códigos HTTP claros (`201`, `400`, `500`)
- Mostrar mensajes de error específicos para mejorar UX.
- Proteger la ruta con autenticación (JWT).

## Tecnologías Referidas

- **Frontend:** JavaScript
- **Backend:** Node.js
- **Base de datos:** MySQL
- **Autenticación:** JWT