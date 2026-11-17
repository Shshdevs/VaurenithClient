export type UserId = string

export type User = {
  id: UserId
  email: string
  displayName: string | null
  nickname: string
  authProvider: string | null
  createdAt: Date
  updatedAt: Date
}
