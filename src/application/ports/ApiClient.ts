export type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: HeadersInit
  signal?: AbortSignal
}

export type ApiEnvelope<TData> = {
  status: string
  code: string
  entity_type: string | null
  data?: TData | null
  details?: unknown | null
}

export interface ApiClient {
  request<TData>(path: string, options?: ApiRequestOptions): Promise<ApiEnvelope<TData>>
}
