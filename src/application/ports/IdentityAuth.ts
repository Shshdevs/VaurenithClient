export interface IdentityAuth {
  authorize(mode: 'register' | 'login'): Promise<void>
  completeAuthorization(): Promise<{
    mode: 'register' | 'login'
    email?: string
    displayName?: string
  } | null>
  getAccessToken(): string | null
}
