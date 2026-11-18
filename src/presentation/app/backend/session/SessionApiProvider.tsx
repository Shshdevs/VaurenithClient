import type { ReactNode } from 'react'
import type { SessionApi } from '@/application/ports/session/SessionApi'
import { SessionApiContext } from './SessionApiContext'

export function SessionApiProvider({ sessionApi, children }: { sessionApi: SessionApi; children: ReactNode }) {
  return <SessionApiContext.Provider value={sessionApi}>{children}</SessionApiContext.Provider>
}
