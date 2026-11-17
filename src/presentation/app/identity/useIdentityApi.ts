import { useContext } from 'react'
import { IdentityApiContext } from './IdentityApiContext'

export function useIdentityApi() {
  const identityApi = useContext(IdentityApiContext)
  if (!identityApi) throw new Error('IdentityApiProvider is missing')
  return identityApi
}
