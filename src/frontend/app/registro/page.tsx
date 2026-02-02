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
import { Loader2, Package, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading, error, clearError, isAuthenticated } = useAuthStore()
  
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validationError, setValidationError] = useState('')

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

  // Validación de contraseña
  const passwordRequirements = [
    { met: password.length >= 6, text: 'Al menos 6 caracteres' },
    { met: /[A-Za-z]/.test(password), text: 'Contiene letras' },
    { met: /[0-9]/.test(password), text: 'Contiene números' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setValidationError('Las contraseñas no coinciden')
      return
    }

    // Validar requisitos de contraseña
    if (password.length < 6) {
      setValidationError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    const success = await register(email, password, nombre)
    if (success) {
      router.push('/dashboard')
    }
  }

  const displayError = validationError || error

  return (
    <main 
      className="min-h-screen flex items-center justify-center bg-muted/30 p-4"
      role="main"
      aria-labelledby="register-heading"
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
          <CardTitle id="register-heading" className="text-2xl">
            Crear Cuenta
          </CardTitle>
          <CardDescription>
            Regístrate para acceder al sistema de gestión de inventarios
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Mensaje de error accesible */}
            {displayError && (
              <Alert variant="destructive" role="alert" aria-live="polite">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                <AlertDescription>{displayError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                autoComplete="name"
                aria-required="true"
              />
            </div>

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
                autoComplete="new-password"
                aria-required="true"
                aria-describedby="password-requirements"
              />
              {/* Requisitos de contraseña accesibles */}
              <ul 
                id="password-requirements" 
                className="text-xs space-y-1 mt-2"
                aria-label="Requisitos de contraseña"
              >
                {passwordRequirements.map((req, index) => (
                  <li 
                    key={index}
                    className={`flex items-center gap-1.5 ${req.met ? 'text-green-600' : 'text-muted-foreground'}`}
                  >
                    <CheckCircle2 
                      className={`h-3 w-3 ${req.met ? 'opacity-100' : 'opacity-30'}`} 
                      aria-hidden="true"
                    />
                    <span>{req.text}</span>
                    <span className="sr-only">{req.met ? '(cumplido)' : '(pendiente)'}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                aria-required="true"
              />
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
                  <span id="loading-status">Creando cuenta...</span>
                </>
              ) : (
                'Crear Cuenta'
              )}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              ¿Ya tienes cuenta?{' '}
              <Link 
                href="/login"
                className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
