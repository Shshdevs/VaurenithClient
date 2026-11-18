import type { DevicesApi } from '@/application/ports/infrastructure/DevicesApi'
import type { ReactNode } from 'react'
import { DevicesApiContext } from './DevicesApiContext'

export function DevicesApiProvider({ devicesApi, children }: { devicesApi: DevicesApi; children: ReactNode }) {
  return <DevicesApiContext.Provider value={devicesApi}>{children}</DevicesApiContext.Provider>
}
