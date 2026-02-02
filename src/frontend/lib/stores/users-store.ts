'use client'

import { create } from 'zustand'
import type { User, UserRole } from '@/lib/types'

interface UsersState {
  usuarios: User[]
  isLoading: boolean
  error: string | null
}

interface UsersActions {
  fetchUsuarios: () => Promise<void>
  addUsuario: (usuario: { email: string; password: string; nombre: string; rol: UserRole }) => Promise<boolean>
  updateUsuario: (id: string, usuario: Partial<User>) => Promise<boolean>
  deleteUsuario: (id: string) => Promise<boolean>
  clearError: () => void
}

type UsersStore = UsersState & UsersActions

export const useUsersStore = create<UsersStore>((set, get) => ({
  usuarios: [],
  isLoading: false,
  error: null,

  fetchUsuarios: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      if (response.ok) {
        set({ usuarios: data, isLoading: false })
      } else {
        set({ error: data.message, isLoading: false })
      }
    } catch (error) {
      set({ error: 'Error al cargar usuarios', isLoading: false })
    }
  },

  addUsuario: async (usuario) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
      })
      const data = await response.json()
      if (response.ok) {
        set((state) => ({ usuarios: [...state.usuarios, data], isLoading: false }))
        return true
      } else {
        set({ error: data.message, isLoading: false })
        return false
      }
    } catch (error) {
      set({ error: 'Error al crear usuario', isLoading: false })
      return false
    }
  },

  updateUsuario: async (id, usuario) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
      })
      const data = await response.json()
      if (response.ok) {
        set((state) => ({
          usuarios: state.usuarios.map((u) => (u.id === id ? data : u)),
          isLoading: false,
        }))
        return true
      } else {
        set({ error: data.message, isLoading: false })
        return false
      }
    } catch (error) {
      set({ error: 'Error al actualizar usuario', isLoading: false })
      return false
    }
  },

  deleteUsuario: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/users/${id}`, { method: 'DELETE' })
      if (response.ok) {
        set((state) => ({
          usuarios: state.usuarios.filter((u) => u.id !== id),
          isLoading: false,
        }))
        return true
      } else {
        const data = await response.json()
        set({ error: data.message, isLoading: false })
        return false
      }
    } catch (error) {
      set({ error: 'Error al eliminar usuario', isLoading: false })
      return false
    }
  },

  clearError: () => set({ error: null }),
}))
