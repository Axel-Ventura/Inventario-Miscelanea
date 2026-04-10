'use client'

import { create } from 'zustand'
import type { Product, InventoryMovement, Provider, Sale } from '@/lib/types'
import { apiFetch } from '@/lib/api-client'

function errMsg(data: unknown, fallback: string): string {
  if (data && typeof data === 'object' && 'message' in data && typeof (data as { message: string }).message === 'string') {
    return (data as { message: string }).message
  }
  if (data && typeof data === 'object' && 'error' in data && typeof (data as { error: string }).error === 'string') {
    return (data as { error: string }).error
  }
  return fallback
}

interface InventoryState {
  productos: Product[]
  movimientos: InventoryMovement[]
  proveedores: Provider[]
  ventas: Sale[]
  isLoading: boolean
  error: string | null
}

interface InventoryActions {
  // Productos
  fetchProductos: () => Promise<void>
  addProducto: (producto: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>
  updateProducto: (id: string, producto: Partial<Product>) => Promise<boolean>
  deleteProducto: (id: string) => Promise<boolean>

  // Movimientos de inventario
  fetchMovimientos: () => Promise<void>
  addMovimiento: (movimiento: { productoId: string; tipo: 'entrada' | 'salida'; cantidad: number; motivo: string }) => Promise<boolean>

  // Proveedores
  fetchProveedores: () => Promise<void>
  addProveedor: (proveedor: Omit<Provider, 'id' | 'createdAt'>) => Promise<boolean>
  updateProveedor: (id: string, proveedor: Partial<Provider>) => Promise<boolean>
  deleteProveedor: (id: string) => Promise<boolean>

  // Ventas
  fetchVentas: () => Promise<void>
  addVenta: (
    lineas: { productoId: string; cantidad: number; precioUnitario: number }[]
  ) => Promise<boolean>

  // Utilidades
  clearError: () => void
}

type InventoryStore = InventoryState & InventoryActions

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  // Estado inicial
  productos: [],
  movimientos: [],
  proveedores: [],
  ventas: [],
  isLoading: false,
  error: null,

