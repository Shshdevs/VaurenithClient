import { useContext } from 'react'
import { ProjectsApiContext } from './ProjectsApiContext'

export function useProjectsApi() {
  const projectsApi = useContext(ProjectsApiContext)
  if (!projectsApi) throw new Error('ProjectsApiProvider is missing')
  return projectsApi
}
