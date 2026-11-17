import { createContext } from 'react'
import type { SessionApi } from '@/application/ports/session/SessionApi'

export const SessionApiContext = createContext<SessionApi | null>(null)
