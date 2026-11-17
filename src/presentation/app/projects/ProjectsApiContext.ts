import { createContext } from 'react'
import type { ProjectsApi } from '@/application/ports/projects/ProjectsApi'

export const ProjectsApiContext = createContext<ProjectsApi | null>(null)
