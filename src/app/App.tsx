import { BrowserRouter, HashRouter } from 'react-router-dom'
import { LanguageSync } from './LanguageSync'
import { FetchApiClient } from '@/infrastructure/api/FetchApiClient'
import { IdentitySessionProvider } from '@/presentation/app/backend/session/IdentitySessionProvider'
import { PlatformProvider } from '@/presentation/app/platform/PlatformProvider'
import { AppRouter } from '@/presentation/app/routing/AppRouter'
import { ApiIdentitySession } from '@/infrastructure/session/ApiIdentitySession'
import { LocalAccessTokenStore } from '@/infrastructure/session/LocalAccessTokenStore'
import { KeycloakOidcClient } from '@/infrastructure/identity/KeycloakOidcClient'
import { IdentityApiClient } from '@/infrastructure/api/identity/IdentityApiClient'
import { SessionApiClient } from '@/infrastructure/api/session/SessionApiClient'
import { ProjectsApiClient } from '@/infrastructure/api/projects/ProjectsApiClient'
import { IdentityApiProvider } from '@/presentation/app/backend/identity/IdentityApiProvider'
import { IdentityAuthProvider } from '@/presentation/app/identity/IdentityAuthProvider'
import { SessionApiProvider } from '@/presentation/app/backend/session/SessionApiProvider'
import { ProjectsApiProvider } from '@/presentation/app/backend/projects/ProjectsApiProvider'
import theme from './AppTheme'
import '@mantine/core/styles.css'
import '@mantine/carousel/styles.css'
import { MantineProvider } from '@mantine/core'
import { createPlatformAdapter } from './platform'

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

function AppRouterProvider() {
  const Router = isDesktop ? HashRouter : BrowserRouter

  return (
    <Router>
      <LanguageSync />
      <AppRouter />
    </Router>
  )
}

export function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <PlatformProvider platform={platform}>
        <IdentityApiProvider identityApi={identityApi}>
          <IdentityAuthProvider identityAuth={identityAuth}>
            <SessionApiProvider sessionApi={sessionApi}>
              <ProjectsApiProvider projectsApi={projectsApi}>
                <IdentitySessionProvider identitySession={identitySession}>
                  <AppRouterProvider />
                </IdentitySessionProvider>
              </ProjectsApiProvider>
            </SessionApiProvider>
          </IdentityAuthProvider>
        </IdentityApiProvider>
      </PlatformProvider>
    </MantineProvider>
  )
}
