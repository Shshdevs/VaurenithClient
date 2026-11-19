import type { ReactNode } from 'react'
import { IdentityApiProvider } from '@/presentation/app/backend/identity/IdentityApiProvider'
import { ProjectsApiProvider } from '@/presentation/app/backend/projects/ProjectsApiProvider'
import { DevicesApiProvider } from '@/presentation/app/backend/infrastructure/DevicesApiProvider'
import { IdentitySessionProvider } from '@/presentation/app/backend/session/IdentitySessionProvider'
import { SessionApiProvider } from '@/presentation/app/backend/session/SessionApiProvider'
import type { BackendDependencies } from '@/app/composition/createAppDependencies'

type BackendProvidersProps = {
  dependencies: BackendDependencies
  children: ReactNode
}

export function BackendProviders({ dependencies, children }: BackendProvidersProps) {
  return (
    <IdentityApiProvider identityApi={dependencies.identityApi}>
      <SessionApiProvider sessionApi={dependencies.sessionApi}>
        <ProjectsApiProvider projectsApi={dependencies.projectsApi}>
          <DevicesApiProvider devicesApi={dependencies.devicesApi}>
            <IdentitySessionProvider identitySession={dependencies.identitySession}>{children}</IdentitySessionProvider>
          </DevicesApiProvider>
        </ProjectsApiProvider>
      </SessionApiProvider>
    </IdentityApiProvider>
  )
}
