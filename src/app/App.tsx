import { BrowserRouter } from 'react-router-dom'
import { FetchApiClient } from '@/infrastructure/api/FetchApiClient'
import { ApiClientProvider } from '@/presentation/app/ApiClientProvider'
import { AppRouter } from '@/presentation/app/AppRouter'

const apiClient = new FetchApiClient(import.meta.env.VITE_API_BASE_URL ?? '')

export function App() {
  return (
    <ApiClientProvider apiClient={apiClient}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ApiClientProvider>
  )
}
