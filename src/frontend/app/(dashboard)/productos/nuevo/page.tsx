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
import { ArrowLeft, Loader2, AlertCircle, Package } from 'lucide-react'

// Categorías predefinidas
const CATEGORIAS = [
  'Electrónica',
  'Periféricos',
  'Mobiliario',
  'Accesorios',
  'Software',
  'Otros',
]

export default function NuevoProductoPage() {
  const router = useRouter()
  const { proveedores, fetchProveedores, addProducto, isLoading, error, clearError } = useInventoryStore()

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    stockMinimo: '',
    categoria: '',
    proveedorId: '',
  })

  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    fetchProveedores()
    clearError()
  }, [fetchProveedores, clearError])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setValidationError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')

    // Validaciones
    if (!formData.nombre.trim()) {
      setValidationError('El nombre del producto es requerido')
      return
    }

    const precio = parseFloat(formData.precio)
    if (isNaN(precio) || precio <= 0) {
      setValidationError('El precio debe ser un número mayor a 0')
      return
    }

    const stock = parseInt(formData.stock)
    if (isNaN(stock) || stock < 0) {
      setValidationError('El stock debe ser un número mayor o igual a 0')
      return
    }

    const stockMinimo = parseInt(formData.stockMinimo)
    if (isNaN(stockMinimo) || stockMinimo < 0) {
      setValidationError('El stock mínimo debe ser un número mayor o igual a 0')
      return
    }

    if (!formData.categoria) {
      setValidationError('La categoría es requerida')
      return
    }

    if (!formData.proveedorId) {
      setValidationError('El proveedor es requerido')
      return
    }

    const success = await addProducto({
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      precio,
      stock,
      stockMinimo,
      categoria: formData.categoria,
      proveedorId: formData.proveedorId,
    })

    if (success) {
      router.push('/productos')
    }
  }

  const displayError = validationError || error

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/productos" aria-label="Volver a productos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nuevo Producto</h1>
          <p className="text-muted-foreground">
            Agrega un nuevo producto al inventario
          </p>
        </div>
      </div>

      {/* Formulario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" aria-hidden="true" />
            Información del Producto
          </CardTitle>
          <CardDescription>
            Completa los datos del nuevo producto
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
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del producto *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  placeholder="Ej: Laptop HP ProBook"
                  required
                  aria-required="true"
                />
              </div>

              {/* Categoría */}
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría *</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) => handleChange('categoria', value)}
                >
                  <SelectTrigger id="categoria" aria-required="true">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Descripción - ocupa 2 columnas */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => handleChange('descripcion', e.target.value)}
                  placeholder="Describe el producto..."
                  rows={3}
                />
              </div>

              {/* Precio */}
              <div className="space-y-2">
                <Label htmlFor="precio">Precio (MXN) *</Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precio}
                  onChange={(e) => handleChange('precio', e.target.value)}
                  placeholder="0.00"
                  required
                  aria-required="true"
                />
              </div>

              {/* Proveedor */}
              <div className="space-y-2">
                <Label htmlFor="proveedor">Proveedor *</Label>
                <Select
                  value={formData.proveedorId}
                  onValueChange={(value) => handleChange('proveedorId', value)}
                >
                  <SelectTrigger id="proveedor" aria-required="true">
                    <SelectValue placeholder="Selecciona un proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {proveedores.map((prov) => (
                      <SelectItem key={prov.id} value={prov.id}>
                        {prov.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {proveedores.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No hay proveedores registrados.{' '}
                    <Link href="/proveedores/nuevo" className="text-primary hover:underline">
                      Agregar proveedor
                    </Link>
                  </p>
                )}
              </div>

              {/* Stock inicial */}
              <div className="space-y-2">
                <Label htmlFor="stock">Stock inicial *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleChange('stock', e.target.value)}
                  placeholder="0"
                  required
                  aria-required="true"
                />
              </div>

              {/* Stock mínimo */}
              <div className="space-y-2">
                <Label htmlFor="stockMinimo">Stock mínimo *</Label>
                <Input
                  id="stockMinimo"
                  type="number"
                  min="0"
                  value={formData.stockMinimo}
                  onChange={(e) => handleChange('stockMinimo', e.target.value)}
                  placeholder="0"
                  required
                  aria-required="true"
                />
                <p className="text-xs text-muted-foreground">
                  Se mostrará una alerta cuando el stock sea menor o igual a este valor
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/productos')}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Producto'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
