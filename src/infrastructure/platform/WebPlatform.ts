import type { Platform } from '@/application/ports/Platform'
import { PlatformError } from '@/application/ports/Platform'

export class WebPlatform implements Platform {
  readonly kind = 'web' as const

  async getClientInfo(): Promise<never> {
    throw new PlatformError('Native client information is unavailable in the web application')
  }
}
