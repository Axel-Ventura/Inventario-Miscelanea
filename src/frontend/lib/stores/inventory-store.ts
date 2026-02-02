'use client'

import { create } from 'zustand'
import type { Product, InventoryMovement, Provider, Sale } from '@/lib/types'

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
      const response = await fetch('/api/products')
      const data = await response.json()
      if (response.ok) {
        set({ productos: data, isLoading: false })
      } else {
        set({ error: data.message, isLoading: false })
      }
    } catch (error) {
      set({ error: 'Error al cargar productos', isLoading: false })
    }
  },

  addProducto: async (producto) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto),
      })
      const data = await response.json()
      if (response.ok) {
        set((state) => ({ productos: [...state.productos, data], isLoading: false }))
        return true
      } else {
        set({ error: data.message, isLoading: false })
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
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
        set({ error: data.message, isLoading: false })
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
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (response.ok) {
        set((state) => ({
          productos: state.productos.filter((p) => p.id !== id),
          isLoading: false,
        }))
        return true
      } else {
        const data = await response.json()
        set({ error: data.message, isLoading: false })
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
      const response = await fetch('/api/inventory')
      const data = await response.json()
      if (response.ok) {
        set({ movimientos: data, isLoading: false })
      } else {
        set({ error: data.message, isLoading: false })
      }
    } catch (error) {
      set({ error: 'Error al cargar movimientos', isLoading: false })
    }
  },

  addMovimiento: async (movimiento) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        set({ error: data.message, isLoading: false })
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
      const response = await fetch('/api/providers')
      const data = await response.json()
      if (response.ok) {
        set({ proveedores: data, isLoading: false })
      } else {
        set({ error: data.message, isLoading: false })
      }
    } catch (error) {
      set({ error: 'Error al cargar proveedores', isLoading: false })
    }
  },

  addProveedor: async (proveedor) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proveedor),
      })
      const data = await response.json()
      if (response.ok) {
        set((state) => ({ proveedores: [...state.proveedores, data], isLoading: false }))
        return true
      } else {
        set({ error: data.message, isLoading: false })
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
      const response = await fetch(`/api/providers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
        set({ error: data.message, isLoading: false })
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
      const response = await fetch(`/api/providers/${id}`, { method: 'DELETE' })
      if (response.ok) {
        set((state) => ({
          proveedores: state.proveedores.filter((p) => p.id !== id),
          isLoading: false,
        }))
        return true
      } else {
        const data = await response.json()
        set({ error: data.message, isLoading: false })
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
      const response = await fetch('/api/sales')
      const data = await response.json()
      if (response.ok) {
        set({ ventas: data, isLoading: false })
      } else {
        set({ error: data.message, isLoading: false })
      }
    } catch (error) {
      set({ error: 'Error al cargar ventas', isLoading: false })
    }
  },

  // Utilidades
  clearError: () => set({ error: null }),
}))
