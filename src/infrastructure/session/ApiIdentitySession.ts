import type { IdentitySession } from '@/application/ports/session/IdentitySession'
import type { ApiClient } from '@/application/ports/ApiClient'
import { ApiError } from '@/infrastructure/api/ApiError'
import type { AccessTokenStore } from '@/application/ports/session/AccessTokenStore'

export class ApiIdentitySession implements IdentitySession {
  private readonly apiClient: ApiClient
  private readonly tokenStore: AccessTokenStore

  constructor(apiClient: ApiClient, tokenStore: AccessTokenStore) {
    this.apiClient = apiClient
    this.tokenStore = tokenStore
  }

  async isActive(signal?: AbortSignal): Promise<boolean> {
    try {
      const token = this.tokenStore.get()
      if (!token) return false
      await this.apiClient.request<unknown>('/api/v1/users/me', {
        signal,
        headers: { Authorization: `Bearer ${token}` },
      })
      return true
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        return false
      }

      throw error
    }
  }
}
