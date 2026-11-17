import { expect, test } from '@playwright/test'
import { loadEnv } from 'vite'

const username = process.env.OIDC_E2E_USERNAME
const password = process.env.OIDC_E2E_PASSWORD
const expectedIssuer = loadEnv('development', process.cwd(), 'VITE_').VITE_OIDC_AUTHORITY.replace(/\/$/, '')
const backendAudience = 'vaurenith-backend'

function inspectUnverifiedAccessToken(token: string) {
  try {
    const [headerPart, payloadPart] = token.split('.')
    if (!headerPart || !payloadPart) return 'malformed'
    const header = JSON.parse(Buffer.from(headerPart, 'base64url').toString('utf8')) as Record<string, unknown>
    const claims = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8')) as Record<string, unknown>
    const requiredClaims = ['iss', 'aud', 'sub', 'exp', 'iat', 'jti', 'email', 'auth_provider']
    const presentClaims = requiredClaims.filter((name) => name in claims).length
    const subjectIsUuid =
      typeof claims.sub === 'string' &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(claims.sub)

    return [
      `typ=${header.typ === 'at+jwt' ? 'ok' : 'mismatch'}`,
      `alg=${header.alg === 'RS256' ? 'ok' : 'mismatch'}`,
      `iss=${claims.iss === expectedIssuer ? 'ok' : 'mismatch'}`,
      `aud=${claims.aud === backendAudience ? 'ok' : 'mismatch'}`,
      `required_claims=${presentClaims}/${requiredClaims.length}`,
      `sub_uuid=${subjectIsUuid ? 'ok' : 'mismatch'}`,
    ].join(', ')
  } catch {
    return 'unreadable'
  }
}

test('live Keycloak login creates a Backend session and opens the home page', async ({ page }) => {
  test.skip(!username || !password, 'Set OIDC_E2E_USERNAME and OIDC_E2E_PASSWORD to run against local services')
  test.setTimeout(90_000)
  const apiResponses: string[] = []
  const diagnostics: Promise<void>[] = []

  page.on('response', (response) => {
    const url = new URL(response.url())
    if (url.pathname.endsWith('/protocol/openid-connect/token')) {
      diagnostics.push(
        (async () => {
          try {
            const body = (await response.json()) as { access_token?: unknown }
            if (typeof body.access_token === 'string') {
              apiResponses.push(`OIDC access-token contract ${inspectUnverifiedAccessToken(body.access_token)}`)
            }
          } catch {
            apiResponses.push('OIDC token endpoint did not return a readable access token')
          }
        })()
      )
    }
    if (url.pathname.startsWith('/api/v1/')) {
      diagnostics.push(
        (async () => {
          let detail = ''
          if (response.status() >= 400) {
            try {
              const body = (await response.json()) as { message?: unknown }
              if (typeof body.message === 'string') detail = ` ${body.message.slice(0, 200)}`
            } catch {
              detail = ''
            }
          }
          apiResponses.push(`${response.request().method()} ${url.pathname} ${response.status()}${detail}`)
        })()
      )
    }
  })

  try {
    await page.goto('/')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await page.locator('#username').fill(username ?? '')
    await page.locator('#password').fill(password ?? '')
    await page.locator('#kc-login').click()
    await expect(page.getByText(/^Welcome, .+/)).toBeVisible({ timeout: 60_000 })
    await Promise.all(diagnostics)
    await expect(page).not.toHaveURL(/\/identity\/create-user$/)
    expect(apiResponses.some((item) => item.startsWith('POST /api/v1/users/me/devices 201'))).toBe(true)
    expect(apiResponses.some((item) => item.startsWith('GET /api/v1/users/me 200'))).toBe(true)
  } catch (cause) {
    await Promise.all(diagnostics)
    const pageText = await page
      .locator('body')
      .innerText()
      .catch(() => '')
    const redactedPageText = username ? pageText.replaceAll(username, '[redacted]') : pageText
    throw new Error(
      `Live authentication did not reach the home page. URL: ${page.url()}; API responses: ${apiResponses.join(' | ') || 'none'}; page: ${redactedPageText.slice(0, 500)}; cause: ${String(cause)}`,
      { cause }
    )
  }
})
