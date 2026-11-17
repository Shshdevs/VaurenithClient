import type { ApiClient, ApiEnvelope } from '@/application/ports/ApiClient'
import type {
  ProjectData,
  ProjectCreateRequest,
  ProjectUpdateRequest,
  ProjectsApi,
} from '@/application/ports/ProjectsApi'

const API_VERSION_PATH = '/api/v1'

export class ProjectsApiClient implements ProjectsApi {
  private readonly apiClient: ApiClient

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient
  }

  getProjects(token: string, signal?: AbortSignal): Promise<ApiEnvelope<ProjectData[]>> {
    return this.request<ProjectData[]>('/projects', token, {
      method: 'GET',
      signal,
    })
  }
  getProject(token: string, project_id: string, signal?: AbortSignal): Promise<ApiEnvelope<ProjectData>> {
    return this.request<ProjectData>(`/projects/${encodeURIComponent(project_id)}`, token, {
      method: 'GET',
      signal,
    })
  }
  createProject(token: string, request: ProjectCreateRequest, signal?: AbortSignal): Promise<ApiEnvelope<ProjectData>> {
    return this.request<ProjectData>(`/projects`, token, {
      method: 'POST',
      body: request,
      signal,
    })
  }
  updateProject(
    token: string,
    project_id: string,
    request: ProjectUpdateRequest,
    signal?: AbortSignal
  ): Promise<ApiEnvelope<ProjectData>> {
    return this.request<ProjectData>(`/projects/${encodeURIComponent(project_id)}`, token, {
      method: 'PUT',
      body: request,
      signal,
    })
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
