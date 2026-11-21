import { isTauri } from '@tauri-apps/api/core'
import { TauriPlatform } from '@/infrastructure/platform/TauriPlatform'
import { WebPlatform } from '@/infrastructure/platform/WebPlatform'
import type { Platform } from '@/application/ports/Platform'

export function createPlatformAdapter(): Platform {
  return isTauri() ? new TauriPlatform() : new WebPlatform()
}
