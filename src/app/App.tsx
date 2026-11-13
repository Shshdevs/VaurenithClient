import { BrowserRouter, HashRouter } from 'react-router-dom'
import { LanguageSync } from './LanguageSync'
import { FetchApiClient } from '@/infrastructure/api/FetchApiClient'
import { ApiClientProvider } from '@/presentation/app/ApiClientProvider'
import { AppRouter } from '@/presentation/app/AppRouter'
import theme from './AppTheme'
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
import { createPlatformAdapter } from './platform'

const platform = createPlatformAdapter()
const isDesktop = platform.kind === 'desktop'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const apiClient = new FetchApiClient(isDesktop ? apiBaseUrl || undefined : (apiBaseUrl ?? ''), !isDesktop)

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
    <MantineProvider theme={theme}>
      <ApiClientProvider apiClient={apiClient}>
        <AppRouterProvider />
      </ApiClientProvider>
    </MantineProvider>
  )
}
