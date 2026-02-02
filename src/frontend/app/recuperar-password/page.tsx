'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Package, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulación del envío de correo de recuperación
    await new Promise(resolve => setTimeout(resolve, 1500))

    // En una implementación real, aquí se enviaría el correo
    // Por ahora, simulamos un éxito si el email es válido
    if (email.includes('@')) {
      setSuccess(true)
    } else {
      setError('Por favor ingresa un correo electrónico válido')
    }

    setIsLoading(false)
  }

  return (
    <main 
      className="min-h-screen flex items-center justify-center bg-muted/30 p-4"
      role="main"
      aria-labelledby="recover-heading"
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
          <CardTitle id="recover-heading" className="text-2xl">
            Recuperar Contraseña
          </CardTitle>
          <CardDescription>
            Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña
          </CardDescription>
        </CardHeader>

        {success ? (
          <CardContent className="space-y-4">
            <Alert className="border-green-200 bg-green-50 text-green-800" role="status" aria-live="polite">
              <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />
              <AlertDescription>
                Hemos enviado un correo con instrucciones para restablecer tu contraseña a <strong>{email}</strong>. 
                Por favor revisa tu bandeja de entrada.
              </AlertDescription>
            </Alert>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>¿No recibiste el correo?</p>
              <Button 
                variant="link" 
                onClick={() => setSuccess(false)}
                className="p-0 h-auto"
              >
                Intentar de nuevo
              </Button>
            </div>
          </CardContent>
        ) : (
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
                    <span id="loading-status">Enviando...</span>
                  </>
                ) : (
                  'Enviar Instrucciones'
                )}
              </Button>
            </CardFooter>
          </form>
        )}

        <CardFooter className="justify-center pt-0">
          <Link 
            href="/login"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded gap-1"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver al inicio de sesión
          </Link>
        </CardFooter>
      </Card>
    </main>
  )
}
