'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Warehouse,
  Truck,
  Users,
  Settings,
  LogOut,
  Store,
  ChevronUp,
} from 'lucide-react'

import { useAuthStore } from '@/lib/stores/auth-store'
import { ROLE_PERMISSIONS, ROLE_LABELS, type UserRole } from '@/lib/types'
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
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

// Navigation items with icons and role permissions
const navigationItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    roles: ['administrador', 'vendedor', 'almacenista', 'proveedor'] as UserRole[],
  },
  {
    title: 'Ventas',
    url: '/ventas',
    icon: ShoppingCart,
    roles: ['administrador', 'vendedor'] as UserRole[],
  },
  {
    title: 'Productos',
    url: '/productos',
    icon: Package,
    roles: ['administrador', 'vendedor', 'almacenista', 'proveedor'] as UserRole[],
  },
  {
    title: 'Inventario',
    url: '/inventario',
    icon: Warehouse,
    roles: ['administrador', 'almacenista'] as UserRole[],
  },
  {
    title: 'Proveedores',
    url: '/proveedores',
    icon: Truck,
    roles: ['administrador', 'almacenista'] as UserRole[],
  },
  {
    title: 'Usuarios',
    url: '/usuarios',
    icon: Users,
    roles: ['administrador'] as UserRole[],
  },
  {
    title: 'Configuracion',
    url: '/configuracion',
    icon: Settings,
    roles: ['administrador'] as UserRole[],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter((item) => {
    if (!user) return false
    return item.roles.includes(user.rol)
  })

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                  <Store className="size-4 text-primary-foreground" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Miscelanea</span>
                  <span className="text-xs text-muted-foreground">
                    Sistema de Inventario
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => {
                const isActive = pathname === item.url || pathname.startsWith(item.url + '/')
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user ? getInitials(user.nombre, user.apellido) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col gap-0.5 text-left leading-tight">
                    <span className="truncate text-sm font-semibold">
                      {user ? `${user.nombre} ${user.apellido}` : 'Usuario'}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user ? ROLE_LABELS[user.rol] : 'Sin rol'}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                side="top"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">
                      {user ? `${user.nombre} ${user.apellido}` : 'Usuario'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user?.rol === 'administrador' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/configuracion">
                        <Settings className="mr-2 size-4" />
                        Configuracion
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 size-4" />
                  Cerrar sesion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
