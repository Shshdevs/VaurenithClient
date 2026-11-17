import type { ApiEnvelope } from '../ApiClient'
import type { ClientDevice, ClientPlatform } from '@/domain/identity/ClientDevice'
import type { User } from '@/domain/identity/User'

export type UserCreateRequest = {
  email: string
  displayName: string
  deviceName: string
  platform: ClientPlatform
}

export type ClientDeviceRegisterRequest = {
  name: string
  platform: ClientPlatform
  appVersion?: string | null
}

export interface IdentityApi {
  createUser(token: string, request: UserCreateRequest, signal?: AbortSignal): Promise<ApiEnvelope<User>>
  getCurrentUser(token: string, signal?: AbortSignal): Promise<ApiEnvelope<User>>
  logout(token: string, signal?: AbortSignal): Promise<ApiEnvelope<null>>
  registerDevice(
    token: string,
    request: ClientDeviceRegisterRequest,
    signal?: AbortSignal
  ): Promise<ApiEnvelope<ClientDevice>>
}
