// User roles for the inventory system
// 'admin' is used by backend, 'administrador' by frontend - we support both
export type UserRole = 'administrador' | 'admin' | 'vendedor' | 'almacenista' | 'proveedor'

// Helper to normalize role from backend
export const normalizeRole = (role: string): UserRole => {
  if (role === 'admin') return 'administrador'
  return role as UserRole
}

// Helper to check if role is admin (either format)
export const isAdmin = (role: UserRole): boolean => {
  return role === 'admin' || role === 'administrador'
}

// User interface
export interface User {
  id: string
  email: string
  nombre: string
  apellido: string
  rol: UserRole
  activo: boolean
  fechaCreacion: string
  ultimoAcceso?: string
}

// Auth state interface
export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Login credentials
export interface LoginCredentials {
  email: string
  password: string
}

// Auth response from API
export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user: User
    token: string
  }
  error?: string
}

// Navigation item for sidebar
export interface NavItem {
  title: string
  url: string
  icon: string
  roles: UserRole[]
  badge?: number
}

// Product interface
export interface Product {
  id: string
  nombre: string
  descripcion: string
  precio: number
  costo: number
  stock: number
  stockMinimo: number
  categoria: string
  proveedor: string
  activo: boolean
  fechaCreacion: string
  ultimaActualizacion: string
}

// Sale interface
export interface Sale {
  id: string
  productos: SaleItem[]
  total: number
  cliente?: string
  vendedor: string
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia'
  estado: 'completada' | 'pendiente' | 'cancelada'
  fecha: string
}

export interface SaleItem {
  productoId: string
  nombre: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

// Provider interface
export interface Provider {
  id: string
  nombre: string
  contacto: string
  telefono: string
  email: string
  direccion: string
  activo: boolean
}

// Admin permissions (shared by both 'admin' and 'administrador')
const ADMIN_PERMISSIONS = [
  '/dashboard',
  '/ventas',
  '/productos',
  '/inventario',
  '/proveedores',
  '/usuarios',
  '/configuracion',
]

// Route permissions by role
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  administrador: ADMIN_PERMISSIONS,
  admin: ADMIN_PERMISSIONS,
  vendedor: [
    '/dashboard',
    '/ventas',
    '/productos',
  ],
  almacenista: [
    '/dashboard',
    '/productos',
    '/inventario',
    '/proveedores',
  ],
  proveedor: [
    '/dashboard',
    '/productos',
  ],
}

// Role display names
export const ROLE_LABELS: Record<UserRole, string> = {
  administrador: 'Administrador',
  vendedor: 'Vendedor',
  almacenista: 'Almacenista',
  proveedor: 'Proveedor',
}
