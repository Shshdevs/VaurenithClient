import { BrowserRouter } from 'react-router-dom'
import { FetchApiClient } from '@/infrastructure/api/FetchApiClient'
import { ApiClientProvider } from '@/presentation/app/ApiClientProvider'
import { AppRouter } from '@/presentation/app/AppRouter'
import theme from './AppTheme'
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'

const apiClient = new FetchApiClient(import.meta.env.VITE_API_BASE_URL ?? '')

export function App() {
  return (
    <MantineProvider theme={theme}>
      {
        <ApiClientProvider apiClient={apiClient}>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </ApiClientProvider>
      }
    </MantineProvider>
  )
}
