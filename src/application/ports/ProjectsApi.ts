import type { ApiEnvelope } from './ApiClient'

export type ProjectStatus = 'active' | 'archived'
export type ProjectType = 'software' | 'infrastructure' | 'fullstack' | 'other'

export type ProjectCreateRequest = {
  name: string
  description?: string | null
  project_type: ProjectType
  version?: number
  metadata?: Record<string, unknown> | null
}

export type ProjectUpdateRequest = {
  name: string
  description?: string | null
  project_type: ProjectType
  status: ProjectStatus
  version: number
  metadata?: Record<string, unknown> | null
}

export type ProjectData = {
  id: string
  user_id: string
  name: string
  slug: string
  description: string | null
  status: ProjectStatus
  project_type: ProjectType
  version: number | null
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface ProjectsApi {
  getProjects(token: string, signal?: AbortSignal): Promise<ApiEnvelope<ProjectData[]>>
  getProject(token: string, project_id: string, signal?: AbortSignal): Promise<ApiEnvelope<ProjectData>>
  createProject(token: string, request: ProjectCreateRequest, signal?: AbortSignal): Promise<ApiEnvelope<ProjectData>>
  updateProject(
    token: string,
    project_id: string,
    request: ProjectUpdateRequest,
    signal?: AbortSignal
  ): Promise<ApiEnvelope<ProjectData>>
  deleteProject(token: string, project_id: string, signal?: AbortSignal): Promise<ApiEnvelope<null>>
}
