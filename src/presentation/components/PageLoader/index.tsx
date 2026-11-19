import { Center, Loader } from '@mantine/core'
import type { PageLoaderProps } from './types'

export function PageLoader({ label, minHeight = 240 }: PageLoaderProps) {
  return (
    <Center mih={minHeight}>
      <Loader aria-label={label} />
    </Center>
  )
}
