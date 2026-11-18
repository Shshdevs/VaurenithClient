import '@mantine/core/styles.css'
import '@mantine/carousel/styles.css'
import { MantineProvider } from '@mantine/core'
import theme from './AppTheme'
import { AppDependenciesProvider } from './AppDependenciesProvider'
import { AppRouterProvider } from './AppRouterProvider'

export function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <AppDependenciesProvider>
        <AppRouterProvider />
      </AppDependenciesProvider>
    </MantineProvider>
  )
}
