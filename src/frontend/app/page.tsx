'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Loader2 } from 'lucide-react'

/**
 * Página principal - Redirige según el estado de autenticación
 */
export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    // Redirigir según el estado de autenticación
    if (isAuthenticated) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  return (
    <main 
      className="min-h-screen flex items-center justify-center bg-background"
      role="status"
      aria-live="polite"
      aria-label="Cargando aplicación"
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    </main>
  )
}
