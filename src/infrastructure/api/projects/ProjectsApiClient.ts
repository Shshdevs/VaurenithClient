import type { ApiClient, ApiEnvelope } from '@/application/ports/ApiClient'
import type { ProjectCreateRequest, ProjectUpdateRequest, ProjectsApi } from '@/application/ports/projects/ProjectsApi'
import type { Project } from '@/domain/projects/Project'
import { mapApiEnvelope } from '../mapApiEnvelope'

type ProjectResponse = {
  id: string
  user_id: string
  name: string
  slug: string
  description: string | null
  status: Project['status']
  project_type: Project['projectType']
  version: number
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

const API_VERSION_PATH = '/api/v1'

export class ProjectsApiClient implements ProjectsApi {
  private readonly apiClient: ApiClient

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient
  }

  async getProjects(token: string, signal?: AbortSignal): Promise<ApiEnvelope<Project[]>> {
    const response = await this.request<ProjectResponse[]>('/projects', token, {
      method: 'GET',
      signal,
    })
    return mapApiEnvelope(response, (projects) => projects.map(mapProject))
  }
  async getProject(token: string, project_id: string, signal?: AbortSignal): Promise<ApiEnvelope<Project>> {
    const response = await this.request<ProjectResponse>(`/projects/${encodeURIComponent(project_id)}`, token, {
      method: 'GET',
      signal,
    })
    return mapApiEnvelope(response, mapProject)
  }
  async createProject(
    token: string,
    request: ProjectCreateRequest,
    signal?: AbortSignal
  ): Promise<ApiEnvelope<Project>> {
    const response = await this.request<ProjectResponse>('/projects', token, {
      method: 'POST',
      body: toProjectRequest(request),
      signal,
    })
    return mapApiEnvelope(response, mapProject)
  }
  async updateProject(
    token: string,
    project_id: string,
    request: ProjectUpdateRequest,
    signal?: AbortSignal
  ): Promise<ApiEnvelope<Project>> {
    const response = await this.request<ProjectResponse>(`/projects/${encodeURIComponent(project_id)}`, token, {
      method: 'PUT',
      body: toProjectRequest(request),
      signal,
    })
    return mapApiEnvelope(response, mapProject)
  }

  deleteProject(token: string, project_id: string, signal?: AbortSignal): Promise<ApiEnvelope<null>> {
    return this.request(`/projects/${encodeURIComponent(project_id)}`, token, {
      method: 'DELETE',
      signal,
    })
  }
  private request<TData>(
    path: string,
    token: string,
    options: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; body?: unknown; signal?: AbortSignal }
  ): Promise<ApiEnvelope<TData>> {
    return this.apiClient.request<TData>(`${API_VERSION_PATH}${path}`, {
      ...options,
      headers: { Authorization: `Bearer ${token}` },
    })
  }
}

function mapProject(project: ProjectResponse): Project {
  return {
    id: project.id,
    userId: project.user_id,
    name: project.name,
    slug: project.slug,
    description: project.description,
    status: project.status,
    projectType: project.project_type,
    version: project.version,
    metadata: project.metadata,
    createdAt: new Date(project.created_at),
    updatedAt: new Date(project.updated_at),
    deletedAt: project.deleted_at ? new Date(project.deleted_at) : null,
  }
}

function toProjectRequest(request: ProjectCreateRequest | ProjectUpdateRequest) {
  const { projectType, ...fields } = request
  return {
    ...fields,
    project_type: projectType,
  }
}
