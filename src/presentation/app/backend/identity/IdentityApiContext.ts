import { createContext } from 'react'
import type { IdentityApi } from '@/application/ports/identity/IdentityApi'

export const IdentityApiContext = createContext<IdentityApi | null>(null)
