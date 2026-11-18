import type { ReactNode } from 'react'
import { IdentityAuthProvider } from '@/presentation/app/identity/IdentityAuthProvider'
import { PlatformProvider } from '@/presentation/app/platform/PlatformProvider'
import { BackendProviders } from './BackendProviders'
import { createAppDependencies } from './createAppDependencies'

const dependencies = createAppDependencies()

type AppDependenciesProviderProps = {
  children: ReactNode
}

export function AppDependenciesProvider({ children }: AppDependenciesProviderProps) {
  return (
    <PlatformProvider platform={dependencies.platform}>
      <IdentityAuthProvider identityAuth={dependencies.identityAuth}>
        <BackendProviders dependencies={dependencies.backend}>{children}</BackendProviders>
      </IdentityAuthProvider>
    </PlatformProvider>
  )
}
