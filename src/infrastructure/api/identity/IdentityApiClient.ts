import type { ApiClient, ApiEnvelope } from '@/application/ports/ApiClient'
import type {
  ClientDeviceRegisterRequest,
  IdentityApi,
  UserCreateRequest,
} from '@/application/ports/identity/IdentityApi'
import type { ClientDevice, ClientDeviceStatus } from '@/domain/identity/ClientDevice'
import type { User } from '@/domain/identity/User'
import { mapApiEnvelope } from '../mapApiEnvelope'

type UserResponse = {
  id: string
  email: string
  display_name: string | null
  nickname: string
  auth_provider: string | null
  created_at: string
  updated_at: string
}

type ClientDeviceResponse = {
  id: string
  name: string
  platform: ClientDevice['platform']
  app_version: string | null
  status: ClientDeviceStatus
  registered_at: string
  last_seen_at: string | null
  revoked_at: string | null
}

const API_VERSION_PATH = '/api/v1'

export class IdentityApiClient implements IdentityApi {
  private readonly apiClient: ApiClient

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient
  }

  async createUser(token: string, request: UserCreateRequest, signal?: AbortSignal) {
    const response = await this.request<UserResponse>('/users/create', token, {
      method: 'POST',
      body: {
        email: request.email,
        display_name: request.displayName,
        device_name: request.deviceName,
        platform: request.platform,
      },
      signal,
    })
    return mapApiEnvelope(response, mapUser)
  }

  async getCurrentUser(token: string, signal?: AbortSignal) {
    const response = await this.request<UserResponse>('/users/me', token, { signal })
    return mapApiEnvelope(response, mapUser)
  }

  logout(token: string, signal?: AbortSignal) {
    return this.request<null>('/users/logout', token, { method: 'POST', signal })
  }

  async registerDevice(token: string, request: ClientDeviceRegisterRequest, signal?: AbortSignal) {
    const response = await this.request<ClientDeviceResponse>('/users/me/devices', token, {
      method: 'POST',
      body: {
        name: request.name,
        platform: request.platform,
        app_version: request.appVersion,
      },
      signal,
    })
    return mapApiEnvelope(response, mapClientDevice)
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

function mapUser(user: UserResponse): User {
  return {
    id: user.id,
    email: user.email,
    displayName: user.display_name,
    nickname: user.nickname,
    authProvider: user.auth_provider,
    createdAt: new Date(user.created_at),
    updatedAt: new Date(user.updated_at),
  }
}

function mapClientDevice(device: ClientDeviceResponse): ClientDevice {
  return {
    id: device.id,
    name: device.name,
    platform: device.platform,
    appVersion: device.app_version,
    status: device.status,
    registeredAt: new Date(device.registered_at),
    lastSeenAt: device.last_seen_at ? new Date(device.last_seen_at) : null,
    revokedAt: device.revoked_at ? new Date(device.revoked_at) : null,
  }
}