  // Productos
  fetchProductos: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiFetch('/api/products')
      const data = await response.json()
      if (response.ok) {
        set({ productos: data, isLoading: false })
      } else {
        set({ error: errMsg(data, 'Error al cargar productos'), isLoading: false })
      }
    } catch (error) {
      set({ error: 'Error al cargar productos', isLoading: false })
    }
  },

  addProducto: async (producto) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiFetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(producto),
      })
      const data = await response.json()
      if (response.ok) {
        set((state) => ({ productos: [...state.productos, data], isLoading: false }))
        return true
      } else {
        set({ error: errMsg(data, 'Error al crear producto'), isLoading: false })
        return false
      }
    } catch (error) {
      set({ error: 'Error al crear producto', isLoading: false })
      return false
    }
  },

  updateProducto: async (id, producto) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiFetch(`/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(producto),
      })
      const data = await response.json()
      if (response.ok) {
        set((state) => ({
          productos: state.productos.map((p) => (p.id === id ? data : p)),
          isLoading: false,
        }))
        return true
      } else {
        set({ error: errMsg(data, 'Error al actualizar producto'), isLoading: false })
        return false
      }
    } catch (error) {
      set({ error: 'Error al actualizar producto', isLoading: false })
      return false
    }
  },

  deleteProducto: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiFetch(`/api/products/${id}`, { method: 'DELETE' })
      if (response.ok) {
        set((state) => ({
          productos: state.productos.filter((p) => p.id !== id),
          isLoading: false,
        }))
        return true
      } else {
        const data = await response.json()
        set({ error: errMsg(data, 'Error al eliminar producto'), isLoading: false })
        return false
      }
    } catch (error) {
      set({ error: 'Error al eliminar producto', isLoading: false })
      return false
    }
  },

  // Movimientos
  fetchMovimientos: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiFetch('/api/inventory')
      const data = await response.json()
      if (response.ok) {
        set({ movimientos: data, isLoading: false })
      } else {
        set({ error: errMsg(data, 'Error al cargar movimientos'), isLoading: false })
      }
    } catch (error) {
      set({ error: 'Error al cargar movimientos', isLoading: false })
    }
  },

  addMovimiento: async (movimiento) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiFetch('/api/inventory', {
        method: 'POST',
        body: JSON.stringify(movimiento),
      })
      const data = await response.json()
      if (response.ok) {
        set((state) => ({ 
          movimientos: [data.movimiento, ...state.movimientos],
          productos: state.productos.map((p) => 
            p.id === movimiento.productoId ? { ...p, stock: data.nuevoStock } : p
          ),
          isLoading: false 
        }))
        return true
      } else {
        set({ error: errMsg(data, 'Error al registrar movimiento'), isLoading: false })
        return false
      }
    } catch (error) {
      set({ error: 'Error al registrar movimiento', isLoading: false })
      return false
    }
  },

  // Proveedores
  fetchProveedores: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiFetch('/api/providers')
      const data = await response.json()
      if (response.ok) {
        set({ proveedores: data, isLoading: false })
      } else {
        set({ error: errMsg(data, 'Error al cargar proveedores'), isLoading: false })
      }
    } catch (error) {
      set({ error: 'Error al cargar proveedores', isLoading: false })
    }
  },

  addProveedor: async (proveedor) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiFetch('/api/providers', {
        method: 'POST',
        body: JSON.stringify(proveedor),
      })
      const data = await response.json()
      if (response.ok) {
        set((state) => ({ proveedores: [...state.proveedores, data], isLoading: false }))
        return true
      } else {
        set({ error: errMsg(data, 'Error al crear proveedor'), isLoading: false })
        return false
      }
    } catch (error) {
      set({ error: 'Error al crear proveedor', isLoading: false })
      return false
    }
  },

  updateProveedor: async (id, proveedor) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiFetch(`/api/providers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(proveedor),
      })
      const data = await response.json()
      if (response.ok) {
        set((state) => ({
          proveedores: state.proveedores.map((p) => (p.id === id ? data : p)),
          isLoading: false,
        }))
        return true
      } else {
        set({ error: errMsg(data, 'Error al actualizar proveedor'), isLoading: false })
        return false
      }
    } catch (error) {
      set({ error: 'Error al actualizar proveedor', isLoading: false })
      return false
    }
  },

  deleteProveedor: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiFetch(`/api/providers/${id}`, { method: 'DELETE' })
      if (response.ok) {
        set((state) => ({
          proveedores: state.proveedores.filter((p) => p.id !== id),
          isLoading: false,
        }))
        return true
      } else {
        const data = await response.json()
        set({ error: errMsg(data, 'Error al eliminar proveedor'), isLoading: false })
        return false
      }
    } catch (error) {
      set({ error: 'Error al eliminar proveedor', isLoading: false })
      return false
    }
  },

  // Ventas
  fetchVentas: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiFetch('/api/sales')
      const data = await response.json()
      if (response.ok) {
        set({ ventas: data, isLoading: false })
      } else {
        set({ error: errMsg(data, 'Error al cargar ventas'), isLoading: false })
      }
    } catch (error) {
      set({ error: 'Error al cargar ventas', isLoading: false })
    }
  },

  addVenta: async (lineas) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiFetch('/api/sales', {
        method: 'POST',
        body: JSON.stringify({ productos: lineas }),
      })
      const data = await response.json()
      if (response.ok) {
        set((state) => ({
          ventas: [data as Sale, ...state.ventas],
          productos: state.productos.map((p) => {
            const line = lineas.find((l) => l.productoId === p.id)
            if (!line) return p
            return { ...p, stock: Math.max(0, p.stock - line.cantidad) }
          }),
          isLoading: false,
        }))
        return true
      }
      set({ error: errMsg(data, 'Error al registrar la venta'), isLoading: false })
      return false
    } catch (error) {
      set({ error: 'Error al registrar la venta', isLoading: false })
      return false
    }
  },

  // Utilidades
  clearError: () => set({ error: null }),
}))
