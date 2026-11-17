import type { ReactNode } from 'react'
import type { IdentityApi } from '@/application/ports/IdentityApi'
import { IdentityApiContext } from './IdentityApiContext'

export function IdentityApiProvider({ identityApi, children }: { identityApi: IdentityApi; children: ReactNode }) {
  return <IdentityApiContext.Provider value={identityApi}>{children}</IdentityApiContext.Provider>
}
