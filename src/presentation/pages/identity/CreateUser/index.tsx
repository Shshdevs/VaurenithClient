import { Alert, Button, Container, Paper, Stack, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useEffect, useRef, useState } from 'react'
import type { UserCreateRequest } from '@/application/ports/identity/IdentityApi'
import type { ClientPlatform } from '@/domain/identity/ClientDevice'
import { useIdentityApi } from '@/presentation/app/identity/useIdentityApi'
import { useIdentityAuth } from '@/presentation/app/identity/useIdentityAuth'
import { usePlatform } from '@/presentation/app/usePlatform'
import css from './index.module.scss'

const NICKNAME_KEY = 'vaurenith.nickname'

export function CreateUserPage() {
  const { t } = useTranslation('presentation')
  const platform = usePlatform()
  const identityApi = useIdentityApi()
  const identityAuth = useIdentityAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const authorizationStarted = useRef(false)

  useEffect(() => {
    if (authorizationStarted.current) return
    authorizationStarted.current = true

    void identityAuth
      .completeAuthorization()
      .then(async (authorization) => {
        if (!authorization) return
        const token = identityAuth.getAccessToken()
        if (!token) throw new Error('OIDC access token is missing')
        if (authorization.mode === 'register') {
          if (!authorization.email || !authorization.displayName) {
            throw new Error('OIDC registration details are missing')
          }
          const clientInfo = await platform.getClientInfo()
          const platformType = getPlatformType(clientInfo.operatingSystem)
          const request: UserCreateRequest = {
            email: authorization.email,
            displayName: authorization.displayName,
            deviceName: createDeviceName(platformType),
            platform: platformType,
          }
          const response = await identityApi.createUser(token, request)
          if (!response.data?.nickname) throw new Error('Backend user profile is missing its nickname')
          localStorage.setItem(NICKNAME_KEY, response.data.nickname)
        } else {
          if (!authorization.email) throw new Error('OIDC email is missing')
          const clientInfo = await platform.getClientInfo()
          const platformType = getPlatformType(clientInfo.operatingSystem)
          const device = {
            name: createDeviceName(platformType),
            platform: platformType,
          }
          let nickname: string | undefined

          try {
            await identityApi.registerDevice(token, device)
          } catch (cause) {
            if (!isApiStatus(cause, 404) || !authorization.displayName) throw cause
            const response = await identityApi.createUser(token, {
              email: authorization.email,
              displayName: authorization.displayName,
              deviceName: device.name,
              platform: device.platform,
            })
            nickname = response.data?.nickname
          }

          if (!nickname) {
            const response = await identityApi.getCurrentUser(token)
            nickname = response.data?.nickname
          }
          if (!nickname) throw new Error('Backend user profile is missing its nickname')
          localStorage.setItem(NICKNAME_KEY, nickname)
        }
        window.location.reload()
      })
      .catch((cause: unknown) => {
        setError(
          cause instanceof Error && cause.message
            ? t('registration.oidcErrorDetails', { reason: cause.message })
            : t('registration.oidcError')
        )
      })
  }, [identityApi, identityAuth, platform, t])

  const authorize = async (mode: 'register' | 'login') => {
    setError(null)
    setIsSubmitting(true)
    try {
      await identityAuth.authorize(mode)
    } catch (cause) {
      setError(
        cause instanceof Error && cause.message
          ? t('registration.oidcErrorDetails', { reason: cause.message })
          : t('registration.oidcError')
      )
      setIsSubmitting(false)
    }
  }

  return (
    <main className={css.page}>
      <Container size={440}>
        <Paper className={css.card} withBorder p="xl" radius="lg">
          <Title order={1} className={css.title}>
            {t('registration.title')}
          </Title>
          <Stack gap="md">
            {error && <Alert color="red">{error}</Alert>}
            <Button fullWidth disabled={isSubmitting} onClick={() => void authorize('register')}>
              {t('registration.createAccount')}
            </Button>
            <Button fullWidth variant="default" disabled={isSubmitting} onClick={() => void authorize('login')}>
              {t('registration.signIn')}
            </Button>
          </Stack>
        </Paper>
      </Container>
    </main>
  )
}

function getPlatformType(operatingSystem: string): ClientPlatform {
  switch (operatingSystem.toLowerCase()) {
    case 'macos':
    case 'darwin':
      return 'macos'
    case 'windows':
    case 'win32':
      return 'windows'
    case 'linux':
    case 'x11':
      return 'linux'
    case 'ios':
    case 'iphone':
    case 'ipad':
      return 'ios'
    case 'android':
      return 'android'
    default:
      return 'other'
  }
}

function createDeviceName(platform: ClientPlatform): string {
  const names: Record<ClientPlatform, string> = {
    macos: 'macOS',
    windows: 'Windows',
    linux: 'Linux',
    ios: 'iOS',
    android: 'Android',
    other: 'Device',
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const randomBytes = crypto.getRandomValues(new Uint8Array(4))
  const suffix = Array.from(randomBytes, (value) => alphabet[value % alphabet.length]).join('')

  return `${names[platform]} ${suffix}`
}

function isApiStatus(error: unknown, statusCode: number): boolean {
  return error instanceof Error && 'statusCode' in error && error.statusCode === statusCode
}
