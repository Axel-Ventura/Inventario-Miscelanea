// Datos de prueba para el sistema de inventarios
import type { User, Product, Provider, InventoryMovement, Sale } from './types'

// Usuarios de prueba (password: 123456)
export const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@inventario.com',
    password: '123456',
    nombre: 'Administrador',
    rol: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'usuario@inventario.com',
    password: '123456',
    nombre: 'Usuario Normal',
    rol: 'usuario',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '3',
    email: 'maria@inventario.com',
    password: '123456',
    nombre: 'María García',
    rol: 'usuario',
    createdAt: '2024-02-01T00:00:00Z',
  },
]

// Proveedores de prueba
export const mockProviders: Provider[] = [
  {
    id: '1',
    nombre: 'Distribuidora Central',
    email: 'contacto@distribuidoracentral.com',
    telefono: '+52 55 1234 5678',
    direccion: 'Av. Principal 123, Ciudad de México',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    nombre: 'Suministros del Norte',
    email: 'ventas@suministrosnorte.com',
    telefono: '+52 81 9876 5432',
    direccion: 'Calle Industrial 456, Monterrey',
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '3',
    nombre: 'Importadora Global',
    email: 'info@importadoraglobal.com',
    telefono: '+52 33 5555 1234',
    direccion: 'Blvd. Comercial 789, Guadalajara',
    createdAt: '2024-01-20T00:00:00Z',
  },
]

// Productos de prueba
export const mockProducts: Product[] = [
  {
    id: '1',
    nombre: 'Laptop HP ProBook',
    descripcion: 'Laptop profesional 15.6" i5 8GB RAM',
    precio: 15999.00,
    stock: 25,
    stockMinimo: 5,
    categoria: 'Electrónica',
    proveedorId: '1',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: '2',
    nombre: 'Monitor Dell 24"',
    descripcion: 'Monitor Full HD IPS 24 pulgadas',
    precio: 4599.00,
    stock: 3,
    stockMinimo: 10,
    categoria: 'Electrónica',
    proveedorId: '1',
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z',
  },
  {
    id: '3',
    nombre: 'Teclado Mecánico RGB',
    descripcion: 'Teclado mecánico switches rojos',
    precio: 1299.00,
    stock: 50,
    stockMinimo: 15,
    categoria: 'Periféricos',
    proveedorId: '2',
    createdAt: '2024-01-07T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '4',
    nombre: 'Mouse Inalámbrico',
    descripcion: 'Mouse ergonómico Bluetooth',
    precio: 599.00,
    stock: 8,
    stockMinimo: 20,
    categoria: 'Periféricos',
    proveedorId: '2',
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z',
  },
  {
    id: '5',
    nombre: 'Silla Ejecutiva',
    descripcion: 'Silla ergonómica con soporte lumbar',
    precio: 3499.00,
    stock: 12,
    stockMinimo: 5,
    categoria: 'Mobiliario',
    proveedorId: '3',
    createdAt: '2024-01-09T00:00:00Z',
    updatedAt: '2024-01-19T00:00:00Z',
  },
  {
    id: '6',
    nombre: 'Escritorio Ajustable',
    descripcion: 'Escritorio standing desk eléctrico',
    precio: 8999.00,
    stock: 2,
    stockMinimo: 3,
    categoria: 'Mobiliario',
    proveedorId: '3',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-21T00:00:00Z',
  },
  {
    id: '7',
    nombre: 'Webcam HD 1080p',
    descripcion: 'Cámara web con micrófono integrado',
    precio: 899.00,
    stock: 30,
    stockMinimo: 10,
    categoria: 'Periféricos',
    proveedorId: '1',
    createdAt: '2024-01-11T00:00:00Z',
    updatedAt: '2024-01-17T00:00:00Z',
  },
  {
    id: '8',
    nombre: 'Cable HDMI 2m',
    descripcion: 'Cable HDMI 2.1 alta velocidad',
    precio: 199.00,
    stock: 100,
    stockMinimo: 25,
    categoria: 'Accesorios',
    proveedorId: '2',
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z',
  },
]

// Movimientos de inventario de prueba
export const mockMovements: InventoryMovement[] = [
  {
    id: '1',
    productoId: '1',
    tipo: 'entrada',
    cantidad: 30,
    motivo: 'Compra inicial de inventario',
    usuarioId: '1',
    createdAt: '2024-01-05T10:00:00Z',
    type: ''
  },
  {
    id: '2',
    productoId: '2',
    tipo: 'entrada',
    cantidad: 15,
    motivo: 'Reposición de stock',
    usuarioId: '1',
    createdAt: '2024-01-06T11:30:00Z',
    type: ''
  },
  {
    id: '3',
    productoId: '1',
    tipo: 'salida',
    cantidad: 5,
    motivo: 'Venta a cliente mayorista',
    usuarioId: '2',
    createdAt: '2024-01-10T14:00:00Z',
    type: ''
  },
  {
    id: '4',
    productoId: '3',
    tipo: 'entrada',
    cantidad: 60,
    motivo: 'Pedido nuevo proveedor',
    usuarioId: '1',
    createdAt: '2024-01-12T09:00:00Z',
    type: ''
  },
  {
    id: '5',
    productoId: '2',
    tipo: 'salida',
    cantidad: 12,
    motivo: 'Venta tienda física',
    usuarioId: '2',
    createdAt: '2024-01-15T16:30:00Z',
    type: ''
  },
  {
    id: '6',
    productoId: '4',
    tipo: 'entrada',
    cantidad: 25,
    motivo: 'Restock mensual',
    usuarioId: '1',
    createdAt: '2024-01-18T08:00:00Z',
    type: ''
  },
  {
    id: '7',
    productoId: '4',
    tipo: 'salida',
    cantidad: 17,
    motivo: 'Pedido online',
    usuarioId: '3',
    createdAt: '2024-01-20T12:00:00Z',
    type: ''
  },
  {
    id: '8',
    productoId: '6',
    tipo: 'salida',
    cantidad: 3,
    motivo: 'Venta corporativa',
    usuarioId: '2',
    createdAt: '2024-01-22T15:00:00Z',
    type: ''
  },
]

// Ventas de prueba
export const mockSales: Sale[] = [
  {
    id: '1',
    productos: [
      { productoId: '1', cantidad: 2, precioUnitario: 15999.00 },
      { productoId: '3', cantidad: 2, precioUnitario: 1299.00 },
    ],
    total: 34596.00,
    usuarioId: '2',
    createdAt: '2024-01-10T14:00:00Z',
  },
  {
    id: '2',
    productos: [
      { productoId: '2', cantidad: 5, precioUnitario: 4599.00 },
    ],
    total: 22995.00,
    usuarioId: '2',
    createdAt: '2024-01-15T16:30:00Z',
  },
  {
    id: '3',
    productos: [
      { productoId: '5', cantidad: 3, precioUnitario: 3499.00 },
      { productoId: '6', cantidad: 2, precioUnitario: 8999.00 },
    ],
    total: 28495.00,
    usuarioId: '3',
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '4',
    productos: [
      { productoId: '7', cantidad: 10, precioUnitario: 899.00 },
      { productoId: '8', cantidad: 10, precioUnitario: 199.00 },
    ],
    total: 10980.00,
    usuarioId: '2',
    createdAt: '2024-01-22T11:00:00Z',
  },
]

// Helpers para obtener productos con stock bajo
export const getLowStockProducts = () => 
  mockProducts.filter(p => p.stock <= p.stockMinimo)

// Helper para obtener movimientos recientes
export const getRecentMovements = (limit = 5) =>
  [...mockMovements].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, limit)
