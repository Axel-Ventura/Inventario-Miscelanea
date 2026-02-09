'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useInventoryStore } from '@/lib/stores/inventory-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BoxesIcon,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Loader2,
  Plus,
} from 'lucide-react'

export default function InventarioPage() {
  const { productos, movimientos, fetchProductos, fetchMovimientos, isLoading } = useInventoryStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [tipoFilter, setTipoFilter] = useState<string>('all')

  useEffect(() => {
    fetchProductos()
    fetchMovimientos()
  }, [fetchProductos, fetchMovimientos])

  // Obtener nombre del producto por ID
  const getProductoNombre = (productoId: string) => {
    const producto = productos.find((p) => p.id === productoId)
    return producto?.nombre || 'Producto no encontrado'
  }

  // Filtrar movimientos
  const filteredMovimientos = [...movimientos]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .filter((mov) => {
      const productoNombre = getProductoNombre(mov.productoId).toLowerCase()
      const matchesSearch = 
        productoNombre.includes(searchTerm.toLowerCase()) ||
        mov.motivo.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesTipo = tipoFilter === 'all' || mov.tipo === tipoFilter
      
      return matchesSearch && matchesTipo
    })

  // Estadísticas
  const totalEntradas = movimientos.filter((m) => m.tipo === 'entrada').reduce((acc, m) => acc + m.cantidad, 0)
  const totalSalidas = movimientos.filter((m) => m.tipo === 'salida').reduce((acc, m) => acc + m.cantidad, 0)

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground">
            Gestiona las entradas y salidas del inventario
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/inventario/entrada">
              <TrendingUp className="mr-2 h-4 w-4" aria-hidden="true" />
              Nueva Entrada
            </Link>
          </Button>
          <Button asChild>
            <Link href="/inventario/salida">
              <TrendingDown className="mr-2 h-4 w-4" aria-hidden="true" />
              Nueva Salida
            </Link>
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Movimientos</CardTitle>
            <BoxesIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{movimientos.length}</div>
            <p className="text-xs text-muted-foreground">
              movimientos registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Entradas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{totalEntradas}</div>
            <p className="text-xs text-muted-foreground">
              unidades ingresadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Salidas</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">-{totalSalidas}</div>
            <p className="text-xs text-muted-foreground">
              unidades retiradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" aria-hidden="true" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Búsqueda */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                placeholder="Buscar por producto o motivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                aria-label="Buscar movimientos"
              />
            </div>

            {/* Filtro por tipo */}
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filtrar por tipo">
                <SelectValue placeholder="Tipo de movimiento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="entrada">Solo entradas</SelectItem>
                <SelectItem value="salida">Solo salidas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de movimientos */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Movimientos</CardTitle>
          <CardDescription>
            {filteredMovimientos.length} movimiento{filteredMovimientos.length !== 1 ? 's' : ''} encontrado{filteredMovimientos.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-label="Cargando movimientos" />
            </div>
          ) : filteredMovimientos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BoxesIcon className="h-12 w-12 text-muted-foreground mb-4" aria-hidden="true" />
              <h3 className="font-medium text-lg">No hay movimientos registrados</h3>
              <p className="text-muted-foreground">
                {searchTerm || tipoFilter !== 'all'
                  ? 'Prueba ajustando los filtros de búsqueda'
                  : 'Comienza registrando una entrada o salida'}
              </p>
              {!searchTerm && tipoFilter === 'all' && (
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" asChild>
                    <Link href="/inventario/entrada">
                      <TrendingUp className="mr-2 h-4 w-4" aria-hidden="true" />
                      Nueva Entrada
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/inventario/salida">
                      <TrendingDown className="mr-2 h-4 w-4" aria-hidden="true" />
                      Nueva Salida
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovimientos.map((movimiento) => (
                    <TableRow key={movimiento.id}>
                      <TableCell className="text-muted-foreground">
                        {formatDate(movimiento.createdAt)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {getProductoNombre(movimiento.productoId)}
                      </TableCell>
                      <TableCell>
                        <Badge
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
                          {movimiento.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {movimiento.motivo}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`font-medium ${
                            movimiento.tipo === 'entrada' ? 'text-green-600' : 'text-orange-600'
                          }`}
                        >
                          {movimiento.tipo === 'entrada' ? '+' : '-'}
                          {movimiento.cantidad}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
