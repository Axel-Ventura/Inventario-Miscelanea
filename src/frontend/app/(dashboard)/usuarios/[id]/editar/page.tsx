'use client'

import React from "react"

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUsersStore } from '@/lib/stores/users-store'
import { ProtectedRoute } from '@/components/protected-route'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Loader2, AlertCircle, Users, Shield, User } from 'lucide-react'
import type { UserRole } from '@/lib/types'

function EditarUsuarioContent({ id }: { id: string }) {
  const router = useRouter()
  const { usuarios, fetchUsuarios, updateUsuario, isLoading, error, clearError } = useUsersStore()

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rol: '' as UserRole | '',
  })

  const [validationError, setValidationError] = useState('')
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      await fetchUsuarios()
      setIsInitialLoading(false)
    }
    loadData()
    clearError()
  }, [fetchUsuarios, clearError])

  // Cargar datos del usuario cuando esté disponible
  useEffect(() => {
    const usuario = usuarios.find((u) => u.id === id)
    if (usuario) {
      setFormData({
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      })
    }
  }, [usuarios, id])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setValidationError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')

    // Validaciones
    if (!formData.nombre.trim()) {
      setValidationError('El nombre es requerido')
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

    if (!formData.rol) {
      setValidationError('El rol es requerido')
      return
    }

    const success = await updateUsuario(id, {
      nombre: formData.nombre.trim(),
      email: formData.email.trim(),
      rol: formData.rol as UserRole,
    })

    if (success) {
      router.push('/usuarios')
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

  // Usuario no encontrado
  const usuario = usuarios.find((u) => u.id === id)
  if (!usuario && !isInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Users className="h-12 w-12 text-muted-foreground mb-4" aria-hidden="true" />
        <h2 className="text-lg font-medium">Usuario no encontrado</h2>
        <p className="text-muted-foreground mb-4">
          El usuario que intentas editar no existe
        </p>
        <Button asChild>
          <Link href="/usuarios">Volver a usuarios</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/usuarios" aria-label="Volver a usuarios">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Editar Usuario</h1>
          <p className="text-muted-foreground">
            Modifica la información del usuario
          </p>
        </div>
      </div>

      {/* Formulario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" aria-hidden="true" />
            Información del Usuario
          </CardTitle>
          <CardDescription>
            Actualiza los datos del usuario. La contraseña no se puede cambiar aquí.
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
                <Label htmlFor="nombre">Nombre completo *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  placeholder="Nombre del usuario"
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
                  placeholder="correo@ejemplo.com"
                  required
                  aria-required="true"
                />
              </div>

              {/* Rol */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="rol">Rol del usuario *</Label>
                <Select
                  value={formData.rol}
                  onValueChange={(value) => handleChange('rol', value)}
                >
                  <SelectTrigger id="rol" aria-required="true">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usuario">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" aria-hidden="true" />
                        <div>
                          <p>Usuario</p>
                          <p className="text-xs text-muted-foreground">
                            Acceso limitado a productos, inventario y proveedores
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" aria-hidden="true" />
                        <div>
                          <p>Administrador</p>
                          <p className="text-xs text-muted-foreground">
                            Acceso completo incluyendo gestión de usuarios
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/usuarios')}
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

export default function EditarUsuarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <EditarUsuarioContent id={id} />
    </ProtectedRoute>
  )
}
