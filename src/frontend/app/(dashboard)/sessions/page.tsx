'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { apiFetch } from '@/lib/api-client'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Loader2, Monitor, Trash2, LogOut } from 'lucide-react'
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

interface SessionRow {
  id: string
  deviceInfo: string
  ipAddress: string
  lastActivity: string | null
  createdAt: string | null
  expiresAt: string | null
  isCurrent: boolean
}

export default function SessionsPage() {
  const router = useRouter()
  const { logoutLocalOnly } = useAuthStore()
  const [sessions, setSessions] = useState<SessionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiFetch('/api/auth/sessions')
      const data = await res.json()
      if (!res.ok) {
        toast.error(typeof data?.message === 'string' ? data.message : 'Error al cargar sesiones')
        setSessions([])
        return
      }
      setSessions(data)
    } catch {
      toast.error('Error de red')
      setSessions([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const formatDt = (iso: string | null) => {
    if (!iso) return '—'
    try {
      return new Date(iso).toLocaleString('es-MX', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    } catch {
      return iso
    }
  }

  const revoke = async (id: string) => {
    setActionId(id)
    try {
      const res = await apiFetch(`/api/auth/sessions/${id}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(typeof data?.message === 'string' ? data.message : 'No se pudo cerrar la sesión')
        return
      }
      toast.success('Sesión cerrada')
      const current = sessions.find((s) => s.id === id)?.isCurrent
      if (current) {
        logoutLocalOnly()
        router.replace('/login?reason=expired')
        return
      }
      await load()
    } finally {
      setActionId(null)
    }
  }

  const logoutAll = async () => {
    setActionId('all')
    try {
      const ok = await useAuthStore.getState().logoutAllSessions()
      if (ok) {
        toast.success('Todas las sesiones cerradas')
        router.replace('/login?reason=expired')
      } else {
        toast.error('No se pudieron cerrar todas las sesiones')
      }
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard" aria-label="Volver al panel">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Mis sesiones</h1>
            <p className="text-muted-foreground">
              Dispositivos y navegadores con acceso a tu cuenta
            </p>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={actionId === 'all'}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar todas las sesiones
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Cerrar todas las sesiones?</AlertDialogTitle>
              <AlertDialogDescription>
                Incluye esta sesión. Tendrás que volver a iniciar sesión en todos los dispositivos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => void logoutAll()}>Cerrar todo</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" aria-hidden="true" />
            Sesiones activas
          </CardTitle>
          <CardDescription>
            Última actividad y caducidad. Puedes revocar accesos que no reconozcas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No hay sesiones activas.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dispositivo / navegador</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Última actividad</TableHead>
                  <TableHead>Expira</TableHead>
                  <TableHead className="w-[100px]">Estado</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="max-w-[240px] truncate" title={s.deviceInfo}>
                      {s.deviceInfo || 'Desconocido'}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{s.ipAddress || '—'}</TableCell>
                    <TableCell>{formatDt(s.lastActivity)}</TableCell>
                    <TableCell>{formatDt(s.expiresAt)}</TableCell>
                    <TableCell>
                      {s.isCurrent ? (
                        <Badge>Actual</Badge>
                      ) : (
                        <Badge variant="secondary">Otro</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={actionId !== null}
                        onClick={() => void revoke(s.id)}
                        aria-label={`Cerrar sesión ${s.deviceInfo?.slice(0, 30)}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
