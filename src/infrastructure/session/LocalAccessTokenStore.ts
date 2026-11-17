import type { AccessTokenStore } from '@/application/ports/session/AccessTokenStore'

const ACCESS_TOKEN_KEY = 'vaurenith.access_token'

export class LocalAccessTokenStore implements AccessTokenStore {
  get() {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  }

  set(token: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  }

  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  }
}
