import { useContext } from 'react'
import { IdentityApiContext } from '@/presentation/app/backend/identity/IdentityApiContext'

export function useIdentityApi() {
  const identityApi = useContext(IdentityApiContext)
  if (!identityApi) throw new Error('IdentityApiProvider is missing')
  return identityApi
}
