import type {
  ClientDeviceRegisterRequest,
  IdentityApi,
  UserCreateRequest,
} from '@/application/ports/identity/IdentityApi'
import type { IdentityAuth } from '@/application/ports/identity/IdentityAuth'
import type { Platform } from '@/application/ports/Platform'
import type { ClientPlatform } from '@/domain/identity/ClientDevice'

type IdentityAuthorization = NonNullable<Awaited<ReturnType<IdentityAuth['completeAuthorization']>>>

type IdentityFlowDependencies = {
  identityApi: IdentityApi
  identityAuth: IdentityAuth
  platform: Platform
}

export async function completeIdentityFlow({ identityApi, identityAuth, platform }: IdentityFlowDependencies) {
  const authorization = await identityAuth.completeAuthorization()
  if (!authorization) return null

  const token = identityAuth.getAccessToken()
  if (!token) throw new Error('OIDC access token is missing')

  if (authorization.mode === 'register') {
    return registerUser(identityApi, platform, token, authorization)
  }

  return signInUser(identityApi, platform, token, authorization)
}

async function registerUser(
  identityApi: IdentityApi,
  platform: Platform,
  token: string,
  authorization: IdentityAuthorization
): Promise<string> {
  const email = authorization.email
  const displayName = authorization.displayName
  if (!email || !displayName) {
    throw new Error('OIDC registration details are missing')
  }

  const device = await createDeviceRequest(platform)
  const request: UserCreateRequest = {
    email,
    displayName,
    deviceName: device.name,
    platform: device.platform,
  }
  const response = await identityApi.createUser(token, request)

  return requireNickname(response.data?.nickname)
}

async function signInUser(
  identityApi: IdentityApi,
  platform: Platform,
  token: string,
  authorization: IdentityAuthorization
): Promise<string> {
  const email = authorization.email
  if (!email) throw new Error('OIDC email is missing')

  const device = await createDeviceRequest(platform)
  let nickname: string | undefined

  try {
    await identityApi.registerDevice(token, device)
  } catch (error) {
    const displayName = authorization.displayName
    if (!isNotFound(error) || !displayName) throw error
    nickname = await createUserFromSignIn(identityApi, token, email, displayName, device)
  }

  if (!nickname) {
    const response = await identityApi.getCurrentUser(token)
    nickname = response.data?.nickname
  }

  return requireNickname(nickname)
}

async function createUserFromSignIn(
  identityApi: IdentityApi,
  token: string,
  email: string,
  displayName: string,
  device: ClientDeviceRegisterRequest
): Promise<string | undefined> {
  const request: UserCreateRequest = {
    email,
    displayName,
    deviceName: device.name,
    platform: device.platform,
  }
  const response = await identityApi.createUser(token, request)

  return response.data?.nickname
}

async function createDeviceRequest(platform: Platform): Promise<ClientDeviceRegisterRequest> {
  const clientInfo = await platform.getClientInfo()
  const clientPlatform = getClientPlatform(clientInfo.operatingSystem)

  return {
    name: createDeviceName(clientPlatform),
    platform: clientPlatform,
  }
}

function getClientPlatform(operatingSystem: string): ClientPlatform {
  switch (operatingSystem.toLowerCase()) {
    case 'macos':
    case 'darwin':
      return 'macos'
    case 'windows':
    case 'win32':
      return 'windows'
    case 'linux':
    case 'x11':
      return 'linux'
    case 'ios':
    case 'iphone':
    case 'ipad':
      return 'ios'
    case 'android':
      return 'android'
    default:
      return 'other'
  }
}

function createDeviceName(platform: ClientPlatform): string {
  const platformNames: Record<ClientPlatform, string> = {
    macos: 'macOS',
    windows: 'Windows',
    linux: 'Linux',
    ios: 'iOS',
    android: 'Android',
    other: 'Device',
  }
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const randomBytes = crypto.getRandomValues(new Uint8Array(4))
  const suffix = Array.from(randomBytes, (value) => alphabet[value % alphabet.length]).join('')

  return `${platformNames[platform]} ${suffix}`
}

function requireNickname(nickname: string | null | undefined): string {
  if (!nickname) throw new Error('Backend user profile is missing its nickname')
  return nickname
}

function isNotFound(error: unknown): boolean {
  return error instanceof Error && 'statusCode' in error && error.statusCode === 404
}
