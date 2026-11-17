import { useContext } from 'react'
import { IdentityAuthContext } from './IdentityAuthContext'

export function useIdentityAuth() {
  const identityAuth = useContext(IdentityAuthContext)
  if (!identityAuth) throw new Error('IdentityAuthProvider is missing')
  return identityAuth
}
