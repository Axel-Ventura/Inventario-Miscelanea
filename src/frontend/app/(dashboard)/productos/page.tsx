'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useInventoryStore } from '@/lib/stores/inventory-store'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Package,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  AlertTriangle,
  Filter,
  Loader2,
} from 'lucide-react'

export default function ProductosPage() {
  const { productos, proveedores, fetchProductos, fetchProveedores, deleteProducto, isLoading } = useInventoryStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [stockFilter, setStockFilter] = useState<string>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchProductos()
    fetchProveedores()
  }, [fetchProductos, fetchProveedores])

  // Obtener categorías únicas
  const categorias = [...new Set(productos.map((p) => p.categoria))]

  // Filtrar productos
  const filteredProductos = productos.filter((producto) => {
    const matchesSearch = 
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || producto.categoria === categoryFilter
    
    const matchesStock = 
      stockFilter === 'all' ||
      (stockFilter === 'low' && producto.stock <= producto.stockMinimo) ||
      (stockFilter === 'ok' && producto.stock > producto.stockMinimo)
    
    return matchesSearch && matchesCategory && matchesStock
  })

  // Obtener nombre del proveedor
  const getProveedorNombre = (proveedorId: string) => {
    const proveedor = proveedores.find((p) => p.id === proveedorId)
    return proveedor?.nombre || 'Sin proveedor'
  }

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  // Manejar eliminación
  const handleDelete = async () => {
    if (!deleteId) return
    
    setIsDeleting(true)
    await deleteProducto(deleteId)
    setIsDeleting(false)
    setDeleteId(null)
  }

  
}
