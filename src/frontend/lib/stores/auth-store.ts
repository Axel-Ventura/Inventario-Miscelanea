'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiUrl } from '@/lib/api-base'
import { broadcastAuthLogout, broadcastAuthLogin } from '@/lib/auth-broadcast'
import type { User } from '@/lib/types'

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
  logout: () => Promise<void>
  /** Solo limpia cliente (otras pestañas / 401). */
  logoutLocalOnly: () => void
  logoutAllSessions: () => Promise<boolean>
  clearError: () => void
  setLoading: (loading: boolean) => void
  checkAuth: () => void
}

type AuthStore = AuthState & AuthActions

const fetchOpts = { credentials: 'include' as const }

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      logoutLocalOnly: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null })

        try {
          const res = await fetch(apiUrl('/api/auth/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            ...fetchOpts,
          })

          const data = await res.json()

          if (!res.ok) {
            set({ error: data.message ?? 'Error al iniciar sesión', isLoading: false })
            return false
          }

          localStorage.setItem('token', data.token)

          set({
            user: data.user ?? null,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          })

          broadcastAuthLogin()
          return true
        } catch {
          set({
            error: 'Error al conectar con el servidor',
            isLoading: false,
          })
          return false
        }
      },

      register: async (email: string, password: string, nombre: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(apiUrl('/api/auth/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, nombre }),
            ...fetchOpts,
          })

          const data = await response.json()

          if (!response.ok) {
            set({ error: data.message || 'Error al registrar', isLoading: false })
            return false
          }

          localStorage.setItem('token', data.token)

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          broadcastAuthLogin()
          return true
        } catch {
          set({ error: 'Error de conexión', isLoading: false })
          return false
        }
      },

      logout: async () => {
        const token =
          typeof window !== 'undefined' ? localStorage.getItem('token') : null

        try {
          await fetch(apiUrl('/api/auth/logout'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            ...fetchOpts,
          })
        } catch {
          /* ignore */
        }

        broadcastAuthLogout()
        get().logoutLocalOnly()
      },

      logoutAllSessions: async () => {
        const token =
          typeof window !== 'undefined' ? localStorage.getItem('token') : null
        if (!token) {
          get().logoutLocalOnly()
          return false
        }
        try {
          const res = await fetch(apiUrl('/api/auth/logout-all'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            ...fetchOpts,
          })
          if (res.ok) {
            broadcastAuthLogout()
            get().logoutLocalOnly()
          }
          return res.ok
        } catch {
          return false
        }
      },

      clearError: () => set({ error: null }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      checkAuth: () => {
        if (typeof window === 'undefined') return
      },
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

export const useIsAdmin = () => useAuthStore((state) => state.user?.rol === 'admin')
