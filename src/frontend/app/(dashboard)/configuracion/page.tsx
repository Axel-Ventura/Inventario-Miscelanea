'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Settings, User, Lock, LogOut, Loader2, AlertCircle, CheckCircle2, Shield } from 'lucide-react'

export default function ConfiguracionPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  // Estado para el perfil
  const [profileData, setProfileData] = useState({
    nombre: '',
    email: '',
  })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileError, setProfileError] = useState('')

  // Estado para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  // Cargar datos del usuario
  useEffect(() => {
    if (user) {
      setProfileData({
        nombre: user.nombre,
        email: user.email,
      })
    }
  }, [user])

  // Manejar actualización de perfil
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError('')
    setProfileSuccess(false)

    if (!profileData.nombre.trim()) {
      setProfileError('El nombre es requerido')
      return
    }

    if (!profileData.email.trim()) {
      setProfileError('El correo electrónico es requerido')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(profileData.email)) {
      setProfileError('El formato del correo electrónico no es válido')
      return
    }

    setProfileLoading(true)
    
    // Simulación de actualización (en producción se llamaría al API)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setProfileLoading(false)
    setProfileSuccess(true)
    
    // Limpiar mensaje de éxito después de 3 segundos
    setTimeout(() => setProfileSuccess(false), 3000)
  }

  // Manejar cambio de contraseña
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess(false)

    if (!passwordData.currentPassword) {
      setPasswordError('La contraseña actual es requerida')
      return
    }

    if (!passwordData.newPassword) {
      setPasswordError('La nueva contraseña es requerida')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden')
      return
    }

    setPasswordLoading(true)
    
    // Simulación de cambio de contraseña (en producción se llamaría al API)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setPasswordLoading(false)
    setPasswordSuccess(true)
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    
    // Limpiar mensaje de éxito después de 3 segundos
    setTimeout(() => setPasswordSuccess(false), 3000)
  }

  // Manejar cierre de sesión
  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Administra tu cuenta y preferencias del sistema
        </p>
      </div>

      <div className="grid gap-6">
        {/* Información del perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" aria-hidden="true" />
              Información del Perfil
            </CardTitle>
            <CardDescription>
              Actualiza tu información personal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {/* Mensajes de estado */}
              {profileError && (
                <Alert variant="destructive" role="alert" aria-live="polite">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  <AlertDescription>{profileError}</AlertDescription>
                </Alert>
              )}
              
              {profileSuccess && (
                <Alert className="border-green-200 bg-green-50 text-green-800" role="status" aria-live="polite">
                  <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />
                  <AlertDescription>Perfil actualizado correctamente</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre completo</Label>
                  <Input
                    id="nombre"
                    value={profileData.nombre}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>

              {/* Información del rol */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Shield className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium">Rol de usuario</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={user?.rol === 'admin' ? 'default' : 'secondary'}>
                      {user?.rol === 'admin' ? 'Administrador' : 'Usuario'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {user?.rol === 'admin' 
                        ? 'Tienes acceso completo al sistema'
                        : 'Acceso limitado a funciones básicas'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={profileLoading}>
                  {profileLoading ? (
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

        {/* Cambiar contraseña */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" aria-hidden="true" />
              Cambiar Contraseña
            </CardTitle>
            <CardDescription>
              Actualiza tu contraseña de acceso al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Mensajes de estado */}
              {passwordError && (
                <Alert variant="destructive" role="alert" aria-live="polite">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}
              
              {passwordSuccess && (
                <Alert className="border-green-200 bg-green-50 text-green-800" role="status" aria-live="polite">
                  <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />
                  <AlertDescription>Contraseña actualizada correctamente</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Contraseña actual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva contraseña</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Repite la contraseña"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={passwordLoading}>
                  {passwordLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Actualizando...
                    </>
                  ) : (
                    'Cambiar Contraseña'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Cerrar sesión */}
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <LogOut className="h-5 w-5" aria-hidden="true" />
              Cerrar Sesión
            </CardTitle>
            <CardDescription>
              Finaliza tu sesión actual en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                  Cerrar Sesión
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tu sesión actual será finalizada y serás redirigido a la página de inicio de sesión.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Cerrar Sesión
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
