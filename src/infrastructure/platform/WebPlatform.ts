import type { Platform } from '@/application/ports/Platform'
import packageInfo from '../../../package.json'

export class WebPlatform implements Platform {
  readonly kind = 'web' as const

  async getClientInfo() {
    return {
      appName: 'Vaurenith',
      appVersion: packageInfo.version,
      environment: 'web' as const,
      operatingSystem: getOperatingSystem(),
    }
  }
}

function getOperatingSystem(): string {
  const userAgent = navigator.userAgent.toLowerCase()
  const browserPlatform = navigator.platform.toLowerCase()

  if (/iphone|ipad|ipod/.test(userAgent) || (browserPlatform === 'macintel' && navigator.maxTouchPoints > 1)) {
    return 'ios'
  }
  if (/android/.test(userAgent)) return 'android'
  if (/mac|darwin/.test(browserPlatform)) return 'macos'
  if (/win/.test(browserPlatform)) return 'windows'
  if (/linux|x11/.test(browserPlatform)) return 'linux'
  return 'other'
}
