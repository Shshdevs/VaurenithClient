import type { ReactNode } from 'react'
import type { ApiClient } from '@/application/ports/ApiClient'
import { ApiClientContext } from './ApiClientContext'

type ApiClientProviderProps = {
  apiClient: ApiClient
  children: ReactNode
}

export function ApiClientProvider({ apiClient, children }: ApiClientProviderProps) {
  return <ApiClientContext.Provider value={apiClient}>{children}</ApiClientContext.Provider>
}
