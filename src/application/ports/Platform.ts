export type ClientInfo = {
  appName: string
  appVersion: string
  environment: 'web' | 'desktop'
  operatingSystem: string
}

export type PlatformInfo = {
  kind: 'web' | 'desktop'
}

export interface Platform {
  readonly kind: PlatformInfo['kind']
  getClientInfo(): Promise<ClientInfo>
}

export class PlatformError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'PlatformError'
  }
}
