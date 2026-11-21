import type { ApiClient, ApiEnvelope } from '@/application/ports/ApiClient'
import type {
  EnvironmentCreateRequest,
  EnvironmentsApi,
  EnvironmentUpdateRequest,
} from '@/application/ports/projects/EnvironmentsApi'
import type { Environment, EnvironmentId } from '@/domain/projects/Environment'
import type { ProjectId } from '@/domain/projects/Project'
import { mapApiEnvelope } from '../mapApiEnvelope'

type EnvironmentResponse = {
  id: string
  project_id: string
  name: string
  slug: string
  environment_type: Environment['environmentType']
  description: string | null
  configuration: Record<string, unknown> | null
  version: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

const API_VERSION_PATH = '/api/v1'

export class EnvironmentsApiClient implements EnvironmentsApi {
  private readonly apiClient: ApiClient

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient
  }

  async getEnvironment(
    token: string,
    project_id: ProjectId,
    environment_id: EnvironmentId,
    signal?: AbortSignal
  ): Promise<ApiEnvelope<Environment>> {
    const response = await this.request<EnvironmentResponse>(
      `/projects/${encodeURIComponent(project_id)}/environments/${encodeURIComponent(environment_id)}`,
      token,
      {
        method: 'GET',
        signal: signal,
      }
    )
    return mapApiEnvelope(response, mapEnvironment)
  }

  async getProjectEnvironments(
    token: string,
    project_id: ProjectId,
    signal?: AbortSignal
  ): Promise<ApiEnvelope<Environment[]>> {
    const response = await this.request<EnvironmentResponse[]>(
      `/projects/${encodeURIComponent(project_id)}/environments`,
      token,
      {
        method: 'GET',
        signal,
      }
    )
    return mapApiEnvelope(response, (environments) => environments.map(mapEnvironment))
  }

  async createEnvironment(
    token: string,
    project_id: ProjectId,
    request: EnvironmentCreateRequest,
    signal?: AbortSignal
  ): Promise<ApiEnvelope<Environment>> {
    const response = await this.request<EnvironmentResponse>(
      `/projects/${encodeURIComponent(project_id)}/environments`,
      token,
      {
        method: 'POST',
        body: toEnvironmentRequest(request),
        signal: signal,
      }
    )

    return mapApiEnvelope(response, mapEnvironment)
  }

  async updateEnvironment(
    token: string,
    project_id: ProjectId,
    environment_id: EnvironmentId,
    request: EnvironmentUpdateRequest,
    signal?: AbortSignal
  ): Promise<ApiEnvelope<Environment>> {
    const response = await this.request<EnvironmentResponse>(
      `/projects/${encodeURIComponent(project_id)}/environments/${encodeURIComponent(environment_id)}`,
      token,
      {
        method: 'PUT',
        body: toEnvironmentRequest(request),
        signal: signal,
      }
    )

    return mapApiEnvelope(response, mapEnvironment)
  }

  async deleteEnvironment(
    token: string,
    project_id: ProjectId,
    environment_id: EnvironmentId,
    signal?: AbortSignal
  ): Promise<ApiEnvelope<null>> {
    return this.request(
      `/projects/${encodeURIComponent(project_id)}/environments/${encodeURIComponent(environment_id)}`,
      token,
      {
        method: 'DELETE',
        signal,
      }
    )
  }

  private request<TData>(
    path: string,
    token: string,
    options: {
      method: 'GET' | 'POST' | 'PUT' | 'DELETE'
      body?: unknown
      signal?: AbortSignal
    }
  ): Promise<ApiEnvelope<TData>> {
    return this.apiClient.request<TData>(`${API_VERSION_PATH}${path}`, {
      ...options,
      headers: { Authorization: `Bearer ${token}` },
    })
  }
}

function mapEnvironment(environment: EnvironmentResponse): Environment {
  return {
    id: environment.id,
    projectId: environment.project_id,
    name: environment.name,
    slug: environment.slug,
    environmentType: environment.environment_type,
    description: environment.description,
    configuration: environment.configuration,
    version: environment.version,
    createdAt: new Date(environment.created_at),
    updatedAt: new Date(environment.updated_at),
    deletedAt: environment.deleted_at ? new Date(environment.deleted_at) : null,
  }
}

function toEnvironmentRequest(request: EnvironmentCreateRequest | EnvironmentUpdateRequest) {
  const { environmentType, ...fields } = request
  return {
    ...fields,
    environment_type: environmentType,
  }
}
