import type { ApiEnvelope } from '@/application/ports/ApiClient'

export function mapApiEnvelope<TSource, TTarget>(
  envelope: ApiEnvelope<TSource>,
  map: (data: TSource) => TTarget
): ApiEnvelope<TTarget> {
  return {
    ...envelope,
    data: envelope.data === undefined ? undefined : envelope.data === null ? null : map(envelope.data),
  }
}
