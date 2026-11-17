import type { ReactNode } from 'react'
import type { IdentityAuth } from '@/application/ports/IdentityAuth'
import { IdentityAuthContext } from './IdentityAuthContext'

export function IdentityAuthProvider({ identityAuth, children }: { identityAuth: IdentityAuth; children: ReactNode }) {
  return <IdentityAuthContext.Provider value={identityAuth}>{children}</IdentityAuthContext.Provider>
}
