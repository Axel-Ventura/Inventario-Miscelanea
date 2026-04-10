const CHANNEL = 'inventario-auth-v1'

export type AuthBroadcastMessage =
  | { type: 'logout' }
  | { type: 'login' }

function getChannel(): BroadcastChannel | null {
  if (typeof BroadcastChannel === 'undefined') return null
  try {
    return new BroadcastChannel(CHANNEL)
  } catch {
    return null
  }
}

export function broadcastAuthLogout(): void {
  const ch = getChannel()
  if (!ch) {
    try {
      localStorage.setItem('auth-broadcast', JSON.stringify({ type: 'logout', t: Date.now() }))
      localStorage.removeItem('auth-broadcast')
    } catch {
      /* ignore */
    }
    return
  }
  ch.postMessage({ type: 'logout' } satisfies AuthBroadcastMessage)
  ch.close()
}

export function broadcastAuthLogin(): void {
  const ch = getChannel()
  if (!ch) return
  ch.postMessage({ type: 'login' } satisfies AuthBroadcastMessage)
  ch.close()
}

export function subscribeAuthBroadcast(
  onLogout: () => void,
  onLogin?: () => void
): () => void {
  const ch = getChannel()
  if (ch) {
    ch.onmessage = (ev: MessageEvent<AuthBroadcastMessage>) => {
      if (ev.data?.type === 'logout') onLogout()
      if (ev.data?.type === 'login' && onLogin) onLogin()
    }
    return () => {
      ch.close()
    }
  }

  const onStorage = (e: StorageEvent) => {
    if (e.key !== 'auth-broadcast' || !e.newValue) return
    try {
      const p = JSON.parse(e.newValue) as AuthBroadcastMessage
      if (p.type === 'logout') onLogout()
    } catch {
      /* ignore */
    }
  }
  window.addEventListener('storage', onStorage)
  return () => window.removeEventListener('storage', onStorage)
}
