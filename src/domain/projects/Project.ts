import type { UserId } from '../identity/User'

export type ProjectId = string
export type ProjectStatus = 'active' | 'archived'
export type ProjectType = 'software' | 'infrastructure' | 'fullstack' | 'other'

export type Project = {
  id: ProjectId
  userId: UserId
  name: string
  slug: string
  description: string | null
  status: ProjectStatus
  projectType: ProjectType
  version: number
  metadata: Record<string, unknown> | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
