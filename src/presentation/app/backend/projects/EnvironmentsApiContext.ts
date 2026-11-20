import { createContext } from 'react'
import type { EnvironmentsApi } from '@/application/ports/projects/EnvironmentsApi'

export const EnvironmentsApiContext = createContext<EnvironmentsApi | null>(null)
