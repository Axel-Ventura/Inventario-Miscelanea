'use client'

import { MOCK_PROVIDERS } from '@/lib/mock-data'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Mail, Phone, MapPin } from 'lucide-react'
import { toast } from 'sonner'

export default function ProveedoresPage() {
  const providers = MOCK_PROVIDERS

  const handleAddProvider = () => {
    toast.info('Funcion pendiente', {
      description: 'Esta funcion estara disponible cuando se conecte el backend.',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proveedores</h1>
          <p className="text-muted-foreground">
            Gestion de proveedores y contactos
          </p>
        </div>
        <Button onClick={handleAddProvider}>
          <Plus className="mr-2 size-4" />
          Agregar Proveedor
        </Button>
      </div>

      {/* Provider cards for mobile */}
      <div className="grid gap-4 md:hidden">
        {providers.map((provider) => (
          <Card key={provider.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{provider.nombre}</CardTitle>
                <Badge variant={provider.activo ? 'secondary' : 'outline'}>
                  {provider.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              <CardDescription>{provider.contacto}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="size-4 text-muted-foreground" />
                {provider.telefono}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="size-4 text-muted-foreground" />
                {provider.email}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="size-4 text-muted-foreground" />
                {provider.direccion}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Provider table for desktop */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Lista de Proveedores</CardTitle>
          <CardDescription>
            {providers.length} proveedores registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Telefono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Direccion</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="font-medium">{provider.nombre}</TableCell>
                  <TableCell>{provider.contacto}</TableCell>
                  <TableCell>{provider.telefono}</TableCell>
                  <TableCell>{provider.email}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {provider.direccion}
                  </TableCell>
                  <TableCell>
                    <Badge variant={provider.activo ? 'secondary' : 'outline'}>
                      {provider.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
