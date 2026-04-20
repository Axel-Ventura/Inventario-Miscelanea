import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import AuthProvider from './AuthProvider'
import { Toaster } from 'sonner'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Sistema de Gestión de Inventarios',
  description: 'Sistema completo para la gestión de inventarios, productos, proveedores y usuarios con accesibilidad WCAG 2.1 AA',
  generator: 'vite',
  icons: {
    icon: [
      {
        url: '',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '',
        type: 'image/svg+xml',
      },
    ],
    apple: '',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>

        <Toaster richColors position="top-center" />
        <Analytics />
      </body>
    </html>
  );
}