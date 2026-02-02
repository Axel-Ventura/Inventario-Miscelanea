'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Search } from 'lucide-react'

/**
 * Página de error 404 - Ruta no encontrada
 * Accesible con role="alert" para lectores de pantalla
 */
export default function NotFound() {
  return (
    <main 
      className="min-h-screen flex items-center justify-center bg-muted/30 p-4"
      role="main"
      aria-labelledby="error-heading"
    >
      <div 
        className="text-center max-w-md"
        role="alert"
        aria-live="polite"
      >
        {/* Ilustración del error */}
        <div className="mb-8">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
              <span className="text-destructive font-bold text-sm" aria-hidden="true">?</span>
            </div>
          </div>
        </div>

        {/* Código de error */}
        <p className="text-6xl font-bold text-primary mb-2" aria-hidden="true">
          404
        </p>

        {/* Título del error */}
        <h1 id="error-heading" className="text-2xl font-bold tracking-tight mb-2">
          Página no encontrada
        </h1>

        {/* Descripción del error */}
        <p className="text-muted-foreground mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida. 
          Verifica la URL o regresa al inicio.
        </p>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" aria-hidden="true" />
              Ir al Dashboard
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Volver Atrás
          </Button>
        </div>

        {/* Información adicional accesible */}
        <p className="sr-only">
          Error 404: La página solicitada no fue encontrada. 
          Use los botones anteriores para navegar al dashboard o regresar a la página anterior.
        </p>
      </div>
    </main>
  )
}
