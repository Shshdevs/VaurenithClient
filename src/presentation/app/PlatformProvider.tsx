import type { ReactNode } from 'react'
import type { Platform } from '@/application/ports/Platform'
import { PlatformContext } from './PlatformContext'

type PlatformProviderProps = {
  platform: Platform
  children: ReactNode
}

export function PlatformProvider({ platform, children }: PlatformProviderProps) {
  return <PlatformContext.Provider value={platform}>{children}</PlatformContext.Provider>
}
