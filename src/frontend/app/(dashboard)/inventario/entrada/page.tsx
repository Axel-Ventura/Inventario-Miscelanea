'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useInventoryStore } from '@/lib/stores/inventory-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Loader2, AlertCircle, TrendingUp, Package } from 'lucide-react'

export default function EntradaInventarioPage() {
  const router = useRouter()
  const { productos, fetchProductos, addMovimiento, isLoading, error, clearError } = useInventoryStore()

  const [formData, setFormData] = useState({
    productoId: '',
    cantidad: '',
    motivo: '',
  })

  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    fetchProductos()
    clearError()
  }, [fetchProductos, clearError])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setValidationError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')

    // Validaciones
    if (!formData.productoId) {
      setValidationError('Selecciona un producto')
      return
    }

    const cantidad = parseInt(formData.cantidad)
    if (isNaN(cantidad) || cantidad <= 0) {
      setValidationError('La cantidad debe ser un número mayor a 0')
      return
    }

    if (!formData.motivo.trim()) {
      setValidationError('El motivo es requerido')
      return
    }

    const success = await addMovimiento({
      productoId: formData.productoId,
      tipo: 'entrada',
      cantidad,
      motivo: formData.motivo.trim(),
    })

    if (success) {
      router.push('/inventario')
    }
  }

  // Obtener producto seleccionado
  const productoSeleccionado = productos.find((p) => p.id === formData.productoId)

  const displayError = validationError || error

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/inventario" aria-label="Volver a inventario">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Registrar Entrada</h1>
          <p className="text-muted-foreground">
            Agrega unidades al inventario de un producto
          </p>
        </div>
      </div>

      {/* Formulario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" aria-hidden="true" />
            Entrada de Inventario
          </CardTitle>
          <CardDescription>
            Registra la entrada de productos al almacén
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mensaje de error */}
            {displayError && (
              <Alert variant="destructive" role="alert" aria-live="polite">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                <AlertDescription>{displayError}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Producto */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="producto">Producto *</Label>
                <Select
                  value={formData.productoId}
                  onValueChange={(value) => handleChange('productoId', value)}
                >
                  <SelectTrigger id="producto" aria-required="true">
                    <SelectValue placeholder="Selecciona un producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {productos.map((prod) => (
                      <SelectItem key={prod.id} value={prod.id}>
                        <div className="flex items-center justify-between gap-4">
                          <span>{prod.nombre}</span>
                          <span className="text-muted-foreground text-sm">
                            Stock: {prod.stock}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {productos.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No hay productos registrados.{' '}
                    <Link href="/productos/nuevo" className="text-primary hover:underline">
                      Agregar producto
                    </Link>
                  </p>
                )}
              </div>

              {/* Info del producto seleccionado */}
              {productoSeleccionado && (
                <div className="sm:col-span-2 p-4 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-background">
                      <Package className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-medium">{productoSeleccionado.nombre}</p>
                      <p className="text-sm text-muted-foreground">
                        Stock actual: <span className="font-medium">{productoSeleccionado.stock}</span> unidades
                        {productoSeleccionado.stock <= productoSeleccionado.stockMinimo && (
                          <span className="ml-2 text-amber-600">(Stock bajo)</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cantidad */}
              <div className="space-y-2">
                <Label htmlFor="cantidad">Cantidad a ingresar *</Label>
                <Input
                  id="cantidad"
                  type="number"
                  min="1"
                  value={formData.cantidad}
                  onChange={(e) => handleChange('cantidad', e.target.value)}
                  placeholder="0"
                  required
                  aria-required="true"
                />
                {productoSeleccionado && formData.cantidad && (
                  <p className="text-sm text-muted-foreground">
                    Nuevo stock: <span className="font-medium text-green-600">
                      {productoSeleccionado.stock + parseInt(formData.cantidad || '0')}
                    </span> unidades
                  </p>
                )}
              </div>

              {/* Motivo */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="motivo">Motivo de la entrada *</Label>
                <Textarea
                  id="motivo"
                  value={formData.motivo}
                  onChange={(e) => handleChange('motivo', e.target.value)}
                  placeholder="Ej: Compra a proveedor, Devolución de cliente, etc."
                  rows={3}
                  required
                  aria-required="true"
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/inventario')}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" aria-hidden="true" />
                    Registrar Entrada
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
