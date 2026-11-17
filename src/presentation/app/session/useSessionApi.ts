import { useContext } from 'react'
import { SessionApiContext } from './SessionApiContext'

export function useSessionApi() {
  const sessionApi = useContext(SessionApiContext)
  if (!sessionApi) throw new Error('SessionApiProvider is missing')
  return sessionApi
}
