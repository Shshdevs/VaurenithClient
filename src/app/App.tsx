import { BrowserRouter, HashRouter } from 'react-router-dom'
import { LanguageSync } from './LanguageSync'
import { FetchApiClient } from '@/infrastructure/api/FetchApiClient'
import { ApiClientProvider } from '@/presentation/app/ApiClientProvider'
import { IdentitySessionProvider } from '@/presentation/app/IdentitySessionProvider'
import { PlatformProvider } from '@/presentation/app/PlatformProvider'
import { AppRouter } from '@/presentation/app/AppRouter'
import { ApiIdentitySession } from '@/infrastructure/identity/ApiIdentitySession'
import { LocalAccessTokenStore } from '@/infrastructure/identity/LocalAccessTokenStore'
import { KeycloakOidcClient } from '@/infrastructure/identity/KeycloakOidcClient'
import { IdentityApiClient } from '@/infrastructure/api/IdentityApiClient'
import { IdentityApiProvider } from '@/presentation/app/IdentityApiProvider'
import { IdentityAuthProvider } from '@/presentation/app/IdentityAuthProvider'
import theme from './AppTheme'
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
import { createPlatformAdapter } from './platform'

const platform = createPlatformAdapter()
const isDesktop = platform.kind === 'desktop'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const apiClient = new FetchApiClient(isDesktop ? apiBaseUrl || undefined : (apiBaseUrl ?? ''), !isDesktop)
const accessTokenStore = new LocalAccessTokenStore()
const identitySession = new ApiIdentitySession(apiClient, accessTokenStore)
const identityApi = new IdentityApiClient(apiClient)
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
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <ApiClientProvider apiClient={apiClient}>
        <PlatformProvider platform={platform}>
          <IdentityApiProvider identityApi={identityApi}>
            <IdentityAuthProvider identityAuth={identityAuth}>
              <IdentitySessionProvider identitySession={identitySession}>
                <AppRouterProvider />
              </IdentitySessionProvider>
            </IdentityAuthProvider>
          </IdentityApiProvider>
        </PlatformProvider>
      </ApiClientProvider>
    </MantineProvider>
  )
}
