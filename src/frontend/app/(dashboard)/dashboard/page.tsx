'use client'

import { useAuthStore } from '@/lib/stores/auth-store'
import { MOCK_DASHBOARD_STATS, MOCK_PRODUCTS } from '@/lib/mock-data'
import { ROLE_LABELS } from '@/lib/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  TrendingUp,
  Users,
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const stats = MOCK_DASHBOARD_STATS
  const lowStockProducts = MOCK_PRODUCTS.filter(p => p.stock < p.stockMinimo)

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Bienvenido, {user?.nombre}
        </h1>
        <p className="text-muted-foreground">
          Panel de control - {user ? ROLE_LABELS[user.rol] : ''}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.ventasHoy)}
            </div>
            <p className="text-xs text-muted-foreground">
              +12.5% respecto a ayer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ventas Semana</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.ventasSemana)}
            </div>
            <p className="text-xs text-muted-foreground">
              +8.2% respecto a semana anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle>
            <ShoppingCart className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productosVendidosHoy}</div>
            <p className="text-xs text-muted-foreground">
              Unidades vendidas hoy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertTriangle className="size-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stats.productosStockBajo}
            </div>
            <p className="text-xs text-muted-foreground">
              Productos por reabastecer
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Low stock alert */}
      {lowStockProducts.length > 0 && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" />
              Alerta de Stock Bajo
            </CardTitle>
            <CardDescription>
              Los siguientes productos necesitan reabastecimiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{product.nombre}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.categoria}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive">
                      {product.stock} / {product.stockMinimo} min
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick stats by role */}
      {user?.rol === 'administrador' && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Ventas del Mes</CardTitle>
              <CardDescription>Resumen de ventas mensual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatCurrency(stats.ventasMes)}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Meta mensual: {formatCurrency(400000)}
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${Math.min((stats.ventasMes / 400000) * 100, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clientes Nuevos</CardTitle>
              <CardDescription>Clientes registrados este mes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                  <Users className="size-6 text-primary" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{stats.clientesNuevos}</div>
                  <p className="text-sm text-muted-foreground">
                    +3 esta semana
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Role-specific content */}
      {user?.rol === 'vendedor' && (
        <Card>
          <CardHeader>
            <CardTitle>Tus Ventas de Hoy</CardTitle>
            <CardDescription>Resumen de tu actividad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border p-4 text-center">
                <p className="text-sm text-muted-foreground">Ventas realizadas</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-sm text-muted-foreground">Total vendido</p>
                <p className="text-2xl font-bold">{formatCurrency(2450)}</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-sm text-muted-foreground">Ticket promedio</p>
                <p className="text-2xl font-bold">{formatCurrency(306.25)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {user?.rol === 'almacenista' && (
        <Card>
          <CardHeader>
            <CardTitle>Estado del Inventario</CardTitle>
            <CardDescription>Resumen general del almacen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border p-4 text-center">
                <p className="text-sm text-muted-foreground">Productos activos</p>
                <p className="text-2xl font-bold">{MOCK_PRODUCTS.length}</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-sm text-muted-foreground">Stock bajo</p>
                <p className="text-2xl font-bold text-destructive">
                  {lowStockProducts.length}
                </p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-sm text-muted-foreground">Pedidos pendientes</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
