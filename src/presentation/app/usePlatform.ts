import { useContext } from 'react'
import { PlatformContext } from './PlatformContext'

export function usePlatform() {
  const platform = useContext(PlatformContext)

  if (!platform) {
    throw new Error('PlatformProvider is missing')
  }

  return platform
}
