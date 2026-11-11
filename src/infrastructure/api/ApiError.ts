export class ApiError extends Error {
  readonly statusCode: number
  readonly status: string
  readonly data: unknown
  readonly requestId: string | null

  constructor(message: string, statusCode: number, status: string, data: unknown, requestId: string | null) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.status = status
    this.data = data
    this.requestId = requestId
  }
}

export class ApiNetworkError extends Error {
  constructor(cause: unknown) {
    super('Unable to reach the API', { cause })
    this.name = 'ApiNetworkError'
  }
}

export class ApiProtocolError extends Error {
  readonly statusCode: number
  readonly requestId: string | null

  constructor(message: string, statusCode: number, requestId: string | null, options?: ErrorOptions) {
    super(message, options)
    this.name = 'ApiProtocolError'
    this.statusCode = statusCode
    this.requestId = requestId
  }
}
