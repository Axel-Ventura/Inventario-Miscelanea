'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useInventoryStore } from '@/lib/stores/inventory-store'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Package,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  BoxesIcon,
  DollarSign,
  Users,
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { productos, movimientos, fetchProductos, fetchMovimientos, isLoading } = useInventoryStore()

  useEffect(() => {
    fetchProductos()
    fetchMovimientos()
  }, [fetchProductos, fetchMovimientos])

  // Calcular estadísticas
  const totalProductos = productos.length
  const productosStockBajo = productos.filter((p) => p.stock <= p.stockMinimo)
  const movimientosRecientes = [...movimientos]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  // Calcular valor total del inventario
  const valorInventario = productos.reduce((acc, p) => acc + p.precio * p.stock, 0)

  // Calcular entradas y salidas del mes
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const movimientosMes = movimientos.filter((m) => new Date(m.createdAt) >= startOfMonth)
  const entradasMes = movimientosMes.filter((m) => m.tipo === 'entrada').length
  const salidasMes = movimientosMes.filter((m) => m.tipo === 'salida').length

  // Obtener nombre del producto por ID
  const getProductoNombre = (productoId: string) => {
    const producto = productos.find((p) => p.id === productoId)
    return producto?.nombre || 'Producto no encontrado'
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Encabezado de bienvenida */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Bienvenido, {user?.nombre}
        </h1>
        <p className="text-muted-foreground">
          Resumen general del sistema de inventarios
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        role="region"
        aria-label="Estadísticas generales"
      >
        {/* Total de productos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProductos}</div>
            <p className="text-xs text-muted-foreground">
              productos registrados
            </p>
          </CardContent>
        </Card>

        {/* Valor del inventario */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Valor Inventario</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(valorInventario)}</div>
            <p className="text-xs text-muted-foreground">
              valor total estimado
            </p>
          </CardContent>
        </Card>

        {/* Entradas del mes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Entradas del Mes</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{entradasMes}</div>
            <p className="text-xs text-muted-foreground">
              movimientos de entrada
            </p>
          </CardContent>
        </Card>

        {/* Salidas del mes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Salidas del Mes</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{salidasMes}</div>
            <p className="text-xs text-muted-foreground">
              movimientos de salida
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sección de alertas y tablas */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Productos con stock bajo */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden="true" />
                  Stock Bajo
                </CardTitle>
                <CardDescription>
                  Productos que necesitan reposición
                </CardDescription>
              </div>
              {productosStockBajo.length > 0 && (
                <Badge variant="destructive">
                  {productosStockBajo.length}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {productosStockBajo.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No hay productos con stock bajo
              </p>
            ) : (
              <div className="space-y-3">
                {productosStockBajo.slice(0, 5).map((producto) => (
                  <div
                    key={producto.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200"
                    role="listitem"
                  >
                    <div>
                      <p className="font-medium text-amber-900">{producto.nombre}</p>
                      <p className="text-sm text-amber-700">
                        Stock: {producto.stock} / Mínimo: {producto.stockMinimo}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      asChild
                      className="border-amber-300 text-amber-700 hover:bg-amber-100 bg-transparent"
                    >
                      <Link href={`/productos/${producto.id}/editar`}>
                        Reponer
                      </Link>
                    </Button>
                  </div>
                ))}
                {productosStockBajo.length > 5 && (
                  <Button variant="link" asChild className="w-full">
                    <Link href="/productos?filter=low-stock">
                      Ver todos ({productosStockBajo.length})
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Movimientos recientes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BoxesIcon className="h-5 w-5" aria-hidden="true" />
                  Movimientos Recientes
                </CardTitle>
                <CardDescription>
                  Últimas entradas y salidas de inventario
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {movimientosRecientes.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No hay movimientos registrados
              </p>
            ) : (
              <div className="space-y-3">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movimientosRecientes.map((movimiento) => (
                      <TableRow key={movimiento.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p className="truncate max-w-[150px]">
                              {getProductoNombre(movimiento.productoId)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(movimiento.createdAt)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={movimiento.tipo === 'entrada' ? 'default' : 'secondary'}
                            className={
                              movimiento.tipo === 'entrada'
                                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                : 'bg-orange-100 text-orange-800 hover:bg-orange-100'
                            }
                          >
                            {movimiento.tipo === 'entrada' ? (
                              <TrendingUp className="mr-1 h-3 w-3" aria-hidden="true" />
                            ) : (
                              <TrendingDown className="mr-1 h-3 w-3" aria-hidden="true" />
                            )}
                            {movimiento.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {movimiento.tipo === 'entrada' ? '+' : '-'}
                          {movimiento.cantidad}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button variant="link" asChild className="w-full">
                  <Link href="/inventario">
                    Ver historial completo
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Acciones rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Accesos directos a las funciones más utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/productos/nuevo">
                <Package className="mr-2 h-4 w-4" aria-hidden="true" />
                Nuevo Producto
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/inventario/entrada">
                <TrendingUp className="mr-2 h-4 w-4" aria-hidden="true" />
                Registrar Entrada
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/inventario/salida">
                <TrendingDown className="mr-2 h-4 w-4" aria-hidden="true" />
                Registrar Salida
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/proveedores/nuevo">
                <Users className="mr-2 h-4 w-4" aria-hidden="true" />
                Nuevo Proveedor
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
