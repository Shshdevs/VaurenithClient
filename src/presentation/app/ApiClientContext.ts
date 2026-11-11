import { createContext } from 'react'
import type { ApiClient } from '@/application/ports/ApiClient'

export const ApiClientContext = createContext<ApiClient | null>(null)
