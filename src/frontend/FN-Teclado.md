## Teclas estándar utilizadas

| Tecla | Función |
|------|--------|
| Tab | Avanzar al siguiente elemento |
| Shift + Tab | Regresar al elemento anterior |
| Enter | Activar botón o enlace |
| Espacio | Seleccionar checkbox |
| Esc | Cerrar modal |
| ↑ ↓ | Navegar listas o menús |
| ← → | Navegar submenús |
| Ctrl + S | Guardar (opcional) |

---

## Flujo 1: Inicio de sesión

```text
Carga página Login
↓
Foco inicial: Campo Email
↓ Tab
Campo Contraseña
↓ Tab
Botón "Iniciar Sesión"
↓ Enter
Validación de credenciales
↓
Dashboard

## Flujo 2: Navegación principal (Menú Lateral)
Dashboard
↓ Tab
Menú lateral
↓ ↓
Productos
Inventario
Proveedores
Configuración
Usuarios (solo Admin)
↓ Enter
Pantalla seleccionada

## Flujo 3: Gestión de Productos (Crear productos)
↓ Tab
Botón "Crear Producto"
↓ Enter
Formulario
↓
Nombre
↓ Tab
Categoría
↓ Tab
Cantidad
↓ Tab
Precio
↓ Tab
Guardar
↓ Enter
Lista de productos actualizada

## Flujo 4: Movimiento de inventario
↓ Tab
Seleccionar Producto (↑ ↓)
↓ Tab
Campo Cantidad
↓ Tab
Confirmar Movimiento
↓ Enter
Stock actualizado

## Flujo 5: Modal de confirmación
Abrir modal
↓
Foco inicial: Confirmar
↓ Tab
Cancelar
↓ Shift + Tab
Confirmar
↓ Enter
Cerrar Modal
↓
Retorno de foco al elemento previo

## Flujo 6: Administración de usuarios (Admin)
Usuarios
↓ Tab
Crear Usuario
↓ Enter
Formulario
↓
Nombre → Email → Rol
↓ Tab
Guardar
↓ Enter
Lista de usuarios

## flujo 7: Cerrar sesión
Configuración
↓ Tab
Cerrar Sesión
↓ Enter
Pantalla Login