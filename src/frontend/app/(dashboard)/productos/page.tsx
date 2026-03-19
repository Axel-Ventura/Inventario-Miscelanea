'use client'

import { useState } from 'react'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
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
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import { toast } from 'sonner'

export default function ProductosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const products = MOCK_PRODUCTS

  const filteredProducts = products.filter(
    (product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddProduct = () => {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
          <p className="text-muted-foreground">
            Gestiona el catalogo de productos
          </p>
        </div>
        <Button onClick={handleAddProduct}>
          <Plus className="mr-2 size-4" />
          Agregar Producto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Catalogo de Productos</CardTitle>
              <CardDescription>
                {filteredProducts.length} productos encontrados
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.nombre}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.descripcion}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{product.categoria}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(product.precio)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        product.stock < product.stockMinimo
                          ? 'font-medium text-destructive'
                          : ''
                      }
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    {product.stock < product.stockMinimo ? (
                      <Badge variant="destructive">Stock bajo</Badge>
                    ) : (
                      <Badge variant="secondary">Disponible</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
