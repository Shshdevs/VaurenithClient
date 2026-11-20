import { useContext } from 'react'
import { EnvironmentsApiContext } from '@/presentation/app/backend/projects/EnvironmentsApiContext'

export function useEnvironmentsApi() {
  const EnvironmentsApi = useContext(EnvironmentsApiContext)
  if (!EnvironmentsApi) throw new Error('EnvironmentsApiProvider is missing')
  return EnvironmentsApi
}
