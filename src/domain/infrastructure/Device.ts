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
  deviceType: DeviceType
  operatingSystem: string | null
  osVersion: string | null
  architecture: string | null
  tags: string[] | null
  lastSeenAt: Date | null
  lastStatusAt: Date | null
  version: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
