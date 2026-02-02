'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useUsersStore } from '@/lib/stores/users-store'
import { useIsAdmin } from '@/lib/stores/auth-store'
import { ProtectedRoute } from '@/components/protected-route'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  Shield,
  User,
} from 'lucide-react'

function UsuariosContent() {
  const { usuarios, fetchUsuarios, deleteUsuario, isLoading } = useUsersStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchUsuarios()
  }, [fetchUsuarios])

  // Filtrar usuarios
  const filteredUsuarios = usuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  // Manejar eliminación
  const handleDelete = async () => {
    if (!deleteId) return
    
    setIsDeleting(true)
    await deleteUsuario(deleteId)
    setIsDeleting(false)
    setDeleteId(null)
  }

  
}
