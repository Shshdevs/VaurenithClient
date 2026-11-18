import { useCallback, useEffect, useRef } from 'react'

export const useTimerAction = (action: () => void, delay: number) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const actionRef = useRef(action)

  useEffect(() => {
    actionRef.current = action
  }, [action])

  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    cancel()

    timerRef.current = setTimeout(() => {
      timerRef.current = null
      actionRef.current()
    }, delay)
  }, [cancel, delay])

  useEffect(() => cancel, [cancel])

  return { start, cancel }
}
