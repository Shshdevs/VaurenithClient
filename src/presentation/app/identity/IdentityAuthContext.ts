import { createContext } from 'react'
import type { IdentityAuth } from '@/application/ports/identity/IdentityAuth'

export const IdentityAuthContext = createContext<IdentityAuth | null>(null)
