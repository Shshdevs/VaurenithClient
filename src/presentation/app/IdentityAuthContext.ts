import { createContext } from 'react'
import type { IdentityAuth } from '@/application/ports/IdentityAuth'

export const IdentityAuthContext = createContext<IdentityAuth | null>(null)
