'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  BoxesIcon,
  Truck,
  Users,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react'

import { useAuthStore, useIsAdmin } from '@/lib/stores/auth-store'
import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

// Definición de items de navegación
const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Resumen general del sistema',
  },
  {
    title: 'Productos',
    href: '/productos',
    icon: Package,
    description: 'Gestión de productos',
  },
  {
    title: 'Inventario',
    href: '/inventario',
    icon: BoxesIcon,
    description: 'Movimientos de inventario',
  },
  {
    title: 'Proveedores',
    href: '/proveedores',
    icon: Truck,
    description: 'Gestión de proveedores',
  },
]

// Item solo para administradores
const adminItems = [
  {
    title: 'Usuarios',
    href: '/usuarios',
    icon: Users,
    description: 'Gestión de usuarios del sistema',
  },
]

const settingsItems = [
  {
    title: 'Configuración',
    href: '/configuracion',
    icon: Settings,
    description: 'Configuración del perfil',
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const isAdmin = useIsAdmin()

  // Obtener iniciales del usuario para el avatar
  const getInitials = (nombre: string) => {
    return nombre
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <Sidebar collapsible="icon">
      {/* Header del Sidebar */}
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-1">
          {/* <div 
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground"
            aria-hidden="true"
          >
            <Package className="w-4 h-4" />
          </div> */}
          <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">
            Inventario
          </span>
        </div>
      </SidebarHeader>

      {/* Contenido principal del sidebar con navegación */}
      <SidebarContent>
        {/* Navegación principal */}
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu role="navigation" aria-label="Menú principal">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                    tooltip={item.title}
                  >
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? 'page' : undefined}
                      aria-describedby={`nav-${item.title.toLowerCase()}-desc`}
                    >
                      {/* <item.icon aria-hidden="true" /> */}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  <span id={`nav-${item.title.toLowerCase()}-desc`} className="sr-only">
                    {item.description}
                  </span>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sección de administración (solo para admins) */}
        {isAdmin && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Administración</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu role="navigation" aria-label="Menú de administración">
                  {adminItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                        tooltip={item.title}
                      >
                        <Link
                          href={item.href}
                          aria-current={pathname === item.href ? 'page' : undefined}
                          aria-describedby={`nav-${item.title.toLowerCase()}-desc`}
                        >
                          {/* <item.icon aria-hidden="true" /> */}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      <span id={`nav-${item.title.toLowerCase()}-desc`} className="sr-only">
                        {item.description}
                      </span>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* Configuración */}
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu role="navigation" aria-label="Menú de sistema">
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                    tooltip={item.title}
                  >
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? 'page' : undefined}
                    >
                      {/* <item.icon aria-hidden="true" /> */}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer del sidebar con información del usuario */}
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  aria-label={`Menú de usuario: ${user?.nombre}`}
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                      {user?.nombre ? getInitials(user.nombre) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">{user?.nombre}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.rol === 'admin' ? 'Administrador' : 'Usuario'}
                    </span>
                  </div>
                  {/* <ChevronDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" aria-hidden="true" /> */}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                      {user?.nombre ? getInitials(user.nombre) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.nombre}</span>
                    <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/configuracion" className="flex items-center gap-2 cursor-pointer">
                    {/* <Settings className="h-4 w-4" aria-hidden="true" /> */}
                    <span>Configuración</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  {/* <LogOut className="h-4 w-4" aria-hidden="true" /> */}
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
