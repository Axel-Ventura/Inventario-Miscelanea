'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { subscribeAuthBroadcast } from '@/lib/auth-broadcast'
import { apiUrl } from '@/lib/api-base'
import { useAuthStore } from '@/lib/stores/auth-store'

/**
 * Sincroniza logout entre pestañas y reacciona a 401 del api-client.
 */
export function SessionSync() {
  const router = useRouter()
  const logoutLocalOnly = useAuthStore((s) => s.logoutLocalOnly)
  const handling = useRef(false)

  useEffect(() => {
    const onRemoteLogout = async () => {
      if (handling.current) return
      handling.current = true
      const token = localStorage.getItem('token')
      try {
        await fetch(apiUrl('/api/auth/logout'), {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })
      } catch {
        /* ignore */
      }
      logoutLocalOnly()
      toast.info('Sesión cerrada en otra pestaña')
      router.replace('/login?reason=sync')
      handling.current = false
    }

    const unsub = subscribeAuthBroadcast(onRemoteLogout)
    return unsub
  }, [logoutLocalOnly, router])

  useEffect(() => {
    const onExpired = (ev: Event) => {
      const msg =
        (ev as CustomEvent<{ message?: string }>).detail?.message ??
        'Tu sesión expiró. Vuelve a iniciar sesión.'
      toast.error(msg)
      logoutLocalOnly()
      router.replace('/login?reason=expired')
    }

    window.addEventListener('auth:session-expired', onExpired)
    return () => window.removeEventListener('auth:session-expired', onExpired)
  }, [logoutLocalOnly, router])

  return null
}
