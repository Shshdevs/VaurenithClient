import type { ReactNode } from 'react'
import type { ProjectsApi } from '@/application/ports/projects/ProjectsApi'
import { ProjectsApiContext } from './ProjectsApiContext'

export function ProjectsApiProvider({ projectsApi, children }: { projectsApi: ProjectsApi; children: ReactNode }) {
  return <ProjectsApiContext.Provider value={projectsApi}>{children}</ProjectsApiContext.Provider>
}
