import type { ReactNode } from 'react'
import type { IdentitySession } from '@/application/ports/IdentitySession'
import { IdentitySessionContext } from './IdentitySessionContext'

type IdentitySessionProviderProps = {
  identitySession: IdentitySession
  children: ReactNode
}

export function IdentitySessionProvider({ identitySession, children }: IdentitySessionProviderProps) {
  return <IdentitySessionContext.Provider value={identitySession}>{children}</IdentitySessionContext.Provider>
}
