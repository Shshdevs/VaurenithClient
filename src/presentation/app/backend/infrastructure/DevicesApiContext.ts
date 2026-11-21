import type { DevicesApi } from '@/application/ports/infrastructure/DevicesApi'
import { createContext } from 'react'

export const DevicesApiContext = createContext<DevicesApi | null>(null)
