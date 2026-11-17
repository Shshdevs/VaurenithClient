import { createContext } from 'react'
import type { IdentitySession } from '@/application/ports/IdentitySession'

export const IdentitySessionContext = createContext<IdentitySession | null>(null)
