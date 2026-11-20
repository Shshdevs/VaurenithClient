import type { ReactNode } from 'react'
import type { EnvironmentsApi } from '@/application/ports/projects/EnvironmentsApi'
import { EnvironmentsApiContext } from './EnvironmentsApiContext'

export function EnvironmentsApiProvider({
  environmentsApi,
  children,
}: {
  environmentsApi: EnvironmentsApi
  children: ReactNode
}) {
  return <EnvironmentsApiContext.Provider value={environmentsApi}>{children}</EnvironmentsApiContext.Provider>
}
