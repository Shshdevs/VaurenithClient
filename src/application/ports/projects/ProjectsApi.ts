import type { ApiEnvelope } from '../ApiClient'
import type { Project, ProjectStatus, ProjectType } from '@/domain/projects/Project'
export type { ProjectStatus, ProjectType } from '@/domain/projects/Project'

export type ProjectCreateRequest = {
  name: string
  description?: string | null
  projectType?: ProjectType
  version?: number
  metadata?: Record<string, unknown> | null
}

export type ProjectUpdateRequest = {
  name: string
  description?: string | null
  projectType: ProjectType
  status: ProjectStatus
  version: number
  metadata?: Record<string, unknown> | null
}

export interface ProjectsApi {
  getProjects(token: string, signal?: AbortSignal): Promise<ApiEnvelope<Project[]>>
  getProject(token: string, project_id: string, signal?: AbortSignal): Promise<ApiEnvelope<Project>>
  createProject(token: string, request: ProjectCreateRequest, signal?: AbortSignal): Promise<ApiEnvelope<Project>>
  updateProject(
    token: string,
    project_id: string,
    request: ProjectUpdateRequest,
    signal?: AbortSignal
  ): Promise<ApiEnvelope<Project>>
  deleteProject(token: string, project_id: string, signal?: AbortSignal): Promise<ApiEnvelope<null>>
}
