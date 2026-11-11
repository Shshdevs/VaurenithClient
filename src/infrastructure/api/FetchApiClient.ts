import type { ApiClient, ApiEnvelope, ApiRequestOptions } from '@/application/ports/ApiClient'
import { ApiError, ApiNetworkError, ApiProtocolError } from './ApiError'

export class FetchApiClient implements ApiClient {
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async request<TData>(path: string, options: ApiRequestOptions = {}): Promise<ApiEnvelope<TData>> {
    const baseUrl = this.baseUrl ? new URL(this.baseUrl, window.location.origin) : new URL('/', window.location.origin)
    const url = new URL(path.replace(/^\//, ''), `${baseUrl.href.replace(/\/?$/, '/')}`)
    const headers = new Headers(options.headers)

    if (options.body !== undefined && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    let response: Response

    try {
      response = await fetch(url, {
        method: options.method ?? 'GET',
        headers,
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        signal: options.signal,
      })
    } catch (cause) {
      throw new ApiNetworkError(cause)
    }

    const requestId = response.headers.get('X-Request-ID')
    const responseBody = await response.text()
    const body = responseBody ? parseResponseBody(responseBody, response.status, requestId) : null

    if (!response.ok) {
      const errorBody = isRecord(body) ? body : null
      const message = typeof errorBody?.message === 'string' ? errorBody.message : response.statusText || 'HTTP error'
      const status =
        typeof errorBody?.status === 'string' ? errorBody.status : `${response.status} ${response.statusText}`

      throw new ApiError(message, response.status, status, errorBody?.data ?? body, requestId)
    }

    if (!isApiEnvelope<TData>(body)) {
      throw new ApiProtocolError('API response does not match the expected envelope', response.status, requestId)
    }

    return body
  }
}

function parseResponseBody(body: string, statusCode: number, requestId: string | null): unknown {
  try {
    return JSON.parse(body)
  } catch (cause) {
    if (statusCode >= 200 && statusCode < 300) {
      throw new ApiProtocolError('API response is not valid JSON', statusCode, requestId, { cause })
    }

    return body
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isApiEnvelope<TData>(value: unknown): value is ApiEnvelope<TData> {
  return (
    isRecord(value) &&
    typeof value.status === 'string' &&
    (typeof value.message === 'string' || value.message === null) &&
    'data' in value
  )
}
