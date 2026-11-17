import type { ApiClient, ApiEnvelope } from '@/application/ports/ApiClient'
import type { SessionApi } from '@/application/ports/session/SessionApi'
import type { Session } from '@/domain/identity/Session'
import { mapApiEnvelope } from '../mapApiEnvelope'

type SessionResponse = {
  id: string
  client_device_id: string
  created_at: string
  expires_at: string
  revoked_at: string | null
}

const API_VERSION_PATH = '/api/v1'

export class SessionApiClient implements SessionApi {
  private readonly apiClient: ApiClient

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient
  }

  async createDeviceSession(token: string, deviceId: string, signal?: AbortSignal): Promise<ApiEnvelope<Session>> {
    const response = await this.apiClient.request<SessionResponse>(
      `${API_VERSION_PATH}/users/me/devices/${encodeURIComponent(deviceId)}/sessions`,
      {
        method: 'POST',
        signal,
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    return mapApiEnvelope(response, (session) => ({
      id: session.id,
      clientDeviceId: session.client_device_id,
      createdAt: new Date(session.created_at),
      expiresAt: new Date(session.expires_at),
      revokedAt: session.revoked_at ? new Date(session.revoked_at) : null,
    }))
  }
}
