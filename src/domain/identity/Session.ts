import type { ClientDeviceId } from '../identity/ClientDevice'

export type SessionId = string

export type Session = {
  id: SessionId
  clientDeviceId: ClientDeviceId
  createdAt: Date
  expiresAt: Date
  revokedAt: Date | null
}

export function isSessionActive(session: Session, at: Date = new Date()): boolean {
  return session.revokedAt === null && session.expiresAt.getTime() > at.getTime()
}
