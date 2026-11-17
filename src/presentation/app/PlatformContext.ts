import { createContext } from 'react'
import type { Platform } from '@/application/ports/Platform'

export const PlatformContext = createContext<Platform | null>(null)
