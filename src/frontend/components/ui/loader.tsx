'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const loaderVariants = cva(
  // Animación accesible: solo transform (rotate), sin width/height animados
  'inline-block rounded-full border-2 border-current border-r-transparent animate-spin',
  {
    variants: {
      size: {
        sm: 'size-4',
        default: 'size-6',
        lg: 'size-8',
        xl: 'size-12',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

export interface LoaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loaderVariants> {
  /**
   * Texto descriptivo para lectores de pantalla
   * @default "Cargando..."
   */
  label?: string
  /**
   * Si el loader debe anunciarse a lectores de pantalla como una región viva
   * @default true
   */
  announceToScreenReader?: boolean
}

/**
 * Componente Loader accesible
 * 
 * Características de accesibilidad:
 * - Usa role="status" para indicar un estado de carga
 * - Incluye texto para lectores de pantalla (sr-only)
 * - Respeta prefers-reduced-motion desactivando la animación
 * - Solo anima propiedades seguras (transform: rotate)
 * - Duración de animación dentro del umbral permitido
 */
const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  (
    {
      className,
      size,
      label = 'Cargando...',
      announceToScreenReader = true,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-live={announceToScreenReader ? 'polite' : undefined}
        aria-busy="true"
        className={cn('inline-flex items-center justify-center', className)}
        {...props}
      >
        <div
          className={cn(
            loaderVariants({ size }),
            // Respeta prefers-reduced-motion
            'motion-reduce:animate-none motion-reduce:border-r-current motion-reduce:opacity-70'
          )}
          aria-hidden="true"
        />
        {/* Texto accesible para lectores de pantalla */}
        <span className="sr-only">{label}</span>
      </div>
    )
  }
)
Loader.displayName = 'Loader'

/**
 * Componente LoaderOverlay para mostrar un loader con overlay de fondo
 * 
 * Características de accesibilidad:
 * - Usa aria-hidden en el overlay para que los lectores de pantalla ignoren el fondo
 * - Mantiene el foco visible y no lo bloquea
 * - Animaciones de fade solo con opacity
 */
export interface LoaderOverlayProps extends LoaderProps {
  /**
   * Si el overlay debe mostrarse
   */
  isLoading?: boolean
}

const LoaderOverlay = React.forwardRef<HTMLDivElement, LoaderOverlayProps>(
  ({ isLoading = true, className, ...props }, ref) => {
    if (!isLoading) return null

    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm',
          // Animación accesible: solo opacity
          'animate-in fade-in-0 duration-200',
          // Respeta prefers-reduced-motion
          'motion-reduce:animate-none',
          className
        )}
        // No bloquea la interacción con el documento subyacente para mantener accesibilidad
        aria-hidden="false"
      >
        <Loader size="lg" {...props} />
      </div>
    )
  }
)
LoaderOverlay.displayName = 'LoaderOverlay'

/**
 * Componente LoaderButton para mostrar estado de carga en botones
 */
export interface LoaderButtonContentProps {
  isLoading?: boolean
  children: React.ReactNode
  loadingText?: string
}

function LoaderButtonContent({
  isLoading = false,
  children,
  loadingText,
}: LoaderButtonContentProps) {
  return (
    <>
      {isLoading && (
        <Loader
          size="sm"
          className="mr-2"
          label={loadingText || 'Procesando...'}
          announceToScreenReader={false}
        />
      )}
      <span className={cn(isLoading && 'opacity-0', 'motion-reduce:opacity-100')}>
        {children}
      </span>
      {isLoading && loadingText && (
        <span className="sr-only">{loadingText}</span>
      )}
    </>
  )
}

export { Loader, LoaderOverlay, LoaderButtonContent, loaderVariants }
