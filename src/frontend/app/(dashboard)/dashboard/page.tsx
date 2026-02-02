'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useInventoryStore } from '@/lib/stores/inventory-store'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Package,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  BoxesIcon,
  DollarSign,
  Users,
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { productos, movimientos, fetchProductos, fetchMovimientos, isLoading } = useInventoryStore()

  useEffect(() => {
    fetchProductos()
    fetchMovimientos()
  }, [fetchProductos, fetchMovimientos])
  
}

