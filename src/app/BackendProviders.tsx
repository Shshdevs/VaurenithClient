import type { ReactNode } from 'react'
import { IdentityApiProvider } from '@/presentation/app/backend/identity/IdentityApiProvider'
import { ProjectsApiProvider } from '@/presentation/app/backend/projects/ProjectsApiProvider'
import { IdentitySessionProvider } from '@/presentation/app/backend/session/IdentitySessionProvider'
import { SessionApiProvider } from '@/presentation/app/backend/session/SessionApiProvider'
import type { BackendDependencies } from './createAppDependencies'

type BackendProvidersProps = {
  dependencies: BackendDependencies
  children: ReactNode
}

export function BackendProviders({ dependencies, children }: BackendProvidersProps) {
  return (
    <IdentityApiProvider identityApi={dependencies.identityApi}>
      <SessionApiProvider sessionApi={dependencies.sessionApi}>
        <ProjectsApiProvider projectsApi={dependencies.projectsApi}>
          <IdentitySessionProvider identitySession={dependencies.identitySession}>{children}</IdentitySessionProvider>
        </ProjectsApiProvider>
      </SessionApiProvider>
    </IdentityApiProvider>
  )
}
