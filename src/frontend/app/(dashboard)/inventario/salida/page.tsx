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
import { ArrowLeft, Loader2, AlertCircle, TrendingDown, Package, AlertTriangle } from 'lucide-react'

export default function SalidaInventarioPage() {
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

    // Verificar stock disponible
    const producto = productos.find((p) => p.id === formData.productoId)
    if (producto && cantidad > producto.stock) {
      setValidationError(`Stock insuficiente. Disponible: ${producto.stock} unidades`)
      return
    }

    if (!formData.motivo.trim()) {
      setValidationError('El motivo es requerido')
      return
    }

    const success = await addMovimiento({
      productoId: formData.productoId,
      tipo: 'salida',
      cantidad,
      motivo: formData.motivo.trim(),
    })

    if (success) {
      router.push('/inventario')
    }
  }

  // Obtener producto seleccionado
  const productoSeleccionado = productos.find((p) => p.id === formData.productoId)

  // Calcular nuevo stock
  const nuevoStock = productoSeleccionado 
    ? productoSeleccionado.stock - parseInt(formData.cantidad || '0')
    : 0

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
          <h1 className="text-2xl font-bold tracking-tight">Registrar Salida</h1>
          <p className="text-muted-foreground">
            Retira unidades del inventario de un producto
          </p>
        </div>
      </div>

      {/* Formulario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-orange-600" aria-hidden="true" />
            Salida de Inventario
          </CardTitle>
          <CardDescription>
            Registra la salida de productos del almacén
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
                      <SelectItem key={prod.id} value={prod.id} disabled={prod.stock === 0}>
                        <div className="flex items-center justify-between gap-4">
                          <span>{prod.nombre}</span>
                          <span className={`text-sm ${prod.stock === 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
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
                    <div className="flex-1">
                      <p className="font-medium">{productoSeleccionado.nombre}</p>
                      <p className="text-sm text-muted-foreground">
                        Stock disponible: <span className="font-medium">{productoSeleccionado.stock}</span> unidades
                        {productoSeleccionado.stock <= productoSeleccionado.stockMinimo && (
                          <span className="ml-2 text-amber-600">(Stock bajo)</span>
                        )}
                      </p>
                    </div>
                    {productoSeleccionado.stock === 0 && (
                      <div className="flex items-center gap-1 text-destructive">
                        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                        <span className="text-sm font-medium">Sin stock</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Cantidad */}
              <div className="space-y-2">
                <Label htmlFor="cantidad">Cantidad a retirar *</Label>
                <Input
                  id="cantidad"
                  type="number"
                  min="1"
                  max={productoSeleccionado?.stock || undefined}
                  value={formData.cantidad}
                  onChange={(e) => handleChange('cantidad', e.target.value)}
                  placeholder="0"
                  required
                  aria-required="true"
                  disabled={productoSeleccionado?.stock === 0}
                />
                {productoSeleccionado && formData.cantidad && (
                  <p className="text-sm text-muted-foreground">
                    Nuevo stock:{' '}
                    <span className={`font-medium ${nuevoStock < 0 ? 'text-destructive' : nuevoStock <= productoSeleccionado.stockMinimo ? 'text-amber-600' : 'text-orange-600'}`}>
                      {nuevoStock}
                    </span>{' '}
                    unidades
                    {nuevoStock <= productoSeleccionado.stockMinimo && nuevoStock >= 0 && (
                      <span className="text-amber-600"> (Quedará en stock bajo)</span>
                    )}
                    {nuevoStock < 0 && (
                      <span className="text-destructive"> (Stock insuficiente)</span>
                    )}
                  </p>
                )}
              </div>

              {/* Motivo */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="motivo">Motivo de la salida *</Label>
                <Textarea
                  id="motivo"
                  value={formData.motivo}
                  onChange={(e) => handleChange('motivo', e.target.value)}
                  placeholder="Ej: Venta a cliente, Transferencia entre almacenes, etc."
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
              <Button 
                type="submit" 
                disabled={isLoading || productoSeleccionado?.stock === 0} 
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <TrendingDown className="mr-2 h-4 w-4" aria-hidden="true" />
                    Registrar Salida
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
