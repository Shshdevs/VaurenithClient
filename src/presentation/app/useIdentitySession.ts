import { useContext } from 'react'
import { IdentitySessionContext } from './IdentitySessionContext'

export function useIdentitySession() {
  const identitySession = useContext(IdentitySessionContext)

  if (!identitySession) {
    throw new Error('IdentitySessionProvider is missing')
  }

  return identitySession
}
