export type ClientDeviceId = string
export type ClientPlatform = 'macos' | 'windows' | 'linux' | 'ios' | 'android' | 'other'
export type ClientDeviceStatus = 'active' | 'inactive' | 'revoked'

export type ClientDevice = {
  id: ClientDeviceId
  name: string
  platform: ClientPlatform
  appVersion: string | null
  status: ClientDeviceStatus
  registeredAt: Date
  lastSeenAt: Date | null
  revokedAt: Date | null
}
