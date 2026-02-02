'use client'

import React from "react"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Loader2 } from 'lucide-react'
import type { UserRole } from '@/lib/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

/**
 * Componente de protección de rutas
 * Verifica autenticación y roles de usuario
 * Redirige a login si no está autenticado
 * Redirige a dashboard si no tiene los permisos necesarios
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, user, isLoading } = useAuthStore()

  useEffect(() => {
    // No hacer nada mientras carga
    if (isLoading) return

    // Redirigir a login si no está autenticado
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Verificar permisos de rol si se especificaron
    if (allowedRoles && user && !allowedRoles.includes(user.rol)) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, user, isLoading, allowedRoles, router])

  // Mostrar pantalla de carga mientras verifica autenticación
  if (isLoading || !isAuthenticated) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-background"
        role="status"
        aria-live="polite"
        aria-label="Verificando autenticación"
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Verificar permisos de rol
  if (allowedRoles && user && !allowedRoles.includes(user.rol)) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-background"
        role="alert"
        aria-live="assertive"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-lg font-medium">Acceso denegado</p>
          <p className="text-muted-foreground">No tienes permisos para acceder a esta página</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
