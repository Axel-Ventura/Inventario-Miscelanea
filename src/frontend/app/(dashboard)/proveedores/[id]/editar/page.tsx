'use client'

import React from "react"

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useInventoryStore } from '@/lib/stores/inventory-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Loader2, AlertCircle, Truck } from 'lucide-react'

export default function EditarProveedorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { proveedores, fetchProveedores, updateProveedor, isLoading, error, clearError } = useInventoryStore()

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
  })

  const [validationError, setValidationError] = useState('')
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      await fetchProveedores()
      setIsInitialLoading(false)
    }
    loadData()
    clearError()
  }, [fetchProveedores, clearError])

  // Cargar datos del proveedor cuando esté disponible
  useEffect(() => {
    const proveedor = proveedores.find((p) => p.id === id)
    if (proveedor) {
      setFormData({
        nombre: proveedor.nombre,
        email: proveedor.email,
        telefono: proveedor.telefono,
        direccion: proveedor.direccion,
      })
    }
  }, [proveedores, id])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setValidationError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')

    // Validaciones
    if (!formData.nombre.trim()) {
      setValidationError('El nombre del proveedor es requerido')
      return
    }

    if (!formData.email.trim()) {
      setValidationError('El correo electrónico es requerido')
      return
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setValidationError('El formato del correo electrónico no es válido')
      return
    }

    if (!formData.telefono.trim()) {
      setValidationError('El teléfono es requerido')
      return
    }

    if (!formData.direccion.trim()) {
      setValidationError('La dirección es requerida')
      return
    }

    const success = await updateProveedor(id, {
      nombre: formData.nombre.trim(),
      email: formData.email.trim(),
      telefono: formData.telefono.trim(),
      direccion: formData.direccion.trim(),
    })

    if (success) {
      router.push('/proveedores')
    }
  }

  const displayError = validationError || error

  // Pantalla de carga inicial
  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Proveedor no encontrado
  const proveedor = proveedores.find((p) => p.id === id)
  if (!proveedor && !isInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Truck className="h-12 w-12 text-muted-foreground mb-4" aria-hidden="true" />
        <h2 className="text-lg font-medium">Proveedor no encontrado</h2>
        <p className="text-muted-foreground mb-4">
          El proveedor que intentas editar no existe
        </p>
        <Button asChild>
          <Link href="/proveedores">Volver a proveedores</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/proveedores" aria-label="Volver a proveedores">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Editar Proveedor</h1>
          <p className="text-muted-foreground">
            Modifica la información del proveedor
          </p>
        </div>
      </div>

      {/* Formulario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" aria-hidden="true" />
            Información del Proveedor
          </CardTitle>
          <CardDescription>
            Actualiza los datos del proveedor
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
                <Label htmlFor="nombre">Nombre del proveedor *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  placeholder="Ej: Distribuidora Central"
                  required
                  aria-required="true"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="contacto@proveedor.com"
                  required
                  aria-required="true"
                />
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => handleChange('telefono', e.target.value)}
                  placeholder="+52 55 1234 5678"
                  required
                  aria-required="true"
                />
              </div>

              {/* Dirección - ocupa 2 columnas */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="direccion">Dirección *</Label>
                <Textarea
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => handleChange('direccion', e.target.value)}
                  placeholder="Calle, número, colonia, ciudad, estado, CP"
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
                onClick={() => router.push('/proveedores')}
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
                  'Guardar Cambios'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
