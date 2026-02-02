'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

// Mapeo de rutas a nombres legibles en español
const routeNameMap: Record<string, string> = {
  dashboard: 'Dashboard',
  productos: 'Productos',
  nuevo: 'Nuevo',
  editar: 'Editar',
  inventario: 'Inventario',
  entradas: 'Entradas',
  salidas: 'Salidas',
  proveedores: 'Proveedores',
  usuarios: 'Usuarios',
  configuracion: 'Configuración',
}

/**
 * Componente de breadcrumbs dinámico y accesible
 * Genera automáticamente la navegación basada en la ruta actual
 * Cumple con WCAG 2.1 AA para navegación por teclado
 */
export function AppBreadcrumbs() {
  const pathname = usePathname()

  // Generar segmentos de la ruta
  const segments = pathname.split('/').filter(Boolean)

  // No mostrar breadcrumbs si estamos en la raíz
  if (segments.length === 0) {
    return null
  }

  // Construir los items del breadcrumb
  const breadcrumbItems = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const isLast = index === segments.length - 1
    
    // Obtener el nombre legible o usar el segmento capitalizado
    let name = routeNameMap[segment.toLowerCase()]
    
    // Si es un ID (UUID o número), mostrar un texto genérico
    if (!name && (segment.match(/^[0-9a-f-]{36}$/i) || !isNaN(Number(segment)))) {
      name = 'Detalle'
    }
    
    // Si no hay mapeo, capitalizar el segmento
    if (!name) {
      name = segment.charAt(0).toUpperCase() + segment.slice(1)
    }

    return {
      href,
      name,
      isLast,
    }
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Item de inicio siempre presente */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link 
              href="/dashboard"
              className="flex items-center gap-1 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
              aria-label="Ir a inicio"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only md:not-sr-only">Inicio</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem key={item.href}>
            <BreadcrumbSeparator />
            {item.isLast ? (
              <BreadcrumbPage aria-current="page">
                {item.name}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link 
                  href={item.href}
                  className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
                >
                  {item.name}
                </Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
