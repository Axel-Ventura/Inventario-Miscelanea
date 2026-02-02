// Tipos para el sistema de gestión de inventarios

export type UserRole = 'admin' | 'usuario'

export interface User {
  id: string
  email: string
  nombre: string
  rol: UserRole
  createdAt: string
}

export interface Product {
  id: string
  nombre: string
  descripcion: string
  precio: number
  stock: number
  stockMinimo: number
  categoria: string
  proveedorId: string
  createdAt: string
  updatedAt: string
}

export interface Provider {
  id: string
  nombre: string
  email: string
  telefono: string
  direccion: string
  createdAt: string
}

export interface InventoryMovement {
  type: string
  id: string
  productoId: string
  producto?: Product
  tipo: 'entrada' | 'salida'
  cantidad: number
  motivo: string
  usuarioId: string
  usuario?: User
  createdAt: string
}

export interface Sale {
  id: string
  productos: {
    productoId: string
    producto?: Product
    cantidad: number
    precioUnitario: number
  }[]
  total: number
  usuarioId: string
  usuario?: User
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiError {
  message: string
  status: number
}
