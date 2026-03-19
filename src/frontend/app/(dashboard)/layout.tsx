'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'
import { ROLE_PERMISSIONS } from '@/lib/types'
import { AppSidebar } from '@/components/app-sidebar'
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

// Map paths to readable names
const pathNames: Record<string, string> = {
  dashboard: 'Dashboard',
  ventas: 'Ventas',
  productos: 'Productos',
  inventario: 'Inventario',
  proveedores: 'Proveedores',
  usuarios: 'Usuarios',
  configuracion: 'Configuracion',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user, checkAuth } = useAuthStore()

  // Auth protection
  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login')
      return
    }

    // Role-based access control
    if (user) {
      const allowedPaths = ROLE_PERMISSIONS[user.rol] || []
      const currentBasePath = '/' + pathname.split('/')[1]
      
      if (!allowedPaths.some(path => 
        currentBasePath === path || pathname.startsWith(path + '/')
      )) {
        router.push('/dashboard')
      }
    }
  }, [isAuthenticated, user, pathname, router, checkAuth])

  // Generate breadcrumbs from pathname
  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/')
    const name = pathNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
    const isLast = index === pathSegments.length - 1
    
    return { path, name, isLast }
  })

  // Show loading while checking auth
  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <BreadcrumbItem key={crumb.path}>
                  {index > 0 && <BreadcrumbSeparator />}
                  {crumb.isLast ? (
                    <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.path}>{crumb.name}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
