import type { AccessTokenStore } from '@/application/ports/AccessTokenStore'
import type { IdentityAuth } from '@/application/ports/IdentityAuth'

type OidcConfiguration = {
  authorization_endpoint: string
  token_endpoint: string
  userinfo_endpoint: string
}

type TokenResponse = {
  access_token: string
  token_type: string
}

type UserInfo = {
  email?: string
  email_verified?: boolean
  display_name?: string
}

type PendingAuthorization = {
  state: string
  verifier: string
  mode: 'register' | 'login'
  createdAt: number
}

const PENDING_AUTHORIZATION_PREFIX = 'vaurenith.oidc.pending.'
const PENDING_AUTHORIZATION_MAX_AGE = 24 * 60 * 60 * 1000

export class KeycloakOidcClient implements IdentityAuth {
  private readonly authority: string
  private readonly clientId: string
  private readonly tokenStore: AccessTokenStore
  private readonly redirectUri: string

  constructor(authority: string, clientId: string, redirectUri: string, tokenStore: AccessTokenStore) {
    this.authority = authority.replace(/\/$/, '')
    this.clientId = clientId
    this.redirectUri = redirectUri
    this.tokenStore = tokenStore
  }

  async authorize(mode: 'register' | 'login') {
    this.tokenStore.clear()
    const configuration = await this.getConfiguration()
    const verifier = createRandomValue()
    const state = createRandomValue()
    const challenge = await createCodeChallenge(verifier)
    cleanupPendingAuthorizations()
    const pending: PendingAuthorization = { state, verifier, mode, createdAt: Date.now() }
    localStorage.setItem(`${PENDING_AUTHORIZATION_PREFIX}${state}`, JSON.stringify(pending))

    const url = new URL(configuration.authorization_endpoint)
    url.search = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      ...(mode === 'register' ? { prompt: 'create' } : {}),
      state,
      code_challenge: challenge,
      code_challenge_method: 'S256',
    }).toString()

    window.location.assign(url)
  }

  getAccessToken() {
    return this.tokenStore.get()
  }

  async completeAuthorization(): Promise<{
    mode: 'register' | 'login'
    email?: string
    displayName?: string
  } | null> {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state')
    const pendingKey = state ? `${PENDING_AUTHORIZATION_PREFIX}${state}` : null
    const rawPending = pendingKey ? localStorage.getItem(pendingKey) : null
    if (!code && !params.has('error')) return null

    window.history.replaceState({}, document.title, window.location.pathname + window.location.hash)

    if (!rawPending) throw new Error('OIDC authorization state is missing')
    const pending = JSON.parse(rawPending) as PendingAuthorization
    if (params.get('state') !== pending.state) throw new Error('OIDC authorization state is invalid')
    if (Date.now() - pending.createdAt > PENDING_AUTHORIZATION_MAX_AGE) {
      localStorage.removeItem(pendingKey!)
      throw new Error('OIDC authorization state has expired')
    }
    localStorage.removeItem(pendingKey!)
    if (params.has('error')) throw new Error('OIDC authorization failed')
    if (!code) throw new Error('OIDC authorization code is missing')

    const configuration = await this.getConfiguration()
    const response = await fetch(configuration.token_endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.clientId,
        code,
        redirect_uri: this.redirectUri,
        code_verifier: pending.verifier,
      }),
    })

    if (!response.ok) throw new Error('OIDC token exchange failed')
    const tokens = (await response.json()) as TokenResponse
    if (tokens.token_type.toLowerCase() !== 'bearer' || !tokens.access_token) {
      throw new Error('OIDC token response is invalid')
    }

    const userInfoResponse = await fetch(configuration.userinfo_endpoint, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    if (!userInfoResponse.ok) throw new Error('OIDC user information could not be loaded')
    const userInfo = (await userInfoResponse.json()) as UserInfo
    if (userInfo.email_verified !== true) throw new Error('OIDC email is not verified')
    if (!userInfo.email || (pending.mode === 'register' && !userInfo.display_name?.trim())) {
      throw new Error('OIDC profile information is incomplete')
    }
    this.tokenStore.set(tokens.access_token)
    return {
      mode: pending.mode,
      email: userInfo.email,
      displayName: userInfo.display_name,
    }
  }

  private async getConfiguration(): Promise<OidcConfiguration> {
    const response = await fetch(`${this.authority}/.well-known/openid-configuration`)
    if (!response.ok) throw new Error('Unable to load OIDC configuration')
    return (await response.json()) as OidcConfiguration
  }
}

function cleanupPendingAuthorizations() {
  const pendingKeys = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index)).filter(
    (key): key is string => key?.startsWith(PENDING_AUTHORIZATION_PREFIX) ?? false
  )

  for (const key of pendingKeys) {
    const rawPending = localStorage.getItem(key)
    if (!rawPending) {
      localStorage.removeItem(key)
      continue
    }
    try {
      const pending = JSON.parse(rawPending) as PendingAuthorization
      if (Date.now() - pending.createdAt > PENDING_AUTHORIZATION_MAX_AGE) localStorage.removeItem(key)
    } catch {
      localStorage.removeItem(key)
    }
  }
}

function createRandomValue() {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return encodeBase64Url(bytes)
}

async function createCodeChallenge(verifier: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  return encodeBase64Url(new Uint8Array(digest))
}

function encodeBase64Url(bytes: Uint8Array) {
  let binary = ''
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)))
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
