'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User, AuthState, LoginCredentials, AuthResponse, UserRole, ROLE_PERMISSIONS } from '../types'

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>
  logout: () => void
  clearError: () => void
  setLoading: (loading: boolean) => void
  checkAuth: () => boolean
  hasPermission: (path: string) => boolean
  hasRole: (roles: UserRole[]) => boolean
}

type AuthStore = AuthState & AuthActions

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          })

          const data: AuthResponse = await response.json()

          if (data.success && data.data) {
            set({
              user: data.data.user,
              token: data.data.token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } else {
            set({
              isLoading: false,
              error: data.error || 'Error al iniciar sesion',
            })
          }

          return data
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error de conexion'
          set({
            isLoading: false,
            error: errorMessage,
          })
          return {
            success: false,
            message: 'Error de conexion',
            error: errorMessage,
          }
        }
      },

      logout: () => {
        set(initialState)
        // Clear any stored session data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage')
        }
      },

      clearError: () => {
        set({ error: null })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      checkAuth: () => {
        const state = get()
        return state.isAuthenticated && !!state.token && !!state.user
      },

      hasPermission: (path: string) => {
        const state = get()
        if (!state.user) return false
        
        const { ROLE_PERMISSIONS } = require('../types')
        const allowedPaths = ROLE_PERMISSIONS[state.user.rol] || []
        
        // Check if the path starts with any allowed path
        return allowedPaths.some((allowedPath: string) => 
          path === allowedPath || path.startsWith(allowedPath + '/')
        )
      },

      hasRole: (roles: UserRole[]) => {
        const state = get()
        if (!state.user) return false
        return roles.includes(state.user.rol)
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Selector hooks for better performance
export const useUser = () => useAuthStore((state) => state.user)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const useAuthLoading = () => useAuthStore((state) => state.isLoading)
export const useAuthError = () => useAuthStore((state) => state.error)
