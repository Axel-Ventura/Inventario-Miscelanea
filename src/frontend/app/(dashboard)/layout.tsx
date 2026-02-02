'use client'

import React from "react"

import { ProtectedRoute } from '@/components/protected-route'
import { AppSidebar } from '@/components/app-sidebar'
import { AppBreadcrumbs } from '@/components/app-breadcrumbs'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Header con trigger del sidebar y breadcrumbs */}
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" aria-label="Abrir o cerrar menú lateral" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <nav aria-label="Breadcrumb">
              <AppBreadcrumbs />
            </nav>
          </header>
          
          {/* Contenido principal */}
          <main className="flex-1 p-4 md:p-6" role="main">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
