import type { ApiEnvelope } from '../ApiClient'
import type { Session } from '@/domain/identity/Session'

export interface SessionApi {
  createDeviceSession(token: string, deviceId: string, signal?: AbortSignal): Promise<ApiEnvelope<Session>>
}
