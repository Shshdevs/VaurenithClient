import { createHash } from 'node:crypto'
import { expect, test, type Page, type Route } from '@playwright/test'

const authority = 'http://oidc.test/realms/test'
const accessToken = 'e2e-access-token'
const user = {
  id: 'e2e-user-id',
  email: 'e2e@example.test',
  display_name: 'E2E User',
  nickname: 'e2e-user',
  auth_provider: 'local',
  created_at: '2026-11-15T00:00:00Z',
  updated_at: '2026-11-15T00:00:00Z',
}

type ApiCall = {
  method: string
  path: string
  status: number
  body?: Record<string, unknown>
}

type MockOptions = {
  createUserStatus?: number
  deferCallback?: boolean
  deviceStatus?: number
}

async function installMocks(page: Page, options: MockOptions = {}) {
  const calls: ApiCall[] = []
  const authorizationChallenges = new Map<string, string>()
  const pkceChecks: boolean[] = []
  let resolveCallbackUrl: (callbackUrl: string) => void = () => undefined
  const callbackUrl = new Promise<string>((resolve) => {
    resolveCallbackUrl = resolve
  })
  let sessionActive = false
  let createdUserBody: Record<string, unknown> | undefined
  let registeredDeviceBody: Record<string, unknown> | undefined

  await page.context().route('http://oidc.test/**', async (route) => {
    const requestUrl = new URL(route.request().url())
    const corsHeaders = {
      'access-control-allow-origin': '*',
      'access-control-allow-headers': 'authorization, content-type',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
    }

    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: corsHeaders })
      return
    }

    if (requestUrl.pathname.endsWith('/.well-known/openid-configuration')) {
      await route.fulfill({
        json: {
          authorization_endpoint: `${authority}/protocol/openid-connect/auth`,
          token_endpoint: `${authority}/protocol/openid-connect/token`,
          userinfo_endpoint: `${authority}/protocol/openid-connect/userinfo`,
        },
        headers: corsHeaders,
      })
      return
    }

    if (requestUrl.pathname.endsWith('/protocol/openid-connect/auth')) {
      const state = requestUrl.searchParams.get('state')
      const challenge = requestUrl.searchParams.get('code_challenge')
      const challengeMethod = requestUrl.searchParams.get('code_challenge_method')
      const code = 'e2e-auth-code'
      if (state && challenge && challengeMethod === 'S256') {
        authorizationChallenges.set(code, challenge)
      }
      const callback = new URL(requestUrl.searchParams.get('redirect_uri') ?? '')
      callback.searchParams.set('code', code)
      callback.searchParams.set('state', state ?? '')
      resolveCallbackUrl(callback.toString())
      if (options.deferCallback) {
        await route.fulfill({ status: 200, contentType: 'text/html', body: 'Email confirmation' })
      } else {
        await route.fulfill({ status: 302, headers: { location: callback.toString() } })
      }
      return
    }

    if (requestUrl.pathname.endsWith('/protocol/openid-connect/token')) {
      const form = new URLSearchParams(route.request().postData() ?? '')
      const verifier = form.get('code_verifier') ?? ''
      const challenge = createHash('sha256').update(verifier).digest('base64url')
      pkceChecks.push(challenge === authorizationChallenges.get(form.get('code') ?? ''))
      await route.fulfill({
        json: { access_token: accessToken, token_type: 'Bearer', expires_in: 300 },
        headers: corsHeaders,
      })
      return
    }

    if (requestUrl.pathname.endsWith('/protocol/openid-connect/userinfo')) {
      await route.fulfill({
        json: { email: user.email, email_verified: true, display_name: user.display_name },
        headers: corsHeaders,
      })
      return
    }

    await route.fulfill({ status: 404, headers: corsHeaders })
  })

  await page.context().route('**/api/v1/**', async (route: Route) => {
    const request = route.request()
    const requestUrl = new URL(request.url())
    const path = requestUrl.pathname
    const method = request.method()
    const body = request.postDataJSON() as Record<string, unknown> | undefined
    const headers = request.headers()

    if (path.endsWith('/users/create')) {
      createdUserBody = body
      const status = options.createUserStatus ?? 201
      if (status === 201) sessionActive = true
      calls.push({ method, path, status, body })
      await route.fulfill({
        status,
        json:
          status === 201
            ? { status: '201 CREATED', code: 'CREATED', entity_type: 'USER', data: user }
            : {
                status: '401 Unauthorized',
                code: 'UNAUTHORIZED',
                entity_type: null,
                details: 'Identity token is invalid',
              },
      })
      return
    }

    if (path.endsWith('/users/me/devices')) {
      registeredDeviceBody = body
      const status = options.deviceStatus ?? 201
      if (headers.authorization !== `Bearer ${accessToken}`) {
        calls.push({ method, path, status: 401, body })
        await route.fulfill({
          status: 401,
          json: {
            status: '401 Unauthorized',
            code: 'UNAUTHORIZED',
            entity_type: null,
            details: 'Invalid bearer token',
          },
        })
        return
      }
      if (status === 201) sessionActive = true
      calls.push({ method, path, status, body })
      await route.fulfill({
        status,
        json:
          status === 201
            ? {
                status: '201 CREATED',
                code: 'CREATED',
                entity_type: 'CLIENT_DEVICE',
                data: {
                  id: 'e2e-device-id',
                  name: String(body?.name ?? ''),
                  platform: String(body?.platform ?? 'other'),
                  app_version: null,
                  status: 'active',
                  registered_at: user.created_at,
                  last_seen_at: user.created_at,
                  revoked_at: null,
                },
              }
            : {
                status: status === 404 ? '404 Not Found' : '401 Unauthorized',
                code: status === 404 ? 'NOT_FOUND' : 'UNAUTHORIZED',
                entity_type: null,
                details: status === 404 ? 'UserNotFound' : 'Device registration rejected',
              },
      })
      return
    }

    if (path.endsWith('/users/me')) {
      const status = sessionActive && headers.authorization === `Bearer ${accessToken}` ? 200 : 401
      calls.push({ method, path, status })
      await route.fulfill({
        status,
        json:
          status === 200
            ? { status: '200 OK', code: 'RETRIEVED', entity_type: 'USER', data: user }
            : {
                status: '401 Unauthorized',
                code: 'UNAUTHORIZED',
                entity_type: null,
                details: 'No active Backend session for this token',
              },
      })
      return
    }

    calls.push({ method, path, status: 404, body })
    await route.fulfill({ status: 404, json: { status: 'NOT_FOUND', message: 'Unexpected endpoint' } })
  })

  return {
    callbackUrl: () => callbackUrl,
    calls,
    createdUserBody: () => createdUserBody,
    registeredDeviceBody: () => registeredDeviceBody,
    pkceChecks,
  }
}

