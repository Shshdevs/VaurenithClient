import { createContext } from 'react'
import type { IdentityApi } from '@/application/ports/IdentityApi'

export const IdentityApiContext = createContext<IdentityApi | null>(null)
