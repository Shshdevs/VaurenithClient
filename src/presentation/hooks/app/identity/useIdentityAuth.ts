import { useContext } from 'react'
import { IdentityAuthContext } from '@/presentation/app/identity/IdentityAuthContext'

export function useIdentityAuth() {
  const identityAuth = useContext(IdentityAuthContext)
  if (!identityAuth) throw new Error('IdentityAuthProvider is missing')
  return identityAuth
}
