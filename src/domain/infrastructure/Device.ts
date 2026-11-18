import type { UserId } from '@/domain/identity/User'

export type DeviceId = string
export type DeviceType = 'physical' | 'virtual' | 'vps' | 'cloud' | 'other'

export type Device = {
  id: DeviceId
  userId: UserId
  name: string
  slug: string
  hostname: string | null
  description: string | null
  device_type: DeviceType
  operating_system: string | null
  os_version: string | null
  architecture: string | null
  tags: string[] | null
  last_seen_at: Date | null
  last_status_at: Date | null
  version: number
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
