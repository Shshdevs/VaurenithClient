import type { ApiEnvelope } from './ApiClient'

export type PlatformType = 'macos' | 'windows' | 'linux' | 'ios' | 'android' | 'other'

export type UserCreateRequest = {
  email: string
  display_name: string
  device_name: string
  platform: PlatformType
}

export type UserData = {
  id: string
  email: string
  display_name: string | null
  nickname: string
  auth_provider: string | null
  created_at: string
  updated_at: string
}

export type ClientDeviceRegisterRequest = {
  name: string
  platform: PlatformType
  app_version?: string | null
}

export type ClientDeviceData = {
  id: string
  name: string
  platform: PlatformType
  app_version: string | null
  status: string
  registered_at: string
  last_seen_at: string | null
  revoked_at: string | null
}

export type SessionData = {
  id: string
  client_device_id: string
  created_at: string
  expires_at: string
  revoked_at: string | null
}

export interface IdentityApi {
  createUser(token: string, request: UserCreateRequest, signal?: AbortSignal): Promise<ApiEnvelope<UserData>>
  getCurrentUser(token: string, signal?: AbortSignal): Promise<ApiEnvelope<UserData>>
  logout(token: string, signal?: AbortSignal): Promise<ApiEnvelope<null>>
  registerDevice(
    token: string,
    request: ClientDeviceRegisterRequest,
    signal?: AbortSignal
  ): Promise<ApiEnvelope<ClientDeviceData>>
  createDeviceSession(token: string, deviceId: string, signal?: AbortSignal): Promise<ApiEnvelope<SessionData>>
}
