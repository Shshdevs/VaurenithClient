import type { ApiEnvelope } from '../ApiClient'
import type { Device, DeviceId, DeviceType } from '@/domain/infrastructure/Device'

export type DeviceCreateRequest = {
  name: string
  description: string | null
  deviceType: DeviceType
  hostname: string | null
  operatingSystem: string | null
  osVersion: string | null
  architecture: string | null
  tags: string[] | null
}

export type DeviceUpdateRequest = {
  name: string
  description: string | null
  deviceType: DeviceType
  hostname: string | null
  operatingSystem: string | null
  osVersion: string | null
  architecture: string | null
  tags: string[] | null
  version: number
}

export interface DevicesApi {
  getDevices(token: string, signal?: AbortSignal): Promise<ApiEnvelope<Device[]>>
  getDevice(token: string, device_id: DeviceId, signal?: AbortSignal): Promise<ApiEnvelope<Device>>
  createDevice(token: string, request: DeviceCreateRequest, signal?: AbortSignal): Promise<ApiEnvelope<Device>>
  updateDevice(
    token: string,
    device_id: DeviceId,
    request: DeviceUpdateRequest,
    signal?: AbortSignal
  ): Promise<ApiEnvelope<Device>>
  deleteDevice(token: string, device_id: DeviceId, signal?: AbortSignal): Promise<ApiEnvelope<null>>
}
