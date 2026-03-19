'use client'

import { useAuthStore } from '@/lib/stores/auth-store'
import { ROLE_LABELS } from '@/lib/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User, Bell, Shield, Palette } from 'lucide-react'

export default function ConfiguracionPage() {
  const { user } = useAuthStore()

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuracion</h1>
        <p className="text-muted-foreground">
          Administra tu cuenta y preferencias del sistema
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              Perfil de Usuario
            </CardTitle>
            <CardDescription>
              Informacion de tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {user ? getInitials(user.nombre, user.apellido) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-lg">
                  {user ? `${user.nombre} ${user.apellido}` : 'Usuario'}
                </p>
                <p className="text-muted-foreground">
                  {user ? ROLE_LABELS[user.rol] : ''}
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  defaultValue={user?.nombre}
                  placeholder="Tu nombre"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  defaultValue={user?.apellido}
                  placeholder="Tu apellido"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">Correo electronico</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email}
                  placeholder="correo@ejemplo.com"
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  El correo no puede ser modificado
                </p>
              </div>
            </div>

            <Button>Guardar cambios</Button>
          </CardContent>
        </Card>

        {/* Quick info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-5" />
              Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              Cambiar contrasena
            </Button>
            <Separator />
            <div className="text-sm text-muted-foreground">
              <p>Ultimo acceso:</p>
              <p className="font-medium text-foreground">
                {user?.ultimoAcceso
                  ? new Date(user.ultimoAcceso).toLocaleString('es-MX')
                  : 'Primera sesion'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="size-5" />
            Notificaciones
          </CardTitle>
          <CardDescription>
            Configura tus preferencias de notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Alertas de stock bajo</p>
              <p className="text-sm text-muted-foreground">
                Recibe notificaciones cuando el stock este bajo
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Resumen diario de ventas</p>
              <p className="text-sm text-muted-foreground">
                Recibe un resumen de ventas al final del dia
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Nuevos pedidos</p>
              <p className="text-sm text-muted-foreground">
                Notificaciones de nuevos pedidos de proveedores
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="size-5" />
            Apariencia
          </CardTitle>
          <CardDescription>
            Personaliza la apariencia del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Modo oscuro</p>
              <p className="text-sm text-muted-foreground">
                Activa el tema oscuro para reducir la fatiga visual
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
