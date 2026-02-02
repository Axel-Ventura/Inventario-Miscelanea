'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole } from '@/lib/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, nombre: string) => Promise<boolean>
  logout: () => void
  clearError: () => void
  setLoading: (loading: boolean) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Iniciar sesión
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })

          const data = await response.json()

          if (!response.ok) {
            set({ error: data.message || 'Error al iniciar sesión', isLoading: false })
            return false
          }

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          return true
        } catch (error) {
          set({ error: 'Error de conexión', isLoading: false })
          return false
        }
      },

      // Registrar usuario
      register: async (email: string, password: string, nombre: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, nombre }),
          })

          const data = await response.json()

          if (!response.ok) {
            set({ error: data.message || 'Error al registrar', isLoading: false })
            return false
          }

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          return true
        } catch (error) {
          set({ error: 'Error de conexión', isLoading: false })
          return false
        }
      },

      // Cerrar sesión
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
      },

      // Limpiar error
      clearError: () => set({ error: null }),

      // Establecer estado de carga
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Selector para verificar si el usuario es admin
export const useIsAdmin = () => useAuthStore((state) => state.user?.rol === 'admin')
