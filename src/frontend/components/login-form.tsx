'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Store } from 'lucide-react'

import { useAuthStore } from '@/lib/stores/auth-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

// Validation schema with Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electronico es requerido')
    .email('Ingresa un correo electronico valido'),
  password: z
    .string()
    .min(1, 'La contrasena es requerida')
    .min(6, 'La contrasena debe tener al menos 6 caracteres'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error, clearError } = useAuthStore()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  })

  const onSubmit = async (values: LoginFormValues) => {
    clearError()
    
    const response = await login({
      email: values.email,
      password: values.password,
    })

    if (response.success) {
      router.push('/dashboard')
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary">
              <Store className="size-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">Miscelanea</span>
          </div>

          {/* Login Card */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Bienvenido</CardTitle>
              <CardDescription>
                Ingresa tus credenciales para acceder al sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                  {/* Error message */}
                  {error && (
                    <div
                      role="alert"
                      aria-live="polite"
                      className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
                    >
                      {error}
                    </div>
                  )}

                  {/* Email field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Correo electronico</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="correo@ejemplo.com"
                            autoComplete="email"
                            aria-invalid={fieldState.invalid}
                            aria-describedby={fieldState.error ? 'email-error' : undefined}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage id="email-error" />
                      </FormItem>
                    )}
                  />

                  {/* Password field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Contrasena</FormLabel>
                          <a
                            href="/recuperar-password"
                            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                          >
                            Olvidaste tu contrasena?
                          </a>
                        </div>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Ingresa tu contrasena"
                              autoComplete="current-password"
                              aria-invalid={fieldState.invalid}
                              aria-describedby={fieldState.error ? 'password-error' : undefined}
                              className="pr-10"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                          >
                            {showPassword ? (
                              <EyeOff className="size-4 text-muted-foreground" />
                            ) : (
                              <Eye className="size-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                        <FormMessage id="password-error" />
                      </FormItem>
                    )}
                  />

                  {/* Submit button */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Iniciando sesion...
                      </>
                    ) : (
                      'Iniciar sesion'
                    )}
                  </Button>
                </form>
              </Form>

              {/* Demo credentials helper */}
              <div className="mt-6 border-t pt-4">
                <p className="mb-2 text-center text-xs text-muted-foreground">
                  Credenciales de prueba
                </p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p><strong>Admin:</strong> admin@miscelanea.com</p>
                  <p><strong>Vendedor:</strong> vendedor@miscelanea.com</p>
                  <p><strong>Almacen:</strong> almacen@miscelanea.com</p>
                  <p><strong>Password:</strong> password123</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground">
            Sistema de Inventario - Miscelanea v1.0
          </p>
        </div>
      </div>
    </div>
  )
}
