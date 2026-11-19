import { Center, Loader } from '@mantine/core'

type PageLoaderProps = {
  label: string
  minHeight?: number | string
}

export function PageLoader({ label, minHeight = 240 }: PageLoaderProps) {
  return (
    <Center mih={minHeight}>
      <Loader aria-label={label} />
    </Center>
  )
}
