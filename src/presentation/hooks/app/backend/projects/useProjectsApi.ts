import { useContext } from 'react'
import { ProjectsApiContext } from '@/presentation/app/backend/projects/ProjectsApiContext'

export function useProjectsApi() {
  const projectsApi = useContext(ProjectsApiContext)
  if (!projectsApi) throw new Error('ProjectsApiProvider is missing')
  return projectsApi
}
