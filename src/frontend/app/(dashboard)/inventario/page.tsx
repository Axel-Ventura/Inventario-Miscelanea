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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BoxesIcon,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Loader2,
  Plus,
} from 'lucide-react'

export default function InventarioPage() {
  const { productos, movimientos, fetchProductos, fetchMovimientos, isLoading } = useInventoryStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [tipoFilter, setTipoFilter] = useState<string>('all')

  useEffect(() => {
    fetchProductos()
    fetchMovimientos()
  }, [fetchProductos, fetchMovimientos])

  
}
