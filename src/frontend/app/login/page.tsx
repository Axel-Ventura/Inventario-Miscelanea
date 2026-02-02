'use client'

import React from "react"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Package, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  // Limpiar errores al montar el componente
  useEffect(() => {
    clearError()
  }, [clearError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login(email, password)
    if (success) {
      router.push('/dashboard')
    }
  }

  return (
    <main 
      className="min-h-screen flex items-center justify-center bg-muted/30 p-4"
      role="main"
      aria-labelledby="login-heading"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div 
              className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground"
              aria-hidden="true"
            >
              <Package className="w-6 h-6" />
            </div>
          </div>
          <CardTitle id="login-heading" className="text-2xl">
            Iniciar Sesión
          </CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder al sistema de inventarios
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Mensaje de error accesible */}
            {error && (
              <Alert variant="destructive" role="alert" aria-live="polite">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                aria-required="true"
                aria-describedby={error ? 'login-error' : undefined}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                aria-required="true"
              />
            </div>

            <div className="flex justify-end">
              <Link 
                href="/recuperar-password"
                className="text-sm text-muted-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              aria-describedby={isLoading ? 'loading-status' : undefined}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  <span id="loading-status">Iniciando sesión...</span>
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <Link 
                href="/registro"
                className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
              >
                Regístrate aquí
              </Link>
            </p>
          </CardFooter>
        </form>

        {/* Credenciales de prueba para desarrollo */}
        <div className="px-6 pb-6">
          <div className="p-3 bg-muted rounded-lg text-sm">
            <p className="font-medium mb-1">Credenciales de prueba:</p>
            <p className="text-muted-foreground">Admin: admin@inventario.com / 123456</p>
            <p className="text-muted-foreground">Usuario: usuario@inventario.com / 123456</p>
          </div>
        </div>
      </Card>
    </main>
  )
}
