import { useContext } from 'react'
import { ApiClientContext } from './ApiClientContext'
import type { ApiClient } from '@/application/ports/ApiClient'

export function useApiClient(): ApiClient {
  const apiClient = useContext(ApiClientContext)

  if (!apiClient) {
    throw new Error('ApiClientProvider is missing')
  }

  return apiClient
}
