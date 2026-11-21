import { useEffect, useState } from 'react'
import { useIdentitySession } from './useIdentitySession'

export type IdentitySessionStatus = 'checking' | 'active' | 'inactive' | 'error'

export function useIdentitySessionStatus() {
  const identitySession = useIdentitySession()
  const [status, setStatus] = useState<IdentitySessionStatus>('checking')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    void identitySession
      .isActive(controller.signal)
      .then((isActive) => {
        if (isMounted) {
          setStatus(isActive ? 'active' : 'inactive')
        }
      })
      .catch(() => {
        if (isMounted) {
          setStatus('error')
        }
      })

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [identitySession, retryCount])

  function retry() {
    setStatus('checking')
    setRetryCount((count) => count + 1)
  }

  return { status, retry }
}
