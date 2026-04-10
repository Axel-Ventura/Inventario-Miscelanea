'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Persiste el estado de un formulario en localStorage (debounce) para recuperar tras recarga o corte de red.
 */
export function usePersistedFormState<T extends Record<string, unknown>>(
  storageKey: string,
  initial: T,
  debounceMs = 400
): [T, (patch: Partial<T> | ((prev: T) => T)) => void, () => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return initial
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return initial
      const parsed = JSON.parse(raw) as T
      return { ...initial, ...parsed }
    } catch {
      return initial
    }
  })

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state))
      } catch {
        /* quota */
      }
    }, debounceMs)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [state, storageKey, debounceMs])

  const setMerged = useCallback((patch: Partial<T> | ((prev: T) => T)) => {
    setState((prev) => (typeof patch === 'function' ? patch(prev) : { ...prev, ...patch }))
  }, [])

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(storageKey)
    } catch {
      /* ignore */
    }
    setState(initial)
  }, [storageKey, initial])

  return [state, setMerged, clear]
}