test('registration exchanges PKCE code, creates the Backend profile and reaches home', async ({ page }) => {
  const trace = await installMocks(page)
  await page.goto('/')
  await page.getByRole('button', { name: 'Create an account' }).click()

  await expect(page).toHaveURL('http://127.0.0.1:4178/')
  await expect(page.getByText('Welcome, e2e-user')).toBeVisible()
  expect(trace.pkceChecks).toEqual([true])
  expect(trace.calls.map(({ method, path }) => `${method} ${path}`)).toEqual([
    'POST /api/v1/users/create',
    'GET /api/v1/users/me',
  ])
  expect(trace.createdUserBody()).toMatchObject({
    email: user.email,
    display_name: user.display_name,
  })
  expect(trace.createdUserBody()).toMatchObject({
    device_name: expect.stringMatching(/^.+ [A-Z0-9]{4}$/),
    platform: expect.stringMatching(/^(macos|windows|linux|ios|android|other)$/),
  })
  expect(trace.createdUserBody()).not.toHaveProperty('password')
})

test('email confirmation can return the OIDC callback in a new tab', async ({ page }) => {
  const trace = await installMocks(page, { deferCallback: true })
  await page.goto('/')
  await page.getByRole('button', { name: 'Create an account' }).click()
  await expect(page).toHaveURL(/oidc\.test/)

  const confirmationPage = await page.context().newPage()
  await confirmationPage.goto(await trace.callbackUrl())

  await expect(confirmationPage).toHaveURL('http://127.0.0.1:4178/')
  await expect(confirmationPage.getByText('Welcome, e2e-user')).toBeVisible()
  expect(trace.pkceChecks).toEqual([true])
  expect(trace.calls.map(({ method, path }) => `${method} ${path}`)).toEqual([
    'POST /api/v1/users/create',
    'GET /api/v1/users/me',
  ])
})

test('existing user login registers a device session before loading the profile', async ({ page }) => {
  const trace = await installMocks(page)
  await page.goto('/')
  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(page).toHaveURL('http://127.0.0.1:4178/')
  await expect(page.getByText('Welcome, e2e-user')).toBeVisible()
  expect(trace.pkceChecks).toEqual([true])
  expect(trace.calls.map(({ method, path }) => `${method} ${path}`)).toEqual([
    'POST /api/v1/users/me/devices',
    'GET /api/v1/users/me',
    'GET /api/v1/users/me',
  ])
  expect(trace.registeredDeviceBody()).toMatchObject({
    name: expect.stringMatching(/^.+ [A-Z0-9]{4}$/),
    platform: expect.stringMatching(/^(macos|windows|linux|ios|android|other)$/),
  })
})

test('login creates the Backend profile if a previous registration stopped before profile creation', async ({
  page,
}) => {
  const trace = await installMocks(page, { deviceStatus: 404 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(page).toHaveURL('http://127.0.0.1:4178/')
  await expect(page.getByText('Welcome, e2e-user')).toBeVisible()
  expect(trace.pkceChecks).toEqual([true])
  expect(trace.calls.map(({ method, path, status }) => `${method} ${path} ${status}`)).toEqual([
    'POST /api/v1/users/me/devices 404',
    'POST /api/v1/users/create 201',
    'GET /api/v1/users/me 200',
  ])
  expect(trace.createdUserBody()).toMatchObject({
    email: user.email,
    display_name: user.display_name,
  })
})

test('shows the API error and stays on the identity page when Backend rejects device enrollment', async ({ page }) => {
  const trace = await installMocks(page, { deviceStatus: 401 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(page.getByRole('alert')).toBeVisible()
  await expect(page).toHaveURL(/\/auth\/callback$/)
  expect(trace.calls).toMatchObject([{ method: 'POST', path: '/api/v1/users/me/devices', status: 401 }])
  expect(trace.calls.some(({ method, path }) => method === 'GET' && path.endsWith('/users/me'))).toBe(false)
})

test('shows the Backend token rejection after the verified registration callback', async ({ page }) => {
  const trace = await installMocks(page, { createUserStatus: 401 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Create an account' }).click()

  await expect(page.getByRole('alert')).toContainText('Identity token is invalid')
  await expect(page).toHaveURL(/\/auth\/callback$/)
  expect(trace.pkceChecks).toEqual([true])
  expect(trace.calls).toMatchObject([{ method: 'POST', path: '/api/v1/users/create', status: 401 }])
  expect(trace.calls.some(({ method, path }) => method === 'GET' && path.endsWith('/users/me'))).toBe(false)
})
