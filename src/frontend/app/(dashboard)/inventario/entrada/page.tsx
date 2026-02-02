'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useInventoryStore } from '@/lib/stores/inventory-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Loader2, AlertCircle, TrendingUp, Package } from 'lucide-react'

export default function EntradaInventarioPage() {
  const router = useRouter()
  const { productos, fetchProductos, addMovimiento, isLoading, error, clearError } = useInventoryStore()

  const [formData, setFormData] = useState({
    productoId: '',
    cantidad: '',
    motivo: '',
  })

  
}
