'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

/**
 * Página de error global - Error del servidor (500)
 * Captura errores no manejados en la aplicación
 * Accesible con role="alert" para lectores de pantalla
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Registrar el error en consola (en producción se enviaría a un servicio de monitoreo)
    console.error('[v0] Error capturado:', error)
  }, [error])

  return (
    <main 
      className="min-h-screen flex items-center justify-center bg-muted/30 p-4"
      role="main"
      aria-labelledby="error-heading"
    >
      <div 
        className="text-center max-w-md"
        role="alert"
        aria-live="assertive"
      >
        {/* Ilustración del error */}
        <div className="mb-8">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-destructive" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Código de error */}
        <p className="text-6xl font-bold text-destructive mb-2" aria-hidden="true">
          500
        </p>

        {/* Título del error */}
        <h1 id="error-heading" className="text-2xl font-bold tracking-tight mb-2">
          Error del Servidor
        </h1>

        {/* Descripción del error */}
        <p className="text-muted-foreground mb-4">
          Ha ocurrido un error inesperado en el servidor. 
          Nuestro equipo ha sido notificado y estamos trabajando para solucionarlo.
        </p>

        {/* Detalles técnicos (solo en desarrollo) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-6 p-3 rounded-lg bg-destructive/5 border border-destructive/20 text-left">
            <p className="text-xs font-mono text-destructive break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-1">
                ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Intentar de Nuevo
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" aria-hidden="true" />
              Ir al Dashboard
            </Link>
          </Button>
        </div>

        {/* Información de contacto */}
        <p className="text-sm text-muted-foreground mt-8">
          Si el problema persiste, contacta al{' '}
          <a 
            href="mailto:soporte@inventario.com" 
            className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
          >
            equipo de soporte
          </a>
        </p>

        {/* Información adicional accesible */}
        <p className="sr-only">
          Error 500: Ha ocurrido un error en el servidor. 
          Puede intentar recargar la página usando el botón de intentar de nuevo, 
          o navegar al dashboard usando el enlace correspondiente.
        </p>
      </div>
    </main>
  )
}
