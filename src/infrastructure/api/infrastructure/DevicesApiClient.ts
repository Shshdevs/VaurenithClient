import type { ApiClient, ApiEnvelope } from '@/application/ports/ApiClient'
import type {
  DevicesApi,
  DeviceCreateRequest,
  DeviceUpdateRequest,
} from '@/application/ports/infrastructure/DevicesApi'
import type { Device, DeviceId } from '@/domain/infrastructure/Device'
import { mapApiEnvelope } from '../mapApiEnvelope'

type DeviceResponse = {
  id: string
  user_id: string
  name: string
  slug: string
  description: string | null
  hostname: string | null
  device_type: Device['deviceType']
  operating_system: string | null
  os_version: string | null
  architecture: string | null
  tags: string[] | null
  last_seen_at: string | null
  last_status_at: string | null
  version: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

const API_VERSION_PATH = '/api/v1'

export class DevicesApiClient implements DevicesApi {
  private readonly apiClient: ApiClient

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient
  }

  async getDevices(token: string, signal?: AbortSignal): Promise<ApiEnvelope<Device[]>> {
    const response = await this.request<DeviceResponse[]>('/devices', token, {
      method: 'GET',
      signal: signal,
    })

    return mapApiEnvelope(response, (devices) => devices.map(mapDevice))
  }
  async getDevice(token: string, device_id: DeviceId, signal?: AbortSignal): Promise<ApiEnvelope<Device>> {
    const response = await this.request<DeviceResponse>(`/devices/${encodeURIComponent(device_id)}`, token, {
      method: 'GET',
      signal: signal,
    })

    return mapApiEnvelope(response, mapDevice)
  }
  async createDevice(token: string, request: DeviceCreateRequest, signal?: AbortSignal): Promise<ApiEnvelope<Device>> {
    const response = await this.request<DeviceResponse>('/devices', token, {
      method: 'POST',
      body: toDeviceRequest(request),
      signal: signal,
    })

    return mapApiEnvelope(response, mapDevice)
  }
  async updateDevice(
    token: string,
    device_id: DeviceId,
    request: DeviceUpdateRequest,
    signal?: AbortSignal
  ): Promise<ApiEnvelope<Device>> {
    const response = await this.request<DeviceResponse>(`/devices/${encodeURIComponent(device_id)}`, token, {
      method: 'PUT',
      body: toDeviceRequest(request),
      signal: signal,
    })
    return mapApiEnvelope(response, mapDevice)
  }

  deleteDevice(token: string, device_id: DeviceId, signal?: AbortSignal): Promise<ApiEnvelope<null>> {
    return this.request(`/devices/${encodeURIComponent(device_id)}`, token, {
      method: 'DELETE',
      signal: signal,
    })
  }

  private request<TData>(
    path: string,
    token: string,
    options: {
      method: 'GET' | 'POST' | 'PUT' | 'DELETE'
      body?: unknown
      signal?: AbortSignal
    }
  ): Promise<ApiEnvelope<TData>> {
    return this.apiClient.request<TData>(`${API_VERSION_PATH}${path}`, {
      ...options,
      headers: { Authorization: `Bearer ${token}` },
    })
  }
}

function mapDevice(device: DeviceResponse): Device {
  return {
    id: device.id,
    userId: device.user_id,
    name: device.name,
    slug: device.slug,
    description: device.description,
    hostname: device.hostname,
    deviceType: device.device_type,
    operatingSystem: device.operating_system,
    osVersion: device.os_version,
    architecture: device.architecture,
    tags: device.tags,
    lastSeenAt: device.last_seen_at ? new Date(device.last_seen_at) : null,
    lastStatusAt: device.last_status_at ? new Date(device.last_status_at) : null,
    version: device.version,
    createdAt: new Date(device.created_at),
    updatedAt: new Date(device.updated_at),
    deletedAt: device.deleted_at ? new Date(device.deleted_at) : null,
  }
}

function toDeviceRequest(request: DeviceCreateRequest | DeviceUpdateRequest) {
  const { deviceType, ...fields } = request
  return {
    ...fields,
    device_type: deviceType,
  }
}
