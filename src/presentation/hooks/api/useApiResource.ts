import { useEffect, useState } from 'react'

export type ApiResourceState<TData> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: TData }
  | { status: 'error'; error: unknown }

type ApiRequest<TData> = (signal: AbortSignal) => Promise<TData>
type ResolvedState<TData> = Extract<ApiResourceState<TData>, { status: 'success' | 'error' }>

type ApiRequestSnapshot<TData> = {
  request: ApiRequest<TData> | null
  attempt: number
  state: ResolvedState<TData> | null
}

export function useApiResource<TData>(request: ApiRequest<TData> | null) {
  const [attempt, setAttempt] = useState(0)
  const [snapshot, setSnapshot] = useState<ApiRequestSnapshot<TData>>({
    request: null,
    attempt: -1,
    state: null,
  })

  useEffect(() => {
    if (!request) return

    const controller = new AbortController()
    let isCurrent = true

    void Promise.resolve()
      .then(() => request(controller.signal))
      .then((data) => {
        if (isCurrent) {
          setSnapshot({ request, attempt, state: { status: 'success', data } })
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setSnapshot({ request, attempt, state: { status: 'error', error } })
        }
      })

    return () => {
      isCurrent = false
      controller.abort()
    }
  }, [attempt, request])

  const state: ApiResourceState<TData> = !request
    ? { status: 'idle' }
    : snapshot.request === request && snapshot.attempt === attempt && snapshot.state
      ? snapshot.state
      : { status: 'loading' }

  return {
    state,
    retry: () => setAttempt((current) => current + 1),
  }
}
