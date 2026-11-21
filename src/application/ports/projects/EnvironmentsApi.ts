import type { Environment, EnvironmentId, EnvironmentType } from '@/domain/projects/Environment'
import type { ApiEnvelope } from '../ApiClient'
import type { ProjectId } from '@/domain/projects/Project'

export type EnvironmentCreateRequest = {
  name: string
  environmentType?: EnvironmentType
  description?: string | null
  configuration?: Record<string, unknown> | null
  version?: number
}

export type EnvironmentUpdateRequest = {
  name: string
  environmentType: EnvironmentType
  description?: string | null
  configuration?: Record<string, unknown> | null
  version: number
}

export interface EnvironmentsApi {
  getEnvironment(
    token: string,
    project_id: ProjectId,
    environment_id: EnvironmentId,
    signal?: AbortSignal
  ): Promise<ApiEnvelope<Environment>>

  getProjectEnvironments(
    token: string,
    project_id: ProjectId,
    signal?: AbortSignal
  ): Promise<ApiEnvelope<Environment[]>>

  createEnvironment(
    token: string,
    project_id: ProjectId,
    request: EnvironmentCreateRequest,
    signal?: AbortSignal
  ): Promise<ApiEnvelope<Environment>>

  updateEnvironment(
    token: string,
    project_id: ProjectId,
    environment_id: EnvironmentId,
    request: EnvironmentUpdateRequest,
    signal?: AbortSignal
  ): Promise<ApiEnvelope<Environment>>

  deleteEnvironment(
    token: string,
    project_id: ProjectId,
    environment_id: EnvironmentId,
    signal?: AbortSignal
  ): Promise<ApiEnvelope<null>>
}
