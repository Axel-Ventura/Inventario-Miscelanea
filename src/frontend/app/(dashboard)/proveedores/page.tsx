'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useInventoryStore } from '@/lib/stores/inventory-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  Truck,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react'

export default function ProveedoresPage() {
  const { proveedores, fetchProveedores, deleteProveedor, isLoading } = useInventoryStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchProveedores()
  }, [fetchProveedores])

  // Filtrar proveedores
  const filteredProveedores = proveedores.filter((proveedor) =>
    proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.telefono.includes(searchTerm)
  )

  // Manejar eliminación
  const handleDelete = async () => {
    if (!deleteId) return
    
    setIsDeleting(true)
    await deleteProveedor(deleteId)
    setIsDeleting(false)
    setDeleteId(null)
  }

  
}
