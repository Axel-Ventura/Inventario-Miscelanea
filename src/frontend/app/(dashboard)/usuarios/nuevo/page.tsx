'use client'

import React from "react"

import { useState, useEffect } from 'react'
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

function NuevoUsuarioContent() {
  const router = useRouter()
  const { addUsuario, isLoading, error, clearError } = useUsersStore()

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: '' as UserRole | '',
  })

  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    clearError()
  }, [clearError])

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

    if (!formData.password) {
      setValidationError('La contraseña es requerida')
      return
    }

    if (formData.password.length < 6) {
      setValidationError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Las contraseñas no coinciden')
      return
    }

    if (!formData.rol) {
      setValidationError('El rol es requerido')
      return
    }

    const success = await addUsuario({
      nombre: formData.nombre.trim(),
      email: formData.email.trim(),
      password: formData.password,
      rol: formData.rol as UserRole,
    })

    if (success) {
      router.push('/usuarios')
    }
  }

  const displayError = validationError || error

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
          <h1 className="text-2xl font-bold tracking-tight">Nuevo Usuario</h1>
          <p className="text-muted-foreground">
            Agrega un nuevo usuario al sistema
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
            Completa los datos del nuevo usuario
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
                  autoComplete="off"
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

              {/* Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  aria-required="true"
                  autoComplete="new-password"
                />
              </div>

              {/* Confirmar contraseña */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="Repite la contraseña"
                  required
                  aria-required="true"
                  autoComplete="new-password"
                />
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
                  'Crear Usuario'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function NuevoUsuarioPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <NuevoUsuarioContent />
    </ProtectedRoute>
  )
}
