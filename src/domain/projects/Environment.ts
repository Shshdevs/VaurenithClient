import type { ProjectId } from './Project'

export type EnvironmentId = string
export type EnvironmentType = 'development' | 'testing' | 'staging' | 'production' | 'local' | 'other'

export type Environment = {
  id: EnvironmentId
  projectId: ProjectId
  name: string
  slug: string
  environmentType: EnvironmentType
  description: string | null
  configuration: Record<string, unknown> | null
  version: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
