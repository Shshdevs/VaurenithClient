import { invoke } from '@tauri-apps/api/core'
import type { ClientInfo, Platform } from '@/application/ports/Platform'
import { PlatformError } from '@/application/ports/Platform'

export class TauriPlatform implements Platform {
  readonly kind = 'desktop' as const

  async getClientInfo(): Promise<ClientInfo> {
    try {
      return await invoke<ClientInfo>('get_client_info')
    } catch (cause) {
      throw new PlatformError('Unable to read information from the desktop core', { cause })
    }
  }
}
