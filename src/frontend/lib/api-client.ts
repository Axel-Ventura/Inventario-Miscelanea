import { apiUrl } from '@/lib/api-base'

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

let last401Dispatch = 0

function dispatchSessionExpired(message: string) {
  if (typeof window === 'undefined') return
  const now = Date.now()
  if (now - last401Dispatch < 1500) return
  last401Dispatch = now
  window.dispatchEvent(
    new CustomEvent('auth:session-expired', { detail: { message } })
  )
}

/**
 * Peticiones al API Express.
 * - credentials: 'include' para cookie HttpOnly (access_token).
 * - Authorization desde localStorage si existe (compatibilidad).
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }
  if (init.body != null && typeof init.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(apiUrl(normalizePath(path)), {
    ...init,
    headers,
    credentials: 'include',
  })

  if (res.status === 401 && typeof window !== 'undefined') {
    let message = 'Tu sesión expiró o fue cerrada.'
    try {
      const data = await res.clone().json()
      if (typeof data?.message === 'string') message = data.message
    } catch {
      /* ignore */
    }
    dispatchSessionExpired(message)
  }

  if (res.status === 403 && typeof window !== 'undefined') {
    try {
      const data = await res.clone().json()
      if (data?.code === 'FORBIDDEN_ROLE') {
        window.dispatchEvent(new CustomEvent('auth:forbidden', { detail: data }))
      }
    } catch {
      /* ignore */
    }
  }

  return res
}
