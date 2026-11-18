import { useContext } from 'react'
import { IdentitySessionContext } from '@/presentation/app/backend/session/IdentitySessionContext'

export function useIdentitySession() {
  const identitySession = useContext(IdentitySessionContext)

  if (!identitySession) {
    throw new Error('IdentitySessionProvider is missing')
  }

  return identitySession
}
