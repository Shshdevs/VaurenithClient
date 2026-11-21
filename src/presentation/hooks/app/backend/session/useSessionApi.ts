import { useContext } from 'react'
import { SessionApiContext } from '@/presentation/app/backend/session/SessionApiContext'

export function useSessionApi() {
  const sessionApi = useContext(SessionApiContext)
  if (!sessionApi) throw new Error('SessionApiProvider is missing')
  return sessionApi
}
