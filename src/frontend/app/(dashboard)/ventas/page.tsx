'use client'

import { MOCK_SALES } from '@/lib/mock-data'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Receipt } from 'lucide-react'
import { toast } from 'sonner'

export default function VentasPage() {
  const sales = MOCK_SALES

  const handleNewSale = () => {
    toast.info('Funcion pendiente', {
      description: 'Esta funcion estara disponible cuando se conecte el backend.',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('es-MX', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(dateStr))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completada':
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Completada</Badge>
      case 'pendiente':
        return <Badge variant="secondary">Pendiente</Badge>
      case 'cancelada':
        return <Badge variant="destructive">Cancelada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentMethod = (method: string) => {
    const methods: Record<string, string> = {
      efectivo: 'Efectivo',
      tarjeta: 'Tarjeta',
      transferencia: 'Transferencia',
    }
    return methods[method] || method
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ventas</h1>
          <p className="text-muted-foreground">
            Registro y control de ventas
          </p>
        </div>
        <Button onClick={handleNewSale}>
          <Plus className="mr-2 size-4" />
          Nueva Venta
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(15420.50)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(642.52)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sales table */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Ventas</CardTitle>
          <CardDescription>Ultimas transacciones realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Metodo</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Receipt className="size-4 text-muted-foreground" />
                      #{sale.id}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(sale.fecha)}</TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      <p className="truncate text-sm">
                        {sale.productos.map((p) => p.nombre).join(', ')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sale.productos.length} productos
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{sale.vendedor}</TableCell>
                  <TableCell>{getPaymentMethod(sale.metodoPago)}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(sale.total)}
                  </TableCell>
                  <TableCell>{getStatusBadge(sale.estado)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
