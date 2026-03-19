import { LoginForm } from '@/components/login-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Iniciar Sesion - Miscelanea',
  description: 'Ingresa al sistema de inventario de la miscelanea',
}

export default function LoginPage() {
  return <LoginForm />
}
