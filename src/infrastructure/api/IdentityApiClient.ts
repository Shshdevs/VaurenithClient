import type { ApiClient, ApiEnvelope } from '@/application/ports/ApiClient'
import type {
  ClientDeviceData,
  ClientDeviceRegisterRequest,
  IdentityApi,
  SessionData,
  UserCreateRequest,
  UserData,
} from '@/application/ports/IdentityApi'

const API_VERSION_PATH = '/api/v1'

export class IdentityApiClient implements IdentityApi {
  private readonly apiClient: ApiClient

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient
  }

  createUser(token: string, request: UserCreateRequest, signal?: AbortSignal) {
    return this.request<UserData>('/users/create', token, { method: 'POST', body: request, signal })
  }

  getCurrentUser(token: string, signal?: AbortSignal) {
    return this.request<UserData>('/users/me', token, { signal })
  }

  logout(token: string, signal?: AbortSignal) {
    return this.request<null>('/users/logout', token, { method: 'POST', signal })
  }

  registerDevice(token: string, request: ClientDeviceRegisterRequest, signal?: AbortSignal) {
    return this.request<ClientDeviceData>('/users/me/devices', token, { method: 'POST', body: request, signal })
  }

  createDeviceSession(token: string, deviceId: string, signal?: AbortSignal) {
    return this.request<SessionData>(`/users/me/devices/${encodeURIComponent(deviceId)}/sessions`, token, {
      method: 'POST',
      signal,
    })
  }

  private request<TData>(
    path: string,
    token: string,
    options: { method?: 'GET' | 'POST'; body?: unknown; signal?: AbortSignal }
  ): Promise<ApiEnvelope<TData>> {
    return this.apiClient.request<TData>(`${API_VERSION_PATH}${path}`, {
      ...options,
      headers: { Authorization: `Bearer ${token}` },
    })
  }
}
