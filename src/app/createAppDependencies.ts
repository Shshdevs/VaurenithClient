import type { IdentityApi } from '@/application/ports/identity/IdentityApi'
import type { IdentityAuth } from '@/application/ports/identity/IdentityAuth'
import type { ProjectsApi } from '@/application/ports/projects/ProjectsApi'
import type { IdentitySession } from '@/application/ports/session/IdentitySession'
import type { SessionApi } from '@/application/ports/session/SessionApi'
import type { Platform } from '@/application/ports/Platform'
import { FetchApiClient } from '@/infrastructure/api/FetchApiClient'
import { IdentityApiClient } from '@/infrastructure/api/identity/IdentityApiClient'
import { ProjectsApiClient } from '@/infrastructure/api/projects/ProjectsApiClient'
import { SessionApiClient } from '@/infrastructure/api/session/SessionApiClient'
import { KeycloakOidcClient } from '@/infrastructure/identity/KeycloakOidcClient'
import { ApiIdentitySession } from '@/infrastructure/session/ApiIdentitySession'
import { LocalAccessTokenStore } from '@/infrastructure/session/LocalAccessTokenStore'
import { createPlatformAdapter } from './platform'

export type BackendDependencies = {
  identityApi: IdentityApi
  sessionApi: SessionApi
  projectsApi: ProjectsApi
  identitySession: IdentitySession
}

export type AppDependencies = {
  platform: Platform
  identityAuth: IdentityAuth
  backend: BackendDependencies
}

export function createAppDependencies(): AppDependencies {
  const platform = createPlatformAdapter()
  const isDesktop = platform.kind === 'desktop'
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const apiClient = new FetchApiClient(isDesktop ? apiBaseUrl || undefined : (apiBaseUrl ?? ''), !isDesktop)
  const accessTokenStore = new LocalAccessTokenStore()
  const identitySession = new ApiIdentitySession(apiClient, accessTokenStore)
  const identityApi = new IdentityApiClient(apiClient)
  const sessionApi = new SessionApiClient(apiClient)
  const projectsApi = new ProjectsApiClient(apiClient)
  const identityAuth = new KeycloakOidcClient(
    import.meta.env.VITE_OIDC_AUTHORITY ?? '',
    import.meta.env.VITE_OIDC_CLIENT_ID ?? '',
    import.meta.env.VITE_OIDC_REDIRECT_URI ?? `${window.location.origin}/auth/callback`,
    accessTokenStore
  )

  return {
    platform,
    identityAuth,
    backend: { identityApi, sessionApi, projectsApi, identitySession },
  }
}
