import { isTauri } from '@tauri-apps/api/core'
import type { Platform } from '@/application/ports/Platform'
import { TauriPlatform } from '@/infrastructure/platform/TauriPlatform'
import { WebPlatform } from '@/infrastructure/platform/WebPlatform'

export function createPlatformAdapter(): Platform {
  return isTauri() ? new TauriPlatform() : new WebPlatform()
}
