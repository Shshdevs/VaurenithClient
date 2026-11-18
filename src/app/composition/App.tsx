import '@mantine/core/styles.css'
import '@mantine/carousel/styles.css'
import { MantineProvider } from '@mantine/core'
import theme from '@/app/theme/AppTheme'
import { AppDependenciesProvider } from './AppDependenciesProvider'
import { AppRouterProvider } from '@/app/routing/AppRouterProvider'

export function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <AppDependenciesProvider>
        <AppRouterProvider />
      </AppDependenciesProvider>
    </MantineProvider>
  )
}
